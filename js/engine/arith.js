// Basic arithmetic the way the HP-45 does it: in decimal digits, with
// nothing but an adder and a shifter.
//
//   +  −  align the decimal points (shift the smaller number), then add or
//         subtract digit by digit with carry, normalise, round to 10 digits
//   ×     long multiplication: for every digit of the multiplier, add the
//         multiplicand that many times, shifted to the right place
//   ÷     long division: subtract the divisor as often as possible, count –
//         that count is the next digit of the quotient (pseudo-division!)
//
// Numbers are split into a 10-digit mantissa (as BigInt, 1000000000 … 9999999999)
// and a decimal exponent. GUARD extra digits are kept while adding.

import { round10 } from './decimal.js';
import { CalcError } from './functions.js';

const GUARD = 3;
const P10 = (n) => 10n ** BigInt(n);

/** split a number into sign, 10-digit mantissa and exponent */
export function split(x) {
  if (x === 0) return { neg: false, m: 0n, e: 0 };
  const [mant, exp] = round10(Math.abs(x)).toExponential(9).split('e');
  return { neg: x < 0, m: BigInt(mant.replace('.', '')), e: parseInt(exp, 10) };
}

/** mantissa digits as a string with the decimal point after the first digit */
const show = (m, digits = 10) => {
  const s = m.toString().padStart(digits, '0');
  return `${s[0]}.${s.slice(1)}`;
};

/** round a non-negative BigInt with `digits` digits to 10 significant digits; returns {m, carry} */
function round10big(m, digits) {
  if (digits <= 10) return { m: m * P10(10 - digits), carry: 0 };
  const drop = digits - 10;
  let r = m / P10(drop);
  const rest = m % P10(drop);
  if (rest * 2n >= P10(drop)) r += 1n; // round half up, like the HP
  if (r >= P10(10)) return { m: r / 10n, carry: 1 };
  return { m: r, carry: 0 };
}

function toNumber(neg, m, e) {
  if (m === 0n) return 0;
  const s = m.toString();
  return parseFloat(`${neg ? '-' : ''}${s[0]}.${s.slice(1)}e${e}`);
}

const digitsOf = (m) => (m === 0n ? 1 : m.toString().length);

/** x + y (use add(x, −y) for subtraction) */
export function add(a, b, trace, op = 'add') {
  const T = trace ? (s) => trace.push(s) : undefined;
  let A = split(a);
  let B = split(b);
  if (B.m === 0n || A.m === 0n) {
    const r = A.m === 0n ? b : a;
    T?.({ algo: 'add', phase: 'final', op, regs: {}, result: round10(r), msg: ['add.zero'] });
    return round10(r);
  }
  // the number with the larger exponent goes on top
  let swapped = false;
  if (B.e > A.e || (B.e === A.e && B.m > A.m)) {
    [A, B] = [B, A];
    swapped = true;
  }
  const d = A.e - B.e;
  // Shift the smaller number right by d digits. Up to 20 places nothing is
  // lost (extra digit places); beyond that it can only affect rounding.
  const exact = d <= 20;
  const W = exact ? 10 + Math.max(d, GUARD) : 10 + GUARD; // working width in digits
  const am = A.m * P10(W - 10);
  const bm = exact ? B.m * P10(W - 10 - d) : (B.m * P10(GUARD)) / P10(d);
  T?.({ algo: 'add', phase: 'align', op, x: a, y: b, d, swapped, regs: { A: show(am, W), B: show(bm, W) }, eA: A.e, eB: B.e, msg: ['add.align', { d, e: A.e }] });
  // digit by digit from the right, with carry or borrow
  const sub = A.neg !== B.neg;
  const ad = am.toString().padStart(W, '0').split('').map(Number);
  const bd = bm.toString().padStart(W, '0').split('').map(Number);
  const rd = new Array(W).fill(0);
  let carry = 0;
  for (let k = W - 1; k >= 0; k--) {
    let v = sub ? ad[k] - bd[k] - carry : ad[k] + bd[k] + carry;
    if (sub) {
      carry = v < 0 ? 1 : 0;
      if (v < 0) v += 10;
    } else {
      carry = v >= 10 ? 1 : 0;
      if (v >= 10) v -= 10;
    }
    rd[k] = v;
    T?.({ algo: 'add', phase: 'col', op, sub, col: k, a: ad[k], b: bd[k], v, carry, regs: { A: show(am, W), B: show(bm, W), S: show(BigInt(rd.join('')), W) }, msg: [sub ? 'add.digit.sub' : 'add.digit', { a: ad[k], b: bd[k], v, c: carry }] });
  }
  let r = BigInt(rd.join(''));
  let e = A.e;
  if (carry && !sub) {
    // overflow of the top digit: one more digit in front
    r += P10(W);
    e += 1;
  }
  if (r === 0n) {
    T?.({ algo: 'add', phase: 'final', op, regs: { S: '0' }, result: 0, msg: ['add.final', {}] });
    return 0;
  }
  // normalise: no leading zeros (after subtraction), then round to 10 digits
  let len = digitsOf(r);
  const width = carry && !sub ? W + 1 : W;
  e -= width - len;
  const { m, carry: c2 } = round10big(r, len);
  e += c2;
  const result = toNumber(A.neg, m, e);
  T?.({ algo: 'add', phase: 'round', op, shift: width - len, regs: { S: show(m) }, e, msg: ['add.norm', { k: width - len }] });
  T?.({ algo: 'add', phase: 'final', op, regs: { S: show(m) }, e, result, msg: ['add.final', {}] });
  void len;
  return result;
}

export const sub = (a, b, trace) => add(a, -b, trace, 'sub');

/** x × y: long multiplication with repeated additions */
export function mul(a, b, trace, op = 'mul') {
  const T = trace ? (s) => trace.push(s) : undefined;
  const A = split(a);
  const B = split(b);
  if (A.m === 0n || B.m === 0n) {
    T?.({ algo: 'mul', phase: 'final', op, regs: {}, result: 0, msg: ['mul.zero'] });
    return 0;
  }
  T?.({ algo: 'mul', phase: 'exp', op, x: a, y: b, regs: { A: show(A.m), B: show(B.m) }, eA: A.e, eB: B.e, msg: ['mul.exp', { ea: A.e, eb: B.e, e: A.e + B.e }] });
  const bd = B.m.toString().split('').map(Number); // 10 digits, most significant first
  let acc = 0n;
  let adds = 0;
  for (let i = 0; i < 10; i++) {
    const digit = bd[9 - i]; // from the last digit to the first
    for (let k = 0; k < digit; k++) acc += A.m * P10(i);
    adds += digit;
    // pos: how many places right of the decimal point this digit sits (4.5 → the 5 is at pos 1)
    const pos = 9 - i;
    T?.({ algo: 'mul', phase: 'mdigit', op, i, pos, digit, adds, regs: { A: show(A.m), B: show(B.m), P: acc.toString() }, msg: ['mul.digit', { i, pos, d: digit, n: adds }] });
  }
  let e = A.e + B.e;
  const len = digitsOf(acc); // 19 or 20 digits
  if (len === 20) e += 1;
  const { m, carry } = round10big(acc, len);
  e += carry;
  const neg = A.neg !== B.neg;
  const result = toNumber(neg, m, e);
  T?.({ algo: 'mul', phase: 'final', op, adds, regs: { P: show(m) }, e, result, msg: ['mul.final', { n: adds }] });
  return result;
}

/** x ÷ y: long division – subtract and count, digit by digit */
export function div(a, b, trace, op = 'div') {
  const T = trace ? (s) => trace.push(s) : undefined;
  const A = split(a);
  const B = split(b);
  if (B.m === 0n) throw new CalcError('div0');
  if (A.m === 0n) {
    T?.({ algo: 'div', phase: 'final', op, regs: {}, result: 0, msg: ['div.zero'] });
    return 0;
  }
  let e = A.e - B.e;
  let R = A.m;
  if (R < B.m) {
    // the divisor does not fit even once: shift the dividend one place
    R *= 10n;
    e -= 1;
  }
  T?.({ algo: 'div', phase: 'exp', op, x: a, y: b, regs: { R: R.toString(), B: B.m.toString() }, eA: A.e, eB: B.e, msg: ['div.exp', { ea: A.e, eb: B.e, e }] });
  let q = 0n;
  let subs = 0;
  const N = 11; // one digit more than needed, for rounding
  for (let k = 0; k < N; k++) {
    const before = R;
    let digit = 0;
    while (R >= B.m) {
      R -= B.m;
      digit++;
    }
    subs += digit + 1; // the last try goes below zero and is undone
    q = q * 10n + BigInt(digit);
    T?.({ algo: 'div', phase: 'qdigit', op, k, digit, subs, before: before.toString(), after: R.toString(), regs: { R: R.toString(), B: B.m.toString(), Q: q.toString() }, msg: ['div.digit', { k: k + 1, d: digit }] });
    R *= 10n; // shift: bring down the next zero
  }
  const { m, carry } = round10big(q, N);
  e += carry;
  const neg = A.neg !== B.neg;
  const result = toNumber(neg, m, e);
  T?.({ algo: 'div', phase: 'final', op, subs, regs: { Q: show(m) }, e, result, msg: ['div.final', { n: subs }] });
  return result;
}

// Decimal fixed-point arithmetic on BigInt.
//
// The HP-45 computes in BCD (binary coded decimal): every register holds
// decimal digits, and a "shift" moves the digits one place – i.e. it
// multiplies or divides by exactly 10. We mimic that with BigInt values that
// carry F decimal places. A right shift by j places is an exact decimal
// truncation, just like in the original hardware.

/** Number of fractional decimal digits used internally. */
export const F = 20;
/** Scale factor: the fixed-point value 1.0 */
export const S = 10n ** BigInt(F);

const POW10 = [];
for (let i = 0; i <= 2 * F + 4; i++) POW10.push(10n ** BigInt(i));

/** 10^n as BigInt */
export function pow10(n) {
  return n < POW10.length ? POW10[n] : 10n ** BigInt(n);
}

/**
 * Parse a decimal string ("0.785", "-12", "1.5e-7") into fixed point.
 * Extra digits are truncated (like a register that is too short).
 * @param {string} str
 * @param {number} [scaleExp=0] additional power of ten to apply (exact)
 */
export function fx(str, scaleExp = 0) {
  const m = /^([+-]?)(\d*)(?:\.(\d*))?(?:e([+-]?\d+))?$/i.exec(String(str).trim());
  if (!m) throw new Error(`bad decimal: ${str}`);
  const neg = m[1] === '-';
  const intPart = m[2] || '';
  const fracPart = m[3] || '';
  const exp = (m[4] ? parseInt(m[4], 10) : 0) + scaleExp;
  const digits = (intPart + fracPart).replace(/^0+(?=\d)/, '') || '0';
  // value = digits * 10^(exp - fracPart.length)
  const shift = F + exp - fracPart.length;
  let v = BigInt(digits);
  v = shift >= 0 ? v * pow10(shift) : v / pow10(-shift);
  return neg ? -v : v;
}

/** Round a JS number to the calculator's 10 significant digits. */
export function round10(x) {
  if (!isFinite(x) || x === 0) return x === 0 ? 0 : x;
  return Number(x.toPrecision(10));
}

/** Convert a JS number (rounded to 10 digits) into fixed point. */
export function fromNumber(x, scaleExp = 0) {
  if (x === 0) return 0n;
  return fx(round10(x).toExponential(9), scaleExp);
}

/** Decimal exponent e with 1 <= |x|/10^e < 10 */
export function decExponent(x) {
  if (x === 0) return 0;
  return parseInt(round10(Math.abs(x)).toExponential(9).split('e')[1], 10);
}

/** Convert fixed point back to a JS number, optionally scaled by 10^scaleExp. */
export function toNumber(v, scaleExp = 0) {
  const neg = v < 0n;
  const s = (neg ? -v : v).toString().padStart(F + 1, '0');
  const str = `${neg ? '-' : ''}${s.slice(0, -F)}.${s.slice(-F)}e${scaleExp}`;
  return parseFloat(str);
}

/** Exact decimal right shift by j places (truncating), as in the BCD hardware. */
export function shr(v, j) {
  return j === 0 ? v : v / pow10(j);
}

export function mul(a, b) {
  return (a * b) / S;
}

export function div(a, b) {
  if (b === 0n) throw new RangeError('division by zero');
  return (a * S) / b;
}

export function abs(v) {
  return v < 0n ? -v : v;
}

/**
 * Format a fixed-point value as a digit string for register displays.
 * @param {bigint} v
 * @param {number} [frac=15] number of fractional digits to show
 */
export function fmtFixed(v, frac = 15) {
  const neg = v < 0n;
  const s = (neg ? -v : v).toString().padStart(F + 1, '0');
  const int = s.slice(0, -F);
  const f = s.slice(-F, -F + frac || undefined);
  return `${neg ? '-' : ''}${int}.${f}`;
}

/**
 * Digit-by-digit square root, the way the HP-35/45 does it: for each result
 * digit the calculator subtracts the odd numbers 20r+1, 20r+3, 20r+5 … from
 * the remainder and counts how often that works. No multiplication needed.
 * @param {bigint} v fixed-point radicand (>= 0)
 * @param {(step: object) => void} [T] optional trace callback
 * @returns {bigint} fixed-point square root
 */
export function sqrtFixed(v, T) {
  if (v < 0n) throw new RangeError('sqrt of negative');
  if (v === 0n) return 0n;
  const N = v * S; // sqrt(v*S) = sqrt(v/S)*S
  let s = N.toString();
  if (s.length % 2) s = '0' + s;
  const intPairs = Math.max(0, s.length / 2 - F); // pairs before the decimal point of N/S^2
  let rem = 0n;
  let root = 0n;
  let digitIndex = 0;
  for (let i = 0; i < s.length; i += 2) {
    rem = rem * 100n + BigInt(s.slice(i, i + 2));
    let odd = root * 20n + 1n;
    let d = 0;
    while (rem >= odd) {
      rem -= odd;
      odd += 2n;
      d++;
    }
    root = root * 10n + BigInt(d);
    if (T && (root > 0n)) {
      T({
        algo: 'sqrt',
        phase: 'digit',
        k: digitIndex,
        digit: d,
        subtractions: d,
        // partial results are raw digit strings (the decimal point is placed at the end)
        regs: { root: root.toString(), rem: rem.toString() },
        intPairs,
        msg: ['sqrt.digit', { k: digitIndex + 1, d }],
      });
      digitIndex++;
    }
  }
  return root;
}

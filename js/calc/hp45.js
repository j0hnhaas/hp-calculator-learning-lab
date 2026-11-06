// HP-45 calculator logic: RPN stack, number entry, prefix keys, display
// formatting. Transcendental functions are delegated to the decimal CORDIC
// engine; each such call hands its micro-step trace to the lab.

import * as fn from '../engine/functions.js';
import { CalcError } from '../engine/functions.js';
import { round10 } from '../engine/decimal.js';
import * as arith from '../engine/arith.js';
import { ALL_KEYS } from './keys.js';

const MAX = 9.999999999e99;
const DIGIT = { d0: 0, d1: 1, d2: 2, d3: 3, d4: 4, d5: 5, d6: 6, d7: 7, d8: 8, d9: 9 };
const GOLD = Object.fromEntries(ALL_KEYS.filter((k) => k.gid).map((k) => [k.id, k.gid]));

/** Keep a result inside the calculator's range: 10 digits, |x| < 10^100 */
function clamp(x) {
  if (Number.isNaN(x)) throw new CalcError('nan');
  if (!isFinite(x) || Math.abs(x) > MAX) return x < 0 ? -MAX : MAX;
  if (Math.abs(x) < 1e-99) return 0;
  return round10(x) || 0; // also turns −0 into 0
}

export class HP45 {
  /** @param {35|45} model the HP-35 (1972) or the HP-45 (1973) */
  constructor(model = 45) {
    this.model = model;
    this.reset();
  }

  setModel(model) {
    this.model = model;
    this.reset();
  }

  reset() {
    this.arc = false; // HP-35: the arc prefix key
    this.stack = [0, 0, 0, 0]; // x, y, z, t
    this.lastX = 0;
    this.regs = new Array(10).fill(0); // R1 … R9 (index 0 unused)
    this.angle = 'DEG';
    this.dispMode = 'FIX';
    this.dispDigits = 2; // HP-45 powers up in FIX 2
    this.shift = false;
    this.pending = null; // {type:'sto'|'rcl'|'fix'|'sci', op?}
    this.entry = null; // {mant:'', point:bool, neg:bool, eex:bool, exp:'00', expNeg:bool}
    this.lift = true;
    this.error = false;
    this.tempFix = null; // →D.MS shows FIX 4 until the next key
  }

  get x() {
    return this.stack[0];
  }

  set x(v) {
    this.stack[0] = v;
  }

  push(v) {
    const s = this.stack;
    s[3] = s[2];
    s[2] = s[1];
    s[1] = s[0];
    s[0] = v;
  }

  drop() {
    const s = this.stack;
    s[1] = s[2];
    s[2] = s[3];
  }

  /** Finish digit entry and move the typed number into X. */
  terminate() {
    if (!this.entry) return;
    const e = this.entry;
    const m = e.mant === '' ? '0' : e.mant;
    let v = parseFloat(`${e.neg ? '-' : ''}${m}e${e.expNeg ? '-' : ''}${e.exp}`);
    if (!isFinite(v) || Math.abs(v) > MAX) v = v < 0 ? -MAX : MAX;
    this.x = clamp(v);
    this.entry = null;
  }

  /** Push a constant / recalled value respecting stack lift. */
  recall(v) {
    this.terminate();
    if (this.lift) this.push(v);
    else this.x = v;
    this.lift = true;
  }

  unary(f) {
    this.terminate();
    const x = this.x;
    const r = clamp(f(x));
    this.lastX = x;
    this.x = r;
    this.lift = true;
  }

  binary(f) {
    this.terminate();
    const [x, y] = this.stack;
    const r = clamp(f(y, x));
    this.lastX = x;
    this.drop();
    this.x = r;
    this.lift = true;
  }

  /**
   * Press a key.
   * @param {string} id key id from keys.js
   * @returns {{busy:number, trace?:object}} busy = simulated execution time (ms)
   */
  press(id) {
    this.tempFix = null;
    if (this.error) {
      // any key clears the error display (HP-35: stops the blinking)
      this.error = false;
      if (id !== 'clx') return { busy: 0 };
    }
    if (this.model === 35) return this.press35(id);
    if (id === 'shift') {
      this.shift = !this.shift;
      return { busy: 0 };
    }
    const shifted = this.shift;
    this.shift = false;
    const op = shifted && GOLD[id] ? GOLD[id] : id;
    try {
      if (this.pending) return this.handlePending(op, id, shifted);
      return this.exec(op) || { busy: 0 };
    } catch (err) {
      if (!(err instanceof CalcError)) throw err;
      this.entry = null;
      this.error = true;
      return { busy: 120 };
    }
  }

  /**
   * HP-35: no shift key. ARC is a prefix for SIN/COS/TAN, STO/RCL use the
   * single storage register, x^y takes the base from X (exponent ENTER base x^y),
   * angles are always in degrees.
   */
  press35(id) {
    const arc = this.arc;
    this.arc = false;
    this.angle = 'DEG';
    try {
      if (id === 'arc') {
        this.arc = !arc;
        return { busy: 0 };
      }
      if (arc && ['sin', 'cos', 'tan'].includes(id)) return this.exec('a' + id) || { busy: 0 };
      switch (id) {
        case 'sto':
          this.terminate();
          this.regs[1] = this.x;
          this.lift = true;
          return { busy: 30 };
        case 'rcl':
          this.recall(this.regs[1]);
          return { busy: 30 };
        case 'clr':
          this.entry = null;
          this.stack = [0, 0, 0, 0];
          this.lift = false;
          return { busy: 0 };
        case 'pow35': {
          this.terminate();
          const [x, y] = this.stack;
          const r = this.traced('pow35', [x, y], (t) => fn.pow(x, y, t));
          this.binary(() => r.trace.result);
          return r;
        }
        default:
          return this.exec(id) || { busy: 0 };
      }
    } catch (err) {
      if (!(err instanceof CalcError)) throw err;
      this.entry = null;
      this.error = true;
      return { busy: 120 };
    }
  }

  handlePending(op, id, shifted) {
    const p = this.pending;
    const d = DIGIT[id];
    if (p.type === 'fix' || p.type === 'sci') {
      this.pending = null;
      if (d !== undefined && !shifted) {
        this.dispMode = p.type === 'fix' ? 'FIX' : 'SCI';
        this.dispDigits = d;
        return { busy: 0 };
      }
      return this.press(id); // anything else: cancel prefix, execute key
    }
    if (p.type === 'sto' && !p.op && ['add', 'sub', 'mul', 'div'].includes(id) && !shifted) {
      p.op = id;
      return { busy: 0 };
    }
    if (op === 'sigma' && !shifted) {
      // STO Σ+ = Σ+,  RCL Σ+ recalls Σx and Σy
      this.pending = null;
      if (p.type === 'sto') return this.exec('sigma');
      this.terminate();
      if (this.lift) this.push(this.regs[8]);
      else this.x = this.regs[8];
      this.push(this.regs[7]);
      this.lift = true;
      return { busy: 60 };
    }
    this.pending = null;
    if (d === undefined || d === 0 || shifted) return { busy: 0 }; // invalid → ignore
    if (p.type === 'rcl') {
      this.recall(this.regs[d]);
      return { busy: 30 };
    }
    // STO (with optional register arithmetic)
    this.terminate();
    const x = this.x;
    const r = this.regs[d];
    const v = { add: r + x, sub: r - x, mul: r * x, div: x === 0 ? NaN : r / x }[p.op] ?? x;
    if (Number.isNaN(v)) throw new CalcError('div0');
    this.regs[d] = clamp(v);
    this.lift = true;
    return { busy: 30 };
  }

  /** Run a transcendental function and capture its CORDIC trace. */
  traced(label, args, compute) {
    const steps = [];
    const result = compute(steps);
    return {
      busy: Math.min(1400, 60 + steps.length * 4),
      trace: { label, args, steps, result, angle: this.angle },
    };
  }

  exec(op) {
    const d = DIGIT[op];
    if (d !== undefined) return this.digit(String(d));
    const A = this.angle;
    switch (op) {
      case 'dot': {
        this.startEntry();
        if (!this.entry.eex && !this.entry.point) {
          this.entry.point = true;
          if (this.entry.mant === '') this.entry.mant = '0';
          this.entry.mant += '.';
        }
        return;
      }
      case 'eex': {
        this.startEntry();
        if (!this.entry.eex) {
          if (this.entry.mant === '' || /^0?\.?0*$/.test(this.entry.mant)) this.entry.mant = '1';
          this.entry.eex = true;
        }
        return;
      }
      case 'chs': {
        if (this.entry) {
          if (this.entry.eex) this.entry.expNeg = !this.entry.expNeg;
          else this.entry.neg = !this.entry.neg;
        } else {
          this.x = this.x === 0 ? 0 : -this.x;
        }
        return;
      }
      case 'enter':
        this.terminate();
        this.push(this.x);
        this.lift = false;
        return { busy: 30 };
      case 'clx':
        this.entry = null;
        this.x = 0;
        this.lift = false;
        return;
      case 'clear':
        this.entry = null;
        this.stack = [0, 0, 0, 0];
        for (let i = 5; i <= 8; i++) this.regs[i] = 0;
        this.lift = false;
        return;
      case 'swap': {
        this.terminate();
        const s = this.stack;
        [s[0], s[1]] = [s[1], s[0]];
        this.lift = true;
        return;
      }
      case 'rdn': {
        this.terminate();
        const s = this.stack;
        this.stack = [s[1], s[2], s[3], s[0]];
        this.lift = true;
        return;
      }
      case 'sto':
      case 'rcl':
        this.terminate();
        this.pending = { type: op };
        return;
      case 'fix':
      case 'sci':
        this.pending = { type: op };
        return;
      case 'deg':
      case 'rad':
      case 'grd':
        this.terminate();
        this.angle = op.toUpperCase();
        this.lift = true;
        return;
      // basic arithmetic: decimal (BCD) long arithmetic with a trace for the lab
      case 'add':
      case 'sub':
      case 'mul':
      case 'div': {
        this.terminate();
        const [x, y] = this.stack;
        const f = { add: arith.add, sub: arith.sub, mul: arith.mul, div: arith.div }[op];
        const r = this.traced(op, [y, x], (t) => f(y, x, t));
        this.binary(() => r.trace.result);
        r.busy = Math.min(r.busy, op === 'add' || op === 'sub' ? 50 : 110);
        return r;
      }
      case 'inv': {
        this.terminate();
        const x = this.x;
        const r = this.traced('inv', [x], (t) => arith.div(1, x, t, 'inv'));
        this.unary(() => r.trace.result);
        r.busy = Math.min(r.busy, 110);
        return r;
      }
      case 'sq': {
        this.terminate();
        const x = this.x;
        const r = this.traced('sq', [x], (t) => arith.mul(x, x, t, 'sq'));
        this.unary(() => r.trace.result);
        r.busy = Math.min(r.busy, 110);
        return r;
      }
      case 'pct': {
        // x % of y: y × x, then ÷ 100 is just shifting the decimal point by two places
        this.terminate();
        const [x, y] = this.stack;
        const r = this.traced('pct', [y, x], (t) => {
          const p = arith.mul(y, x, t, 'pct');
          return round10(p / 100);
        });
        this.lastX = x;
        this.x = clamp(r.trace.result);
        this.lift = true;
        r.busy = Math.min(r.busy, 110);
        return r;
      }
      case 'dpct': {
        this.terminate();
        const y = this.stack[1];
        if (y === 0) throw new CalcError('div0');
        this.lastX = this.x;
        this.x = clamp(((this.x - y) / y) * 100);
        this.lift = true;
        return { busy: 100 };
      }
      case 'fact':
        this.unary((x) => {
          if (x < 0 || x !== Math.floor(x) || x > 69) throw new CalcError('domain');
          let r = 1;
          for (let i = 2; i <= x; i++) r *= i;
          return r;
        });
        return { busy: 40 + 8 * Math.min(69, Math.abs(this.x)) };
      case 'lastx':
        this.recall(this.lastX);
        return;
      case 'pi':
        this.recall(3.141592654);
        return;
      case 'cmin':
        this.recall(2.54);
        return;
      case 'kglb':
        this.recall(0.45359237);
        return;
      case 'ltrgal':
        this.recall(3.785411784);
        return;
      case 'toDMS': {
        this.unary((x) => {
          const neg = x < 0;
          let a = Math.abs(x);
          let h = Math.floor(a);
          let m = Math.floor((a - h) * 60 + 1e-9);
          let s = (a - h - m / 60) * 3600;
          s = Math.round(s * 1e6) / 1e6;
          if (s >= 60) { s -= 60; m += 1; }
          if (m >= 60) { m -= 60; h += 1; }
          const r = h + m / 100 + s / 10000;
          return neg ? -r : r;
        });
        this.tempFix = 4;
        return { busy: 150 };
      }
      case 'fromDMS':
        this.unary((x) => {
          const neg = x < 0;
          const a = Math.abs(x);
          const h = Math.floor(a);
          const m = Math.floor(round10((a - h) * 100));
          const s = round10(((a - h) * 100 - m) * 100);
          const r = h + m / 60 + s / 3600;
          return neg ? -r : r;
        });
        return { busy: 150 };
      case 'sigma':
      case 'sigmaMinus': {
        this.terminate();
        const sign = op === 'sigma' ? 1 : -1;
        const [x, y] = this.stack;
        const R = this.regs;
        R[5] = clamp(R[5] + sign);
        R[6] = clamp(R[6] + sign * x * x);
        R[7] = clamp(R[7] + sign * x);
        R[8] = clamp(R[8] + sign * y);
        this.lastX = x;
        this.x = R[5];
        this.lift = false;
        return { busy: 120 };
      }
      case 'mean': {
        this.terminate();
        const [n, sx2, sx] = [this.regs[5], this.regs[6], this.regs[7]];
        if (n === 0) throw new CalcError('stat');
        const mean = sx / n;
        const s = n > 1 ? Math.sqrt(Math.max(0, (n * sx2 - sx * sx) / (n * (n - 1)))) : 0;
        if (this.lift) this.push(clamp(s));
        else this.x = clamp(s);
        this.push(clamp(mean));
        this.lift = true;
        return { busy: 250 };
      }

      // ---- transcendental functions: decimal CORDIC ----
      case 'sin':
      case 'cos':
      case 'tan': {
        this.terminate();
        const x = this.x;
        const r = this.traced(op, [x], (t) => fn.trig(op, x, A, t));
        this.unary(() => r.trace.result);
        this.trashR9(x);
        return r;
      }
      case 'asin':
      case 'acos':
      case 'atan': {
        this.terminate();
        const x = this.x;
        const r = this.traced(op, [x], (t) => fn[op](x, A, t));
        this.unary(() => r.trace.result);
        this.trashR9(x);
        return r;
      }
      case 'ln':
      case 'log':
      case 'exp':
      case 'exp10':
      case 'sqrt': {
        this.terminate();
        const x = this.x;
        const r = this.traced(op, [x], (t) => fn[op](x, t));
        this.unary(() => r.trace.result);
        return r;
      }
      case 'pow': {
        this.terminate();
        const [x, y] = this.stack;
        const r = this.traced('pow', [y, x], (t) => fn.pow(y, x, t));
        this.binary(() => r.trace.result);
        return r;
      }
      case 'toP': {
        this.terminate();
        const [x, y] = this.stack;
        let res;
        const r = this.traced('toP', [x, y], (t) => {
          res = fn.toPolar(x, y, A, t);
          return res.theta;
        });
        r.trace.resultText = `r = ${clamp(res.r)}, θ = ${clamp(res.theta)}`;
        this.lastX = x;
        this.stack[0] = clamp(res.r);
        this.stack[1] = clamp(res.theta);
        this.lift = true;
        this.trashR9(x);
        return r;
      }
      case 'toR': {
        this.terminate();
        const [rr, th] = this.stack;
        let res;
        const r = this.traced('toR', [rr, th], (t) => {
          res = fn.toRect(rr, th, A, t);
          return res.y;
        });
        r.trace.resultText = `x = ${clamp(res.x)}, y = ${clamp(res.y)}`;
        this.lastX = rr;
        this.stack[0] = clamp(res.x);
        this.stack[1] = clamp(res.y);
        this.lift = true;
        this.trashR9(rr);
        return r;
      }
      default:
        return;
    }
  }

  /** Authentic quirk: trig functions use R9 as scratch register. */
  trashR9(x) {
    this.regs[9] = clamp(x / 57.29577951);
  }

  startEntry() {
    if (this.entry) return;
    if (this.lift) this.push(this.x);
    this.entry = { mant: '', point: false, neg: false, eex: false, exp: '00', expNeg: false };
    this.lift = true;
  }

  digit(ch) {
    this.startEntry();
    const e = this.entry;
    if (e.eex) {
      e.exp = (e.exp + ch).slice(-2);
      return;
    }
    if (e.mant.replace(/[^0-9]/g, '').length >= 10) return;
    if (e.mant === '0') e.mant = '';
    e.mant += ch;
  }

  /**
   * 15 display cells: [sign][11 mantissa cells incl. the decimal point][exp sign][2 exp digits]
   * @returns {string} exactly 15 characters
   */
  displayString() {
    if (this.model === 35) {
      // the HP-35 has no "Error" message – the display blinks instead (see UI)
      if (this.entry) return this.entryString();
      return formatAuto(this.x);
    }
    if (this.error) return ' Error'.padEnd(15, ' ');
    if (this.entry) return this.entryString();
    const mode = this.tempFix !== null ? 'FIX' : this.dispMode;
    const digits = this.tempFix !== null ? this.tempFix : this.dispDigits;
    return formatNumber(this.x, mode, digits);
  }

  entryString() {
    const e = this.entry;
    let m = e.mant === '' ? '0' : e.mant;
    if (!e.point) m += '.';
    const sign = e.neg ? '-' : ' ';
    if (!e.eex) return (sign + m).padEnd(15, ' ');
    return (sign + m.padEnd(11, ' ')).slice(0, 12) + (e.expNeg ? '-' : ' ') + e.exp;
  }
}

/**
 * Format a number the way the HP-45 does.
 * FIX n: fixed point, falls back to SCI when the number does not fit;
 *        very small numbers show as 0 (as on the original).
 * SCI n: d.ddd with a two-digit exponent.
 */
/**
 * HP-35 display: no FIX/SCI setting. Numbers from 10^-2 up to 10^10 are shown
 * in fixed point with the decimal point in place, all others in scientific
 * notation. Trailing zeros are not shown.
 */
export function formatAuto(x) {
  const sign = x < 0 ? '-' : ' ';
  const a = Math.abs(x);
  if (a === 0) return ' 0.'.padEnd(15, ' ');
  if (a >= 0.01 && a < 9999999999.5) {
    const intDigits = a < 1 ? 1 : Math.floor(Math.log10(a)) + 1;
    let n = Math.max(0, 10 - intDigits);
    let s = a.toFixed(n);
    while (s.replace('.', '').length > 10 && n > 0) s = a.toFixed(--n);
    if (s.includes('.')) s = s.replace(/0+$/, '');
    if (!s.includes('.')) s += '.';
    return (sign + s).padEnd(15, ' ');
  }
  const [m, e] = a.toExponential(9).split('e');
  let mant = m.replace(/0+$/, '');
  if (!mant.includes('.')) mant += '.';
  const exp = parseInt(e, 10);
  return (sign + mant).padEnd(12, ' ') + (exp < 0 ? '-' : ' ') + String(Math.abs(exp)).padStart(2, '0');
}

export function formatNumber(x, mode, digits) {
  const sign = x < 0 ? '-' : ' ';
  const a = Math.abs(x);
  if (mode === 'FIX' && a < 9999999999.5) {
    const intDigits = a < 1 ? 1 : Math.floor(Math.log10(a)) + 1;
    let n = Math.max(0, Math.min(digits, 10 - intDigits));
    let s = a.toFixed(n);
    // rounding can add a digit (9.999 → 10.00): drop one decimal then
    while (s.replace('.', '').length > 10 && n > 0) s = a.toFixed(--n);
    if (s.replace('.', '').length <= 10) {
      if (!s.includes('.')) s += '.';
      const neg = x < 0 && /[1-9]/.test(s);
      return ((neg ? '-' : ' ') + s).padEnd(15, ' ');
    }
  }
  const n = Math.min(digits, 9);
  const [m, e] = a.toExponential(n).split('e');
  let mant = m.includes('.') ? m : m + '.';
  let exp = parseInt(e, 10);
  if (a === 0) exp = 0;
  const expSign = exp < 0 ? '-' : ' ';
  const expDigits = String(Math.abs(exp)).padStart(2, '0');
  return (sign + mant).padEnd(12, ' ') + expSign + expDigits;
}

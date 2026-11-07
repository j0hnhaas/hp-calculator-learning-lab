// HP-45 calculator logic: RPN stack, number entry, prefix keys, display
// formatting. Transcendental functions are delegated to the decimal CORDIC
// engine; each such call hands its micro-step trace to the lab.

import * as fn from '../engine/functions.js';
import { CalcError } from '../engine/functions.js';
import { round10 } from '../engine/decimal.js';
import * as arith from '../engine/arith.js';
import * as extra from '../engine/extra.js';
import { ALL_KEYS, KEY_ROWS_55 } from './keys.js';

const MAX = 9.999999999e99;
const DIGIT = { d0: 0, d1: 1, d2: 2, d3: 3, d4: 4, d5: 5, d6: 6, d7: 7, d8: 8, d9: 9 };
const GOLD = Object.fromEntries(ALL_KEYS.filter((k) => k.gid).map((k) => [k.id, k.gid]));
const F55 = Object.fromEntries(KEY_ROWS_55.flat().filter((k) => k.gid).map((k) => [k.id, k.gid]));
const G55 = Object.fromEntries(KEY_ROWS_55.flat().filter((k) => k.bid).map((k) => [k.id, k.bid]));

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
    // HP-45: R1 … R9 (index 0 unused); HP-55: R0 … R9 and R.0 … R.9 (index 10 … 19)
    this.regs = new Array(this.model === 55 ? 20 : 10).fill(0);
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
    if (this.model === 55) return this.press55(id);
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

  /**
   * HP-55: two prefix keys, f (gold) and g (blue). Programming keys
   * (R/S, SST, GTO, x≤y, x=y) do nothing yet – that is part 2.
   */
  press55(id) {
    if (id === 'fkey' || id === 'gkey') {
      const want = id === 'fkey' ? 'f' : 'g';
      this.shift = this.shift === want ? false : want;
      return { busy: 0 };
    }
    const sh = this.shift;
    this.shift = false;
    if (id === 'bst' && !sh) {
      this.pending = null; // BST also clears a pending prefix
      return { busy: 0 };
    }
    const op = sh === 'f' ? F55[id] ?? id : sh === 'g' ? G55[id] ?? id : id;
    try {
      if (this.pending) return this.handlePending(op, id, !!sh);
      return this.exec55(op) || { busy: 0 };
    } catch (err) {
      if (!(err instanceof CalcError)) throw err;
      this.entry = null;
      this.error = true;
      return { busy: 120 };
    }
  }

  /** a recipe from extra.js with its trace for the lab */
  recipeOp(label, args, run) {
    let rec;
    const r = this.traced(label, args, (t) => {
      rec = run(t);
      return rec.result;
    });
    r.trace.recipe = rec.recipe;
    return { r, rec };
  }

  exec55(op) {
    const R = this.regs;
    if (extra.CONV55[op]) {
      this.terminate();
      const x = this.x;
      const { r, rec } = this.recipeOp(op, [x], (t) => extra.convert(op, x, t));
      r.trace.conv = rec.conv;
      this.unary(() => r.trace.result);
      return r;
    }
    switch (op) {
      case 'rs':
      case 'sst':
      case 'gto':
      case 'xle':
      case 'xeq':
        return { busy: 0 }; // programming: part 2
      case 'sigma55':
      case 'sigmaMinus55': {
        this.terminate();
        const [x, y] = this.stack;
        const { r } = this.recipeOp(op, [x, y], (t) => extra.sigma55(x, y, R, op === 'sigma55' ? 1 : -1, t));
        for (let i = 10; i <= 15; i++) R[i] = clamp(R[i]);
        this.lastX = x;
        this.x = R[10];
        this.lift = false;
        return r;
      }
      case 'mean55':
      case 'sdev55':
      case 'lr': {
        this.terminate();
        const f = { mean55: extra.means55, sdev55: extra.sdev55, lr: extra.linreg55 }[op];
        const { r, rec } = this.recipeOp(op, [R[10]], (t) => f(R, t));
        const names = { mean55: ['x̄', 'ȳ'], sdev55: ['sx', 'sy'], lr: ['a', 'b'] }[op];
        r.trace.resultText = `${names[0]} = ${clamp(rec.result)}, ${names[1]} = ${clamp(rec.y)}`;
        if (this.lift) this.push(clamp(rec.y));
        else this.x = clamp(rec.y);
        this.push(clamp(rec.result));
        this.lift = true;
        return r;
      }
      case 'yhat': {
        this.terminate();
        const x = this.x;
        const { r } = this.recipeOp('yhat', [x], (t) => extra.yhat55(x, R, t));
        this.unary(() => r.trace.result);
        return r;
      }
      case 'hmsAdd':
      case 'hmsSub': {
        this.terminate();
        const [x, y] = this.stack;
        const { r } = this.recipeOp(op, [y, x], (t) => extra.hmsAddSub(y, x, op === 'hmsAdd' ? 1 : -1, t));
        this.binary(() => r.trace.result);
        return r;
      }
      case 'clr55':
      case 'clrR': {
        this.entry = null;
        this.stack = [0, 0, 0, 0];
        const [from, to] = op === 'clr55' ? [0, 9] : [10, 19];
        for (let i = from; i <= to; i++) R[i] = 0;
        this.lift = false;
        return { busy: 0 };
      }
      default:
        return this.exec(op);
    }
  }

  handlePending(op, id, shifted) {
    const p = this.pending;
    const d = DIGIT[id];
    // HP-55: STO . 3 / RCL . 3 address the registers .0 … .9
    if (this.model === 55 && (p.type === 'sto' || p.type === 'rcl') && id === 'dot' && !shifted && !p.dot && !p.op) {
      p.dot = true;
      return { busy: 0 };
    }
    if (this.model === 55 && (p.type === 'sto' || p.type === 'rcl') && op === 'sigma55' && !shifted) {
      // STO Σ+ = Σ+,  RCL Σ+ recalls Σx and Σy
      this.pending = null;
      if (p.type === 'sto') return this.exec55('sigma55');
      this.recall(this.regs[13]);
      this.push(this.regs[11]);
      return { busy: 60 };
    }
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
    const minReg = this.model === 55 ? 0 : 1;
    if (d === undefined || d < minReg || shifted) return { busy: 0 }; // invalid → ignore
    const idx = p.dot ? 10 + d : d;
    if (p.type === 'rcl') {
      this.recall(this.regs[idx]);
      return { busy: 30 };
    }
    // STO (with optional register arithmetic – not for .0 … .9 on the HP-55)
    this.terminate();
    const x = this.x;
    const r = this.regs[idx];
    const v = { add: r + x, sub: r - x, mul: r * x, div: x === 0 ? NaN : r / x }[p.op] ?? x;
    if (Number.isNaN(v)) throw new CalcError('div0');
    this.regs[idx] = clamp(v);
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
        const [x, y] = this.stack;
        let rec;
        const r = this.traced('dpct', [y, x], (t) => {
          rec = extra.deltaPct(y, x, t);
          return rec.result;
        });
        r.trace.recipe = rec.recipe;
        this.lastX = x;
        this.x = clamp(r.trace.result);
        this.lift = true;
        return r;
      }
      case 'fact': {
        this.terminate();
        const x = this.x;
        let rec;
        const r = this.traced('fact', [x], (t) => {
          rec = extra.factorial(x, t);
          return rec.result;
        });
        r.trace.recipe = rec.recipe;
        this.unary(() => r.trace.result);
        return r;
      }
      case 'lastx':
        this.recall(this.lastX);
        return;
      case 'pi':
        this.recall(3.141592654);
        return;
      case 'cmin':
      case 'kglb':
      case 'ltrgal': {
        // a constant from the ROM; the trace explains it and its use
        this.terminate();
        const v = this.x;
        let rec;
        const r = this.traced(op, [v], (t) => {
          rec = extra.unitConst(op, v, t);
          return rec.result;
        });
        r.trace.recipe = rec.recipe;
        r.trace.noCost = true;
        this.recall(rec.result);
        r.busy = 30;
        return r;
      }
      case 'toDMS': {
        this.terminate();
        const x = this.x;
        let rec;
        const r = this.traced('toDMS', [x], (t) => {
          rec = extra.toDMS(x, t);
          return rec.result;
        });
        r.trace.recipe = rec.recipe;
        this.unary(() => r.trace.result);
        this.tempFix = 4;
        return r;
      }
      case 'fromDMS': {
        this.terminate();
        const x = this.x;
        let rec;
        const r = this.traced('fromDMS', [x], (t) => {
          rec = extra.fromDMS(x, t);
          return rec.result;
        });
        r.trace.recipe = rec.recipe;
        this.unary(() => r.trace.result);
        return r;
      }
      case 'sigma':
      case 'sigmaMinus': {
        this.terminate();
        const sign = op === 'sigma' ? 1 : -1;
        const [x, y] = this.stack;
        const R = this.regs;
        let rec;
        const r = this.traced(op, [x, y], (t) => {
          rec = extra.sigma(x, y, R, sign, t);
          return rec.result;
        });
        r.trace.recipe = rec.recipe;
        for (let i = 5; i <= 8; i++) R[i] = clamp(R[i]);
        this.lastX = x;
        this.x = R[5];
        this.lift = false;
        return r;
      }
      case 'mean': {
        this.terminate();
        let rec;
        const r = this.traced('mean', [this.regs[5]], (t) => {
          rec = extra.meanStd(this.regs, t);
          return rec.result;
        });
        r.trace.recipe = rec.recipe;
        r.trace.resultText = `x̄ = ${clamp(rec.result)}, s = ${clamp(rec.s)}`;
        if (this.lift) this.push(clamp(rec.s));
        else this.x = clamp(rec.s);
        this.push(clamp(rec.result));
        this.lift = true;
        return r;
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
    if (this.model !== 45) return;
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

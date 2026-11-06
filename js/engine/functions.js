// High-level transcendental functions of the HP-45, built on the decimal
// CORDIC cores. Inputs and outputs are JS numbers (already rounded to the
// calculator's 10 digits); internally everything runs in decimal fixed point.
//
// Every function takes an optional `trace` array. When given, all
// micro-steps are pushed into it, plus 'stage' markers that tell the lab
// which sub-algorithm is running.

import {
  S, fromNumber, toNumber, decExponent, mul, div, abs, sqrtFixed, round10,
} from './decimal.js';
import { PI, HALF_PI, LN10 } from './constants.js';
import { tanCore, atanCore, lnCore, expCore } from './cordic.js';

export class CalcError extends Error {}

/** Below this angle (radians) sin θ = tan θ = θ to the calculator's precision. */
const SMALL = fromNumber(1e-9);

const MODES = {
  DEG: { full: 360n * S, quarter: 90n * S, toRad: (a) => mul(a, PI) / 180n, fromRad: (r) => div(r * 180n, PI) },
  RAD: { full: 2n * PI, quarter: HALF_PI, toRad: (a) => a, fromRad: (r) => r },
  GRD: { full: 400n * S, quarter: 100n * S, toRad: (a) => mul(a, PI) / 200n, fromRad: (r) => div(r * 200n, PI) },
};

function tracer(trace) {
  return trace ? (step) => trace.push(step) : undefined;
}

function finish(v, scale = 0) {
  const x = toNumber(v, scale);
  return round10(x);
}

const OVERFLOW = 9.999999999e99;

/**
 * sin, cos, tan
 * @param {'sin'|'cos'|'tan'} fn
 * @param {number} x
 * @param {'DEG'|'RAD'|'GRD'} mode
 */
export function trig(fn, x, mode = 'DEG', trace) {
  const T = tracer(trace);
  const M = MODES[mode];
  const v = fromNumber(x);
  const neg = v < 0n;
  let a = abs(v);
  a %= M.full;
  const quadrant = Number(a / M.quarter);
  a -= BigInt(quadrant) * M.quarter;
  const theta = M.toRad(a);
  T?.({ algo: 'trig', phase: 'reduce', fn, mode, quadrant, regs: { x: v, a, theta }, msg: ['trig.reduce', { fn, mode, quadrant: quadrant + 1 }] });

  let sinA;
  let cosA;
  let X;
  let Y;
  if (theta < SMALL) {
    // tiny angle: all q_j are 0, the vector is (1, θ)
    X = S;
    Y = theta;
    sinA = theta;
    cosA = S;
    T?.({ algo: 'trig', phase: 'small', regs: { theta }, msg: ['trig.small'] });
  } else {
    ({ X, Y } = tanCore(theta, T));
  }

  let result;
  if (fn === 'tan') {
    // even quadrants: tan a = Y/X; odd quadrants: tan = −cot a = −X/Y
    const [num, den] = quadrant % 2 === 0 ? [Y, X] : [X, Y];
    if (den === 0n) {
      result = OVERFLOW;
    } else {
      let t = div(num, den);
      if (quadrant % 2 === 1) t = -t;
      if (neg) t = -t;
      result = finish(t);
    }
    T?.({ algo: 'trig', phase: 'final', fn, regs: { X, Y }, vec: { X, Y }, result, msg: [quadrant % 2 === 0 ? 'trig.final.tan' : 'trig.final.cot'] });
    return result;
  }

  if (sinA === undefined) {
    // HP: sin and cos follow from the vector – one square root, two divisions
    T?.({ algo: 'trig', phase: 'norm', regs: { X, Y }, vec: { X, Y }, msg: ['trig.norm'] });
    const R = sqrtFixed(mul(X, X) + mul(Y, Y), T);
    sinA = div(Y, R);
    cosA = div(X, R);
  }
  // map the reduced angle back to its quadrant
  const table = [
    [sinA, cosA],
    [cosA, -sinA],
    [-sinA, -cosA],
    [-cosA, sinA],
  ];
  let [s, c] = table[quadrant];
  if (neg) s = -s; // sin is odd, cos is even
  result = finish(fn === 'sin' ? s : c);
  T?.({ algo: 'trig', phase: 'final', fn, regs: { X, Y, sin: s, cos: c }, vec: { X, Y }, result, msg: ['trig.final.' + fn] });
  return result;
}

/** Angle of the vector (x, y) with x, y >= 0, in radians (fixed point). */
function vectorAngle(X, Y, T) {
  if (Y === 0n) return 0n;
  if (X === 0n) return HALF_PI;
  return atanCore(X, Y, T);
}

/**
 * Scale two numbers by the same power of ten so that the larger one lies in
 * [1, 10). That is exact in decimal and keeps all digits for the vector.
 */
function scalePair(x, y) {
  const e = decExponent(Math.max(Math.abs(x), Math.abs(y)));
  return { X: fromNumber(Math.abs(x), -e), Y: fromNumber(Math.abs(y), -e), e };
}

export function atan(x, mode = 'DEG', trace) {
  const T = tracer(trace);
  const M = MODES[mode];
  if (Math.abs(x) < 1e-9) return round10(toNumber(M.fromRad(fromNumber(x))));
  const { X, Y } = scalePair(1, x);
  T?.({ algo: 'atan', phase: 'setup', regs: { X, Y }, vec: { X, Y }, msg: ['atan.setup', { fn: 'atan' }] });
  let theta = vectorAngle(X, Y, T);
  if (x < 0) theta = -theta;
  const result = finish(M.fromRad(theta));
  T?.({ algo: 'atan', phase: 'final', regs: { theta }, result, msg: ['atan.final', { mode }] });
  return result;
}

export function asin(x, mode = 'DEG', trace) {
  if (Math.abs(x) > 1) throw new CalcError('domain');
  const T = tracer(trace);
  const M = MODES[mode];
  const v = abs(fromNumber(x));
  // the vector (√(1−x²), x) has the angle asin x
  T?.({ algo: 'atan', phase: 'setup', regs: { x: v }, msg: ['atan.setup.asin'] });
  const c = sqrtFixed(S - mul(v, v), T);
  let theta = vectorAngle(c, v, T);
  if (x < 0) theta = -theta;
  const result = finish(M.fromRad(theta));
  T?.({ algo: 'atan', phase: 'final', regs: { theta }, result, msg: ['atan.final', { mode }] });
  return result;
}

export function acos(x, mode = 'DEG', trace) {
  if (Math.abs(x) > 1) throw new CalcError('domain');
  const T = tracer(trace);
  const M = MODES[mode];
  const v = abs(fromNumber(x));
  // the vector (x, √(1−x²)) has the angle acos x
  T?.({ algo: 'atan', phase: 'setup', regs: { x: v }, msg: ['atan.setup.acos'] });
  const s = sqrtFixed(S - mul(v, v), T);
  let theta = vectorAngle(v, s, T);
  if (x < 0) theta = PI - theta;
  const result = finish(M.fromRad(theta));
  T?.({ algo: 'atan', phase: 'final', regs: { theta }, result, msg: ['atan.final', { mode }] });
  return result;
}

/** Natural logarithm as fixed point (for reuse in log and y^x). */
function lnFixed(x, T) {
  if (!(x > 0)) throw new CalcError('domain');
  const e = decExponent(x);
  const m = fromNumber(x, -e); // mantissa in [1, 10)
  T?.({ algo: 'ln', phase: 'setup', regs: { M: m }, e, msg: ['ln.setup', { e }] });
  const lnM = lnCore(m, T);
  const res = lnM + BigInt(e) * LN10;
  if (e !== 0) T?.({ algo: 'ln', phase: 'exp10', e, regs: { sum: res }, msg: ['ln.exp10', { e }] });
  return res;
}

export function ln(x, trace) {
  const T = tracer(trace);
  const v = lnFixed(x, T);
  const result = finish(v);
  T?.({ algo: 'ln', phase: 'final', regs: { sum: v }, result, msg: ['ln.final'] });
  return result;
}

export function log(x, trace) {
  const T = tracer(trace);
  const v = div(lnFixed(x, T), LN10);
  const result = finish(v);
  T?.({ algo: 'ln', phase: 'final', regs: { sum: v }, result, msg: ['log.final'] });
  return result;
}

/** e^v for fixed-point v */
function expFixed(v, T) {
  // v = k·ln10 + r with 0 <= r < ln 10  →  e^v = e^r · 10^k
  let k = v / LN10;
  if (v < 0n && k * LN10 !== v) k -= 1n;
  const r = v - k * LN10;
  if (k > 99n) throw new CalcError('overflow');
  T?.({ algo: 'exp', phase: 'setup', k: Number(k), regs: { r }, msg: ['exp.setup', { k: Number(k) }] });
  if (k < -100n) return { P: 0n, k: 0 };
  const P = expCore(r, T);
  return { P, k: Number(k) };
}

function expResult(P, k, T) {
  const result = finish(P, k);
  if (Math.abs(result) >= 1e100) throw new CalcError('overflow');
  T?.({ algo: 'exp', phase: 'final', k, regs: { P }, result, msg: ['exp.final', { k }] });
  return result;
}

export function exp(x, trace) {
  const T = tracer(trace);
  const { P, k } = expFixed(fromNumber(x), T);
  return expResult(P, k, T);
}

export function exp10(x, trace) {
  const T = tracer(trace);
  const { P, k } = expFixed(mul(fromNumber(x), LN10), T);
  return expResult(P, k, T);
}

/** y^x = e^(x·ln y)  (HP-45: y must be > 0) */
export function pow(y, x, trace) {
  if (y === 0) {
    if (x > 0) return 0;
    throw new CalcError('domain');
  }
  if (y < 0) throw new CalcError('domain');
  const T = tracer(trace);
  const l = lnFixed(y, T);
  const { P, k } = expFixed(mul(l, fromNumber(x)), T);
  return expResult(P, k, T);
}

export function sqrt(x, trace) {
  if (x < 0) throw new CalcError('domain');
  if (x === 0) return 0;
  const T = tracer(trace);
  let e = decExponent(x);
  if (e % 2 !== 0) e -= 1; // even exponent: mantissa in [1, 100)
  const m = fromNumber(x, -e);
  T?.({ algo: 'sqrt', phase: 'setup', e, regs: { m }, msg: ['sqrt.setup', { e }] });
  const r = sqrtFixed(m, T);
  const result = finish(r, e / 2);
  T?.({ algo: 'sqrt', phase: 'final', regs: { r }, result, msg: ['sqrt.final'] });
  return result;
}

/** →P: rectangular (x, y) → polar (r, θ) */
export function toPolar(x, y, mode = 'DEG', trace) {
  const T = tracer(trace);
  const M = MODES[mode];
  if (x === 0 && y === 0) return { r: 0, theta: 0 };
  const { X, Y, e } = scalePair(x, y);
  T?.({ algo: 'atan', phase: 'setup', regs: { X, Y }, vec: { X, Y }, msg: ['atan.setup.polar'] });
  let theta = vectorAngle(X, Y, T);
  if (x < 0) theta = PI - theta;
  if (y < 0) theta = -theta;
  const R = sqrtFixed(mul(X, X) + mul(Y, Y), T);
  const r = finish(R, e);
  const t = finish(M.fromRad(theta));
  T?.({ algo: 'atan', phase: 'final', regs: { theta }, result: t, msg: ['polar.final'] });
  return { r, theta: t };
}

/** →R: polar (r, θ) → rectangular (x, y) */
export function toRect(r, theta, mode = 'DEG', trace) {
  const s = trig('sin', theta, mode, trace);
  const c = trig('cos', theta, mode, trace);
  return { x: round10(r * c), y: round10(r * s) };
}

// Decimal CORDIC – pseudo-division and pseudo-multiplication.
//
// Classic (binary) CORDIC rotates a vector by ±atan(2^-j). HP's pocket
// calculators work in decimal BCD, so they use atan(10^-j) instead and apply
// each micro-rotation up to 9 times per decade ("digit by digit"). This
// scheme goes back to J. E. Meggitt (IBM, 1962) and J. E. Volder (1959).
//
// Every core routine accepts an optional trace callback T(step). The steps
// are what the "Inside" lab shows. Each step is a plain object:
//   { algo, phase, j, k, q, regs, vec, msg: [i18nKey, params] }

import { S, shr, div } from './decimal.js';
import { ATAN, LN, TRIG_DECADES, LOG_DECADES } from './constants.js';

/**
 * TAN core: angle θ (radians, fixed point, 0 <= θ <= π/2) → vector (X, Y)
 * with Y/X = tan θ.
 *
 * Phase 1 – pseudo-division: split θ into multiples of the ROM constants
 *           θ = q0·atan(1) + q1·atan(0.1) + … + q4·atan(0.0001) + r
 * Phase 2 – start vector (1, r): for a tiny angle r, tan r ≈ r.
 * Phase 3 – pseudo-multiplication: rotate the vector q_j times by atan(10^-j),
 *           from the smallest decade back to the largest:
 *              X' = X − Y·10^-j      Y' = Y + X·10^-j
 *           Only shifts and additions! The vector grows a little each time
 *           (factor √(1+10^-2j)), but that cancels in the ratio Y/X.
 */
export function tanCore(theta, T) {
  const q = new Array(TRIG_DECADES).fill(0);
  let r = theta;
  T?.({ algo: 'trig', phase: 'pdiv', j: 0, q: [...q], regs: { theta: r }, msg: ['trig.pdiv.start'] });
  for (let j = 0; j < TRIG_DECADES; j++) {
    const c = ATAN[j];
    while (r >= c) {
      r -= c;
      q[j]++;
      T?.({ algo: 'trig', phase: 'pdiv', j, q: [...q], regs: { theta: r }, msg: ['trig.pdiv.sub', { j, n: q[j] }] });
    }
    T?.({ algo: 'trig', phase: 'pdiv', j, q: [...q], regs: { theta: r }, done: true, msg: ['trig.pdiv.decade', { j, n: q[j] }] });
  }
  let X = S;
  let Y = r;
  T?.({ algo: 'trig', phase: 'init', j: TRIG_DECADES - 1, q: [...q], regs: { X, Y }, vec: { X, Y }, msg: ['trig.init'] });
  const qLeft = [...q];
  for (let j = TRIG_DECADES - 1; j >= 0; j--) {
    for (let k = 0; k < q[j]; k++) {
      const nx = X - shr(Y, j);
      const ny = Y + shr(X, j);
      X = nx;
      Y = ny;
      qLeft[j]--;
      T?.({ algo: 'trig', phase: 'pmul', j, k: k + 1, q: [...q], qLeft: [...qLeft], regs: { X, Y }, vec: { X, Y }, msg: ['trig.pmul.rot', { j, k: k + 1, n: q[j] }] });
    }
  }
  return { X, Y, q, r };
}

/**
 * ATAN core (vectoring mode): vector (X, Y) with X > 0, Y >= 0 → angle.
 *
 * Phase 1 – pseudo-division of the vector: rotate it backwards by
 *           atan(10^-j) as long as it stays above the x-axis (Y >= 0):
 *              X' = X + Y·10^-j      Y' = Y − X·10^-j
 * Phase 2 – the remaining angle is tiny: r ≈ Y/X (one real division).
 * Phase 3 – pseudo-multiplication: add up the ROM constants
 *              θ = r + Σ q_j·atan(10^-j)
 */
export function atanCore(X0, Y0, T) {
  const q = new Array(TRIG_DECADES).fill(0);
  let X = X0;
  let Y = Y0;
  T?.({ algo: 'atan', phase: 'vec', j: 0, q: [...q], regs: { X, Y }, vec: { X, Y }, msg: ['atan.start'] });
  for (let j = 0; j < TRIG_DECADES; j++) {
    while (Y - shr(X, j) >= 0n) {
      const nx = X + shr(Y, j);
      const ny = Y - shr(X, j);
      X = nx;
      Y = ny;
      q[j]++;
      T?.({ algo: 'atan', phase: 'vec', j, q: [...q], regs: { X, Y }, vec: { X, Y }, msg: ['atan.rot', { j, n: q[j] }] });
    }
    T?.({ algo: 'atan', phase: 'vec', j, q: [...q], regs: { X, Y }, vec: { X, Y }, done: true, msg: ['atan.decade', { j, n: q[j] }] });
  }
  let theta = X === 0n ? 0n : div(Y, X);
  T?.({ algo: 'atan', phase: 'resid', j: TRIG_DECADES - 1, q: [...q], regs: { X, Y, theta }, vec: { X, Y }, msg: ['atan.resid'] });
  for (let j = TRIG_DECADES - 1; j >= 0; j--) {
    for (let k = 0; k < q[j]; k++) {
      theta += ATAN[j];
      T?.({ algo: 'atan', phase: 'sum', j, k: k + 1, q: [...q], regs: { theta }, msg: ['atan.sum', { j, k: k + 1, n: q[j] }] });
    }
  }
  return theta;
}

/**
 * LN core: mantissa M (fixed point, 1 <= M < 10) → ln M.
 *
 * Phase 1 – pseudo-division: build M as a product of ROM factors
 *              M ≈ 2^q0 · 1.1^q1 · 1.01^q2 · … · (1 + r)
 *           Multiplying P by (1 + 10^-j) is just P + (P shifted j places).
 * Phase 2 – residual: r = (M − P)/P, and for tiny r: ln(1 + r) ≈ r.
 * Phase 3 – add up the ROM logarithms: ln M = r + Σ q_j·ln(1 + 10^-j)
 */
export function lnCore(M, T) {
  const q = new Array(LOG_DECADES).fill(0);
  let P = S;
  T?.({ algo: 'ln', phase: 'pdiv', j: 0, q: [...q], regs: { M, P }, msg: ['ln.start'] });
  for (let j = 0; j < LOG_DECADES; j++) {
    while (P + shr(P, j) <= M) {
      P += shr(P, j);
      q[j]++;
      T?.({ algo: 'ln', phase: 'pdiv', j, q: [...q], regs: { M, P }, msg: ['ln.mul', { j, n: q[j] }] });
    }
    T?.({ algo: 'ln', phase: 'pdiv', j, q: [...q], regs: { M, P }, done: true, msg: ['ln.decade', { j, n: q[j] }] });
  }
  let sum = div(M - P, P);
  T?.({ algo: 'ln', phase: 'resid', j: LOG_DECADES - 1, q: [...q], regs: { M, P, sum }, msg: ['ln.resid'] });
  for (let j = LOG_DECADES - 1; j >= 0; j--) {
    for (let k = 0; k < q[j]; k++) {
      sum += LN[j];
      T?.({ algo: 'ln', phase: 'sum', j, k: k + 1, q: [...q], regs: { sum }, msg: ['ln.sum', { j, k: k + 1, n: q[j] }] });
    }
  }
  return sum;
}

/**
 * EXP core: r (fixed point, 0 <= r < ln 10) → e^r.
 *
 * Phase 1 – pseudo-division: r = Σ q_j·ln(1 + 10^-j) + ρ
 * Phase 2 – start value P = 1 + ρ (e^ρ ≈ 1 + ρ for tiny ρ)
 * Phase 3 – pseudo-multiplication: P ← P + P·10^-j, q_j times per decade
 */
export function expCore(r0, T) {
  const q = new Array(LOG_DECADES).fill(0);
  let r = r0;
  T?.({ algo: 'exp', phase: 'pdiv', j: 0, q: [...q], regs: { r }, msg: ['exp.start'] });
  for (let j = 0; j < LOG_DECADES; j++) {
    const c = LN[j];
    while (r >= c) {
      r -= c;
      q[j]++;
      T?.({ algo: 'exp', phase: 'pdiv', j, q: [...q], regs: { r }, msg: ['exp.sub', { j, n: q[j] }] });
    }
    T?.({ algo: 'exp', phase: 'pdiv', j, q: [...q], regs: { r }, done: true, msg: ['exp.decade', { j, n: q[j] }] });
  }
  let P = S + r;
  T?.({ algo: 'exp', phase: 'init', j: LOG_DECADES - 1, q: [...q], regs: { P }, msg: ['exp.init'] });
  const qLeft = [...q];
  for (let j = LOG_DECADES - 1; j >= 0; j--) {
    for (let k = 0; k < q[j]; k++) {
      P += shr(P, j);
      qLeft[j]--;
      T?.({ algo: 'exp', phase: 'pmul', j, k: k + 1, q: [...q], qLeft: [...qLeft], regs: { P }, msg: ['exp.mul', { j, k: k + 1, n: q[j] }] });
    }
  }
  return P;
}

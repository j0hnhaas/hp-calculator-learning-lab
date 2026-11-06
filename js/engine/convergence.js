// Convergence analysis of a CORDIC trace: for every micro-step, how many
// significant digits of the quantity being built are already correct?
//
// Every algorithm run has a target (e.g. θ for the pseudo-division, tan θ for
// the pseudo-multiplication) and a current estimate. The number of correct
// digits is  −log10(|estimate − target| / |target|), capped at MAX_DIGITS.

import { S, div } from './decimal.js';
import { ATAN, LN } from './constants.js';

export const MAX_DIGITS = 16;

const absB = (v) => (v < 0n ? -v : v);

/** log10 of a positive BigInt, accurate to ~15 digits */
function lg(v) {
  const s = v.toString();
  const head = Number(s.slice(0, 15));
  return s.length - Math.min(15, s.length) + Math.log10(head);
}

/** correct significant digits of `est` compared to `target` (both fixed point) */
export function correctDigits(est, target) {
  if (target === 0n) return null;
  const err = absB(est - target);
  if (err === 0n) return MAX_DIGITS;
  const d = lg(absB(target)) - lg(err);
  return Math.max(0, Math.min(MAX_DIGITS, d));
}

/** Split a trace into runs: contiguous steps of one algorithm, started by a setup-like step. */
export function splitRuns(steps) {
  const runs = [];
  let cur = null;
  steps.forEach((s, i) => {
    const starts = !cur || cur.algo !== s.algo || s.phase === 'reduce' || s.phase === 'setup'
      || (s.msg && ['trig.pdiv.start', 'atan.start', 'ln.start', 'exp.start'].includes(s.msg[0]) && cur.hasCore);
    if (starts) {
      cur = { algo: s.algo, start: i, end: i, hasCore: false };
      runs.push(cur);
    }
    cur.end = i;
    if (s.msg && ['trig.pdiv.start', 'atan.start', 'ln.start', 'exp.start'].includes(s.msg[0])) cur.hasCore = true;
  });
  return runs;
}

const sumConsts = (q, table) => q.reduce((acc, n, j) => acc + BigInt(n) * table[j], 0n);

/**
 * @param {object[]} steps trace
 * @returns {(null|{digits:number, quantity:string})[]} one entry per step
 */
export function convergence(steps) {
  const out = steps.map(() => null);
  for (const run of splitRuns(steps)) {
    const rs = steps.slice(run.start, run.end + 1);
    const at = (k, digits, quantity) => {
      if (digits !== null && digits !== undefined) out[run.start + k] = { digits, quantity };
    };

    if (run.algo === 'trig') {
      const red = rs.find((s) => s.phase === 'reduce');
      const theta0 = red?.regs.theta;
      const lastVec = [...rs].reverse().find((s) => s.vec && (s.phase === 'pmul' || s.phase === 'init'));
      const tanFinal = lastVec && lastVec.vec.X !== 0n ? div(lastVec.vec.Y, lastVec.vec.X) : null;
      rs.forEach((s, k) => {
        if (s.phase === 'pdiv' && theta0 !== undefined) at(k, correctDigits(theta0 - s.regs.theta, theta0), 'θ');
        if ((s.phase === 'pmul' || s.phase === 'init') && tanFinal !== null && s.vec.X !== 0n) {
          at(k, correctDigits(div(s.vec.Y, s.vec.X), tanFinal), 'tan');
        }
      });
    } else if (run.algo === 'atan') {
      const last = [...rs].reverse().find((s) => s.phase === 'sum' || s.phase === 'resid');
      const final = last?.regs.theta;
      if (final === undefined) continue;
      rs.forEach((s, k) => {
        if (s.phase === 'vec') at(k, correctDigits(sumConsts(s.q, ATAN), final), 'θ');
        if (s.phase === 'resid') at(k, correctDigits(sumConsts(s.q, ATAN) + s.regs.theta, final), 'θ');
        if (s.phase === 'sum') at(k, correctDigits(s.regs.theta, final), 'θ');
      });
    } else if (run.algo === 'ln') {
      const last = [...rs].reverse().find((s) => s.phase === 'sum' || s.phase === 'resid');
      const final = last?.regs.sum;
      rs.forEach((s, k) => {
        if (s.phase === 'pdiv') at(k, correctDigits(s.regs.P, s.regs.M), 'P→M');
        if ((s.phase === 'sum' || s.phase === 'resid') && final !== undefined) at(k, correctDigits(s.regs.sum, final), 'ln M');
      });
    } else if (run.algo === 'exp') {
      const first = rs.find((s) => s.phase === 'pdiv');
      const r0 = first?.regs.r;
      const last = [...rs].reverse().find((s) => s.phase === 'pmul' || s.phase === 'init');
      const Pend = last?.regs.P;
      rs.forEach((s, k) => {
        if (s.phase === 'pdiv' && r0 !== undefined) at(k, correctDigits(r0 - s.regs.r, r0), 'r');
        if ((s.phase === 'pmul' || s.phase === 'init') && Pend !== undefined) at(k, correctDigits(s.regs.P, Pend), 'eʳ');
      });
    } else if (run.algo === 'sqrt') {
      const digitSteps = rs.filter((s) => s.phase === 'digit');
      const final = digitSteps.at(-1)?.regs.root;
      if (!final) continue;
      rs.forEach((s, k) => {
        if (s.phase !== 'digit') return;
        // digits found so far are exact (truncated), so they are all correct
        const found = s.regs.root.length;
        at(k, Math.min(MAX_DIGITS, found), '√');
      });
    }
  }
  return out;
}

export { S };

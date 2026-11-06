// The "exotic" keys are recipes made of the basic BCD operations.
// Every function records its recipe: one entry per basic operation, with
// the index of the last trace step it produced (so the lab can show it).

import * as A from './arith.js';
import { sqrt as sqrtFn, CalcError } from './functions.js';
import { round10 } from './decimal.js';

function recorder(trace) {
  const recipe = [];
  const step = (op, a, b, run) => {
    const r = run();
    recipe.push({ op, a, b, r, end: trace ? trace.length - 1 : -1 });
    return r;
  };
  return { recipe, step };
}

/** n! = 1 · 2 · 3 · … · n – repeated multiplication */
export function factorial(n, trace) {
  if (n < 0 || n !== Math.floor(n) || n > 69) throw new CalcError('domain');
  const { recipe, step } = recorder(trace);
  let r = 1;
  // the running product is kept exactly (like the calculator's guard digits);
  // the trace shows each multiplication rounded to 10 digits
  let exact = 1n;
  for (let k = 2; k <= n; k++) {
    const prev = r;
    exact *= BigInt(k);
    r = step('mul', prev, k, () => A.mul(prev, k, trace));
  }
  const es = exact.toString();
  const result = round10(es.length <= 17 ? Number(exact) : Number(`${es.slice(0, 17)}e${es.length - 17}`));
  if (recipe.length) recipe[recipe.length - 1].r = result;
  return { result, recipe };
}

/** Δ%: (x − y) ÷ y, then × 100 (a shift by two places) */
export function deltaPct(y, x, trace) {
  if (y === 0) throw new CalcError('div0');
  const { recipe, step } = recorder(trace);
  const d = step('sub', x, y, () => A.sub(x, y, trace));
  const q = step('div', d, y, () => A.div(d, y, trace));
  const r = step('shift', q, 2, () => round10(q * 100));
  return { result: r, recipe };
}

/** →D.MS: 1.5 h → 1.3000 (1 h 30 min 00 s) */
export function toDMS(x, trace) {
  const { recipe, step } = recorder(trace);
  const neg = x < 0;
  const a = Math.abs(x);
  const h = step('int', a, 0, () => Math.floor(a));
  const f = step('sub', a, h, () => A.sub(a, h, trace));
  const m60 = step('mul', f, 60, () => A.mul(f, 60, trace));
  let m = step('int', m60, 0, () => Math.floor(m60 + 1e-9));
  const fs = step('sub', m60, m, () => A.sub(m60, m, trace));
  let s = step('mul', fs, 60, () => A.mul(fs, 60, trace));
  s = Math.round(s * 1e6) / 1e6;
  let hh = h;
  if (s >= 60) { s -= 60; m += 1; }
  if (m >= 60) { m -= 60; hh += 1; }
  const r = round10(hh + m / 100 + s / 10000);
  recipe.push({ op: 'join', a: hh, b: m, c: s, r, end: trace ? trace.length - 1 : -1 });
  return { result: neg ? -r : r, recipe };
}

/** D.MS→: 1.30 → 1.5 */
export function fromDMS(x, trace) {
  const { recipe, step } = recorder(trace);
  const neg = x < 0;
  const a = Math.abs(x);
  const h = Math.floor(a);
  const mm = Math.floor(round10((a - h) * 100));
  const ss = round10(((a - h) * 100 - mm) * 100);
  recipe.push({ op: 'split', a, b: h, c: mm, d: ss, r: h, end: trace ? trace.length - 1 : -1 });
  const mh = step('div', mm, 60, () => A.div(mm, 60, trace));
  const sh = step('div', ss, 3600, () => A.div(ss, 3600, trace));
  const t1 = step('add', h, mh, () => A.add(h, mh, trace));
  const r = step('add', t1, sh, () => A.add(t1, sh, trace));
  return { result: neg ? -r : r, recipe };
}

/**
 * Σ+ / Σ−: bookkeeping in R5 … R8: n, Σx², Σx, Σy
 * @param {number[]} R registers (modified)
 */
export function sigma(x, y, R, sign, trace) {
  const { recipe, step } = recorder(trace);
  const f = sign > 0 ? A.add : A.sub;
  const opName = sign > 0 ? 'add' : 'sub';
  R[5] = step(opName, R[5], 1, () => f(R[5], 1, trace));
  const x2 = step('mul', x, x, () => A.mul(x, x, trace));
  R[6] = step(opName, R[6], x2, () => f(R[6], x2, trace));
  R[7] = step(opName, R[7], x, () => f(R[7], x, trace));
  R[8] = step(opName, R[8], y, () => f(R[8], y, trace));
  return { result: R[5], recipe };
}

/** x̄ = Σx ÷ n,  s = √((n·Σx² − (Σx)²) ÷ (n·(n−1))) */
export function meanStd(R, trace) {
  const [n, sx2, sx] = [R[5], R[6], R[7]];
  if (n === 0) throw new CalcError('stat');
  const { recipe, step } = recorder(trace);
  const mean = step('div', sx, n, () => A.div(sx, n, trace));
  let s = 0;
  if (n > 1) {
    const a = step('mul', n, sx2, () => A.mul(n, sx2, trace));
    const b = step('mul', sx, sx, () => A.mul(sx, sx, trace));
    const c = step('sub', a, b, () => A.sub(a, b, trace));
    const n1 = step('sub', n, 1, () => A.sub(n, 1, trace));
    const d = step('mul', n, n1, () => A.mul(n, n1, trace));
    const v = step('div', c, d, () => A.div(c, d, trace));
    s = step('sqrt', Math.max(0, v), 0, () => sqrtFn(Math.max(0, v), trace));
  }
  return { result: mean, s, recipe };
}

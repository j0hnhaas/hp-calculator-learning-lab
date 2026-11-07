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

/** The conversion keys only push a constant from the ROM. */
export const UNITS = {
  cmin: { k: 2.54, from: 'in', to: 'cm' },
  kglb: { k: 0.45359237, from: 'lb', to: 'kg' },
  ltrgal: { k: 3.785411784, from: 'gal', to: 'l' },
};

/**
 * Trace for a conversion key. The calculator just recalls the constant; for
 * the gallon we also re-derive it from the inch (231 in³ × 2.54³ ÷ 1000) to
 * show where the number comes from – the HP does not do that, it is in ROM.
 * @param {number} v the value the user had in X (it moves up to Y)
 */
export function unitConst(key, v, trace) {
  const u = UNITS[key];
  const { recipe, step } = recorder(trace);
  trace?.push({ algo: 'const', phase: 'const', key, k: u.k, v, regs: { K: String(u.k) }, msg: ['const.push', { k: u.k }] });
  if (key === 'ltrgal') {
    const a = step('mul', 231, 2.54, () => A.mul(231, 2.54, trace));
    const b = step('mul', a, 2.54, () => A.mul(a, 2.54, trace));
    const c = step('mul', b, 2.54, () => A.mul(b, 2.54, trace));
    step('div', c, 1000, () => A.div(c, 1000, trace));
  }
  // both directions, with the user's own number
  const toMul = v ? A.mul(v, u.k) : 0;
  const toDiv = v ? A.div(v, u.k) : 0;
  trace?.push({ algo: 'const', phase: 'use', key, k: u.k, v, mul: toMul, div: toDiv, regs: { K: String(u.k) }, msg: ['const.use', { k: u.k }] });
  return { result: u.k, recipe, mul: toMul, div: toDiv };
}

// ---------------------------------------------------------------- HP-55

/** HP-55 conversions: [from, to, factor, operation] – f converts one way, g back */
export const CONV55 = {
  in2mm: { from: 'in', to: 'mm', k: 25.4, op: 'mul' },
  mm2in: { from: 'mm', to: 'in', k: 25.4, op: 'div' },
  ft2m: { from: 'ft', to: 'm', k: 0.3048, op: 'mul' },
  m2ft: { from: 'm', to: 'ft', k: 0.3048, op: 'div' },
  gal2l: { from: 'gal', to: 'l', k: 3.785411784, op: 'mul' },
  l2gal: { from: 'l', to: 'gal', k: 3.785411784, op: 'div' },
  lbm2kg: { from: 'lbm', to: 'kg', k: 0.45359237, op: 'mul' },
  kg2lbm: { from: 'kg', to: 'lbm', k: 0.45359237, op: 'div' },
  lbf2n: { from: 'lbf', to: 'N', k: 4.448221615, op: 'mul' },
  n2lbf: { from: 'N', to: 'lbf', k: 4.448221615, op: 'div' },
  btu2j: { from: 'Btu', to: 'J', k: 1055.055853, op: 'mul' },
  j2btu: { from: 'J', to: 'Btu', k: 1055.055853, op: 'div' },
  f2c: { from: '°F', to: '°C', k: 1.8, op: 'f2c' },
  c2f: { from: '°C', to: '°F', k: 1.8, op: 'c2f' },
  d2r: { from: '°', to: 'rad', k: 57.29577951, op: 'div' },
  r2d: { from: 'rad', to: '°', k: 57.29577951, op: 'mul' },
};

/** a conversion as a real calculation (unlike the HP-45 keys, which only push a constant) */
export function convert(id, x, trace) {
  const c = CONV55[id];
  const { recipe, step } = recorder(trace);
  let r;
  if (c.op === 'mul') r = step('mul', x, c.k, () => A.mul(x, c.k, trace));
  else if (c.op === 'div') r = step('div', x, c.k, () => A.div(x, c.k, trace));
  else if (c.op === 'f2c') {
    const d = step('sub', x, 32, () => A.sub(x, 32, trace));
    r = step('div', d, 1.8, () => A.div(d, 1.8, trace));
  } else {
    const m = step('mul', x, 1.8, () => A.mul(x, 1.8, trace));
    r = step('add', m, 32, () => A.add(m, 32, trace));
  }
  return { result: r, recipe, conv: c };
}

/** H.MS+ / H.MS−: add or subtract times written as h.mmss */
export function hmsAddSub(y, x, sign, trace) {
  const { recipe } = recorder(trace);
  const a = fromDMS(y, trace);
  recipe.push(...a.recipe);
  const b = fromDMS(x, trace);
  recipe.push(...b.recipe);
  const sum = sign > 0 ? A.add(a.result, b.result, trace) : A.sub(a.result, b.result, trace);
  recipe.push({ op: sign > 0 ? 'add' : 'sub', a: a.result, b: b.result, r: sum, end: trace ? trace.length - 1 : -1 });
  const c = toDMS(sum, trace);
  recipe.push(...c.recipe);
  return { result: c.result, recipe };
}

/**
 * HP-55 statistics: registers .0 … .5 hold n, Σx, Σx², Σy, Σy², Σxy
 * (indices 10 … 15 in our register array).
 */
export function sigma55(x, y, R, sign, trace) {
  const { recipe, step } = recorder(trace);
  const f = sign > 0 ? A.add : A.sub;
  const o = sign > 0 ? 'add' : 'sub';
  R[10] = step(o, R[10], 1, () => f(R[10], 1, trace));
  R[11] = step(o, R[11], x, () => f(R[11], x, trace));
  const x2 = step('mul', x, x, () => A.mul(x, x, trace));
  R[12] = step(o, R[12], x2, () => f(R[12], x2, trace));
  R[13] = step(o, R[13], y, () => f(R[13], y, trace));
  const y2 = step('mul', y, y, () => A.mul(y, y, trace));
  R[14] = step(o, R[14], y2, () => f(R[14], y2, trace));
  const xy = step('mul', x, y, () => A.mul(x, y, trace));
  R[15] = step(o, R[15], xy, () => f(R[15], xy, trace));
  return { result: R[10], recipe };
}

/** x̄ and ȳ */
export function means55(R, trace) {
  const n = R[10];
  if (n === 0) throw new CalcError('stat');
  const { recipe, step } = recorder(trace);
  const mx = step('div', R[11], n, () => A.div(R[11], n, trace));
  const my = step('div', R[13], n, () => A.div(R[13], n, trace));
  return { result: mx, y: my, recipe };
}

/** sx and sy */
export function sdev55(R, trace) {
  const n = R[10];
  if (n < 2) throw new CalcError('stat');
  const { recipe, step } = recorder(trace);
  const one = (s, s2) => {
    const a = step('mul', n, s2, () => A.mul(n, s2, trace));
    const b = step('mul', s, s, () => A.mul(s, s, trace));
    const c = step('sub', a, b, () => A.sub(a, b, trace));
    const n1 = step('sub', n, 1, () => A.sub(n, 1, trace));
    const d = step('mul', n, n1, () => A.mul(n, n1, trace));
    const v = step('div', c, d, () => A.div(c, d, trace));
    return step('sqrt', Math.max(0, v), 0, () => sqrtFn(Math.max(0, v), trace));
  };
  const sx = one(R[11], R[12]);
  const sy = one(R[13], R[14]);
  return { result: sx, y: sy, recipe };
}

/** linear regression y = a + b·x: intercept a (→ X) and slope b (→ Y) */
export function linreg55(R, trace) {
  const [n, sx, sx2, sy, , sxy] = [R[10], R[11], R[12], R[13], R[14], R[15]];
  if (n < 2) throw new CalcError('stat');
  const { recipe, step } = recorder(trace);
  const p = step('mul', n, sxy, () => A.mul(n, sxy, trace));
  const q = step('mul', sx, sy, () => A.mul(sx, sy, trace));
  const num = step('sub', p, q, () => A.sub(p, q, trace));
  const u = step('mul', n, sx2, () => A.mul(n, sx2, trace));
  const v = step('mul', sx, sx, () => A.mul(sx, sx, trace));
  const den = step('sub', u, v, () => A.sub(u, v, trace));
  if (den === 0) throw new CalcError('stat');
  const b = step('div', num, den, () => A.div(num, den, trace));
  const bx = step('mul', b, sx, () => A.mul(b, sx, trace));
  const t = step('sub', sy, bx, () => A.sub(sy, bx, trace));
  const a = step('div', t, n, () => A.div(t, n, trace));
  return { result: a, y: b, recipe };
}

/** ŷ: the estimate on the regression line for a given x */
export function yhat55(x, R, trace) {
  const lr = linreg55(R, trace);
  const { recipe, step } = recorder(trace);
  recipe.push(...lr.recipe);
  const bx = step('mul', lr.y, x, () => A.mul(lr.y, x, trace));
  const r = step('add', lr.result, bx, () => A.add(lr.result, bx, trace));
  return { result: r, recipe };
}

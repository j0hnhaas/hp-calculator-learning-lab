import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as f from '../js/engine/functions.js';
import { sqrtFixed, fx, fmtFixed, S } from '../js/engine/decimal.js';

/** relative error check to ~9 significant digits */
function close(actual, expected, digits = 9) {
  const tol = Math.max(Math.abs(expected), 1e-99) * 10 ** -digits;
  assert.ok(Math.abs(actual - expected) <= tol, `${actual} != ${expected}`);
}

test('decimal parsing and sqrt', () => {
  assert.equal(fx('1'), S);
  assert.equal(fmtFixed(fx('-12.5'), 3), '-12.500');
  assert.equal(fmtFixed(sqrtFixed(fx('2')), 12), '1.414213562373');
});

test('sin / cos / tan in DEG', () => {
  close(f.trig('sin', 30, 'DEG'), 0.5);
  close(f.trig('cos', 60, 'DEG'), 0.5);
  close(f.trig('tan', 45, 'DEG'), 1);
  close(f.trig('sin', 90, 'DEG'), 1);
  assert.equal(Math.abs(f.trig('cos', 90, 'DEG')), 0);
  close(f.trig('sin', -200, 'DEG'), Math.sin((-200 * Math.PI) / 180));
  close(f.trig('cos', 1234.5678, 'DEG'), Math.cos((1234.5678 * Math.PI) / 180));
  close(f.trig('tan', 135, 'DEG'), -1);
  assert.equal(f.trig('tan', 90, 'DEG'), 9.999999999e99);
});

test('trig in RAD and GRD', () => {
  for (const x of [0.001, 0.1, 0.5, 1, 1.5, 2, 3, 4.5, 6, -1.2345]) {
    close(f.trig('sin', x, 'RAD'), Math.sin(x), 8);
    close(f.trig('cos', x, 'RAD'), Math.cos(x), 8);
    close(f.trig('tan', x, 'RAD'), Math.tan(x), 8);
  }
  close(f.trig('sin', 50, 'GRD'), Math.SQRT1_2);
  close(f.trig('sin', 1e-12, 'RAD'), 1e-12);
});

test('inverse trig', () => {
  close(f.atan(1, 'DEG'), 45);
  close(f.asin(0.5, 'DEG'), 30);
  close(f.acos(0.5, 'DEG'), 60);
  close(f.acos(-1, 'DEG'), 180);
  close(f.asin(1, 'DEG'), 90);
  close(f.atan(-3, 'RAD'), Math.atan(-3));
  close(f.atan(1e20, 'DEG'), 90);
  close(f.atan(0.0001234, 'RAD'), Math.atan(0.0001234));
  assert.throws(() => f.asin(1.5));
});

test('logarithms and exponentials', () => {
  close(f.ln(Math.E), 1);
  close(f.ln(2), Math.LN2);
  close(f.ln(1e-50), Math.log(1e-50));
  close(f.log(1000), 3);
  close(f.log(2), Math.log10(2));
  close(f.exp(1), Math.E);
  close(f.exp(-5.5), Math.exp(-5.5));
  close(f.exp(200), Math.exp(200));
  close(f.exp10(2.5), 10 ** 2.5);
  close(f.pow(2, 10), 1024);
  close(f.pow(9, 0.5), 3);
  assert.throws(() => f.ln(0));
  assert.throws(() => f.exp(300));
});

test('sqrt and polar conversion', () => {
  close(f.sqrt(2), Math.SQRT2);
  close(f.sqrt(1e-7), Math.sqrt(1e-7));
  close(f.sqrt(12345.678), Math.sqrt(12345.678));
  const p = f.toPolar(3, 4, 'DEG');
  close(p.r, 5);
  close(p.theta, Math.atan2(4, 3) * 180 / Math.PI);
  const q = f.toPolar(-1, -1, 'DEG');
  close(q.theta, -135);
  const r = f.toRect(2, 30, 'DEG');
  close(r.x, Math.sqrt(3));
  close(r.y, 1);
});

test('trace records the decimal CORDIC phases', () => {
  const trace = [];
  f.trig('sin', 30, 'DEG', trace);
  const phases = new Set(trace.map((s) => s.phase));
  for (const p of ['reduce', 'pdiv', 'init', 'pmul', 'norm', 'digit', 'final']) assert.ok(phases.has(p), p);
  const last = trace.at(-1);
  assert.equal(last.result, 0.5);
  // 30° = 0.5235987756 rad = 0·atan(1) + 5·atan(0.1) + 2·atan(0.01) + …
  assert.deepEqual(trace.find((s) => s.phase === 'init').q.slice(0, 2), [0, 5]);
});

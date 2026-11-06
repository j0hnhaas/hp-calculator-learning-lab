import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as f from '../js/engine/functions.js';
import { convergence, correctDigits, MAX_DIGITS } from '../js/engine/convergence.js';
import { fx } from '../js/engine/decimal.js';

test('correctDigits', () => {
  assert.equal(correctDigits(fx('1.5'), fx('1.5')), MAX_DIGITS);
  assert.ok(Math.abs(correctDigits(fx('1.001'), fx('1')) - 3) < 1e-9);
  assert.equal(correctDigits(fx('1'), 0n), null);
});

test('pseudo-division gains about one digit per decade, pseudo-multiplication finishes last', () => {
  const t = [];
  f.trig('tan', 0.7, 'RAD', t);
  const c = convergence(t);
  const pdiv = c.filter((x, i) => x && t[i].phase === 'pdiv').map((x) => x.digits);
  for (let k = 1; k < pdiv.length; k++) assert.ok(pdiv[k] >= pdiv[k - 1] - 1e-9, 'monotone');
  assert.ok(pdiv.at(-1) > 5, `pdiv ends with ${pdiv.at(-1)} digits`);
  const pmul = c.filter((x, i) => x && t[i].phase === 'pmul').map((x) => x.digits);
  assert.equal(pmul.at(-1), MAX_DIGITS);
  assert.ok(pmul[0] < 2);
});

test('every algorithm produces convergence data', () => {
  for (const run of [(t) => f.atan(0.3, 'RAD', t), (t) => f.ln(3, t), (t) => f.exp(1.5, t), (t) => f.sqrt(7, t)]) {
    const t = [];
    run(t);
    const c = convergence(t).filter(Boolean);
    assert.ok(c.length > 5);
    assert.ok(Math.max(...c.map((x) => x.digits)) >= 10);
  }
});

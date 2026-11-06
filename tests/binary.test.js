import { test } from 'node:test';
import assert from 'node:assert/strict';
import { binTrig, binAtan, K, B, ITER } from '../js/engine/binary.js';
import { convergence } from '../js/engine/convergence.js';

const close = (a, b, d = 9) => assert.ok(Math.abs(a - b) <= Math.abs(b) * 10 ** -d, `${a} != ${b}`);

test('gain constant K', () => close(Number(K) / Number(B), 0.6072529350088812, 12));

test('binary CORDIC trig', () => {
  close(binTrig('sin', 30, 'DEG'), 0.5);
  close(binTrig('cos', 60, 'DEG'), 0.5);
  close(binTrig('tan', 1, 'RAD'), Math.tan(1));
  close(binTrig('sin', -200, 'DEG'), Math.sin((-200 * Math.PI) / 180));
  close(binAtan(1, 'DEG'), 45);
  close(binAtan(-3, 'RAD'), Math.atan(-3));
});

test('binary trace: one rotation per iteration, digits grow steadily', () => {
  const t = [];
  binTrig('tan', 0.7, 'RAD', t);
  const rots = t.filter((s) => s.phase === 'rot');
  assert.equal(rots.length, ITER);
  const c = convergence(t);
  const d = c.filter((x, i) => x && t[i].phase === 'rot').map((x) => x.digits);
  // after half the iterations about half of the final digits are there
  assert.ok(d[18] > 4 && d[18] < 8, `${d[18]}`);
  // both directions occur – the binary method overshoots and turns back
  assert.ok(rots.some((s) => s.sig.at(-1) < 0));
});

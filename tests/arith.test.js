import { test } from 'node:test';
import assert from 'node:assert/strict';
import { add, sub, mul, div } from '../js/engine/arith.js';
import { round10 } from '../js/engine/decimal.js';

// at most one unit in the 10th digit: the binary reference itself can round
// the other way (e.g. 1.6179545375e-9 is …4999998 in binary floating point)
const ulp = (b) => 10 ** (Math.floor(Math.log10(Math.abs(b))) - 9);
const near = (a, b) => assert.ok(b === 0 ? a === 0 : Math.abs(a - b) <= ulp(b) * 1.0001, `${a} != ${b}`);

test('exact small cases', () => {
  assert.equal(add(3, 4), 7);
  assert.equal(sub(10, 3), 7);
  assert.equal(add(123.4, 5.67), 129.07);
  assert.equal(add(0.1, 0.2), 0.3); // decimal arithmetic: no 0.30000000000000004
  assert.equal(sub(1, 0.9), 0.1);
  assert.equal(sub(5, 5), 0);
  assert.equal(mul(123, 45), 5535);
  assert.equal(mul(-6, 7), -42);
  assert.equal(div(20, 4), 5);
  assert.equal(div(100, 7), 14.28571429);
  assert.equal(div(1, 3), 0.3333333333);
  assert.equal(div(2, 3), 0.6666666667);
  assert.throws(() => div(1, 0));
  // exact decimal rounding: 0.4692591155e-9 + 1.148695422e-9 = 1.6179545375e-9 → …538
  assert.equal(add(-4.692591155e-10, -1.148695422e-9), -1.617954538e-9);
});

test('random values agree with exact arithmetic to 10 digits', () => {
  const r = () => round10((Math.random() - 0.5) * 10 ** Math.floor(Math.random() * 20 - 10));
  for (let i = 0; i < 3000; i++) {
    const a = r();
    const b = r();
    near(add(a, b), round10(a + b));
    near(mul(a, b), round10(a * b));
    if (b !== 0) near(div(a, b), round10(a / b));
  }
});

test('traces count the additions and subtractions', () => {
  const t = [];
  mul(123, 45, t);
  assert.equal(t.at(-1).adds, 4 + 5); // multiplier 45: 5 additions, shift, 4 additions
  const u = [];
  div(100, 7, u);
  assert.deepEqual(u.filter((s) => s.phase === 'qdigit').slice(0, 4).map((s) => s.digit), [1, 4, 2, 8]);
});

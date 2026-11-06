import { test } from 'node:test';
import assert from 'node:assert/strict';
import { costOf } from '../js/engine/cost.js';
import * as f from '../js/engine/functions.js';
import * as arith from '../js/engine/arith.js';

const cost = (run) => {
  const t = [];
  run(t);
  return costOf(t);
};

test('the cost ranking tells the story: + < × < ÷ < sin', () => {
  const add = cost((t) => arith.add(123.4, 5.67, t)).adds;
  const mul = cost((t) => arith.mul(123, 45, t)).adds;
  const div = cost((t) => arith.div(100, 7, t)).adds;
  const sin = cost((t) => f.trig('sin', 30, 'DEG', t)).adds;
  assert.equal(add, 1);
  assert.equal(mul, 9);
  assert.ok(div > mul && sin > div, `${add} ${mul} ${div} ${sin}`);
});

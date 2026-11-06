import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HP45, formatNumber } from '../js/calc/hp45.js';

/** press a sequence like "2 enter 3 add" (digits may be grouped: "12.5") */
function run(calc, seq) {
  for (const tok of seq.split(/\s+/).filter(Boolean)) {
    if (/^[0-9.]+$/.test(tok)) {
      for (const ch of tok) calc.press(ch === '.' ? 'dot' : 'd' + ch);
    } else {
      calc.press(tok);
    }
  }
  return calc;
}

const disp = (c) => c.displayString().trimEnd();

test('power-on display is FIX 2', () => {
  const c = new HP45();
  assert.equal(disp(c), '0.00'.padStart(5, ' '));
  assert.equal(c.displayString().length, 15);
});

test('RPN arithmetic and stack lift', () => {
  const c = run(new HP45(), '2 enter 3 add');
  assert.equal(c.x, 5);
  run(c, '4 mul');
  assert.equal(c.x, 20);
  run(c, '3 enter 4 enter 5 enter 6 add add add');
  assert.equal(c.x, 18);
  run(c, 'clx 7 enter');
  assert.equal(c.x, 7);
});

test('number entry with CHS and EEX', () => {
  const c = run(new HP45(), '6.02 eex 23');
  assert.equal(c.displayString(), ' 6.02        23');
  run(c, 'chs');
  assert.equal(c.displayString(), ' 6.02       -23');
  run(c, 'enter');
  assert.equal(c.x, 6.02e-23);
});

test('display formats', () => {
  assert.equal(formatNumber(3.14159, 'FIX', 2).trimEnd(), ' 3.14');
  assert.equal(formatNumber(-1234.5, 'FIX', 4).trimEnd(), '-1234.5000');
  assert.equal(formatNumber(0.001, 'FIX', 2).trimEnd(), ' 0.00');
  assert.equal(formatNumber(12345, 'SCI', 3), ' 1.235       04');
  assert.equal(formatNumber(-0.000123, 'SCI', 2), '-1.23       -04');
  assert.equal(formatNumber(1.5e15, 'FIX', 2), ' 1.50        15');
  assert.equal(formatNumber(9.9999, 'FIX', 9).trimEnd(), ' 9.999900000');
});

test('prefix keys: FIX/SCI, STO/RCL, register arithmetic', () => {
  const c = run(new HP45(), 'fix 4');
  assert.equal(c.dispMode, 'FIX');
  assert.equal(c.dispDigits, 4);
  run(c, 'shift fix 3');
  assert.equal(c.dispMode, 'SCI');
  run(c, '5 sto 1 3 sto add 1 rcl 1');
  assert.equal(c.x, 8);
});

test('gold functions and trace', () => {
  const c = new HP45();
  run(c, '30');
  const res = c.press('sin');
  assert.equal(c.x, 0.5);
  assert.ok(res.trace.steps.length > 20);
  assert.ok(res.busy > 100);
  run(c, '2 shift sq');
  assert.equal(c.x, 1.414213562);
  run(c, 'shift d0');
  assert.equal(c.x, 2); // LAST x
  run(c, '2 enter 10 shift inv');
  assert.equal(c.x, 1024);
  run(c, 'shift chs 1 shift sin'); // RAD, asin 1
  assert.equal(c.x, 1.570796327);
});

test('errors', () => {
  const c = run(new HP45(), '1 enter 0 div');
  assert.ok(c.error);
  assert.equal(disp(c), ' Error');
  c.press('clx');
  assert.ok(!c.error);
  run(c, '0 ln');
  assert.ok(c.error);
});

test('polar conversion and statistics', () => {
  const c = run(new HP45(), '4 enter 3 toP');
  assert.equal(c.stack[0], 5);
  assert.equal(c.stack[1], 53.13010235);
  const s = run(new HP45(), '2 sigma 4 sigma 9 sigma shift rdn');
  assert.equal(s.stack[0], 5);
  assert.equal(s.stack[1], 3.605551275);
});

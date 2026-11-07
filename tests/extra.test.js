import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as X from '../js/engine/extra.js';
import { buildStory } from '../js/ui/story.js';
import { HP45 } from '../js/calc/hp45.js';

test('recipes compute the right values', () => {
  assert.equal(X.factorial(5).result, 120);
  assert.equal(X.factorial(0).result, 1);
  assert.ok(Math.abs(X.factorial(69).result / 1.711224524e98 - 1) < 1e-9);
  assert.equal(X.deltaPct(80, 100).result, 25);
  assert.equal(X.toDMS(1.5).result, 1.3);
  assert.equal(X.toDMS(2.758333333).result, 2.4530);
  assert.equal(X.fromDMS(1.3).result, 1.5);
  const R = new Array(10).fill(0);
  for (const v of [2, 4, 9]) X.sigma(v, 0, R, 1);
  assert.deepEqual([R[5], R[6], R[7]], [3, 101, 15]);
  const m = X.meanStd(R);
  assert.equal(m.result, 5);
  assert.equal(m.s, 3.605551275);
});

test('every recipe key gives a story in both languages', () => {
  const c = new HP45();
  const traces = [];
  const run = (seq) => {
    for (const k of seq.split(' ')) {
      const r = c.press(k);
      if (r.trace) traces.push(r.trace);
    }
  };
  run('d5 fact d8 d0 enter d1 d0 d0 dpct d1 dot d5 shift sto d1 dot d3 shift rcl d2 sigma d4 sigma d9 sigma shift rdn d4 shift sigma');
  const labels = traces.map((t) => t.label);
  for (const l of ['fact', 'dpct', 'toDMS', 'fromDMS', 'sigma', 'mean', 'sigmaMinus']) assert.ok(labels.includes(l), l);
  for (const tr of traces) {
    for (const lang of ['de', 'en']) {
      const st = buildStory(tr, lang);
      assert.ok(st.length >= 3, tr.label);
      for (const s of st) {
        assert.ok(!/undefined|NaN/.test(s.text), `${tr.label}: ${s.text}`);
        assert.ok(s.viz.idx >= 0 && s.viz.idx < tr.steps.length, tr.label);
      }
    }
  }
});

test('conversion keys: constant, derivation of the gallon, story', async () => {
  const { unitConst } = await import('../js/engine/extra.js');
  const t = [];
  const r = unitConst('ltrgal', 10, t);
  assert.equal(r.result, 3.785411784);
  assert.equal(r.recipe.at(-1).r, 3.785411784); // 231 × 2.54³ ÷ 1000, computed in BCD
  assert.equal(r.mul, 37.85411784);
  const c = new HP45();
  c.press('d1');
  c.press('d0');
  const res = c.press('d7'); // gold not pressed: this is just the digit 7
  assert.equal(res.trace, undefined);
  c.press('shift');
  const k = c.press('d7'); // cm/in
  assert.equal(c.x, 2.54);
  assert.equal(c.stack[1], 107);
  for (const lang of ['de', 'en']) {
    const st = buildStory(k.trace, lang);
    assert.equal(st.length, 3);
    assert.ok(st[2].text.includes('271,78') || st[2].text.includes('271.78'), st[2].text);
  }
});

test('HP-55 conversion and H.MS stories build', async () => {
  const { buildStory } = await import('../js/ui/story.js');
  const ex = await import('../js/engine/extra.js');
  for (const id of Object.keys(ex.CONV55)) {
    const t = [];
    const r = ex.convert(id, 10, t);
    const st = buildStory({ label: id, args: [10], steps: t, result: r.result, recipe: r.recipe, conv: r.conv }, 'de');
    assert.ok(st.length >= 3 && st[0].text.includes('10'), id);
  }
  const t = [];
  const r = ex.hmsAddSub(1.3, 2.45, 1, t);
  assert.equal(r.result, 4.15);
  assert.ok(buildStory({ label: 'hmsAdd', args: [1.3, 2.45], steps: t, result: r.result, recipe: r.recipe }, 'en').length > 3);
});

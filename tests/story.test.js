import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as f from '../js/engine/functions.js';
import { buildStory } from '../js/ui/story.js';

const CASES = [
  ['sin', [30], 'DEG', (t) => f.trig('sin', 30, 'DEG', t)],
  ['cos', [200], 'DEG', (t) => f.trig('cos', 200, 'DEG', t)],
  ['tan', [1], 'RAD', (t) => f.trig('tan', 1, 'RAD', t)],
  ['sin', [1e-12], 'RAD', (t) => f.trig('sin', 1e-12, 'RAD', t)],
  ['atan', [1], 'DEG', (t) => f.atan(1, 'DEG', t)],
  ['asin', [0.5], 'DEG', (t) => f.asin(0.5, 'DEG', t)],
  ['acos', [-0.3], 'RAD', (t) => f.acos(-0.3, 'RAD', t)],
  ['ln', [7], null, (t) => f.ln(7, t)],
  ['log', [2000], null, (t) => f.log(2000, t)],
  ['exp', [2], null, (t) => f.exp(2, t)],
  ['exp10', [-2.5], null, (t) => f.exp10(-2.5, t)],
  ['sqrt', [2], null, (t) => f.sqrt(2, t)],
  ['pow', [2, 10], null, (t) => f.pow(2, 10, t)],
];

test('every function gets a short story with valid pictures, in both languages', () => {
  for (const [label, args, angle, run] of CASES) {
    const steps = [];
    const result = run(steps);
    for (const lang of ['de', 'en']) {
      const story = buildStory({ label, args, angle, steps, result }, lang);
      assert.ok(story.length >= 3 && story.length <= 14, `${label}: ${story.length} steps`);
      for (const st of story) {
        assert.ok(st.title && st.text, `${label}: title and text`);
        assert.ok(!/undefined|NaN/.test(st.text + (st.merke ?? '')), `${label}: ${st.text}`);
        assert.ok(st.viz.idx >= 0 && st.viz.idx < steps.length, `${label}: viz index`);
      }
    }
  }
});

test('coin story for sin 30°: the counters match the trace', () => {
  const steps = [];
  const result = f.trig('sin', 30, 'DEG', steps);
  const story = buildStory({ label: 'sin', args: [30], angle: 'DEG', steps, result }, 'de');
  const quizzes = story.filter((s) => s.quiz).map((s) => s.quiz.answer);
  assert.deepEqual(quizzes, [0, 5, 2]);
  assert.ok(story.some((s) => s.merke?.includes('0 · 5 · 2 · 5')));
});

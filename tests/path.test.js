import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CHAPTERS } from '../js/path/chapters.js';
import { GLOSSARY } from '../js/glossary.js';
import { HP45 } from '../js/calc/hp45.js';
import { KEY_LAYOUTS } from '../js/calc/keys.js';

test('ten complete chapters in DE and EN with valid quizzes and links', () => {
  assert.equal(CHAPTERS.length, 10);
  for (const ch of CHAPTERS) {
    for (const lang of ['de', 'en']) {
      const L = ch[lang];
      assert.ok(L.title && L.goal && L.try && L.merke, `${ch.id} ${lang}`);
      assert.ok(L.cards.length >= 3, `${ch.id} cards`);
      const text = L.cards.map((c) => c[1]).join(' ') + L.try;
      for (const [, id] of text.matchAll(/\[\[([a-z]+)/g)) assert.ok(GLOSSARY[id], `${ch.id}: link ${id}`);
    }
    assert.equal(ch.de.cards.length, ch.en.cards.length, `${ch.id} card count`);
    ch.de.cards.forEach((c, i) => assert.equal(c[2], ch.en.cards[i][2], `${ch.id} card ${i} level`));
    assert.ok(ch.quiz.length >= 4 && ch.quiz.length <= 5);
    for (const q of ch.quiz) {
      for (const lang of ['de', 'en']) assert.equal(q[lang].length, 5, `${ch.id} quiz ${lang}`);
      assert.ok(q.ok >= 0 && q.ok <= 2);
    }
    assert.ok(['calc', 'lab', 'rpn', 'model'].includes(ch.try.kind));
  }
});

/** turn a hint like "30 f SIN" into key ids of the given model */
function ids(hint, model) {
  const flat = KEY_LAYOUTS[model].flat();
  const out = [];
  let mode = null;
  for (const tok of hint.split(' ')) {
    if (/^[0-9.]+$/.test(tok)) {
      for (const ch of tok) out.push(ch === '.' ? 'dot' : `d${ch}`);
      continue;
    }
    const map = { 'ENTER↑': 'enter', '■': 'shift', f: 'fkey', g: 'gkey', '+': 'add', '−': 'sub', '×': 'mul', '÷': 'div' };
    if (map[tok] && !(tok === 'g' && model !== 55)) {
      out.push(map[tok]);
      mode = tok;
      continue;
    }
    const k = mode === 'f' || mode === '■' ? flat.find((x) => x.gold === tok) : mode === 'g' ? flat.find((x) => x.blue === tok) : flat.find((x) => x.label === tok);
    assert.ok(k, `HP-${model}: no key "${tok}" in "${hint}"`);
    out.push(k.id);
    mode = null;
  }
  return out;
}

test('every calculator task can be solved with its hint on every model', () => {
  for (const ch of CHAPTERS.filter((c) => c.try.kind === 'calc')) {
    for (const model of [35, 45, 55]) {
      const calc = new HP45(model);
      let last;
      for (const id of ids(ch.try.hint[model], model)) {
        calc.press(id);
        last = id;
      }
      assert.ok(ch.try.check(calc, last), `${ch.id} on HP-${model}: x = ${calc.x}`);
    }
  }
});

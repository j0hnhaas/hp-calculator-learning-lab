import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GLOSSARY, GLOSSARY_GROUPS } from '../js/glossary.js';

test('every glossary term is complete in DE and EN and sits in exactly one group', () => {
  const grouped = Object.values(GLOSSARY_GROUPS).flat();
  for (const [id, e] of Object.entries(GLOSSARY)) {
    for (const lang of ['de', 'en']) {
      assert.ok(e[lang]?.term && e[lang]?.short, `${id} ${lang}`);
      for (const s of e[lang].see ?? []) assert.ok(GLOSSARY[s], `${id} → ${s}`);
      for (const [, ref] of `${e[lang].short} ${e[lang].image ?? ''} ${e[lang].more ?? ''}`.matchAll(/\[\[([a-z]+)/g)) assert.ok(GLOSSARY[ref], `${id}: link ${ref}`);
    }
    assert.equal(grouped.filter((g) => g === id).length, 1, `${id} grouped once`);
  }
  assert.equal(grouped.length, Object.keys(GLOSSARY).length);
});

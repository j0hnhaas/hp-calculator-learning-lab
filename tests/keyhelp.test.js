import { test } from 'node:test';
import assert from 'node:assert/strict';
import { KEY_LAYOUTS } from '../js/calc/keys.js';
import { KEYHELP, helpIdFor } from '../js/keyhelp.js';

test('every key and every f/g function of all models has a help card in DE and EN', () => {
  for (const model of [35, 45, 55]) {
    for (const k of KEY_LAYOUTS[model].flat()) {
      for (const id of [helpIdFor(k.id), k.gid, k.bid].filter(Boolean)) {
        const e = KEYHELP[id];
        assert.ok(e, `HP-${model}: missing help for ${id}`);
        for (const lang of ['de', 'en']) assert.ok(e[lang]?.n && e[lang]?.d, `${id} ${lang}`);
      }
    }
  }
});

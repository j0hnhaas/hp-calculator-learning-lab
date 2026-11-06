// Key help mode: tapping a key explains it instead of executing it.

import { t, rich, getLang } from '../i18n.js';
import { KEY_LAYOUTS } from '../calc/keys.js';
import { KEYHELP, helpIdFor } from '../keyhelp.js';
import { openSheet, closeSheet } from './sheet.js';
import { keys, stackPic } from './rpn-guide.js';

function textOf(entry, model) {
  const lang = getLang();
  return (model === 35 && entry[`${lang}35`]) || entry[lang] || entry.en;
}

function section(entry, label, gold, model) {
  if (!entry) return '';
  const tx = textOf(entry, model);
  const st = entry.st
    ? `<div class="mini-stacks kh-stacks">${stackPic(t('keyhelp.before'), entry.st[0])}<span class="kh-arrow">→</span>${stackPic(t('keyhelp.after'), entry.st[1])}</div>`
    : '';
  return `
    <section class="kh${gold ? ' gold' : ''}">
      ${gold ? `<span class="g-label">${t('keyhelp.gold')}</span>` : ''}
      <h3 class="kh-name">${tx.n}</h3>
      <p>${rich(tx.d)}</p>
      ${entry.ex ? `<p class="seq">${keys(entry.ex)}${tx.r ? ` <span class="res">→ ${tx.r}</span>` : ''}</p>` : ''}
      ${st}
      ${entry.lab ? `<button type="button" class="pill primary kh-lab" data-kh-lab="${gold ? 'gold' : 'main'}">${t('keyhelp.lab')}</button>` : ''}
    </section>`;
}

/**
 * Show the help card for a key of the current model.
 * @param {(lab:{label:string,args:number[],angle?:string}) => void} onLab
 */
export function openKeyHelp(keyId, model, onLab) {
  const key = KEY_LAYOUTS[model].flat().find((k) => k.id === keyId);
  if (!key) return;
  const main = KEYHELP[helpIdFor(keyId)];
  const gold = key.gid ? KEYHELP[key.gid] : null;
  const body = openSheet({
    title: t('keyhelp.title').replace('{k}', key.label || (model === 45 ? '■' : '')),
    className: 'sheet-key',
    html: section(main, key.label, false, model) + (gold ? section(gold, key.gold, true, model) : ''),
  });
  body.querySelectorAll('[data-kh-lab]').forEach((b) => b.addEventListener('click', () => {
    const entry = b.dataset.khLab === 'gold' ? gold : main;
    closeSheet();
    onLab(entry.lab);
  }));
}

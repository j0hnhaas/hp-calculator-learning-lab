// "Everything from 4 building blocks": add, shift, count, compare – and what each key costs.

import { t, rich, getLang } from '../i18n.js';
import { openSheet } from './sheet.js';
import { costOf } from '../engine/cost.js';
import * as fn from '../engine/functions.js';
import * as arith from '../engine/arith.js';

const BLOCKS = {
  add: '➕',
  shift: '⇄',
  count: '🔢',
  compare: '⚖️',
};

const SAMPLES = [
  { key: '+', ex: '123,4 + 5,67', exEn: '123.4 + 5.67', blocks: ['add', 'shift'], run: (tr) => arith.add(123.4, 5.67, tr) },
  { key: '×', ex: '123 × 45', blocks: ['add', 'shift', 'count'], run: (tr) => arith.mul(123, 45, tr) },
  { key: '÷', ex: '100 ÷ 7', blocks: ['add', 'shift', 'count', 'compare'], run: (tr) => arith.div(100, 7, tr) },
  { key: '√x', ex: '√2', blocks: ['add', 'shift', 'count', 'compare'], run: (tr) => fn.sqrt(2, tr) },
  { key: 'eˣ', ex: 'e²', blocks: ['add', 'shift', 'count', 'compare'], run: (tr) => fn.exp(2, tr) },
  { key: 'ln', ex: 'ln 7', blocks: ['add', 'shift', 'count', 'compare'], run: (tr) => fn.ln(7, tr) },
  { key: 'SIN', ex: 'sin 30°', blocks: ['add', 'shift', 'count', 'compare'], run: (tr) => fn.trig('sin', 30, 'DEG', tr) },
];

/** short cost label, e.g. "83 additions + 3 divisions" */
export function costLabel(steps) {
  const { adds, divs } = costOf(steps);
  if (!adds && !divs) return '';
  const a = t(adds === 1 ? 'cost.add1' : 'cost.adds').replace('{n}', adds);
  return divs ? `${a} ${t('cost.divs').replace('{n}', divs)}` : a;
}

export function openBlocks() {
  const lang = getLang();
  const tiles = Object.entries(BLOCKS)
    .map(([k, icon]) => `<div class="blk"><span class="blk-icon">${icon}</span><b>${t(`blocks.${k}`)}</b><span>${rich(t(`blocks.${k}.d`))}</span></div>`)
    .join('');
  const rows = SAMPLES.map((smp) => {
    const tr = [];
    smp.run(tr);
    const { adds, divs } = costOf(tr);
    return { smp, adds, divs };
  });
  const max = Math.max(...rows.map((r) => r.adds));
  const table = rows
    .map(({ smp, adds, divs }) => `
      <tr>
        <td><kbd class="kk">${smp.key}</kbd></td>
        <td class="blk-ex">${lang === 'de' ? smp.ex : smp.exEn ?? smp.ex}</td>
        <td class="blk-used">${smp.blocks.map((b) => BLOCKS[b]).join(' ')}</td>
        <td class="blk-cost"><span class="blk-bar" style="width:${Math.max(3, (adds / max) * 100)}%"></span><span class="blk-n">${adds}${divs ? ` +${divs}÷` : ''}</span></td>
      </tr>`)
    .join('');
  openSheet({
    title: t('blocks.title'),
    className: 'sheet-blocks',
    html: `
      <p>${rich(t('blocks.intro'))}</p>
      <div class="blk-grid">${tiles}</div>
      <h3 class="card-h">${t('blocks.costTitle')}</h3>
      <table class="blk-table">
        <tr><th></th><th></th><th>${t('blocks.used')}</th><th>${t('blocks.adds')}</th></tr>
        ${table}
      </table>
      <p class="note">${rich(t('blocks.note'))}</p>`,
  });
}

document.addEventListener('click', (e) => {
  if (e.target.closest('[data-blocks]')) openBlocks();
});

// One modal dialog for glossary entries and the RPN guide.
// Bottom sheet on phones, centred card on larger screens. Native <dialog>:
// focus trap, Esc to close and screen-reader semantics come for free.

import { t, rich, getLang } from '../i18n.js';
import { GLOSSARY, GLOSSARY_GROUPS } from '../glossary.js';
import { getLevel } from '../level.js';
import { mountUnitCircle } from './unit-circle.js';

let dlg;
let onCloseCb = null;

function ensure() {
  if (dlg) return dlg;
  dlg = document.createElement('dialog');
  dlg.className = 'sheet';
  dlg.innerHTML = `
    <div class="sheet-head">
      <h2 class="sheet-title"></h2>
      <button type="button" class="icon-btn sheet-close" aria-label="close">✕</button>
    </div>
    <div class="sheet-body"></div>`;
  document.body.appendChild(dlg);
  dlg.querySelector('.sheet-close').addEventListener('click', () => closeSheet());
  // a tap on the backdrop closes the dialog
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) closeSheet();
  });
  // Esc closes – also in browsers where the native close request is suppressed
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeSheet();
    }
  });
  dlg.addEventListener('close', () => {
    const cb = onCloseCb;
    onCloseCb = null;
    cb?.();
  });
  return dlg;
}

/**
 * @param {{title:string, html:string, onClose?:Function, className?:string}} opts
 * @returns {HTMLElement} the body element (for wiring up buttons)
 */
export function openSheet({ title, html, onClose, className = '' }) {
  const d = ensure();
  d.className = `sheet ${className}`.trim();
  d.querySelector('.sheet-title').innerHTML = title;
  const body = d.querySelector('.sheet-body');
  body.innerHTML = html;
  body.scrollTop = 0;
  onCloseCb = onClose ?? null;
  if (!d.open) d.showModal();
  else d.querySelector('.sheet-close').focus({ preventScroll: true });
  d.querySelector('.sheet-close').setAttribute('aria-label', t('lab.close'));
  return body;
}

export function closeSheet() {
  if (dlg?.open) dlg.close();
}

/** Show a glossary entry. Links inside it open other entries in the same dialog. */
export function openTerm(id) {
  const entry = GLOSSARY[id];
  const g = entry?.[getLang()] ?? entry?.en;
  if (!g) return;
  // beginners see the short version first; from "advanced" on the details are open
  const open = getLevel() === 'simple' ? '' : ' open';
  const see = (g.see ?? [])
    .filter((k) => GLOSSARY[k])
    .map((k) => `<button type="button" class="chip" data-term="${k}">${(GLOSSARY[k][getLang()] ?? GLOSSARY[k].en).term}</button>`)
    .join('');
  const body = openSheet({
    title: rich(g.term),
    className: 'sheet-term',
    html: `
      <p class="g-short">${rich(g.short)}</p>
      ${entry.viz === 'circle' ? '<div class="g-viz"></div>' : ''}
      ${g.image ? `<div class="g-image"><span class="g-label">${t('glossary.image')}</span><p>${rich(g.image)}</p></div>` : ''}
      ${g.more ? `<details class="g-more"${open}><summary>${t('glossary.more')}</summary><p>${rich(g.more)}</p></details>` : ''}
      ${see ? `<div class="g-see"><span class="g-label">${t('glossary.see')}</span><div class="g-chips">${see}</div></div>` : ''}
      <p class="g-all"><button type="button" class="term" data-glossary>${t('glossary.all')}</button></p>`,
  });
  const viz = body.querySelector('.g-viz');
  if (viz) mountUnitCircle(viz, id === 'atan' ? 45 : 30);
}

/** All terms, grouped: mathematics, technology inside the calculator, operation. */
export function openGlossary() {
  const lang = getLang();
  const groups = Object.entries(GLOSSARY_GROUPS).map(([k, ids]) => `
    <section class="g-group">
      <h3>${t('glossary.group.' + k)}</h3>
      <div class="g-chips">${ids.filter((id) => GLOSSARY[id]).map((id) => `<button type="button" class="chip" data-term="${id}">${(GLOSSARY[id][lang] ?? GLOSSARY[id].en).term}</button>`).join('')}</div>
    </section>`).join('');
  openSheet({ title: t('glossary.all'), className: 'sheet-term', html: `<p class="g-short">${t('glossary.intro')}</p>${groups}` });
}

// Any element with data-term – dashed links in texts, chips in the dialog – opens the glossary.
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-glossary]')) {
    e.preventDefault();
    openGlossary();
    return;
  }
  const el = e.target.closest('[data-term]');
  if (!el) return;
  e.preventDefault();
  openTerm(el.dataset.term);
});

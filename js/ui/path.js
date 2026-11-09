// The learning path: chapter overview, chapter cards, hands-on task, quiz and result.
// Lives in the shared bottom sheet; hands-on tasks run on the calculator or in the lab.

import { t, rich, getLang } from '../i18n.js';
import { getLevel } from '../level.js';
import { CHAPTERS, PASS } from '../path/chapters.js';
import { openSheet, closeSheet } from './sheet.js';
import { keys } from './rpn-guide.js';

const KEY = 'hp45.path';
let hooks = null; // { startChallenge, runLab, startRpn, model() }
let cur = null; // { ch, step, answers: [], picked: null }

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}
function save(p) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch { /* storage unavailable */ }
}
const progress = () => load();
function record(id, patch) {
  const p = load();
  p[id] = { ...(p[id] ?? {}), ...patch };
  save(p);
}

const L = (ch) => ch[getLang()] ?? ch.en;
const need = (n) => Math.ceil(n * PASS);

/** the cards of a chapter that fit the current level */
function cardsOf(ch) {
  const lv = getLevel();
  return L(ch).cards.filter(([, , l]) => !l || (l === 'detail' ? lv !== 'simple' : lv === 'pro'));
}

/** step layout: cards …, try, quiz 0 … n-1, result */
function layout(ch) {
  const c = cardsOf(ch).length;
  return { cards: c, tryAt: c, quizAt: c + 1, resultAt: c + 1 + ch.quiz.length, total: c + 2 + ch.quiz.length };
}

export function initPath(h) {
  hooks = h;
}

/** Open the path: resume the open chapter, or show the overview. */
export function openPath(chapter) {
  if (chapter !== undefined) return openChapter(chapter, 0);
  if (cur) return renderChapter();
  renderOverview();
}

function renderOverview() {
  cur = null;
  const p = progress();
  const passed = CHAPTERS.filter((c) => p[c.id]?.passed).length;
  const list = CHAPTERS.map((c, k) => {
    const st = p[c.id];
    const badge = st?.passed ? `<span class="pc-badge ok">✓ ${st.best}/${c.quiz.length}</span>` : st?.best !== undefined ? `<span class="pc-badge">${st.best}/${c.quiz.length}</span>` : '';
    return `<button type="button" class="pc-item${st?.passed ? ' passed' : ''}" data-ch="${k}">
      <span class="pc-no">${k + 1}</span><span class="pc-icon" aria-hidden="true">${c.icon}</span>
      <span class="pc-title">${L(c).title}</span>${badge}</button>`;
  }).join('');
  const body = openSheet({
    title: t('path.title'),
    className: 'sheet-path',
    html: `<p class="g-short">${t('path.intro')}</p>
      <div class="pc-progress"><div class="pc-bar"><span style="width:${(passed / CHAPTERS.length) * 100}%"></span></div>
      <span>${t('path.progress').replace('{n}', passed).replace('{m}', CHAPTERS.length)}</span></div>
      <div class="pc-list">${list}</div>`,
  });
  body.querySelectorAll('[data-ch]').forEach((b) => b.addEventListener('click', () => openChapter(+b.dataset.ch, 0)));
}

function openChapter(k, step) {
  cur = { ch: k, step, answers: [], picked: null };
  renderChapter();
}

function go(step) {
  cur.step = step;
  cur.picked = null;
  renderChapter();
}

function renderChapter() {
  const ch = CHAPTERS[cur.ch];
  const tx = L(ch);
  const lay = layout(ch);
  cur.step = Math.max(0, Math.min(cur.step, lay.total - 1));
  const s = cur.step;
  let main = '';
  let nav = '';
  if (s < lay.cards) {
    const [title, text] = cardsOf(ch)[s];
    main = `${s === 0 ? `<div class="pc-goal"><span class="g-label">${t('path.goal')}</span><p>${tx.goal}</p></div>` : ''}
      <h3 class="pc-card-title">${title}</h3><p class="pc-card">${rich(text)}</p>`;
    nav = navRow(s > 0, t('path.next'));
  } else if (s === lay.tryAt) {
    const tr = ch.try;
    const hint = tr.hint ? `<p class="seq">${keys(tr.hint[hooks.model()] ?? tr.hint[45])}</p>` : '';
    const done = progress()[ch.id]?.tried;
    const go = { calc: 'path.try.go', model: 'path.try.go', lab: 'path.try.lab', rpn: 'path.try.rpn' }[tr.kind];
    main = `<h3 class="pc-card-title">🛠️ ${t('path.try')}</h3><p class="pc-card">${rich(tx.try)}</p>${hint}
      ${done ? `<p class="pc-done">${t('path.try.done')}</p>` : ''}
      <button type="button" class="pill primary" data-go>${t(go)}</button>`;
    nav = navRow(true, t(done ? 'path.next' : 'path.try.skip'), !done);
  } else if (s < lay.resultAt) {
    const qi = s - lay.quizAt;
    const q = ch.quiz[qi];
    const [question, ...rest] = q[getLang()] ?? q.en;
    const why = rest.pop();
    const picked = cur.picked;
    const opts = rest.map((a, i) => {
      let cls = 'pq-opt';
      if (picked !== null) cls += i === q.ok ? ' right' : i === picked ? ' wrong' : ' dim';
      return `<button type="button" class="${cls}" data-opt="${i}" ${picked !== null ? 'disabled' : ''}>${a}</button>`;
    }).join('');
    const fb = picked === null ? '' : `<div class="pq-fb ${picked === q.ok ? 'ok' : 'no'}"><b>${t(picked === q.ok ? 'path.right' : 'path.wrong')}</b> ${why}</div>`;
    main = `<p class="pq-no">${t('path.q').replace('{n}', qi + 1).replace('{m}', ch.quiz.length)}</p>
      <h3 class="pc-card-title">${question}</h3><div class="pq-opts">${opts}</div>${fb}`;
    nav = picked === null ? navRow(true, null) : navRow(true, t('path.next'));
  } else {
    const n = cur.answers.filter(Boolean).length;
    const m = ch.quiz.length;
    const answered = cur.answers.length === m;
    const ok = answered && n >= need(m);
    if (answered) {
      const prev = progress()[ch.id] ?? {};
      record(ch.id, { best: Math.max(prev.best ?? 0, n), passed: prev.passed || ok });
    }
    const last = cur.ch === CHAPTERS.length - 1;
    main = `<h3 class="pc-card-title">${t('path.result')}</h3>
      ${answered ? `<p class="pr-score">${t('path.score').replace('{n}', n).replace('{m}', m)}</p>
      <p class="pr-verdict ${ok ? 'ok' : ''}">${ok ? t('path.passed') : t('path.failed').replace('{k}', need(m))}</p>` : ''}
      <div class="merke"><span class="merke-label">${t('path.merke')}</span><p>${tx.merke}</p></div>
      <div class="pr-actions">
        ${!last ? `<button type="button" class="pill primary" data-nextch>${t('path.nextch')}</button>` : ''}
        <button type="button" class="pill" data-retry>${t('path.retry')}</button>
        <button type="button" class="pill" data-all>${t('path.all')}</button>
      </div>`;
    nav = '';
  }
  const dots = Array.from({ length: lay.total }, (_, i) => `<span class="${i === s ? 'on' : i < s ? 'past' : ''}${i === lay.tryAt ? ' try' : i >= lay.quizAt && i < lay.resultAt ? ' quiz' : ''}"></span>`).join('');
  const body = openSheet({
    title: `<span class="pc-head"><span aria-hidden="true">${ch.icon}</span> ${t('path.chapter').replace('{n}', cur.ch + 1)}</span>${tx.title}`,
    className: 'sheet-path',
    html: `<div class="pc-dots" aria-hidden="true">${dots}</div>${main}${nav}
      <p class="pc-foot"><button type="button" class="term" data-all>${t('path.all')}</button></p>`,
  });
  wire(body, ch, lay);
}

function navRow(back, next, quiet = false) {
  return `<div class="pc-nav">
    ${back ? `<button type="button" class="pill" data-prev>◀ ${t('path.prev')}</button>` : '<span></span>'}
    ${next ? `<button type="button" class="pill${quiet ? '' : ' primary'}" data-next>${next} ▶</button>` : ''}</div>`;
}

function wire(body, ch, lay) {
  const on = (sel, f) => body.querySelectorAll(sel).forEach((b) => b.addEventListener('click', f));
  on('[data-prev]', () => go(cur.step - 1));
  on('[data-next]', () => go(cur.step + 1));
  on('[data-all]', () => renderOverview());
  on('[data-retry]', () => {
    cur.answers = [];
    go(lay.quizAt);
  });
  on('[data-nextch]', () => openChapter(cur.ch + 1, 0));
  on('[data-opt]', (e) => {
    const i = +e.currentTarget.dataset.opt;
    const qi = cur.step - lay.quizAt;
    if (qi === 0) cur.answers = [];
    cur.answers[qi] = i === ch.quiz[qi].ok;
    cur.picked = i;
    renderChapter();
  });
  on('[data-go]', () => startTry(ch, lay));
}

/** Leave the sheet for the calculator or the lab; come back when the task is solved. */
function startTry(ch, lay) {
  const k = cur.ch;
  const back = () => {
    record(ch.id, { tried: true });
    cur = { ch: k, step: lay.tryAt, answers: [], picked: null };
    renderChapter();
  };
  const label = t('path.bar').replace('{n}', k + 1);
  closeSheet();
  const tr = ch.try;
  const text = L(ch).try;
  if (tr.kind === 'lab') hooks.runLab(tr.ex, back);
  else if (tr.kind === 'rpn') hooks.startRpn(back);
  else {
    const check = tr.kind === 'model' ? (c) => c.model === tr.model : tr.check;
    hooks.startChallenge({ label, text, hint: tr.hint, check, onDone: back });
  }
}

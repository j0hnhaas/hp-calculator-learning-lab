// The "Inside" lab: replays the decimal CORDIC trace step by step.

import { t, tm, sup, sub, p10, onLang, getLang, rich, localize } from '../i18n.js';
import { buildStory, nf, coinDeg } from './story.js';
import { costLabel } from './blocks.js';
import { fmtFixed, S } from '../engine/decimal.js';
import { ATAN_STR, LN_STR } from '../engine/constants.js';
import * as fn from '../engine/functions.js';
import { convergence, MAX_DIGITS } from '../engine/convergence.js';
import { binTrig, binAtan, ATAN2, B as BIN_ONE, ITER, K as BIN_K } from '../engine/binary.js';

const ATAN2_NUM = ATAN2.map((v) => Number(v) / Number(BIN_ONE));
const BIN_LABELS = ['sin', 'cos', 'tan', 'atan'];
const isBin = (algo) => algo === 'binrot' || algo === 'binvec';
const isArith = (algo) => algo === 'add' || algo === 'mul' || algo === 'div';
const colorOf = (s, j) => DECADE_COLORS[(j ?? 0) % DECADE_COLORS.length];

const REG_NAMES = {
  theta: 'θ', X: 'X', Y: 'Y', M: 'M', P: 'P', sum: 'Σ', r: 'r', x: 'x', a: 'a',
  root: '√', rem: 'Rest', sin: 'sin', cos: 'cos', m: 'm',
};
const DECADE_COLORS = ['#e8b04a', '#e0603c', '#4fa3d9', '#6cc28a', '#b48ae0', '#e07ab4', '#c9c26a', '#7ad0d0', '#d08a5a'];
const OP_LABEL = {
  sin: 'SIN', cos: 'COS', tan: 'TAN', asin: 'SIN⁻¹', acos: 'COS⁻¹', atan: 'TAN⁻¹',
  ln: 'ln', log: 'log', exp: 'eˣ', exp10: '10ˣ', sqrt: '√x', pow: 'yˣ', pow35: 'xʸ', add: '+', sub: '−', mul: '×', div: '÷', inv: '1/x', sq: 'x²', pct: '%', cmin: 'cm/in', kglb: 'kg/lb', ltrgal: 'ltr/gal', fact: 'n!', dpct: 'Δ%', toDMS: '→D.MS', fromDMS: 'D.MS→', sigma: 'Σ+', sigmaMinus: 'Σ−', mean: 'x̄, s', toP: '→P', toR: '→R',
  sigma55: 'Σ+', sigmaMinus55: 'Σ−', mean55: 'x̄', sdev55: 's', lr: 'L.R.', yhat: 'ŷ', hmsAdd: 'H.MS+', hmsSub: 'H.MS−',
  in2mm: 'in→mm', mm2in: 'mm→in', ft2m: 'ft→m', m2ft: 'm→ft', gal2l: 'gal→l', l2gal: 'l→gal', lbm2kg: 'lbm→kg', kg2lbm: 'kg→lbm',
  lbf2n: 'lbf→N', n2lbf: 'N→lbf', btu2j: 'Btu→J', j2btu: 'J→Btu', f2c: '°F→°C', c2f: '°C→°F', d2r: '°→rad', r2d: 'rad→°',
};

const EXAMPLES = [
  { label: 'SIN 30°', run: (tr) => ({ label: 'sin', args: [30], angle: 'DEG', result: fn.trig('sin', 30, 'DEG', tr) }) },
  { label: 'TAN 1 rad', run: (tr) => ({ label: 'tan', args: [1], angle: 'RAD', result: fn.trig('tan', 1, 'RAD', tr) }) },
  { label: 'TAN⁻¹ 1', run: (tr) => ({ label: 'atan', args: [1], angle: 'DEG', result: fn.atan(1, 'DEG', tr) }) },
  { label: 'ln 7', run: (tr) => ({ label: 'ln', args: [7], result: fn.ln(7, tr) }) },
  { label: 'eˣ 2', run: (tr) => ({ label: 'exp', args: [2], result: fn.exp(2, tr) }) },
  { label: '√2', run: (tr) => ({ label: 'sqrt', args: [2], result: fn.sqrt(2, tr) }) },
];

const num = (v) => Number(v) / Number(S);
const CONV_PAD_L = 24;

/** "123 × 45 = 5535" for operators, "SIN 30 (DEG) = 0.5" for functions */
function opText(tr, args, unit) {
  const res = tr.resultText ?? fmtNum(tr.result);
  const [y, x] = tr.args.map(fmtNum);
  const infix = { add: '+', sub: '−', mul: '×', div: '÷' }[tr.label];
  if (infix) return `${y} ${infix} ${x} = ${res}`;
  if (tr.label === 'inv') return `1 ÷ ${y} = ${res}`;
  if (tr.label === 'sq') return `${y}² = ${res}`;
  if (tr.label === 'pct') return `${x} % × ${y} = ${res}`;
  if (tr.label === 'fact') return `${y}! = ${res}`;
  if (['cmin', 'kglb', 'ltrgal'].includes(tr.label)) return `${OP_LABEL[tr.label]} → ${res}`;
  if (tr.label === 'dpct') return `Δ% ${y} → ${x} = ${res}`;
  if (tr.label === 'sigma' || tr.label === 'sigmaMinus') return `${OP_LABEL[tr.label]} x = ${y} → n = ${res}`;
  if (tr.label === 'mean') return `${res}`;
  if (tr.conv) return `${y} ${tr.conv.from} = ${res} ${tr.conv.to}`;
  if (tr.label === 'sigma55' || tr.label === 'sigmaMinus55') return `${OP_LABEL[tr.label]} x = ${y}, y = ${x} → n = ${res}`;
  if (['mean55', 'sdev55', 'lr'].includes(tr.label)) return `${OP_LABEL[tr.label]}: ${res}`;
  if (tr.label === 'yhat') return `ŷ(${y}) = ${res}`;
  if (tr.label === 'hmsAdd' || tr.label === 'hmsSub') return `${y} ${tr.label === 'hmsAdd' ? '+' : '−'} ${x} (h.mmss) = ${res}`;
  return `${OP_LABEL[tr.label] ?? tr.label} ${args}${unit} = ${res}`;
}

/** BigInt digit string with an implied scale of 10^scale → readable decimal */
function scaled(str, scale) {
  const neg = str.startsWith('-');
  const d = (neg ? str.slice(1) : str).padStart(scale + 1, '0');
  const t = `${d.slice(0, -scale)}.${d.slice(-scale)}`.replace(/0+$/, '').replace(/\.$/, '');
  return (neg ? '-' : '') + t;
}

/** Story texts are our own markup (<b>) plus [[term|label]] links. */
function renderTrusted(str) {
  return String(str).replace(/\[\[([a-z]+)\|([^\]]+)\]\]/g, '<button type="button" class="term" data-term="$1">$2</button>');
}

/** The same calculation with classic binary CORDIC */
function binaryTwin(tr) {
  const steps = [];
  const [x] = tr.args;
  const result = tr.label === 'atan' ? binAtan(x, tr.angle, steps) : binTrig(tr.label, x, tr.angle, steps);
  return { ...tr, steps, result, method: 'bin' };
}

/** Parse "1,5", "-2.5e3", "1.2E-4" → number, or null */
function parseNumber(str) {
  const s = String(str).trim().replace(',', '.').replace(/\s+/g, '');
  if (!/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(s)) return null;
  const x = Number(s);
  if (!isFinite(x) || Math.abs(x) >= 1e100) return null;
  return x;
}

function fmtNum(x) {
  if (x === undefined) return '';
  if (Math.abs(x) >= 1e10 || (Math.abs(x) < 1e-4 && x !== 0)) return x.toExponential(9).replace('e', ' E');
  return String(Number(x.toPrecision(10)));
}

export class Lab {
  constructor(root) {
    this.root = root;
    this.trace = null;
    this.i = 0;
    this.timer = null;
    this.speed = 8;
    this.autoplay = true;
    this.guess = false;
    try {
      this.level = localStorage.getItem('hp45.level') || 'simple';
    } catch {
      this.level = 'simple';
    }
    this.build();
    this.applyLevel();
    onLang(() => {
      if (this.base) this.story = buildStory(this.base, getLang());
      this.renderCompare();
      this.render();
    });
  }

  build() {
    this.root.innerHTML = `
      <div class="lab-head">
        <h2 id="lab-title" data-i18n="lab.title"></h2>
        <button type="button" class="lab-close icon-btn" data-i18n-title="lab.close">✕</button>
      </div>
      <div class="lab-empty"><p data-i18n-rich="lab.empty"></p><button type="button" class="pill" data-blocks data-i18n="blocks.open"></button></div>
      <div class="lab-body" hidden>
        <div class="lab-op"><span class="op-text"></span><span class="op-algo"></span><button type="button" class="cost-badge" data-blocks></button></div>
        <div class="levels" role="group">
          <button type="button" data-lv="simple" data-i18n="level.simple"></button>
          <button type="button" data-lv="detail" data-i18n="level.detail"></button>
          <button type="button" data-lv="pro" data-i18n="level.pro"></button>
        </div>
        <div class="method" role="group" hidden>
          <button type="button" data-m="dec" data-i18n="method.dec"></button>
          <button type="button" data-m="bin" data-i18n="method.bin"></button>
        </div>
        <ol class="phases"></ol>
        <div class="viz-wrap"><canvas class="viz"></canvas></div>
        <p class="explain" aria-live="polite"></p>
        <div class="story" aria-live="polite">
          <h3 class="story-title"></h3>
          <p class="story-text"></p>
          <div class="quiz" hidden></div>
          <div class="merke" hidden><span class="merke-label"></span><p></p></div>
        </div>
        <div class="conv-box">
          <div class="conv-head"><h3 data-i18n-rich="lab.conv.title"></h3><span class="conv-now"></span></div>
          <div class="conv-wrap"><canvas class="conv" aria-hidden="true"></canvas></div>
          <p class="conv-note"></p>
        </div>
        <div class="controls">
          <button type="button" class="icon-btn" data-act="first" data-i18n-title="lab.first">⏮</button>
          <button type="button" class="icon-btn" data-act="prev" data-i18n-title="lab.prev">◀</button>
          <button type="button" class="icon-btn play" data-act="play" data-i18n-title="lab.play">▶</button>
          <button type="button" class="icon-btn" data-act="next" data-i18n-title="lab.next">▶❙</button>
          <button type="button" class="icon-btn" data-act="last" data-i18n-title="lab.last">⏭</button>
          <span class="stepno"></span>
        </div>
        <input type="range" class="scrub" min="0" max="0" value="0" aria-label="step">
        <div class="speedrow">
          <label><span data-i18n="lab.speed"></span> <input type="range" class="speed" min="1" max="40" value="8"></label>
          <label class="chk only-detail"><input type="checkbox" class="autoplay" checked> <span data-i18n="lab.autoplay"></span></label>
          <label class="chk only-simple"><input type="checkbox" class="guess"> <span data-i18n="lab.guess"></span></label>
        </div>
        <div class="tables">
          <div class="regs"><h3 class="regs-title"></h3><div class="reg-list"></div></div>
          <div class="consts"><h3 data-i18n-rich="lab.constants"></h3><table class="const-table"></table></div>
        </div>
        <div class="compare" hidden></div>
      </div>
      <div class="examples"><h3 data-i18n="lab.examples"></h3><div class="ex-buttons"></div></div>
      <form class="custom" novalidate>
        <h3 data-i18n="lab.custom.title"></h3>
        <div class="custom-row">
          <select class="c-fn" aria-label="function">
            <option value="sin">SIN</option><option value="cos">COS</option><option value="tan">TAN</option>
            <option value="asin">SIN⁻¹</option><option value="acos">COS⁻¹</option><option value="atan">TAN⁻¹</option>
            <option value="ln">ln</option><option value="log">log</option><option value="exp">eˣ</option>
            <option value="exp10">10ˣ</option><option value="sqrt">√x</option>
          </select>
          <input class="c-x" type="text" inputmode="decimal" autocomplete="off" value="1" aria-label="x">
          <select class="c-mode" aria-label="angle mode"><option>DEG</option><option>RAD</option><option>GRD</option></select>
          <button type="submit" class="chip go" data-i18n="lab.custom.go"></button>
        </div>
        <p class="custom-err" hidden></p>
      </form>
      <details class="about"><summary data-i18n="lab.about.title"></summary><p data-i18n-rich="lab.about.body"></p><button type="button" class="pill" data-blocks data-i18n="blocks.open"></button></details>`;

    const q = (s) => this.root.querySelector(s);
    this.el = {
      empty: q('.lab-empty'),
      body: q('.lab-body'),
      op: q('.op-text'),
      algo: q('.op-algo'),
      phases: q('.phases'),
      canvas: q('.viz'),
      explain: q('.explain'),
      stepno: q('.stepno'),
      scrub: q('.scrub'),
      play: q('.play'),
      regs: q('.reg-list'),
      consts: q('.const-table'),
      cost: q('.cost-badge'),
      conv: q('.conv'),
      method: q('.method'),
      compare: q('.compare'),
      convNow: q('.conv-now'),
      convNote: q('.conv-note'),
    };
    this.el.conv.addEventListener('pointerdown', (e) => {
      if (!this.trace) return;
      const r = this.el.conv.getBoundingClientRect();
      const n = this.trace.steps.length;
      const k = Math.round(((e.clientX - r.left - CONV_PAD_L) / (r.width - CONV_PAD_L - 8)) * (n - 1));
      this.stop();
      this.go(k);
    });
    this.root.querySelector('.levels').addEventListener('click', (e) => {
      const b = e.target.closest('[data-lv]');
      if (b) this.setLevel(b.dataset.lv);
    });
    q('.guess').addEventListener('change', (e) => {
      this.guess = e.target.checked;
      this.revealed = new Set();
      this.render();
    });
    this.root.querySelector('.quiz').addEventListener('click', (e) => {
      const b = e.target.closest('[data-guess]');
      if (b) this.answer(+b.dataset.guess);
    });
    this.el.method.addEventListener('click', (e) => {
      const b = e.target.closest('[data-m]');
      if (b) this.setMethod(b.dataset.m);
    });
    const form = q('.custom');
    const fnSel = q('.c-fn');
    const modeSel = q('.c-mode');
    const syncMode = () => { modeSel.hidden = !['sin', 'cos', 'tan', 'asin', 'acos', 'atan'].includes(fnSel.value); };
    fnSel.addEventListener('change', syncMode);
    syncMode();
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const err = q('.custom-err');
      err.hidden = true;
      const x = parseNumber(q('.c-x').value);
      if (x === null) {
        err.textContent = t('lab.custom.bad');
        err.hidden = false;
        return;
      }
      const f = fnSel.value;
      const mode = modeSel.value;
      const steps = [];
      try {
        let result;
        if (['sin', 'cos', 'tan'].includes(f)) result = fn.trig(f, x, mode, steps);
        else if (['asin', 'acos', 'atan'].includes(f)) result = fn[f](x, mode, steps);
        else result = fn[f](x, steps);
        if (!steps.length) {
          err.textContent = t('lab.custom.trivial');
          err.hidden = false;
          return;
        }
        this.load({ label: f, args: [x], angle: mode, result, steps });
      } catch {
        err.textContent = t('lab.custom.domain');
        err.hidden = false;
      }
    });
    q('.controls').addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]');
      if (b) this.act(b.dataset.act);
    });
    this.el.scrub.addEventListener('input', () => {
      this.stop();
      this.go(+this.el.scrub.value);
    });
    q('.speed').addEventListener('input', (e) => {
      this.speed = +e.target.value;
      if (this.timer) this.play();
    });
    q('.autoplay').addEventListener('change', (e) => {
      this.autoplay = e.target.checked;
    });
    const exb = q('.ex-buttons');
    for (const ex of EXAMPLES) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.textContent = ex.label;
      b.addEventListener('click', () => {
        const steps = [];
        const info = ex.run(steps);
        this.load({ ...info, steps });
      });
      exb.appendChild(b);
    }
    this.closeBtn = q('.lab-close');
    new ResizeObserver(() => this.draw()).observe(q('.viz-wrap'));
  }

  /** Load a new trace {label, args, steps, result, angle} */
  load(trace) {
    if (!trace || !trace.steps.length) return;
    this.stop();
    this.base = trace;
    this.binTrace = BIN_LABELS.includes(trace.label) ? binaryTwin(trace) : null;
    if (this.binTrace && !this.binTrace.steps.length) this.binTrace = null;
    this.decConv = convergence(trace.steps);
    this.binConv = this.binTrace ? convergence(this.binTrace.steps) : null;
    this.method ??= 'dec';
    if (this.level !== 'pro') this.method = 'dec';
    this.trace = this.method === 'bin' && this.binTrace ? this.binTrace : trace;
    this.story = buildStory(trace, getLang());
    this.revealed = new Set();
    this.feedback = {};
    this.renderMethod();
    this.renderCompare();
    this.prepare();
    this.el.scrub.max = String(this.count() - 1);
    this.i = 0;
    this.render();
    // in the simple level the reader sets the pace
    if (this.autoplay && this.level !== 'simple') this.play();
  }

  /** number of steps at the current level */
  count() {
    if (!this.trace) return 0;
    return this.level === 'simple' ? this.story.length : this.trace.steps.length;
  }

  applyLevel() {
    this.root.classList.toggle('lv-simple', this.level === 'simple');
    this.root.classList.toggle('lv-detail', this.level === 'detail');
    this.root.classList.toggle('lv-pro', this.level === 'pro');
    this.root.querySelectorAll('.levels button').forEach((b) => b.classList.toggle('on', b.dataset.lv === this.level));
  }

  setLevel(lv) {
    if (lv === this.level) return;
    this.level = lv;
    try {
      localStorage.setItem('hp45.level', lv);
    } catch { /* storage unavailable */ }
    this.applyLevel();
    if (!this.base) return;
    this.stop();
    if (lv !== 'pro' && this.method === 'bin') {
      this.method = 'dec';
      this.trace = this.base;
      this.prepare();
      this.renderMethod();
    }
    this.el.scrub.max = String(this.count() - 1);
    this.i = 0;
    this.render();
  }

  /** "guess along": the user answers how often a coin fits */
  answer(n) {
    const st = this.story[this.i];
    if (!st?.quiz) return;
    this.feedback[this.i] = n === st.quiz.answer ? { ok: true } : { ok: false, n };
    this.revealed.add(this.i);
    this.render();
  }

  setMethod(m) {
    this.method = m;
    if (!this.base) return;
    this.stop();
    this.trace = m === 'bin' && this.binTrace ? this.binTrace : this.base;
    this.prepare();
    this.el.scrub.max = String(this.trace.steps.length - 1);
    this.i = 0;
    this.renderMethod();
    this.render();
    if (this.autoplay) this.play();
  }

  renderMethod() {
    const box = this.el.method;
    box.hidden = !this.binTrace;
    box.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.m === (this.binTrace ? this.method : 'dec')));
  }

  /** Side-by-side numbers: decimal HP method vs. classic binary CORDIC */
  renderCompare() {
    const el = this.el.compare;
    el.hidden = !this.binTrace;
    if (!this.binTrace) return;
    const ops = (steps) => {
      let micro = 0;
      let adds = 0;
      for (const s of steps) {
        if (s.phase === 'pdiv' && s.algo === 'trig') { adds += 1; if (!s.done) micro++; }
        else if (s.phase === 'pmul') { micro++; adds += 2; }
        else if (s.phase === 'vec' && s.msg[0] !== 'atan.start') { adds += 2; if (!s.done) micro++; }
        else if (s.phase === 'sum') { micro++; adds += 1; }
        else if (s.phase === 'rot') { micro++; adds += 3; }
      }
      return { micro, adds };
    };
    const d = ops(this.base.steps);
    const b = ops(this.binTrace.steps);
    const dr = this.base.result;
    const br = this.binTrace.result;
    const row = (k, a, c, n = false) => `<tr class="${n ? 'num' : ''}"><th>${t('cmp.' + k)}</th><td>${a}</td><td>${c}</td></tr>`;
    el.innerHTML = `
      <h3>${t('cmp.title')}</h3>
      <table class="cmp-table">
        <tr><th></th><th>${t('method.dec')}</th><th>${t('method.bin')}</th></tr>
        ${row('result', fmtNum(dr), fmtNum(br) + (dr === br ? '' : ' <span class="diff">≠</span>'), true)}
        ${row('micro', d.micro, b.micro, true)}
        ${row('adds', d.adds, b.adds, true)}
        ${row('consts', '7', String(ITER), true)}
        ${row('dir', t('cmp.dir.dec'), t('cmp.dir.bin'))}
        ${row('gain', t('cmp.gain.dec'), t('cmp.gain.bin').replace('{K}', (Number(BIN_K) / Number(BIN_ONE)).toFixed(10)))}
        ${row('format', t('cmp.format.dec'), t('cmp.format.bin'))}
        ${row('small', t('cmp.small.dec'), t('cmp.small.bin'))}
      </table>
      <p class="cmp-note">${rich(t('cmp.conclusion'))}</p>`;
  }

  /** Precompute per-step context: phase groups and the target of each algorithm run. */
  prepare() {
    const steps = this.trace.steps;
    const groups = [];
    let ctx = {};
    this.ctx = steps.map((s, idx) => {
      const prev = groups.at(-1);
      if (!prev || prev.algo !== s.algo || prev.phase !== s.phase) groups.push({ algo: s.algo, phase: s.phase, start: idx });
      if (s.phase === 'reduce') ctx = { ...ctx, theta0: num(s.regs.theta) };
      if (s.msg?.[0] === 'atan.start' || s.msg?.[0] === 'binvec.start') ctx = { ...ctx, atanStart: { x: num(s.vec.X), y: num(s.vec.Y) } };
      if (s.algo === 'exp' && s.phase === 'init') ctx = { ...ctx, Pinit: num(s.regs.P) };
      if (s.algo === 'trig' && s.phase === 'init') ctx = { ...ctx, resid: num(s.regs.Y) };
      if (s.algo === 'atan' && s.phase === 'resid') ctx = { ...ctx, resid: num(s.regs.theta) };
      if (s.phase === 'pdiv' && s.msg[0] === 'ln.start') ctx = { ...ctx, M: num(s.regs.M) };
      if (s.phase === 'pdiv' && s.msg[0] === 'exp.start') ctx = { ...ctx, r0: num(s.regs.r) };
      return { group: groups.length - 1, ...ctx };
    });
    // exp: final P is the target of the pseudo-multiplication
    let lastP;
    for (let k = steps.length - 1; k >= 0; k--) {
      const s = steps[k];
      if (s.algo === 'exp' && s.regs?.P !== undefined && s.phase === 'pmul') lastP ??= num(s.regs.P);
      if (s.algo === 'exp' && (s.phase === 'pmul' || s.phase === 'init')) this.ctx[k].Pend = lastP;
      if (s.msg?.[0] === 'exp.start') lastP = undefined;
    }
    this.groups = groups;
    this.conv = convergence(steps);
    this.multiAlgo = new Set(steps.map((s) => s.algo)).size > 1;
  }

  act(a) {
    if (!this.trace) return;
    const n = this.count();
    if (a === 'play') return this.timer ? this.stop() : this.play();
    this.stop();
    if (a === 'first') this.go(0);
    if (a === 'prev') this.go(this.i - 1);
    if (a === 'next') this.go(this.i + 1);
    if (a === 'last') this.go(n - 1);
  }

  go(i) {
    const n = this.count();
    this.i = Math.max(0, Math.min(n - 1, i));
    this.render();
  }

  play() {
    clearInterval(this.timer);
    if (this.i >= this.count() - 1) this.i = 0;
    const simple = this.level === 'simple';
    this.timer = setInterval(() => {
      if (this.i >= this.count() - 1) return this.stop();
      // stop at a question the user has not answered yet
      if (simple && this.guess && this.story[this.i]?.quiz && !this.revealed.has(this.i)) return this.stop();
      this.go(this.i + 1);
    }, simple ? 40000 / this.speed : 1000 / this.speed);
    this.el.play.textContent = '❚❚';
  }

  stop() {
    clearInterval(this.timer);
    this.timer = null;
    if (this.el) this.el.play.textContent = '▶';
  }

  render() {
    const has = !!this.trace;
    this.el.empty.hidden = has;
    this.el.body.hidden = !has;
    if (!has) return;
    const tr = this.trace;
    if (this.level === 'simple') return this.renderStory();
    const s = tr.steps[this.i];
    const args = tr.args.map(fmtNum).join(', ');
    const unit = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'toP', 'toR'].includes(tr.label) && tr.angle ? ` (${tr.angle})` : '';
    this.el.op.textContent = opText(tr, args, unit);
    this.el.cost.textContent = tr.noCost ? '' : costLabel(tr.steps);
    this.el.cost.hidden = !this.el.cost.textContent;
    this.el.algo.textContent = t('algo.' + s.algo) + (this.binTrace && !isBin(s.algo) ? ` · ${t('method.dec')}` : '');
    this.root.querySelector('.regs-title').innerHTML = rich(t(isBin(s.algo) ? 'lab.registers.bin' : 'lab.registers'));
    this.el.explain.innerHTML = rich(tm(s.msg));
    this.el.stepno.textContent = `${t('lab.step')} ${this.i + 1} ${t('lab.of')} ${tr.steps.length}`;
    this.el.scrub.value = String(this.i);
    this.renderPhases();
    this.root.querySelector('.conv-box').hidden = !this.conv?.some(Boolean);
    const cv = this.conv?.[this.i];
    this.el.convNow.textContent = cv ? `${cv.quantity}: ${t('lab.conv.digits').replace('{n}', cv.digits >= MAX_DIGITS ? '≥ 16' : cv.digits.toFixed(1))}` : '';
    const noteKey = { pdiv: 'pdiv', vec: 'pdiv', pmul: 'pmul', init: 'pmul', sum: 'sum', resid: 'resid', digit: 'sqrt', rot: 'bin' }[s.phase] ?? 'general';
    this.el.convNote.innerHTML = rich(t('lab.conv.note.' + noteKey));
    this.renderRegs(s);
    this.renderConsts(s);
    this.draw();
  }

  renderStory() {
    const tr = this.trace;
    const lang = getLang();
    const st = this.story[this.i];
    const args = tr.args.map(fmtNum).join(', ');
    const unit = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'toP', 'toR'].includes(tr.label) && tr.angle ? ` (${tr.angle})` : '';
    this.el.op.textContent = opText(tr, args, unit);
    this.el.cost.textContent = tr.noCost ? '' : costLabel(tr.steps);
    this.el.cost.hidden = !this.el.cost.textContent;
    this.el.algo.textContent = '';
    this.el.stepno.textContent = `${t('lab.step')} ${this.i + 1} ${t('lab.of')} ${this.story.length}`;
    this.el.scrub.value = String(this.i);
    const box = this.root.querySelector('.story');
    box.querySelector('.story-title').textContent = localize(st.title);
    const quiz = box.querySelector('.quiz');
    const ask = this.guess && st.quiz && !this.revealed.has(this.i);
    this.hideCurrent = ask;
    if (ask) {
      box.querySelector('.story-text').innerHTML = rich(localize(st.quiz.question));
      quiz.hidden = false;
      quiz.innerHTML = Array.from({ length: st.quiz.max + 1 }, (_, n) => `<button type="button" class="chip" data-guess="${n}">${n}</button>`).join('');
    } else {
      box.querySelector('.story-text').innerHTML = renderTrusted(localize(st.text));
      const fb = this.feedback?.[this.i];
      quiz.hidden = !fb;
      quiz.innerHTML = fb ? `<p class="fb ${fb.ok ? 'ok' : 'no'}">${fb.ok ? t('lab.guess.ok') : t('lab.guess.no').replace('{n}', st.quiz.answer).replace('{g}', fb.n)}</p>` : '';
    }
    const m = box.querySelector('.merke');
    m.hidden = !st.merke || ask;
    if (st.merke) {
      m.querySelector('.merke-label').textContent = t('lab.merke');
      m.querySelector('p').innerHTML = renderTrusted(localize(st.merke));
    }
    void lang;
    this.draw();
  }

  renderPhases() {
    const cur = this.ctx[this.i].group;
    this.el.phases.innerHTML = '';
    this.el.phases.hidden = this.groups.length > 16; // e.g. 69! – far too many chips
    this.groups.forEach((g, gi) => {
      // skip consecutive duplicates of the same phase label (e.g. small steps)
      const li = document.createElement('li');
      const tag = this.multiAlgo ? `${{ trig: 'tan', atan: 'atan', ln: 'ln', exp: 'exp', sqrt: '√', binrot: 'bin', binvec: 'bin' }[g.algo]} · ` : '';
      li.textContent = tag + t('phase.' + g.phase);
      li.className = gi === cur ? 'cur' : gi < cur ? 'done' : '';
      li.addEventListener('click', () => {
        this.stop();
        this.go(g.start);
      });
      this.el.phases.appendChild(li);
    });
  }

  renderRegs(s) {
    const prev = this.i > 0 ? this.trace.steps[this.i - 1] : null;
    const box = this.el.regs;
    box.innerHTML = '';
    const showCol = ['pdiv', 'pmul', 'vec', 'rot'].includes(s.phase) && s.j !== undefined;
    for (const [name, v] of Object.entries(s.regs ?? {})) {
      const str = typeof v === 'string' ? v : fmtFixed(v, 15);
      const pstrRaw = prev?.regs?.[name];
      const pstr = pstrRaw === undefined ? null : typeof pstrRaw === 'string' ? pstrRaw : fmtFixed(pstrRaw, 15);
      const row = document.createElement('div');
      row.className = 'reg';
      const lbl = document.createElement('span');
      lbl.className = 'reg-name';
      lbl.textContent = REG_NAMES[name] ?? name;
      const digits = document.createElement('span');
      digits.className = 'bcd';
      const point = str.indexOf('.');
      const col = s.j === 0 ? point - 1 : point + (s.j ?? 0);
      // align by the decimal point
      const intLen = point < 0 ? str.length : point;
      const pad = Math.max(0, 4 - intLen);
      for (let p = 0; p < pad; p++) digits.appendChild(cell(' ', 'pad'));
      for (let k = 0; k < str.length; k++) {
        const ch = str[k];
        let cls = ch === '.' ? 'pt' : '';
        if (showCol && k === col) cls += ' col';
        if (pstr && pstr.length === str.length && pstr[k] !== ch) cls += ' chg';
        else if (pstr && pstr.length !== str.length && typeof v !== 'string') cls += '';
        digits.appendChild(cell(ch, cls));
      }
      row.append(lbl, digits);
      box.appendChild(row);
    }
    if (s.result !== undefined) {
      const row = document.createElement('div');
      row.className = 'reg result';
      row.innerHTML = `<span class="reg-name">=</span><span class="res">${fmtNum(s.result)}</span>`;
      box.appendChild(row);
    }
  }

  renderConsts(s) {
    const tbl = this.el.consts;
    if (isBin(s.algo)) {
      // binary: 36 constants – show a window around the current iteration
      tbl.parentElement.hidden = false;
      const cur = s.phase === 'rot' ? s.i : -1;
      const from = Math.max(0, Math.min(ITER - 8, cur - 3));
      const sig = s.sig ?? [];
      let html = `<tr><th>i</th><th></th><th>σ</th></tr>`;
      for (let i = from; i < from + 8; i++) {
        const sg = sig[i];
        html += `<tr class="${i === cur ? 'cur' : ''}" style="--dc:${DECADE_COLORS[i % DECADE_COLORS.length]}">
          <td><span class="dot"></span>${i}</td>
          <td><span class="cname">atan(2${sup(-i)})</span><span class="cval">${ATAN2_NUM[i].toFixed(12)}</span></td>
          <td class="qv">${sg === undefined ? '·' : sg > 0 ? '+' : '−'}</td></tr>`;
      }
      tbl.innerHTML = html + `<tr><td colspan="3" class="more">… ${ITER} ${t('cmp.consts.unit')}</td></tr>`;
      return;
    }
    const trigLike = s.algo === 'trig' || s.algo === 'atan';
    const logLike = s.algo === 'ln' || s.algo === 'exp';
    tbl.parentElement.hidden = !(trigLike || logLike);
    if (!(trigLike || logLike)) return;
    const strs = trigLike ? ATAN_STR : LN_STR;
    const fname = trigLike ? (j) => `atan(${p10(j)})` : (j) => (j === 0 ? 'ln 2' : `ln(1+${p10(j)})`);
    const q = s.q ?? [];
    let html = `<tr><th>j</th><th></th><th>${t('lab.count')}<sub>j</sub></th></tr>`;
    strs.forEach((str, j) => {
      const curRow = s.j === j && ['pdiv', 'pmul', 'vec', 'sum'].includes(s.phase);
      html += `<tr class="${curRow ? 'cur' : ''}" style="--dc:${DECADE_COLORS[j]}">
        <td><span class="dot"></span>${j}</td>
        <td><span class="cname">${fname(j)}</span><span class="cval">${str.slice(0, 14)}</span></td>
        <td class="qv">${q[j] ?? '·'}</td></tr>`;
    });
    tbl.innerHTML = html;
  }

  // ------------------------------------------------------------ drawing

  draw() {
    if (!this.trace || this.el.body.hidden) return;
    const c = this.el.canvas;
    const w = c.parentElement.clientWidth;
    const h = Math.round(Math.min(320, Math.max(200, w * 0.62)));
    const dpr = window.devicePixelRatio || 1;
    if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      c.style.height = `${h}px`;
    }
    const g = c.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    g.font = '12px ui-monospace, Menlo, Consolas, monospace';
    if (this.level === 'simple') return this.drawStoryViz(g, w, h);
    const s = this.trace.steps[this.i];
    const ctx = this.ctx[this.i];
    if (s.algo === 'trig' || s.algo === 'atan' || isBin(s.algo)) this.drawAngle(g, w, h, s, ctx);
    else if (s.algo === 'ln' || s.algo === 'exp') this.drawTrack(g, w, h, s, ctx);
    else if (isArith(s.algo)) this.drawArith(g, w, h, s);
    else if (s.algo === 'const') this.drawConst(g, w, h, s);
    else this.drawSqrt(g, w, h, s);
    this.drawConv();
  }

  /** Vectors in the first quadrant plus a zoom window around the tip. */
  drawAngle(g, w, h, s, ctx) {
    const steps = this.trace.steps;
    const mainW = Math.min(h * 1.05, w * 0.55);
    const R = mainW * 0.82;
    const ox = 16;
    const oy = h - 18;
    const css = getComputedStyle(this.root);
    const ink = css.getPropertyValue('--lab-ink').trim() || '#ddd';
    const dim = css.getPropertyValue('--lab-dim').trim() || '#666';

    // axes and unit arc
    g.strokeStyle = dim;
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(ox, oy);
    g.lineTo(ox + R * 1.12, oy);
    g.moveTo(ox, oy);
    g.lineTo(ox, oy - R * 1.12);
    g.stroke();
    g.beginPath();
    g.arc(ox, oy, R, -Math.PI / 2, 0);
    g.stroke();

    const toPx = (x, y) => [ox + x * R, oy - y * R];

    // target angle
    let target;
    if (s.algo === 'trig' || s.algo === 'binrot') target = ctx.theta0;
    else if (ctx.atanStart) target = Math.atan2(ctx.atanStart.y, ctx.atanStart.x);
    if (target !== undefined) {
      g.setLineDash([4, 4]);
      g.strokeStyle = ink;
      g.globalAlpha = 0.6;
      g.beginPath();
      g.moveTo(ox, oy);
      g.lineTo(...toPx(Math.cos(target) * 1.1, Math.sin(target) * 1.1));
      g.stroke();
      g.setLineDash([]);
      g.globalAlpha = 1;
    }

    // consumed angle as coloured arc segments (one colour per decade)
    // Which micro-rotations to draw, in which order, from where, in which direction
    const q = s.q ?? [];
    const consts = ATAN_STR.map(Number);
    const order = []; // segments {c: angle, d: ±1, j: colour index}
    let start = 0;
    let dir = 1;
    const asc = (counts) => counts.forEach((n, j) => { for (let k = 0; k < n; k++) order.push({ c: consts[j], d: 1, j }); });
    const desc = (counts) => { for (let j = counts.length - 1; j >= 0; j--) for (let k = 0; k < counts[j]; k++) order.push({ c: consts[j], d: 1, j }); };
    if (s.algo === 'trig' && (s.phase === 'pdiv' || s.phase === 'init')) asc(q);
    else if (s.algo === 'trig' && s.phase === 'pmul') {
      desc(q.map((n, j) => n - (s.qLeft?.[j] ?? 0)));
      start = ctx.resid ?? 0;
    } else if (s.algo === 'atan' && (s.phase === 'vec' || s.phase === 'resid')) {
      asc(q);
      start = target ?? 0;
      dir = -1;
    } else if (s.algo === 'atan' && s.phase === 'sum') {
      desc(this.sumDone(s));
      start = ctx.resid ?? 0;
    } else if (isBin(s.algo) && s.sig) {
      // binary CORDIC: one rotation per iteration, forwards or backwards
      s.sig.forEach((sg, i) => order.push({ c: ATAN2_NUM[i], d: sg, j: i }));
      if (s.algo === 'binvec') {
        start = target ?? 0;
        dir = -1;
      }
    }
    const rArc = R * 0.62;
    let a0 = start;
    for (const seg of order) {
      const a1 = a0 + dir * seg.d * seg.c;
      g.strokeStyle = colorOf(s, seg.j);
      g.lineWidth = 7;
      g.beginPath();
      g.arc(ox, oy, rArc, -Math.max(a0, a1), -Math.min(a0, a1));
      g.stroke();
      g.strokeStyle = '#0008';
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(...toPx(Math.cos(a0) * (rArc / R - 0.03), Math.sin(a0) * (rArc / R - 0.03)));
      g.lineTo(...toPx(Math.cos(a0) * (rArc / R + 0.03), Math.sin(a0) * (rArc / R + 0.03)));
      g.stroke();
      a0 = a1;
    }

    // trail of vectors of the current algorithm run
    const startIdx = this.findRunStart();
    g.lineWidth = 1;
    for (let k = startIdx; k < this.i; k++) {
      const v = steps[k].vec;
      if (!v || steps[k].algo !== s.algo) continue;
      g.strokeStyle = dim;
      g.beginPath();
      g.moveTo(ox, oy);
      g.lineTo(...toPx(num(v.X), num(v.Y)));
      g.stroke();
    }

    // current vector
    let vx;
    let vy;
    if (s.vec) {
      vx = num(s.vec.X);
      vy = num(s.vec.Y);
      const scale = Math.max(1, Math.hypot(vx, vy) / 1.08);
      vx /= scale;
      vy /= scale;
      arrow(g, ox, oy, ...toPx(vx, vy), '#ff4a33', 2.5);
    }

    // labels
    g.fillStyle = ink;
    if (s.vec) {
      const len = Math.hypot(num(s.vec.X), num(s.vec.Y));
      g.fillText(`|v| = ${len.toPrecision(8)}`, ox + 6, 16);
      g.fillText(`∠ = ${(Math.atan2(num(s.vec.Y), num(s.vec.X))).toFixed(10)}`, ox + 6, 32);
    } else if (s.regs?.theta !== undefined) {
      g.fillText(`θ = ${num(s.regs.theta).toFixed(12)}`, ox + 6, 16);
    }

    // zoom window: follows the vector tip (or the end of the angle arcs)
    const zx = mainW + 26;
    const zw = w - zx - 8;
    if (zw < 90 || target === undefined) return;
    const zh = h - 16;
    const zy = 8;
    const bin = isBin(s.algo);
    const j = bin ? Math.max(0, Math.min(ITER - 1, s.i ?? 0)) : Math.max(0, Math.min(6, s.j ?? 0));
    // one micro-step of the current decade (or bit) ≈ 1/3 of the window
    const ppu = (Math.min(zw, zh) / 3) * (bin ? 2 ** j : 10 ** j);
    const rho = rArc / R;
    const cx = s.vec ? num(s.vec.X) : Math.cos(a0) * rho;
    const cy = s.vec ? num(s.vec.Y) : Math.sin(a0) * rho;
    const Z = (x, y) => [zx + zw / 2 + (x - cx) * ppu, zy + zh / 2 - (y - cy) * ppu];
    g.save();
    g.strokeStyle = dim;
    g.lineWidth = 1;
    g.strokeRect(zx, zy, zw, zh);
    g.beginPath();
    g.rect(zx, zy, zw, zh);
    g.clip();

    // reference: the target ray, or the x-axis while vectoring
    const span = zw / ppu;
    const L = Math.hypot(cx, cy);
    g.setLineDash([4, 4]);
    g.strokeStyle = ink;
    g.globalAlpha = 0.6;
    g.beginPath();
    if ((s.algo === 'atan' && (s.phase === 'vec' || s.phase === 'resid')) || (s.algo === 'binvec' && s.phase !== 'final')) {
      g.moveTo(...Z(cx - span, 0));
      g.lineTo(...Z(cx + span, 0));
    } else {
      g.moveTo(...Z(Math.cos(target) * (L - span), Math.sin(target) * (L - span)));
      g.lineTo(...Z(Math.cos(target) * (L + span), Math.sin(target) * (L + span)));
    }
    g.stroke();
    g.setLineDash([]);
    g.globalAlpha = 1;

    // angle arcs, magnified (only while there is no vector yet)
    if (!s.vec) {
      let b0 = start;
      for (const seg of order) {
        const b1 = b0 + dir * seg.d * seg.c;
        g.strokeStyle = colorOf(s, seg.j);
        g.lineWidth = 8;
        g.beginPath();
        // sample only the part of the arc near the window
        const lo = Math.max(Math.min(b0, b1), Math.atan2(cy, cx) - 2 * span / rho);
        const hi = Math.min(Math.max(b0, b1), Math.atan2(cy, cx) + 2 * span / rho);
        if (hi > lo) {
          for (let n = 0; n <= 40; n++) {
            const a = lo + ((hi - lo) * n) / 40;
            const [px, py] = Z(Math.cos(a) * rho, Math.sin(a) * rho);
            if (n === 0) g.moveTo(px, py);
            else g.lineTo(px, py);
          }
          g.stroke();
          // boundary tick between micro-steps
          const [tx, ty] = Z(Math.cos(b0) * rho, Math.sin(b0) * rho);
          g.fillStyle = '#000';
          g.fillRect(tx - 1, ty - 6, 2, 12);
        }
        b0 = b1;
      }
    }

    // tips of the vectors: every micro-rotation leaves a dot
    for (let k = startIdx; k <= this.i; k++) {
      const v = steps[k].vec;
      if (!v || steps[k].algo !== s.algo) continue;
      const [px, py] = Z(num(v.X), num(v.Y));
      g.fillStyle = k === this.i ? '#ff4a33' : dim;
      g.beginPath();
      g.arc(px, py, k === this.i ? 4.5 : 2.5, 0, Math.PI * 2);
      g.fill();
    }
    if (s.vec) {
      // the vector itself, coming in from the origin
      g.strokeStyle = '#ff4a33';
      g.lineWidth = 1.5;
      g.beginPath();
      g.moveTo(...Z(cx - (cx / L) * span, cy - (cy / L) * span));
      g.lineTo(...Z(cx, cy));
      g.stroke();
    }
    g.restore();
    g.fillStyle = ink;
    g.fillText(`${t('lab.zoom')} ×${bin ? '2' : '10'}${sup(j)}`, zx + 6, zy + 16);
  }

  /** Simple level: draw the picture that belongs to the current story step. */
  drawStoryViz(g, w, h) {
    const viz = this.story[this.i]?.viz;
    if (!viz) return;
    // while the user is guessing, show the picture from before this coin
    const raw = this.hideCurrent && viz.prev !== undefined && viz.prev >= 0 ? viz.prev : viz.idx;
    const idx = Math.max(0, Math.min(this.trace.steps.length - 1, raw));
    const save = this.i;
    this.i = idx; // the detail drawings read this.i (trails, sums)
    try {
      const s = this.trace.steps[idx];
      const ctx = this.ctx[idx];
      if (viz.kind === 'coins') this.drawCoins(g, w, h, s, ctx, viz.j);
      else if (s.algo === 'const') this.drawConst(g, w, h, s);
      else if (isArith(s.algo)) this.drawArith(g, w, h, s);
      else if (viz.kind === 'track' && (s.algo === 'ln' || s.algo === 'exp')) this.drawTrack(g, w, h, s, ctx);
      else if (viz.kind === 'sqrt' && s.algo === 'sqrt') this.drawSqrt(g, w, h, s);
      else if (s.algo === 'trig' || s.algo === 'atan') this.drawAngle(g, w, h, s, ctx);
      else if (s.algo === 'ln' || s.algo === 'exp') this.drawTrack(g, w, h, s, ctx);
      else this.drawSqrt(g, w, h, s);
    } finally {
      this.i = save;
    }
  }

  /** The coin purse: 45°, 5.71°, 0.573° … and how often each one fits. */
  drawCoins(g, w, h, s, ctx, curJ) {
    const lang = getLang();
    const css = getComputedStyle(this.root);
    const ink = css.getPropertyValue('--lab-ink').trim() || '#ddd';
    const dim = css.getPropertyValue('--lab-dim').trim() || '#666';
    const q = s.q ?? [];
    const hide = this.hideCurrent;
    const n = q.length;
    const target = (ctx.theta0 ?? 0) * 180 / Math.PI;
    // coins
    const top = 18;
    const radius = (j) => Math.max(9, 34 * 0.8 ** j);
    const gap = (w - 24) / n;
    for (let j = 0; j < n; j++) {
      const r = radius(j);
      const cx = 12 + gap * (j + 0.5);
      const cy = top + 36;
      const active = j === curJ;
      const known = j < curJ || (j === curJ && !hide);
      const grd = g.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.1, cx, cy, r);
      grd.addColorStop(0, '#fff3c4');
      grd.addColorStop(0.45, DECADE_COLORS[j]);
      grd.addColorStop(1, '#5a3d12');
      g.globalAlpha = j > curJ ? 0.35 : 1;
      g.fillStyle = grd;
      g.beginPath();
      g.arc(cx, cy, r, 0, Math.PI * 2);
      g.fill();
      g.lineWidth = active ? 3 : 1;
      g.strokeStyle = active ? '#ff4a33' : '#0008';
      g.stroke();
      g.globalAlpha = 1;
      g.textAlign = 'center';
      // labels: staggered in two rows and shrunk to fit, so small coins never overlap
      const label = `${nf(coinDeg(j), lang, 3)}°`;
      let fs = 11;
      g.font = `${fs}px ui-monospace, Menlo, Consolas, monospace`;
      while (fs > 8 && g.measureText(label).width > gap * 1.85) {
        fs -= 0.5;
        g.font = `${fs}px ui-monospace, Menlo, Consolas, monospace`;
      }
      g.fillStyle = ink;
      g.fillText(label, cx, cy + 34 + 8 + (j % 2) * 13);
      g.font = 'bold 15px ui-monospace, Menlo, Consolas, monospace';
      g.fillStyle = active ? '#ff6a55' : ink;
      g.fillText(known ? `${q[j]}×` : '?', cx, cy + 34 + 44);
    }
    g.textAlign = 'left';
    // payment bar: how much of the angle the coins already cover
    const by = h - 54;
    const bx = 14;
    const bw = w - 28;
    g.fillStyle = '#ffffff10';
    g.fillRect(bx, by, bw, 16);
    let paid = 0;
    for (let j = 0; j <= curJ; j++) {
      const cnt = j === curJ && hide ? 0 : q[j];
      for (let k = 0; k < cnt; k++) {
        const x0 = bx + (paid / target) * bw;
        paid += coinDeg(j);
        const x1 = bx + (paid / target) * bw;
        g.fillStyle = DECADE_COLORS[j];
        g.fillRect(x0, by, Math.max(1, x1 - x0 - 1), 16);
      }
    }
    g.strokeStyle = ink;
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(bx + bw, by - 6);
    g.lineTo(bx + bw, by + 22);
    g.stroke();
    g.font = '12px ui-monospace, Menlo, Consolas, monospace';
    g.fillStyle = dim;
    const lbl = `${t('coins.target')} ${nf(target, lang)}° · ${t('coins.paid')} ${nf(paid, lang)}° · ${t('coins.missing')} ${nf(Math.max(0, target - paid), lang, 3)}°`;
    g.fillStyle = ink;
    g.fillText(lbl, bx, by + 36);
  }

  /** Conversion constant: 1 in = 2.54 cm, and both directions with the user's number. */
  drawConst(g, w, h, s) {
    const lang = getLang();
    const css = getComputedStyle(this.root);
    const ink = css.getPropertyValue('--lab-ink').trim() || '#ddd';
    const dim = css.getPropertyValue('--lab-dim').trim() || '#666';
    const U = { cmin: ['in', 'cm'], kglb: ['lb', 'kg'], ltrgal: ['gal', 'l'] }[s.key] ?? ['?', '?'];
    const k = nf(s.k, lang, 10);
    // shrink a line until it fits the width
    const fit = (text, size, weight = '') => {
      let fs = size;
      g.font = `${weight}${fs}px ui-monospace, Menlo, Consolas, monospace`;
      while (fs > 9 && g.measureText(text).width > w - 24) {
        fs -= 0.5;
        g.font = `${weight}${fs}px ui-monospace, Menlo, Consolas, monospace`;
      }
    };
    g.textAlign = 'center';
    g.fillStyle = '#ff8a73';
    const head = `1 ${U[0]} = ${k} ${U[1]}`;
    fit(head, 30, '700 ');
    g.fillText(head, w / 2, h * 0.32);
    const v = s.v || 10;
    const mul = s.mul || v * s.k;
    const div = s.div || v / s.k;
    const l1 = `${nf(v, lang)} ${U[0]} × ${k} → ${nf(mul, lang, 8)} ${U[1]}`;
    const l2 = `${nf(v, lang)} ${U[1]} ÷ ${k} → ${nf(div, lang, 8)} ${U[0]}`;
    g.fillStyle = ink;
    fit(l1.length > l2.length ? l1 : l2, 17);
    g.fillText(l1, w / 2, h * 0.58);
    g.fillText(l2, w / 2, h * 0.74);
    g.font = '12px ui-monospace, Menlo, Consolas, monospace';
    g.fillStyle = dim;
    g.fillText('ROM', w / 2, h * 0.92);
    g.textAlign = 'left';
  }

  /** Long arithmetic on paper: digits in columns, the current column highlighted. */
  drawArith(g, w, h, s) {
    const css = getComputedStyle(this.root);
    const ink = css.getPropertyValue('--lab-ink').trim() || '#ddd';
    const dim = css.getPropertyValue('--lab-dim').trim() || '#666';
    const hot = '#ff6a55';
    const rows = [];
    const steps = this.trace.steps;
    // the start of the current operation (several operations can follow each other)
    let k0 = this.i;
    while (k0 > 0 && !(steps[k0].algo === s.algo && (steps[k0].phase === 'align' || steps[k0].phase === 'exp'))) k0--;
    const run = steps.slice(k0, this.i + 1);
    const start = steps[k0];
    const fin = s.phase === 'final' && start.x !== undefined;
    const real = (v) => (Number.isInteger(v) ? String(v) : String(v));
    if (s.algo === 'add') {
      const A = fin ? real(start.x) : s.regs.A ?? run.find((x) => x.regs?.A)?.regs.A;
      const B = fin ? real(Math.abs(start.y)) : s.regs.B ?? run.find((x) => x.regs?.B)?.regs.B;
      const sub = fin ? start.op === 'sub' || start.y < 0 : run.some((x) => x.sub);
      if (A) rows.push({ label: ' ', text: A });
      if (B) rows.push({ label: sub ? '−' : '+', text: B, line: true });
      if (s.regs.S) rows.push({ label: '=', text: s.regs.S, result: true });
    } else if (s.algo === 'mul') {
      const ref = s.regs.A ? s : run.find((x) => x.regs?.A);
      if (fin) {
        rows.push({ label: ' ', text: real(start.x) });
        rows.push({ label: '×', text: real(start.y), line: true });
      } else if (ref) {
        rows.push({ label: ' ', text: ref.regs.A });
        rows.push({ label: '×', text: ref.regs.B, line: true, hiFromRight: s.phase === 'mdigit' ? s.i : undefined });
      }
      if (s.regs.P) rows.push({ label: '=', text: s.regs.P.includes('.') ? s.regs.P : scaled(s.regs.P, 18), result: true });
    } else {
      const Braw = s.regs.B ?? run.find((x) => x.regs?.B)?.regs.B;
      const B = Braw ? scaled(Braw, 9) : undefined;
      if (fin) {
        rows.push({ label: ' ', text: real(start.x) });
        rows.push({ label: '÷', text: real(start.y), line: true });
      } else if (s.phase === 'qdigit') {
        rows.push({ label: t('arith.rest'), text: scaled(s.before, 9) });
        rows.push({ label: '−', text: `${s.digit} × ${B}`, line: true });
        rows.push({ label: '=', text: scaled(s.after, 9) });
        rows.push({ label: t('arith.quot'), text: s.regs.Q, result: true, hiFromRight: 0 });
      } else {
        if (s.regs.R) rows.push({ label: t('arith.rest'), text: scaled(s.regs.R, 9) });
        if (B) rows.push({ label: '÷', text: B, line: true });
      }
      if (!fin && s.phase !== 'qdigit' && s.regs.Q) rows.push({ label: '=', text: s.regs.Q, result: true });
    }
    // in the last step show the real result (mantissa and exponent put together)
    if (s.phase === 'final' && s.result !== undefined) {
      const res = rows.find((r) => r.result);
      if (res) res.text = String(s.result);
      else rows.push({ label: '=', text: String(s.result), result: true });
    }
    const n = Math.max(...rows.map((r) => r.text.length), 4);
    const fs = Math.max(10, Math.min(22, (w - 80) / (n * 0.62)));
    const cw = fs * 0.62;
    const x0 = w - 20 - n * cw; // right-aligned columns
    let y = 34;
    g.textBaseline = 'alphabetic';
    for (const r of rows) {
      g.font = `600 ${Math.min(16, fs)}px ui-monospace, Menlo, Consolas, monospace`;
      g.fillStyle = dim;
      g.textAlign = 'right';
      g.fillText(r.label, x0 - 10, y);
      g.textAlign = 'left';
      g.font = `${r.result ? '700 ' : ''}${fs}px ui-monospace, Menlo, Consolas, monospace`;
      const off = n - r.text.length;
      for (let k = 0; k < r.text.length; k++) {
        const fromRight = r.text.length - 1 - k;
        let col = r.result ? '#ff8a73' : ink;
        if (s.algo === 'add' && s.phase === 'col' && r.text.replace('.', '').length && this.colHit(r.text, k, s.col)) col = hot;
        if (r.hiFromRight !== undefined && this.digitFromRight(r.text, k) === r.hiFromRight) col = hot;
        g.fillStyle = col;
        g.fillText(r.text[k], x0 + (off + k) * cw, y);
        void fromRight;
      }
      if (r.line) {
        g.strokeStyle = dim;
        g.lineWidth = 1;
        g.beginPath();
        g.moveTo(x0 - 30, y + fs * 0.45);
        g.lineTo(w - 14, y + fs * 0.45);
        g.stroke();
      }
      y += fs * 1.55;
    }
    g.font = '12px ui-monospace, Menlo, Consolas, monospace';
    g.fillStyle = dim;
    const count = s.adds ?? s.subs;
    if (count !== undefined) g.fillText(`${s.algo === 'div' ? t('arith.subs') : t('arith.adds')}: ${count}`, 14, h - 14);
  }

  /** is character k of a "d.ddd" digit string the column `col` (0 = first digit)? */
  colHit(text, k, col) {
    if (text[k] === '.') return false;
    const digitIndex = text.slice(0, k + 1).replace('.', '').length - 1;
    return digitIndex === col;
  }

  /** index of character k counted in digits from the right (ignoring the point) */
  digitFromRight(text, k) {
    if (text[k] === '.' || /\s/.test(text[k])) return -1;
    return text.slice(k + 1).replace(/[^0-9]/g, '').length;
  }

  /** Convergence plot: correct digits per step. */
  drawConv() {
    const c = this.el.conv;
    const w = c.parentElement.clientWidth;
    const h = 130;
    const dpr = window.devicePixelRatio || 1;
    if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      c.style.height = `${h}px`;
    }
    const g = c.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const css = getComputedStyle(this.root);
    const ink = css.getPropertyValue('--lab-ink').trim() || '#ddd';
    const dim = css.getPropertyValue('--lab-dim').trim() || '#666';
    const steps = this.trace.steps;
    const n = steps.length;
    const top = 10;
    const bottom = h - 18;
    const left = CONV_PAD_L;
    const right = w - 8;
    const X = (k) => left + (n > 1 ? (k / (n - 1)) * (right - left) : 0);
    const Y = (d) => bottom - (d / MAX_DIGITS) * (bottom - top);
    g.font = '10.5px ui-monospace, Menlo, Consolas, monospace';

    // phase bands
    this.groups.forEach((gr, gi) => {
      const x0 = X(gr.start) - (gr.start > 0 ? (right - left) / (2 * Math.max(1, n - 1)) : 0);
      if (gi % 2 === 1) {
        const next = this.groups[gi + 1]?.start ?? n;
        const x1 = X(next) - (right - left) / (2 * Math.max(1, n - 1));
        g.fillStyle = '#ffffff08';
        g.fillRect(x0, top, Math.min(right, x1) - x0, bottom - top);
      }
    });
    // grid
    g.strokeStyle = '#2c2a26';
    g.fillStyle = dim;
    g.lineWidth = 1;
    for (const d of [0, 5, 10, 15]) {
      g.beginPath();
      g.moveTo(left, Y(d));
      g.lineTo(right, Y(d));
      g.stroke();
      g.fillText(String(d), 6, Y(d) + 3.5);
    }
    // display precision: 10 digits
    g.strokeStyle = '#d6a84d';
    g.setLineDash([5, 4]);
    g.beginPath();
    g.moveTo(left, Y(10));
    g.lineTo(right, Y(10));
    g.stroke();
    g.setLineDash([]);
    g.fillStyle = '#d6a84d';
    const lbl = t('lab.conv.display');
    g.fillText(lbl, right - g.measureText(lbl).width - 2, Y(10) - 4);

    // ghost: the other method's curve, stretched to the same width
    const other = this.binTrace ? (this.trace === this.binTrace ? this.decConv : this.binConv) : null;
    if (other) {
      const m = other.length;
      g.strokeStyle = '#8a8478';
      g.globalAlpha = 0.55;
      g.setLineDash([2, 3]);
      g.lineWidth = 1.2;
      g.beginPath();
      let on = false;
      other.forEach((cv, k) => {
        if (!cv) { on = false; return; }
        const x = left + (m > 1 ? (k / (m - 1)) * (right - left) : 0);
        if (on) g.lineTo(x, Y(cv.digits));
        else g.moveTo(x, Y(cv.digits));
        on = true;
      });
      g.stroke();
      g.setLineDash([]);
      g.globalAlpha = 1;
      g.fillStyle = '#8a8478';
      const lg = `┄ ${t(this.trace === this.binTrace ? 'method.dec' : 'method.bin')}`;
      g.fillText(lg, right - g.measureText(lg).width - 2, top + 10);
    }

    // series: connect consecutive points of the same quantity
    let prev = null;
    for (let k = 0; k < n; k++) {
      const cv = this.conv[k];
      if (!cv) {
        prev = null;
        continue;
      }
      const future = k > this.i;
      g.globalAlpha = future ? 0.25 : 1;
      if (prev && prev.cv.quantity === cv.quantity && prev.k === k - 1) {
        g.strokeStyle = ink;
        g.lineWidth = 1;
        g.beginPath();
        g.moveTo(X(prev.k), Y(prev.cv.digits));
        g.lineTo(X(k), Y(cv.digits));
        g.stroke();
      }
      const j = steps[k].j;
      g.fillStyle = j !== undefined && steps[k].algo !== 'sqrt' ? colorOf(steps[k], j) : ink;
      g.beginPath();
      g.arc(X(k), Y(cv.digits), n > 120 ? 1.8 : 2.4, 0, Math.PI * 2);
      g.fill();
      prev = { k, cv };
    }
    g.globalAlpha = 1;
    // cursor
    g.strokeStyle = '#ff4a33';
    g.lineWidth = 1.5;
    g.beginPath();
    g.moveTo(X(this.i), top - 4);
    g.lineTo(X(this.i), bottom + 4);
    g.stroke();
    g.fillStyle = dim;
    g.fillText(t('lab.step'), left, h - 4);
  }

  findRunStart() {
    const steps = this.trace.steps;
    let k = this.i;
    while (k > 0 && steps[k - 1].algo === steps[this.i].algo && !['setup', 'reduce', 'start'].includes(steps[k].phase)) k--;
    return k;
  }

  /** Log-scale (or linear) track for ln and e^x. */
  drawTrack(g, w, h, s, ctx) {
    const css = getComputedStyle(this.root);
    const ink = css.getPropertyValue('--lab-ink').trim() || '#ddd';
    const dim = css.getPropertyValue('--lab-dim').trim() || '#666';
    const pad = 22;
    const tw = w - 2 * pad;
    const consts = LN_STR.map(Number);

    const drawAxis = (y, kind, lo, hi, label) => {
      g.strokeStyle = dim;
      g.fillStyle = dim;
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(pad, y);
      g.lineTo(pad + tw, y);
      g.stroke();
      const X = kind === 'log' ? (v) => pad + (Math.log10(v) - Math.log10(lo)) / (Math.log10(hi) - Math.log10(lo)) * tw : (v) => pad + (v - lo) / (hi - lo) * tw;
      const ticks = kind === 'log' ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] : [0, 0.5, 1, 1.5, 2, 2.5];
      for (const tk of ticks) {
        if (tk < lo || tk > hi) continue;
        const x = X(tk);
        g.beginPath();
        g.moveTo(x, y - 4);
        g.lineTo(x, y + 4);
        g.stroke();
        g.fillText(String(tk), x - 3, y + 17);
      }
      g.fillStyle = ink;
      g.fillText(label, pad, y - 46);
      return X;
    };

    const segBar = (X, y, startVal, q, mode, desc = false) => {
      // mode 'mul': value multiplied by (1+10^-j); 'add': value + ln(1+10^-j)
      let v = startVal;
      const js = q.map((_, j) => j);
      if (desc) js.reverse();
      js.forEach((j) => {
        for (let k = 0; k < q[j]; k++) {
          const nv = mode === 'mul' ? v * (1 + 10 ** -j) : v + consts[j];
          g.fillStyle = DECADE_COLORS[j];
          const x0 = X(v);
          const x1 = X(nv);
          g.fillRect(x0, y - 12, Math.max(1, x1 - x0 - 1), 10);
          v = nv;
        }
      });
      return v;
    };

    const marker = (X, v, y, color, text) => {
      const x = X(v);
      g.strokeStyle = color;
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(x, y - 22);
      g.lineTo(x, y + 2);
      g.stroke();
      g.fillStyle = color;
      if (text) g.fillText(text, Math.max(pad, Math.min(x + 4, pad + tw - g.measureText(text).width)), y - 26);
    };

    const y1 = h * 0.42;
    const y2 = h * 0.86;
    const q = s.q ?? [];
    if (s.algo === 'ln') {
      const M = ctx.M ?? (s.regs?.M ? num(s.regs.M) : undefined);
      const X = drawAxis(y1, 'log', 1, 10, 'P = 2^q₀ · 1.1^q₁ · 1.01^q₂ …  (log)');
      if (s.phase === 'pdiv' || s.phase === 'resid' || s.phase === 'sum') segBar(X, y1, 1, q, 'mul');
      if (M) marker(X, M, y1, ink, `M = ${M.toPrecision(10)}`);
      if (s.regs?.P !== undefined) marker(X, num(s.regs.P), y1, '#ff4a33', '');
      const X2 = drawAxis(y2, 'lin', 0, 2.5, 'Σ qⱼ · ln(1+10⁻ʲ)');
      if (s.phase === 'sum' || s.phase === 'final' || s.phase === 'exp10') {
        const done = this.sumDone(s);
        segBar(X2, y2, 0, done, 'add', true);
      }
      if (s.regs?.sum !== undefined && num(s.regs.sum) <= 2.5 && num(s.regs.sum) >= 0) marker(X2, num(s.regs.sum), y2, '#ff4a33', `Σ = ${num(s.regs.sum).toPrecision(10)}`);
    } else {
      const r0 = ctx.r0;
      const X = drawAxis(y1, 'lin', 0, 2.5, 'r = Σ qⱼ · ln(1+10⁻ʲ) + ρ');
      if (r0 !== undefined) {
        segBar(X, y1, 0, q, 'add');
        marker(X, r0, y1, ink, `r = ${r0.toPrecision(10)}`);
      }
      const X2 = drawAxis(y2, 'log', 1, 10, 'P ← P · (1+10⁻ʲ)  (log)');
      if (s.phase === 'pmul' || s.phase === 'init' || s.phase === 'final') {
        if (ctx.Pinit !== undefined && s.phase === 'pmul') {
          segBar(X2, y2, ctx.Pinit, q.map((n, j) => n - (s.qLeft?.[j] ?? 0)), 'mul', true);
        }
        if (ctx.Pend) marker(X2, ctx.Pend, y2, ink, `eʳ = ${ctx.Pend.toPrecision(10)}`);
        if (s.regs?.P !== undefined) marker(X2, num(s.regs.P), y2, '#ff4a33', '');
      }
    }
  }

  /** For the summing phase: how many constants have been added so far, per decade. */
  sumDone(s) {
    const q = s.q ?? [];
    if (s.phase !== 'sum') return q;
    const done = q.map(() => 0);
    // summing runs from the last decade down to j; decades > j are complete
    for (let j = q.length - 1; j > s.j; j--) done[j] = q[j];
    done[s.j] = s.k;
    // draw order must still be from large to small constants – shuffle into place
    return done;
  }

  drawSqrt(g, w, h, s) {
    const css = getComputedStyle(this.root);
    const ink = css.getPropertyValue('--lab-ink').trim() || '#ddd';
    const dim = css.getPropertyValue('--lab-dim').trim() || '#666';
    g.fillStyle = ink;
    g.font = '15px ui-monospace, Menlo, Consolas, monospace';
    if (s.phase === 'digit') {
      const digits = s.regs.root;
      const intDigits = Math.max(1, digits.length - (digits.length - (s.intPairs ?? 0)));
      g.fillText('√ :', 16, 40);
      const cw = Math.min(22, (w - 70) / Math.max(digits.length, 1));
      for (let k = 0; k < digits.length; k++) {
        g.fillStyle = k === digits.length - 1 ? '#ff4a33' : ink;
        g.font = `${k === digits.length - 1 ? 'bold ' : ''}20px ui-monospace, Menlo, Consolas, monospace`;
        g.fillText(digits[k], 56 + k * cw, 42);
      }
      g.font = '13px ui-monospace, Menlo, Consolas, monospace';
      g.fillStyle = dim;
      // the odd numbers that were subtracted for this digit
      const r = BigInt(digits.slice(0, -1) || '0');
      const odds = [];
      for (let k = 0; k < s.digit; k++) odds.push((r * 20n + 1n + 2n * BigInt(k)).toString());
      const line = odds.length ? `− ${odds.join(' − ')}` : '(0×)';
      wrapText(g, line, 16, 80, w - 32, 18, 5);
      void intDigits;
    } else {
      g.fillText(tm(s.msg).slice(0, 60), 16, 40);
    }
  }
}

function cell(ch, cls) {
  const s = document.createElement('span');
  s.className = `d ${cls}`.trim();
  s.textContent = ch;
  return s;
}

function arrow(g, x0, y0, x1, y1, color, width) {
  g.strokeStyle = color;
  g.fillStyle = color;
  g.lineWidth = width;
  g.beginPath();
  g.moveTo(x0, y0);
  g.lineTo(x1, y1);
  g.stroke();
  const a = Math.atan2(y1 - y0, x1 - x0);
  g.beginPath();
  g.moveTo(x1, y1);
  g.lineTo(x1 - 10 * Math.cos(a - 0.4), y1 - 10 * Math.sin(a - 0.4));
  g.lineTo(x1 - 10 * Math.cos(a + 0.4), y1 - 10 * Math.sin(a + 0.4));
  g.closePath();
  g.fill();
}

function wrapText(g, text, x, y, maxW, lh, maxLines) {
  const words = text.split(' ');
  let line = '';
  let n = 0;
  for (const wd of words) {
    const test = line ? `${line} ${wd}` : wd;
    if (g.measureText(test).width > maxW && line) {
      g.fillText(line, x, y + n * lh);
      line = wd;
      if (++n >= maxLines) return;
    } else line = test;
  }
  g.fillText(line, x, y + n * lh);
}

export { getLang };

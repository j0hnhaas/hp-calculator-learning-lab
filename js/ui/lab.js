// The "Inside" lab: replays the decimal CORDIC trace step by step.

import { t, tm, sup, sub, p10, onLang, getLang } from '../i18n.js';
import { fmtFixed, S } from '../engine/decimal.js';
import { ATAN_STR, LN_STR } from '../engine/constants.js';
import * as fn from '../engine/functions.js';

const REG_NAMES = {
  theta: 'θ', X: 'X', Y: 'Y', M: 'M', P: 'P', sum: 'Σ', r: 'r', x: 'x', a: 'a',
  root: '√', rem: 'Rest', sin: 'sin', cos: 'cos', m: 'm',
};
const DECADE_COLORS = ['#e8b04a', '#e0603c', '#4fa3d9', '#6cc28a', '#b48ae0', '#e07ab4', '#c9c26a', '#7ad0d0', '#d08a5a'];
const OP_LABEL = {
  sin: 'SIN', cos: 'COS', tan: 'TAN', asin: 'SIN⁻¹', acos: 'COS⁻¹', atan: 'TAN⁻¹',
  ln: 'ln', log: 'log', exp: 'eˣ', exp10: '10ˣ', sqrt: '√x', pow: 'yˣ', toP: '→P', toR: '→R',
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
    this.build();
    onLang(() => this.render());
  }

  build() {
    this.root.innerHTML = `
      <div class="lab-head">
        <h2 id="lab-title" data-i18n="lab.title"></h2>
        <button type="button" class="lab-close icon-btn" data-i18n-title="lab.close">✕</button>
      </div>
      <div class="lab-empty"><p data-i18n="lab.empty"></p></div>
      <div class="lab-body" hidden>
        <div class="lab-op"><span class="op-text"></span><span class="op-algo"></span></div>
        <ol class="phases"></ol>
        <div class="viz-wrap"><canvas class="viz"></canvas></div>
        <p class="explain" aria-live="polite"></p>
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
          <label class="chk"><input type="checkbox" class="autoplay" checked> <span data-i18n="lab.autoplay"></span></label>
        </div>
        <div class="tables">
          <div class="regs"><h3 data-i18n="lab.registers"></h3><div class="reg-list"></div></div>
          <div class="consts"><h3 data-i18n="lab.constants"></h3><table class="const-table"></table></div>
        </div>
      </div>
      <div class="examples"><h3 data-i18n="lab.examples"></h3><div class="ex-buttons"></div></div>
      <details class="about"><summary data-i18n="lab.about.title"></summary><p data-i18n="lab.about.body"></p></details>`;

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
    };
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
    this.trace = trace;
    this.prepare();
    this.el.scrub.max = String(trace.steps.length - 1);
    this.i = 0;
    this.render();
    if (this.autoplay) this.play();
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
      if (s.msg?.[0] === 'atan.start') ctx = { ...ctx, atanStart: { x: num(s.vec.X), y: num(s.vec.Y) } };
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
    this.multiAlgo = new Set(steps.map((s) => s.algo)).size > 1;
  }

  act(a) {
    if (!this.trace) return;
    const n = this.trace.steps.length;
    if (a === 'play') return this.timer ? this.stop() : this.play();
    this.stop();
    if (a === 'first') this.go(0);
    if (a === 'prev') this.go(this.i - 1);
    if (a === 'next') this.go(this.i + 1);
    if (a === 'last') this.go(n - 1);
  }

  go(i) {
    const n = this.trace.steps.length;
    this.i = Math.max(0, Math.min(n - 1, i));
    this.render();
  }

  play() {
    clearInterval(this.timer);
    if (this.i >= this.trace.steps.length - 1) this.i = 0;
    this.timer = setInterval(() => {
      if (this.i >= this.trace.steps.length - 1) return this.stop();
      this.go(this.i + 1);
    }, 1000 / this.speed);
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
    const s = tr.steps[this.i];
    const args = tr.args.map(fmtNum).join(', ');
    const unit = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'toP', 'toR'].includes(tr.label) && tr.angle ? ` (${tr.angle})` : '';
    this.el.op.textContent = `${OP_LABEL[tr.label] ?? tr.label} ${args}${unit} = ${tr.resultText ?? fmtNum(tr.result)}`;
    this.el.algo.textContent = t('algo.' + s.algo);
    this.el.explain.textContent = tm(s.msg);
    this.el.stepno.textContent = `${t('lab.step')} ${this.i + 1} ${t('lab.of')} ${tr.steps.length}`;
    this.el.scrub.value = String(this.i);
    this.renderPhases();
    this.renderRegs(s);
    this.renderConsts(s);
    this.draw();
  }

  renderPhases() {
    const cur = this.ctx[this.i].group;
    this.el.phases.innerHTML = '';
    this.groups.forEach((g, gi) => {
      // skip consecutive duplicates of the same phase label (e.g. small steps)
      const li = document.createElement('li');
      const tag = this.multiAlgo ? `${{ trig: 'tan', atan: 'atan', ln: 'ln', exp: 'exp', sqrt: '√' }[g.algo]} · ` : '';
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
    const showCol = ['pdiv', 'pmul', 'vec'].includes(s.phase) && s.j !== undefined;
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
    const s = this.trace.steps[this.i];
    const ctx = this.ctx[this.i];
    g.font = '12px ui-monospace, Menlo, Consolas, monospace';
    if (s.algo === 'trig' || s.algo === 'atan') this.drawAngle(g, w, h, s, ctx);
    else if (s.algo === 'ln' || s.algo === 'exp') this.drawTrack(g, w, h, s, ctx);
    else this.drawSqrt(g, w, h, s);
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
    if (s.algo === 'trig') target = ctx.theta0;
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
    const order = [];
    let start = 0;
    let dir = 1;
    const asc = (counts) => counts.forEach((n, j) => { for (let k = 0; k < n; k++) order.push(j); });
    const desc = (counts) => { for (let j = counts.length - 1; j >= 0; j--) for (let k = 0; k < counts[j]; k++) order.push(j); };
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
    }
    const rArc = R * 0.62;
    let a0 = start;
    for (const j of order) {
      const a1 = a0 + dir * consts[j];
      g.strokeStyle = DECADE_COLORS[j];
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
    const j = Math.max(0, Math.min(6, s.j ?? 0));
    const ppu = (Math.min(zw, zh) / 3) * 10 ** j; // one micro-step of decade j ≈ 1/3 of the window
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
    if (s.algo === 'atan' && (s.phase === 'vec' || s.phase === 'resid')) {
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
      for (const jj of order) {
        const b1 = b0 + dir * consts[jj];
        g.strokeStyle = DECADE_COLORS[jj];
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
    g.fillText(`${t('lab.zoom')} ×10${sup(j)}`, zx + 6, zy + 16);
  }

  findRunStart() {
    const steps = this.trace.steps;
    let k = this.i;
    while (k > 0 && steps[k - 1].algo === steps[this.i].algo && !['setup', 'reduce'].includes(steps[k].phase)) k--;
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

// Interactive unit circle: drag the point (or use the slider) and watch
// sin, cos, tan and atan change. Used in the glossary and the lab.

import { t, getLang } from '../i18n.js';

const C = { sin: '#e0603c', cos: '#4fa3d9', tan: '#6cc28a', ptr: '#e8b04a' };
const PRESETS = [30, 45, 60, 5.7106, 120];
const SVG = 'http://www.w3.org/2000/svg';

const fmt = (x, d = 4) => {
  const s = x.toFixed(d);
  return getLang() === 'de' ? s.replace('.', ',') : s;
};
const deg = (a) => `${fmt(a, a % 1 ? 2 : 0)}°`;

/**
 * @param {HTMLElement} host
 * @param {number} [start] start angle in degrees
 */
export function mountUnitCircle(host, start = 30) {
  host.classList.add('uc');
  host.innerHTML = `
    <svg class="uc-svg" viewBox="-1.45 -1.3 2.9 2.6" role="img" aria-label="${t('uc.title')}"></svg>
    <input class="uc-range" type="range" min="0" max="360" step="1" value="${Math.round(start)}" aria-label="θ">
    <div class="uc-presets"></div>
    <div class="uc-read" aria-live="polite"></div>
    <p class="uc-hint">${t('uc.hint')}</p>`;
  const svg = host.querySelector('.uc-svg');
  const range = host.querySelector('.uc-range');
  const read = host.querySelector('.uc-read');
  const el = (name, attrs) => {
    const n = document.createElementNS(SVG, name);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    svg.appendChild(n);
    return n;
  };
  // static parts (y axis points down in SVG, so every y is negated)
  el('line', { x1: -1.35, y1: 0, x2: 1.35, y2: 0, class: 'uc-axis' });
  el('line', { x1: 0, y1: -1.25, x2: 0, y2: 1.25, class: 'uc-axis' });
  el('line', { x1: 1, y1: -1.25, x2: 1, y2: 1.25, class: 'uc-tline' });
  el('circle', { cx: 0, cy: 0, r: 1, class: 'uc-circle' });
  const arc = el('path', { class: 'uc-arc' });
  const tanL = el('line', { stroke: C.tan, 'stroke-width': 0.035 });
  const cosL = el('line', { stroke: C.cos, 'stroke-width': 0.05 });
  const sinL = el('line', { stroke: C.sin, 'stroke-width': 0.05 });
  const ext = el('line', { class: 'uc-ext' });
  const ptr = el('line', { stroke: C.ptr, 'stroke-width': 0.03 });
  const lbl = (txt, color) => {
    const n = el('text', { fill: color, 'font-size': 0.15, 'font-weight': 600 });
    n.textContent = txt;
    return n;
  };
  const sinT = lbl('sin', C.sin);
  const cosT = lbl('cos', C.cos);
  const tanT = lbl('tan', C.tan);
  const thT = lbl('θ', C.ptr);
  const dot = el('circle', { r: 0.075, fill: C.ptr, class: 'uc-dot' });

  let a = start;
  function draw() {
    const r = (a * Math.PI) / 180;
    const x = Math.cos(r);
    const y = Math.sin(r);
    const tn = Math.abs(x) < 1e-9 ? Infinity : y / x;
    ptr.setAttribute('x1', 0); ptr.setAttribute('y1', 0); ptr.setAttribute('x2', x); ptr.setAttribute('y2', -y);
    dot.setAttribute('cx', x); dot.setAttribute('cy', -y);
    cosL.setAttribute('x1', 0); cosL.setAttribute('y1', 0); cosL.setAttribute('x2', x); cosL.setAttribute('y2', 0);
    sinL.setAttribute('x1', x); sinL.setAttribute('y1', 0); sinL.setAttribute('x2', x); sinL.setAttribute('y2', -y);
    // tan: on the vertical line x = 1, where the extended pointer hits it
    const tc = Math.max(-1.25, Math.min(1.25, tn));
    const showTan = isFinite(tn);
    tanL.setAttribute('x1', 1); tanL.setAttribute('y1', 0); tanL.setAttribute('x2', 1); tanL.setAttribute('y2', showTan ? -tc : 0);
    ext.setAttribute('x1', 0); ext.setAttribute('y1', 0);
    ext.setAttribute('x2', showTan && x > 0 ? 1 : x * 1.3); ext.setAttribute('y2', showTan && x > 0 ? -tc : -y * 1.3);
    const ra = 0.28;
    const large = a > 180 ? 1 : 0;
    arc.setAttribute('d', a <= 0.01 ? '' : `M ${ra} 0 A ${ra} ${ra} 0 ${large} 0 ${ra * x} ${-ra * y}`);
    sinT.setAttribute('x', x + (x >= 0 ? -0.26 : 0.04)); sinT.setAttribute('y', -y / 2 + 0.05);
    cosT.setAttribute('x', x / 2 - 0.12); cosT.setAttribute('y', y >= 0 ? 0.17 : -0.07);
    tanT.setAttribute('x', 1.05); tanT.setAttribute('y', showTan ? -tc / 2 + 0.05 : -2);
    thT.setAttribute('x', 0.33 * Math.cos(r / 2) + 0.02); thT.setAttribute('y', -0.33 * Math.sin(r / 2) + 0.05);
    range.value = String(Math.round(a));
    const at = (Math.atan(tn) * 180) / Math.PI;
    read.innerHTML = `
      <div><b>θ</b> = ${deg(a)} = ${fmt(r)} rad</div>
      <div style="color:${C.sin}"><b>sin θ</b> = ${fmt(y)} <span class="uc-why">${t('uc.sin')}</span></div>
      <div style="color:${C.cos}"><b>cos θ</b> = ${fmt(x)} <span class="uc-why">${t('uc.cos')}</span></div>
      <div style="color:${C.tan}"><b>tan θ</b> = ${showTan ? fmt(tn) : '—'} <span class="uc-why">${t('uc.tan')}</span></div>
      <div class="uc-atan">${showTan ? t('uc.atan').replace('{t}', fmt(tn)).replace('{a}', deg(Math.round(at * 100) / 100)) : t('uc.atan90')}${showTan && x < 0 ? ` ${t('uc.atanNote')}` : ''}</div>`;
  }
  const set = (v) => {
    a = ((v % 360) + 360) % 360;
    draw();
  };
  range.addEventListener('input', () => set(+range.value));
  const pres = host.querySelector('.uc-presets');
  for (const p of PRESETS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = p === 5.7106 ? `atan 0,1 → ${deg(p)}`.replace('0,1', fmt(0.1, 1)) : deg(p);
    b.addEventListener('click', () => set(p));
    pres.appendChild(b);
  }
  // drag
  const toAngle = (e) => {
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    set(Math.round((Math.atan2(-p.y, p.x) * 180) / Math.PI));
  };
  let dragging = false;
  svg.addEventListener('pointerdown', (e) => {
    dragging = true;
    svg.setPointerCapture(e.pointerId);
    toAngle(e);
  });
  svg.addEventListener('pointermove', (e) => dragging && toAngle(e));
  svg.addEventListener('pointerup', () => { dragging = false; });
  svg.addEventListener('pointercancel', () => { dragging = false; });
  set(start);
}

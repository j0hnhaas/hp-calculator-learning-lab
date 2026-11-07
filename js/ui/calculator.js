// Builds the calculator body: display window, power switch, model switch
// (HP-35 ⇄ HP-45) and keyboard.

import { KEY_LAYOUTS } from '../calc/keys.js';
import { LedDisplay } from './display.js';

export function buildCalculator(root, { onKey, onPower, onModel, model = 45 }) {
  root.innerHTML = `
    <div class="calc" role="application">
      <div class="calc-head">
        <div class="display-bezel">
          <div class="display-glass"></div>
        </div>
        <div class="band">
          <label class="power">
            <span class="power-lbl off">OFF</span>
            <input type="checkbox" class="power-input" checked aria-label="Power">
            <span class="power-track"><span class="power-knob"></span></span>
            <span class="power-lbl on">ON</span>
          </label>
          <div class="model-switch" role="radiogroup" aria-label="HP-35 / HP-45 / HP-55">
            <div class="ms-labels">
              <button type="button" class="ms-lbl" role="radio" data-m="35">35</button>
              <button type="button" class="ms-lbl" role="radio" data-m="45">45</button>
              <button type="button" class="ms-lbl" role="radio" data-m="55">55</button>
            </div>
            <div class="ms-track" aria-hidden="true"><span class="ms-knob"></span></div>
          </div>
        </div>
      </div>
      <div class="keyboard"></div>
      <div class="calc-foot"><span class="foot-model"></span><span class="foot-sub">DECIMAL CORDIC SIMULATION</span></div>
    </div>`;

  const calcEl = root.querySelector('.calc');
  const kb = root.querySelector('.keyboard');
  const buttons = new Map();

  function renderKeys(m) {
    kb.innerHTML = '';
    buttons.clear();
    KEY_LAYOUTS[m].forEach((row, ri) => {
      const r = document.createElement('div');
      r.className = `krow ${ri < 4 ? 'upper' : 'lower'}`;
      for (const k of row) {
        const cell = document.createElement('div');
        cell.className = `kcell${k.wide ? ' wide' : ''}`;
        const gold = document.createElement('span');
        gold.className = 'gold-label';
        gold.textContent = k.gold ?? '';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `key ${k.style ?? 'black'}`;
        btn.dataset.id = k.id;
        btn.innerHTML = `<span class="cap">${k.label}</span>`;
        btn.setAttribute('aria-label', k.label || 'shift');
        if (k.gold) btn.title = [k.label, k.gold, k.blue].filter(Boolean).join(' / ');
        cell.append(gold, btn);
        if (m === 55) {
          // HP-55: the blue g function is printed below the key
          const blue = document.createElement('span');
          blue.className = 'blue-label';
          blue.textContent = k.blue ?? '';
          cell.appendChild(blue);
        }
        r.appendChild(cell);
        buttons.set(k.id, btn);
      }
      kb.appendChild(r);
    });
  }

  const MODELS = [35, 45, 55];
  function setModel(m) {
    calcEl.classList.toggle('m35', m === 35);
    calcEl.classList.toggle('m55', m === 55);
    calcEl.setAttribute('aria-label', `HP-${m}`);
    root.querySelector('.foot-model').textContent = `HP-${m}`;
    root.querySelectorAll('.ms-lbl').forEach((l) => {
      const on = +l.dataset.m === m;
      l.classList.toggle('on', on);
      l.setAttribute('aria-checked', on);
    });
    root.querySelector('.model-switch').dataset.pos = MODELS.indexOf(m);
    renderKeys(m);
  }

  kb.addEventListener('pointerdown', (ev) => {
    const btn = ev.target.closest('.key');
    if (!btn) return;
    ev.preventDefault();
    btn.classList.add('down');
    onKey(btn.dataset.id);
  });
  const up = () => kb.querySelectorAll('.key.down').forEach((b) => b.classList.remove('down'));
  kb.addEventListener('pointerup', up);
  kb.addEventListener('pointerleave', up);
  kb.addEventListener('pointercancel', up);
  // keyboard activation (Enter/Space on a focused key) for accessibility
  kb.addEventListener('click', (ev) => {
    if (ev.detail !== 0) return; // real pointer clicks were handled on pointerdown
    const btn = ev.target.closest('.key');
    if (btn) onKey(btn.dataset.id);
  });

  const power = root.querySelector('.power-input');
  power.addEventListener('change', () => onPower(power.checked));
  // the 3-position slide switch: tap a number, or tap the track where the knob should go
  const sw = root.querySelector('.model-switch');
  sw.querySelector('.ms-labels').addEventListener('click', (e) => {
    const b = e.target.closest('[data-m]');
    if (b) onModel(+b.dataset.m);
  });
  sw.querySelector('.ms-track').addEventListener('click', (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(2, Math.floor(((e.clientX - r.left) / r.width) * 3)));
    onModel(MODELS[pos]);
  });

  const display = new LedDisplay(root.querySelector('.display-glass'));
  setModel(model);

  return {
    display,
    setModel,
    setBlink(on) {
      root.querySelector('.display-glass').classList.toggle('blink', on);
    },
    flash(id) {
      const b = buttons.get(id);
      if (!b) return;
      b.classList.add('down');
      setTimeout(() => b.classList.remove('down'), 90);
    },
  };
}

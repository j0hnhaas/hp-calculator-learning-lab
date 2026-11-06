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
          <label class="model-switch" title="HP-35 / HP-45">
            <span class="ms-lbl" data-m="35">35</span>
            <input type="checkbox" class="model-input" aria-label="HP-35 / HP-45">
            <span class="ms-track"><span class="ms-knob"></span></span>
            <span class="ms-lbl" data-m="45">45</span>
          </label>
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
        if (k.gold) btn.title = `${k.label} / ${k.gold}`;
        cell.append(gold, btn);
        r.appendChild(cell);
        buttons.set(k.id, btn);
      }
      kb.appendChild(r);
    });
  }

  function setModel(m) {
    calcEl.classList.toggle('m35', m === 35);
    calcEl.setAttribute('aria-label', `HP-${m}`);
    root.querySelector('.foot-model').textContent = `HP-${m}`;
    root.querySelector('.model-input').checked = m === 45;
    root.querySelectorAll('.ms-lbl').forEach((l) => l.classList.toggle('on', +l.dataset.m === m));
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
  const modelInput = root.querySelector('.model-input');
  modelInput.addEventListener('change', () => onModel(modelInput.checked ? 45 : 35));

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

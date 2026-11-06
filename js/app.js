// Wires calculator, lab, settings and PWA together.

import { HP45 } from './calc/hp45.js';
import { KEY_LAYOUTS } from './calc/keys.js';
import { buildCalculator } from './ui/calculator.js';
import { Lab } from './ui/lab.js';
import { t, setLang, detectLang, applyStatic, getLang, onLang, setModelName } from './i18n.js';
import { formatNumber } from './calc/hp45.js';

// ---------------------------------------------------------------- settings
const store = {
  get(k, d) {
    try {
      const v = localStorage.getItem('hp45.' + k);
      return v === null ? d : JSON.parse(v);
    } catch {
      return d;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem('hp45.' + k, JSON.stringify(v));
    } catch { /* storage unavailable */ }
  },
};
const settings = {
  timing: store.get('timing', true),
  sound: store.get('sound', false),
  model: store.get('model', 45) === 35 ? 35 : 45,
};
setModelName(settings.model);

// ---------------------------------------------------------------- calculator
const calc = new HP45(settings.model);
let powered = true;
let busy = false;
const queue = [];

const lab = new Lab(document.getElementById('lab'));
const ui = buildCalculator(document.getElementById('calc'), { onKey: handleKey, onPower, onModel, model: settings.model });
const statusEl = document.getElementById('status');

function refresh() {
  ui.display.show(powered ? calc.displayString() : null);
  ui.setBlink(powered && calc.error && calc.model === 35); // HP-35: errors make the display blink
  renderStatus();
}

function renderStatus() {
  if (!powered) {
    statusEl.innerHTML = '';
    return;
  }
  const is35 = calc.model === 35;
  const mode = is35 ? t('status.auto') : `${calc.dispMode} ${calc.dispDigits}`;
  const stack = ['T', 'Z', 'Y', 'X'].map((n, i) => {
    const v = calc.stack[3 - i];
    return `<span class="sv"><b>${n}</b>${formatNumber(v, 'SCI', 6).replace(/\s+/g, ' ').trim().replace(/ (-?\d\d)$/, 'e$1')}</span>`;
  }).join('');
  statusEl.innerHTML = `
    <div class="modes"><span class="${(is35 ? calc.arc : calc.shift) ? 'on gold' : ''}">${t(is35 ? 'status.arc' : 'status.shift')}</span><span class="on">${calc.angle}</span><span class="on">${mode}</span>${calc.pending ? `<span class="on">${calc.pending.type.toUpperCase()}${calc.pending.op ? ' ' + ({ add: '+', sub: '−', mul: '×', div: '÷' })[calc.pending.op] : ''} _</span>` : ''}</div>
    <div class="stack">${stack}${is35 ? `<span class="sv"><b>${t('status.mem')}</b>${formatNumber(calc.regs[1], 'SCI', 6).replace(/\s+/g, ' ').trim().replace(/ (-?\d\d)$/, 'e$1')}</span>` : ''}</div>`;
}

function handleKey(id) {
  if (!powered) return;
  click();
  if (busy) {
    if (queue.length < 2) queue.push(id); // the HP-45 buffers a keystroke while busy
    return;
  }
  run(id);
}

function run(id) {
  const res = calc.press(id);
  if (res.trace) {
    lab.load(res.trace);
    pulseFab();
  }
  const ms = settings.timing ? res.busy : Math.min(res.busy, 30);
  renderStatus();
  if (ms > 0) {
    busy = true;
    ui.display.show(null); // the display goes dark while the calculator is busy
    setTimeout(() => {
      busy = false;
      refresh();
      const next = queue.shift();
      if (next) run(next);
    }, ms);
  } else {
    refresh();
  }
}

function onModel(m) {
  settings.model = m;
  store.set('model', m);
  queue.length = 0;
  busy = false;
  calc.setModel(m); // switching models is like picking up the other calculator
  ui.setModel(m);
  buildKeymap();
  setModelName(m);
  refresh();
}

function onPower(on) {
  powered = on;
  queue.length = 0;
  calc.reset(); // no continuous memory on the HP-45: off/on clears everything
  refresh();
}

// key clicks (synthesised, no audio files)
let audio;
function click() {
  if (!settings.sound) return;
  try {
    audio ??= new (window.AudioContext || window.webkitAudioContext)();
    const o = audio.createOscillator();
    const g = audio.createGain();
    o.type = 'square';
    o.frequency.value = 1800;
    g.gain.setValueAtTime(0.08, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.025);
    o.connect(g).connect(audio.destination);
    o.start();
    o.stop(audio.currentTime + 0.03);
  } catch { /* no audio */ }
}

// PC keyboard
const KB = new Map();
function buildKeymap() {
  KB.clear();
  for (const k of KEY_LAYOUTS[calc.model].flat()) for (const c of k.kb ?? []) KB.set(c, k.id);
}
buildKeymap();
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.target.closest('input, textarea, select')) return;
  if (e.key === 'Enter' && e.target.closest('button') && !e.target.closest('.key')) return;
  const id = KB.get(e.key);
  if (!id) return;
  e.preventDefault();
  ui.flash(id);
  handleKey(id);
});

// ---------------------------------------------------------------- lab sheet (mobile)
const fab = document.getElementById('lab-toggle');
const labEl = document.getElementById('lab');
function setSheet(open) {
  labEl.classList.toggle('open', open);
  fab.classList.toggle('hidden', open);
  if (open) lab.draw();
}
fab.addEventListener('click', () => setSheet(true));
labEl.querySelector('.lab-close').addEventListener('click', () => setSheet(false));
function pulseFab() {
  fab.classList.remove('pulse');
  void fab.offsetWidth;
  fab.classList.add('pulse');
}

// ---------------------------------------------------------------- settings UI
const btnLang = document.getElementById('btn-lang');
btnLang.addEventListener('click', () => {
  const l = getLang() === 'de' ? 'en' : 'de';
  store.set('lang', l);
  setLang(l);
});
onLang(() => {
  applyStatic();
  btnLang.textContent = t('settings.lang');
  document.title = t('app.title');
  renderStatus();
});

const optTiming = document.getElementById('opt-timing');
optTiming.checked = settings.timing;
optTiming.addEventListener('change', () => {
  settings.timing = optTiming.checked;
  store.set('timing', settings.timing);
});
const optSound = document.getElementById('opt-sound');
optSound.checked = settings.sound;
optSound.addEventListener('change', () => {
  settings.sound = optSound.checked;
  store.set('sound', settings.sound);
});

// ---------------------------------------------------------------- PWA
let installEvt;
const btnInstall = document.getElementById('btn-install');
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  installEvt = e;
  btnInstall.hidden = false;
});
btnInstall.addEventListener('click', async () => {
  if (!installEvt) return;
  installEvt.prompt();
  await installEvt.userChoice;
  installEvt = null;
  btnInstall.hidden = true;
});
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' })
      .then((reg) => reg.update())
      .catch(() => {});
  });
  // a new version took over: reload once so it is shown immediately
  const hadController = !!navigator.serviceWorker.controller;
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || reloading) return;
    reloading = true;
    location.reload();
  });
}

// ---------------------------------------------------------------- start
setLang(detectLang(store.get('lang', null)));
refresh();

// Wires calculator, lab, settings and PWA together.

import { HP45 } from './calc/hp45.js';
import { KEY_LAYOUTS } from './calc/keys.js';
import { buildCalculator } from './ui/calculator.js';
import { Lab } from './ui/lab.js';
import { t, setLang, detectLang, applyStatic, getLang, onLang, setModelName } from './i18n.js';
import { openRpnGuide, TASKS, taskTexts, keys } from './ui/rpn-guide.js';
import './ui/sheet.js';
import { openKeyHelp } from './ui/keyhelp-ui.js';
import * as fn from './engine/functions.js';
import * as extra from './engine/extra.js';

const RECIPES = {
  fact: (a, t) => extra.factorial(a[0], t),
  dpct: (a, t) => extra.deltaPct(a[0], a[1], t),
  toDMS: (a, t) => extra.toDMS(a[0], t),
  fromDMS: (a, t) => extra.fromDMS(a[0], t),
  cmin: (a, t) => extra.unitConst('cmin', a[0], t),
  kglb: (a, t) => extra.unitConst('kglb', a[0], t),
  ltrgal: (a, t) => extra.unitConst('ltrgal', a[0], t),
};

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

/** Friendly number for the stack view: no 0.000000e00, real exponents. */
function friendly(v) {
  if (v === 0) return '0';
  const a = Math.abs(v);
  if (a >= 1e10 || a < 1e-6) {
    const [m, e] = v.toExponential(9).split('e');
    const mant = m.replace(/\.?0+$/, '');
    const SUP = { '-': '⁻', '+': '', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
    return `${mant} × 10${e.split('').map((c) => SUP[c] ?? c).join('')}`;
  }
  return String(Number(v.toPrecision(10)));
}

let prevStack = null;
function renderStatus() {
  if (!powered) {
    statusEl.innerHTML = '';
    prevStack = null;
    return;
  }
  const is35 = calc.model === 35;
  const mode = is35 ? t('status.auto') : `${calc.dispMode} ${calc.dispDigits}`;
  const typing = calc.entry ? calc.entryString().replace(/\s+/g, ' ').trim() : null;
  // the stack as a pile: T on top, X at the bottom (= the display)
  const vals = [3, 2, 1, 0].map((i) => calc.stack[i]);
  const names = ['T', 'Z', 'Y', 'X'];
  const rows = names.map((n, k) => {
    const isX = n === 'X';
    const shown = isX && typing !== null ? `${typing}<span class="caret"></span>` : friendly(vals[k]);
    const changed = prevStack && prevStack[k] !== vals[k] && !(isX && typing !== null);
    return `<div class="srow${isX ? ' x' : ''}${changed ? ' chg' : ''}"><b>${n}</b><span class="val">${shown}</span>${isX ? `<span class="xlabel">${t('status.display')}</span>` : ''}</div>`;
  }).join('');
  prevStack = vals;
  const mem = is35 ? `<div class="srow mem"><b>${t('status.mem')}</b><span class="val">${friendly(calc.regs[1])}</span><span class="xlabel">${t('status.memlabel')}</span></div>` : '';
  statusEl.innerHTML = `
    <div class="st-head">
      <button type="button" class="term" data-term="stack">${t('status.stack')}</button>
      <span class="st-links"><button type="button" class="help-link" data-keyhelp>${t('keyhelp.toggle')}</button><button type="button" class="help-link" data-rpn>${t('rpn.open')}</button></span>
    </div>
    <div class="stackviz">${rows}${mem}</div>
    <div class="modes"><span class="${(is35 ? calc.arc : calc.shift) ? 'on gold' : ''}">${t(is35 ? 'status.arc' : 'status.shift')}</span><span class="on">${calc.angle}</span><span class="on">${mode}</span>${calc.pending ? `<span class="on">${calc.pending.type.toUpperCase()}${calc.pending.op ? ' ' + ({ add: '+', sub: '−', mul: '×', div: '÷' })[calc.pending.op] : ''} _</span>` : ''}</div>`;
}

// ---------------------------------------------------------------- key help mode
let helpMode = false;
const helpBar = document.getElementById('helpbar');

function setHelpMode(on) {
  helpMode = on;
  document.body.classList.toggle('keyhelp-on', on);
  document.querySelectorAll('.settings [data-keyhelp]').forEach((b) => b.classList.toggle('primary', on));
  helpBar.hidden = !on;
  if (on) {
    helpBar.innerHTML = `<span>${t('keyhelp.on')}</span><button type="button" class="pill primary" data-keyhelp-off>${t('keyhelp.done')}</button>`;
    helpBar.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

document.addEventListener('click', (e) => {
  if (e.target.closest('[data-keyhelp]')) setHelpMode(!helpMode);
  if (e.target.closest('[data-keyhelp-off]')) setHelpMode(false);
});

/** Run an example calculation and show it in the lab ("See how it calculates"). */
function showInLab({ label, args, angle = 'DEG' }) {
  const steps = [];
  let result;
  if (['sin', 'cos', 'tan'].includes(label)) result = fn.trig(label, args[0], angle, steps);
  else if (['asin', 'acos', 'atan'].includes(label)) result = fn[label](args[0], angle, steps);
  else if (label === 'pow' || label === 'pow35') result = fn.pow(args[0], args[1], steps);
  else if (RECIPES[label]) {
    const rec = RECIPES[label](args, steps);
    lab.load({ label, args, angle, steps, result: rec.result, recipe: rec.recipe, noCost: label in { cmin: 1, kglb: 1, ltrgal: 1 } });
    setSheet(true);
    document.getElementById('lab').scrollIntoView({ block: 'start', behavior: 'smooth' });
    return;
  } else result = fn[label](args[0], steps);
  lab.load({ label, args, angle, steps, result });
  setSheet(true);
  document.getElementById('lab').scrollIntoView({ block: 'start', behavior: 'smooth' });
}

// ---------------------------------------------------------------- RPN guide & exercises
const taskEl = document.getElementById('task');
let task = null; // index into TASKS while exercising

function showTask() {
  const T = taskTexts();
  if (task === null) {
    taskEl.hidden = true;
    return;
  }
  const k = TASKS[task];
  taskEl.hidden = false;
  taskEl.className = 'task';
  taskEl.innerHTML = `
    <span class="task-q">${T.task.replace('{n}', task + 1).replace('{m}', TASKS.length)} <b>${k.q}</b></span>
    <span class="task-actions">
      <button type="button" class="pill" data-task="hint">${T.hint}</button>
      <button type="button" class="pill" data-task="quit" aria-label="${T.quit}">✕</button>
    </span>
    <span class="task-hint" hidden>${keys(k.hint)}</span>`;
}

function startTasks() {
  task = 0;
  calc.reset();
  refresh();
  showTask();
  taskEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

taskEl.addEventListener('click', (e) => {
  const b = e.target.closest('[data-task]');
  if (!b) return;
  if (b.dataset.task === 'hint') taskEl.querySelector('.task-hint').hidden = false;
  if (b.dataset.task === 'quit') {
    task = null;
    showTask();
  }
});

/** After every finished operation: did the user solve the current exercise? */
function checkTask(id) {
  if (task === null || calc.entry || calc.error) return;
  if (!['add', 'sub', 'mul', 'div'].includes(id)) return;
  if (Math.abs(calc.x - TASKS[task].target) > 1e-9) return;
  const T = taskTexts();
  const last = task === TASKS.length - 1;
  taskEl.className = 'task ok';
  taskEl.innerHTML = `<span class="task-q">✓ ${T.right} ${TASKS[task].q} = <b>${TASKS[task].target}</b>${last ? ` · ${T.done}` : ''}</span>`;
  const cur = task;
  setTimeout(() => {
    if (task !== cur) return;
    task = last ? null : task + 1;
    showTask();
  }, last ? 3500 : 1600);
}

document.addEventListener('click', (e) => {
  if (e.target.closest('[data-rpn]')) {
    hint?.remove();
    store.set('hintSeen', true);
    openRpnGuide(startTasks);
  }
});

// first visit: a gentle hint that this calculator types differently
let hint = null;
if (!store.get('hintSeen', false)) {
  hint = document.createElement('div');
  hint.className = 'coach';
  document.querySelector('.topbar').after(hint);
  const renderHint = () => {
    if (!hint?.isConnected) return;
    hint.innerHTML = `<span>${t('rpn.coach')}</span><button type="button" class="pill primary" data-rpn>${t('rpn.open')}</button><button type="button" class="icon-btn coach-x" aria-label="${t('lab.close')}">✕</button>`;
    hint.querySelector('.coach-x').addEventListener('click', () => {
      hint.remove();
      store.set('hintSeen', true);
    });
  };
  renderHint();
  onLang(renderHint);
}

function handleKey(id) {
  if (!powered) return;
  if (helpMode) {
    openKeyHelp(id, calc.model, showInLab);
    return;
  }
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
  checkTask(id);
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
  document.title = t('app.doctitle');
  if (helpMode) setHelpMode(true);
  showTask();
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

// One learning level for the whole app: Einsteiger / Fortgeschritten / Profi.
// Internal ids stay 'simple' | 'detail' | 'pro' (stored under hp45.level).

export const LEVELS = ['simple', 'detail', 'pro'];
const KEY = 'hp45.level';
const listeners = new Set();
let level = 'simple';
try {
  const v = localStorage.getItem(KEY);
  if (LEVELS.includes(v)) level = v;
} catch { /* storage unavailable */ }

export const getLevel = () => level;

export function setLevel(lv) {
  if (!LEVELS.includes(lv) || lv === level) return;
  level = lv;
  try {
    localStorage.setItem(KEY, lv);
  } catch { /* storage unavailable */ }
  document.documentElement.dataset.level = lv;
  listeners.forEach((f) => f(lv));
}

export function onLevel(f) {
  listeners.add(f);
  return () => listeners.delete(f);
}

if (typeof document !== 'undefined') document.documentElement.dataset.level = level;

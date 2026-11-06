// Stories for the "exotic" keys: they are recipes made of + − × ÷ and √.

import { nf } from './story.js';
import { costOf } from '../engine/cost.js';

const SYM = { add: '+', sub: '−', mul: '×', div: '÷' };

const INTRO = {
  fact: {
    de: (a) => `${a[0]}! heißt 1 · 2 · 3 · … · ${a[0]}. Der Rechner multipliziert einfach der Reihe nach – und jede Multiplikation besteht wieder aus Additionen.`,
    en: (a) => `${a[0]}! means 1 · 2 · 3 · … · ${a[0]}. The calculator simply multiplies one after another – and every multiplication is made of additions again.`,
  },
  dpct: {
    de: (a, l) => `Um wie viel Prozent ist es von ${nf(a[0], l)} auf ${nf(a[1], l)} gestiegen oder gefallen? Rezept: Unterschied ausrechnen, durch den Ausgangswert teilen, mal 100 – und „mal 100“ ist für den Rechner nur ein [[shift|Verschieben]] um zwei Stellen.`,
    en: (a, l) => `By how many percent did it change from ${nf(a[0], l)} to ${nf(a[1], l)}? Recipe: take the difference, divide by the starting value, times 100 – and “times 100” is just a [[shift|shift]] by two places.`,
  },
  toDMS: {
    de: (a, l) => `${nf(a[0], l)} Stunden (oder Grad) in Stunden, Minuten und Sekunden: Der Nachkommateil mal 60 ergibt die Minuten, deren Nachkommateil mal 60 die Sekunden. Das Ergebnis schreibt der Rechner als h.mmss.`,
    en: (a, l) => `${nf(a[0], l)} hours (or degrees) in hours, minutes and seconds: the fractional part times 60 gives the minutes, their fractional part times 60 the seconds. The calculator writes the result as h.mmss.`,
  },
  fromDMS: {
    de: (a, l) => `${nf(a[0], l)} in der Schreibweise h.mmss zurück in eine Dezimalzahl: Minuten ÷ 60 und Sekunden ÷ 3600 zu den Stunden dazuzählen.`,
    en: (a, l) => `${nf(a[0], l)} in h.mmss notation back to a decimal number: add minutes ÷ 60 and seconds ÷ 3600 to the hours.`,
  },
  sigma: {
    de: (a, l) => `Σ+ führt Buch: Es zählt mit, wie viele Werte es gibt (n), und addiert x, x² und y zu laufenden Summen in den [[register|Registern]] R5–R8. Mehr braucht es später für Mittelwert und Streuung nicht. Neuer Wert: x = ${nf(a[0], l)}.`,
    en: (a, l) => `Σ+ keeps the books: it counts how many values there are (n) and adds x, x² and y to running sums in the [[register|registers]] R5–R8. That is all it needs later for mean and deviation. New value: x = ${nf(a[0], l)}.`,
  },
  sigmaMinus: {
    de: (a, l) => `Σ− nimmt einen falsch erfassten Wert (x = ${nf(a[0], l)}) wieder aus der Buchführung heraus: dieselben Summen, nur abgezogen.`,
    en: (a, l) => `Σ− removes a wrongly entered value (x = ${nf(a[0], l)}) from the books again: the same sums, just subtracted.`,
  },
  mean: {
    de: () => 'Aus den Summen von Σ+ berechnet der Rechner den Mittelwert x̄ = Σx ÷ n. Für die Streuung s braucht er noch ein paar Schritte: n·Σx² − (Σx)², geteilt durch n·(n−1), daraus die Wurzel.',
    en: () => 'From the sums of Σ+ the calculator computes the mean x̄ = Σx ÷ n. The deviation s takes a few more steps: n·Σx² − (Σx)², divided by n·(n−1), then the square root.',
  },
};

const REG = { 5: 'n', 6: 'Σx²', 7: 'Σx', 8: 'Σy' };

function itemText(it, k, tr, lang) {
  const de = lang === 'de';
  const f = (v) => nf(v, lang, 10);
  if (it.op === 'int') return de ? `Ganzzahligen Teil abtrennen: ${f(it.a)} → <b>${f(it.r)}</b>` : `Split off the whole part: ${f(it.a)} → <b>${f(it.r)}</b>`;
  if (it.op === 'shift') return de ? `${f(it.a)} × 100: Komma um 2 Stellen [[shift|verschieben]] → <b>${f(it.r)}</b>` : `${f(it.a)} × 100: [[shift|shift]] the point by 2 places → <b>${f(it.r)}</b>`;
  if (it.op === 'join') return de ? `Zusammensetzen: ${it.a} h ${it.b} min ${nf(it.c, lang, 6)} s → <b>${f(it.r)}</b>` : `Putting it together: ${it.a} h ${it.b} min ${nf(it.c, lang, 6)} s → <b>${f(it.r)}</b>`;
  if (it.op === 'split') return de ? `Zerlegen: ${f(it.a)} → ${it.b} h, ${it.c} min, ${nf(it.d, lang, 6)} s` : `Splitting: ${f(it.a)} → ${it.b} h, ${it.c} min, ${nf(it.d, lang, 6)} s`;
  if (it.op === 'sqrt') return `√${f(it.a)} = <b>${f(it.r)}</b>`;
  let s = `${f(it.a)} ${SYM[it.op]} ${f(it.b)} = <b>${f(it.r)}</b>`;
  if (tr.label === 'sigma' || tr.label === 'sigmaMinus') {
    const reg = [5, null, 6, 7, 8][k];
    if (reg) s = `${REG[reg]}: ${s}`;
    else s = `x²: ${s}`;
  }
  return s;
}

const TITLE = {
  de: { add: 'Addieren', sub: 'Subtrahieren', mul: 'Multiplizieren', div: 'Dividieren', sqrt: 'Wurzel', int: 'Ganzzahl', shift: 'Verschieben', join: 'Zusammensetzen', split: 'Zerlegen', more: 'Und so weiter' },
  en: { add: 'Add', sub: 'Subtract', mul: 'Multiply', div: 'Divide', sqrt: 'Square root', int: 'Whole part', shift: 'Shift', join: 'Putting together', split: 'Splitting', more: 'And so on' },
};

/** @returns {object[]|null} story steps for a recipe trace, or null if the trace has no recipe */
export function recipeStory(tr, lang) {
  if (!tr.recipe) return null;
  const de = lang === 'de';
  const T = TITLE[lang] ?? TITLE.en;
  const st = tr.steps;
  const items = tr.recipe;
  const out = [{
    title: de ? 'Das Rezept' : 'The recipe',
    text: (INTRO[tr.label]?.[lang] ?? INTRO[tr.label]?.en ?? (() => ''))(tr.args, lang),
    viz: { kind: 'arith', idx: 0 },
  }];
  const kindOf = (it) => (it.op === 'sqrt' ? 'sqrt' : 'arith');
  const startOf = (k) => (k === 0 ? 0 : items[k - 1].end + 1);
  const costIn = (k) => costOf(st.slice(startOf(k), items[k].end + 1)).adds;
  const show = items.length > 7 ? [0, 1, 2, items.length - 1] : items.map((_, k) => k);
  show.forEach((k, n) => {
    if (n > 0 && k !== show[n - 1] + 1) {
      const skipped = k - show[n - 1] - 1;
      out.push({
        title: T.more,
        text: de ? `… noch ${skipped} weitere Schritte dieser Art.` : `… ${skipped} more steps of this kind.`,
        viz: { kind: 'arith', idx: Math.max(0, items[k - 1].end) },
      });
    }
    const it = items[k];
    const c = costIn(k);
    out.push({
      title: T[it.op] ?? it.op,
      text: itemText(it, k, tr, lang) + (c ? (de ? ` <span class="muted">(${c} Additionen)</span>` : ` <span class="muted">(${c} additions)</span>`) : ''),
      viz: { kind: kindOf(it), idx: Math.max(0, it.end) },
    });
  });
  const total = costOf(st).adds;
  const res = tr.resultText ?? nf(tr.result, lang, 10);
  out.push({
    title: de ? 'Ergebnis' : 'Result',
    text: de
      ? `Ergebnis: <b>${res}</b>. Das ganze Rezept hat ${total} Additionen gekostet – zusammengesetzt aus denselben Bausteinen wie alles andere.`
      : `Result: <b>${res}</b>. The whole recipe cost ${total} additions – built from the same blocks as everything else.`,
    merke: de ? 'Auch die Spezialtasten sind nur Rezepte aus +, −, × und ÷.' : 'Even the special keys are just recipes made of +, −, × and ÷.',
    viz: { kind: 'arith', idx: st.length - 1 },
  });
  return out;
}

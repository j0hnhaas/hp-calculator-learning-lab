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

const INTRO55 = {
  sigma55: {
    de: (a, l) => `Σ+ beim HP-55 führt für Wertepaare (x, y) Buch – sechs laufende Summen in den [[register|Registern]] R.0–R.5: n, Σx, Σx², Σy, Σy² und Σxy. Daraus entstehen später Mittelwerte, Streuung und die Ausgleichsgerade. Neues Paar: x = ${nf(a[0], l)}, y = ${nf(a[1], l)}.`,
    en: (a, l) => `Σ+ on the HP-55 keeps the books for pairs (x, y) – six running sums in the [[register|registers]] R.0–R.5: n, Σx, Σx², Σy, Σy² and Σxy. Means, deviation and the best-fit line all come from these later. New pair: x = ${nf(a[0], l)}, y = ${nf(a[1], l)}.`,
  },
  sigmaMinus55: {
    de: (a, l) => `Σ− nimmt das Paar x = ${nf(a[0], l)}, y = ${nf(a[1], l)} wieder aus den sechs Summen heraus – dieselben Schritte, nur abgezogen.`,
    en: (a, l) => `Σ− takes the pair x = ${nf(a[0], l)}, y = ${nf(a[1], l)} back out of the six sums – the same steps, just subtracted.`,
  },
  mean55: {
    de: () => 'Mittelwerte sind nur zwei Divisionen: x̄ = Σx ÷ n und ȳ = Σy ÷ n. x̄ landet in X, ȳ in Y – mit x⇄y holst du es nach vorne.',
    en: () => 'Means are just two divisions: x̄ = Σx ÷ n and ȳ = Σy ÷ n. x̄ goes to X, ȳ to Y – x⇄y brings it to the front.',
  },
  sdev55: {
    de: () => 'Die Streuung s sagt, wie weit die Werte typischerweise vom Mittelwert entfernt liegen. Rezept: n·Σx² − (Σx)², geteilt durch n·(n−1), daraus die Wurzel – einmal für x, einmal für y.',
    en: () => 'The deviation s tells how far the values typically lie from the mean. Recipe: n·Σx² − (Σx)², divided by n·(n−1), then the square root – once for x, once for y.',
  },
  lr: {
    de: () => 'L.R. sucht die Gerade y = a + b·x, die am besten durch alle Punkte passt (Methode der kleinsten Quadrate). Steigung b = (n·Σxy − Σx·Σy) ÷ (n·Σx² − (Σx)²), danach Achsenabschnitt a = (Σy − b·Σx) ÷ n. Ein Dutzend Grundrechnungen – mehr nicht.',
    en: () => 'L.R. finds the line y = a + b·x that fits all points best (least squares). Slope b = (n·Σxy − Σx·Σy) ÷ (n·Σx² − (Σx)²), then intercept a = (Σy − b·Σx) ÷ n. A dozen basic operations – nothing more.',
  },
  yhat: {
    de: (a, l) => `ŷ schätzt, welches y zu x = ${nf(a[0], l)} passt: Zuerst wird die Gerade wie bei L.R. berechnet, dann a + b·x.`,
    en: (a, l) => `ŷ estimates which y belongs to x = ${nf(a[0], l)}: first the line is computed as with L.R., then a + b·x.`,
  },
  hmsAdd: {
    de: (a, l) => `Zeiten in h.mmss kann man nicht einfach addieren – 1.30 + 2.45 wäre sonst 4.75 statt 4 h 15 min. Rezept: beide in Dezimalstunden umwandeln, addieren, zurückverwandeln. Hier ${nf(a[0], l)} + ${nf(a[1], l)}.`,
    en: (a, l) => `Times in h.mmss can't simply be added – 1.30 + 2.45 would give 4.75 instead of 4 h 15 min. Recipe: convert both to decimal hours, add, convert back. Here ${nf(a[0], l)} + ${nf(a[1], l)}.`,
  },
  hmsSub: {
    de: (a, l) => `Zeitspanne in h.mmss: beide Zeiten in Dezimalstunden umwandeln, abziehen, zurückverwandeln. Hier ${nf(a[0], l)} − ${nf(a[1], l)}.`,
    en: (a, l) => `Time difference in h.mmss: convert both to decimal hours, subtract, convert back. Here ${nf(a[0], l)} − ${nf(a[1], l)}.`,
  },
};
Object.assign(INTRO, INTRO55);

/** conversion keys of the HP-55: one real multiplication or division (two for temperatures) */
function convIntro(tr, lang) {
  const c = tr.conv;
  const de = lang === 'de';
  const x = nf(tr.args[0], lang);
  if (c.op === 'f2c') return de ? `${x} °F in °C: 32 abziehen, dann durch 1,8 teilen. Anders als die Umrechnungstasten des HP-45 rechnet der HP-55 die Umrechnung selbst aus.` : `${x} °F to °C: subtract 32, then divide by 1.8. Unlike the conversion keys of the HP-45, the HP-55 does the conversion itself.`;
  if (c.op === 'c2f') return de ? `${x} °C in °F: mal 1,8, dann 32 dazu.` : `${x} °C to °F: times 1.8, then add 32.`;
  const k = nf(c.k, lang, 10);
  const big = c.op === 'mul' ? c.to : c.from;
  const small = c.op === 'mul' ? c.from : c.to;
  return de
    ? `${x} ${c.from} in ${c.to}: 1 ${small} = ${k} ${big}, also ${c.op === 'mul' ? 'mal' : 'geteilt durch'} ${k}. Anders als beim HP-45 legt die Taste nicht nur die Konstante hin, sondern rechnet gleich selbst.`
    : `${x} ${c.from} to ${c.to}: 1 ${small} = ${k} ${big}, so ${c.op === 'mul' ? 'times' : 'divided by'} ${k}. Unlike the HP-45, the key doesn't just put down the constant – it does the calculation itself.`;
}

const REG = { 5: 'n', 6: 'Σx²', 7: 'Σx', 8: 'Σy' };
const REG55 = ['n', 'Σx', 'x²', 'Σx²', 'Σy', 'y²', 'Σy²', 'xy', 'Σxy'];

function itemText(it, k, tr, lang) {
  const de = lang === 'de';
  const f = (v) => nf(v, lang, 10);
  if (it.op === 'int') return de ? `Ganzzahligen Teil abtrennen: ${f(it.a)} → <b>${f(it.r)}</b>` : `Split off the whole part: ${f(it.a)} → <b>${f(it.r)}</b>`;
  if (it.op === 'shift') return de ? `${f(it.a)} × 100: Komma um 2 Stellen [[shift|verschieben]] → <b>${f(it.r)}</b>` : `${f(it.a)} × 100: [[shift|shift]] the point by 2 places → <b>${f(it.r)}</b>`;
  if (it.op === 'join') return de ? `Zusammensetzen: ${it.a} h ${it.b} min ${nf(it.c, lang, 6)} s → <b>${f(it.r)}</b>` : `Putting it together: ${it.a} h ${it.b} min ${nf(it.c, lang, 6)} s → <b>${f(it.r)}</b>`;
  if (it.op === 'split') return de ? `Zerlegen: ${f(it.a)} → ${it.b} h, ${it.c} min, ${nf(it.d, lang, 6)} s` : `Splitting: ${f(it.a)} → ${it.b} h, ${it.c} min, ${nf(it.d, lang, 6)} s`;
  if (it.op === 'sqrt') return `√${f(it.a)} = <b>${f(it.r)}</b>`;
  let s = `${f(it.a)} ${SYM[it.op]} ${f(it.b)} = <b>${f(it.r)}</b>`;
  if (tr.label === 'sigma55' || tr.label === 'sigmaMinus55') return `${REG55[k]}: ${s}`;
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
    text: tr.conv ? convIntro(tr, lang) : (INTRO[tr.label]?.[lang] ?? INTRO[tr.label]?.en ?? (() => ''))(tr.args, lang),
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

// ---------------------------------------------------------------- conversion keys
const UNIT_TEXT = {
  cmin: {
    de: { a: 'Zoll', b: 'cm', origin: 'Seit 1959 ist ein Zoll (inch) international auf <b>genau 2,54 cm</b> festgelegt – das ist eine Definition, keine Messung.' },
    en: { a: 'inches', b: 'cm', origin: 'Since 1959 an inch has been internationally defined as <b>exactly 2.54 cm</b> – a definition, not a measurement.' },
  },
  kglb: {
    de: { a: 'Pfund', b: 'kg', origin: 'Seit 1959 ist ein Pfund (pound) international auf <b>genau 0,45359237 kg</b> festgelegt.' },
    en: { a: 'pounds', b: 'kg', origin: 'Since 1959 a pound has been internationally defined as <b>exactly 0.45359237 kg</b>.' },
  },
  ltrgal: {
    de: { a: 'Gallonen', b: 'Liter', origin: 'Eine US-Gallone ist 231 Kubikzoll. Weil ein Zoll genau 2,54 cm ist, folgt: 231 × 2,54 × 2,54 × 2,54 = 3785,411784 cm³ = <b>3,785411784 Liter</b>.' },
    en: { a: 'gallons', b: 'litres', origin: 'A US gallon is 231 cubic inches. Since an inch is exactly 2.54 cm: 231 × 2.54 × 2.54 × 2.54 = 3785.411784 cm³ = <b>3.785411784 litres</b>.' },
  },
};

export function unitStory(tr, lang) {
  const de = lang === 'de';
  const U = UNIT_TEXT[tr.label]?.[lang] ?? UNIT_TEXT[tr.label]?.en;
  if (!U) return null;
  const st = tr.steps;
  const use = st.find((s) => s.phase === 'use');
  const k = nf(use.k, lang, 10);
  const v = use.v;
  const out = [{
    title: de ? 'Eine Zahl aus dem Speicher' : 'A number from memory',
    text: de
      ? `Diese Taste rechnet nichts aus: Sie legt nur die Zahl <b>${k}</b> auf den [[stack|Stapel]] – so viele ${U.b} hat ein ${U.a.replace(/n$/, '')}. Die eigentliche Umrechnung machst du danach mit × oder ÷.`
      : `This key computes nothing: it just puts the number <b>${k}</b> on the [[stack|stack]] – the number of ${U.b} in one ${U.a.replace(/s$/, '')}. You do the actual conversion afterwards with × or ÷.`,
    viz: { kind: 'const', idx: 0 },
  }];
  // show the last multiplication of the derivation: 231 × 2.54³ = 3785.411784
  const lastDeriv = st.reduce((acc, s, i) => (s.algo === 'mul' && s.phase === 'final' ? i : acc), -1);
  out.push({
    title: de ? 'Woher kommt die Zahl?' : 'Where does the number come from?',
    text: U.origin + (lastDeriv >= 0
      ? (de ? ' Der Rechner rechnet das nicht jedes Mal aus – die fertige Zahl steht im [[rom|ROM]]. Hier rechnen wir sie zur Probe nach.' : ' The calculator does not work this out every time – the finished number is in [[rom|ROM]]. Here we just check it.')
      : (de ? ' Die Zahl steht fertig im [[rom|ROM]].' : ' The number is stored ready-made in [[rom|ROM]].')),
    viz: lastDeriv >= 0 ? { kind: 'arith', idx: lastDeriv } : { kind: 'const', idx: 0 },
  });
  const ex = v || 10;
  out.push({
    title: de ? 'So rechnest du um' : 'How to convert',
    text: de
      ? `Die Zahl, die vorher in X stand (${nf(ex, lang)}), ist nach Y gerutscht. Jetzt entscheidest du:<br>× → ${nf(ex, lang)} ${U.a} sind <b>${nf(v ? use.mul : ex * use.k, lang, 10)} ${U.b}</b><br>÷ → ${nf(ex, lang)} ${U.b} sind <b>${nf(v ? use.div : ex / use.k, lang, 10)} ${U.a}</b>`
      : `The number that was in X before (${nf(ex, lang)}) has moved up to Y. Now you decide:<br>× → ${nf(ex, lang)} ${U.a} are <b>${nf(v ? use.mul : ex * use.k, lang, 10)} ${U.b}</b><br>÷ → ${nf(ex, lang)} ${U.b} are <b>${nf(v ? use.div : ex / use.k, lang, 10)} ${U.a}</b>`,
    merke: de ? 'Eine Konstante plus × oder ÷ – so geht jede Umrechnung in beide Richtungen.' : 'A constant plus × or ÷ – that is how every conversion works, in both directions.',
    viz: { kind: 'const', idx: st.indexOf(use) },
  });
  return out;
}

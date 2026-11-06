// Bilingual UI texts (Deutsch / English).

const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
export const sup = (n) => String(n).split('').map((c) => SUP[c] ?? c).join('');
const p10 = (j) => (j === 0 ? '1' : `10${sup(-j)}`);
const atanC = (j) => `atan(${p10(j)})`;
const lnC = (j) => (j === 0 ? 'ln 2' : `ln(1+${p10(j)})`);
const FN = { sin: 'sin', cos: 'cos', tan: 'tan' };

const de = {
  'app.title': 'HP-45 · Dezimales CORDIC',
  'app.subtitle': 'Simulation des HP-45 (1973) mit Blick ins Innere',
  'lab.title': 'Blick ins Innere',
  'lab.toggle': 'Inside',
  'lab.close': 'Schließen',
  'lab.empty': 'Drücke am Rechner eine Funktion wie SIN, COS, TAN, ln, eˣ, yˣ oder √x – oder wähle ein Beispiel. Hier siehst du dann Schritt für Schritt, wie der HP-45 sie nur mit Schieben und Addieren berechnet.',
  'lab.examples': 'Beispiele',
  'lab.step': 'Schritt',
  'lab.of': 'von',
  'lab.registers': 'Register (BCD)',
  'lab.constants': 'ROM-Konstanten',
  'lab.count': 'q',
  'lab.speed': 'Tempo',
  'lab.autoplay': 'Auto-Play',
  'lab.first': 'Anfang',
  'lab.prev': 'Schritt zurück',
  'lab.next': 'Nächster Schritt',
  'lab.play': 'Abspielen / Pause',
  'lab.last': 'Ende',
  'lab.result': 'Ergebnis',
  'lab.zoom': 'Zoom',
  'lab.about.title': 'Was passiert hier?',
  'lab.about.body': 'Der HP-45 hat keinen Multiplizierer. Er rechnet in BCD – jede Stelle eine Dezimalziffer – und kann Ziffern nur verschieben (×10, ÷10) und addieren. Trotzdem berechnet er sin, ln oder eˣ auf 10 Stellen genau. Der Trick ist eine dezimale Variante von CORDIC (Volder 1959, Meggitt 1962): Ein Winkel wird in Vielfache der ROM-Konstanten atan(1), atan(0,1), atan(0,01) … zerlegt (Pseudo-Division), danach wird ein Vektor genau so oft um diese Winkel gedreht (Pseudo-Multiplikation). Jede Drehung um atan(10⁻ʲ) ist nur „Wert um j Stellen verschieben und addieren“.',
  'phase.reduce': 'Reduktion',
  'phase.pdiv': 'Pseudo-Division',
  'phase.init': 'Startwert',
  'phase.pmul': 'Pseudo-Multiplikation',
  'phase.norm': 'Normierung √',
  'phase.final': 'Ergebnis',
  'phase.vec': 'Vektor zurückdrehen',
  'phase.resid': 'Rest',
  'phase.sum': 'Konstanten summieren',
  'phase.setup': 'Vorbereitung',
  'phase.digit': 'Wurzel Ziffer für Ziffer',
  'phase.small': 'Kleiner Winkel',
  'phase.exp10': 'Exponent',
  'settings.lang': 'EN',
  'settings.timing': 'Originaltempo',
  'settings.sound': 'Klick',
  'status.shift': 'SHIFT',
  'power.on': 'ON',
  'power.off': 'OFF',
  'install': 'Installieren',
  'algo.trig': 'Rotation (tan)',
  'algo.atan': 'Vektorisierung (atan)',
  'algo.ln': 'Logarithmus',
  'algo.exp': 'Exponential',
  'algo.sqrt': 'Quadratwurzel',
  msg: {
    'trig.reduce': (p) => `Argument auf den ${p.quadrant}. Quadranten reduziert (exakt dezimal, Modus ${p.mode}) und in Radiant umgerechnet. Ab hier rechnet der HP-45 nur noch mit einem Winkel θ zwischen 0 und π/2.`,
    'trig.pdiv.start': `Pseudo-Division: Wir ziehen von θ so oft wie möglich ${atanC(0)} = π/4 ab, dann ${atanC(1)}, ${atanC(2)} … und zählen mit. Das ist wie schriftliches Dividieren – nur mit Winkeln.`,
    'trig.pdiv.sub': (p) => `θ − ${atanC(p.j)}: passt noch. Zähler q${sub(p.j)} = ${p.n}.`,
    'trig.pdiv.decade': (p) => `Dekade ${p.j} fertig: ${atanC(p.j)} passt ${p.n}× hinein. Weiter mit der nächstkleineren Konstante.`,
    'trig.small': 'Der Winkel ist so klein, dass sin θ = tan θ = θ auf alle 10 Stellen gilt – keine Drehung nötig.',
    'trig.init': 'Übrig bleibt ein winziger Rest r. Für so kleine Winkel gilt tan r ≈ r. Startvektor: X = 1, Y = r.',
    'trig.pmul.rot': (p) => `Drehung um ${atanC(p.j)} (${p.k}/${p.n}): X′ = X − Y·${p10(p.j)}, Y′ = Y + X·${p10(p.j)}. Nur Ziffern um ${p.j} Stelle(n) verschieben und addieren!`,
    'trig.norm': 'Jetzt gilt Y/X = tan θ. Für sin und cos braucht der HP-45 noch die Länge des Vektors: R = √(X² + Y²). Die Länge ist durch die Drehungen leicht gewachsen – das kürzt sich aber heraus.',
    'trig.final.tan': 'tan θ = Y / X – eine einzige echte Division am Schluss.',
    'trig.final.cot': 'Ungerader Quadrant: tan = −X / Y.',
    'trig.final.sin': 'sin θ = Y / R, dann Vorzeichen und Quadrant angepasst.',
    'trig.final.cos': 'cos θ = X / R, dann Vorzeichen und Quadrant angepasst.',
    'sqrt.setup': (p) => `Zahl mit geradem Exponenten (10${sup(p.e)}) normiert. Die Wurzel wird Ziffer für Ziffer bestimmt.`,
    'sqrt.digit': (p) => `Ziffer ${p.k}: ungerade Zahlen 20r+1, 20r+3, … vom Rest abgezogen – ${p.d}× ging es. Die nächste Ziffer ist ${p.d}.`,
    'sqrt.final': 'Fertig: Die Wurzel ist entstanden, ohne ein einziges Mal zu multiplizieren.',
    'atan.setup': () => 'Startvektor (1, x). Sein Winkel zur x-Achse ist atan x.',
    'atan.setup.asin': 'asin x: Vektor (√(1−x²), x) – sein Winkel ist asin x. Erst die Wurzel, dann zurückdrehen.',
    'atan.setup.acos': 'acos x: Vektor (x, √(1−x²)) – sein Winkel ist acos x.',
    'atan.setup.polar': '→P: Der Vektor (x, y) wird auf die x-Achse zurückgedreht; die Drehwinkel ergeben θ.',
    'atan.start': `Vektorisierung: Wir drehen den Vektor um −${atanC(0)}, −${atanC(1)} … zurück, solange er oberhalb der x-Achse bleibt, und zählen mit.`,
    'atan.rot': (p) => `Zurückdrehen um ${atanC(p.j)}: X′ = X + Y·${p10(p.j)}, Y′ = Y − X·${p10(p.j)}. q${sub(p.j)} = ${p.n}.`,
    'atan.decade': (p) => `Dekade ${p.j}: ${p.n} Drehung(en). Noch eine Drehung würde unter die x-Achse führen.`,
    'atan.resid': 'Der Vektor liegt fast auf der x-Achse. Restwinkel r ≈ Y / X (eine Division).',
    'atan.sum': (p) => `θ += ${atanC(p.j)} (${p.k}/${p.n}) – die Drehungen werden als Winkel aufsummiert.`,
    'atan.final': (p) => `Ergebnis in ${p.mode} umgerechnet.`,
    'polar.final': 'r = √(x² + y²) und θ sind fertig.',
    'ln.setup': (p) => `x = M · 10${sup(p.e)}. Zuerst ln M für die Mantisse 1 ≤ M < 10.`,
    'ln.start': `Pseudo-Division: Wir bauen M als Produkt aus 2, 1,1, 1,01 … auf. Multiplizieren mit (1+${p10(1)}) heißt: Wert + Wert um 1 Stelle verschoben.`,
    'ln.mul': (p) => `P ← P · (1+${p10(p.j)}) – passt noch unter M. q${sub(p.j)} = ${p.n}.`,
    'ln.decade': (p) => `Dekade ${p.j}: Faktor ${p.j === 0 ? '2' : `1+${p10(p.j)}`} passt ${p.n}×.`,
    'ln.resid': 'Rest: M/P = 1 + r mit winzigem r, und ln(1+r) ≈ r.',
    'ln.sum': (p) => `ln M += ${lnC(p.j)} (${p.k}/${p.n}) – aus der ROM-Tabelle.`,
    'ln.exp10': (p) => `Dazu ${p.e} · ln 10 für den Exponenten.`,
    'ln.final': 'ln x fertig.',
    'log.final': 'log x = ln x / ln 10.',
    'exp.setup': (p) => `x = ${p.k} · ln 10 + r mit 0 ≤ r < ln 10. Dann ist eˣ = eʳ · 10${sup(p.k)}.`,
    'exp.start': `Pseudo-Division: Von r werden ${lnC(0)}, ${lnC(1)} … so oft wie möglich abgezogen.`,
    'exp.sub': (p) => `r − ${lnC(p.j)}: passt. q${sub(p.j)} = ${p.n}.`,
    'exp.decade': (p) => `Dekade ${p.j}: ${p.n}×.`,
    'exp.init': 'Winziger Rest ρ: e^ρ ≈ 1 + ρ. Startwert P = 1 + ρ.',
    'exp.mul': (p) => `P ← P + P·${p10(p.j)} (${p.k}/${p.n}) – multiplizieren mit (1+${p10(p.j)}) durch Schieben und Addieren.`,
    'exp.final': (p) => `eʳ fertig, mit 10${sup(p.k)} skaliert.`,
  },
};

const en = {
  'app.title': 'HP-45 · Decimal CORDIC',
  'app.subtitle': 'A simulation of the HP-45 (1973) with a look inside',
  'lab.title': 'Inside the HP-45',
  'lab.toggle': 'Inside',
  'lab.close': 'Close',
  'lab.empty': 'Press a function on the calculator such as SIN, COS, TAN, ln, eˣ, yˣ or √x – or pick an example. You will see step by step how the HP-45 computes it with nothing but shifts and additions.',
  'lab.examples': 'Examples',
  'lab.step': 'Step',
  'lab.of': 'of',
  'lab.registers': 'Registers (BCD)',
  'lab.constants': 'ROM constants',
  'lab.count': 'q',
  'lab.speed': 'Speed',
  'lab.autoplay': 'Auto-play',
  'lab.first': 'Start',
  'lab.prev': 'Step back',
  'lab.next': 'Next step',
  'lab.play': 'Play / pause',
  'lab.last': 'End',
  'lab.result': 'Result',
  'lab.zoom': 'Zoom',
  'lab.about.title': 'What is going on?',
  'lab.about.body': 'The HP-45 has no multiplier. It computes in BCD – one decimal digit per nibble – and can only shift digits (×10, ÷10) and add. Still it gets sin, ln or eˣ right to 10 digits. The trick is a decimal variant of CORDIC (Volder 1959, Meggitt 1962): an angle is split into multiples of the ROM constants atan(1), atan(0.1), atan(0.01) … (pseudo-division), then a vector is rotated by exactly those angles (pseudo-multiplication). Every rotation by atan(10⁻ʲ) is just “shift by j digits and add”.',
  'phase.reduce': 'Reduction',
  'phase.pdiv': 'Pseudo-division',
  'phase.init': 'Start value',
  'phase.pmul': 'Pseudo-multiplication',
  'phase.norm': 'Normalise √',
  'phase.final': 'Result',
  'phase.vec': 'Rotate back',
  'phase.resid': 'Residual',
  'phase.sum': 'Sum constants',
  'phase.setup': 'Setup',
  'phase.digit': 'Square root digit by digit',
  'phase.small': 'Small angle',
  'phase.exp10': 'Exponent',
  'settings.lang': 'DE',
  'settings.timing': 'Original speed',
  'settings.sound': 'Click',
  'status.shift': 'SHIFT',
  'power.on': 'ON',
  'power.off': 'OFF',
  'install': 'Install',
  'algo.trig': 'Rotation (tan)',
  'algo.atan': 'Vectoring (atan)',
  'algo.ln': 'Logarithm',
  'algo.exp': 'Exponential',
  'algo.sqrt': 'Square root',
  msg: {
    'trig.reduce': (p) => `Argument reduced to quadrant ${p.quadrant} (exactly, in decimal, mode ${p.mode}) and converted to radians. From here on the HP-45 only deals with an angle θ between 0 and π/2.`,
    'trig.pdiv.start': `Pseudo-division: subtract ${atanC(0)} = π/4 from θ as often as possible, then ${atanC(1)}, ${atanC(2)} … and count. Just like long division – with angles.`,
    'trig.pdiv.sub': (p) => `θ − ${atanC(p.j)}: still fits. Counter q${sub(p.j)} = ${p.n}.`,
    'trig.pdiv.decade': (p) => `Decade ${p.j} done: ${atanC(p.j)} fits ${p.n}×. On to the next smaller constant.`,
    'trig.small': 'The angle is so small that sin θ = tan θ = θ to all 10 digits – no rotation needed.',
    'trig.init': 'A tiny residual r is left. For such small angles tan r ≈ r. Start vector: X = 1, Y = r.',
    'trig.pmul.rot': (p) => `Rotate by ${atanC(p.j)} (${p.k}/${p.n}): X′ = X − Y·${p10(p.j)}, Y′ = Y + X·${p10(p.j)}. Just shift digits by ${p.j} place(s) and add!`,
    'trig.norm': 'Now Y/X = tan θ. For sin and cos the HP-45 also needs the vector length R = √(X² + Y²). The rotations made the vector slightly longer – but that cancels out.',
    'trig.final.tan': 'tan θ = Y / X – a single real division at the very end.',
    'trig.final.cot': 'Odd quadrant: tan = −X / Y.',
    'trig.final.sin': 'sin θ = Y / R, then sign and quadrant applied.',
    'trig.final.cos': 'cos θ = X / R, then sign and quadrant applied.',
    'sqrt.setup': (p) => `Number normalised with an even exponent (10${sup(p.e)}). The root is found digit by digit.`,
    'sqrt.digit': (p) => `Digit ${p.k}: odd numbers 20r+1, 20r+3, … subtracted from the remainder – it worked ${p.d}×. The next digit is ${p.d}.`,
    'sqrt.final': 'Done: the square root, without a single multiplication.',
    'atan.setup': () => 'Start vector (1, x). Its angle to the x-axis is atan x.',
    'atan.setup.asin': 'asin x: vector (√(1−x²), x) – its angle is asin x. Square root first, then rotate back.',
    'atan.setup.acos': 'acos x: vector (x, √(1−x²)) – its angle is acos x.',
    'atan.setup.polar': '→P: the vector (x, y) is rotated back onto the x-axis; the rotation angles add up to θ.',
    'atan.start': `Vectoring: rotate the vector back by −${atanC(0)}, −${atanC(1)} … as long as it stays above the x-axis, and count.`,
    'atan.rot': (p) => `Rotate back by ${atanC(p.j)}: X′ = X + Y·${p10(p.j)}, Y′ = Y − X·${p10(p.j)}. q${sub(p.j)} = ${p.n}.`,
    'atan.decade': (p) => `Decade ${p.j}: ${p.n} rotation(s). One more would cross the x-axis.`,
    'atan.resid': 'The vector is almost on the x-axis. Residual angle r ≈ Y / X (one division).',
    'atan.sum': (p) => `θ += ${atanC(p.j)} (${p.k}/${p.n}) – the rotations are summed up as an angle.`,
    'atan.final': (p) => `Result converted to ${p.mode}.`,
    'polar.final': 'r = √(x² + y²) and θ are done.',
    'ln.setup': (p) => `x = M · 10${sup(p.e)}. First ln M for the mantissa 1 ≤ M < 10.`,
    'ln.start': `Pseudo-division: build M as a product of 2, 1.1, 1.01 … Multiplying by (1+${p10(1)}) means: value + value shifted by 1 digit.`,
    'ln.mul': (p) => `P ← P · (1+${p10(p.j)}) – still below M. q${sub(p.j)} = ${p.n}.`,
    'ln.decade': (p) => `Decade ${p.j}: factor ${p.j === 0 ? '2' : `1+${p10(p.j)}`} fits ${p.n}×.`,
    'ln.resid': 'Residual: M/P = 1 + r with tiny r, and ln(1+r) ≈ r.',
    'ln.sum': (p) => `ln M += ${lnC(p.j)} (${p.k}/${p.n}) – from the ROM table.`,
    'ln.exp10': (p) => `Plus ${p.e} · ln 10 for the exponent.`,
    'ln.final': 'ln x done.',
    'log.final': 'log x = ln x / ln 10.',
    'exp.setup': (p) => `x = ${p.k} · ln 10 + r with 0 ≤ r < ln 10. Then eˣ = eʳ · 10${sup(p.k)}.`,
    'exp.start': `Pseudo-division: subtract ${lnC(0)}, ${lnC(1)} … from r as often as possible.`,
    'exp.sub': (p) => `r − ${lnC(p.j)}: fits. q${sub(p.j)} = ${p.n}.`,
    'exp.decade': (p) => `Decade ${p.j}: ${p.n}×.`,
    'exp.init': 'Tiny residual ρ: e^ρ ≈ 1 + ρ. Start value P = 1 + ρ.',
    'exp.mul': (p) => `P ← P + P·${p10(p.j)} (${p.k}/${p.n}) – multiplying by (1+${p10(p.j)}) via shift and add.`,
    'exp.final': (p) => `eʳ done, scaled by 10${sup(p.k)}.`,
  },
};

const SUB = '₀₁₂₃₄₅₆₇₈₉';
function sub(n) {
  return String(n).split('').map((c) => SUB[c] ?? c).join('');
}
export { sub, p10 };

const DICTS = { de, en };
let lang = 'de';
const listeners = new Set();

export function detectLang(saved) {
  if (saved === 'de' || saved === 'en') return saved;
  return (navigator.language || 'en').toLowerCase().startsWith('de') ? 'de' : 'en';
}

export function setLang(l) {
  lang = l;
  document.documentElement.lang = l;
  listeners.forEach((f) => f(l));
}

export function getLang() {
  return lang;
}

export function onLang(f) {
  listeners.add(f);
}

export function t(key) {
  return DICTS[lang][key] ?? DICTS.en[key] ?? key;
}

/** Translate a trace message [key, params]. */
export function tm(msg) {
  if (!msg) return '';
  const [key, params = {}] = msg;
  const m = DICTS[lang].msg[key] ?? DICTS.en.msg[key];
  if (!m) return key;
  return typeof m === 'function' ? m(params) : m;
}

/** Apply translations to [data-i18n] elements. */
export function applyStatic(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  root.querySelectorAll('[data-i18n-title]').forEach((el) => {
    el.title = t(el.dataset.i18nTitle);
    el.setAttribute('aria-label', t(el.dataset.i18nTitle));
  });
}

export { FN };

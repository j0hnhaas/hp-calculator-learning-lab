// Key help: one short card per function of the HP-35 / HP-45.
//   ex  – key sequence of an example (universal)
//   st  – stack before and after the key as [T, Z, Y, X] ('' = not shown)
//   lab – a calculation the lab can explain step by step
//   de/en.n – name, d – what it does (may contain [[term|links]]), r – example result

export const KEYHELP = {
  digit: {
    ex: '1 2 3',
    de: { n: 'Ziffern 0–9', d: 'Tippt eine Zahl in X – also in die Anzeige. Nach ENTER oder einer Rechenart beginnt automatisch eine neue Zahl.' },
    en: { n: 'Digits 0–9', d: 'Types a number into X – the display. After ENTER or an operation a new number starts automatically.' },
  },
  dot: {
    ex: '3 . 1 4',
    de: { n: 'Dezimalpunkt', d: 'Trennt die Nachkommastellen ab. Der Rechner nutzt den Punkt statt des Kommas.' },
    en: { n: 'Decimal point', d: 'Starts the decimal places.' },
  },
  enter: {
    ex: '3 ENTER↑ 4 +',
    st: [['', '', '', '3'], ['', '', '3', '3']],
    de: { n: 'ENTER ↑ – Zahl ablegen', d: 'Schließt die getippte Zahl ab und schiebt eine Kopie nach oben auf den [[stack|Stapel]], damit die nächste Zahl Platz hat. Nur zwischen zwei Zahlen nötig, die direkt hintereinander kommen.', r: '7' },
    en: { n: 'ENTER ↑ – put the number down', d: 'Finishes the typed number and pushes a copy up the [[stack|stack]] so the next number has room. Only needed between two numbers typed right after each other.', r: '7' },
  },
  chs: {
    ex: '5 CHS',
    de: { n: 'CHS – Vorzeichen wechseln', d: '„CHange Sign“: macht aus 5 eine −5 und umgekehrt. Direkt nach EEX wechselt es das Vorzeichen des Exponenten.', r: '−5' },
    en: { n: 'CHS – change sign', d: 'Turns 5 into −5 and back. Right after EEX it changes the sign of the exponent.', r: '−5' },
  },
  eex: {
    ex: '6.02 EEX 23',
    de: { n: 'EEX – Exponent eingeben', d: '„Enter EXponent“: für sehr große oder kleine Zahlen. 6.02 EEX 23 bedeutet 6,02 × 10²³ ([[mantissa|Mantisse und Exponent]]).', r: '6,02 × 10²³' },
    en: { n: 'EEX – enter exponent', d: 'For very large or small numbers. 6.02 EEX 23 means 6.02 × 10²³ ([[mantissa|mantissa and exponent]]).', r: '6.02 × 10²³' },
  },
  clx: {
    ex: '7 CLx 8',
    st: [['', '', '2', '7'], ['', '', '2', '0']],
    de: { n: 'CLx – X löschen', d: 'Setzt nur X auf 0 – zum Korrigieren einer falsch getippten Zahl. Der Rest des Stapels bleibt erhalten.' },
    en: { n: 'CLx – clear X', d: 'Sets only X to 0 – to fix a mistyped number. The rest of the stack stays.' },
  },
  swap: {
    ex: '3 ENTER↑ 12 x⇄y ÷',
    st: [['', '', '3', '12'], ['', '', '12', '3']],
    de: { n: 'x⇄y – X und Y tauschen', d: 'Vertauscht die beiden untersten Zahlen. Praktisch, wenn die Reihenfolge falsch war – zum Beispiel bei ÷ oder −.', r: '4' },
    en: { n: 'x⇄y – swap X and Y', d: 'Swaps the two bottom numbers. Handy when the order was wrong – for ÷ or −, for example.', r: '4' },
  },
  rdn: {
    ex: 'R↓',
    st: [['4', '3', '2', '1'], ['1', '4', '3', '2']],
    de: { n: 'R↓ – Stapel rollen', d: 'Rollt den [[stack|Stapel]] eine Ebene nach unten: X wandert nach ganz oben. Viermal R↓ und alles ist wieder wie vorher – so kannst du dir alle vier Zahlen ansehen.' },
    en: { n: 'R↓ – roll down', d: 'Rolls the [[stack|stack]] down one level: X moves to the very top. Four times R↓ and everything is back – a way to look at all four numbers.' },
  },
  add: {
    ex: '3 ENTER↑ 4 +',
    st: [['', '', '3', '4'], ['', '', '', '7']],
    de: { n: '+ Addieren', d: 'Rechnet Y + X und legt das Ergebnis nach X. Der Stapel rutscht eine Ebene nach unten.', r: '7' },
    en: { n: '+ Add', d: 'Computes Y + X and puts the result into X. The stack drops one level.', r: '7' },
  },
  sub: {
    ex: '10 ENTER↑ 3 −',
    st: [['', '', '10', '3'], ['', '', '', '7']],
    de: { n: '− Subtrahieren', d: 'Rechnet Y − X: die zuerst getippte Zahl minus die zweite.', r: '7' },
    en: { n: '− Subtract', d: 'Computes Y − X: the first number minus the second.', r: '7' },
  },
  mul: {
    ex: '6 ENTER↑ 7 ×',
    st: [['', '', '6', '7'], ['', '', '', '42']],
    de: { n: '× Multiplizieren', d: 'Rechnet Y × X. Einen Multiplizierer hat der Rechner trotzdem nicht: Er addiert und [[shift|verschiebt]] Ziffer für Ziffer – wie beim schriftlichen Multiplizieren.', r: '42' },
    en: { n: '× Multiply', d: 'Computes Y × X. The calculator still has no multiplier: it adds and [[shift|shifts]] digit by digit – like long multiplication.', r: '42' },
  },
  div: {
    ex: '20 ENTER↑ 4 ÷',
    st: [['', '', '20', '4'], ['', '', '', '5']],
    de: { n: '÷ Dividieren', d: 'Rechnet Y ÷ X. Intern: so oft abziehen wie möglich und mitzählen – wie beim schriftlichen Dividieren.', r: '5' },
    en: { n: '÷ Divide', d: 'Computes Y ÷ X. Internally: subtract as often as possible and count – like long division.', r: '5' },
  },
  inv: {
    ex: '4 1/x',
    de: { n: '1/x – Kehrwert', d: 'Rechnet 1 ÷ X.', r: '0,25' },
    en: { n: '1/x – reciprocal', d: 'Computes 1 ÷ X.', r: '0.25' },
  },
  sq: {
    ex: '7 x²',
    de: { n: 'x² – Quadrat', d: 'Rechnet X × X. (Beim HP-35 geht das mit ENTER↑ ×.)', r: '49' },
    en: { n: 'x² – square', d: 'Computes X × X. (On the HP-35: ENTER↑ ×.)', r: '49' },
  },
  sqrt: {
    ex: '2 √x',
    lab: { label: 'sqrt', args: [2] },
    de: { n: '√x – Quadratwurzel', d: 'Die Wurzel findet der Rechner [[sqrtdigits|Ziffer für Ziffer]], indem er ungerade Zahlen abzieht.', r: '1,414213562' },
    en: { n: '√x – square root', d: 'The calculator finds the root [[sqrtdigits|digit by digit]] by subtracting odd numbers.', r: '1.414213562' },
  },
  pow: {
    ex: '2 ENTER↑ 10 yˣ',
    st: [['', '', '2', '10'], ['', '', '', '1024']],
    lab: { label: 'pow', args: [2, 10] },
    de: { n: 'yˣ – Potenz', d: 'Rechnet Y hoch X: erst die Basis, ENTER, dann den Exponenten. Intern: e^(x · ln y) – ein [[log|Logarithmus]] und eine Zinsrechnung.', r: '1024' },
    en: { n: 'yˣ – power', d: 'Computes Y to the power of X: base first, ENTER, then the exponent. Internally: e^(x · ln y) – a [[log|logarithm]] and an interest calculation.', r: '1024' },
  },
  pow35: {
    ex: '10 ENTER↑ 2 xʸ',
    st: [['', '', '10', '2'], ['', '', '', '1024']],
    lab: { label: 'pow35', args: [2, 10] },
    de: { n: 'xʸ – Potenz (HP-35)', d: 'Rechnet X hoch Y – Achtung, beim HP-35 genau umgekehrt wie bei späteren Modellen: erst der Exponent, ENTER, dann die Basis.', r: '1024' },
    en: { n: 'xʸ – power (HP-35)', d: 'Computes X to the power of Y – note: on the HP-35 it is the other way round from later models: exponent first, ENTER, then the base.', r: '1024' },
  },
  ln: {
    ex: '7 ln',
    lab: { label: 'ln', args: [7] },
    de: { n: 'ln – natürlicher Logarithmus', d: 'Fragt: e hoch wie viel ergibt X? Der Rechner beantwortet das mit Zinsen ([[log|Logarithmus]]).', r: '1,945910149' },
    en: { n: 'ln – natural logarithm', d: 'Asks: e to the power of what gives X? The calculator answers it with interest ([[log|logarithm]]).', r: '1.945910149' },
  },
  log: {
    ex: '1000 log',
    lab: { label: 'log', args: [2000] },
    de: { n: 'log – Zehnerlogarithmus', d: 'Fragt: 10 hoch wie viel ergibt X? log 1000 = 3. Intern: ln X ÷ ln 10.', r: '3' },
    en: { n: 'log – common logarithm', d: 'Asks: 10 to the power of what gives X? log 1000 = 3. Internally: ln X ÷ ln 10.', r: '3' },
  },
  exp: {
    ex: '1 eˣ',
    lab: { label: 'exp', args: [2] },
    de: { n: 'eˣ – Exponentialfunktion', d: 'e ≈ 2,718 hoch X – die Umkehrung von ln. Für den Rechner eine Zinseszins-Rechnung ([[exp|Exponentialfunktion]]).', r: '2,718281828' },
    en: { n: 'eˣ – exponential', d: 'e ≈ 2.718 to the power of X – the inverse of ln. For the calculator a compound-interest calculation ([[exp|exponential function]]).', r: '2.718281828' },
  },
  exp10: {
    ex: '3 10ˣ',
    lab: { label: 'exp10', args: [2.5] },
    de: { n: '10ˣ – Zehnerpotenz', d: '10 hoch X – die Umkehrung von log.', r: '1000' },
    en: { n: '10ˣ – power of ten', d: '10 to the power of X – the inverse of log.', r: '1000' },
  },
  sin: {
    ex: '30 SIN',
    lab: { label: 'sin', args: [30], angle: 'DEG' },
    de: { n: 'SIN – Sinus', d: 'Der Sinus des Winkels in X ([[trig|Winkelfunktionen]]). Wie der Rechner das ohne Multiplizieren schafft, ist die Münzen-Geschichte im Labor.', r: '0,5' },
    en: { n: 'SIN – sine', d: 'The sine of the angle in X ([[trig|trig functions]]). How the calculator manages without multiplying is the coin story in the lab.', r: '0.5' },
  },
  cos: {
    ex: '60 COS',
    lab: { label: 'cos', args: [60], angle: 'DEG' },
    de: { n: 'COS – Kosinus', d: 'Der Kosinus des Winkels in X ([[trig|Winkelfunktionen]]).', r: '0,5' },
    en: { n: 'COS – cosine', d: 'The cosine of the angle in X ([[trig|trig functions]]).', r: '0.5' },
  },
  tan: {
    ex: '45 TAN',
    lab: { label: 'tan', args: [45], angle: 'DEG' },
    de: { n: 'TAN – Tangens', d: 'Der Tangens des Winkels in X: Höhe ÷ Abstand ([[trig|Winkelfunktionen]]).', r: '1' },
    en: { n: 'TAN – tangent', d: 'The tangent of the angle in X: height ÷ distance ([[trig|trig functions]]).', r: '1' },
  },
  asin: {
    ex: '0.5 SIN⁻¹',
    lab: { label: 'asin', args: [0.5], angle: 'DEG' },
    de: { n: 'SIN⁻¹ – Arkussinus', d: 'Umkehrung: Zu welchem Winkel gehört dieser Sinus?', r: '30' },
    en: { n: 'SIN⁻¹ – arcsine', d: 'Inverse: which angle has this sine?', r: '30' },
  },
  acos: {
    ex: '0.5 COS⁻¹',
    lab: { label: 'acos', args: [0.5], angle: 'DEG' },
    de: { n: 'COS⁻¹ – Arkuskosinus', d: 'Umkehrung: Zu welchem Winkel gehört dieser Kosinus?', r: '60' },
    en: { n: 'COS⁻¹ – arccosine', d: 'Inverse: which angle has this cosine?', r: '60' },
  },
  atan: {
    ex: '1 TAN⁻¹',
    lab: { label: 'atan', args: [1], angle: 'DEG' },
    de: { n: 'TAN⁻¹ – Arkustangens', d: 'Umkehrung: Wie steil ist eine Rampe mit diesem Verhältnis Höhe ÷ Abstand ([[atan|atan]])?', r: '45' },
    en: { n: 'TAN⁻¹ – arctangent', d: 'Inverse: how steep is a ramp with this height ÷ distance ([[atan|atan]])?', r: '45' },
  },
  arc: {
    ex: '0.5 arc sin',
    lab: { label: 'asin', args: [0.5], angle: 'DEG' },
    de: { n: 'arc – Umkehrfunktion (HP-35)', d: 'Vorsatztaste: arc sin ist der Arkussinus, arc cos und arc tan entsprechend.', r: '30' },
    en: { n: 'arc – inverse (HP-35)', d: 'Prefix key: arc sin is the arcsine, arc cos and arc tan likewise.', r: '30' },
  },
  shift: {
    ex: 'f 1/x',
    de: { n: 'Gold-Taste', d: 'Die nächste Taste führt die goldene Funktion aus, die über ihr steht. Der HP-45 war der erste Taschenrechner mit so einer Umschalttaste.' },
    en: { n: 'Gold key', d: 'The next key performs the gold function printed above it. The HP-45 was the first pocket calculator with such a shift key.' },
  },
  toP: {
    ex: '4 ENTER↑ 3 →P',
    st: [['', '', '4', '3'], ['', '', '53,13', '5']],
    lab: { label: 'atan', args: [4 / 3], angle: 'DEG' },
    de: { n: '→P – in Polarkoordinaten', d: 'Macht aus einem Pfeil (x in X, y in Y) Länge r (nach X) und Winkel θ (nach Y). Der Winkel entsteht durch [[vectoring|Vektorisierung]].', r: 'r = 5, θ = 53,13°' },
    en: { n: '→P – to polar', d: 'Turns an arrow (x in X, y in Y) into length r (into X) and angle θ (into Y). The angle comes from [[vectoring|vectoring]].', r: 'r = 5, θ = 53.13°' },
  },
  toR: {
    ex: '30 ENTER↑ 2 →R',
    st: [['', '', '30', '2'], ['', '', '1', '1,732']],
    de: { n: '→R – in rechtwinklige Koordinaten', d: 'Umkehrung von →P: aus Winkel θ (in Y) und Länge r (in X) werden x (nach X) und y (nach Y).', r: 'x = 1,732, y = 1' },
    en: { n: '→R – to rectangular', d: 'Inverse of →P: angle θ (in Y) and length r (in X) become x (into X) and y (into Y).', r: 'x = 1.732, y = 1' },
  },
  fact: {
    ex: '5 n!',
    lab: { label: 'fact', args: [5] },
    de: { n: 'n! – Fakultät', d: '1 · 2 · 3 · … · n. Zählt zum Beispiel, wie viele Reihenfolgen es für n Dinge gibt. Bis 69!.', r: '120' },
    en: { n: 'n! – factorial', d: '1 · 2 · 3 · … · n. Counts, for example, how many orders there are for n things. Up to 69!.', r: '120' },
  },
  sigma: {
    ex: '2 Σ+ 4 Σ+ 9 Σ+',
    de: { n: 'Σ+ – Messwert erfassen', d: 'Nimmt X (und Y) in die Statistik auf und zeigt, wie viele Werte schon drin sind. Die Summen liegen in den Registern R5–R8.', r: '3' },
    en: { n: 'Σ+ – add data point', d: 'Adds X (and Y) to the statistics and shows how many values are in. The sums live in registers R5–R8.', r: '3' },
  },
  sigmaMinus: {
    ex: '4 Σ−',
    de: { n: 'Σ− – Messwert entfernen', d: 'Nimmt einen falsch erfassten Wert wieder heraus.' },
    en: { n: 'Σ− – remove data point', d: 'Removes a wrongly entered value again.' },
  },
  mean: {
    ex: 'f x̄,s',
    st: [['', '', '', '3'], ['', '', '3,606', '5']],
    de: { n: 'x̄, s – Mittelwert und Streuung', d: 'Nach Σ+: Mittelwert nach X, Standardabweichung nach Y. Für 2, 4, 9: Mittelwert 5.', r: 'x̄ = 5, s = 3,606' },
    en: { n: 'x̄, s – mean and deviation', d: 'After Σ+: mean into X, standard deviation into Y. For 2, 4, 9: mean 5.', r: 'x̄ = 5, s = 3.606' },
  },
  pct: {
    ex: '200 ENTER↑ 15 %',
    st: [['', '', '200', '15'], ['', '', '200', '30']],
    de: { n: '% – Prozent', d: 'X Prozent von Y. Y bleibt stehen – praktisch, um gleich + oder − zu rechnen (Rabatt, Aufschlag).', r: '30' },
    en: { n: '% – percent', d: 'X percent of Y. Y stays – handy for adding or subtracting right away (discount, mark-up).', r: '30' },
  },
  dpct: {
    ex: '80 ENTER↑ 100 Δ%',
    lab: { label: 'dpct', args: [80, 100] },
    de: { n: 'Δ% – prozentuale Änderung', d: 'Um wie viel Prozent ist es von Y nach X gestiegen oder gefallen?', r: '25' },
    en: { n: 'Δ% – percent change', d: 'By how many percent did it rise or fall from Y to X?', r: '25' },
  },
  toDMS: {
    ex: '1.5 →D.MS',
    lab: { label: 'toDMS', args: [1.5] },
    de: { n: '→D.MS – in Grad/Stunden, Minuten, Sekunden', d: 'Macht aus 1,5 Stunden die Schreibweise 1.3000 = 1 h 30 min 00 s.', r: '1.3000' },
    en: { n: '→D.MS – to degrees/hours, minutes, seconds', d: 'Turns 1.5 hours into the notation 1.3000 = 1 h 30 min 00 s.', r: '1.3000' },
  },
  fromDMS: {
    ex: '1.3 D.MS→',
    lab: { label: 'fromDMS', args: [1.3] },
    de: { n: 'D.MS→ – in Dezimalzahl', d: 'Umkehrung: aus 1.30 (1 h 30 min) wird 1,5.', r: '1,5' },
    en: { n: 'D.MS→ – to decimal', d: 'Inverse: 1.30 (1 h 30 min) becomes 1.5.', r: '1.5' },
  },
  fix: {
    ex: 'FIX 4',
    de: { n: 'FIX – Nachkommastellen', d: 'FIX n zeigt n Nachkommastellen. Intern rechnet der Rechner immer mit 10 Stellen weiter – es ändert sich nur die Anzeige.' },
    en: { n: 'FIX – decimal places', d: 'FIX n shows n decimal places. Internally the calculator keeps working with 10 digits – only the display changes.' },
  },
  sci: {
    ex: 'f FIX 3',
    de: { n: 'SCI – wissenschaftliche Anzeige', d: 'SCI n zeigt jede Zahl als Mantisse mit n Nachkommastellen und Exponent, z. B. 1.235 04.' },
    en: { n: 'SCI – scientific display', d: 'SCI n shows every number as mantissa with n decimals and exponent, e.g. 1.235 04.' },
  },
  deg: {
    ex: 'f DEG',
    de: { n: 'DEG – Grad', d: 'Winkel in Grad: ein voller Kreis hat 360°.' },
    en: { n: 'DEG – degrees', d: 'Angles in degrees: a full circle is 360°.' },
  },
  rad: {
    ex: 'f RAD',
    de: { n: 'RAD – Bogenmaß', d: 'Winkel im [[radian|Bogenmaß]]: ein voller Kreis ist 2π ≈ 6,283.' },
    en: { n: 'RAD – radians', d: 'Angles in [[radian|radians]]: a full circle is 2π ≈ 6.283.' },
  },
  grd: {
    ex: 'f GRD',
    de: { n: 'GRD – Gon', d: 'Winkel in Gon (Neugrad): ein voller Kreis hat 400 gon. Beliebt in der Landvermessung.' },
    en: { n: 'GRD – grads', d: 'Angles in grads: a full circle is 400 grad. Popular in surveying.' },
  },
  clear: {
    ex: 'f CLEAR',
    de: { n: 'CLEAR – alles löschen', d: 'Löscht den ganzen Stapel und die Statistik-Register R5–R8. Ganz sauber wird der HP-45 nur durch Aus- und Einschalten.' },
    en: { n: 'CLEAR – clear all', d: 'Clears the whole stack and the statistics registers R5–R8. The HP-45 is only fully cleared by switching it off and on.' },
  },
  clr: {
    ex: 'CLR',
    de: { n: 'CLR – Stapel löschen', d: 'Setzt alle vier Plätze des [[stack|Stapels]] auf 0.' },
    en: { n: 'CLR – clear stack', d: 'Sets all four places of the [[stack|stack]] to 0.' },
  },
  sto: {
    ex: '7 STO 1',
    de: { n: 'STO – speichern', d: 'STO n legt X im Speicher n (1–9) ab. Mit STO + n wird X zum Speicher addiert (auch −, ×, ÷).' },
    en: { n: 'STO – store', d: 'STO n stores X in memory n (1–9). STO + n adds X to that memory (also −, ×, ÷).' },
    de35: { n: 'STO – speichern', d: 'Legt X im (einzigen) Speicher ab. Unter dem Rechner siehst du ihn als S.' },
    en35: { n: 'STO – store', d: 'Stores X in the (only) memory. You see it below the calculator as S.' },
  },
  rcl: {
    ex: 'RCL 1',
    de: { n: 'RCL – zurückholen', d: 'RCL n holt den Inhalt von Speicher n nach X.' },
    en: { n: 'RCL – recall', d: 'RCL n brings the contents of memory n into X.' },
    de35: { n: 'RCL – zurückholen', d: 'Holt den gespeicherten Wert nach X.' },
    en35: { n: 'RCL – recall', d: 'Brings the stored value into X.' },
  },
  lastx: {
    ex: '12 ENTER↑ 3 ÷ LAST x ×',
    de: { n: 'LAST x – letztes X zurück', d: 'Holt die Zahl zurück, die vor der letzten Rechnung in X stand. Rettet Tippfehler: falsche Rechenart rückgängig machen und neu rechnen.' },
    en: { n: 'LAST x', d: 'Brings back the number that was in X before the last operation. Saves typos: undo the wrong operation and redo it.' },
  },
  pi: {
    ex: 'π',
    de: { n: 'π – Pi', d: 'Die Kreiszahl 3,141592654.', r: '3,141592654' },
    en: { n: 'π – pi', d: 'The circle constant 3.141592654.', r: '3.141592654' },
  },
  cmin: {
    lab: { label: 'cmin', args: [10] },
    ex: '10 cm/in ×',
    de: { n: 'cm/in – Zoll', d: 'Legt 2,54 auf den Stapel (cm pro Zoll). 10 Zoll in cm: 10 cm/in ×. Umgekehrt mit ÷.', r: '25,4' },
    en: { n: 'cm/in – inches', d: 'Puts 2.54 on the stack (cm per inch). 10 inches in cm: 10 cm/in ×. The other way with ÷.', r: '25.4' },
  },
  kglb: {
    lab: { label: 'kglb', args: [10] },
    ex: '10 kg/lb ×',
    de: { n: 'kg/lb – Pfund', d: 'Legt 0,4536 auf den Stapel (kg pro Pfund).', r: '4,536' },
    en: { n: 'kg/lb – pounds', d: 'Puts 0.4536 on the stack (kg per pound).', r: '4.536' },
  },
  ltrgal: {
    lab: { label: 'ltrgal', args: [10] },
    ex: '10 ltr/gal ×',
    de: { n: 'ltr/gal – Gallonen', d: 'Legt 3,785 auf den Stapel (Liter pro US-Gallone).', r: '37,85' },
    en: { n: 'ltr/gal – gallons', d: 'Puts 3.785 on the stack (litres per US gallon).', r: '37.85' },
  },
  // ---------------------------------------------------------------- HP-55
  fkey: {
    ex: "30 f SIN",
    de: { n: "f – goldene Umschalttaste", d: "Der HP-55 hat zwei Umschalttasten. Nach f gilt für die nächste Taste die goldene Beschriftung über der Taste. Ein zweites f schaltet wieder aus.", r: "0,5" },
    en: { n: "f – gold shift key", d: "The HP-55 has two shift keys. After f the next key does what is printed in gold above it. Pressing f again cancels.", r: "0.5" },
  },
  gkey: {
    ex: "0.5 g SIN⁻¹",
    de: { n: "g – blaue Umschalttaste", d: "Nach g gilt für die nächste Taste die blaue Beschriftung unter der Taste – meist die Umkehrfunktion der goldenen (z. B. SIN⁻¹ statt SIN).", r: "30" },
    en: { n: "g – blue shift key", d: "After g the next key does what is printed in blue below it – usually the inverse of the gold function (e.g. SIN⁻¹ instead of SIN).", r: "30" },
  },
  sigma55: {
    ex: "2 ENTER↑ 1 Σ+",
    de: { n: "Σ+ – Wertepaar erfassen", d: "Nimmt x und y als Paar in die Statistik auf und zählt n mit. Die sechs laufenden Summen stehen in den [[register|Registern]] R.0–R.5 (n, Σx, Σx², Σy, Σy², Σxy). Für einzelne Werte reicht x – y ist dann einfach mit dabei.", r: "n = 1" },
    en: { n: "Σ+ – add a data pair", d: "Adds x and y as a pair to the statistics and counts n. The six running sums live in the [[register|registers]] R.0–R.5 (n, Σx, Σx², Σy, Σy², Σxy). For single values just use x.", r: "n = 1" },
  },
  sigmaMinus55: {
    ex: "2 ENTER↑ 1 f Σ−",
    de: { n: "Σ− – Paar wieder entfernen", d: "Nimmt ein falsch erfasstes Paar (y, x) wieder aus allen sechs Summen heraus." },
    en: { n: "Σ− – remove a pair", d: "Removes a wrongly entered pair (y, x) from all six sums again." },
  },
  mean55: {
    ex: "f x̄",
    de: { n: "x̄ – Mittelwerte", d: "Berechnet aus den Summen den Mittelwert von x (nach X) und von y (nach Y)." },
    en: { n: "x̄ – means", d: "Computes the mean of x (into X) and of y (into Y) from the sums." },
  },
  sdev55: {
    ex: "g s",
    de: { n: "s – Standardabweichung", d: "Wie weit streuen die Werte um den Mittelwert? sx kommt nach X, sy nach Y. Braucht mindestens zwei Paare." },
    en: { n: "s – standard deviation", d: "How widely do the values spread around the mean? sx goes to X, sy to Y. Needs at least two pairs." },
  },
  lr: {
    ex: "f L.R.",
    de: { n: "L.R. – Ausgleichsgerade", d: "Lineare Regression: legt die Gerade y = a + b·x so durch die erfassten Punkte, dass die Abweichungen möglichst klein sind. Achsenabschnitt a kommt nach X, Steigung b nach Y." },
    en: { n: "L.R. – linear regression", d: "Fits the line y = a + b·x through the entered points with the smallest possible deviations. Intercept a goes to X, slope b to Y." },
  },
  yhat: {
    ex: "5 ŷ",
    de: { n: "ŷ – Schätzwert", d: "Setzt x in die Ausgleichsgerade ein und liefert das passende y. So kann man Messreihen fortschreiben." },
    en: { n: "ŷ – estimate", d: "Puts x into the regression line and returns the matching y. That lets you extend a series of measurements." },
  },
  hmsAdd: {
    lab: {label: "hmsAdd", args: [1.3, 2.45]},
    ex: "1.30 ENTER↑ 2.45 f H.MS+",
    de: { n: "H.MS+ – Zeiten addieren", d: "Addiert zwei Zeiten in der Schreibweise h.mmss richtig: 1 h 30 min + 2 h 45 min = 4 h 15 min.", r: "4,15" },
    en: { n: "H.MS+ – add times", d: "Adds two times written as h.mmss correctly: 1 h 30 min + 2 h 45 min = 4 h 15 min.", r: "4.15" },
  },
  hmsSub: {
    lab: {label: "hmsSub", args: [4.15, 1.3]},
    ex: "4.15 ENTER↑ 1.30 g H.MS−",
    de: { n: "H.MS− – Zeiten abziehen", d: "Zieht zwei Zeiten in h.mmss voneinander ab – z. B. für Fahrzeiten.", r: "2,45" },
    en: { n: "H.MS− – subtract times", d: "Subtracts two times in h.mmss – e.g. for travel times.", r: "2.45" },
  },
  clr55: {
    ex: "f CLEAR",
    de: { n: "CLEAR – alles löschen", d: "Löscht den Stapel und die Speicher R0–R9." },
    en: { n: "CLEAR – clear all", d: "Clears the stack and memories R0–R9." },
  },
  clrR: {
    ex: "g CL.R",
    de: { n: "CL.R – Statistikspeicher löschen", d: "Löscht den Stapel und die Speicher R.0–R.9 – vor einer neuen Statistik." },
    en: { n: "CL.R – clear statistics registers", d: "Clears the stack and memories R.0–R.9 – before a new set of statistics." },
  },
  rs: {
    de: { n: "R/S – Programm starten/anhalten", d: "Startet oder stoppt ein gespeichertes Programm. Programmieren kommt in einem späteren Teil dieser Simulation." },
    en: { n: "R/S – run/stop", d: "Starts or stops a stored program. Programming will come in a later part of this simulation." },
  },
  sst: {
    de: { n: "SST – Einzelschritt", d: "Führt ein Programm Schritt für Schritt aus. Kommt mit der Programmierung." },
    en: { n: "SST – single step", d: "Runs a program one step at a time. Comes with programming." },
  },
  bst: {
    de: { n: "BST – Schritt zurück", d: "Geht im Programm einen Schritt zurück. Außerhalb von Programmen bricht BST eine angefangene Eingabe wie STO ab." },
    en: { n: "BST – back step", d: "Steps back one program line. Outside programs BST cancels a started entry such as STO." },
  },
  gto: {
    de: { n: "GTO – springen", d: "Springt zu einer Programmzeile. Kommt mit der Programmierung." },
    en: { n: "GTO – go to", d: "Jumps to a program line. Comes with programming." },
  },
  xle: {
    de: { n: "x≤y – Vergleich", d: "Programmtest: Ist x ≤ y, geht es normal weiter, sonst wird gesprungen. Kommt mit der Programmierung." },
    en: { n: "x≤y – test", d: "Program test: if x ≤ y the program continues, otherwise it jumps. Comes with programming." },
  },
  xeq: {
    de: { n: "x=y – Vergleich", d: "Programmtest auf Gleichheit. Kommt mit der Programmierung." },
    en: { n: "x=y – test", d: "Program test for equality. Comes with programming." },
  },
  in2mm: {
    lab: {label: "in2mm", args: [10]},
    ex: "10 f in→mm",
    de: { n: "in→mm – Zoll in mm", d: "Rechnet X von Zoll in mm um – der HP-55 rechnet dabei selbst (beim HP-45 legten die Umrechnungstasten nur eine Konstante hin).", r: "254" },
    en: { n: "in→mm – inches to mm", d: "Converts X from inches to mm – the HP-55 does the calculation itself (the HP-45 keys only put down a constant).", r: "254" },
  },
  mm2in: {
    lab: {label: "mm2in", args: [254]},
    ex: "254 g mm→in",
    de: { n: "mm→in – mm in Zoll", d: "Rechnet X von mm in Zoll um – der HP-55 rechnet dabei selbst (beim HP-45 legten die Umrechnungstasten nur eine Konstante hin).", r: "10" },
    en: { n: "mm→in – mm to inches", d: "Converts X from mm to inches – the HP-55 does the calculation itself (the HP-45 keys only put down a constant).", r: "10" },
  },
  ft2m: {
    lab: {label: "ft2m", args: [10]},
    ex: "10 f ft→m",
    de: { n: "ft→m – Fuß in Meter", d: "Rechnet X von Fuß in Meter um – der HP-55 rechnet dabei selbst (beim HP-45 legten die Umrechnungstasten nur eine Konstante hin).", r: "3,048" },
    en: { n: "ft→m – feet to metres", d: "Converts X from feet to metres – the HP-55 does the calculation itself (the HP-45 keys only put down a constant).", r: "3.048" },
  },
  m2ft: {
    lab: {label: "m2ft", args: [3.048]},
    ex: "3.048 g m→ft",
    de: { n: "m→ft – Meter in Fuß", d: "Rechnet X von Meter in Fuß um – der HP-55 rechnet dabei selbst (beim HP-45 legten die Umrechnungstasten nur eine Konstante hin).", r: "10" },
    en: { n: "m→ft – metres to feet", d: "Converts X from metres to feet – the HP-55 does the calculation itself (the HP-45 keys only put down a constant).", r: "10" },
  },
  gal2l: {
    lab: {label: "gal2l", args: [10]},
    ex: "10 f gal→l",
    de: { n: "gal→l – US-Gallonen in Liter", d: "Rechnet X von US-Gallonen in Liter um – der HP-55 rechnet dabei selbst (beim HP-45 legten die Umrechnungstasten nur eine Konstante hin).", r: "37,85411784" },
    en: { n: "gal→l – US gallons to litres", d: "Converts X from US gallons to litres – the HP-55 does the calculation itself (the HP-45 keys only put down a constant).", r: "37.85411784" },
  },
  l2gal: {
    lab: {label: "l2gal", args: [10]},
    ex: "10 g l→gal",
    de: { n: "l→gal – Liter in US-Gallonen", d: "Rechnet X von Liter in US-Gallonen um – der HP-55 rechnet dabei selbst (beim HP-45 legten die Umrechnungstasten nur eine Konstante hin).", r: "2,641720524" },
    en: { n: "l→gal – litres to US gallons", d: "Converts X from litres to US gallons – the HP-55 does the calculation itself (the HP-45 keys only put down a constant).", r: "2.641720524" },
  },
  lbm2kg: {
    lab: {label: "lbm2kg", args: [10]},
    ex: "10 f lbm→kg",
    de: { n: "lbm→kg – Pfund in kg", d: "Rechnet X von Pfund in kg um – der HP-55 rechnet dabei selbst (beim HP-45 legten die Umrechnungstasten nur eine Konstante hin).", r: "4,5359237" },
    en: { n: "lbm→kg – pounds to kg", d: "Converts X from pounds to kg – the HP-55 does the calculation itself (the HP-45 keys only put down a constant).", r: "4.5359237" },
  },
  kg2lbm: {
    lab: {label: "kg2lbm", args: [10]},
    ex: "10 g kg→lbm",
    de: { n: "kg→lbm – kg in Pfund", d: "Rechnet X von kg in Pfund um – der HP-55 rechnet dabei selbst (beim HP-45 legten die Umrechnungstasten nur eine Konstante hin).", r: "22,04622622" },
    en: { n: "kg→lbm – kg to pounds", d: "Converts X from kg to pounds – the HP-55 does the calculation itself (the HP-45 keys only put down a constant).", r: "22.04622622" },
  },
  lbf2n: {
    lab: {label: "lbf2n", args: [10]},
    ex: "10 f lbf→N",
    de: { n: "lbf→N – Pfund-Kraft in Newton", d: "Rechnet X von Pfund-Kraft in Newton um – der HP-55 rechnet dabei selbst (beim HP-45 legten die Umrechnungstasten nur eine Konstante hin).", r: "44,48221615" },
    en: { n: "lbf→N – pounds-force to newtons", d: "Converts X from pounds-force to newtons – the HP-55 does the calculation itself (the HP-45 keys only put down a constant).", r: "44.48221615" },
  },
  n2lbf: {
    lab: {label: "n2lbf", args: [10]},
    ex: "10 g N→lbf",
    de: { n: "N→lbf – Newton in Pfund-Kraft", d: "Rechnet X von Newton in Pfund-Kraft um – der HP-55 rechnet dabei selbst (beim HP-45 legten die Umrechnungstasten nur eine Konstante hin).", r: "2,248089431" },
    en: { n: "N→lbf – newtons to pounds-force", d: "Converts X from newtons to pounds-force – the HP-55 does the calculation itself (the HP-45 keys only put down a constant).", r: "2.248089431" },
  },
  btu2j: {
    lab: {label: "btu2j", args: [1]},
    ex: "1 f Btu→J",
    de: { n: "Btu→J – Btu in Joule", d: "Rechnet X von Btu in Joule um – der HP-55 rechnet dabei selbst (beim HP-45 legten die Umrechnungstasten nur eine Konstante hin).", r: "1055,055853" },
    en: { n: "Btu→J – Btu to joules", d: "Converts X from Btu to joules – the HP-55 does the calculation itself (the HP-45 keys only put down a constant).", r: "1055.055853" },
  },
  j2btu: {
    lab: {label: "j2btu", args: [1000]},
    ex: "1000 g J→Btu",
    de: { n: "J→Btu – Joule in Btu", d: "Rechnet X von Joule in Btu um – der HP-55 rechnet dabei selbst (beim HP-45 legten die Umrechnungstasten nur eine Konstante hin).", r: "0,94781712" },
    en: { n: "J→Btu – joules to Btu", d: "Converts X from joules to Btu – the HP-55 does the calculation itself (the HP-45 keys only put down a constant).", r: "0.94781712" },
  },
  f2c: {
    lab: {label: "f2c", args: [212]},
    ex: "212 f °F→°C",
    de: { n: "°F→°C – °F in °C", d: "Rechnet X von °F in °C um – der HP-55 rechnet dabei selbst (beim HP-45 legten die Umrechnungstasten nur eine Konstante hin).", r: "100" },
    en: { n: "°F→°C – °F to °C", d: "Converts X from °F to °C – the HP-55 does the calculation itself (the HP-45 keys only put down a constant).", r: "100" },
  },
  c2f: {
    lab: {label: "c2f", args: [100]},
    ex: "100 g °C→°F",
    de: { n: "°C→°F – °C in °F", d: "Rechnet X von °C in °F um – der HP-55 rechnet dabei selbst (beim HP-45 legten die Umrechnungstasten nur eine Konstante hin).", r: "212" },
    en: { n: "°C→°F – °C to °F", d: "Converts X from °C to °F – the HP-55 does the calculation itself (the HP-45 keys only put down a constant).", r: "212" },
  },
  d2r: {
    lab: {label: "d2r", args: [180]},
    ex: "180 f →RAD",
    de: { n: "→RAD – Grad in Bogenmaß", d: "Rechnet X von Grad in Bogenmaß um – der HP-55 rechnet dabei selbst (beim HP-45 legten die Umrechnungstasten nur eine Konstante hin).", r: "3,141592654" },
    en: { n: "→RAD – degrees to radians", d: "Converts X from degrees to radians – the HP-55 does the calculation itself (the HP-45 keys only put down a constant).", r: "3.141592654" },
  },
  r2d: {
    lab: {label: "r2d", args: [1]},
    ex: "1 g →DEG",
    de: { n: "→DEG – Bogenmaß in Grad", d: "Rechnet X von Bogenmaß in Grad um – der HP-55 rechnet dabei selbst (beim HP-45 legten die Umrechnungstasten nur eine Konstante hin).", r: "57,29577951" },
    en: { n: "→DEG – radians to degrees", d: "Converts X from radians to degrees – the HP-55 does the calculation itself (the HP-45 keys only put down a constant).", r: "57.29577951" },
  },
};

/** which help entry belongs to a key id (digits share one entry) */
export function helpIdFor(id) {
  return /^d\d$/.test(id) ? 'digit' : id;
}

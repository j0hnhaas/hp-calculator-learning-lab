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
    ex: '10 cm/in ×',
    de: { n: 'cm/in – Zoll', d: 'Legt 2,54 auf den Stapel (cm pro Zoll). 10 Zoll in cm: 10 cm/in ×. Umgekehrt mit ÷.', r: '25,4' },
    en: { n: 'cm/in – inches', d: 'Puts 2.54 on the stack (cm per inch). 10 inches in cm: 10 cm/in ×. The other way with ÷.', r: '25.4' },
  },
  kglb: {
    ex: '10 kg/lb ×',
    de: { n: 'kg/lb – Pfund', d: 'Legt 0,4536 auf den Stapel (kg pro Pfund).', r: '4,536' },
    en: { n: 'kg/lb – pounds', d: 'Puts 0.4536 on the stack (kg per pound).', r: '4.536' },
  },
  ltrgal: {
    ex: '10 ltr/gal ×',
    de: { n: 'ltr/gal – Gallonen', d: 'Legt 3,785 auf den Stapel (Liter pro US-Gallone).', r: '37,85' },
    en: { n: 'ltr/gal – gallons', d: 'Puts 3.785 on the stack (litres per US gallon).', r: '37.85' },
  },
};

/** which help entry belongs to a key id (digits share one entry) */
export function helpIdFor(id) {
  return /^d\d$/.test(id) ? 'digit' : id;
}

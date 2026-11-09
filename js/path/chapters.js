// The learning path: ten chapters from the slide rule to the chips.
//
// Every chapter: goal, 3–6 cards, a hands-on task ("try"), a key takeaway and a quiz.
//   cards: [title, body, level?]  – level 'detail' (Fortgeschritten+) or 'pro' (Profi only)
//   try:   { kind: 'calc', check(calc, keyId), hint: {35, 45, 55} }  – solved on the calculator
//          { kind: 'lab', ex }    – example ex of the lab's ladder
//          { kind: 'rpn' }        – the three RPN exercises
//          { kind: 'model', model } – switch to another model
//   quiz:  { ok, de: [question, a, b, c, why], en: [...] } – ok = index of the right answer
// Texts may link glossary terms with [[id|label]].

const near = (a, b, tol) => Math.abs(a - b) <= tol;
const done = (c) => !c.entry && !c.error;

export const CHAPTERS = [
  // ------------------------------------------------------------------ 1
  {
    id: 'history',
    icon: '📜',
    try: { kind: 'calc', check: (c) => done(c) && near(c.x, 0.30103, 5e-6), hint: { 35: '2 log', 45: '2 ■ log', 55: '2 f log' } },
    de: {
      title: '1972: Rechnen ohne Taschenrechner',
      goal: 'Du weißt, wie man vor 1972 schwierige Rechnungen löste – und warum der HP-35 eine Sensation war.',
      cards: [
        ['Rechnen mit Tafeln', 'Bis in die 1970er-Jahre rechneten Ingenieurinnen, Schüler und Astronomen schwierige Aufgaben mit dicken Büchern voller Zahlen: Logarithmentafeln. John Napier veröffentlichte die [[log|Logarithmen]] 1614, Henry Briggs kurz darauf Tafeln zur Basis 10. Der Trick: Statt zwei Zahlen zu multiplizieren, schlägt man ihre Logarithmen nach und addiert sie.'],
        ['Der Rechenschieber', 'Um 1622 baute William Oughtred daraus ein Werkzeug: zwei Skalen mit logarithmischer Einteilung, die man gegeneinander verschiebt. Längen addieren heißt Zahlen multiplizieren. Ein Rechenschieber liefert etwa 3 Stellen, und wo das Komma hingehört, muss man selbst im Kopf behalten. Generationen von Ingenieuren rechneten so – auch bei den Mondflügen.'],
        ['Große und kleine Rechner', 'Elektronische Rechner gab es schon, aber die wissenschaftlichen standen auf dem Tisch – etwa HPs Tischrechner 9100A von 1968. Die ersten Taschenrechner um 1971 konnten meist nur + − × ÷.'],
        ['Die Sensation', 'Im Januar 1972 brachte HP den HP-35 heraus: den ersten wissenschaftlichen Taschenrechner, mit sin, cos, tan, log, ln, eˣ und √x auf 10 Stellen genau. Er kostete 395 Dollar. Firmengründer Bill Hewlett soll verlangt haben, dass er in seine Hemdtasche passt. Der Name kommt von den 35 Tasten.'],
        ['Das Ende des Rechenschiebers', 'Taschenrechner wurden schnell billiger und besser. Am 11. Juli 1976 stellte Keuffel & Esser, der größte Rechenschieber-Hersteller der USA, seinen letzten Rechenschieber her und schenkte ihn dem Smithsonian-Museum.', 'detail'],
      ],
      try: 'Berechne log 2 – früher hättest du den Wert 0,30103 in der Logarithmentafel nachgeschlagen. Beim HP-45 steht log in Gold über ln (■ = goldene Taste), beim HP-55 über R↓ (mit f).',
      merke: 'Logarithmen machten aus Multiplizieren Addieren – erst auf Papier, dann im Rechenschieber. Der HP-35 brachte 1972 alles in die Hemdtasche, auf 10 Stellen genau.',
    },
    en: {
      title: '1972: calculating without a calculator',
      goal: 'You know how people solved hard calculations before 1972 – and why the HP-35 was a sensation.',
      cards: [
        ['Calculating with tables', 'Until the 1970s engineers, students and astronomers solved hard problems with thick books full of numbers: tables of logarithms. John Napier published [[log|logarithms]] in 1614, and Henry Briggs soon followed with tables to base 10. The trick: instead of multiplying two numbers, you look up their logarithms and add them.'],
        ['The slide rule', 'Around 1622 William Oughtred turned this into a tool: two logarithmic scales that slide against each other. Adding lengths means multiplying numbers. A slide rule gives about 3 digits, and you have to keep track of the decimal point in your head. Generations of engineers worked like this – even for the Moon flights.'],
        ['Big and small calculators', 'Electronic calculators already existed, but the scientific ones sat on a desk – such as HP’s 9100A desktop calculator from 1968. The first pocket calculators around 1971 could mostly do only + − × ÷.'],
        ['The sensation', 'In January 1972 HP launched the HP-35: the first scientific pocket calculator, with sin, cos, tan, log, ln, eˣ and √x to 10 digits. It cost 395 dollars. Co-founder Bill Hewlett is said to have demanded that it fit into his shirt pocket. The name comes from its 35 keys.'],
        ['The end of the slide rule', 'Calculators quickly became cheaper and better. On 11 July 1976 Keuffel & Esser, the largest slide-rule maker in the USA, made its last slide rule and donated it to the Smithsonian museum.', 'detail'],
      ],
      try: 'Compute log 2 – in the old days you would have looked up 0.30103 in a table of logarithms. On the HP-45, log is printed in gold above ln (■ = gold key); on the HP-55 above R↓ (with f).',
      merke: 'Logarithms turned multiplying into adding – first on paper, then in the slide rule. In 1972 the HP-35 put it all into a shirt pocket, to 10 digits.',
    },
    quiz: [
      { ok: 0, de: ['Was machen Logarithmen beim Rechnen mit Tafeln möglich?', 'Multiplizieren wird zu Addieren', 'Wurzeln werden ganzzahlig', 'Brüche verschwinden', 'Es gilt log(a·b) = log a + log b: Man addiert die nachgeschlagenen Logarithmen statt zu multiplizieren.'], en: ['What do logarithms make possible when calculating with tables?', 'Multiplying turns into adding', 'Roots become whole numbers', 'Fractions disappear', 'log(a·b) = log a + log b: you add the looked-up logarithms instead of multiplying.'] },
      { ok: 1, de: ['Wie viele Stellen liefert ein Rechenschieber ungefähr?', '1', '3', '10', 'Etwa 3 Stellen – für die meisten Messwerte reichte das. Das Komma musste man selbst setzen.'], en: ['About how many digits does a slide rule give?', '1', '3', '10', 'About 3 digits – enough for most measurements. You had to place the decimal point yourself.'] },
      { ok: 2, de: ['Woher hat der HP-35 seinen Namen?', 'vom Jahr 1935', 'von 35 Funktionen', 'von seinen 35 Tasten', 'Der Name zählt einfach die Tasten.'], en: ['Where does the HP-35 get its name from?', 'from the year 1935', 'from 35 functions', 'from its 35 keys', 'The name simply counts the keys.'] },
      { ok: 0, de: ['Was kostete der HP-35 im Jahr 1972?', '395 Dollar', '35 Dollar', '3950 Dollar', '395 Dollar – damals sehr viel Geld für einen Taschenrechner.'], en: ['What did the HP-35 cost in 1972?', '395 dollars', '35 dollars', '3950 dollars', '395 dollars – a lot of money for a pocket calculator at the time.'] },
      { ok: 1, de: ['Was war am HP-35 neu?', 'der erste elektronische Rechner überhaupt', 'wissenschaftliche Funktionen in Taschengröße', 'der erste Rechner mit Bildschirm', 'Wissenschaftliche Tischrechner gab es schon. Neu war, dass sin, ln & Co. in die Tasche passten.'], en: ['What was new about the HP-35?', 'the first electronic calculator ever', 'scientific functions in pocket size', 'the first calculator with a screen', 'Scientific desktop calculators already existed. What was new was that sin, ln and friends fit into a pocket.'] },
    ],
  },
  // ------------------------------------------------------------------ 2
  {
    id: 'rpn',
    icon: '⌨️',
    try: { kind: 'rpn' },
    de: {
      title: 'Bedienen mit RPN',
      goal: 'Du kannst mit RPN rechnen und weißt, wozu der Stapel da ist.',
      cards: [
        ['Keine =-Taste', 'HP-Rechner haben keine =-Taste. Du gibst zuerst die Zahlen ein, dann die Rechenart: 3 ENTER 4 + ergibt 7. Diese Eingabeart heißt [[rpn|RPN]].'],
        ['Der Stapel', 'Die Zahlen liegen auf einem [[stack|Stapel]] aus vier Plätzen: X, Y, Z und T. [[enter|ENTER]] legt eine Kopie der Zahl nach oben. + nimmt X und Y, rechnet und legt das Ergebnis nach X. Unter dem Rechner siehst du den Stapel live.'],
        ['Ohne Klammern', '(3 + 4) × 5 tippst du als 3 ENTER 4 + 5 ×. Das Zwischenergebnis 7 bleibt einfach auf dem Stapel liegen, bis du es brauchst. Klammern sind nie nötig.'],
        ['Warum HP das wollte', 'Die Schreibweise geht auf den polnischen Logiker Jan Łukasiewicz zurück (1920er-Jahre) – daher „polnisch“. Für den Rechner ist sie ideal: Er kann jede Rechenart sofort ausführen und muss sich keine offenen Klammern merken. Das spart Speicher, und 1972 war jedes Bit teuer.', 'detail'],
      ],
      try: 'Löse die drei kurzen RPN-Übungen direkt am Rechner. Er erkennt, wenn du richtig liegst.',
      merke: 'Erst die Zahlen, dann die Rechenart. ENTER trennt zwei Zahlen, die direkt hintereinander kommen.',
    },
    en: {
      title: 'Operating with RPN',
      goal: 'You can calculate with RPN and know what the stack is for.',
      cards: [
        ['No = key', 'HP calculators have no = key. You first enter the numbers, then the operation: 3 ENTER 4 + gives 7. This way of entering is called [[rpn|RPN]].'],
        ['The stack', 'The numbers sit on a [[stack|stack]] of four places: X, Y, Z and T. [[enter|ENTER]] puts a copy of the number on top. + takes X and Y, calculates and puts the result into X. Below the calculator you can watch the stack live.'],
        ['No parentheses', 'You type (3 + 4) × 5 as 3 ENTER 4 + 5 ×. The intermediate result 7 simply stays on the stack until you need it. Parentheses are never needed.'],
        ['Why HP wanted it', 'The notation goes back to the Polish logician Jan Łukasiewicz (1920s) – hence “Polish”. It is ideal for the calculator: it can carry out every operation at once and never has to remember open parentheses. That saves memory, and in 1972 every bit was expensive.', 'detail'],
      ],
      try: 'Solve the three short RPN exercises right on the calculator. It notices when you get it right.',
      merke: 'Numbers first, then the operation. ENTER separates two numbers typed right after each other.',
    },
    quiz: [
      { ok: 1, de: ['Was ergibt 3 ENTER 4 ×?', '7', '12', '34', 'ENTER trennt 3 und 4, × multipliziert die beiden: 12.'], en: ['What does 3 ENTER 4 × give?', '7', '12', '34', 'ENTER separates 3 and 4, × multiplies them: 12.'] },
      { ok: 0, de: ['Wie tippst du (2 + 3) × 4?', '2 ENTER 3 + 4 ×', '2 + 3 × 4 =', '2 ENTER 3 ENTER 4 + ×', 'Erst 2 + 3 rechnen, das Ergebnis bleibt liegen, dann 4 ×. Die dritte Folge rechnet 2 × (3 + 4).'], en: ['How do you type (2 + 3) × 4?', '2 ENTER 3 + 4 ×', '2 + 3 × 4 =', '2 ENTER 3 ENTER 4 + ×', 'First 2 + 3, the result stays on the stack, then 4 ×. The third sequence computes 2 × (3 + 4).'] },
      { ok: 2, de: ['In welchem Platz des Stapels steht die Zahl der Anzeige?', 'T', 'Y', 'X', 'Die Anzeige zeigt immer X.'], en: ['Which place of the stack holds the number on the display?', 'T', 'Y', 'X', 'The display always shows X.'] },
      { ok: 0, de: ['Wann brauchst du ENTER?', 'zwischen zwei Zahlen, die direkt nacheinander kommen', 'nach jeder Rechenart', 'am Ende jeder Rechnung', 'Eine Rechenart schließt die Zahl selbst ab – ENTER braucht es nur zwischen zwei Zahlen.'], en: ['When do you need ENTER?', 'between two numbers typed right after each other', 'after every operation', 'at the end of every calculation', 'An operation finishes the number by itself – ENTER is only needed between two numbers.'] },
      { ok: 2, de: ['Was ergibt 8 ENTER ×?', '8', '16', '64', 'ENTER kopiert die 8 nach Y, × rechnet 8 · 8 = 64.'], en: ['What does 8 ENTER × give?', '8', '16', '64', 'ENTER copies 8 into Y, × computes 8 · 8 = 64.'] },
    ],
  },
  // ------------------------------------------------------------------ 3
  {
    id: 'numbers',
    icon: '🔢',
    try: { kind: 'calc', check: (c) => done(c) && near(c.x, 6.02e23, 1e14), hint: { 35: '6.02 EEX 23 ENTER↑', 45: '6.02 EEX 23 ENTER↑', 55: '6.02 EEX 23 ENTER↑' } },
    de: {
      title: 'Wie Zahlen im Chip wohnen',
      goal: 'Du weißt, wie der Rechner Zahlen speichert: als Dezimalziffern in Registern.',
      cards: [
        ['Stellenwert', 'In 352 ist jede Stelle zehnmal so viel wert wie die rechts daneben ([[placevalue|Stellenwert]]). Darum ist ×10 so einfach: Alle Ziffern rücken eine Stelle weiter. Diesen Trick nutzt der Rechner ständig – er heißt [[shift|Verschieben]].'],
        ['Bits und BCD', 'Elektronik kennt nur an und aus, also 0 und 1 ([[binary|Binärsystem]]). Der HP speichert jede Dezimalziffer in 4 Bit, zum Beispiel 7 = 0111. Das heißt [[bcd|BCD]]. So rechnet er wie wir im Zehnersystem – deshalb ergibt 0,1 + 0,2 bei ihm genau 0,3.'],
        ['Register', 'Eine Zahl liegt in einem [[register|Register]] aus 14 Ziffern: 10 Ziffern [[mantissa|Mantisse]], 2 Ziffern Exponent und je ein Vorzeichen. Das sind 14 × 4 = 56 Bit.'],
        ['Sehr große und kleine Zahlen', '6,02 × 10²³ tippst du als 6.02 EEX 23. Die Mantisse hält die Ziffern, der Exponent die Größenordnung ([[power|Zehnerpotenz]]). So kann der Rechner Zahlen bis knapp 10¹⁰⁰ darstellen.'],
        ['Bit für Bit', 'Der HP-35 ist bit-seriell: Die 56 Bit eines Registers wandern nacheinander durch eine einzige Leitung, 200 000-mal pro Sekunde ein Bit. Das ist langsam, spart aber Leitungen, Chipfläche und Strom.', 'pro'],
      ],
      try: 'Tippe die Avogadro-Zahl 6,02 × 10²³ ein und schließe sie mit ENTER ab.',
      merke: 'Jede Dezimalziffer sind 4 Bit. Eine Zahl sind 10 Ziffern Mantisse plus Exponent. ×10 ist nur Verschieben.',
    },
    en: {
      title: 'How numbers live in the chip',
      goal: 'You know how the calculator stores numbers: as decimal digits in registers.',
      cards: [
        ['Place value', 'In 352 every digit is worth ten times the one to its right ([[placevalue|place value]]). That is why ×10 is so easy: all digits move on by one place. The calculator uses this trick all the time – it is called [[shift|shifting]].'],
        ['Bits and BCD', 'Electronics only knows on and off, that is 0 and 1 ([[binary|binary system]]). The HP stores each decimal digit in 4 bits, for example 7 = 0111. This is called [[bcd|BCD]]. So it calculates in base ten like we do – which is why 0.1 + 0.2 gives exactly 0.3 on it.'],
        ['Registers', 'A number lives in a [[register|register]] of 14 digits: 10 [[mantissa|mantissa]] digits, 2 exponent digits and one sign each. That is 14 × 4 = 56 bits.'],
        ['Very large and small numbers', 'You type 6.02 × 10²³ as 6.02 EEX 23. The mantissa holds the digits, the exponent the order of magnitude ([[power|power of ten]]). This way the calculator can show numbers up to just under 10¹⁰⁰.'],
        ['Bit by bit', 'The HP-35 is bit-serial: the 56 bits of a register travel one after another through a single wire, one bit 200,000 times per second. That is slow, but it saves wires, chip area and power.', 'pro'],
      ],
      try: 'Type in Avogadro’s number 6.02 × 10²³ and finish it with ENTER.',
      merke: 'Each decimal digit is 4 bits. A number is 10 mantissa digits plus an exponent. ×10 is just shifting.',
    },
    quiz: [
      { ok: 1, de: ['Wie viele Bit braucht eine Dezimalziffer in BCD?', '2', '4', '10', 'Mit 4 Bit lassen sich 16 Muster bilden – genug für die Ziffern 0 bis 9.'], en: ['How many bits does a decimal digit take in BCD?', '2', '4', '10', '4 bits give 16 patterns – enough for the digits 0 to 9.'] },
      { ok: 0, de: ['Was passiert bei ×10 im Rechner?', 'Alle Ziffern rücken eine Stelle weiter', 'Er addiert die Zahl zehnmal', 'Er schlägt in einer Tabelle nach', 'Im Zehnersystem ist ×10 nur ein Verschieben – das kostet fast nichts.'], en: ['What happens inside the calculator for ×10?', 'All digits move on by one place', 'It adds the number ten times', 'It looks it up in a table', 'In base ten, ×10 is just a shift – it costs almost nothing.'] },
      { ok: 2, de: ['Wie tippst du 3 × 10⁸?', '3 × 10 yˣ 8', '38 EEX', '3 EEX 8', 'EEX leitet den Exponenten ein.'], en: ['How do you type 3 × 10⁸?', '3 × 10 yˣ 8', '38 EEX', '3 EEX 8', 'EEX starts the exponent.'] },
      { ok: 0, de: ['Warum ergibt 0,1 + 0,2 beim HP genau 0,3?', 'Er rechnet dezimal (BCD)', 'Er rundet auf eine Stelle', 'Zufall', 'Im Zehnersystem ist 0,1 exakt darstellbar. Binäre Computer müssen 0,1 annähern.'], en: ['Why does 0.1 + 0.2 give exactly 0.3 on the HP?', 'It computes in decimal (BCD)', 'It rounds to one digit', 'Luck', 'In base ten 0.1 is exact. Binary computers have to approximate 0.1.'] },
      { ok: 1, de: ['Wie viele Ziffern hat die Mantisse?', '8', '10', '14', '10 Ziffern Mantisse – das Register hat 14 Ziffern, die übrigen sind Exponent und Vorzeichen.'], en: ['How many digits does the mantissa have?', '8', '10', '14', '10 mantissa digits – the register has 14 digits, the rest are exponent and signs.'] },
    ],
  },
  // ------------------------------------------------------------------ 4
  {
    id: 'arith',
    icon: '➕',
    try: { kind: 'lab', ex: 1 },
    de: {
      title: 'Plus, Mal, Geteilt – nur mit Addieren',
      goal: 'Du siehst, wie der Rechner alle Grundrechenarten aus Addieren und Verschieben baut.',
      cards: [
        ['Addieren wie schriftlich', 'Für 1,5 + 0,25 richtet der Rechner zuerst das Komma aus. Dann addiert er Ziffer für Ziffer von rechts, mit Übertrag – genau wie du schriftlich. Kosten: 1 Addition.'],
        ['Malnehmen = oft addieren', 'Für 12 × 34 addiert der Rechner 12 viermal (für die 4), [[shift|verschiebt]] um eine Stelle und addiert 12 dreimal (für die 3). Zusammen 7 Additionen statt 34.'],
        ['Teilen = abziehen und zählen', 'Für 22 ÷ 7 fragt er: Wie oft passt 7 in 22? Er zieht ab, bis es nicht mehr geht, und zählt mit: 3-mal, Rest 1. Dann verschiebt er den Rest und macht mit der nächsten Stelle weiter. Für 10 Stellen braucht er rund 56 Subtraktionen.'],
        ['Vier Bausteine', 'Mehr kann das Rechenwerk nicht: addieren (oder abziehen), verschieben, zählen und vergleichen. Alles Weitere – auch sin und ln – sind Rezepte aus diesen vier. Der Baukasten 🧱 im Labor zeigt, was jede Rechnung kostet.'],
      ],
      try: 'Sieh dir im Labor an, wie aus 12 × 34 sieben Additionen werden.',
      merke: '× ist Addieren und Verschieben, ÷ ist Abziehen und Zählen.',
    },
    en: {
      title: 'Plus, times, divide – just by adding',
      goal: 'You see how the calculator builds every basic operation from adding and shifting.',
      cards: [
        ['Adding like on paper', 'For 1.5 + 0.25 the calculator first lines up the decimal points. Then it adds digit by digit from the right, with carries – exactly like you do on paper. Cost: 1 addition.'],
        ['Multiplying = adding often', 'For 12 × 34 the calculator adds 12 four times (for the 4), [[shift|shifts]] by one place and adds 12 three times (for the 3). 7 additions in total instead of 34.'],
        ['Dividing = subtracting and counting', 'For 22 ÷ 7 it asks: how often does 7 fit into 22? It subtracts until it can’t any more and counts: 3 times, remainder 1. Then it shifts the remainder and goes on with the next digit. For 10 digits it needs about 56 subtractions.'],
        ['Four building blocks', 'That is all the arithmetic unit can do: add (or subtract), shift, count and compare. Everything else – even sin and ln – are recipes made of these four. The building blocks 🧱 in the lab show what each calculation costs.'],
      ],
      try: 'Watch in the lab how 12 × 34 turns into seven additions.',
      merke: '× is adding and shifting, ÷ is subtracting and counting.',
    },
    quiz: [
      { ok: 2, de: ['Wie viele Additionen braucht 12 × 34 auf diese Art?', '34', '12', '7', '4-mal für die 4, verschieben, 3-mal für die 3.'], en: ['How many additions does 12 × 34 take this way?', '34', '12', '7', '4 times for the 4, shift, 3 times for the 3.'] },
      { ok: 0, de: ['Was macht der Rechner beim Teilen?', 'abziehen und zählen', 'mit dem Kehrwert aus einer Tabelle multiplizieren', 'raten und prüfen', 'Wie beim schriftlichen Dividieren: so oft abziehen wie möglich und mitzählen.'], en: ['What does the calculator do when dividing?', 'subtract and count', 'multiply by the reciprocal from a table', 'guess and check', 'Like long division: subtract as often as possible and count.'] },
      { ok: 1, de: ['Was muss vor dem Addieren von 1,5 und 0,25 passieren?', 'beide runden', 'das Komma ausrichten', 'die Exponenten multiplizieren', 'Nur Stellen mit gleichem Wert dürfen addiert werden.'], en: ['What has to happen before adding 1.5 and 0.25?', 'round both', 'line up the decimal points', 'multiply the exponents', 'Only digits of the same value may be added.'] },
      { ok: 0, de: ['Welche Rechnung ist für den Rechner am teuersten?', '22 ÷ 7', '12 × 34', '1,5 + 0,25', 'Rund 56 Subtraktionen gegen 7 Additionen und 1 Addition.'], en: ['Which calculation is the most expensive for the calculator?', '22 ÷ 7', '12 × 34', '1.5 + 0.25', 'About 56 subtractions versus 7 additions and 1 addition.'] },
      { ok: 1, de: ['Welche Bausteine hat das Rechenwerk?', 'Multiplizieren und Dividieren', 'Addieren, Verschieben, Zählen, Vergleichen', 'nur eine Wertetabelle', 'Aus diesen vier Bausteinen entsteht alles andere.'], en: ['Which building blocks does the arithmetic unit have?', 'multiplying and dividing', 'adding, shifting, counting, comparing', 'just a table of values', 'Everything else is built from these four.'] },
    ],
  },
  // ------------------------------------------------------------------ 5
  {
    id: 'sqrt',
    icon: '√',
    try: { kind: 'lab', ex: 3 },
    de: {
      title: 'Wurzel Ziffer für Ziffer',
      goal: 'Du verstehst, wie der Rechner √2 findet, ohne ein einziges Mal zu multiplizieren.',
      cards: [
        ['Was ist eine Wurzel?', '√16 = 4, weil 4 · 4 = 16 ([[root|Quadratwurzel]]). √2 geht nie auf: 1,414213562 … Der Rechner muss die Ziffern also eine nach der anderen finden.'],
        ['Der Trick mit den ungeraden Zahlen', '1 + 3 + 5 + 7 = 16 = 4². Jede Quadratzahl ist eine Summe ungerader Zahlen. Wie oft man ungerade Zahlen von 16 abziehen kann, so groß ist die Wurzel: 4-mal.'],
        ['Ziffer für Ziffer', 'Für √2: Von 2 lässt sich nur die 1 abziehen – erste Ziffer 1, Rest 1. Der Rest wird um zwei Stellen [[shift|verschoben]] (100), und es geht mit den ungeraden Zahlen 21, 23, 25, 27 … weiter. Sie passen 4-mal – zweite Ziffer 4. So entsteht 1,4 …'],
        ['Warum 20r + 1?', 'Ist r die bisher gefundene Wurzel, dann ist (10r + 1)² − (10r)² = 20r + 1, und jeder weitere Abstand ist um 2 größer. Darum reichen Abziehen und Zählen. Verschoben wird um zwei Stellen, weil eine Stelle der Wurzel zwei Stellen im Quadrat entspricht.', 'detail'],
      ],
      try: 'Sieh dir im Labor an, wie √2 Ziffer für Ziffer entsteht.',
      merke: 'Quadratzahlen sind Summen ungerader Zahlen. Abziehen und Zählen liefert die Wurzel Ziffer für Ziffer.',
    },
    en: {
      title: 'Square roots digit by digit',
      goal: 'You understand how the calculator finds √2 without a single multiplication.',
      cards: [
        ['What is a root?', '√16 = 4 because 4 · 4 = 16 ([[root|square root]]). √2 never ends: 1.414213562 … So the calculator has to find the digits one after the other.'],
        ['The odd-number trick', '1 + 3 + 5 + 7 = 16 = 4². Every square number is a sum of odd numbers. However often you can subtract odd numbers from 16, that is the root: 4 times.'],
        ['Digit by digit', 'For √2: only 1 can be subtracted from 2 – first digit 1, remainder 1. The remainder is [[shift|shifted]] by two places (100), and it goes on with the odd numbers 21, 23, 25, 27 … They fit 4 times – second digit 4. That gives 1.4 …'],
        ['Why 20r + 1?', 'If r is the root found so far, then (10r + 1)² − (10r)² = 20r + 1, and each further gap is 2 larger. That is why subtracting and counting is enough. The shift is by two places because one digit of the root corresponds to two digits of the square.', 'detail'],
      ],
      try: 'Watch in the lab how √2 appears digit by digit.',
      merke: 'Square numbers are sums of odd numbers. Subtracting and counting gives the root digit by digit.',
    },
    quiz: [
      { ok: 0, de: ['1 + 3 + 5 = ?', '9', '8', '15', '9 = 3² – die Summe der ersten drei ungeraden Zahlen.'], en: ['1 + 3 + 5 = ?', '9', '8', '15', '9 = 3² – the sum of the first three odd numbers.'] },
      { ok: 1, de: ['Wie oft kann man 1, 3, 5, 7 … von 25 abziehen, bis 0 übrig ist?', '25-mal', '5-mal', '12-mal', '1 + 3 + 5 + 7 + 9 = 25, also 5-mal – und √25 = 5.'], en: ['How often can you subtract 1, 3, 5, 7 … from 25 until 0 is left?', '25 times', '5 times', '12 times', '1 + 3 + 5 + 7 + 9 = 25, so 5 times – and √25 = 5.'] },
      { ok: 2, de: ['Warum wird der Rest um zwei Stellen verschoben?', 'weil BCD zwei Bit hat', 'aus Gewohnheit', 'weil eine Stelle der Wurzel zwei Stellen im Quadrat entspricht', '(10·x)² = 100·x²: eine Stelle mehr in der Wurzel sind zwei Stellen mehr im Quadrat.'], en: ['Why is the remainder shifted by two places?', 'because BCD has two bits', 'out of habit', 'because one digit of the root corresponds to two digits of the square', '(10·x)² = 100·x²: one more digit in the root means two more in the square.'] },
      { ok: 0, de: ['Was stimmt für √2?', 'Die Ziffern hören nie auf; der Rechner zeigt 10 davon', 'genau 1,4', 'genau 1,41', '√2 ist irrational – keine Zahl mit endlich vielen Stellen trifft sie genau.'], en: ['What is true for √2?', 'The digits never end; the calculator shows 10 of them', 'exactly 1.4', 'exactly 1.41', '√2 is irrational – no number with finitely many digits hits it exactly.'] },
      { ok: 1, de: ['Was braucht dieses Verfahren nicht?', 'Subtraktionen', 'Multiplikationen', 'Vergleiche', 'Nur Abziehen, Vergleichen, Zählen und Verschieben.'], en: ['What does this method not need?', 'subtractions', 'multiplications', 'comparisons', 'Only subtracting, comparing, counting and shifting.'] },
    ],
  },
  // ------------------------------------------------------------------ 6
  {
    id: 'trig',
    icon: '📐',
    try: { kind: 'calc', check: (c) => done(c) && near(c.x, 0.5, 1e-9) && c.angle === 'DEG', hint: { 35: '30 sin', 45: '30 SIN', 55: '30 f SIN' } },
    de: {
      title: 'Was sind sin, cos, tan und atan?',
      goal: 'Du liest sin, cos und tan am Einheitskreis ab und weißt, was atan rückwärts tut.',
      cards: [
        ['Die Leiter an der Wand', 'Eine Leiter lehnt im Winkel θ an der Wand. sin θ = Höhe ÷ Leiterlänge, cos θ = Abstand ÷ Leiterlänge, tan θ = Höhe ÷ Abstand. Bei 30° reicht sie halb so hoch, wie sie lang ist: sin 30° = 0,5 ([[trig|Winkelfunktionen]]).'],
        ['Der Einheitskreis', 'Ist die Leiter genau 1 lang, wird es noch einfacher: Ein Zeiger der Länge 1 zeigt im Winkel θ, und seine Spitze liegt bei (cos θ, sin θ). Probier es aus: [[unitcircle|Einheitskreis zum Anfassen]].'],
        ['tan ist die Steigung', 'tan θ = sin θ ÷ cos θ ist die Steigung des Zeigers. tan 45° = 1: eine Rampe, die genauso hoch wie lang ist. Bei 90° gibt es keinen tan – man müsste durch 0 teilen.'],
        ['atan: rückwärts', '[[atan|atan]] geht den umgekehrten Weg: Aus der Steigung wird der Winkel. atan 1 = 45°, atan 0,1 ≈ 5,71°. Solche Rückwege heißen [[inverse|Umkehrfunktionen]]; auf dem Rechner steht TAN⁻¹.'],
        ['Grad und Bogenmaß', 'Ein Kreis hat 360° oder im [[radian|Bogenmaß]] 2π ≈ 6,283. Intern rechnet der Rechner im Bogenmaß. DEG, RAD und GRD sagen ihm nur, wie du den Winkel eintippst.', 'detail'],
      ],
      try: 'Berechne sin 30° am Rechner (im Winkelmodus DEG). Erwartet: 0,5.',
      merke: 'Auf dem Einheitskreis ist cos die Breite, sin die Höhe und tan die Steigung. atan rechnet von der Steigung zurück zum Winkel.',
    },
    en: {
      title: 'What are sin, cos, tan and atan?',
      goal: 'You can read sin, cos and tan off the unit circle and know what atan does backwards.',
      cards: [
        ['The ladder against the wall', 'A ladder leans against a wall at angle θ. sin θ = height ÷ ladder length, cos θ = distance ÷ ladder length, tan θ = height ÷ distance. At 30° it reaches half as high as it is long: sin 30° = 0.5 ([[trig|trig functions]]).'],
        ['The unit circle', 'If the ladder is exactly 1 long, it gets even simpler: a pointer of length 1 points at angle θ, and its tip sits at (cos θ, sin θ). Try it: [[unitcircle|hands-on unit circle]].'],
        ['tan is the slope', 'tan θ = sin θ ÷ cos θ is the slope of the pointer. tan 45° = 1: a ramp as high as it is long. At 90° there is no tan – you would have to divide by 0.'],
        ['atan: backwards', '[[atan|atan]] goes the other way: from the slope back to the angle. atan 1 = 45°, atan 0.1 ≈ 5.71°. Such ways back are called [[inverse|inverse functions]]; on the calculator it says TAN⁻¹.'],
        ['Degrees and radians', 'A circle has 360°, or 2π ≈ 6.283 in [[radian|radians]]. Internally the calculator works in radians. DEG, RAD and GRD only tell it how you type in the angle.', 'detail'],
      ],
      try: 'Compute sin 30° on the calculator (in DEG mode). Expected: 0.5.',
      merke: 'On the unit circle cos is the width, sin the height and tan the slope. atan goes from the slope back to the angle.',
    },
    quiz: [
      { ok: 1, de: ['sin 30° = ?', '30', '0,5', '0,3', 'Bei 30° reicht die Leiter halb so hoch, wie sie lang ist.'], en: ['sin 30° = ?', '30', '0.5', '0.3', 'At 30° the ladder reaches half as high as it is long.'] },
      { ok: 0, de: ['Wo liegt der Punkt im Winkel θ auf dem Einheitskreis?', '(cos θ, sin θ)', '(sin θ, cos θ)', '(tan θ, 1)', 'Breite ist cos, Höhe ist sin.'], en: ['Where is the point at angle θ on the unit circle?', '(cos θ, sin θ)', '(sin θ, cos θ)', '(tan θ, 1)', 'The width is cos, the height is sin.'] },
      { ok: 2, de: ['tan 45° = ?', '0,45', '0,5', '1', 'Bei 45° sind Höhe und Breite gleich, die Steigung ist 1.'], en: ['tan 45° = ?', '0.45', '0.5', '1', 'At 45° height and width are equal, the slope is 1.'] },
      { ok: 0, de: ['Was liefert atan 1 (in Grad)?', '45°', '1°', '57,3°', 'atan ist die Umkehrung von tan, und tan 45° = 1.'], en: ['What does atan 1 give (in degrees)?', '45°', '1°', '57.3°', 'atan is the inverse of tan, and tan 45° = 1.'] },
      { ok: 1, de: ['Warum gibt es tan 90° nicht?', 'weil 90° zu groß ist', 'man müsste durch cos 90° = 0 teilen', 'weil der Rechner nur bis 45° rechnet', 'tan = sin ÷ cos, und bei 90° ist cos = 0.'], en: ['Why is there no tan 90°?', 'because 90° is too large', 'you would have to divide by cos 90° = 0', 'because the calculator only works up to 45°', 'tan = sin ÷ cos, and at 90° cos = 0.'] },
    ],
  },
  // ------------------------------------------------------------------ 7
  {
    id: 'cordic',
    icon: '🪙',
    try: { kind: 'lab', ex: 4 },
    de: {
      title: 'Winkel mit Münzen bezahlen: CORDIC',
      goal: 'Du verstehst die Idee von CORDIC: einen Winkel in einfache Teilwinkel zerlegen und einen Zeiger drehen.',
      cards: [
        ['Der Münz-Trick', 'Stell dir vor, du musst 30° mit Münzen bezahlen – aber es gibt nur Münzen zu 45°, 5,71°, 0,573°, 0,0573° … Du nimmst von jeder Sorte so viele wie möglich, von groß nach klein. Für 30°: keine 45°-Münze, fünfmal 5,71°, zweimal 0,573° und so weiter.'],
        ['Warum diese Münzen?', 'Die Münzen sind die Winkel [[atan|atan]](1), atan(0,1), atan(0,01) … Ihre Steigung ist 1, 0,1, 0,01 – eine 1 mit Nullen. Einen Zeiger um so einen Winkel zu drehen, kostet nur [[shift|Verschieben]] und Addieren: X′ = X − Y · 0,1 und Y′ = Y + X · 0,1.'],
        ['Erst zählen, dann drehen', 'Phase 1 ([[pseudodiv|Pseudo-Division]]): Der Rechner zählt, wie oft jede Münze in den Winkel passt. Phase 2 ([[pseudomul|Pseudo-Multiplikation]]): Er dreht einen Zeiger genau so oft. Am Ende steht die Spitze bei (X, Y), und tan θ = Y ÷ X. Daraus folgen sin und cos.'],
        ['Rückwärts für atan', 'Für atan dreht der Rechner einen Zeiger zurück auf die waagrechte Achse ([[vectoring|Vektorisierung]]) und zählt dabei die Münzen. Ihre Summe ist der gesuchte Winkel.'],
        ['Der kleine Rest', 'Nach sieben Münzsorten bleibt ein Rest, kleiner als ein Millionstel. Für so kleine Winkel gilt tan r ≈ r – der Rechner nimmt ihn einfach direkt ([[residual|Rest]]).', 'detail'],
        ['Woher der Name kommt', 'CORDIC steht für COordinate Rotation DIgital Computer. Jack Volder entwickelte das Verfahren in den 1950er-Jahren für einen Navigationsrechner; HP nutzte die dezimale Variante, die John Meggitt 1962 beschrieb.', 'pro'],
      ],
      try: 'Sieh dir im Labor an, wie der Rechner sin 30° mit Münzen bezahlt.',
      merke: 'CORDIC zerlegt den Winkel in Münzen atan(10⁻ʲ) und dreht einen Zeiger – nur mit Verschieben und Addieren.',
    },
    en: {
      title: 'Paying for angles with coins: CORDIC',
      goal: 'You understand the idea of CORDIC: split an angle into simple parts and turn a pointer.',
      cards: [
        ['The coin trick', 'Imagine you have to pay 30° with coins – but there are only coins worth 45°, 5.71°, 0.573°, 0.0573° … You take as many of each kind as possible, from large to small. For 30°: no 45° coin, five times 5.71°, twice 0.573° and so on.'],
        ['Why these coins?', 'The coins are the angles [[atan|atan]](1), atan(0.1), atan(0.01) … Their slopes are 1, 0.1, 0.01 – a 1 with zeros. Turning a pointer by such an angle costs only [[shift|shifting]] and adding: X′ = X − Y · 0.1 and Y′ = Y + X · 0.1.'],
        ['Count first, then turn', 'Phase 1 ([[pseudodiv|pseudo-division]]): the calculator counts how often each coin fits into the angle. Phase 2 ([[pseudomul|pseudo-multiplication]]): it turns a pointer exactly that often. At the end the tip sits at (X, Y), and tan θ = Y ÷ X. sin and cos follow from that.'],
        ['Backwards for atan', 'For atan the calculator turns a pointer back onto the horizontal axis ([[vectoring|vectoring]]) and counts the coins on the way. Their sum is the angle it is looking for.'],
        ['The tiny remainder', 'After seven kinds of coins a remainder smaller than a millionth is left. For such small angles tan r ≈ r – the calculator simply takes it directly ([[residual|residual]]).', 'detail'],
        ['Where the name comes from', 'CORDIC stands for COordinate Rotation DIgital Computer. Jack Volder developed the method in the 1950s for a navigation computer; HP used the decimal variant described by John Meggitt in 1962.', 'pro'],
      ],
      try: 'Watch in the lab how the calculator pays for sin 30° with coins.',
      merke: 'CORDIC splits the angle into coins atan(10⁻ʲ) and turns a pointer – with nothing but shifting and adding.',
    },
    quiz: [
      { ok: 0, de: ['Was sind die „Münzen“ des Rechners?', 'die Winkel atan(1), atan(0,1), atan(0,01) …', '1°, 10°, 100°', 'zufällige Winkel', 'Ihre Steigungen sind 1, 0,1, 0,01 … – das macht das Drehen billig.'], en: ['What are the calculator’s “coins”?', 'the angles atan(1), atan(0.1), atan(0.01) …', '1°, 10°, 100°', 'random angles', 'Their slopes are 1, 0.1, 0.01 … – that makes turning cheap.'] },
      { ok: 1, de: ['Warum ist das Drehen um atan(0,1) billig?', 'weil 0,1 klein ist', 'weil · 0,1 nur ein Verschieben ist', 'weil es fertig in einer Tabelle steht', 'Mal 0,1 heißt: alle Ziffern eine Stelle nach rechts.'], en: ['Why is turning by atan(0.1) cheap?', 'because 0.1 is small', 'because · 0.1 is just a shift', 'because it is ready in a table', 'Times 0.1 means: all digits one place to the right.'] },
      { ok: 2, de: ['Was passiert in der Pseudo-Division?', 'der Zeiger wird gedreht', 'das Ergebnis wird gerundet', 'es wird gezählt, wie oft jede Münze passt', 'Erst zählen (Pseudo-Division), dann drehen (Pseudo-Multiplikation).'], en: ['What happens in the pseudo-division?', 'the pointer is turned', 'the result is rounded', 'it counts how often each coin fits', 'Count first (pseudo-division), then turn (pseudo-multiplication).'] },
      { ok: 0, de: ['Wie bekommt der Rechner am Ende tan θ?', 'Y ÷ X', 'X ÷ Y', 'X + Y', 'Die Steigung des Zeigers ist Höhe ÷ Breite.'], en: ['How does the calculator get tan θ at the end?', 'Y ÷ X', 'X ÷ Y', 'X + Y', 'The slope of the pointer is height ÷ width.'] },
      { ok: 1, de: ['Wie rechnet er atan?', 'er schlägt in einer Tabelle nach', 'Zeiger zurück auf die Achse drehen und Münzen zählen', 'er rechnet 1 ÷ tan', 'Das heißt Vektorisierung: CORDIC rückwärts.'], en: ['How does it compute atan?', 'it looks it up in a table', 'turn a pointer back onto the axis and count the coins', 'it computes 1 ÷ tan', 'This is called vectoring: CORDIC backwards.'] },
    ],
  },
  // ------------------------------------------------------------------ 8
  {
    id: 'growth',
    icon: '📈',
    try: { kind: 'calc', check: (c) => done(c) && near(c.x, Math.E, 1e-8), hint: { 35: '1 eˣ', 45: '1 eˣ', 55: '1 g eˣ' } },
    de: {
      title: 'Wachsen mit Zinsen: e, eˣ und ln',
      goal: 'Du verstehst Potenz, e und Logarithmus – und wie der Rechner sie mit Zinsen berechnet.',
      cards: [
        ['Potenzen', '2⁵ = 2 · 2 · 2 · 2 · 2 = 32: Der [[power|Exponent]] zählt, wie oft man multipliziert. Der [[log|Logarithmus]] fragt umgekehrt: Welche Hochzahl brauche ich? log 1000 = 3, weil 10³ = 1000.'],
        ['Die Zahl e', '1 € mit 100 % Zinsen: jährlich verzinst sind es nach einem Jahr 2 €, monatlich verzinst etwa 2,61 €, täglich etwa 2,71 €. Je feiner, desto näher an [[euler|e]] = 2,718 … eˣ beschreibt solches gleichmäßiges Wachstum, ln ist der Rückweg.'],
        ['Zinsen statt Münzen', 'Für eˣ lässt der Rechner 1 Schritt für Schritt mit festen Zinssätzen wachsen: 100 % (×2), 10 % (×1,1), 1 % (×1,01) … Jedes ×1,01 ist für ihn billig: Zahl um zwei Stellen verschieben und dazuaddieren.'],
        ['ln rückwärts', 'Für ln 7 fragt der Rechner: Mit welchen Zinsschritten wird aus 1 eine 7? Er zählt die Faktoren ×2, ×1,1, ×1,01 … und addiert die passenden Werte ln 2, ln 1,1 … aus seiner Tabelle.'],
        ['Und yˣ?', 'Potenzen mit beliebigem Exponenten rechnet der Rechner über ln: yˣ = e^(x · ln y). Darum dauert yˣ etwas länger als eˣ.', 'detail'],
      ],
      try: 'Berechne e selbst: e¹ am Rechner. Erwartet: 2,718281828.',
      merke: 'eˣ heißt: 1 mit festen Zinssätzen wachsen lassen. ln zählt rückwärts, welche Zinsschritte nötig waren.',
    },
    en: {
      title: 'Growing with interest: e, eˣ and ln',
      goal: 'You understand powers, e and the logarithm – and how the calculator computes them with interest.',
      cards: [
        ['Powers', '2⁵ = 2 · 2 · 2 · 2 · 2 = 32: the [[power|exponent]] counts how often you multiply. The [[log|logarithm]] asks the other way round: which exponent do I need? log 1000 = 3 because 10³ = 1000.'],
        ['The number e', '1 € at 100 % interest: credited once a year it becomes 2 € after a year, credited monthly about 2.61 €, daily about 2.71 €. The finer, the closer to [[euler|e]] = 2.718 … eˣ describes such smooth growth, ln is the way back.'],
        ['Interest instead of coins', 'For eˣ the calculator lets 1 grow step by step at fixed interest rates: 100 % (×2), 10 % (×1.1), 1 % (×1.01) … Every ×1.01 is cheap for it: shift the number by two places and add it.'],
        ['ln backwards', 'For ln 7 the calculator asks: which interest steps turn 1 into 7? It counts the factors ×2, ×1.1, ×1.01 … and adds the matching values ln 2, ln 1.1 … from its table.'],
        ['And yˣ?', 'The calculator computes powers with any exponent via ln: yˣ = e^(x · ln y). That is why yˣ takes a little longer than eˣ.', 'detail'],
      ],
      try: 'Compute e yourself: e¹ on the calculator. Expected: 2.718281828.',
      merke: 'eˣ means: let 1 grow at fixed interest rates. ln counts backwards which interest steps were needed.',
    },
    quiz: [
      { ok: 0, de: ['log 1000 = ?', '3', '100', '1000', '10³ = 1000, also ist die gesuchte Hochzahl 3.'], en: ['log 1000 = ?', '3', '100', '1000', '10³ = 1000, so the exponent is 3.'] },
      { ok: 1, de: ['Was ist e ungefähr?', '3,142', '2,718', '1,414', '3,142 ist π, 1,414 ist √2.'], en: ['About what is e?', '3.142', '2.718', '1.414', '3.142 is π, 1.414 is √2.'] },
      { ok: 2, de: ['Warum ist ×1,01 für den Rechner billig?', 'weil 1,01 fast 1 ist', 'weil es in der Tabelle steht', 'Zahl um zwei Stellen verschieben und dazuaddieren', 'x · 1,01 = x + x · 0,01 – und · 0,01 ist nur Verschieben.'], en: ['Why is ×1.01 cheap for the calculator?', 'because 1.01 is almost 1', 'because it is in the table', 'shift the number by two places and add it', 'x · 1.01 = x + x · 0.01 – and · 0.01 is just a shift.'] },
      { ok: 0, de: ['ln ist die Umkehrung von …', 'eˣ', '10ˣ', 'x²', 'ln(eˣ) = x. Die Umkehrung von 10ˣ ist log.'], en: ['ln is the inverse of …', 'eˣ', '10ˣ', 'x²', 'ln(eˣ) = x. The inverse of 10ˣ is log.'] },
      { ok: 1, de: ['Wie berechnet der Rechner yˣ?', 'y mal x', 'e^(x · ln y)', 'x-mal y addieren', 'Über den Logarithmus wird aus der Potenz eine Multiplikation.'], en: ['How does the calculator compute yˣ?', 'y times x', 'e^(x · ln y)', 'add y x times', 'The logarithm turns the power into a multiplication.'] },
    ],
  },
  // ------------------------------------------------------------------ 9
  {
    id: 'accuracy',
    icon: '🎯',
    try: { kind: 'calc', check: (c, id) => done(c) && id === 'add' && c.x === 0.3, hint: { 35: '.1 ENTER↑ .2 +', 45: '.1 ENTER↑ .2 +', 55: '.1 ENTER↑ .2 +' } },
    de: {
      title: 'Wie genau ist genau?',
      goal: 'Du weißt, warum der Rechner 10 Stellen hat und wo Rechnen an Grenzen stößt.',
      cards: [
        ['10 Stellen', 'Der HP rechnet und speichert 10 [[sigdigits|signifikante Stellen]]. Was dahinter kommt, wird gerundet: Aus 2 ÷ 3 wird 0,6666666667 – die letzte Stelle ist aufgerundet.'],
        ['Annähern statt ausrechnen', 'sin, ln oder √2 kann niemand mit endlich vielen Grundrechnungen exakt ausrechnen. Der Rechner nähert sich an ([[approx|Iteration]]), bis 10 Stellen stimmen. Im Labor zeigt die [[convergence|Konvergenz]]-Kurve, wie die richtigen Stellen Schritt für Schritt dazukommen.'],
        ['0,1 + 0,2', 'Die meisten Computer rechnen binär. Dort ist 0,1 ein unendlicher Bruch, und 0,1 + 0,2 ergibt 0,30000000000000004. Der HP rechnet dezimal ([[bcd|BCD]]) und bekommt genau 0,3.'],
        ['Grenzen', 'Die größte Zahl ist knapp 10¹⁰⁰. 69! ≈ 1,7 × 10⁹⁸ passt noch, 70! nicht mehr – der Rechner meldet einen Fehler ([[factorial|Fakultät]]).'],
        ['Genau genug', 'Ein Rechenschieber mit 3 Stellen reichte für die meisten Ingenieuraufgaben: Messwerte haben selten mehr Stellen. 10 Stellen sind ein großzügiger Puffer – damit sich Rundungsfehler bei langen Rechnungen nicht bemerkbar machen.', 'detail'],
      ],
      try: 'Rechne 0,1 + 0,2 – und prüfe, ob wirklich genau 0,3 herauskommt.',
      merke: 'Der Rechner liefert 10 Stellen, gerundet. Er nähert sich schrittweise an – und rechnet dezimal, darum ist 0,1 + 0,2 bei ihm genau 0,3.',
    },
    en: {
      title: 'How accurate is accurate?',
      goal: 'You know why the calculator has 10 digits and where calculating hits its limits.',
      cards: [
        ['10 digits', 'The HP computes and stores 10 [[sigdigits|significant digits]]. Whatever comes after is rounded: 2 ÷ 3 becomes 0.6666666667 – the last digit is rounded up.'],
        ['Approaching instead of computing', 'Nobody can compute sin, ln or √2 exactly with a finite number of basic operations. The calculator approaches the result ([[approx|iteration]]) until 10 digits are right. In the lab the [[convergence|convergence]] curve shows how the correct digits arrive step by step.'],
        ['0.1 + 0.2', 'Most computers work in binary. There 0.1 is an endless fraction, and 0.1 + 0.2 gives 0.30000000000000004. The HP computes in decimal ([[bcd|BCD]]) and gets exactly 0.3.'],
        ['Limits', 'The largest number is just under 10¹⁰⁰. 69! ≈ 1.7 × 10⁹⁸ still fits, 70! no longer does – the calculator reports an error ([[factorial|factorial]]).'],
        ['Accurate enough', 'A slide rule with 3 digits was enough for most engineering work: measurements rarely have more digits. 10 digits are a generous buffer – so that rounding errors in long calculations don’t show.', 'detail'],
      ],
      try: 'Compute 0.1 + 0.2 – and check whether you really get exactly 0.3.',
      merke: 'The calculator delivers 10 digits, rounded. It approaches the result step by step – and computes in decimal, so 0.1 + 0.2 is exactly 0.3.',
    },
    quiz: [
      { ok: 0, de: ['Wie viele signifikante Stellen speichert der HP?', '10', '3', '100', '10 Stellen Mantisse, dazu der Exponent.'], en: ['How many significant digits does the HP store?', '10', '3', '100', '10 mantissa digits, plus the exponent.'] },
      { ok: 1, de: ['Was ergibt 0,1 + 0,2 auf vielen binären Computern?', '0,3', '0,30000000000000004', '0,2', 'Im Binärsystem ist 0,1 nicht exakt darstellbar – der kleine Fehler wird sichtbar.'], en: ['What does 0.1 + 0.2 give on many binary computers?', '0.3', '0.30000000000000004', '0.2', 'In binary 0.1 cannot be represented exactly – the tiny error shows.'] },
      { ok: 2, de: ['Wie viele signifikante Stellen hat 0,004560?', '7', '6', '4', 'Führende Nullen zählen nicht: 4, 5, 6, 0.'], en: ['How many significant digits does 0.004560 have?', '7', '6', '4', 'Leading zeros don’t count: 4, 5, 6, 0.'] },
      { ok: 0, de: ['Was bedeutet „Iteration“?', 'einfache Schritte wiederholen, bis es genau genug ist', 'einmal rechnen und fertig', 'zufällig raten', 'Iterare heißt wiederholen.'], en: ['What does “iteration” mean?', 'repeat simple steps until it is accurate enough', 'compute once and done', 'guess at random', 'Iterare means to repeat.'] },
      { ok: 1, de: ['Welche Fakultät kann der Rechner gerade noch anzeigen?', '100!', '69!', '10!', '69! ≈ 1,7 × 10⁹⁸; 70! wäre größer als 10¹⁰⁰.'], en: ['Which factorial can the calculator just about display?', '100!', '69!', '10!', '69! ≈ 1.7 × 10⁹⁸; 70! would exceed 10¹⁰⁰.'] },
    ],
  },
  // ------------------------------------------------------------------ 10
  {
    id: 'hardware',
    icon: '🔌',
    try: { kind: 'model', model: 55 },
    de: {
      title: 'Was steckt im Gehäuse – und was kam danach?',
      goal: 'Du kennst die Bauteile des HP-35 und weißt, wie es mit HP-45 und HP-55 weiterging.',
      cards: [
        ['Fünf Chips', 'Im HP-35 stecken fünf MOS-Chips: einer für Steuerung und Takt (C&T), einer für Rechenwerk und [[register|Register]] (A&R) und drei [[rom|ROMs]] mit dem Programm. Dazu kommen Treiber für Takt und Anzeige.'],
        ['Ein winziges Programm', 'Die drei ROMs fassen zusammen 768 Befehle zu je 10 Bit – weniger als ein Kilobyte. Darin steckt alles: Tastatur, Anzeige, Grundrechenarten, CORDIC und Logarithmen.'],
        ['Langsam, aber sparsam', 'Der Takt beträgt 200 kHz, und die Bits wandern seriell, eins nach dem anderen. Das Ziel der Entwickler: jede Funktion in höchstens einer Sekunde. Wenige Leitungen und kleine Chips bedeuten wenig Stromverbrauch – wichtig für den Akku.'],
        ['Rote Leuchtziffern', 'Die Anzeige besteht aus winzigen LEDs hinter Lupenlinsen. LEDs brauchen viel Strom; sparsame Flüssigkristallanzeigen (LCD) setzten sich erst später durch.'],
        ['Die Nachfolger', '1973 kam der HP-45 mit Umschalttaste, Speichern und mehr Funktionen – zum gleichen Preis von 395 $. Er hatte sogar eine versteckte Stoppuhr, die ohne Quarz aber ungenau lief. 1975 folgte der HP-55: programmierbar mit 49 Schritten, 20 Speichern und einer Stoppuhr mit Quarz.'],
        ['Und dann?', 'Taschenrechner wurden rasch billiger – einfache Modelle kosteten Mitte der 1970er nur noch einen Bruchteil. Der Rechenschieber verschwand innerhalb weniger Jahre aus Büros und Schulen.', 'detail'],
      ],
      try: 'Schalte mit dem Schiebeschalter auf der Silberleiste auf den HP-55 – den Rechner von 1975 mit f- und g-Taste und Programmtasten.',
      merke: 'Fünf Chips, 768 Befehle, 200 kHz: Mit erstaunlich wenig Technik passte 1972 ein wissenschaftlicher Rechner in die Tasche.',
    },
    en: {
      title: 'What is inside – and what came next?',
      goal: 'You know the parts of the HP-35 and how things went on with the HP-45 and HP-55.',
      cards: [
        ['Five chips', 'The HP-35 contains five MOS chips: one for control and timing (C&T), one for the arithmetic unit and [[register|registers]] (A&R), and three [[rom|ROMs]] holding the program. Add to that drivers for the clock and the display.'],
        ['A tiny program', 'Together the three ROMs hold 768 instructions of 10 bits each – less than a kilobyte. Everything is in there: keyboard, display, basic arithmetic, CORDIC and logarithms.'],
        ['Slow but frugal', 'The clock runs at 200 kHz, and the bits travel serially, one after another. The designers’ goal: every function in at most one second. Few wires and small chips mean low power – important for the battery.'],
        ['Red glowing digits', 'The display consists of tiny LEDs behind magnifying lenses. LEDs need a lot of power; frugal liquid-crystal displays (LCD) only caught on later.'],
        ['The successors', 'In 1973 came the HP-45 with a shift key, memories and more functions – at the same price of $395. It even had a hidden stopwatch, which was inaccurate without a quartz crystal. In 1975 the HP-55 followed: programmable with 49 steps, 20 memories and a quartz-controlled stopwatch.'],
        ['And then?', 'Calculators quickly became cheaper – by the mid-1970s simple models cost only a fraction. The slide rule disappeared from offices and schools within a few years.', 'detail'],
      ],
      try: 'Use the slide switch on the silver band to switch to the HP-55 – the 1975 calculator with f and g keys and program keys.',
      merke: 'Five chips, 768 instructions, 200 kHz: with astonishingly little technology, a scientific calculator fit into a pocket in 1972.',
    },
    quiz: [
      { ok: 2, de: ['Wie viele Befehle fasst das ROM des HP-35?', '35', '768 000', '768', '3 ROMs × 256 Befehle = 768.'], en: ['How many instructions does the HP-35’s ROM hold?', '35', '768,000', '768', '3 ROMs × 256 instructions = 768.'] },
      { ok: 0, de: ['Wie schnell ist der Takt des HP-35?', '200 kHz', '2 GHz', '1 Hz', '200 000 Takte pro Sekunde – ein heutiges Handy ist über zehntausendmal schneller.'], en: ['How fast is the HP-35’s clock?', '200 kHz', '2 GHz', '1 Hz', '200,000 cycles per second – a phone today is more than ten thousand times faster.'] },
      { ok: 1, de: ['Was bedeutet „bit-seriell“?', 'alle Bits gleichzeitig', 'die Bits wandern nacheinander über eine Leitung', 'ganz ohne Bits', 'Das spart Leitungen und Chipfläche, kostet aber Zeit.'], en: ['What does “bit-serial” mean?', 'all bits at once', 'the bits travel one after another over one wire', 'without any bits', 'That saves wires and chip area, but costs time.'] },
      { ok: 0, de: ['Was war neu am HP-55?', 'Programmierbarkeit und eine Stoppuhr mit Quarz', 'ein Farbbildschirm', 'eine Solarzelle', '49 Programmschritte, 20 Speicher und eine genaue Stoppuhr.'], en: ['What was new on the HP-55?', 'programmability and a quartz stopwatch', 'a colour screen', 'a solar cell', '49 program steps, 20 memories and an accurate stopwatch.'] },
      { ok: 1, de: ['Wann lief bei Keuffel & Esser der letzte Rechenschieber vom Band?', '1972', '1976', '1990', 'Am 11. Juli 1976 – nur vier Jahre nach dem HP-35.'], en: ['When did Keuffel & Esser make its last slide rule?', '1972', '1976', '1990', 'On 11 July 1976 – just four years after the HP-35.'] },
    ],
  },
];

/** a question counts as passed when at least this share is right */
export const PASS = 0.6;

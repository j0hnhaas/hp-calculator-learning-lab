// Glossary: every technical term gets one sentence, a picture from everyday
// life and an optional "more" section. Texts may link to other terms with
// [[id|text]] or [[id]].
//
// Audience: curious people from about 15 years on – no engineering degree needed.

export const GLOSSARY = {
  rpn: {
    de: {
      term: 'RPN – Umgekehrte Polnische Notation',
      short: 'Eine Eingabeart ohne =-Taste: Erst tippst du die Zahlen, dann die Rechenart.',
      image: 'Wie beim Kochen: Erst legst du die Zutaten bereit, dann sagst du „mischen“. Für 3 + 4 tippst du 3 ENTER 4 +.',
      more: 'Erfunden hat die Schreibweise der polnische Logiker Jan Łukasiewicz in den 1920ern – daher der Name. HP setzte sie ein, weil man damit ohne Klammern auskommt, weniger Tasten drückt und alle Zwischenergebnisse auf dem [[stack|Stapel]] liegen bleiben.',
      see: ['stack', 'enter'],
    },
    en: {
      term: 'RPN – Reverse Polish Notation',
      short: 'A way of entering calculations without an = key: first the numbers, then the operation.',
      image: 'Like cooking: first you lay out the ingredients, then you say “mix”. For 3 + 4 you type 3 ENTER 4 +.',
      more: 'The notation goes back to the Polish logician Jan Łukasiewicz in the 1920s – hence the name. HP used it because it needs no parentheses, fewer keystrokes, and all intermediate results stay on the [[stack|stack]].',
      see: ['stack', 'enter'],
    },
  },
  stack: {
    de: {
      term: 'Stapel (Stack)',
      short: 'Vier Speicherplätze übereinander: X, Y, Z und T. X ist die Zahl in der Anzeige.',
      image: 'Ein Stapel Notizzettel: Neue Zahlen kommen obendrauf. Eine Rechenart nimmt die beiden obersten Zettel, rechnet und legt das Ergebnis zurück.',
      more: '[[enter|ENTER]] schiebt alles eine Ebene nach oben (T fällt dabei heraus). Nach + − × ÷ rutscht alles eine Ebene nach unten, und T wird kopiert. So kannst du lange Rechnungen ohne Klammern eintippen.',
      see: ['enter', 'rpn', 'register'],
    },
    en: {
      term: 'Stack',
      short: 'Four storage places on top of each other: X, Y, Z and T. X is the number in the display.',
      image: 'A pile of sticky notes: new numbers go on top. An operation takes the top two notes, calculates and puts the result back.',
      more: '[[enter|ENTER]] pushes everything up one level (T falls off). After + − × ÷ everything drops one level, and T is copied. That way you can type long calculations without parentheses.',
      see: ['enter', 'rpn', 'register'],
    },
  },
  enter: {
    de: {
      term: 'ENTER ↑',
      short: 'Schließt die getippte Zahl ab und legt eine Kopie auf den Stapel – damit die nächste Zahl Platz hat.',
      image: 'Einen Notizzettel ablegen, bevor du den nächsten beschreibst.',
      more: 'ENTER brauchst du nur zwischen zwei Zahlen, die direkt hintereinander kommen. Nach einer Rechenart nicht – die schließt die Zahl selbst ab. Trick: 8 ENTER × rechnet 8 · 8 = 64.',
      see: ['stack', 'rpn'],
    },
    en: {
      term: 'ENTER ↑',
      short: 'Finishes the number you typed and puts a copy on the stack – so the next number has room.',
      image: 'Putting a note down before you write the next one.',
      more: 'You only need ENTER between two numbers typed right after each other. Not after an operation – it finishes the number by itself. Trick: 8 ENTER × computes 8 · 8 = 64.',
      see: ['stack', 'rpn'],
    },
  },
  register: {
    de: {
      term: 'Register',
      short: 'Ein Speicherplatz im Rechner für genau eine Zahl.',
      image: 'Ein Fach in einem Sortierkasten.',
      more: 'Beim HP-45 hat ein Register 14 Ziffern: Vorzeichen, 10 Ziffern der [[mantissa|Mantisse]] und den Exponenten – alle als [[bcd|BCD]]. Das Rechenwerk rechnet direkt mit diesen Ziffern.',
      see: ['bcd', 'stack'],
    },
    en: {
      term: 'Register',
      short: 'A storage place inside the calculator for exactly one number.',
      image: 'One compartment in a sorting box.',
      more: 'On the HP-45 a register holds 14 digits: sign, 10 digits of the [[mantissa|mantissa]] and the exponent – all in [[bcd|BCD]]. The arithmetic unit works directly on these digits.',
      see: ['bcd', 'stack'],
    },
  },
  bcd: {
    de: {
      term: 'BCD – binär codierte Dezimalzahl',
      short: 'Jede Dezimalziffer wird einzeln in 4 Bits gespeichert – der Rechner „denkt“ also in Ziffern 0 bis 9.',
      image: 'Wie ein Kilometerzähler mit Ziffernrollen statt einer langen Zahl aus Nullen und Einsen.',
      more: '7 wird zu 0111, 42 zu 0100 0010. Vorteil: Tastatur und Anzeige sind dezimal, es muss nichts umgerechnet werden – und ×10 oder ÷10 ist nur ein [[shift|Verschieben]] der Ziffern.',
      see: ['shift', 'binary'],
    },
    en: {
      term: 'BCD – binary-coded decimal',
      short: 'Every decimal digit is stored on its own in 4 bits – so the calculator “thinks” in digits 0 to 9.',
      image: 'Like an odometer with digit wheels instead of one long string of zeros and ones.',
      more: '7 becomes 0111, 42 becomes 0100 0010. Benefit: keyboard and display are decimal, nothing has to be converted – and ×10 or ÷10 is just [[shift|shifting]] the digits.',
      see: ['shift', 'binary'],
    },
  },
  shift: {
    de: {
      term: 'Verschieben (Shift)',
      short: 'Alle Ziffern rücken eine Stelle weiter – das ist ×10 oder ÷10.',
      image: 'Das Komma verschieben: aus 0,5 wird 0,05.',
      more: 'Für den Rechner kostet Verschieben fast nichts. Darum ist „Zahl + dieselbe Zahl um j Stellen verschoben“ sein Lieblingstrick: Das ist ein Multiplizieren mit 1,1 oder 1,01 oder 1,001 – ganz ohne Multiplizierer.',
      see: ['bcd', 'pseudomul'],
    },
    en: {
      term: 'Shift',
      short: 'All digits move one place – that is ×10 or ÷10.',
      image: 'Moving the decimal point: 0.5 becomes 0.05.',
      more: 'For the calculator shifting is almost free. That is why “number + the same number shifted by j places” is its favourite trick: it multiplies by 1.1 or 1.01 or 1.001 – without any multiplier.',
      see: ['bcd', 'pseudomul'],
    },
  },
  cordic: {
    de: {
      term: 'CORDIC',
      short: 'Ein Verfahren, um Sinus, Logarithmus & Co. nur mit Verschieben und Addieren zu berechnen.',
      image: 'Einen Zeiger in immer kleineren, festen Schritten genau auf den Zielwinkel drehen.',
      more: 'Der Name steht für „COordinate Rotation DIgital Computer“. Jack Volder erfand es 1959 für einen Navigationscomputer, J. E. Meggitt beschrieb 1962 die dezimale Variante, die HP im HP-35 und HP-45 verwendet: [[pseudodiv|Pseudo-Division]] und [[pseudomul|Pseudo-Multiplikation]].',
      see: ['pseudodiv', 'pseudomul', 'rotation'],
    },
    en: {
      term: 'CORDIC',
      short: 'A method to compute sine, logarithm and friends with nothing but shifts and additions.',
      image: 'Turning a pointer onto the target angle in ever smaller, fixed steps.',
      more: 'The name stands for “COordinate Rotation DIgital Computer”. Jack Volder invented it in 1959 for a navigation computer; J. E. Meggitt described the decimal variant in 1962, which HP uses in the HP-35 and HP-45: [[pseudodiv|pseudo-division]] and [[pseudomul|pseudo-multiplication]].',
      see: ['pseudodiv', 'pseudomul', 'rotation'],
    },
  },
  pseudodiv: {
    de: {
      term: 'Pseudo-Division',
      short: 'Der Rechner zerlegt die Zahl in feste Bausteine aus seinem Speicher und zählt, wie oft jeder hineinpasst.',
      image: 'Wie Bezahlen mit möglichst wenigen Münzen: immer zuerst die größte, die noch passt. Für 30° passt die 45°-Münze nicht, die 5,71°-Münze 5×, die 0,573°-Münze 2× … Bei ln sind es Zinsen: Wie oft muss man 100 %, 10 %, 1 % … draufschlagen, um von 1 auf die Zahl zu kommen?',
      more: '„Pseudo“, weil es abläuft wie schriftliches Dividieren – abziehen, zählen, nächste Stelle –, das Ergebnis aber keine Division ist, sondern eine Liste von Zählern q₀, q₁, q₂ … Die Bausteine sind die [[rom|ROM-Konstanten]].',
      see: ['pseudomul', 'rom', 'decade', 'residual'],
    },
    en: {
      term: 'Pseudo-division',
      short: 'The calculator splits the number into fixed building blocks from its memory and counts how often each one fits.',
      image: 'Like paying with as few coins as possible: always the largest coin that still fits first. For 30° the 45° coin does not fit, the 5.71° coin fits 5×, the 0.573° coin 2× … For ln it is interest: how often do you have to add 100 %, 10 %, 1 % … to get from 1 to the number?',
      more: '“Pseudo” because it works like long division – subtract, count, next digit – but the result is not a quotient but a list of counters q₀, q₁, q₂ … The building blocks are the [[rom|ROM constants]].',
      see: ['pseudomul', 'rom', 'decade', 'residual'],
    },
  },
  pseudomul: {
    de: {
      term: 'Pseudo-Multiplikation',
      short: 'Der Rechner baut das Ergebnis aus der Zählerliste wieder auf – jeder Baustein ist ein einfacher Schiebe-und-Addier-Schritt.',
      image: 'Mit der Münzliste dreht er einen Zeiger Münze für Münze genau auf den Winkel. Bei eˣ verzinst er 1 € so oft, wie er gezählt hat.',
      more: 'Er beginnt mit den kleinsten Bausteinen. Deshalb stimmt das Ergebnis erst ganz am Schluss – das zeigt die Konvergenz-Kurve im Labor.',
      see: ['pseudodiv', 'rotation', 'convergence'],
    },
    en: {
      term: 'Pseudo-multiplication',
      short: 'The calculator rebuilds the result from the list of counters – every building block is a simple shift-and-add step.',
      image: 'With the list of coins it turns a pointer coin by coin onto the angle. For eˣ it adds interest to 1 € as often as it counted.',
      more: 'It starts with the smallest blocks. That is why the result is only right at the very end – the convergence curve in the lab shows this.',
      see: ['pseudodiv', 'rotation', 'convergence'],
    },
  },
  decade: {
    de: {
      term: 'Dekade',
      short: 'Eine Größenstufe der Bausteine – jede ist ungefähr 10× kleiner als die vorige.',
      image: 'Münzsorten: 1 €, 10 Cent, 1 Cent.',
      more: 'In Dekade j ist der Baustein atan(10⁻ʲ) bzw. ln(1 + 10⁻ʲ). Jede Dekade liefert ungefähr eine weitere richtige Stelle.',
      see: ['pseudodiv', 'rom'],
    },
    en: {
      term: 'Decade',
      short: 'One size level of the building blocks – each about 10× smaller than the one before.',
      image: 'Coin sizes: 1 €, 10 cents, 1 cent.',
      more: 'In decade j the building block is atan(10⁻ʲ) or ln(1 + 10⁻ʲ). Every decade yields about one more correct digit.',
      see: ['pseudodiv', 'rom'],
    },
  },
  rom: {
    de: {
      term: 'ROM-Konstanten',
      short: 'Feste Zahlen, die im Festspeicher (ROM) des Rechners eingebaut sind.',
      image: 'Die Münzsorten, die der Rechner immer im Geldbeutel hat.',
      more: 'Das ROM des HP-35 fasst nur 768 Befehle. Darin stehen die Bausteine atan(1), atan(0,1), atan(0,01) … und ln 2, ln 1,1, ln 1,01 … als [[bcd|BCD]]-Zahlen.',
      see: ['pseudodiv', 'decade'],
    },
    en: {
      term: 'ROM constants',
      short: 'Fixed numbers built into the calculator’s read-only memory (ROM).',
      image: 'The coin types the calculator always carries in its wallet.',
      more: 'The HP-35 ROM holds just 768 instructions. It stores the building blocks atan(1), atan(0.1), atan(0.01) … and ln 2, ln 1.1, ln 1.01 … as [[bcd|BCD]] numbers.',
      see: ['pseudodiv', 'decade'],
    },
  },
  radian: {
    de: {
      term: 'Radiant (Bogenmaß)',
      short: 'Ein Winkelmaß: Ein voller Kreis hat 2π ≈ 6,283 Radiant, 180° sind π ≈ 3,1416.',
      image: 'Die Länge des Bogens auf einem Kreis mit Radius 1.',
      more: 'Intern rechnen Winkelfunktionen immer in Radiant – Grad (DEG) oder Gon (GRD, 400 pro Kreis) werden vorher umgerechnet.',
      see: ['pi', 'unitcircle', 'quadrant'],
    },
    en: {
      term: 'Radian',
      short: 'An angle unit: a full circle is 2π ≈ 6.283 radians, 180° is π ≈ 3.1416.',
      image: 'The length of the arc on a circle with radius 1.',
      more: 'Internally trig functions always work in radians – degrees (DEG) or grads (GRD, 400 per circle) are converted first.',
      see: ['pi', 'unitcircle', 'quadrant'],
    },
  },
  quadrant: {
    de: {
      term: 'Quadrant',
      short: 'Ein Viertel des Kreises: 0–90°, 90–180°, 180–270°, 270–360°.',
      image: 'Die vier Viertel einer Pizza.',
      more: 'Der Rechner rechnet nur im ersten Viertel. sin 150° ist dasselbe wie sin 30° – Spiegelung und Vorzeichen setzt er danach.',
      see: ['radian', 'trig'],
    },
    en: {
      term: 'Quadrant',
      short: 'A quarter of the circle: 0–90°, 90–180°, 180–270°, 270–360°.',
      image: 'The four quarters of a pizza.',
      more: 'The calculator only computes in the first quarter. sin 150° equals sin 30° – mirroring and sign are applied afterwards.',
      see: ['radian', 'trig'],
    },
  },
  vector: {
    de: {
      term: 'Vektor (Zeiger)',
      short: 'Ein Pfeil vom Mittelpunkt aus, beschrieben durch X (waagrecht) und Y (senkrecht).',
      image: 'Ein Uhrzeiger.',
      more: 'Zeigt der Pfeil im Winkel θ und ist er 1 lang, dann ist X = cos θ und Y = sin θ – und Y/X = tan θ. Genau deshalb dreht CORDIC einen Zeiger.',
      see: ['rotation', 'trig'],
    },
    en: {
      term: 'Vector (pointer)',
      short: 'An arrow from the centre, described by X (horizontal) and Y (vertical).',
      image: 'A clock hand.',
      more: 'If the arrow points at angle θ and has length 1, then X = cos θ and Y = sin θ – and Y/X = tan θ. That is exactly why CORDIC turns a pointer.',
      see: ['rotation', 'trig'],
    },
  },
  rotation: {
    de: {
      term: 'Drehung (Rotation)',
      short: 'Den Zeiger um einen Winkel weiterdrehen.',
      image: 'Den Uhrzeiger ein Stück weiterstellen.',
      more: 'Eine Drehung um atan(10⁻ʲ) ist für den Rechner billig: X′ = X − Y·10⁻ʲ und Y′ = Y + X·10⁻ʲ – nur [[shift|Verschieben]] und Addieren. Der Zeiger wird dabei minimal länger; das kürzt sich am Ende heraus.',
      see: ['vector', 'shift', 'gain'],
    },
    en: {
      term: 'Rotation',
      short: 'Turning the pointer further by some angle.',
      image: 'Moving a clock hand on a bit.',
      more: 'A rotation by atan(10⁻ʲ) is cheap for the calculator: X′ = X − Y·10⁻ʲ and Y′ = Y + X·10⁻ʲ – just [[shift|shifting]] and adding. The pointer gets a tiny bit longer; that cancels out at the end.',
      see: ['vector', 'shift', 'gain'],
    },
  },
  trig: {
    viz: 'circle',
    de: {
      term: 'Winkelfunktionen: sin, cos, tan',
      short: 'Sie verbinden einen Winkel mit Seitenverhältnissen im rechtwinkligen Dreieck.',
      image: 'Eine Leiter an der Wand: sin = Höhe ÷ Leiterlänge, cos = Abstand ÷ Leiterlänge, tan = Höhe ÷ Abstand. Bei 30° reicht die Leiter halb so hoch, wie sie lang ist: sin 30° = 0,5.',
      more: 'Die Umkehrungen (SIN⁻¹, arc sin …) gehen den anderen Weg: Aus dem Verhältnis wird der Winkel. Der Rechner nutzt dafür die [[vectoring|Vektorisierung]].',
      see: ['unitcircle', 'atan', 'inverse', 'radian'],
    },
    en: {
      term: 'Trig functions: sin, cos, tan',
      short: 'They link an angle to the ratios of the sides of a right triangle.',
      image: 'A ladder against a wall: sin = height ÷ ladder length, cos = distance ÷ ladder length, tan = height ÷ distance. At 30° the ladder reaches half as high as it is long: sin 30° = 0.5.',
      more: 'The inverses (SIN⁻¹, arc sin …) go the other way: from the ratio to the angle. The calculator uses [[vectoring|vectoring]] for that.',
      see: ['unitcircle', 'atan', 'inverse', 'radian'],
    },
  },
  atan: {
    viz: 'circle',
    de: {
      term: 'atan – Arkustangens',
      short: 'Die Umkehrung von tan: Zu „Höhe ÷ Abstand“ liefert atan den Winkel.',
      image: 'Wie steil ist die Rampe? 1 m Höhe auf 1 m Länge ergibt 45°, 1 m auf 10 m ergibt 5,71°.',
      more: 'Die Winkel atan(1) = 45°, atan(0,1) = 5,71°, atan(0,01) = 0,573° … sind die „Münzen“ des Rechners – Drehungen um genau diese Winkel sind für ihn besonders einfach.',
      see: ['inverse', 'unitcircle', 'trig', 'pseudodiv'],
    },
    en: {
      term: 'atan – arctangent',
      short: 'The inverse of tan: given “height ÷ distance”, atan returns the angle.',
      image: 'How steep is the ramp? 1 m up over 1 m gives 45°, 1 m over 10 m gives 5.71°.',
      more: 'The angles atan(1) = 45°, atan(0.1) = 5.71°, atan(0.01) = 0.573° … are the calculator’s “coins” – rotations by exactly these angles are especially easy for it.',
      see: ['inverse', 'unitcircle', 'trig', 'pseudodiv'],
    },
  },
  vectoring: {
    de: {
      term: 'Vektorisierung',
      short: 'CORDIC rückwärts: Der Zeiger wird auf die waagrechte Achse zurückgedreht – und der Rechner zählt mit, um wie viel.',
      image: 'Ein schief hängendes Bild geraderücken und dabei messen, wie weit man es drehen musste.',
      see: ['atan', 'rotation'],
    },
    en: {
      term: 'Vectoring',
      short: 'CORDIC backwards: the pointer is turned back onto the horizontal axis – and the calculator counts by how much.',
      image: 'Straightening a crooked picture and measuring how far you had to turn it.',
      see: ['atan', 'rotation'],
    },
  },
  log: {
    de: {
      term: 'Logarithmus: ln und log',
      short: 'Der Logarithmus fragt: Welche Hochzahl brauche ich? log 1000 = 3, weil 10³ = 1000.',
      image: 'Zinsen: ln sagt, wie lange Geld (stetig verzinst) wachsen muss, bis es sich ver-x-facht hat.',
      more: 'ln verwendet die Basis e ≈ 2,718: ln 7 ≈ 1,9459, denn e¹·⁹⁴⁵⁹ ≈ 7. Der Rechner zerlegt die Zahl dafür in Zins-Faktoren ×2, ×1,1, ×1,01 … ([[pseudodiv|Pseudo-Division]]).',
      see: ['power', 'euler', 'exp', 'pseudodiv'],
    },
    en: {
      term: 'Logarithm: ln and log',
      short: 'The logarithm asks: which exponent do I need? log 1000 = 3 because 10³ = 1000.',
      image: 'Interest: ln tells you how long money (with continuous interest) must grow until it has multiplied by x.',
      more: 'ln uses the base e ≈ 2.718: ln 7 ≈ 1.9459 because e¹·⁹⁴⁵⁹ ≈ 7. The calculator splits the number into interest factors ×2, ×1.1, ×1.01 … ([[pseudodiv|pseudo-division]]).',
      see: ['power', 'euler', 'exp', 'pseudodiv'],
    },
  },
  exp: {
    de: {
      term: 'Exponentialfunktion eˣ',
      short: 'e hoch x – die Umkehrung von ln.',
      image: 'Zinseszins: 1 € wächst und wächst. Der Rechner verzinst 1 € Schritt für Schritt mit 100 %, 10 %, 1 % …',
      see: ['euler', 'log', 'power', 'pseudomul'],
    },
    en: {
      term: 'Exponential function eˣ',
      short: 'e to the power of x – the inverse of ln.',
      image: 'Compound interest: 1 € keeps growing. The calculator adds interest to 1 € step by step with 100 %, 10 %, 1 % …',
      see: ['euler', 'log', 'power', 'pseudomul'],
    },
  },
  mantissa: {
    de: {
      term: 'Mantisse und Exponent',
      short: 'Zahl = Mantisse × 10^Exponent, zum Beispiel 6,02 × 10²³.',
      image: 'Die Ziffern und die Größenordnung werden getrennt aufgeschrieben.',
      more: 'Die Anzeige hat 10 Ziffern für die Mantisse und 2 für den Exponenten. Mit EEX tippst du den Exponenten ein: 6.02 EEX 23.',
      see: ['placevalue', 'sigdigits', 'register'],
    },
    en: {
      term: 'Mantissa and exponent',
      short: 'Number = mantissa × 10^exponent, for example 6.02 × 10²³.',
      image: 'The digits and the order of magnitude are written down separately.',
      more: 'The display shows 10 mantissa digits and 2 exponent digits. Use EEX to type an exponent: 6.02 EEX 23.',
      see: ['placevalue', 'sigdigits', 'register'],
    },
  },
  residual: {
    de: {
      term: 'Rest',
      short: 'Was nach allen Bausteinen übrig bleibt – winzig klein.',
      image: 'Die paar Zehntelcent, die keine Münze mehr abdeckt.',
      more: 'Für so kleine Werte gilt tan r ≈ r und ln(1 + r) ≈ r. Der Rechner nimmt den Rest deshalb einfach direkt – genau genug für alle 10 Stellen.',
      see: ['pseudodiv'],
    },
    en: {
      term: 'Residual',
      short: 'What is left over after all building blocks – tiny.',
      image: 'The fraction of a cent no coin covers anymore.',
      more: 'For such small values tan r ≈ r and ln(1 + r) ≈ r. So the calculator simply uses the residual directly – accurate enough for all 10 digits.',
      see: ['pseudodiv'],
    },
  },
  convergence: {
    de: {
      term: 'Konvergenz',
      short: 'Wie schnell sich ein Verfahren dem richtigen Ergebnis nähert.',
      image: 'Sich an ein Ziel heranpirschen: erst grob, dann immer feiner.',
      more: 'Die Kurve im Labor zählt, wie viele Stellen nach jedem Schritt schon stimmen. 10 Stellen zeigt die Anzeige.',
      see: ['approx', 'decade'],
    },
    en: {
      term: 'Convergence',
      short: 'How quickly a method approaches the correct result.',
      image: 'Sneaking up on a target: coarse first, then finer and finer.',
      more: 'The curve in the lab counts how many digits are already correct after each step. The display shows 10.',
      see: ['approx', 'decade'],
    },
  },
  sqrtdigits: {
    de: {
      term: 'Wurzel Ziffer für Ziffer',
      short: 'Der Rechner findet die Quadratwurzel, indem er ungerade Zahlen abzieht und mitzählt.',
      image: '1 + 3 + 5 + 7 = 16 = 4². Wie oft kannst du ungerade Zahlen von 16 abziehen? 4-mal – also ist √16 = 4.',
      more: 'Für jede weitere Stelle wird der Rest um zwei Stellen [[shift|verschoben]] und das Spiel wiederholt. Keine einzige Multiplikation nötig.',
      see: ['root', 'shift'],
    },
    en: {
      term: 'Square root digit by digit',
      short: 'The calculator finds the square root by subtracting odd numbers and counting.',
      image: '1 + 3 + 5 + 7 = 16 = 4². How often can you subtract odd numbers from 16? 4 times – so √16 = 4.',
      more: 'For every further digit the remainder is [[shift|shifted]] by two places and the game repeats. Not a single multiplication needed.',
      see: ['root', 'shift'],
    },
  },
  binary: {
    de: {
      term: 'Binärsystem',
      short: 'Zahlen nur aus 0 und 1 – jede Stelle ist doppelt so viel wert wie die rechts daneben.',
      image: 'Eine Reihe Lichtschalter: an oder aus.',
      more: 'Auch im HP steckt binäre Elektronik: Jede Dezimalziffer wird aus 4 Bit zusammengesetzt ([[bcd|BCD]]). So kann er dezimal rechnen und braucht keine Umrechnung zwischen Tastatur, Rechenwerk und Anzeige.',
      see: ['bcd'],
    },
    en: {
      term: 'Binary system',
      short: 'Numbers made of 0 and 1 only – each digit is worth twice the one to its right.',
      image: 'A row of light switches: on or off.',
      more: 'The HP’s electronics are binary too: every decimal digit is built from 4 bits ([[bcd|BCD]]). That lets it compute in decimal without converting between keyboard, arithmetic unit and display.',
      see: ['bcd'],
    },
  },
  gain: {
    de: {
      term: 'Verlängerung K',
      short: 'Jede CORDIC-Drehung macht den Zeiger ein kleines bisschen länger.',
      image: 'Als würde der Uhrzeiger bei jedem Weiterstellen minimal wachsen.',
      more: 'Beim HP stört das nicht: Am Ende rechnet er Y ÷ X, und dabei kürzt sich die Verlängerung heraus – genau wie beim Bruch 6/4 = 3/2.',
      see: ['rotation'],
    },
    en: {
      term: 'Gain K',
      short: 'Every CORDIC rotation makes the pointer a tiny bit longer.',
      image: 'As if the clock hand grew a little every time you move it on.',
      more: 'On the HP this does no harm: at the end it computes Y ÷ X, and the growth cancels out – just like in the fraction 6/4 = 3/2.',
      see: ['rotation'],
    },
  },
  // ---------------------------------------------------------------- mathematics
  unitcircle: {
    viz: 'circle',
    de: {
      term: 'Einheitskreis',
      short: 'Ein Kreis mit Radius 1. Ein Punkt darauf im Winkel θ hat die Koordinaten (cos θ, sin θ).',
      image: 'Ein Riesenrad mit 1 m Radius: Wie hoch ist deine Gondel über der Achse? Das ist sin θ. Wie weit ist sie seitlich von der Mitte entfernt? Das ist cos θ.',
      more: 'So gelten sin und cos für jeden Winkel, nicht nur im Dreieck bis 90°. tan θ = sin θ ÷ cos θ ist die Steigung des Zeigers – ablesbar an der senkrechten Linie bei x = 1. Genau diesen Zeiger dreht der Rechner bei [[cordic|CORDIC]].',
      see: ['trig', 'atan', 'radian', 'vector'],
    },
    en: {
      term: 'Unit circle',
      short: 'A circle with radius 1. A point on it at angle θ has the coordinates (cos θ, sin θ).',
      image: 'A Ferris wheel with a radius of 1 m: how high is your gondola above the axle? That is sin θ. How far is it to the side of the centre? That is cos θ.',
      more: 'This way sin and cos work for every angle, not just in triangles up to 90°. tan θ = sin θ ÷ cos θ is the slope of the pointer – you can read it off the vertical line at x = 1. This is exactly the pointer the calculator turns in [[cordic|CORDIC]].',
      see: ['trig', 'atan', 'radian', 'vector'],
    },
  },
  inverse: {
    de: {
      term: 'Umkehrfunktion',
      short: 'Sie macht eine Funktion rückgängig: Aus dem Ergebnis wird wieder die Eingabe.',
      image: 'Hin- und Rückweg: tan führt vom Winkel zur Steigung (tan 45° = 1), atan von der Steigung zurück zum Winkel (atan 1 = 45°).',
      more: 'Paare am Rechner: sin ↔ SIN⁻¹ (arcsin), cos ↔ COS⁻¹ (arccos), tan ↔ TAN⁻¹ ([[atan|atan]]), ln ↔ eˣ, log ↔ 10ˣ, x² ↔ √x. Darum liegen sie oft auf derselben Taste: einmal direkt, einmal mit Umschalttaste. Die hochgestellte −1 ist kein Exponent: SIN⁻¹ heißt „umgekehrt“, nicht „1 ÷ sin“.',
      see: ['atan', 'trig', 'log'],
    },
    en: {
      term: 'Inverse function',
      short: 'It undoes a function: from the result you get back to the input.',
      image: 'There and back again: tan leads from the angle to the slope (tan 45° = 1), atan from the slope back to the angle (atan 1 = 45°).',
      more: 'Pairs on the calculator: sin ↔ SIN⁻¹ (arcsin), cos ↔ COS⁻¹ (arccos), tan ↔ TAN⁻¹ ([[atan|atan]]), ln ↔ eˣ, log ↔ 10ˣ, x² ↔ √x. That is why they often share a key: once directly, once with a shift key. The raised −1 is not an exponent: SIN⁻¹ means “inverse”, not “1 ÷ sin”.',
      see: ['atan', 'trig', 'log'],
    },
  },
  power: {
    de: {
      term: 'Potenz und Exponent',
      short: '10³ heißt 10 · 10 · 10 = 1000. Die kleine Hochzahl (der Exponent) sagt, wie oft multipliziert wird.',
      image: 'Ein Blatt Papier falten: Jedes Falten verdoppelt die Dicke. Nach 5-mal Falten ist es 2⁵ = 32-mal so dick.',
      more: 'Negative Exponenten bedeuten Teilen: 10⁻² = 1/100 = 0,01. Ein Exponent ½ ist eine Wurzel: 2^½ = √2. Der Rechner berechnet yˣ über Logarithmen: yˣ = e^(x · ln y).',
      see: ['placevalue', 'log', 'exp', 'root'],
    },
    en: {
      term: 'Power and exponent',
      short: '10³ means 10 · 10 · 10 = 1000. The small raised number (the exponent) tells how often to multiply.',
      image: 'Folding a sheet of paper: each fold doubles the thickness. After 5 folds it is 2⁵ = 32 times as thick.',
      more: 'Negative exponents mean dividing: 10⁻² = 1/100 = 0.01. An exponent of ½ is a root: 2^½ = √2. The calculator computes yˣ via logarithms: yˣ = e^(x · ln y).',
      see: ['placevalue', 'log', 'exp', 'root'],
    },
  },
  euler: {
    de: {
      term: 'Eulersche Zahl e',
      short: 'e ≈ 2,718281828 – die Zahl, die beim gleichmäßigen, „stetigen“ Wachsen herauskommt.',
      image: '1 € mit 100 % Zinsen im Jahr: Einmal jährlich verzinst hast du 2 €. Monatlich verzinst (jeweils ein Zwölftel) etwa 2,61 €, täglich etwa 2,71 €. Je feiner, desto näher kommst du an e = 2,718… €.',
      more: 'ln ist der Logarithmus zur Basis e, eˣ die Potenz von e. Mit e werden viele Formeln für Wachstum und Zerfall besonders einfach. Benannt ist sie nach Leonhard Euler (18. Jahrhundert).',
      see: ['exp', 'log', 'power'],
    },
    en: {
      term: 'Euler’s number e',
      short: 'e ≈ 2.718281828 – the number you get from smooth, “continuous” growth.',
      image: '1 € at 100 % interest per year: credited once a year you have 2 €. Credited monthly (a twelfth each time) about 2.61 €, daily about 2.71 €. The finer, the closer you get to e = 2.718… €.',
      more: 'ln is the logarithm to base e, eˣ the power of e. With e many formulas for growth and decay become especially simple. It is named after Leonhard Euler (18th century).',
      see: ['exp', 'log', 'power'],
    },
  },
  pi: {
    de: {
      term: 'π (Pi)',
      short: 'π ≈ 3,141592654: So oft passt der Durchmesser in den Umfang eines Kreises.',
      image: 'Wickle eine Schnur einmal um eine Dose: Sie ist gut dreimal so lang, wie die Dose breit ist.',
      more: 'Ein halber Kreis ist im [[radian|Bogenmaß]] genau π, ein ganzer 2π. Der Rechner hat π als feste Konstante im [[rom|ROM]] gespeichert.',
      see: ['radian', 'unitcircle'],
    },
    en: {
      term: 'π (pi)',
      short: 'π ≈ 3.141592654: how often the diameter fits around the circumference of a circle.',
      image: 'Wrap a string once around a can: it is a bit more than three times as long as the can is wide.',
      more: 'Half a circle is exactly π in [[radian|radians]], a full one 2π. The calculator keeps π as a fixed constant in its [[rom|ROM]].',
      see: ['radian', 'unitcircle'],
    },
  },
  root: {
    de: {
      term: 'Quadratwurzel √',
      short: '√x ist die Zahl, die mit sich selbst malgenommen x ergibt: √16 = 4, weil 4 · 4 = 16.',
      image: 'Ein quadratischer Garten mit 16 m² Fläche hat 4 m lange Seiten.',
      more: '√2 ≈ 1,414213562 geht nie auf – der Rechner liefert die ersten 10 Stellen. Wie er das ohne Multiplizieren schafft, steht bei [[sqrtdigits|Wurzel Ziffer für Ziffer]].',
      see: ['sqrtdigits', 'power'],
    },
    en: {
      term: 'Square root √',
      short: '√x is the number that gives x when multiplied by itself: √16 = 4 because 4 · 4 = 16.',
      image: 'A square garden with an area of 16 m² has sides 4 m long.',
      more: '√2 ≈ 1.414213562 never ends – the calculator delivers the first 10 digits. How it manages without multiplying is explained under [[sqrtdigits|square root digit by digit]].',
      see: ['sqrtdigits', 'power'],
    },
  },
  placevalue: {
    de: {
      term: 'Stellenwert und Zehnerpotenzen',
      short: 'In 352 ist die 3 dreihundert wert: Jede Stelle ist zehnmal so viel wert wie die rechts daneben.',
      image: 'Ein Kilometerzähler im Auto: Wenn rechts die 9 zur 0 wird, rückt die nächste Stelle eins weiter.',
      more: 'Darum ist ×10 oder ÷10 so leicht: Alle Ziffern rücken nur eine Stelle weiter ([[shift|Verschieben]]). Auf diesem Trick baut der ganze Rechner auf. Zehnerpotenzen schreiben die Stellen kurz: 1000 = 10³, 0,01 = 10⁻².',
      see: ['shift', 'power', 'mantissa', 'bcd'],
    },
    en: {
      term: 'Place value and powers of ten',
      short: 'In 352 the 3 is worth three hundred: every digit is worth ten times the one to its right.',
      image: 'A car’s odometer: when the 9 on the right turns to 0, the next digit moves on by one.',
      more: 'That is why ×10 or ÷10 is so easy: all digits just move one place ([[shift|shifting]]). The whole calculator is built on this trick. Powers of ten write the places briefly: 1000 = 10³, 0.01 = 10⁻².',
      see: ['shift', 'power', 'mantissa', 'bcd'],
    },
  },
  sigdigits: {
    de: {
      term: 'Signifikante Stellen und Runden',
      short: 'Die Ziffern einer Zahl, die wirklich etwas aussagen – führende Nullen zählen nicht. 0,004560 hat vier davon.',
      image: 'Eine Küchenwaage, die auf 1 g genau wiegt: „1234 g“ hat 4 signifikante Stellen. Mehr weiß die Waage nicht.',
      more: 'Der HP rechnet und speichert 10 signifikante Stellen. Was dahinter kommt, wird gerundet: ab 5 auf, sonst ab. Deshalb kann die letzte Stelle nach langen Rechnungen um 1 danebenliegen – das gilt für jeden Taschenrechner.',
      see: ['mantissa', 'approx'],
    },
    en: {
      term: 'Significant digits and rounding',
      short: 'The digits of a number that actually carry information – leading zeros don’t count. 0.004560 has four.',
      image: 'A kitchen scale that weighs to 1 g: “1234 g” has 4 significant digits. The scale knows no more than that.',
      more: 'The HP computes and stores 10 significant digits. Whatever comes after is rounded: 5 and up rounds up, otherwise down. So after long calculations the last digit can be off by 1 – true for every calculator.',
      see: ['mantissa', 'approx'],
    },
  },
  approx: {
    de: {
      term: 'Näherung und Iteration',
      short: 'Sich Schritt für Schritt an das Ergebnis heranarbeiten, statt es auf einmal auszurechnen.',
      image: 'Topfschlagen: „wärmer, kälter“ – mit jedem Hinweis kommst du näher.',
      more: 'sin, ln oder √ lassen sich nicht mit endlich vielen Grundrechnungen exakt ausrechnen. Der Rechner wiederholt deshalb einfache Schritte (Iteration, von lateinisch iterare = wiederholen), bis alle 10 Stellen stimmen. Wie schnell das geht, zeigt die [[convergence|Konvergenz]].',
      see: ['convergence', 'cordic', 'residual'],
    },
    en: {
      term: 'Approximation and iteration',
      short: 'Working your way towards the result step by step instead of computing it all at once.',
      image: 'Hot and cold: “warmer, colder” – every hint brings you closer.',
      more: 'sin, ln or √ cannot be computed exactly with a finite number of basic operations. So the calculator repeats simple steps (iteration, from Latin iterare = to repeat) until all 10 digits are right. How fast that goes is shown by the [[convergence|convergence]].',
      see: ['convergence', 'cordic', 'residual'],
    },
  },
  factorial: {
    de: {
      term: 'Fakultät n!',
      short: 'n! ist das Produkt aller Zahlen von 1 bis n: 5! = 1 · 2 · 3 · 4 · 5 = 120.',
      image: 'Auf wie viele Arten können sich 5 Leute in eine Reihe stellen? Für den ersten Platz gibt es 5 Kandidaten, für den zweiten 4 … zusammen 5! = 120.',
      more: 'Fakultäten wachsen rasend schnell: 69! ≈ 1,7 × 10⁹⁸ ist die größte, die der Rechner noch anzeigen kann – 70! wäre schon größer als 10¹⁰⁰.',
      see: ['power'],
    },
    en: {
      term: 'Factorial n!',
      short: 'n! is the product of all numbers from 1 to n: 5! = 1 · 2 · 3 · 4 · 5 = 120.',
      image: 'In how many ways can 5 people line up? There are 5 candidates for the first place, 4 for the second … together 5! = 120.',
      more: 'Factorials grow incredibly fast: 69! ≈ 1.7 × 10⁹⁸ is the largest the calculator can still display – 70! would already exceed 10¹⁰⁰.',
      see: ['power'],
    },
  },
  stats: {
    de: {
      term: 'Mittelwert und Standardabweichung',
      short: 'Der Mittelwert x̄ ist der Durchschnitt. Die Standardabweichung s sagt, wie weit die Werte typischerweise davon abweichen.',
      image: 'Zwei Klassen haben im Schnitt die Note 3. In der einen haben fast alle eine 3 (kleines s), in der anderen gibt es viele Einser und Fünfer (großes s).',
      more: 'Σ+ sammelt dafür nur laufende Summen: die Anzahl n, Σx und Σx². Daraus folgt x̄ = Σx ÷ n und s = √((n·Σx² − (Σx)²) ÷ (n·(n−1))). Die einzelnen Werte muss der Rechner gar nicht speichern.',
      see: ['regression', 'root'],
    },
    en: {
      term: 'Mean and standard deviation',
      short: 'The mean x̄ is the average. The standard deviation s tells how far the values typically differ from it.',
      image: 'Two classes both have an average grade of C. In one almost everyone got a C (small s), in the other there are lots of A’s and E’s (large s).',
      more: 'For this Σ+ only collects running sums: the count n, Σx and Σx². From them x̄ = Σx ÷ n and s = √((n·Σx² − (Σx)²) ÷ (n·(n−1))). The calculator doesn’t need to store the individual values at all.',
      see: ['regression', 'root'],
    },
  },
  regression: {
    de: {
      term: 'Ausgleichsgerade (lineare Regression)',
      short: 'Die Gerade y = a + b·x, die am besten durch eine Punktwolke passt.',
      image: 'Körpergröße und Schuhgröße in der Klasse: Die Punkte liegen nicht genau auf einer Linie, aber ungefähr. Die Ausgleichsgerade ist das Lineal, das am besten dazu passt.',
      more: '„Am besten“ heißt: Die Summe der quadrierten senkrechten Abstände ist so klein wie möglich (Methode der kleinsten Quadrate, Legendre und Gauß um 1800). Beim HP-55 liefert L.R. den Achsenabschnitt a und die Steigung b, ŷ schätzt y für ein neues x.',
      see: ['stats'],
    },
    en: {
      term: 'Best-fit line (linear regression)',
      short: 'The line y = a + b·x that fits a cloud of points best.',
      image: 'Height and shoe size in a class: the points don’t lie exactly on a line, but roughly. The best-fit line is the ruler that matches them best.',
      more: '“Best” means: the sum of the squared vertical distances is as small as possible (method of least squares, Legendre and Gauss around 1800). On the HP-55, L.R. gives the intercept a and the slope b, and ŷ estimates y for a new x.',
      see: ['stats'],
    },
  },
};

/** Groups for the glossary index – mathematics first, because it is needed first. */
export const GLOSSARY_GROUPS = {
  math: ['trig', 'unitcircle', 'atan', 'inverse', 'radian', 'pi', 'quadrant', 'vector', 'power', 'placevalue', 'root', 'log', 'exp', 'euler', 'mantissa', 'sigdigits', 'approx', 'factorial', 'stats', 'regression'],
  tech: ['bcd', 'binary', 'register', 'shift', 'rom', 'cordic', 'pseudodiv', 'pseudomul', 'decade', 'rotation', 'vectoring', 'gain', 'residual', 'convergence', 'sqrtdigits'],
  use: ['rpn', 'stack', 'enter'],
};

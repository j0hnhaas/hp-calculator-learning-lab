# hp-calculator-learning-lab

**How calculators calculate – an interactive learning lab based on the HP-35, HP-45 and HP-55 (1972–1975), with authentic decimal CORDIC algorithms and a step-by-step look inside.**
*Wie Taschenrechner rechnen – eine interaktive Lernumgebung am Beispiel von HP-35, HP-45 und HP-55 (1972–1975), mit originalgetreuen dezimalen CORDIC-Algorithmen und einem Blick ins Innere, Schritt für Schritt.*

**Live:** https://j0hnhaas.github.io/hp-calculator-learning-lab/ · Schwesterprojekt / sister project: [ti30-learning-lab](https://github.com/j0hnhaas/ti30-learning-lab)

[Deutsch](#deutsch) · [English](#english)

---

## Deutsch

Die frühen wissenschaftlichen Rechner von HP hatten keinen Multiplizierer. Sie rechneten in [BCD](https://de.wikipedia.org/wiki/BCD-Code) (eine Dezimalziffer pro Halbbyte) und konnten nur Ziffern **verschieben** und **addieren**. Trotzdem lieferten sie sin, ln oder eˣ auf 10 Stellen genau. Dieses Projekt simuliert drei dieser Rechner und zeigt im Labor **„So rechnet er“**, wie sie das machen.

### Drei Rechner: HP-35, HP-45 und HP-55

Ein Schiebeschalter mit drei Stellungen auf der Silberleiste wechselt zwischen dem **HP-35** (1972), dem **HP-45** (1973) und dem **HP-55** (1975). Alle drei nutzen dieselbe dezimale CORDIC-Familie. Beim Umschalten wird der Rechner zurückgesetzt, als würde man das andere Gerät in die Hand nehmen. Die Wahl bleibt gespeichert.

| | HP-35 | HP-45 | HP-55 |
|---|---|---|---|
| Umschalttasten | keine, Vorsatztaste `arc` | goldene Shift-Taste | goldene `f`- und blaue `g`-Taste |
| Inverse Winkelfunktionen | `arc` SIN usw. | Gold SIN usw. | `g` SIN usw. (`f` für SIN selbst) |
| Winkelmodus | nur Grad | DEG / RAD / GRD | DEG / RAD / GRD |
| Potenz | `xʸ`: Exponent ENTER Basis xʸ | `yˣ`: Basis ENTER Exponent yˣ | `yˣ`: Basis ENTER Exponent yˣ |
| Speicher | ein Register (STO/RCL) | R1–R9 mit Registerarithmetik, R9 dient Trig-Funktionen als Arbeitsregister | R0–R9 und R.0–R.9 |
| Anzeige | automatisch: fest für 10⁻² ≤ \|x\| < 10¹⁰, sonst wissenschaftlich | FIX n / SCI n | FIX n / SCI n |
| Fehler | Anzeige blinkt | „Error“ | „Error“ |
| Extras | π, CLR | LAST x, →P/→R, Statistik (Σ+, Σ−, x̄, s), →D.MS, %, Δ%, n!, Umrechnungskonstanten | LAST x, →P/→R, 16 echte Umrechnungen, Statistik für Wertepaare mit linearer Regression (L.R., ŷ), H.MS±, n! |

Die Programmiertasten des HP-55 (R/S, SST, BST, GTO, x≤y, x=y) sind vorhanden, aber noch ohne Funktion (siehe Roadmap).

### Lernhilfen

- **🧭 Lernpfad:** Zehn Kapitel vom Rechenschieber bis in den Chip: ① 1972: Rechnen ohne Taschenrechner ② Bedienen mit RPN ③ Wie Zahlen im Chip wohnen ④ Plus, Mal, Geteilt – nur mit Addieren ⑤ Wurzel Ziffer für Ziffer ⑥ sin, cos, tan und atan ⑦ CORDIC ⑧ Wachsen mit Zinsen: e, eˣ, ln ⑨ Wie genau ist genau? ⑩ Was steckt im Gehäuse – und was kam danach? Jedes Kapitel hat ein Ziel, kurze Karten (je nach Niveau mehr oder weniger), einen Auftrag am Rechner oder im Labor, den die App erkennt, einen Merksatz und ein Quiz mit 5 Fragen samt Erklärung. Ab 3 richtigen Antworten gibt es den Haken; alle Kapitel sind frei wählbar, der Fortschritt bleibt gespeichert. Neue Besucher werden direkt zu Kapitel 1 eingeladen. Inhalte in `js/path/chapters.js`.
- **RPN in einer Minute:** Vier kurze Karten erklären, wie man ohne =-Taste rechnet. Danach folgen drei Übungen direkt am Rechner, der richtige Lösungen erkennt. Beim ersten Besuch erscheint dazu ein Hinweis.
- **Stapel live:** Unter dem Rechner ist der Stack als Stapel T–Z–Y–X zu sehen. Geänderte Werte leuchten kurz auf.
- **Ein Niveau für die ganze App:** In der Kopfzeile wählst du 🎓 **Einsteiger**, **Fortgeschritten** oder **Profi**. Die Wahl gilt überall: im Labor und im Glossar (Einsteiger sehen zuerst die Kurzfassung, ab Fortgeschritten ist die Vertiefung gleich aufgeklappt).
  - **Einsteiger** (Standard): Die Rechnung wird in 4 bis 11 Schritten erzählt. Winkel werden mit „Münzen“ bezahlt (45°, 5,71°, 0,573° …), Logarithmen über Zinsen erklärt (100 %, 10 %, 1 % …). Dazu kommen Merksätze und eine Münz-Grafik. Im Modus „Mitraten“ fragt das Labor vor jeder großen Münze, wie oft sie passt.
  - **Fortgeschritten:** alle Mikroschritte mit Konvergenz-Plot und Konstantentabelle
  - **Profi:** zusätzlich die BCD-Register
- **Tastenhilfe:** Mit „? Tasten“ werden Tasten erklärt statt ausgeführt. Für jede Taste und jede Umschaltfunktion aller drei Modelle gibt es eine Karte mit Erklärung, Tastenfolge und Stapel vorher/nachher. Bei Rechenfunktionen führt ein Knopf direkt ins Labor.
- **Baukasten:** „Alles aus 4 Bausteinen“ (Addieren, Verschieben, Zählen, Vergleichen) mit einer live berechneten Kostentabelle: + kostet 1 Addition, × 9, ÷ 58, sin 30° rund 190. Das Labor zeigt oben, was die letzte Rechnung gekostet hat.
- **Beispielleiter:** Neun Beispiele vom Einfachen zum Schwierigen: 1,5 + 0,25 → 12 × 34 → 22 ÷ 7 → √2 → SIN 30° → TAN⁻¹ 1 → TAN 1 rad → eˣ 2 → ln 7. Jedes hat einen Satz dazu, was es zeigt, und ein Knopf führt zum nächsten.
- **Glossar:** Fachbegriffe sind gestrichelt unterstrichen und öffnen eine Erklärung. Sie besteht aus einem Satz, einem Bild aus dem Alltag, einer Vertiefung zum Aufklappen und Querverweisen. Das Glossar umfasst 38 Begriffe auf Deutsch und Englisch in drei Gruppen: Mathematik (Winkelfunktionen, Einheitskreis, atan, Umkehrfunktion, Bogenmaß, π, Potenz, Stellenwert, Wurzel, Logarithmus, e, signifikante Stellen, Näherung, Fakultät, Statistik, Regression …), Technik im Rechner und Bedienung. „📖 Alle Begriffe“ zeigt die Übersicht. Daten in `js/glossary.js`.
- **Einheitskreis zum Anfassen:** Bei sin/cos/tan, Einheitskreis und atan lässt sich ein Punkt auf dem Kreis ziehen. sin, cos und tan werden farbig als Höhe, Breite und Steigung gezeigt, dazu der Weg zurück mit atan.

### Das Labor „So rechnet er“

Jede Rechnung hinterlässt eine Spur aller Mikroschritte. Das Labor zeigt dazu:
- die Phasen: Reduktion → Pseudo-Division → Startwert → Pseudo-Multiplikation → Ergebnis
- die BCD-Register, wobei geänderte Ziffern markiert und die gerade verschobene Stelle unterstrichen ist
- die ROM-Konstantentabelle mit den Zählern qⱼ
- die Vektordarstellung mit einem Zoom, der pro Dekade ×10 vergrößert, für tan/atan
- eine Zahlenstrahl-Darstellung für ln und eˣ
- die Quadratwurzel Ziffer für Ziffer, durch Abziehen ungerader Zahlen
- einen **Konvergenz-Plot**, der für jeden Mikroschritt zeigt, wie viele Stellen schon stimmen. In der Pseudo-Division kommt etwa eine Stelle pro Dekade dazu. Die Pseudo-Multiplikation baut das Ergebnis mit den kleinsten Schritten zuerst auf und ist deshalb erst ganz am Ende genau. Ein Klick in den Plot springt zum Schritt.
- eine **eigene Eingabe**: Funktion, Wert und Winkelmodus wählen und die Rechnung direkt im Labor ansehen
- zwei aufklappbare Kästen: „Was passiert hier?“ in Alltagssprache und „Ein bisschen Geschichte“ (Volder 1959, Meggitt 1962, HP-35 1972)

### Grundrechenarten und Rezepte

Auch + − × ÷ rechnet die Simulation wie die echten Rechner, Ziffer für Ziffer in Dezimalziffern und nur mit Addieren und Verschieben:
- **+ und −:** Komma ausrichten (die kleinere Zahl verschieben), dann Stelle für Stelle mit Übertrag bzw. Borgen, normalisieren, auf 10 Stellen runden (kaufmännisch).
- **×:** schriftlich, also für jede Ziffer des zweiten Faktors entsprechend oft addieren und verschieben.
- **÷:** schriftlich, also abziehen, so oft es geht, und zählen. Das ist dieselbe Idee wie die Pseudo-Division.

Weil dezimal gerechnet wird, ergibt 0,1 + 0,2 genau 0,3.

Die Spezialtasten sind **Rezepte** aus diesen Bausteinen, und das Labor zeigt sie Schritt für Schritt:
- **n!** besteht aus lauter ×.
- **Δ%** rechnet −, dann ÷, dann × 100. Das × 100 ist nur ein Verschieben um zwei Stellen.
- **→D.MS** nimmt zweimal × 60, **D.MS→** rechnet ÷ 60, ÷ 3600 und +. **H.MS±** (HP-55) wandelt beide Zeiten um, addiert bzw. subtrahiert und wandelt zurück.
- **Σ+ und Σ−** führen Buch: beim HP-45 über n, Σx², Σx und Σy, beim HP-55 über n, Σx, Σx², Σy, Σy² und Σxy.
- **x̄ und s** ergeben sich aus ÷, ×, − und √. **L.R.** und **ŷ** (HP-55) brauchen rund ein Dutzend Grundrechnungen.
- **Umrechnungen:** Die Tasten cm/in, kg/lb und ltr/gal des HP-45 legen nur eine feste Zahl aus dem ROM auf den Stapel. Das Labor erklärt, woher sie kommt: 1 Zoll ist seit 1959 genau 2,54 cm, 1 Pfund genau 0,45359237 kg, und die Gallone wird aus 231 Kubikzoll in BCD nachgerechnet. Die 16 Umrechnungen des HP-55 rechnen dagegen selbst, mit einem × oder ÷ (bei °F/°C zusätzlich ± 32).

### Die Algorithmen (dezimales CORDIC nach Volder/Meggitt)

| Funktion | Pseudo-Division | Pseudo-Multiplikation |
|---|---|---|
| tan, sin, cos | θ = Σ qⱼ·atan(10⁻ʲ) + r | Vektor (1, r) wird qⱼ-mal gedreht: X′ = X − Y·10⁻ʲ, Y′ = Y + X·10⁻ʲ |
| atan, asin, acos, →P | Vektor zurückdrehen, solange Y ≥ 0 | θ = r + Σ qⱼ·atan(10⁻ʲ) |
| ln, log | M = Π (1+10⁻ʲ)^qⱼ · (1+r) | ln M = r + Σ qⱼ·ln(1+10⁻ʲ) |
| eˣ, 10ˣ, yˣ | r = Σ qⱼ·ln(1+10⁻ʲ) + ρ | P = (1+ρ) · Π (1+10⁻ʲ)^qⱼ |
| √x | – | Ziffer für Ziffer: ungerade Zahlen 20r+1, 20r+3, … abziehen |

Multiplizieren mit 10⁻ʲ ist in BCD nur ein Verschieben um j Stellen. Eine echte Division gibt es nur ganz am Ende, zum Beispiel tan = Y/X.

**Algorithmisch getreu, nicht bitgenau:**
- Die Simulation verwendet dieselben Verfahren wie die HP-Rechner, führt aber nicht den Original-ROM-Code aus. Die letzte Stelle kann daher vom Original abweichen.
- Intern wird mit 20 Nachkommastellen gerechnet (BigInt-Festkomma). Angezeigt und gespeichert werden wie beim Original 10 signifikante Stellen.
- Es gibt 7 Dekaden für Trigonometrie und 9 für Logarithmen. So bleibt der Restfehler unter der Rundungsgrenze.

### Authentische Details

- rote 7-Segment-LED-Anzeige mit Lupenlinsen, bei der der Dezimalpunkt eine eigene Stelle belegt
- HP-45 und HP-55 starten in FIX 2, sehr kleine Zahlen werden in FIX als 0 angezeigt
- die Anzeige wird dunkel, solange der Rechner rechnet, mit einer Dauer, die sich an der Zahl der Mikroschritte orientiert
- beim HP-45 überschreiben Trig-Funktionen R9
- Aus- und Einschalten löscht alles, weil keines der Geräte einen Dauerspeicher hatte

### Bedienung

- **RPN:** Erst die Zahl eingeben, dann ENTER ↑, dann die zweite Zahl, dann die Operation. Beispiel: `2 ENTER 3 +`.
- **Umschalttasten:** Die goldene Taste (HP-45) bzw. `f` (HP-55) wählt die goldene Beschriftung über der nächsten Taste, `g` (HP-55) die blaue darunter. Beim HP-35 wirkt `arc` nur auf die nächste Winkelfunktion.
- **Statusleiste:** Die Leiste unter dem Rechner zeigt Umschaltzustand, Winkelmodus, Anzeigeformat und Stack. Sie ist eine Lernhilfe und gehört nicht zum Original.
- **PC-Tastatur:**
  - Ziffern, `.`, `+ − * /`, Enter
  - `f` für Gold bzw. `f`, `g` für `g` (HP-55), `a` für `arc` (HP-35)
  - `n` für CHS, `e` für EEX, `x` für x⇄y, `r` für R↓, Backspace für CLx
  - HP-35 und HP-45: `s c t` für SIN, COS, TAN, `l` für ln, `q` für x² (HP-45) bzw. √x (HP-35)
- **Labor:** Auto-Play, Einzelschritt, Schieberegler und Tempo. Ein Klick auf eine Phase springt dorthin.

### Starten und Entwickeln

Es gibt keinen Build-Schritt und keine Abhängigkeiten, nur ES-Module.

```bash
python3 -m http.server 8045      # dann http://localhost:8045 öffnen
npm test                          # Tests (node --test)
```

**GitHub Pages:** Unter *Settings → Pages → Deploy from a branch* den Branch `main` und den Ordner `/ (root)` wählen.
Wenn du Dateien änderst, erhöhe `VERSION` in `sw.js`. Sonst liefert der Service Worker weiter die alte Version aus.

### Projektstruktur

```
index.html, css/style.css, manifest.webmanifest, sw.js, icons/, images/
js/engine/   decimal.js (BCD-Festkomma, Wurzel), constants.js (ROM-Tabellen),
             cordic.js (tan/atan/ln/exp-Kerne mit Trace), functions.js,
             arith.js (+ − × ÷ in BCD), extra.js (Rezepte: n!, Statistik, Umrechnungen …),
             cost.js (Additionen zählen), convergence.js (richtige Stellen pro Schritt)
js/calc/     hp45.js (RPN-Logik aller drei Modelle, Anzeigeformat), keys.js (Tastaturen)
js/ui/       display.js (LED), calculator.js, lab.js (Labor),
             story.js, story-arith.js, story-recipe.js (Erzählungen der Stufe „Einsteiger“),
             rpn-guide.js, keyhelp-ui.js, blocks.js (Baukasten), sheet.js (Dialoge, Glossar),
             unit-circle.js (Einheitskreis)
js/path/     chapters.js (Lernpfad: Kapitel, Aufträge, Quiz)
js/ui/path.js (Lernpfad-Oberfläche)
js/path/     chapters.js (learning path: chapters, tasks, quizzes)
js/ui/path.js (learning path UI)
js/i18n.js, js/glossary.js, js/keyhelp.js, js/level.js, js/app.js, tests/
```

### Roadmap

- [x] HP-45: Rechner, dezimales CORDIC mit Trace, Labor mit Vektor- und Zoom-Ansicht, PWA, DE/EN
- [x] Konvergenz-Plot und eigene Eingabe im Labor
- [x] HP-35 als zweites Modell
- [x] Lernhilfen: RPN-Anleitung mit Übungen, Stapel live, drei Stufen, Glossar, Tastenhilfe
- [x] Grundrechenarten in BCD, Baukasten mit Kostenzähler, Rezepte für Spezial- und Umrechnungstasten
- [x] HP-55 Teil 1: Tastatur mit f/g, Umrechnungen, Statistik mit linearer Regression
- [x] Mathe-Grundlagen: Mathe-Glossar, Einheitskreis, Beispielleiter, ein Niveau für die ganze App
- [x] Lernpfad mit 10 Kapiteln (Geschichte, RPN, BCD, Grundrechnen, Wurzel, Winkel, CORDIC, Logarithmen, Genauigkeit, Technik), Aufträgen am Rechner und je 5 Quizfragen
- [ ] HP-55 Teil 2: Programmierung (49 Programmschritte, PRGM/RUN) und Laborkapitel „So läuft ein Programm“
- [ ] HP-55 Teil 3: Stoppuhr (TIMER)

Die Tastenbelegungen wurden anhand von Museumsbeschreibungen (u. a. Smithsonian NMAH) und HP-Kurzreferenzen rekonstruiert. Hinweise anhand eines Originalgeräts sind willkommen.

---

## English

HP's early scientific calculators had no hardware multiplier. They computed in [BCD](https://en.wikipedia.org/wiki/Binary-coded_decimal) (one decimal digit per nibble) and could only **shift** digits and **add**, yet they delivered sin, ln or eˣ to 10 digits. This project simulates three of these calculators, and its lab **“How it calculates”** shows how they do it.

### Three calculators: HP-35, HP-45 and HP-55

A three-position slide switch on the silver band selects the **HP-35** (1972), the **HP-45** (1973) or the **HP-55** (1975). All three use the same decimal CORDIC family. Switching resets the calculator, as if you picked up the other device. The choice is remembered.

| | HP-35 | HP-45 | HP-55 |
|---|---|---|---|
| Shift keys | none, prefix key `arc` | gold shift key | gold `f` and blue `g` key |
| Inverse trig | `arc` SIN etc. | gold SIN etc. | `g` SIN etc. (`f` for SIN itself) |
| Angle mode | degrees only | DEG / RAD / GRD | DEG / RAD / GRD |
| Power | `xʸ`: exponent ENTER base xʸ | `yˣ`: base ENTER exponent yˣ | `yˣ`: base ENTER exponent yˣ |
| Memory | one register (STO/RCL) | R1–R9 with register arithmetic, R9 is the scratch register of the trig functions | R0–R9 and R.0–R.9 |
| Display | automatic: fixed for 10⁻² ≤ \|x\| < 10¹⁰, otherwise scientific | FIX n / SCI n | FIX n / SCI n |
| Error | display blinks | “Error” | “Error” |
| Extras | π, CLR | LAST x, →P/→R, statistics (Σ+, Σ−, x̄, s), →D.MS, %, Δ%, n!, unit constants | LAST x, →P/→R, 16 real unit conversions, statistics for pairs with linear regression (L.R., ŷ), H.MS±, n! |

The HP-55's programming keys (R/S, SST, BST, GTO, x≤y, x=y) are present but not yet functional (see roadmap).

### Learning aids

- **🧭 Learning path:** ten chapters from the slide rule into the chip: ① 1972: calculating without a calculator ② operating with RPN ③ how numbers live in the chip ④ plus, times, divide – just by adding ⑤ square roots digit by digit ⑥ sin, cos, tan and atan ⑦ CORDIC ⑧ growing with interest: e, eˣ, ln ⑨ how accurate is accurate? ⑩ what is inside – and what came next? Each chapter has a goal, short cards (more or fewer depending on the level), a task on the calculator or in the lab that the app recognises, a key takeaway and a 5-question quiz with explanations. 3 correct answers earn the tick; every chapter can be picked freely and progress is saved. New visitors are invited straight to chapter 1. Content in `js/path/chapters.js`.
- **RPN in one minute:** four short cards explain how to calculate without an = key, followed by three exercises right on the calculator, which recognises correct solutions. First-time visitors get a hint.
- **Live stack:** below the calculator the stack is shown as a pile T–Z–Y–X. Changed values light up briefly.
- **One level for the whole app:** in the header you choose 🎓 **Beginner**, **Advanced** or **Expert**. The choice applies everywhere: in the lab and in the glossary (beginners see the short version first, from Advanced on the deep dive is already open).
  - **Beginner** (default): the calculation is told in 4 to 11 steps. Angles are paid with “coins” (45°, 5.71°, 0.573° …), logarithms are explained through interest (100 %, 10 %, 1 % …), with key takeaways and a coin graphic. In “guess along” mode the lab asks before each big coin how often it fits.
  - **Advanced:** all micro-steps with convergence plot and constant table
  - **Expert:** additionally the BCD registers
- **Key help:** with “? Keys” tapping a key explains it instead of executing it. Every key and every shifted function of all three models has a card with an explanation, key sequence and stack before/after. For calculations a button leads straight to the lab.
- **Building blocks:** “Everything from 4 building blocks” (add, shift, count, compare) with a live cost table: + costs 1 addition, × 9, ÷ 58, sin 30° about 190. The lab shows what the last calculation cost.
- **Example ladder:** nine examples from easy to hard: 1.5 + 0.25 → 12 × 34 → 22 ÷ 7 → √2 → SIN 30° → TAN⁻¹ 1 → TAN 1 rad → eˣ 2 → ln 7. Each comes with one sentence on what it shows, and a button leads to the next one.
- **Glossary:** technical terms are underlined with dashes and open an explanation: one sentence, an everyday picture, an expandable deep dive and cross-references. 38 terms in German and English in three groups: mathematics (trig functions, unit circle, atan, inverse function, radians, π, powers, place value, square root, logarithm, e, significant digits, approximation, factorial, statistics, regression …), technology inside the calculator, and operation. “📖 All terms” shows the overview. Data in `js/glossary.js`.
- **Hands-on unit circle:** for sin/cos/tan, the unit circle and atan you can drag a point around the circle. sin, cos and tan are shown in colour as height, width and slope, together with the way back via atan.

### The lab “How it calculates”

Every calculation leaves a trace of all its micro-steps. The lab shows:
- the phases: reduction → pseudo-division → starting value → pseudo-multiplication → result
- the BCD registers, with changed digits highlighted and the digit just shifted underlined
- the ROM constant table with the counters qⱼ
- a vector view with a zoom that magnifies ×10 per decade, for tan/atan
- a number-line view for ln and eˣ
- the square root digit by digit, by subtracting odd numbers
- a **convergence plot** of correct digits per micro-step. Pseudo-division gains about one digit per decade. Pseudo-multiplication builds the result with the smallest steps first and is only accurate at the very end. Clicking the plot jumps to that step.
- **your own input**: pick a function, value and angle mode and watch the calculation in the lab
- two expandable boxes: “What is going on?” in plain language and “A bit of history” (Volder 1959, Meggitt 1962, HP-35 1972)

### Basic arithmetic and recipes

The simulation also does + − × ÷ like the real calculators, digit by digit in decimal and only by adding and shifting:
- **+ and −:** align the decimal point (shift the smaller number), then digit by digit with carry or borrow, normalise, round to 10 digits (half up).
- **×:** long multiplication: for each digit of the second factor, add that many times and shift.
- **÷:** long division: subtract as often as possible and count. This is the same idea as pseudo-division.

Because the arithmetic is decimal, 0.1 + 0.2 is exactly 0.3.

The special keys are **recipes** made of these blocks, and the lab shows them step by step:
- **n!** is nothing but ×.
- **Δ%** does −, then ÷, then × 100. The × 100 is just a shift by two places.
- **→D.MS** takes × 60 twice, **D.MS→** does ÷ 60, ÷ 3600 and +. **H.MS±** (HP-55) converts both times, adds or subtracts and converts back.
- **Σ+ and Σ−** keep the books: on the HP-45 for n, Σx², Σx and Σy, on the HP-55 for n, Σx, Σx², Σy, Σy² and Σxy.
- **x̄ and s** come from ÷, ×, − and √. **L.R.** and **ŷ** (HP-55) take about a dozen basic operations.
- **Unit conversions:** the HP-45 keys cm/in, kg/lb and ltr/gal only put a fixed number from ROM on the stack. The lab explains where it comes from: since 1959 an inch is exactly 2.54 cm and a pound exactly 0.45359237 kg, and the gallon is recomputed in BCD from 231 cubic inches. The 16 conversions of the HP-55, by contrast, compute the result themselves with one × or ÷ (plus ± 32 for °F/°C).

### The algorithms (decimal CORDIC after Volder/Meggitt)

| Function | Pseudo-division | Pseudo-multiplication |
|---|---|---|
| tan, sin, cos | θ = Σ qⱼ·atan(10⁻ʲ) + r | vector (1, r) is rotated qⱼ times: X′ = X − Y·10⁻ʲ, Y′ = Y + X·10⁻ʲ |
| atan, asin, acos, →P | rotate the vector back while Y ≥ 0 | θ = r + Σ qⱼ·atan(10⁻ʲ) |
| ln, log | M = Π (1+10⁻ʲ)^qⱼ · (1+r) | ln M = r + Σ qⱼ·ln(1+10⁻ʲ) |
| eˣ, 10ˣ, yˣ | r = Σ qⱼ·ln(1+10⁻ʲ) + ρ | P = (1+ρ) · Π (1+10⁻ʲ)^qⱼ |
| √x | – | digit by digit: subtract the odd numbers 20r+1, 20r+3, … |

Multiplying by 10⁻ʲ is just a shift by j places in BCD. A real division only happens at the very end, e.g. tan = Y/X.

**Faithful to the algorithms, not bit-exact:**
- The simulation uses the same methods as the HP calculators but does not run the original ROM code, so the last digit may differ from the original.
- Internally it computes with 20 decimal places (BigInt fixed point). Like the original, it displays and stores 10 significant digits.
- It uses 7 decades for trigonometry and 9 for logarithms, which keeps the residual error below the rounding limit.

### Authentic details

- red 7-segment LED display with magnifying lenses, where the decimal point takes a digit of its own
- the HP-45 and HP-55 start in FIX 2, and very small numbers show as 0 in FIX
- the display goes dark while the calculator is busy, for a time based on the number of micro-steps
- on the HP-45 the trig functions overwrite R9
- switching off and on clears everything, as none of the devices had continuous memory

### Operation

- **RPN:** enter the number, then ENTER ↑, then the second number, then the operation. Example: `2 ENTER 3 +`.
- **Shift keys:** the gold key (HP-45) or `f` (HP-55) selects the gold label above the next key, `g` (HP-55) the blue one below it. On the HP-35, `arc` only affects the next trig function.
- **Status bar:** the bar below the calculator shows the shift state, angle mode, display format and stack. It is a learning aid and not part of the original.
- **PC keyboard:**
  - digits, `.`, `+ − * /`, Enter
  - `f` for gold or `f`, `g` for `g` (HP-55), `a` for `arc` (HP-35)
  - `n` for CHS, `e` for EEX, `x` for x⇄y, `r` for R↓, Backspace for CLx
  - HP-35 and HP-45: `s c t` for SIN, COS, TAN, `l` for ln, `q` for x² (HP-45) or √x (HP-35)
- **Lab:** auto-play, single step, slider and speed. Clicking a phase jumps there.

### Running and developing

There is no build step and there are no dependencies, only ES modules.

```bash
python3 -m http.server 8045      # then open http://localhost:8045
npm test                          # tests (node --test)
```

**GitHub Pages:** under *Settings → Pages → Deploy from a branch* choose branch `main` and folder `/ (root)`.
When you change files, bump `VERSION` in `sw.js`, otherwise the service worker keeps serving the old version.

### Project structure

```
index.html, css/style.css, manifest.webmanifest, sw.js, icons/, images/
js/engine/   decimal.js (BCD fixed point, square root), constants.js (ROM tables),
             cordic.js (tan/atan/ln/exp kernels with trace), functions.js,
             arith.js (+ − × ÷ in BCD), extra.js (recipes: n!, statistics, conversions …),
             cost.js (counting additions), convergence.js (correct digits per step)
js/calc/     hp45.js (RPN logic of all three models, display format), keys.js (keyboards)
js/ui/       display.js (LED), calculator.js, lab.js (lab),
             story.js, story-arith.js, story-recipe.js (stories of the “Beginner” level),
             rpn-guide.js, keyhelp-ui.js, blocks.js (building blocks), sheet.js (dialogs, glossary),
             unit-circle.js (unit circle)
js/i18n.js, js/glossary.js, js/keyhelp.js, js/level.js, js/app.js, tests/
```

### Roadmap

- [x] HP-45: calculator, decimal CORDIC with trace, lab with vector and zoom view, PWA, DE/EN
- [x] convergence plot and your own input in the lab
- [x] HP-35 as a second model
- [x] learning aids: RPN guide with exercises, live stack, three levels, glossary, key help
- [x] basic arithmetic in BCD, building blocks with cost counter, recipes for special and conversion keys
- [x] HP-55 part 1: keyboard with f/g, conversions, statistics with linear regression
- [x] maths basics: maths glossary, unit circle, example ladder, one level for the whole app
- [x] learning path with 10 chapters (history, RPN, BCD, basic arithmetic, square root, angles, CORDIC, logarithms, accuracy, technology), tasks on the calculator and 5 quiz questions each
- [ ] HP-55 part 2: programming (49 program steps, PRGM/RUN) and the lab chapter “How a program runs”
- [ ] HP-55 part 3: stopwatch (TIMER)

The key layouts were reconstructed from museum descriptions (including the Smithsonian NMAH) and HP quick references. Corrections from owners of an original are welcome.

---

### References

- J. E. Volder, *The CORDIC Trigonometric Computing Technique*, IRE Trans. Electronic Computers, 1959
- J. E. Meggitt, *Pseudo Division and Pseudo Multiplication Processes*, IBM Journal, 1962
- D. S. Cochran, *Algorithms and Accuracy in the HP-35*, Hewlett-Packard Journal, June 1972
- T. M. Whitney, F. Rodé, C. C. Tung, *The “Powerful Pocketful”: an Electronic Calculator Challenges the Slide Rule*, Hewlett-Packard Journal, June 1972
- Museum of HP Calculators (hpmuseum.org): HP-35, HP-45, HP-55 and classic series technology
- Smithsonian NMAH, object 1276228 (HP-45)

MIT License. HP and Hewlett-Packard are trademarks of HP Inc. This project is unaffiliated and uses no original ROM code or logos.

# hp45-cordic

**HP-45 calculator simulation (1973) with authentic decimal CORDIC algorithms – and a step-by-step look inside.**
*Simulation des HP-45 (1973) mit originalgetreuen dezimalen CORDIC-Algorithmen – und einem Blick ins Innere, Schritt für Schritt.*

[Deutsch](#deutsch) · [English](#english)

---

## Deutsch

Der HP-45 hatte keinen Multiplizierer. Er rechnete in BCD (eine Dezimalziffer pro Halbbyte) und konnte nur Ziffern **verschieben** und **addieren**. Trotzdem lieferte er sin, ln oder eˣ auf 10 Stellen genau. Dieses Projekt simuliert den Rechner und zeigt im Panel **„Blick ins Innere“**, wie er das macht.

### Lernhilfen

- **RPN in einer Minute:** vier kurze Karten erklären, wie man ohne =-Taste rechnet. Danach folgen drei Übungen direkt am Rechner, der richtige Lösungen erkennt. Beim ersten Besuch erscheint dazu ein Hinweis.
- **Stapel live:** Unter dem Rechner ist der Stack als Stapel T–Z–Y–X zu sehen. Geänderte Werte leuchten kurz auf.
- **Drei Stufen im Labor „So rechnet er“:**
  - **Einfach** (Standard): Die Rechnung wird in 4 bis 11 Schritten erzählt. Winkel werden mit „Münzen“ bezahlt (45°, 5,71°, 0,573° …), Logarithmen über Zinsen erklärt (100 %, 10 %, 1 % …). Dazu kommen Merksätze und eine Münz-Grafik. Im Modus „Mitraten“ fragt das Labor vor jeder großen Münze, wie oft sie passt.
  - **Detail:** alle Mikroschritte mit Konvergenz-Plot und Konstantentabelle
  - **Profi:** zusätzlich BCD-Register und der Vergleich mit binärem CORDIC
- **Glossar:** Fachbegriffe sind gestrichelt unterstrichen und öffnen eine Erklärung. Sie besteht aus einem Satz, einem Bild aus dem Alltag, einer Vertiefung zum Aufklappen und Querverweisen. Das Glossar umfasst 26 Begriffe auf Deutsch und Englisch, zu finden in `js/glossary.js`.

### Zwei Rechner: HP-35 und HP-45

Ein Schiebeschalter auf der Silberleiste wechselt zwischen dem **HP-35** (1972) und dem **HP-45** (1973). Beide nutzen dieselbe dezimale CORDIC-Familie. Beim Umschalten wird der Rechner zurückgesetzt, als würde man das andere Gerät in die Hand nehmen. Die Wahl bleibt gespeichert.

| | HP-35 | HP-45 |
|---|---|---|
| Inverse Winkelfunktionen | Vorsatztaste `arc` | goldene Shift-Taste |
| Winkelmodus | nur Grad | DEG / RAD / GRD |
| Potenz | `xʸ`: Exponent ENTER Basis xʸ | `yˣ`: Basis ENTER Exponent yˣ |
| Speicher | ein Register (STO/RCL) | R1–R9 mit Registerarithmetik |
| Anzeige | automatisch: fest für 10⁻² ≤ \|x\| < 10¹⁰, sonst wissenschaftlich | FIX n / SCI n |
| Fehler | Anzeige blinkt | „Error“ |
| Extras | π, CLR | LAST x, →P/→R, Statistik, D.MS, %, n!, Umrechnungen |

### Funktionen

- **Rechner:** alle 35 Tasten mit Gold-Shift. Dazu RPN-Stack mit 4 Registern, LAST x, Speicher R1–R9 mit Registerarithmetik, FIX/SCI, DEG/RAD/GRD, →P/→R, →D.MS, n!, %, Δ%, Statistik (Σ+, Σ−, x̄, s) und Umrechnungskonstanten.
- **Authentische Details:**
  - rote 7-Segment-LED-Anzeige mit Lupenlinsen, bei der der Dezimalpunkt eine eigene Stelle belegt
  - Start in FIX 2, sehr kleine Zahlen werden in FIX als 0 angezeigt
  - die Anzeige wird dunkel, solange der Rechner rechnet, mit einer Dauer, die sich an der Zahl der Mikroschritte orientiert
  - Trig-Funktionen benutzen R9 als Arbeitsregister
  - Aus- und Einschalten löscht alles, weil der HP-45 keinen Dauerspeicher hatte
- **Blick ins Innere:** Jede transzendente Funktion liefert eine Spur aller Mikroschritte. Das Labor zeigt dazu:
  - die Phasen: Reduktion → Pseudo-Division → Startwert → Pseudo-Multiplikation → Ergebnis
  - die BCD-Register, wobei geänderte Ziffern markiert und die gerade verschobene Stelle unterstrichen ist
  - die ROM-Konstantentabelle mit den Zählern qⱼ
  - die Vektordarstellung mit einem Zoom, der pro Dekade ×10 vergrößert, für tan/atan
  - eine Zahlenstrahl-Darstellung für ln und eˣ
  - die Quadratwurzel Ziffer für Ziffer, durch Abziehen ungerader Zahlen
  - einen **Konvergenz-Plot**, der für jeden Mikroschritt zeigt, wie viele Stellen schon stimmen. In der Pseudo-Division kommt etwa eine Stelle pro Dekade dazu. Die Pseudo-Multiplikation baut das Ergebnis mit den kleinsten Schritten zuerst auf und ist deshalb erst ganz am Ende genau. Ein Klick in den Plot springt zum Schritt.
  - eine **eigene Eingabe**: Funktion, Wert und Winkelmodus wählen und die Rechnung direkt im Labor ansehen
  - einen **Vergleich mit klassischem binärem CORDIC** für sin, cos, tan und atan:
    - Umschalter Dezimal ↔ Binär
    - binäre Register und die 36 Konstanten atan(2⁻ⁱ)
    - das Pendeln des Vektors um das Ziel
    - die Konvergenzkurve des anderen Verfahrens als Schatten
    - eine Vergleichstabelle (Mikroschritte, Additionen, Konstanten, Verstärkung K, Zahlenformat, Genauigkeit bei kleinen Winkeln)
- **PWA:** installierbar und offline nutzbar, Oberfläche auf Deutsch und Englisch.

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
- Die Simulation verwendet dieselben Verfahren wie der HP-45, führt aber nicht den Original-ROM-Code aus. Die letzte Stelle kann daher vom Original abweichen.
- Intern wird mit 20 Nachkommastellen gerechnet (BigInt-Festkomma). Angezeigt und gespeichert werden wie beim Original 10 signifikante Stellen.
- Es gibt 7 Dekaden für Trigonometrie und 9 für Logarithmen. So bleibt der Restfehler unter der Rundungsgrenze.

### Bedienung

- **RPN:** Erst die Zahl eingeben, dann ENTER ↑, dann die zweite Zahl, dann die Operation. Beispiel: `2 ENTER 3 +`.
- **Gold-Taste:** Sie wählt die goldene Funktion über der nächsten Taste. Die Leiste unter dem Rechner zeigt SHIFT, den Winkelmodus, das Anzeigeformat und den Stack. Diese Leiste ist eine Lernhilfe und gehört nicht zum Original.
- **PC-Tastatur:**
  - Ziffern, `.`, `+ − * /`, Enter
  - `f` für Gold, `n` für CHS, `e` für EEX
  - `s c t` für SIN, COS, TAN, `l` für ln, `q` für x², `x` für x⇄y, `r` für R↓
  - Backspace für CLx
- **Labor:** Auto-Play, Einzelschritt, Schieberegler und Tempo. Ein Klick auf eine Phase springt dorthin.

### Starten und Entwickeln

Es gibt keinen Build-Schritt und keine Abhängigkeiten, nur ES-Module.

```bash
python3 -m http.server 8045      # dann http://localhost:8045 öffnen
npm test                          # Engine- und Rechnertests (node --test)
```

**GitHub Pages:** Unter *Settings → Pages → Deploy from a branch* den Branch `main` und den Ordner `/ (root)` wählen.
Wenn du Dateien änderst, erhöhe `VERSION` in `sw.js`. Sonst liefert der Service Worker weiter die alte Version aus.

### Projektstruktur

```
index.html, css/style.css, manifest.webmanifest, sw.js, icons/
js/engine/   decimal.js (BCD-Festkomma, Wurzel), constants.js (ROM-Tabellen),
             cordic.js (tan/atan/ln/exp-Kerne mit Trace), functions.js,
             convergence.js (richtige Stellen pro Schritt),
             binary.js (klassisches binäres CORDIC zum Vergleich)
js/calc/     hp45.js (RPN, Anzeigeformat), keys.js (Tastatur)
js/ui/       display.js (LED), calculator.js, lab.js (Labor)
js/i18n.js, js/app.js, tests/
```

### Roadmap

- [x] Stufe 1: Rechner, dezimales CORDIC mit Trace, Step-by-Step-Labor, Vektor- und Zoom-Ansicht, PWA, DE/EN
- [x] Stufe 2: Konvergenz-Plot (richtige Stellen pro Schritt), eigene Eingabe im Labor
- [x] Stufe 3: Umschalter dezimales HP-Verfahren ↔ klassisches binäres CORDIC, Vergleich der Schrittzahlen

Die Tastenbelegung wurde anhand der Beschreibung des Smithsonian (NMAH) und der HP-Kurzreferenz rekonstruiert. Hinweise anhand eines Originalgeräts sind willkommen.

---

## English

The HP-45 had no hardware multiplier. It computed in BCD and could only **shift** digits and **add**, yet it delivered sin, ln or eˣ to 10 digits. This project simulates the calculator, and its **“Inside”** panel shows how it does that.

**Features**
- all 35 keys with gold shift, 4-level RPN stack, LAST x, R1–R9 with register arithmetic, FIX/SCI, DEG/RAD/GRD, polar/rectangular, D.MS, n!, %, Δ%, statistics and unit constants
- a red bubble-LED display that goes dark while the calculator is busy, with time based on the number of micro-steps
- a step-by-step lab:
  - BCD registers with changed digits highlighted
  - ROM constant table with counters qⱼ
  - vector view with a zoom that magnifies ×10 per decade
  - a number-line view for ln/eˣ
  - the square root computed digit by digit
  - a convergence plot of correct digits per micro-step: pseudo-division gains about one digit per decade, while pseudo-multiplication only reaches full precision at its last step
  - your own input: pick a function, value and angle mode
  - a comparison with classic binary CORDIC (sin, cos, tan, atan): a decimal/binary switch, binary registers, the vector oscillating around its target, a ghost of the other method's convergence curve and a comparison table
- installable offline PWA, German and English UI

**Accuracy:** The simulation is faithful to the algorithms, not bit-exact. It uses the same decimal pseudo-division and pseudo-multiplication as the HP-45 but does not run the original ROM microcode. It computes internally with 20 decimal places and rounds to 10 significant digits, like the original.

**Run:** `python3 -m http.server 8045`, test with `npm test`. There is no build step. To deploy, enable GitHub Pages from `main` / root.

### References

- J. E. Volder, *The CORDIC Trigonometric Computing Technique*, IRE Trans. Electronic Computers, 1959
- J. E. Meggitt, *Pseudo Division and Pseudo Multiplication Processes*, IBM Journal, 1962
- D. S. Cochran, *Algorithms and Accuracy in the HP-35*, Hewlett-Packard Journal, June 1972
- Smithsonian NMAH, object 1276228 (HP-45)

MIT License. HP and Hewlett-Packard are trademarks of HP Inc. This project is unaffiliated and uses no original ROM code or logos.

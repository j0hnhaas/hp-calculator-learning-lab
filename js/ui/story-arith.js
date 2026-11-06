// Stories for + − × ÷ (simple level): long arithmetic like on paper.

import { nf } from './story.js';

/** "1.230000000" → "1,23" */
const mantText = (str, lang) => {
  const t = str.includes('.') ? str.replace(/0+$/, '').replace(/\.$/, '') : str;
  return lang === 'de' ? t.replace('.', ',') : t;
};

export function addStory(st, a, b, lang) {
  const de = lang === 'de';
  const al = st[a];
  const seg = st.slice(a, b + 1);
  const sub = seg.some((x) => x.sub);
  const cols = seg.filter((x) => x.phase === 'col');
  const carries = cols.filter((x) => x.carry).length;
  const round = seg.find((x) => x.phase === 'round');
  return [
    {
      title: de ? 'Komma ausrichten' : 'Aligning the point',
      text: al.d === 0
        ? (de ? 'Beide Zahlen haben dieselbe Größenordnung – die Stellen stehen schon richtig untereinander.' : 'Both numbers have the same order of magnitude – the places already line up.')
        : (de
          ? `Die beiden Zahlen sind verschieden groß. Damit Einer unter Einern und Zehntel unter Zehnteln stehen, [[shift|verschiebt]] der Rechner die kleinere Zahl um <b>${al.d} Stelle(n)</b> nach rechts – genau wie du beim schriftlichen Rechnen die Kommas untereinander schreibst.`
          : `The two numbers differ in size. So that ones line up with ones and tenths with tenths, the calculator [[shift|shifts]] the smaller number <b>${al.d} place(s)</b> to the right – just like writing the decimal points under each other on paper.`),
      viz: { kind: 'arith', idx: a },
    },
    {
      title: de ? 'Ziffer für Ziffer' : 'Digit by digit',
      text: de
        ? `Jetzt ${sub ? 'subtrahiert' : 'addiert'} er Stelle für Stelle von rechts nach links – ${cols.length} Stellen, ${carries}× ${sub ? 'musste er borgen' : 'gab es einen Übertrag'}. Sein Rechenwerk schafft nur eine Ziffer auf einmal.`
        : `Now it ${sub ? 'subtracts' : 'adds'} place by place from right to left – ${cols.length} places, ${carries}× ${sub ? 'it had to borrow' : 'there was a carry'}. Its arithmetic unit handles one digit at a time.`,
      merke: de ? 'Addieren Ziffer für Ziffer ist der Grundbaustein für alles andere – auch für ×, ÷ und den Sinus.' : 'Adding digit by digit is the building block for everything else – including ×, ÷ and the sine.',
      viz: { kind: 'arith', idx: cols.length ? st.indexOf(cols.at(-1)) : a },
    },
    {
      title: de ? 'Runden' : 'Rounding',
      text: de
        ? `${round?.shift > 0 ? `Vorne sind Nullen entstanden – er schiebt das Ergebnis um ${round.shift} Stelle(n) nach links. ` : ''}Dann rundet er auf die 10 Stellen der Anzeige. Weil er dezimal rechnet, ist 0,1 + 0,2 bei ihm genau 0,3 – anders als bei vielen Computern.`
        : `${round?.shift > 0 ? `Zeros appeared in front – it shifts the result ${round.shift} place(s) to the left. ` : ''}Then it rounds to the 10 display digits. Because it computes in decimal, 0.1 + 0.2 is exactly 0.3 – unlike on many computers.`,
      viz: { kind: 'arith', idx: b },
    },
  ];
}

export function mulStory(st, a, b, lang) {
  const de = lang === 'de';
  const ex = st[a];
  const digs = [];
  for (let k = a; k <= b; k++) if (st[k].phase === 'mdigit') digs.push(k);
  const A = mantText(ex.regs.A, lang);
  const B = mantText(ex.regs.B, lang);
  const out = [{
    title: de ? 'Größenordnung' : 'Order of magnitude',
    text: de
      ? `Zuerst trennt der Rechner die Zehnerpotenzen ab ([[mantissa|Mantisse und Exponent]]): Er rechnet <b>${A} × ${B}</b> und addiert die Exponenten. Einen Multiplizierer hat er nicht – also addiert er, wie beim schriftlichen Multiplizieren.`
      : `First the calculator splits off the powers of ten ([[mantissa|mantissa and exponent]]): it computes <b>${A} × ${B}</b> and adds the exponents. It has no multiplier – so it adds, like long multiplication.`,
    viz: { kind: 'arith', idx: a },
  }];
  // the last (= highest) three non-zero digits of the multiplier, in calculation order
  const used = digs.filter((k) => st[k].digit > 0).slice(-3);
  for (const k of used) {
    const x = st[k];
    out.push({
      title: de ? `Ziffer ${x.digit}` : `Digit ${x.digit}`,
      text: de
        ? `Für die Ziffer ${x.digit} von ${B} addiert er ${A} genau <b>${x.digit}-mal</b>${x.pos ? ` – um ${x.pos} Stelle(n) nach rechts [[shift|verschoben]]` : ''}. Bisher ${x.adds} Additionen.`
        : `For the digit ${x.digit} of ${B} it adds ${A} exactly <b>${x.digit} times</b>${x.pos ? ` – [[shift|shifted]] ${x.pos} place(s) to the right` : ''}. ${x.adds} additions so far.`,
      viz: { kind: 'arith', idx: k },
    });
  }
  const fin = st[b];
  out.push({
    title: de ? 'Zusammengezählt' : 'Added up',
    text: de
      ? `Insgesamt <b>${fin.adds} Additionen</b> – für jede Ziffer des zweiten Faktors so viele, wie sie groß ist. Dann auf 10 Stellen runden.`
      : `In total <b>${fin.adds} additions</b> – for every digit of the second factor as many as its value. Then round to 10 digits.`,
    merke: de ? 'Malnehmen = wiederholtes Addieren und Verschieben.' : 'Multiplying = repeated adding and shifting.',
    viz: { kind: 'arith', idx: b },
  });
  return out;
}

export function divStory(st, a, b, lang) {
  const de = lang === 'de';
  const ex = st[a];
  const digs = [];
  for (let k = a; k <= b; k++) if (st[k].phase === 'qdigit') digs.push(k);
  const val = (str) => nf(Number(str) / 1e9, lang, 10);
  const B = val(ex.regs.B);
  const out = [{
    title: de ? 'Wie schriftliches Dividieren' : 'Like long division',
    text: de
      ? 'Die Zehnerpotenzen erledigt der Rechner extra (Exponenten subtrahieren). Für die Ziffern macht er, was du beim schriftlichen Dividieren machst: <b>abziehen, so oft es geht, und zählen</b> – das ist die nächste Ziffer.'
      : 'The calculator handles the powers of ten separately (subtract the exponents). For the digits it does what you do in long division: <b>subtract as often as possible and count</b> – that is the next digit.',
    viz: { kind: 'arith', idx: a },
  }];
  digs.slice(0, 3).forEach((k, n) => {
    const x = st[k];
    const before = val(x.before);
    const after = val(x.after);
    out.push({
      title: de ? `Ziffer ${n + 1}` : `Digit ${n + 1}`,
      text: de
        ? `Wie oft passt ${B} in ${before}? <b>${x.digit}-mal</b> – Rest ${after}. Dann holt er eine Null herunter.`
        : `How often does ${B} fit into ${before}? <b>${x.digit} times</b> – remainder ${after}. Then it brings down a zero.`,
      quiz: { answer: x.digit, max: 9, question: de ? `Wie oft passt ${B} in ${before}?` : `How often does ${B} fit into ${before}?` },
      viz: { kind: 'arith', idx: k, prev: n === 0 ? a : digs[n - 1] },
    });
  });
  const fin = st[b];
  const q = digs.map((k) => st[k].digit).join(' ');
  out.push({
    title: de ? 'Und so weiter' : 'And so on',
    text: de
      ? `So entsteht Ziffer für Ziffer ${q} – nach insgesamt <b>${fin.subs} Subtraktionen</b>. Dann auf 10 Stellen runden.`
      : `Digit by digit this gives ${q} – after <b>${fin.subs} subtractions</b> in total. Then round to 10 digits.`,
    merke: de ? 'Abziehen und zählen – genau so hat der Rechner beim Sinus die Münzen gezählt ([[pseudodiv|Pseudo-Division]]).' : 'Subtract and count – exactly how the calculator counted the coins for the sine ([[pseudodiv|pseudo-division]]).',
    viz: { kind: 'arith', idx: b },
  });
  return out;
}

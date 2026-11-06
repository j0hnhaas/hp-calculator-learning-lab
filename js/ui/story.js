// "Simple" level of the lab: turns the micro-step trace into a short story of
// about ten steps – angles are paid with coins, logarithms are interest.
//
// Every story step: { title, text, merke?, quiz?, viz: { kind, idx, j? } }
//   kind 'vector' | 'track' | 'coins' | 'sqrt' – idx points into the trace,
//   so the lab can reuse its drawings.

import { S } from '../engine/decimal.js';
import { ATAN_STR, LN_STR } from '../engine/constants.js';

const num = (v) => Number(v) / Number(S);
const DEG = 180 / Math.PI;
const ATAN = ATAN_STR.map(Number);
const LNC = LN_STR.map(Number);

/** number for prose: n significant digits, decimal comma in German */
export function nf(x, lang, sig = 6) {
  if (x === 0) return '0';
  let s;
  const a = Math.abs(x);
  if (a < 1e-4) s = x.toFixed(Math.min(20, Math.ceil(-Math.log10(a)) + sig - 1)).replace(/0+$/, '');
  else if (a >= 1e10) s = x.toExponential(sig - 1);
  else s = String(Number(x.toPrecision(sig)));
  return lang === 'de' ? s.replace('.', ',') : s;
}

/** the "coins" in degrees: 45°, 5,71°, 0,573° … */
export const coinDeg = (j) => ATAN[j] * DEG;
/** the interest steps: 100 %, 10 %, 1 % … */
const rate = (j, lang) => `${nf(100 / 10 ** j, lang, 3)} %`;

const L = {
  de: {
    task: 'Die Aufgabe',
    prep: 'Winkel vorbereiten',
    coin: (c) => `Münze ${c}`,
    small: 'Die kleinen Münzen',
    rest: 'Der winzige Rest',
    rotSmall: 'Zeiger drehen – kleine Münzen zuerst',
    rotBig: '… dann die großen',
    read: 'Ablesen',
    result: 'Ergebnis',
    back: 'Zurückdrehen',
    sumAngles: 'Münzen zusammenzählen',
    interest: (r) => `Zinsen: ${r}`,
    smallInterest: 'Die kleinen Zinsschritte',
    sumLogs: 'Logarithmen zusammenzählen',
    split: 'Zehnerpotenz abtrennen',
    grow: 'Jetzt wird verzinst',
    sqrtTitle: 'Ziffer für Ziffer',
    times: (q) => `${q}×`,
  },
  en: {
    task: 'The task',
    prep: 'Preparing the angle',
    coin: (c) => `Coin ${c}`,
    small: 'The small coins',
    rest: 'The tiny remainder',
    rotSmall: 'Turning the pointer – small coins first',
    rotBig: '… then the big ones',
    read: 'Reading the result',
    result: 'Result',
    back: 'Turning back',
    sumAngles: 'Adding up the coins',
    interest: (r) => `Interest: ${r}`,
    smallInterest: 'The small interest steps',
    sumLogs: 'Adding up the logarithms',
    split: 'Splitting off the power of ten',
    grow: 'Now the interest is applied',
    sqrtTitle: 'Digit by digit',
    times: (q) => `${q}×`,
  },
};

const FN_NAME = { sin: 'sin', cos: 'cos', tan: 'tan', asin: 'sin⁻¹', acos: 'cos⁻¹', atan: 'tan⁻¹', ln: 'ln', log: 'log', exp: 'eˣ', exp10: '10ˣ', sqrt: '√', pow: 'yˣ', pow35: 'xʸ', toP: '→P', toR: '→R' };

/** find the next index ≥ from where pred holds */
function find(steps, from, pred) {
  for (let k = from; k < steps.length; k++) if (pred(steps[k])) return k;
  return -1;
}

function lastWhile(steps, from, pred) {
  let k = from;
  while (k + 1 < steps.length && pred(steps[k + 1])) k++;
  return k;
}

/** indices of the "decade done" steps of one phase, by decade */
function decadeEnds(steps, from, to, algo, phase) {
  const out = [];
  for (let k = from; k <= to; k++) {
    const s = steps[k];
    if (s.algo === algo && s.phase === phase && s.done) out[s.j] = k;
  }
  return out;
}

// ---------------------------------------------------------------- trig: sin, cos, tan
function trigStory(st, a, b, lang, T, ctx) {
  const out = [];
  const de = lang === 'de';
  const red = st[a];
  const theta0 = num(red.regs.theta);
  const fn = red.fn;
  const deg0 = theta0 * DEG;
  const quad = red.quadrant;
  const inMode = ctx.angle === 'RAD' ? `${nf(ctx.x, lang)} rad` : ctx.angle === 'GRD' ? `${nf(ctx.x, lang)} gon` : `${nf(ctx.x, lang)}°`;
  out.push({
    title: T.prep,
    text: de
      ? `Für das Drehen braucht der Rechner einen Winkel im ersten Viertel des Kreises ([[quadrant|Quadrant]]).${quad > 0 || ctx.x < 0 ? ` ${inMode} hat dort dasselbe Ergebnis wie ${nf(deg0, lang)}° – Vorzeichen und Spiegelung setzt er am Ende.` : ''} Intern rechnet er im [[radian|Bogenmaß]] (θ = ${nf(theta0, lang, 7)}); wir bleiben hier bei Grad: <b>${nf(deg0, lang)}°</b>.`
      : `For turning, the calculator needs an angle in the first quarter of the circle ([[quadrant|quadrant]]).${quad > 0 || ctx.x < 0 ? ` There, ${inMode} gives the same result as ${nf(deg0, lang)}° – sign and mirroring are applied at the end.` : ''} Internally it works in [[radian|radians]] (θ = ${nf(theta0, lang, 7)}); here we stay with degrees: <b>${nf(deg0, lang)}°</b>.`,
    viz: { kind: 'vector', idx: a },
  });
  const small = find(st, a, (s) => s.phase === 'small');
  if (small !== -1 && small <= b) {
    out.push({
      title: T.rest,
      text: de
        ? `${nf(deg0, lang)}° ist so klein, dass keine einzige Münze passt. Für so winzige Winkel gilt einfach sin θ = tan θ = θ – fertig, ohne Drehen.`
        : `${nf(deg0, lang)}° is so small that not a single coin fits. For such tiny angles simply sin θ = tan θ = θ – done, no turning needed.`,
      viz: { kind: 'vector', idx: small },
    });
    return out;
  }
  const ends = decadeEnds(st, a, b, 'trig', 'pdiv');
  const q = st[ends[ends.length - 1]].q;
  const restDeg = (j) => num(st[ends[j]].regs.theta) * DEG;
  // big coins one by one, with an optional guess
  for (let j = 0; j < 3; j++) {
    const c = `${nf(coinDeg(j), lang, 3)}°`;
    const before = j === 0 ? deg0 : restDeg(j - 1);
    out.push({
      title: T.coin(c),
      text: j === 0
        ? (de
          ? `Jetzt kommt der Trick: Der Rechner „bezahlt“ ${nf(deg0, lang)}° mit Münzen aus seinem Speicher – immer zuerst die größte, die noch passt ([[pseudodiv|Pseudo-Division]]). Die größte Münze ist 45°. ${q[0] === 0 ? 'Sie ist zu groß – passt <b>0-mal</b>.' : `Sie passt <b>${q[0]}-mal</b>.`} Es fehlen noch ${nf(restDeg(0), lang)}°.`
          : `Now the trick: the calculator “pays” ${nf(deg0, lang)}° with coins from its memory – always the largest one that still fits first ([[pseudodiv|pseudo-division]]). The largest coin is 45°. ${q[0] === 0 ? 'It is too big – fits <b>0 times</b>.' : `It fits <b>${q[0]} times</b>.`} ${nf(restDeg(0), lang)}° are still missing.`)
        : (de
          ? `Nächste Münze: ${c} – etwa zehnmal kleiner. Sie passt <b>${q[j]}-mal</b> in die fehlenden ${nf(before, lang)}°. Es fehlen noch ${nf(restDeg(j), lang)}°.`
          : `Next coin: ${c} – about ten times smaller. It fits <b>${q[j]} times</b> into the missing ${nf(before, lang)}°. ${nf(restDeg(j), lang)}° are still missing.`),
      quiz: {
        answer: q[j],
        max: Math.max(j === 0 ? 2 : 9, q[j]),
        question: de ? `Wie oft passt die Münze ${c} in ${nf(before, lang)}°?` : `How often does the ${c} coin fit into ${nf(before, lang)}°?`,
      },
      viz: { kind: 'coins', idx: ends[j], j },
    });
  }
  const lastJ = ends.length - 1;
  const smallList = q.slice(3).map((n) => T.times(n)).join(', ');
  out.push({
    title: T.small,
    text: de
      ? `So geht es weiter mit immer kleineren Münzen (${[3, 4, 5, 6].map((j) => `${nf(coinDeg(j), lang, 3)}°`).join(', ')}): Sie passen ${smallList}. Es fehlen nur noch ${nf(restDeg(lastJ), lang, 3)}°.`
      : `It carries on with ever smaller coins (${[3, 4, 5, 6].map((j) => `${nf(coinDeg(j), lang, 3)}°`).join(', ')}): they fit ${smallList}. Only ${nf(restDeg(lastJ), lang, 3)}° are missing now.`,
    merke: de
      ? `Der Winkel ist jetzt eine Münzliste: ${q.join(' · ')}. Jede Stelle sagt, wie oft eine Münzsorte passt.`
      : `The angle is now a list of coins: ${q.join(' · ')}. Each entry says how often one coin type fits.`,
    viz: { kind: 'coins', idx: ends[lastJ], j: lastJ },
  });
  const init = find(st, a, (s) => s.algo === 'trig' && s.phase === 'init');
  out.push({
    title: T.rest,
    text: de
      ? `Die übrigen ${nf(restDeg(lastJ), lang, 3)}° deckt keine Münze mehr ab. Das ist so wenig, dass der Rechner diesen [[residual|Rest]] direkt als Startwinkel nimmt: Er legt einen [[vector|Zeiger]] hin, der fast waagrecht liegt.`
      : `No coin covers the remaining ${nf(restDeg(lastJ), lang, 3)}°. That is so little that the calculator takes this [[residual|residual]] directly as the starting angle: it puts down a [[vector|pointer]] that lies almost flat.`,
    viz: { kind: 'vector', idx: init },
  });
  const pmul = [];
  for (let k = init; k <= b; k++) if (st[k].phase === 'pmul') pmul.push(k);
  const lastSmall = [...pmul].reverse().find((k) => st[k].j >= 2) ?? init;
  out.push({
    title: T.rotSmall,
    text: de
      ? `Jetzt dreht der Rechner den Zeiger – für jede gezählte Münze einmal, mit den kleinsten zuerst. Das geht ohne Multiplizieren: Eine Drehung um eine Münze ist nur [[shift|Verschieben]] und Addieren ([[rotation|Drehung]]).`
      : `Now the calculator turns the pointer – once for every coin it counted, smallest first. No multiplying needed: turning by one coin is just [[shift|shifting]] and adding ([[rotation|rotation]]).`,
    viz: { kind: 'vector', idx: lastSmall },
  });
  const lastPmul = pmul.at(-1) ?? init;
  out.push({
    title: T.rotBig,
    text: de
      ? `Zum Schluss die großen Münzen: ${q[1]}× 5,71°${q[0] ? ` und ${q[0]}× 45°` : ''}. Jetzt zeigt der Zeiger genau auf ${nf(deg0, lang)}°.`
      : `Finally the big coins: ${q[1]}× 5.71°${q[0] ? ` and ${q[0]}× 45°` : ''}. Now the pointer points exactly at ${nf(deg0, lang)}°.`,
    merke: de
      ? 'Das war die [[pseudomul|Pseudo-Multiplikation]]: Aus der Münzliste wird wieder ein Winkel – diesmal als Zeiger, an dem man sin, cos und tan ablesen kann.'
      : 'That was the [[pseudomul|pseudo-multiplication]]: the list of coins turns back into an angle – this time as a pointer you can read sin, cos and tan from.',
    viz: { kind: 'vector', idx: lastPmul },
  });
  const fin = st[b];
  const X = num(fin.regs.X);
  const Y = num(fin.regs.Y);
  const R = Math.hypot(X, Y);
  const formula = {
    sin: `Y ÷ R = ${nf(Y, lang)} ÷ ${nf(R, lang)}`,
    cos: `X ÷ R = ${nf(X, lang)} ÷ ${nf(R, lang)}`,
    tan: `Y ÷ X = ${nf(Y, lang)} ÷ ${nf(X, lang)}`,
  }[fn];
  out.push({
    title: T.read,
    text: de
      ? `Am Zeiger liest der Rechner ab (wie bei der Leiter an der Wand, siehe [[trig|Winkelfunktionen]]): ${fn} = ${formula}. ${fn !== 'tan' ? 'R ist die Länge des Zeigers – er ist beim Drehen etwas länger geworden, deshalb teilt der Rechner durch R. ' : ''}${quad > 0 || ctx.x < 0 ? 'Dann setzt er Vorzeichen und Quadrant. ' : ''}Ergebnis: <b>${nf(fin.result, lang, 10)}</b>.`
      : `The calculator reads it off the pointer (like the ladder against the wall, see [[trig|trig functions]]): ${fn} = ${formula}. ${fn !== 'tan' ? 'R is the length of the pointer – it got a little longer while turning, so the calculator divides by R. ' : ''}${quad > 0 || ctx.x < 0 ? 'Then it applies sign and quadrant. ' : ''}Result: <b>${nf(fin.result, lang, 10)}</b>.`,
    merke: de ? 'Nur ganz am Ende rechnet der Rechner eine einzige echte Division.' : 'Only at the very end does the calculator do a single real division.',
    viz: { kind: 'vector', idx: b },
  });
  return out;
}

// ---------------------------------------------------------------- atan, asin, acos, →P
function atanStory(st, a, b, lang, T) {
  const out = [];
  const de = lang === 'de';
  const start = find(st, a, (s) => s.msg?.[0] === 'atan.start');
  if (start === -1 || start > b) return out;
  const v = st[start].vec;
  const target = Math.atan2(num(v.Y), num(v.X)) * DEG;
  const ends = decadeEnds(st, a, b, 'atan', 'vec');
  const q = st[ends[ends.length - 1]].q;
  out.push({
    title: T.back,
    text: de
      ? `Der Rechner legt einen [[vector|Zeiger]] mit genau diesem Verhältnis von Höhe zu Abstand hin. Den gesuchten Winkel kennt er noch nicht – also dreht er den Zeiger mit seinen Münzen zurück auf den Boden und zählt mit ([[vectoring|Vektorisierung]]).`
      : `The calculator puts down a [[vector|pointer]] with exactly this ratio of height to distance. It does not know the angle yet – so it turns the pointer back down to the floor with its coins and counts ([[vectoring|vectoring]]).`,
    viz: { kind: 'vector', idx: start },
  });
  for (let j = 0; j < 3; j++) {
    const c = `${nf(coinDeg(j), lang, 3)}°`;
    out.push({
      title: T.coin(c),
      text: de
        ? `Zurückdrehen um ${c}: Das geht <b>${q[j]}-mal</b>, ohne dass der Zeiger unter den Boden rutscht.`
        : `Turning back by ${c}: this works <b>${q[j]} times</b> before the pointer would drop below the floor.`,
      quiz: { answer: q[j], max: Math.max(j === 0 ? 2 : 9, q[j]), question: de ? `Wie oft kann er um ${c} zurückdrehen?` : `How often can it turn back by ${c}?` },
      viz: { kind: 'vector', idx: ends[j], prev: j === 0 ? start : ends[j - 1] },
    });
  }
  const lastJ = ends.length - 1;
  out.push({
    title: T.small,
    text: de
      ? `Mit den kleinen Münzen geht es weiter: ${q.slice(3).map((n) => T.times(n)).join(', ')}. Jetzt liegt der Zeiger fast flach – den winzigen [[residual|Rest]] liest der Rechner direkt ab.`
      : `The small coins follow: ${q.slice(3).map((n) => T.times(n)).join(', ')}. Now the pointer lies almost flat – the calculator reads off the tiny [[residual|residual]] directly.`,
    viz: { kind: 'vector', idx: ends[lastJ] },
  });
  const sumLast = (() => { let k = -1; for (let i = a; i <= b; i++) if (st[i].algo === 'atan' && st[i].phase === 'sum') k = i; return k; })();
  out.push({
    title: T.sumAngles,
    text: de
      ? `Der Winkel ist die Summe aller Münzen, um die er gedreht hat: ${q.map((n, j) => (n ? `${n}× ${nf(coinDeg(j), lang, 3)}°` : null)).filter(Boolean).slice(0, 4).join(' + ')} + … = <b>${nf(target, lang, 8)}°</b>.`
      : `The angle is the sum of all coins it turned by: ${q.map((n, j) => (n ? `${n}× ${nf(coinDeg(j), lang, 3)}°` : null)).filter(Boolean).slice(0, 4).join(' + ')} + … = <b>${nf(target, lang, 8)}°</b>.`,
    merke: de ? 'Rückwärts funktioniert derselbe Trick: drehen, zählen, Münzen zusammenzählen.' : 'The same trick works backwards: turn, count, add up the coins.',
    viz: { kind: 'vector', idx: sumLast === -1 ? ends[lastJ] : sumLast },
  });
  return out;
}

// ---------------------------------------------------------------- ln / log
function lnStory(st, a, b, lang, T) {
  const out = [];
  const de = lang === 'de';
  const setup = st[a];
  const M = num(setup.regs.M);
  const e = setup.e;
  if (e !== 0) {
    out.push({
      title: T.split,
      text: de
        ? `Zuerst trennt der Rechner die Zehnerpotenz ab: x = ${nf(M, lang, 8)} · 10${sup(e)} ([[mantissa|Mantisse und Exponent]]). Die Zehnerpotenz erledigt er am Schluss mit ln 10.`
        : `First the calculator splits off the power of ten: x = ${nf(M, lang, 8)} · 10${sup(e)} ([[mantissa|mantissa and exponent]]). It handles the power of ten at the end with ln 10.`,
      viz: { kind: 'track', idx: a },
    });
  }
  const ends = decadeEnds(st, a, b, 'ln', 'pdiv');
  const q = st[ends[ends.length - 1]].q;
  const P = (j) => num(st[ends[j]].regs.P);
  for (let j = 0; j < 3; j++) {
    const r = rate(j, lang);
    out.push({
      title: T.interest(r),
      text: j === 0
        ? (de
          ? `Die Frage hinter ln: Wie oft muss man 1 € verzinsen, bis ${nf(M, lang, 8)} € daraus werden? Der Rechner probiert es mit festen Zinssätzen – zuerst 100 % (verdoppeln). Das geht <b>${q[0]}-mal</b>, ohne ${nf(M, lang, 6)} € zu überschreiten: ${nf(P(0), lang)} €.`
          : `The question behind ln: how often do you have to add interest to 1 € until it becomes ${nf(M, lang, 8)} €? The calculator tries fixed interest rates – 100 % (doubling) first. That works <b>${q[0]} times</b> without going over ${nf(M, lang, 6)} €: ${nf(P(0), lang)} €.`)
        : (de
          ? `Jetzt ${r} Zinsen: Das geht <b>${q[j]}-mal</b> – dann sind es ${nf(P(j), lang, 8)} €. ${j === 1 ? '10 % Zinsen sind für den Rechner billig: Betrag + Betrag um eine Stelle [[shift|verschoben]].' : ''}`
          : `Now ${r} interest: that works <b>${q[j]} times</b> – giving ${nf(P(j), lang, 8)} €. ${j === 1 ? '10 % interest is cheap for the calculator: amount + amount [[shift|shifted]] by one digit.' : ''}`),
      quiz: { answer: q[j], max: Math.max(j === 0 ? 3 : 9, q[j]), question: de ? `Wie oft passen ${r} Zinsen noch, ohne ${nf(M, lang, 6)} € zu überschreiten?` : `How often does ${r} interest still fit without going over ${nf(M, lang, 6)} €?` },
      viz: { kind: 'track', idx: ends[j], prev: j === 0 ? find(st, a, (x) => x.msg?.[0] === 'ln.start') : ends[j - 1] },
    });
  }
  const lastJ = ends.length - 1;
  out.push({
    title: T.smallInterest,
    text: de
      ? `Mit 0,1 %, 0,01 % … geht es weiter: ${q.slice(3).map((n) => T.times(n)).join(', ')}. Jetzt sind es ${nf(P(lastJ), lang, 10)} € – fast genau ${nf(M, lang, 10)} €. Der winzige [[residual|Rest]] wird direkt übernommen.`
      : `It continues with 0.1 %, 0.01 % …: ${q.slice(3).map((n) => T.times(n)).join(', ')}. Now it is ${nf(P(lastJ), lang, 10)} € – almost exactly ${nf(M, lang, 10)} €. The tiny [[residual|residual]] is taken over directly.`,
    merke: de ? `Die Zahl ist jetzt eine Liste von Zinsschritten: ${q.join(' · ')} ([[pseudodiv|Pseudo-Division]]).` : `The number is now a list of interest steps: ${q.join(' · ')} ([[pseudodiv|pseudo-division]]).`,
    viz: { kind: 'track', idx: ends[lastJ] },
  });
  let sumLast = -1;
  let sumVal;
  for (let k = a; k <= b; k++) {
    if (st[k].algo === 'ln' && (st[k].phase === 'sum' || st[k].phase === 'resid')) {
      sumLast = k;
      sumVal = num(st[k].regs.sum);
    }
  }
  out.push({
    title: T.sumLogs,
    text: de
      ? `Für jeden Zinsschritt kennt der Rechner den Logarithmus aus seinem Speicher ([[rom|ROM-Konstanten]]): ln 2 = 0,6931, ln 1,1 = 0,0953 … Er zählt sie so oft zusammen, wie er gezählt hat: ${q[0]}× ln 2 + ${q[1]}× ln 1,1 + ${q[2]}× ln 1,01 + … = <b>${nf(sumVal, lang, 10)}</b>.`
      : `For every interest step the calculator knows the logarithm from its memory ([[rom|ROM constants]]): ln 2 = 0.6931, ln 1.1 = 0.0953 … It adds them up as often as it counted: ${q[0]}× ln 2 + ${q[1]}× ln 1.1 + ${q[2]}× ln 1.01 + … = <b>${nf(sumVal, lang, 10)}</b>.`,
    merke: de ? 'Logarithmen verwandeln Malnehmen in Zusammenzählen – genau das, was der Rechner gut kann.' : 'Logarithms turn multiplying into adding – exactly what the calculator is good at.',
    viz: { kind: 'track', idx: sumLast },
  });
  return out;
}

// ---------------------------------------------------------------- e^x
function expStory(st, a, b, lang, T) {
  const out = [];
  const de = lang === 'de';
  const setup = st[a];
  const k = setup.k;
  const r0 = num(setup.regs.r);
  const ends = decadeEnds(st, a, b, 'exp', 'pdiv');
  const q = st[ends[ends.length - 1]].q;
  out.push({
    title: de ? 'Zinsen zählen' : 'Counting interest',
    text: de
      ? `eˣ ist Zinseszins: Der Rechner sucht, wie oft er 1 € mit 100 %, 10 %, 1 % … verzinsen muss. Dazu zerlegt er ${nf(r0, lang, 8)}${k ? ` (nach Abzug von ${k} · ln 10 – das wird später die Zehnerpotenz 10${sup(k)})` : ''} in die Logarithmen dieser Zinsschritte ([[pseudodiv|Pseudo-Division]]): ln 2 passt ${q[0]}×, ln 1,1 passt ${q[1]}×, ln 1,01 passt ${q[2]}× …`
      : `eˣ is compound interest: the calculator looks for how often it has to add 100 %, 10 %, 1 % … interest to 1 €. For that it splits ${nf(r0, lang, 8)}${k ? ` (after subtracting ${k} · ln 10 – that later becomes the power of ten 10${sup(k)})` : ''} into the logarithms of these interest steps ([[pseudodiv|pseudo-division]]): ln 2 fits ${q[0]}×, ln 1.1 fits ${q[1]}×, ln 1.01 fits ${q[2]}× …`,
    merke: de ? `Zinsplan: ${q.join(' · ')}` : `Interest plan: ${q.join(' · ')}`,
    viz: { kind: 'track', idx: ends[ends.length - 1] },
  });
  let last = -1;
  for (let i = a; i <= b; i++) if (st[i].algo === 'exp' && st[i].phase === 'pmul') last = i;
  const Pend = last === -1 ? 1 : num(st[last].regs.P);
  out.push({
    title: T.grow,
    text: de
      ? `Jetzt verzinst er 1 € genau nach Plan – die kleinsten Zinsschritte zuerst, zum Schluss ${q[1]}× 10 % und ${q[0]}× 100 %. Jeder Schritt ist nur Verschieben und Addieren. Ergebnis: <b>${nf(Pend, lang, 10)} €</b>${k ? ` · 10${sup(k)}` : ''}.`
      : `Now it adds interest to 1 € exactly according to plan – smallest steps first, finally ${q[1]}× 10 % and ${q[0]}× 100 %. Every step is just shifting and adding. Result: <b>${nf(Pend, lang, 10)} €</b>${k ? ` · 10${sup(k)}` : ''}.`,
    merke: de ? 'Das war die [[pseudomul|Pseudo-Multiplikation]].' : 'That was the [[pseudomul|pseudo-multiplication]].',
    viz: { kind: 'track', idx: last === -1 ? ends[ends.length - 1] : last },
  });
  return out;
}

// ---------------------------------------------------------------- √x
function sqrtStory(st, a, b, lang, T) {
  const de = lang === 'de';
  const digits = [];
  for (let k = a; k <= b; k++) if (st[k].phase === 'digit') digits.push(k);
  const out = [{
    title: T.sqrtTitle,
    text: de
      ? 'Für die Wurzel braucht der Rechner auch kein Multiplizieren. Er nutzt: 1 + 3 + 5 + 7 = 16 = 4². Er zieht ungerade Zahlen ab und zählt, wie oft das geht – das ist die nächste Ziffer ([[sqrtdigits|Wurzel Ziffer für Ziffer]]).'
      : 'The square root needs no multiplying either. The calculator uses: 1 + 3 + 5 + 7 = 16 = 4². It subtracts odd numbers and counts how often that works – that is the next digit ([[sqrtdigits|square root digit by digit]]).',
    viz: { kind: 'sqrt', idx: digits[0] },
  }];
  for (const k of digits.slice(0, 3)) {
    const s = st[k];
    out.push({
      title: de ? `Ziffer ${s.k + 1}` : `Digit ${s.k + 1}`,
      text: de ? `${s.digit} ungerade Zahlen passen – die nächste Ziffer ist <b>${s.digit}</b>.` : `${s.digit} odd numbers fit – the next digit is <b>${s.digit}</b>.`,
      viz: { kind: 'sqrt', idx: k },
    });
  }
  if (digits.length > 3) {
    out.push({
      title: de ? 'Und so weiter' : 'And so on',
      text: de ? 'So geht es Ziffer für Ziffer weiter, bis alle Stellen stehen. Jede gefundene Ziffer ist sofort endgültig.' : 'It goes on digit by digit until all places are there. Every digit found is final at once.',
      viz: { kind: 'sqrt', idx: digits.at(-1) },
    });
  }
  return out;
}

function sup(n) {
  const M = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  return String(n).split('').map((c) => M[c] ?? c).join('');
}

/**
 * Build the story for a trace.
 * @param {{label:string,args:number[],steps:object[],result:number,resultText?:string,angle?:string}} tr
 */
export function buildStory(tr, lang) {
  const T = L[lang] ?? L.en;
  const de = lang === 'de';
  const st = tr.steps;
  const out = [];
  const name = FN_NAME[tr.label] ?? tr.label;
  const unit = ['sin', 'cos', 'tan'].includes(tr.label) ? (tr.angle === 'RAD' ? ' rad' : tr.angle === 'GRD' ? ' gon' : '°') : '';
  const args = tr.args.map((x) => nf(x, lang, 10)).join(de ? '; ' : ', ');

  // intro: the question
  const intro = {
    sin: de ? `Gesucht ist sin ${args}${unit}. Der Rechner kann nicht multiplizieren – nur Ziffern [[shift|verschieben]] und addieren. Sein Trick: Er dreht einen [[vector|Zeiger]] genau auf den Winkel und liest dann ab.` : `We want sin ${args}${unit}. The calculator cannot multiply – it can only [[shift|shift]] digits and add. Its trick: it turns a [[vector|pointer]] exactly onto the angle and then reads off the result.`,
    ln: de ? `Gesucht ist ln ${args}. Der Rechner kann nicht multiplizieren – aber er kann Zinsen ausrechnen, und das genügt.` : `We want ln ${args}. The calculator cannot multiply – but it can work out interest, and that is enough.`,
    exp: de ? `Gesucht ist e hoch ${args}. Für den Rechner ist das eine Zinsrechnung.` : `We want e to the power of ${args}. For the calculator, that is an interest calculation.`,
    atan: de ? `Gesucht ist der Winkel, dessen Tangens ${args} ist – also wie steil eine Rampe mit Höhe ÷ Abstand = ${args} ist ([[atan|atan]]).` : `We want the angle whose tangent is ${args} – how steep a ramp with height ÷ distance = ${args} is ([[atan|atan]]).`,
    sqrt: de ? `Gesucht ist √${args}.` : `We want √${args}.`,
  };
  intro.cos = intro.sin.replace('sin ', 'cos ');
  intro.tan = intro.sin.replace('sin ', 'tan ');
  intro.log = de ? `Gesucht ist log ${args}. Der Rechner berechnet zuerst ln und teilt dann durch ln 10.` : `We want log ${args}. The calculator computes ln first and then divides by ln 10.`;
  intro.exp10 = de ? `Gesucht ist 10 hoch ${args}. Der Rechner macht daraus e hoch (${args} · ln 10) – eine Zinsrechnung.` : `We want 10 to the power of ${args}. The calculator turns it into e to the power of (${args} · ln 10) – an interest calculation.`;
  intro.asin = de ? `Gesucht ist der Winkel, dessen Sinus ${args} ist. Der Rechner baut daraus einen Zeiger mit Höhe ${args} und Länge 1 – die waagrechte Seite holt er sich mit einer Wurzel – und misst dann dessen Winkel.` : `We want the angle whose sine is ${args}. The calculator builds a pointer with height ${args} and length 1 – it gets the horizontal side with a square root – and then measures its angle.`;
  intro.acos = intro.asin.replace(/Sinus|sine/, de ? 'Kosinus' : 'cosine');
  intro.pow = de ? `Gesucht ist ${tr.args[0]} hoch ${tr.args[1]}. Trick: yˣ = e^(x · ln y). Also erst ein Logarithmus, dann eine Zinsrechnung.` : `We want ${tr.args[0]} to the power of ${tr.args[1]}. Trick: yˣ = e^(x · ln y). So first a logarithm, then an interest calculation.`;
  intro.pow35 = de ? `Gesucht ist ${tr.args[0]} hoch ${tr.args[1]}. Trick: xʸ = e^(y · ln x). Also erst ein Logarithmus, dann eine Zinsrechnung.` : `We want ${tr.args[0]} to the power of ${tr.args[1]}. Trick: xʸ = e^(y · ln x). So first a logarithm, then an interest calculation.`;
  intro.toP = de ? 'Gesucht sind Länge und Winkel des Pfeils (x, y). Der Rechner dreht den Pfeil auf den Boden und zählt die Münzen.' : 'We want length and angle of the arrow (x, y). The calculator turns the arrow down to the floor and counts the coins.';
  intro.toR = de ? 'Gesucht sind x und y eines Pfeils mit gegebener Länge und Winkel: x = r · cos θ, y = r · sin θ. Der Rechner rechnet dafür sin und cos.' : 'We want x and y of an arrow with given length and angle: x = r · cos θ, y = r · sin θ. The calculator computes sin and cos for that.';
  out.push({ title: T.task, text: intro[tr.label] ?? `${name} ${args}`, viz: { kind: st[0]?.algo === 'ln' || st[0]?.algo === 'exp' ? 'track' : st[0]?.algo === 'sqrt' ? 'sqrt' : 'vector', idx: 0 } });

  // segments
  let p = 0;
  while (p < st.length) {
    const s = st[p];
    if (s.algo === 'trig' && s.phase === 'reduce') {
      const end = find(st, p, (x) => x.algo === 'trig' && x.phase === 'final');
      out.push(...trigStory(st, p, end, lang, T, { angle: tr.angle, x: num(s.regs.x) }));
      p = end + 1;
    } else if (s.algo === 'atan' && s.phase === 'setup') {
      const end = find(st, p, (x) => x.algo === 'atan' && x.phase === 'final');
      out.push(...atanStory(st, p, end === -1 ? st.length - 1 : end, lang, T));
      p = end === -1 ? st.length : end + 1;
    } else if (s.algo === 'ln' && s.phase === 'setup') {
      const end = lastWhile(st, p, (x) => x.algo === 'ln');
      out.push(...lnStory(st, p, end, lang, T));
      p = end + 1;
    } else if (s.algo === 'exp' && s.phase === 'setup') {
      const end = lastWhile(st, p, (x) => x.algo === 'exp');
      out.push(...expStory(st, p, end, lang, T));
      p = end + 1;
    } else if (s.algo === 'sqrt' && s.phase === 'setup' && tr.label === 'sqrt') {
      const end = lastWhile(st, p, (x) => x.algo === 'sqrt');
      out.push(...sqrtStory(st, p, end, lang, T));
      p = end + 1;
    } else {
      p++;
    }
  }

  // closing: the result and the big idea
  const res = tr.resultText ?? nf(tr.result, lang, 10);
  out.push({
    title: T.result,
    text: de
      ? `${tr.resultText ? res : `${name} ${args}${unit} = <b>${res}</b>`}. Gerechnet ganz ohne Multiplizierer – nur mit Verschieben, Addieren und Zählen. Genau so hat es der HP-45 {year} in einem Bruchteil einer Sekunde gemacht.`
      : `${tr.resultText ? res : `${name} ${args}${unit} = <b>${res}</b>`}. Computed without any multiplier – just shifting, adding and counting. That is exactly how the HP-45 did it in a fraction of a second.`,
    viz: { kind: st.at(-1)?.algo === 'ln' || st.at(-1)?.algo === 'exp' ? 'track' : st.at(-1)?.algo === 'sqrt' ? 'sqrt' : 'vector', idx: st.length - 1 },
  });
  return out;
}

export { ATAN, LNC };

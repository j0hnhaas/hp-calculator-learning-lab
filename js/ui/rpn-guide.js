// "RPN in one minute": four short cards, then exercises on the real calculator.

import { getLang } from '../i18n.js';
import { openSheet, closeSheet } from './sheet.js';

const keys = (seq) => seq.split(' ').map((k) => `<kbd class="kk${/^[0-9.]+$/.test(k) ? ' num' : ''}">${k}</kbd>`).join('');

/** A small stack picture: rows T Z Y X, X at the bottom. */
function stackPic(caption, rows) {
  const [t, z, y, x] = rows;
  const row = (n, v) => `<div class="mini-row${n === 'X' ? ' x' : ''}"><b>${n}</b><span>${v ?? ''}</span></div>`;
  return `<figure class="mini-stack"><figcaption>${caption}</figcaption>${row('T', t)}${row('Z', z)}${row('Y', y)}${row('X', x)}</figure>`;
}

const TEXT = {
  de: {
    title: 'RPN in einer Minute',
    next: 'Weiter',
    back: 'Zurück',
    start: 'Los geht’s',
    cards: [
      {
        h: 'Keine =-Taste? Richtig so!',
        body: () => `<p>Dieser Rechner arbeitet mit [[rpn|RPN]]: <b>Erst die Zahlen, dann die Rechenart.</b> Für 3 + 4 tippst du:</p>
          <p class="seq">${keys('3 ENTER↑ 4 +')} <span class="res">→ 7</span></p>
          <p>Klingt ungewohnt – spart aber Tasten und Klammern. Ingenieure haben ihn genau dafür geliebt.</p>`,
      },
      {
        h: 'ENTER heißt: Zahl ablegen',
        body: () => `<p>Der Rechner hat einen [[stack|Stapel]] mit vier Plätzen: T, Z, Y und X. <b>X siehst du in der Anzeige.</b> ENTER legt die getippte Zahl ab, damit die nächste Platz hat. Eine Rechenart nimmt X und Y und legt das Ergebnis nach X.</p>
          <div class="mini-stacks">${stackPic('3 ENTER↑', [0, 0, 3, 3])}${stackPic('4', [0, 0, 3, 4])}${stackPic('+', [0, 0, 0, 7])}</div>
          <p class="note">Unter dem Rechner siehst du den Stapel jederzeit live.</p>`,
      },
      {
        h: 'Klammern? Brauchst du nicht.',
        body: () => `<p>(3 + 4) × 5 tippst du einfach der Reihe nach. Das Zwischenergebnis 7 bleibt in X liegen, und × rechnet damit weiter:</p>
          <p class="seq">${keys('3 ENTER↑ 4 + 5 ×')} <span class="res">→ 35</span></p>
          <p class="tip"><b>Merke:</b> ENTER brauchst du nur <b>zwischen zwei Zahlen</b>, die direkt hintereinander kommen. Nach einer Rechenart nicht.</p>`,
      },
      {
        h: 'Probier’s aus!',
        body: () => `<p>Drei kleine Aufgaben – der Rechner merkt, wenn du richtig liegst:</p>
          <ol class="tasks-preview"><li>12 + 30</li><li>(3 + 4) × 5</li><li>100 ÷ (2 + 3)</li></ol>
          <p>Wenn du nicht weiterweißt, tippe in der Aufgabe auf „Tipp“.</p>`,
      },
    ],
    task: 'Aufgabe {n}/{m}: Rechne',
    hint: 'Tipp',
    right: 'Richtig!',
    done: 'Geschafft – du kannst RPN! 🎉',
    quit: 'Beenden',
  },
  en: {
    title: 'RPN in one minute',
    next: 'Next',
    back: 'Back',
    start: 'Let’s go',
    cards: [
      {
        h: 'No = key? Exactly!',
        body: () => `<p>This calculator uses [[rpn|RPN]]: <b>first the numbers, then the operation.</b> For 3 + 4 you type:</p>
          <p class="seq">${keys('3 ENTER↑ 4 +')} <span class="res">→ 7</span></p>
          <p>Feels unusual – but saves keystrokes and parentheses. Engineers loved it for exactly that.</p>`,
      },
      {
        h: 'ENTER means: put the number down',
        body: () => `<p>The calculator has a [[stack|stack]] with four places: T, Z, Y and X. <b>X is what the display shows.</b> ENTER puts the typed number down so the next one has room. An operation takes X and Y and puts the result into X.</p>
          <div class="mini-stacks">${stackPic('3 ENTER↑', [0, 0, 3, 3])}${stackPic('4', [0, 0, 3, 4])}${stackPic('+', [0, 0, 0, 7])}</div>
          <p class="note">Below the calculator you can watch the stack live at any time.</p>`,
      },
      {
        h: 'Parentheses? Not needed.',
        body: () => `<p>Just type (3 + 4) × 5 from left to right. The intermediate result 7 stays in X, and × carries on with it:</p>
          <p class="seq">${keys('3 ENTER↑ 4 + 5 ×')} <span class="res">→ 35</span></p>
          <p class="tip"><b>Remember:</b> you only need ENTER <b>between two numbers</b> typed right after each other. Not after an operation.</p>`,
      },
      {
        h: 'Try it!',
        body: () => `<p>Three small exercises – the calculator notices when you get it right:</p>
          <ol class="tasks-preview"><li>12 + 30</li><li>(3 + 4) × 5</li><li>100 ÷ (2 + 3)</li></ol>
          <p>If you get stuck, tap “Hint” in the exercise.</p>`,
      },
    ],
    task: 'Exercise {n}/{m}: compute',
    hint: 'Hint',
    right: 'Correct!',
    done: 'Done – you can do RPN! 🎉',
    quit: 'Quit',
  },
};

export const TASKS = [
  { q: '12 + 30', target: 42, hint: '12 ENTER↑ 30 +' },
  { q: '(3 + 4) × 5', target: 35, hint: '3 ENTER↑ 4 + 5 ×' },
  { q: '100 ÷ (2 + 3)', target: 20, hint: '100 ENTER↑ 2 ENTER↑ 3 + ÷' },
];

const tx = () => TEXT[getLang()] ?? TEXT.en;

/** Open the guide. `onStartTasks` is called when the user starts the exercises. */
export function openRpnGuide(onStartTasks, card = 0) {
  const T = tx();
  const c = T.cards[card];
  const last = card === T.cards.length - 1;
  const dots = T.cards.map((_, i) => `<span class="dot${i === card ? ' on' : ''}"></span>`).join('');
  const body = openSheet({
    title: T.title,
    className: 'sheet-guide',
    html: `
      <h3 class="card-h">${c.h}</h3>
      <div class="card-body"></div>
      <div class="card-nav">
        <button type="button" class="pill" data-nav="back" ${card === 0 ? 'hidden' : ''}>${T.back}</button>
        <span class="dots">${dots}</span>
        <button type="button" class="pill primary" data-nav="${last ? 'start' : 'next'}">${last ? T.start : T.next}</button>
      </div>`,
  });
  // rich() escapes HTML – the card bodies are trusted markup, so render them directly
  body.querySelector('.card-body').innerHTML = c.body().replace(/\[\[([a-z]+)\|([^\]]+)\]\]/g, '<button type="button" class="term" data-term="$1">$2</button>');
  body.querySelector('.card-nav').addEventListener('click', (e) => {
    const b = e.target.closest('[data-nav]');
    if (!b) return;
    if (b.dataset.nav === 'next') openRpnGuide(onStartTasks, card + 1);
    if (b.dataset.nav === 'back') openRpnGuide(onStartTasks, card - 1);
    if (b.dataset.nav === 'start') {
      closeSheet();
      onStartTasks();
    }
  });
}

export function taskTexts() {
  return tx();
}

export { keys };

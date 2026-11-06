// 15-position red LED display, drawn as SVG seven-segment digits.
// On the HP-45 the decimal point occupies a digit position of its own.

const NS = 'http://www.w3.org/2000/svg';
const CELLS = 15;
const CW = 22; // cell width
const CH = 40; // cell height

// segments: a b c d e f g
const MAP = {
  0: 'abcdef', 1: 'bc', 2: 'abdeg', 3: 'abcdg', 4: 'bcfg', 5: 'acdfg',
  6: 'acdefg', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg', '-': 'g', ' ': '',
  E: 'adefg', r: 'eg', o: 'cdeg',
};

function hseg(x1, x2, y, t) {
  const h = t / 2;
  return `${x1},${y} ${x1 + h},${y - h} ${x2 - h},${y - h} ${x2},${y} ${x2 - h},${y + h} ${x1 + h},${y + h}`;
}

function vseg(x, y1, y2, t) {
  const h = t / 2;
  return `${x},${y1} ${x + h},${y1 + h} ${x + h},${y2 - h} ${x},${y2} ${x - h},${y2 - h} ${x - h},${y1 + h}`;
}

function segmentPolys(ox) {
  const t = 3.4;
  const x0 = ox + 5;
  const y0 = 6;
  const w = 12;
  const h = 26;
  const m = y0 + h / 2;
  return {
    a: hseg(x0 + 1, x0 + w - 1, y0, t),
    g: hseg(x0 + 1, x0 + w - 1, m, t),
    d: hseg(x0 + 1, x0 + w - 1, y0 + h, t),
    f: vseg(x0, y0 + 1, m - 1, t),
    b: vseg(x0 + w, y0 + 1, m - 1, t),
    e: vseg(x0, m + 1, y0 + h - 1, t),
    c: vseg(x0 + w, m + 1, y0 + h - 1, t),
  };
}

export class LedDisplay {
  constructor(container) {
    this.svg = document.createElementNS(NS, 'svg');
    this.svg.setAttribute('viewBox', `0 0 ${CELLS * CW} ${CH}`);
    this.svg.setAttribute('class', 'led');
    this.svg.setAttribute('role', 'img');
    this.svg.innerHTML = `
      <defs>
        <filter id="ledglow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.1" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id="lens" cx="45%" cy="35%" r="65%">
          <stop offset="0" stop-color="#fff" stop-opacity=".16"/>
          <stop offset=".45" stop-color="#fff" stop-opacity=".03"/>
          <stop offset="1" stop-color="#000" stop-opacity=".35"/>
        </radialGradient>
      </defs>`;
    this.cells = [];
    for (let i = 0; i < CELLS; i++) {
      const ox = i * CW;
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('transform', `skewX(-7) translate(${3},0)`);
      const segs = {};
      const polys = segmentPolys(ox);
      for (const [name, pts] of Object.entries(polys)) {
        const p = document.createElementNS(NS, 'polygon');
        p.setAttribute('points', pts);
        p.setAttribute('class', 'seg');
        g.appendChild(p);
        segs[name] = p;
      }
      const dp = document.createElementNS(NS, 'circle');
      dp.setAttribute('cx', ox + 11);
      dp.setAttribute('cy', 32);
      dp.setAttribute('r', 2);
      dp.setAttribute('class', 'seg');
      g.appendChild(dp);
      segs.dp = dp;
      this.svg.appendChild(g);
      // bubble magnifier lens over every digit (like the HP-35/45 LED modules)
      const lens = document.createElementNS(NS, 'ellipse');
      lens.setAttribute('cx', ox + CW / 2 + 1);
      lens.setAttribute('cy', CH / 2);
      lens.setAttribute('rx', CW / 2 - 1);
      lens.setAttribute('ry', CH / 2 - 3);
      lens.setAttribute('fill', 'url(#lens)');
      lens.setAttribute('class', 'lens');
      this.svg.appendChild(lens);
      this.cells.push(segs);
    }
    container.appendChild(this.svg);
    this.current = null;
  }

  /** @param {string|null} text 15 characters, or null for a blank display */
  show(text) {
    if (text === this.current) return;
    this.current = text;
    const s = (text ?? '').padEnd(CELLS, ' ');
    this.svg.setAttribute('aria-label', text ? text.trim() : '');
    for (let i = 0; i < CELLS; i++) {
      const ch = s[i];
      const on = ch === '.' ? '' : MAP[ch] ?? '';
      const segs = this.cells[i];
      for (const name of 'abcdefg') segs[name].classList.toggle('on', on.includes(name));
      segs.dp.classList.toggle('on', ch === '.');
    }
  }
}

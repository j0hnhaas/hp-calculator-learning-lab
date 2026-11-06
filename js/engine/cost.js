// What did a calculation cost? Counted in whole-number additions/subtractions
// (each on a 10–13 digit register) plus the few real divisions at the end.

export function costOf(steps) {
  let adds = 0;
  let divs = 0;
  for (const s of steps) {
    switch (s.algo) {
      case 'trig':
      case 'atan':
      case 'ln':
      case 'exp':
        if (s.phase === 'pdiv') adds += 1; // one subtraction (or the try that did not fit)
        else if (s.phase === 'pmul') adds += s.algo === 'exp' ? 1 : 2; // X and Y
        else if (s.phase === 'vec' && s.msg?.[0] !== 'atan.start') adds += 2;
        else if (s.phase === 'sum') adds += 1;
        else if (s.phase === 'resid') divs += 1;
        else if (s.phase === 'final' && s.algo === 'trig') divs += s.fn === 'tan' ? 1 : 2;
        break;
      case 'sqrt':
        if (s.phase === 'digit') adds += s.digit + 1;
        break;
      case 'add':
        if (s.phase === 'align') adds += 1;
        break;
      case 'mul':
        if (s.phase === 'mdigit') adds += s.digit;
        break;
      case 'div':
        if (s.phase === 'qdigit') adds += s.digit + 1;
        break;
      case 'binrot':
      case 'binvec':
        if (s.phase === 'rot') adds += 3; // X, Y and Z
        break;
      default:
    }
  }
  return { adds, divs };
}

// Keyboards of the HP-35 (1972) and HP-45 (1973) – both have 35 keys.
// HP-45: primary legend on the key, gold (shifted) legend above it.
// HP-35: one function per key, ARC is a prefix for the inverse trig functions.
// `kb` lists PC keyboard shortcuts.

export const KEY_ROWS = [
  [
    { id: 'shift', label: '', style: 'gold', kb: ['f', 'F'] },
    { id: 'inv', label: '1/x', gold: 'yˣ', gid: 'pow' },
    { id: 'ln', label: 'ln', gold: 'log', gid: 'log', kb: ['l'] },
    { id: 'exp', label: 'eˣ', gold: '10ˣ', gid: 'exp10' },
    { id: 'fix', label: 'FIX', gold: 'SCI', gid: 'sci' },
  ],
  [
    { id: 'sq', label: 'x²', gold: '√x', gid: 'sqrt', kb: ['q'] },
    { id: 'toP', label: '→P', gold: '→R', gid: 'toR' },
    { id: 'sin', label: 'SIN', gold: 'SIN⁻¹', gid: 'asin', kb: ['s'] },
    { id: 'cos', label: 'COS', gold: 'COS⁻¹', gid: 'acos', kb: ['c'] },
    { id: 'tan', label: 'TAN', gold: 'TAN⁻¹', gid: 'atan', kb: ['t'] },
  ],
  [
    { id: 'swap', label: 'x⇄y', gold: 'n!', gid: 'fact', kb: ['x'] },
    { id: 'rdn', label: 'R↓', gold: 'x̄, s', gid: 'mean', kb: ['r'] },
    { id: 'sto', label: 'STO', gold: '→D.MS', gid: 'toDMS' },
    { id: 'rcl', label: 'RCL', gold: 'D.MS→', gid: 'fromDMS' },
    { id: 'pct', label: '%', gold: 'Δ%', gid: 'dpct', kb: ['%'] },
  ],
  [
    { id: 'enter', label: 'ENTER ↑', gold: 'DEG', gid: 'deg', wide: true, style: 'blue', kb: ['Enter'] },
    { id: 'chs', label: 'CHS', gold: 'RAD', gid: 'rad', style: 'blue', kb: ['n', '_'] },
    { id: 'eex', label: 'EEX', gold: 'GRD', gid: 'grd', style: 'blue', kb: ['e', 'E'] },
    { id: 'clx', label: 'CLx', gold: 'CLEAR', gid: 'clear', style: 'blue', kb: ['Backspace', 'Delete', 'Escape'] },
  ],
  [
    { id: 'sub', label: '−', style: 'blue', kb: ['-'] },
    { id: 'd7', label: '7', gold: 'cm/in', gid: 'cmin', style: 'light', kb: ['7'] },
    { id: 'd8', label: '8', gold: 'kg/lb', gid: 'kglb', style: 'light', kb: ['8'] },
    { id: 'd9', label: '9', gold: 'ltr/gal', gid: 'ltrgal', style: 'light', kb: ['9'] },
  ],
  [
    { id: 'add', label: '+', style: 'blue', kb: ['+'] },
    { id: 'd4', label: '4', style: 'light', kb: ['4'] },
    { id: 'd5', label: '5', style: 'light', kb: ['5'] },
    { id: 'd6', label: '6', style: 'light', kb: ['6'] },
  ],
  [
    { id: 'mul', label: '×', style: 'blue', kb: ['*'] },
    { id: 'd1', label: '1', style: 'light', kb: ['1'] },
    { id: 'd2', label: '2', style: 'light', kb: ['2'] },
    { id: 'd3', label: '3', style: 'light', kb: ['3'] },
  ],
  [
    { id: 'div', label: '÷', style: 'blue', kb: ['/'] },
    { id: 'd0', label: '0', gold: 'LAST x', gid: 'lastx', style: 'light', kb: ['0'] },
    { id: 'dot', label: '•', gold: 'π', gid: 'pi', style: 'light', kb: ['.', ','] },
    { id: 'sigma', label: 'Σ+', gold: 'Σ−', gid: 'sigmaMinus', style: 'light' },
  ],
];

const lower = (last) => [
  [
    { id: 'sub', label: '−', style: 'blue', kb: ['-'] },
    { id: 'd7', label: '7', style: 'light', kb: ['7'] },
    { id: 'd8', label: '8', style: 'light', kb: ['8'] },
    { id: 'd9', label: '9', style: 'light', kb: ['9'] },
  ],
  [
    { id: 'add', label: '+', style: 'blue', kb: ['+'] },
    { id: 'd4', label: '4', style: 'light', kb: ['4'] },
    { id: 'd5', label: '5', style: 'light', kb: ['5'] },
    { id: 'd6', label: '6', style: 'light', kb: ['6'] },
  ],
  [
    { id: 'mul', label: '×', style: 'blue', kb: ['*'] },
    { id: 'd1', label: '1', style: 'light', kb: ['1'] },
    { id: 'd2', label: '2', style: 'light', kb: ['2'] },
    { id: 'd3', label: '3', style: 'light', kb: ['3'] },
  ],
  [
    { id: 'div', label: '÷', style: 'blue', kb: ['/'] },
    { id: 'd0', label: '0', style: 'light', kb: ['0'] },
    { id: 'dot', label: '•', style: 'light', kb: ['.', ','] },
    last,
  ],
];

export const KEY_ROWS_35 = [
  [
    { id: 'pow35', label: 'xʸ', kb: ['^'] },
    { id: 'log', label: 'log', kb: ['g'] },
    { id: 'ln', label: 'ln', kb: ['l'] },
    { id: 'exp', label: 'eˣ' },
    { id: 'clr', label: 'CLR', style: 'blue' },
  ],
  [
    { id: 'sqrt', label: '√x', kb: ['q'] },
    { id: 'arc', label: 'arc', kb: ['a', 'f', 'F'] },
    { id: 'sin', label: 'sin', kb: ['s'] },
    { id: 'cos', label: 'cos', kb: ['c'] },
    { id: 'tan', label: 'tan', kb: ['t'] },
  ],
  [
    { id: 'inv', label: '1/x' },
    { id: 'swap', label: 'x⇄y', kb: ['x'] },
    { id: 'rdn', label: 'R↓', kb: ['r'] },
    { id: 'sto', label: 'STO' },
    { id: 'rcl', label: 'RCL' },
  ],
  [
    { id: 'enter', label: 'ENTER ↑', wide: true, style: 'blue', kb: ['Enter'] },
    { id: 'chs', label: 'CHS', style: 'blue', kb: ['n', '_'] },
    { id: 'eex', label: 'EEX', style: 'blue', kb: ['e', 'E'] },
    { id: 'clx', label: 'CLx', style: 'blue', kb: ['Backspace', 'Delete', 'Escape'] },
  ],
  ...lower({ id: 'pi', label: 'π', style: 'light', kb: ['p'] }),
];

// HP-55 (1975): two prefix keys – f (gold, legend above the key) and
// g (blue, legend below the key). Programming keys (R/S, SST, BST, GTO) and
// the TIMER/PRGM/RUN switch follow in part 2.
export const KEY_ROWS_55 = [
  [
    { id: 'sigma55', label: 'Σ+', gold: 'Σ−', gid: 'sigmaMinus55' },
    { id: 'pow', label: 'yˣ', gold: 'SIN', gid: 'sin', blue: 'SIN⁻¹', bid: 'asin', kb: ['s'] },
    { id: 'inv', label: '1/x', gold: 'COS', gid: 'cos', blue: 'COS⁻¹', bid: 'acos', kb: ['c'] },
    { id: 'pct', label: '%', gold: 'TAN', gid: 'tan', blue: 'TAN⁻¹', bid: 'atan', kb: ['t', '%'] },
    { id: 'bst', label: 'BST' },
  ],
  [
    { id: 'yhat', label: 'ŷ', gold: 'L.R.', gid: 'lr' },
    { id: 'swap', label: 'x⇄y', gold: 'ln', gid: 'ln', blue: 'eˣ', bid: 'exp', kb: ['x'] },
    { id: 'rdn', label: 'R↓', gold: 'log', gid: 'log', blue: '10ˣ', bid: 'exp10', kb: ['r'] },
    { id: 'fix', label: 'FIX', gold: 'SCI', gid: 'sci' },
    { id: 'sst', label: 'SST' },
  ],
  [
    { id: 'fkey', label: 'f', style: 'gold', kb: ['f', 'F'] },
    { id: 'gkey', label: 'g', style: 'skyblue', kb: ['g', 'G'] },
    { id: 'sto', label: 'STO', gold: 'x̄', gid: 'mean55', blue: 's', bid: 'sdev55' },
    { id: 'rcl', label: 'RCL', gold: 'LAST x', gid: 'lastx' },
    { id: 'gto', label: 'GTO', gold: 'x≤y', gid: 'xle', blue: 'x=y', bid: 'xeq' },
  ],
  [
    { id: 'enter', label: 'ENTER ↑', gold: 'H.MS+', gid: 'hmsAdd', blue: 'H.MS−', bid: 'hmsSub', wide: true, style: 'blue', kb: ['Enter'] },
    { id: 'chs', label: 'CHS', gold: '√x', gid: 'sqrt', blue: 'x²', bid: 'sq', style: 'blue', kb: ['n', '_'] },
    { id: 'eex', label: 'EEX', gold: 'n!', gid: 'fact', style: 'blue', kb: ['e', 'E'] },
    { id: 'clx', label: 'CLx', gold: 'CLR', gid: 'clr55', blue: 'CL.R', bid: 'clrR', style: 'blue', kb: ['Backspace', 'Delete', 'Escape'] },
  ],
  [
    { id: 'sub', label: '−', gold: 'DEG', gid: 'deg', style: 'blue', kb: ['-'] },
    { id: 'd7', label: '7', gold: 'in→', gid: 'in2mm', blue: '←mm', bid: 'mm2in', style: 'light', kb: ['7'] },
    { id: 'd8', label: '8', gold: 'ft→', gid: 'ft2m', blue: '←m', bid: 'm2ft', style: 'light', kb: ['8'] },
    { id: 'd9', label: '9', gold: 'gal→', gid: 'gal2l', blue: '←l', bid: 'l2gal', style: 'light', kb: ['9'] },
  ],
  [
    { id: 'add', label: '+', gold: 'RAD', gid: 'rad', style: 'blue', kb: ['+'] },
    { id: 'd4', label: '4', gold: 'lbm→', gid: 'lbm2kg', blue: '←kg', bid: 'kg2lbm', style: 'light', kb: ['4'] },
    { id: 'd5', label: '5', gold: 'lbf→', gid: 'lbf2n', blue: '←N', bid: 'n2lbf', style: 'light', kb: ['5'] },
    { id: 'd6', label: '6', gold: '°F→', gid: 'f2c', blue: '←°C', bid: 'c2f', style: 'light', kb: ['6'] },
  ],
  [
    { id: 'mul', label: '×', gold: 'GRD', gid: 'grd', style: 'blue', kb: ['*'] },
    { id: 'd1', label: '1', gold: 'H→', gid: 'toDMS', blue: '←H.MS', bid: 'fromDMS', style: 'light', kb: ['1'] },
    { id: 'd2', label: '2', gold: 'D→', gid: 'd2r', blue: '←R', bid: 'r2d', style: 'light', kb: ['2'] },
    { id: 'd3', label: '3', gold: 'Btu→', gid: 'btu2j', blue: '←J', bid: 'j2btu', style: 'light', kb: ['3'] },
  ],
  [
    { id: 'div', label: '÷', style: 'blue', kb: ['/'] },
    { id: 'd0', label: '0', gold: 'R→', gid: 'toP', blue: '←P', bid: 'toR', style: 'light', kb: ['0'] },
    { id: 'dot', label: '•', gold: 'π', gid: 'pi', style: 'light', kb: ['.', ','] },
    { id: 'rs', label: 'R/S', style: 'light' },
  ],
];

export const KEY_LAYOUTS = { 35: KEY_ROWS_35, 45: KEY_ROWS, 55: KEY_ROWS_55 };

export const ALL_KEYS = KEY_ROWS.flat();

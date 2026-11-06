// Constant tables – the "ROM" of our calculator.
//
// The HP-35/45 did not compute these at run time; they were stored as BCD
// constants in the ROM. Decimal CORDIC (Meggitt's pseudo-division /
// pseudo-multiplication) only needs one constant per decade j:
//
//   trigonometry:  atan(10^-j)       j = 0 … 4
//   logarithms:    ln(1 + 10^-j)     j = 0 … 6
//
// Values below are given to 25+ digits and truncated to the internal
// precision by fx().

import { fx } from './decimal.js';

export const PI = fx('3.14159265358979323846264338');
export const HALF_PI = PI / 2n;
export const LN10 = fx('2.30258509299404568401799145');

/**
 * Number of decades used for trigonometry. After the last decade the
 * remaining angle r is below 10^-6, so the approximation tan r ≈ r is good
 * to about 13 digits.
 */
export const TRIG_DECADES = 7;
/**
 * Number of decades used for ln / e^x. The residual after the last decade is
 * below 10^-8, so ln(1+r) ≈ r is good to about 16 digits – needed because
 * ln x for x close to 1 suffers from cancellation.
 */
export const LOG_DECADES = 9;

export const ATAN_STR = [
  '0.78539816339744830961566085', // atan(1) = π/4
  '0.09966865249116202737844612', // atan(0.1)
  '0.00999966668666523820634012', // atan(0.01)
  '0.00099999966666686666652381', // atan(0.001)
  '0.00009999999966666666866667', // atan(0.0001)
  '0.00000999999999966666666669', // atan(0.00001)
  '0.00000099999999999966666667', // atan(0.000001)
];

export const LN_STR = [
  '0.69314718055994530941723212', // ln(2)
  '0.09531017980432486004395212', // ln(1.1)
  '0.00995033085316808284821536', // ln(1.01)
  '0.00099950033308353316680940', // ln(1.001)
  '0.00009999500033330833533317', // ln(1.0001)
  '0.00000999995000033333083335', // ln(1.00001)
  '0.00000099999950000033333308', // ln(1.000001)
  '0.00000009999999500000033333', // ln(1.0000001)
  '0.00000000999999995000000033', // ln(1.00000001)
];

export const ATAN = ATAN_STR.map((s) => fx(s));
export const LN = LN_STR.map((s) => fx(s));

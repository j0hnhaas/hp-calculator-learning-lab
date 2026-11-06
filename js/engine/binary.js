// Classic binary CORDIC (Volder 1959) – for comparison with HP's decimal variant.
//
// Rotation mode:  every iteration i rotates by +atan(2^-i) or −atan(2^-i);
//                 the direction is chosen so the remaining angle Z goes to 0.
//                   X' = X − σ·Y·2^-i     Y' = Y + σ·X·2^-i     Z' = Z − σ·atan(2^-i)
// Vectoring mode: the direction is chosen so that Y goes to 0; Z collects the angle.
//
// Each rotation also stretches the vector by √(1+4^-i). In total this gain is
// 1/K ≈ 1.6468, so the start vector is (K, 0) and sin/cos come out directly.
//
// Values are binary fixed point with BITS fractional bits (BigInt). For the
// lab, every step also carries the vector in the decimal fixed point of the
// rest of the engine.

import { S } from './decimal.js';
import { PI } from './constants.js';
import { reduceAngle, unreduce, tracer, finish, MODES, OVERFLOW, CalcError } from './functions.js';
import { fromNumber, decExponent, div } from './decimal.js';

export const BITS = 72;
export const B = 1n << BigInt(BITS);
/** iterations: 2^-36 ≈ 1.5·10^-11 – enough for 10 decimal digits */
export const ITER = 36;

const toBin = (v) => (v * B) / S; // decimal fixed → binary fixed
const toDec = (v) => (v * S) / B; // binary fixed → decimal fixed

/** atan(2^-i) via its power series, computed once at start-up ("the ROM") */
function atanPow2(i) {
  if (i === 0) return toBin(PI / 4n);
  let sum = 0n;
  let term = B >> BigInt(i); // x^(2k+1) with x = 2^-i
  for (let k = 0; term > 0n; k++) {
    const t = term / BigInt(2 * k + 1);
    sum += k % 2 === 0 ? t : -t;
    term >>= BigInt(2 * i);
  }
  return sum;
}

function isqrt(n) {
  if (n < 2n) return n;
  let x = BigInt(Math.floor(Math.sqrt(Number(n))));
  for (;;) {
    const y = (x + n / x) >> 1n;
    if (y >= x && y - x <= 1n) return x;
    x = y;
  }
}

export const ATAN2 = Array.from({ length: ITER }, (_, i) => atanPow2(i));

/** K = Π 1/√(1+4^-i) */
export const K = (() => {
  let p = B; // Π (1 + 4^-i)
  for (let i = 0; i < ITER; i++) p += p >> BigInt(2 * i);
  return (B * B) / isqrt(p * B);
})();

/** Binary string of a fixed-point value: sign, 1 integer bit, `frac` fractional bits */
export function bits(v, frac = 28) {
  const neg = v < 0n;
  const a = neg ? -v : v;
  const int = (a >> BigInt(BITS)).toString(2);
  const f = ((a & (B - 1n)) >> BigInt(BITS - frac)).toString(2).padStart(frac, '0');
  return `${neg ? '-' : ''}${int}.${f}`;
}

const snap = (X, Y, Z) => ({ X: bits(X), Y: bits(Y), Z: bits(Z) });

/** Rotation mode: θ (decimal fixed, 0 <= θ < π/2) → vector (cos θ, sin θ) */
export function binRotate(thetaDec, T) {
  let X = K;
  let Y = 0n;
  let Z = toBin(thetaDec);
  const sig = [];
  T?.({ algo: 'binrot', phase: 'init', j: 0, i: 0, sig: [], regs: snap(X, Y, Z), vec: { X: toDec(X), Y: toDec(Y) }, z: toDec(Z), msg: ['bin.init'] });
  for (let i = 0; i < ITER; i++) {
    const sigma = Z >= 0n ? 1n : -1n;
    const sx = Y >> BigInt(i);
    const sy = X >> BigInt(i);
    X -= sigma * sx;
    Y += sigma * sy;
    Z -= sigma * ATAN2[i];
    sig.push(sigma > 0n ? 1 : -1);
    T?.({ algo: 'binrot', phase: 'rot', i, j: i, sig: [...sig], regs: snap(X, Y, Z), vec: { X: toDec(X), Y: toDec(Y) }, z: toDec(Z), msg: ['bin.rot', { i, plus: sigma > 0n }] });
  }
  return { X, Y };
}

/** Vectoring mode: (X0, Y0) with X0 > 0 (binary fixed) → angle (binary fixed) */
export function binVector(X0, Y0, T) {
  let X = X0;
  let Y = Y0;
  let Z = 0n;
  const sig = [];
  T?.({ algo: 'binvec', phase: 'start', j: 0, i: 0, sig: [], regs: snap(X, Y, Z), vec: { X: toDec(X), Y: toDec(Y) }, z: 0n, msg: ['binvec.start'] });
  for (let i = 0; i < ITER; i++) {
    const sigma = Y >= 0n ? -1n : 1n;
    const sx = Y >> BigInt(i);
    const sy = X >> BigInt(i);
    X -= sigma * sx;
    Y += sigma * sy;
    Z -= sigma * ATAN2[i];
    sig.push(sigma < 0n ? 1 : -1);
    T?.({ algo: 'binvec', phase: 'rot', i, j: i, sig: [...sig], regs: snap(X, Y, Z), vec: { X: toDec(X), Y: toDec(Y) }, z: toDec(Z), msg: ['binvec.rot', { i, plus: sigma < 0n }] });
  }
  return Z;
}

/** sin / cos / tan with binary CORDIC (same argument reduction as the HP-45) */
export function binTrig(fn, x, mode = 'DEG', trace) {
  const T = tracer(trace);
  const { neg, quadrant, theta } = reduceAngle(fn, x, mode, T, 'binrot');
  const { X, Y } = binRotate(theta, T);
  const sinA = toDec(Y);
  const cosA = toDec(X);
  let result;
  if (fn === 'tan') {
    const [num, den] = quadrant % 2 === 0 ? [sinA, cosA] : [cosA, sinA];
    if (den === 0n) result = OVERFLOW;
    else {
      let t = div(num, den);
      if (quadrant % 2 === 1) t = -t;
      if (neg) t = -t;
      result = finish(t);
    }
  } else {
    result = finish(unreduce(fn, sinA, cosA, quadrant, neg));
  }
  T?.({ algo: 'binrot', phase: 'final', fn, regs: snap(X, Y, 0n), vec: { X: cosA, Y: sinA }, result, msg: ['bin.final.' + fn] });
  return result;
}

/** atan with binary CORDIC (vectoring mode) */
export function binAtan(x, mode = 'DEG', trace) {
  const T = tracer(trace);
  const M = MODES[mode];
  if (Math.abs(x) < 1e-9) return finish(M.fromRad(fromNumber(x)));
  const e = decExponent(Math.max(1, Math.abs(x)));
  const X0 = toBin(fromNumber(1, -e));
  const Y0 = toBin(fromNumber(Math.abs(x), -e));
  let theta = toDec(binVector(X0, Y0, T));
  if (x < 0) theta = -theta;
  const result = finish(M.fromRad(theta));
  T?.({ algo: 'binvec', phase: 'final', regs: { Z: bits(toBin(theta)) }, result, msg: ['binvec.final', { mode }] });
  return result;
}

export { CalcError };

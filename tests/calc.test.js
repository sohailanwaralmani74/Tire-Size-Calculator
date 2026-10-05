/**
 * @file Unit test suite for Wanjaaro Tire & Wheel Calculator pure calculation module.
 * Runnable with Node's built-in test runner (`node --test tests/calc.test.js`).
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mmToInches,
  inchesToMm,
  calculateTireMetrics,
  parseTireSizeString,
  compareTires,
  calculateWheelGeometry,
  compareWheels,
  calculateCombinedFitment,
  calculateGearing,
  calculateSpeedometer,
  decodeTireCode,
} from '../src/calc/tireMath.js';

test('Required Fixture 1: 265/70R17 exact verification', () => {
  const res = calculateTireMetrics({ widthMm: 265, aspectRatio: 70, rimDiameterIn: 17 });
  assert.equal(res.valid, true);
  const d = res.data;

  // sidewall 185.5 mm
  assert.equal(d.sidewallMm, 185.5);
  // diameter 802.8 mm (31.61 in)
  assert.equal(d.diameterMm, 802.8);
  assert.equal(d.diameterIn, 31.61);
  // circumference about 2522 mm (802.8 * pi = 2522.07058...)
  assert.equal(Math.round(d.circumferenceMm), 2522);
  // about 638 revs/mile (1609344 / 2522.07058 = 638.104...)
  assert.equal(Math.round(d.revsPerMile), 638);
});

test('Required Fixture 2: 285/75R17 exact verification', () => {
  const res = calculateTireMetrics({ widthMm: 285, aspectRatio: 75, rimDiameterIn: 17 });
  assert.equal(res.valid, true);
  const d = res.data;

  // sidewall 213.75 mm
  assert.equal(d.sidewallMm, 213.75);
  // diameter 859.3 mm (33.83 in)
  assert.equal(d.diameterMm, 859.3);
  assert.equal(d.diameterIn, 33.83);
  // circumference about 2700 mm (859.3 * pi = 2699.5705...)
  assert.equal(Math.round(d.circumferenceMm), 2700);
  // about 596 revs/mile (1609344 / 2699.5705 = 596.148...)
  assert.equal(Math.round(d.revsPerMile), 596);
});

test('Required Fixture 3: 265/70R17 to 285/75R17 comparison & speedometer at 60 mph', () => {
  const comp = compareTires(
    { widthMm: 265, aspectRatio: 70, rimDiameterIn: 17 },
    { widthMm: 285, aspectRatio: 75, rimDiameterIn: 17 }
  );
  assert.equal(comp.valid, true);
  const diff = comp.data.diff;

  // +56.5 mm (+2.22 in) diameter
  assert.equal(diff.diameterMm, 56.5);
  assert.equal(diff.diameterIn, 2.22);
  // +7.04%
  assert.equal(diff.diameterPct, 7.04);
  // +20 mm width
  assert.equal(diff.widthMm, 20);
  // about +28 mm at the axle (56.5 / 2 = 28.25 mm)
  assert.equal(diff.axleClearanceMm, 28.25);
  assert.equal(Math.round(diff.axleClearanceMm), 28);

  // indicated 60 mph reads about 64.2 mph actual
  const speed = calculateSpeedometer({
    oldDiameterMm: comp.data.oldTire.diameterMm,
    newDiameterMm: comp.data.newTire.diameterMm,
  });
  assert.equal(speed.valid, true);
  const row60 = speed.data.rows.find((r) => r.indicatedMph === 60);
  assert.ok(row60);
  assert.equal(row60.actualMph, 64.2);
});

test('Common passenger size: 225/45R17 and string parsing', () => {
  const parsed = parseTireSizeString('225/45R17');
  assert.equal(parsed.valid, true);
  const res = calculateTireMetrics(parsed.data);
  assert.equal(res.valid, true);
  assert.equal(res.data.sidewallMm, 101.25);
  assert.equal(res.data.diameterMm, 634.3);
});

test('Small and large tires & decimal inputs', () => {
  // Small compact tire: 145/80R12
  const small = calculateTireMetrics({ widthMm: 145, aspectRatio: 80, rimDiameterIn: 12 });
  assert.equal(small.valid, true);
  assert.equal(small.data.sidewallMm, 116);
  assert.equal(small.data.diameterMm, 536.8);

  // Large commercial/off-road metric tire: 385/65R22.5 (decimal rim)
  const large = calculateTireMetrics({ widthMm: 385, aspectRatio: 65, rimDiameterIn: 22.5 });
  assert.equal(large.valid, true);
  assert.equal(large.data.sidewallMm, 250.25);
  assert.equal(large.data.diameterMm, 1072);
});

test('Unit conversion helpers (mm <-> inches)', () => {
  assert.equal(inchesToMm(1), 25.4);
  assert.equal(Number(inchesToMm(17).toFixed(2)), 431.8);
  assert.equal(mmToInches(25.4), 1);
  assert.equal(mmToInches(802.8).toFixed(2), '31.61');
});

test('Invalid, missing, and out-of-range inputs return structured errors and never NaN', () => {
  const missingWidth = calculateTireMetrics({ widthMm: '', aspectRatio: 70, rimDiameterIn: 17 });
  assert.equal(missingWidth.valid, false);
  assert.equal(missingWidth.error.code, 'MISSING_WIDTH');

  const nonNumeric = calculateTireMetrics({ widthMm: 'abc', aspectRatio: 70, rimDiameterIn: 17 });
  assert.equal(nonNumeric.valid, false);
  assert.equal(nonNumeric.error.code, 'NON_NUMERIC_WIDTH');

  const outOfRangeRim = calculateTireMetrics({ widthMm: 265, aspectRatio: 70, rimDiameterIn: 50 });
  assert.equal(outOfRangeRim.valid, false);
  assert.equal(outOfRangeRim.error.code, 'OUT_OF_RANGE_RIM');

  const badString = parseTireSizeString('not-a-tire');
  assert.equal(badString.valid, false);
  assert.equal(badString.error.code, 'INVALID_FORMAT');
});

test('Wheel offset geometry: positive, zero, and negative offsets + comparison', () => {
  // Positive offset: 17x8 ET45 (W = 203.2 mm)
  const pos = calculateWheelGeometry({ rimDiameterIn: 17, rimWidthIn: 8, offsetMm: 45 });
  assert.equal(pos.valid, true);
  assert.equal(pos.data.widthMm, 203.2);
  // W/2 + ET = 101.6 + 45 = 146.6 mm inner
  assert.equal(pos.data.innerEdgeMm, 146.6);
  // W/2 - ET = 101.6 - 45 = 56.6 mm outer
  assert.equal(pos.data.outerEdgeMm, 56.6);

  // Zero offset: 17x8 ET0
  const zero = calculateWheelGeometry({ rimDiameterIn: 17, rimWidthIn: 8, offsetMm: 0 });
  assert.equal(zero.valid, true);
  assert.equal(zero.data.innerEdgeMm, 101.6);
  assert.equal(zero.data.outerEdgeMm, 101.6);

  // Negative offset: 17x9 ET-12 (W = 228.6 mm, W/2 = 114.3 mm)
  const neg = calculateWheelGeometry({ rimDiameterIn: 17, rimWidthIn: 9, offsetMm: -12 });
  assert.equal(neg.valid, true);
  assert.equal(neg.data.innerEdgeMm, 102.3);
  assert.equal(neg.data.outerEdgeMm, 126.3);

  // Compare 17x8 ET45 vs 18x9 ET20
  const comp = compareWheels(
    { rimDiameterIn: 17, rimWidthIn: 8, offsetMm: 45 },
    { rimDiameterIn: 18, rimWidthIn: 9, offsetMm: 20 }
  );
  assert.equal(comp.valid, true);
  // 18x9 ET20 has W/2 = 114.3 => inner = 134.3, outer = 94.3
  // Inner change = 134.3 - 146.6 = -12.3 mm (12.3 mm more inner clearance)
  // Outer change = 94.3 - 56.6 = +37.7 mm (37.7 mm farther outward)
  assert.equal(comp.data.diff.innerEdgeMm, -12.3);
  assert.equal(comp.data.diff.outerEdgeMm, 37.7);
  assert.equal(comp.data.diff.trackWidthChangeMm, 50);
});

test('Combined fitment, axle gearing, and decoder strict verification', () => {
  const fit = calculateCombinedFitment(
    { widthMm: 265, aspectRatio: 70, rimDiameterIn: 17, rimWidthIn: 7.5, offsetMm: 30 },
    { widthMm: 285, aspectRatio: 75, rimDiameterIn: 17, rimWidthIn: 8.5, offsetMm: 0 }
  );
  assert.equal(fit.valid, true);
  // Tire outer movement: (285/2 - 0) - (265/2 - 30) = 142.5 - 102.5 = +40 mm outward
  assert.equal(fit.data.combinedGeometry.tireOuterDiffMm, 40);

  // Gearing: 802.8 mm to 859.3 mm with 3.73 axle ratio
  const gear = calculateGearing({ oldDiameterMm: 802.8, newDiameterMm: 859.3, axleRatio: 3.73 });
  assert.equal(gear.valid, true);
  // 3.73 * (802.8 / 859.3) = 3.4847 => 3.48
  assert.equal(gear.data.effectiveRatio, 3.48);

  // Decoder: 285/75R16 116/113S
  const dec = decodeTireCode('285/75R16 116/113S');
  assert.equal(dec.valid, true);
  assert.equal(dec.data.metrics.widthMm, 285);
  assert.equal(dec.data.loadSingle.index, 116);
  assert.equal(dec.data.loadSingle.kg, 1250);
  assert.equal(dec.data.loadDual.index, 113);
  assert.equal(dec.data.loadDual.kg, 1150);
  assert.equal(dec.data.speedRating.symbol, 'S');
  assert.equal(dec.data.speedRating.mph, 112);

  // Decoder with prefix/suffix flags unverified tokens honestly
  const decPrefix = decodeTireCode('LT285/75R16 116/113S E');
  assert.equal(decPrefix.valid, true);
  assert.equal(decPrefix.data.notDecodedItems.length, 2);
});

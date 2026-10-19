/**
 * Unit test suite for Building Material & Cost Calculators calculation module.
 * Runnable with Node's built-in test runner (`node --test tests/calc.test.js`).
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateConcrete,
  calculateBrick,
  calculateCmu,
  calculateFraming,
  calculateSheathing,
  calculateDrywall,
  calculatePaint,
  calculateRoofing,
  calculateTile,
  calculateConstructionCost,
  calculateStairHandrail,
  calculateVaporBarrier,
  calculateGarageDoorSize,
  calculateDoorFrame,
  ALL_CALCULATORS,
  CALCULATOR_CATEGORIES,
} from '../src/calc/buildingMath.js';

test('Directory & Categories verification', () => {
  assert.equal(CALCULATOR_CATEGORIES.length, 5);
  assert.equal(ALL_CALCULATORS.length, 14);
  const stairCalc = ALL_CALCULATORS.find((c) => c.slug === 'stair-handrail-calculator');
  assert.ok(stairCalc, 'stair-handrail-calculator exists');
  const vaporCalc = ALL_CALCULATORS.find((c) => c.slug === 'vapor-barrier-calculator');
  assert.ok(vaporCalc, 'vapor-barrier-calculator exists');
  const garageCalc = ALL_CALCULATORS.find((c) => c.slug === 'garage-door-size-calculator');
  assert.ok(garageCalc, 'garage-door-size-calculator exists');
  const doorFrameCalc = ALL_CALCULATORS.find((c) => c.slug === 'door-frame-material-calculator');
  assert.ok(doorFrameCalc, 'door-frame-material-calculator exists');
});

test('Calculator 1: Concrete Slab 12x12 at 4" with 10% waste', () => {
  const res = calculateConcrete({
    shape: 'slab',
    lengthFt: 12,
    widthFt: 12,
    thicknessIn: 4,
    wastePct: 10,
    pricePerCuYd: 150,
    bagPrice80lb: 6.5,
    rebarSpacingIn: 18,
  });
  assert.equal(res.valid, true);
  // Raw volume: 12 * 12 * (4/12) = 48 cu ft = 1.78 cu yds
  assert.equal(res.rawCuFt, 48);
  assert.equal(res.rawCuYd, 1.78);
  // With 10% waste: 48 * 1.10 = 52.8 cu ft = 1.96 cu yds
  assert.equal(res.totalCuFt, 52.8);
  assert.equal(res.totalCuYd, 1.96);
  // 80 lb bags needed: ceil(52.8 / 0.6) = 88 bags
  assert.equal(res.bags80, 88);
  assert.ok(res.rebarSticks20ft > 0);
});

test('Calculator 2: Brick & Mortar for 20x8 ft wall', () => {
  const res = calculateBrick({
    wallLengthFt: 20,
    wallHeightFt: 8,
    openingsSqFt: 20,
    brickType: 'modular',
    wytheCount: 1,
    mortarJointIn: 0.375,
    wastePct: 5,
    brickUnitPrice: 0.90,
    mortarBagPrice: 12,
  });
  assert.equal(res.valid, true);
  // Gross area = 160 sq ft, Net area = 140 sq ft
  assert.equal(res.grossAreaSqFt, 160);
  assert.equal(res.netAreaSqFt, 140);
  // Modular brick (7.5 x 2.25) with 3/8" joint = (7.875 * 2.625) = 20.67 sq in
  // Bricks per sq ft ~ 6.965
  assert.ok(res.bricksPerSqFt > 6.8 && res.bricksPerSqFt < 7.1);
  assert.ok(res.totalBricks > 900);
  assert.ok(res.mortarBags > 5);
});

test('Calculator 3: Concrete Block (CMU) for 24x8 ft wall', () => {
  const res = calculateCmu({
    wallLengthFt: 24,
    wallHeightFt: 8,
    openingsSqFt: 0,
    blockSize: '8x8x16',
    groutFillSpacingIn: 32,
    wastePct: 5,
    blockUnitPrice: 2.50,
    mortarBagPrice: 13,
  });
  assert.equal(res.valid, true);
  // 24 * 8 = 192 sq ft * 1.125 blocks/sq ft = 216 raw blocks
  assert.equal(res.rawBlocks, 216);
  // With 5% waste = ceil(216 * 1.05) = 227 blocks
  assert.equal(res.totalBlocks, 227);
  assert.ok(res.mortarBags > 5);
  assert.ok(res.coreFillCuYds > 0);
});

test('Calculator 4: Wall Framing 30 ft wall at 16" o.c.', () => {
  const res = calculateFraming({
    wallLengthFt: 30,
    wallHeightFt: 8,
    studSpacingIn: 16,
    cornerCount: 4,
    doorCount: 1,
    windowCount: 2,
    wastePct: 10,
    studPrice: 6,
    platePrice16ft: 15,
  });
  assert.equal(res.valid, true);
  // Common studs: ceil(30 / 1.333) + 1 = 23 + 1 = 24 studs
  assert.equal(res.commonStuds, 24);
  assert.ok(res.totalStuds > 35);
  assert.ok(res.plateBoards16ft > 5);
});

test('Calculator 5: Sheathing 640 sq ft with 4x8 OSB', () => {
  const res = calculateSheathing({
    areaSqFt: 640,
    sheetSize: '4x8',
    wastePct: 10,
    pricePerSheet: 25,
  });
  assert.equal(res.valid, true);
  assert.equal(res.rawSheets, 20);
  assert.equal(res.totalSheets, 22);
});

test('Calculator 6: Drywall for 16x14 ft room with 9 ft walls + ceiling', () => {
  const res = calculateDrywall({
    roomLengthFt: 16,
    roomWidthFt: 14,
    wallHeightFt: 9,
    includeCeiling: true,
    openingsSqFt: 40,
    sheetSize: '4x8',
    wastePct: 10,
    sheetPrice: 16,
    bucketCompoundPrice: 18,
  });
  assert.equal(res.valid, true);
  // Wall area: 2 * (16 + 14) * 9 - 40 = 500 sq ft. Ceiling: 16 * 14 = 224 sq ft. Total = 724 sq ft.
  assert.equal(res.totalAreaSqFt, 724);
  assert.ok(res.totalSheets >= 24);
  assert.ok(res.compoundBuckets >= 2);
});

test('Calculator 7: Paint Coverage for 800 sq ft with 2 coats + primer', () => {
  const res = calculatePaint({
    surfaceAreaSqFt: 800,
    coats: 2,
    includePrimer: true,
    coveragePerGal: 350,
    paintPricePerGal: 50,
    primerPricePerGal: 30,
  });
  assert.equal(res.valid, true);
  // Total paint area: 1600 sq ft / 350 = 4.57 -> 5 gallons
  assert.equal(res.paintGallons, 5);
  // Primer: 800 / 350 = 2.28 -> 3 gallons
  assert.equal(res.primerGallons, 3);
});

test('Calculator 8: Roofing for 1800 sq ft footprint at 6/12 pitch', () => {
  const res = calculateRoofing({
    footprintAreaSqFt: 1800,
    pitchRiseOver12: 6,
    ridgeLengthFt: 40,
    eaveLengthFt: 120,
    shingleBundlePrice: 38,
    wastePct: 12,
  });
  assert.equal(res.valid, true);
  // Pitch factor for 6/12 = sqrt(1 + 0.25) = 1.118
  assert.equal(res.pitchFactor, 1.118);
  assert.ok(res.trueRoofAreaSqFt > 2000);
  assert.ok(res.totalSquares > 22);
  assert.ok(res.totalBundles > 65);
});

test('Calculator 9: Tile for 240 sq ft bathroom with 12x12 tile and 1/8" grout', () => {
  const res = calculateTile({
    areaSqFt: 240,
    tileLengthIn: 12,
    tileWidthIn: 12,
    tileThicknessIn: 0.375,
    jointWidthIn: 0.125,
    sqFtPerBox: 15,
    wastePct: 10,
    boxPrice: 40,
    groutBagPrice: 20,
  });
  assert.equal(res.valid, true);
  assert.equal(res.netAreaSqFt, 240);
  assert.ok(res.totalBoxes >= 17);
  assert.ok(res.groutPounds > 10);
});

test('Calculator 10: Construction Cost & Budget Estimator', () => {
  const res = calculateConstructionCost({
    projectType: 'addition',
    squareFootage: 400,
    materialBaseCost: 15000,
    laborRatePerSqFt: 45,
    equipmentPermitCost: 1200,
    contractorMarkupPct: 15,
    contingencyPct: 10,
  });
  assert.equal(res.valid, true);
  // Direct: 15000 (materials) + (400 * 45 = 18000 labor) + 1200 = 34200
  assert.equal(res.directSubtotal, 34200);
  // Markup: 34200 * 0.15 = 5130
  assert.equal(res.markupAmount, 5130);
  // Subtotal with markup: 39330. Contingency: 39330 * 0.10 = 3933
  assert.equal(res.contingencyAmount, 3933);
  // Total: 43263
  assert.equal(res.totalEstimatedCost, 43263);
  assert.ok(res.costPerSqFt > 100);
});

test('Calculator 11: Stair & Handrail Calculator (108" Total Rise, 9ft ceiling)', () => {
  const res = calculateStairHandrail({
    totalRiseIn: 108,
    targetRiserHeightIn: 7.5,
    treadRunIn: 10.5,
    nosingIn: 1.0,
    stairWidthIn: 36,
    buildingCode: 'irc',
    handrailSides: 'both',
    handrailHeightIn: 36,
    adaExtensions: false,
    balusterSpacingIn: 3.5,
    stringerSpacingIn: 16,
    wastePct: 10,
    stringerBoardPrice: 38.50,
    treadPrice: 18.00,
    riserBoardPrice: 11.50,
    handrailPricePerFt: 4.75,
    newelPostPrice: 42.00,
    balusterPrice: 3.25,
    hardwareAllowance: 65.00,
    laborRatePerHour: 55.00,
    estimatedLaborHours: 16.0,
  });

  assert.equal(res.valid, true);
  // 108 / 7.5 = 14.4 -> rounds to 14 risers
  assert.equal(res.numRisers, 14);
  // 108 / 14 = 7.714"
  assert.equal(res.exactRiserHeightIn, 7.714);
  assert.equal(res.riserFraction, '7 11/16"');
  // 14 risers - 1 = 13 treads
  assert.equal(res.numTreads, 13);
  // 13 * 10.5 = 136.5 inches total run
  assert.equal(res.totalRunIn, 136.5);
  // Incline angle: atan(7.714 / 10.5) ~ 36.3 degrees (optimal 30-37 deg)
  assert.ok(res.inclineAngleDeg >= 35 && res.inclineAngleDeg <= 37);
  assert.equal(res.angleOptimal, true);
  // Code compliance for IRC: 7.714" <= 7.75" max riser, 10.5" >= 10" min tread
  assert.equal(res.riserCompliant, true);
  assert.equal(res.treadCompliant, true);
  assert.equal(res.allCodePassed, true);
  // 36" wide with 16" o.c. stringers = 4 stringers
  assert.equal(res.stringerCount, 4);
  // Blondel: 2 * 7.714 + 10.5 = 25.93"
  assert.equal(res.blondelValue, 25.93);
  // Material takeoff costs should be populated
  assert.ok(res.stringersCost > 0);
  assert.ok(res.treadsCost > 0);
  assert.ok(res.risersCost > 0);
  assert.ok(res.handrailCost > 0);
  assert.ok(res.materialsSubtotal > 500);
  assert.ok(res.totalProjectCost > 1000);
});

test('Calculator 12: Vapor Barrier Calculator (40x30 Crawl Space, 10 mil)', () => {
  const res = calculateVaporBarrier({
    application: 'crawlspace',
    lengthFt: 40,
    widthFt: 30,
    crawlWallHeightFt: 2.5,
    piersCount: 6,
    pierPerimeterFt: 4,
    milThickness: 10,
    rollWidthFt: 12,
    rollLengthFt: 100,
    seamOverlapIn: 12,
    wastePct: 10,
    rollPrice: 165,
    seamTapeRollPrice: 32,
    terminationBarPrice: 14.50,
    fastenersPackPrice: 18,
    laborRatePerSqFt: 0.75,
  });

  assert.equal(res.valid, true);
  assert.equal(res.baseAreaSqFt, 1200);
  // Perimeter = 2 * (40 + 30) = 140 ft. Wall area = 140 * 2.5 = 350 sq ft
  assert.equal(res.wallAreaSqFt, 350);
  // Gross area includes base, walls, and piers
  assert.ok(res.grossAreaSqFt > 1550);
  // Rolls needed should be positive (12x100 = 1200 sq ft roll, total area > 1800 sq ft -> 2 rolls)
  assert.ok(res.rollsNeeded >= 2);
  assert.ok(res.tapeRollsNeeded >= 1);
  assert.ok(res.termBarsNeeded >= 14);
  assert.ok(res.totalEstimatedCost > 500);
});

test('Calculator 13: Garage Door Size Calculator (16x7 Double Car Door)', () => {
  const res = calculateGarageDoorSize({
    doorStandardSize: 'double_16x7',
    doorWidthFt: 16,
    doorHeightFt: 7,
    ceilingHeightFt: 10,
    wallFraming: '2x4',
    trackRadiusIn: 15,
    hasElectricOpener: true,
    headerType: 'lvl_double',
    doorUnitCost: 1650,
    openerCost: 280,
    headerLumberCost: 190,
    framingJambsCost: 75,
    weatherstripCost: 45,
    laborInstallCost: 500,
  });

  assert.equal(res.valid, true);
  assert.equal(res.finishedWidthIn, 192); // 16 * 12
  assert.equal(res.finishedHeightIn, 84);  // 7 * 12
  // Rough opening: +3" width, +1.5" height
  assert.equal(res.roughWidthIn, 195);
  assert.equal(res.roughHeightIn, 85.5);
  // Headroom: 10 ft ceiling = 120", 120 - 84 = 36" available headroom
  assert.equal(res.availableHeadroomIn, 36);
  assert.equal(res.requiresLowHeadroom, false);
  // Backroom: 84 + 48 = 132 inches (11.0 ft)
  assert.equal(res.backroomDepthIn, 132);
  assert.equal(res.backroomDepthFt, 11);
  assert.ok(res.totalEstimatedCost > 2000);
});

test('Calculator 14: Door Frame Material Calculator (36x80 Entry Door in 2x4 Wall)', () => {
  const res = calculateDoorFrame({
    doorType: 'exterior_single',
    doorWidthIn: 36,
    doorHeightIn: 80,
    doorThicknessIn: 1.75,
    wallStudSize: '2x4',
    wallHeightFt: 8,
    casingSides: 2,
    casingWidthIn: 2.5,
    headerType: 'double_2x8',
    studPrice: 5.85,
    headerBoardPrice: 14.50,
    jambKitPrice: 38.00,
    casingPricePerFt: 1.65,
    hardwareHingesPrice: 18.00,
    shimPackPrice: 6.50,
    laborRatePerHour: 50.00,
    estimatedLaborHours: 3.0,
  });

  assert.equal(res.valid, true);
  // Rough opening: 36 + 2 = 38" width, 80 + 2.5 = 82.5" height
  assert.equal(res.roWidthIn, 38);
  assert.equal(res.roHeightIn, 82.5);
  assert.equal(res.kingStudsCount, 2);
  assert.equal(res.jackStudsCount, 2);
  assert.equal(res.headerLengthIn, 41); // 38 + 3
  assert.equal(res.jambWidthFraction, '4 9/16"');
  // Exterior door has 4 hinges
  assert.equal(res.hingeCount, 4);
  assert.ok(res.totalCasingLinFt > 30);
  assert.ok(res.totalEstimatedCost > 200);
});



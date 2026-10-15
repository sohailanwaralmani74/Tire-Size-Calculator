/**
 * Pure deterministic calculation engine for Building Material & Construction Cost Calculators.
 * Covers: Concrete & Footings, Brick & Mortar, CMU Blocks, Wall Framing, Sheathing,
 * Drywall, Paint Coverage, Roofing Shingles & Pitch, Tile & Grout, and Project Cost Estimating.
 */

export const CALCULATOR_CATEGORIES = [
  {
    id: 'concrete-masonry',
    name: 'Concrete & Masonry',
    shortName: 'Concrete',
    description: 'Slabs, footings, post holes, bricks, blocks, and mortar',
    calculators: [
      {
        id: 'concrete',
        slug: 'concrete-calculator',
        name: 'Concrete Slab & Footing Calculator',
        shortTitle: 'Concrete Slab',
        badge: 'Cubic Yards & Bags',
        summary: 'Calculate volume in cubic yards, pre-mixed bags (40, 60, 80 lb), and rebar grid requirements.',
        lastmod: '2026-10-13',
      },
      {
        id: 'brick-mortar',
        slug: 'brick-mortar-calculator',
        name: 'Brick & Mortar Calculator',
        shortTitle: 'Brick & Mortar',
        badge: 'Bricks, Sand & Bags',
        summary: 'Calculate total modular, king, or queen bricks, mortar bags (Type N/S), and tons of sand.',
        lastmod: '2026-10-12',
      },
      {
        id: 'block-cmu',
        slug: 'block-cmu-calculator',
        name: 'Concrete Block (CMU) Calculator',
        shortTitle: 'CMU Blocks',
        badge: '8x8x16 & Core Fill',
        summary: 'Estimate standard CMU blocks, core-fill grout volume, mortar bags, and vertical rebar.',
        lastmod: '2026-10-11',
      },
    ],
  },
  {
    id: 'framing-lumber',
    name: 'Framing & Lumber',
    shortName: 'Framing',
    description: 'Wall studs, plates, headers, OSB sheathing, and plywood',
    calculators: [
      {
        id: 'framing',
        slug: 'framing-calculator',
        name: 'Wall Framing & Stud Calculator',
        shortTitle: 'Wall Studs',
        badge: '16" & 24" O.C.',
        summary: 'Calculate common studs, double top plates, bottom sill, headers, corners, and board feet.',
        lastmod: '2026-10-10',
      },
      {
        id: 'stair-handrail',
        slug: 'stair-handrail-calculator',
        name: 'Stair & Handrail Calculator',
        shortTitle: 'Stairs & Railing',
        badge: 'Rise, Run & Codes',
        summary: 'Calculate stair risers, tread run, stringer boards, handrail length, baluster spacing, and ADA/IRC code compliance.',
        lastmod: '2026-10-15',
      },
      {
        id: 'sheathing',
        slug: 'sheathing-calculator',
        name: 'Plywood & OSB Sheathing Calculator',
        shortTitle: 'OSB Sheathing',
        badge: '4x8 & 4x10 Sheets',
        summary: 'Determine 4x8 / 4x10 sheets for walls, subfloors, and roof decks plus framing nail counts.',
        lastmod: '2026-10-09',
      },
    ],
  },
  {
    id: 'drywall-paint',
    name: 'Drywall & Paint',
    shortName: 'Drywall & Paint',
    description: 'Sheetrock boards, joint compound, primer, and wall paint',
    calculators: [
      {
        id: 'drywall',
        slug: 'drywall-calculator',
        name: 'Drywall & Sheetrock Calculator',
        shortTitle: 'Drywall Sheets',
        badge: 'Sheets, Mud & Tape',
        summary: 'Calculate 4x8, 4x10, 4x12 drywall sheets, joint compound buckets, screws, and tape rolls.',
        lastmod: '2026-10-08',
      },
      {
        id: 'paint',
        slug: 'paint-calculator',
        name: 'Paint & Primer Coverage Calculator',
        shortTitle: 'Paint Coverage',
        badge: 'Gallons & Coats',
        summary: 'Estimate gallons of wall/ceiling paint and primer with window and door deduction.',
        lastmod: '2026-10-07',
      },
    ],
  },
  {
    id: 'roofing-flooring',
    name: 'Roofing & Flooring',
    shortName: 'Roof & Floor',
    description: 'Shingles, pitch multiplier, tile layout, and grout weight',
    calculators: [
      {
        id: 'roofing',
        slug: 'roofing-calculator',
        name: 'Roofing Shingle & Pitch Calculator',
        shortTitle: 'Roof Shingles',
        badge: 'Squares & Bundles',
        summary: 'Calculate roofing squares, architectural bundles, pitch multipliers, felt, and ridge caps.',
        lastmod: '2026-10-06',
      },
      {
        id: 'flooring-tile',
        slug: 'flooring-tile-calculator',
        name: 'Tile, Grout & Flooring Calculator',
        shortTitle: 'Tile & Grout',
        badge: 'Boxes & Grout Lbs',
        summary: 'Calculate square footage, tile boxes with waste, grout weight (lbs), and thin-set bags.',
        lastmod: '2026-10-05',
      },
    ],
  },
  {
    id: 'cost-budget',
    name: 'Cost Estimator',
    shortName: 'Cost Estimator',
    description: 'Comprehensive construction budget, labor, markup, and contingency',
    calculators: [
      {
        id: 'construction-cost',
        slug: 'construction-cost-calculator',
        name: 'Construction Cost & Budget Estimator',
        shortTitle: 'Project Budget',
        badge: 'Labor, Material & Markup',
        summary: 'Estimate total project budget with material subtotal, labor rates, GC markup, and contingency.',
        lastmod: '2026-10-04',
      },
    ],
  },
];

export const ALL_CALCULATORS = CALCULATOR_CATEGORIES.flatMap((c) =>
  c.calculators.map((calc) => ({
    ...calc,
    categoryId: c.id,
    categoryName: c.name,
    categoryShortName: c.shortName,
  }))
);

export function getCalculatorBySlug(slug: string) {
  const clean = slug.replace(/^\//, '').replace(/^.\//, '');
  return ALL_CALCULATORS.find((c) => c.slug === clean) || ALL_CALCULATORS[0];
}

export function getCalculatorById(id: string) {
  return ALL_CALCULATORS.find((c) => c.id === id) || ALL_CALCULATORS[0];
}

// -------------------------------------------------------------
// 1. CONCRETE SLAB & FOOTING CALCULATOR
// -------------------------------------------------------------
export interface ConcreteInput {
  shape: 'slab' | 'circular' | 'footing' | 'post-holes';
  lengthFt: number;
  widthFt: number;
  thicknessIn: number;
  diameterFt?: number;
  depthFt?: number;
  quantity?: number;
  wastePct: number;
  pricePerCuYd: number;
  bagPrice80lb: number;
  rebarSpacingIn: number;
}

export function calculateConcrete(input: ConcreteInput) {
  const wasteMult = 1 + (Math.max(0, input.wastePct) || 0) / 100;
  let rawCuFt = 0;

  if (input.shape === 'slab' || input.shape === 'footing') {
    const l = Math.max(0.1, Number(input.lengthFt) || 10);
    const w = Math.max(0.1, Number(input.widthFt) || 10);
    const tFt = Math.max(0.1, Number(input.thicknessIn) || 4) / 12;
    const qty = Math.max(1, Number(input.quantity) || 1);
    rawCuFt = l * w * tFt * qty;
  } else if (input.shape === 'circular') {
    const d = Math.max(0.1, Number(input.diameterFt) || 10);
    const tFt = Math.max(0.1, Number(input.thicknessIn) || 4) / 12;
    const qty = Math.max(1, Number(input.quantity) || 1);
    const radius = d / 2;
    rawCuFt = Math.PI * radius * radius * tFt * qty;
  } else if (input.shape === 'post-holes') {
    const dIn = Math.max(4, Number(input.diameterFt ? input.diameterFt * 12 : input.thicknessIn) || 10);
    const dFt = dIn / 12;
    const depth = Math.max(0.5, Number(input.depthFt || input.lengthFt) || 3);
    const qty = Math.max(1, Number(input.quantity) || 4);
    const radius = dFt / 2;
    rawCuFt = Math.PI * radius * radius * depth * qty;
  }

  const totalCuFt = rawCuFt * wasteMult;
  const rawCuYd = rawCuFt / 27;
  const totalCuYd = totalCuFt / 27;
  const totalCuM = totalCuFt * 0.0283168;

  // Premixed Bags (standard yields):
  // 80 lb bag yields ~0.60 cu ft
  // 60 lb bag yields ~0.45 cu ft
  // 50 lb bag yields ~0.375 cu ft
  // 40 lb bag yields ~0.30 cu ft
  const bags80 = Math.ceil(Number((totalCuFt / 0.60).toFixed(4)));
  const bags60 = Math.ceil(Number((totalCuFt / 0.45).toFixed(4)));
  const bags50 = Math.ceil(Number((totalCuFt / 0.375).toFixed(4)));
  const bags40 = Math.ceil(Number((totalCuFt / 0.30).toFixed(4)));

  // Rebar Grid Estimate for rectangular slab:
  const spacingIn = Math.max(6, Number(input.rebarSpacingIn) || 18);
  const spacingFt = spacingIn / 12;
  const l = Number(input.lengthFt) || 10;
  const w = Number(input.widthFt) || 10;
  const numBarsLengthwise = Math.ceil(w / spacingFt) + 1;
  const numBarsWidthwise = Math.ceil(l / spacingFt) + 1;
  const totalRebarLinearFt = (numBarsLengthwise * l) + (numBarsWidthwise * w);
  // Rebar sticks are sold in standard 20 ft lengths with 10% overlap
  const rebarSticks20ft = Math.ceil((totalRebarLinearFt * 1.1) / 20);

  // Costs
  const bulkReadyMixCost = totalCuYd * (Number(input.pricePerCuYd) || 145);
  const bagMixCost = bags80 * (Number(input.bagPrice80lb) || 6.25);

  return {
    valid: true,
    rawCuFt: Number(rawCuFt.toFixed(2)),
    totalCuFt: Number(totalCuFt.toFixed(2)),
    rawCuYd: Number(rawCuYd.toFixed(2)),
    totalCuYd: Number(totalCuYd.toFixed(2)),
    totalCuM: Number(totalCuM.toFixed(2)),
    bags80,
    bags60,
    bags50,
    bags40,
    rebarLinearFt: Math.round(totalRebarLinearFt),
    rebarSticks20ft,
    bulkReadyMixCost: Math.round(bulkReadyMixCost),
    bagMixCost: Math.round(bagMixCost),
    wasteVolumeCuYd: Number((totalCuYd - rawCuYd).toFixed(2)),
  };
}

// -------------------------------------------------------------
// 2. BRICK & MORTAR CALCULATOR
// -------------------------------------------------------------
export interface BrickInput {
  wallLengthFt: number;
  wallHeightFt: number;
  openingsSqFt: number;
  brickType: 'modular' | 'king' | 'queen' | 'engineer' | 'utility';
  wytheCount: 1 | 2;
  mortarJointIn: number;
  wastePct: number;
  brickUnitPrice: number;
  mortarBagPrice: number;
}

export function calculateBrick(input: BrickInput) {
  const wallL = Math.max(0.1, Number(input.wallLengthFt) || 20);
  const wallH = Math.max(0.1, Number(input.wallHeightFt) || 8);
  const openings = Math.max(0, Number(input.openingsSqFt) || 0);
  const grossArea = wallL * wallH;
  const netArea = Math.max(0.1, grossArea - openings);

  // Brick dimensions in inches: [length, height, depth]
  const brickDims: Record<string, [number, number, number]> = {
    modular: [7.5, 2.25, 3.5],
    king: [9.625, 2.625, 2.625],
    queen: [7.625, 2.75, 2.75],
    engineer: [7.625, 2.75, 3.5],
    utility: [11.625, 3.625, 3.625],
  };

  const [bL, bH] = brickDims[input.brickType] || brickDims.modular;
  const joint = Math.max(0.125, Number(input.mortarJointIn) || 0.375); // 3/8"

  // Face area of one brick plus joint in square inches
  const brickFaceAreaSqIn = (bL + joint) * (bH + joint);
  const bricksPerSqFt = (144 / brickFaceAreaSqIn) * (input.wytheCount || 1);

  const rawBricks = netArea * bricksPerSqFt;
  const wasteMult = 1 + (Math.max(0, input.wastePct) || 5) / 100;
  const totalBricks = Math.ceil(rawBricks * wasteMult);

  // Industry rule of thumb: ~6.5 to 7.0 bags of premix mortar (80 lb) per 1000 standard modular bricks
  // Or ~1 bag of mortar per 140 modular bricks
  const mortarBags = Math.ceil(totalBricks / 140);
  // Sand: ~0.55 tons of masonry sand per 1000 bricks
  const sandTons = Number(((totalBricks / 1000) * 0.55).toFixed(2));
  // Wall ties / anchors (1 every 2.67 sq ft or 16" o.c. horizontally and vertically)
  const wallTies = Math.ceil((netArea / 2.67) * 1.05);

  const estimatedBrickCost = Math.round(totalBricks * (Number(input.brickUnitPrice) || 0.85));
  const estimatedMortarCost = Math.round(mortarBags * (Number(input.mortarBagPrice) || 12.50));

  return {
    valid: true,
    grossAreaSqFt: Number(grossArea.toFixed(1)),
    netAreaSqFt: Number(netArea.toFixed(1)),
    bricksPerSqFt: Number(bricksPerSqFt.toFixed(2)),
    rawBricks: Math.round(rawBricks),
    totalBricks,
    mortarBags,
    sandTons,
    wallTies,
    estimatedBrickCost,
    estimatedMortarCost,
    totalCost: estimatedBrickCost + estimatedMortarCost,
  };
}

// -------------------------------------------------------------
// 3. CONCRETE BLOCK (CMU) CALCULATOR
// -------------------------------------------------------------
export interface CmuInput {
  wallLengthFt: number;
  wallHeightFt: number;
  openingsSqFt: number;
  blockSize: '8x8x16' | '6x8x16' | '4x8x16' | '12x8x16';
  groutFillSpacingIn: number; // 0 = none, 16, 32, 48
  wastePct: number;
  blockUnitPrice: number;
  mortarBagPrice: number;
}

export function calculateCmu(input: CmuInput) {
  const wallL = Math.max(0.1, Number(input.wallLengthFt) || 24);
  const wallH = Math.max(0.1, Number(input.wallHeightFt) || 8);
  const openings = Math.max(0, Number(input.openingsSqFt) || 0);
  const netArea = Math.max(0.1, (wallL * wallH) - openings);

  // Standard nominal CMU face is 8" high x 16" long (0.8889 sq ft)
  // Exactly 1.125 blocks per sq ft (or 112.5 blocks per 100 sq ft)
  const blocksPerSqFt = 1.125;
  const rawBlocks = netArea * blocksPerSqFt;
  const wasteMult = 1 + (Math.max(0, input.wastePct) || 5) / 100;
  const totalBlocks = Math.ceil(rawBlocks * wasteMult);

  // Mortar for CMU: 1 bag of Type S mortar (80 lb) lays ~35 to 40 standard 8x8x16 blocks
  const mortarBags = Math.ceil(totalBlocks / 38);

  // Core fill grout:
  // An 8x8x16 full block core holds ~0.24 cu ft of grout.
  // Grout core fill volume based on core rebar spacing
  let coreFillCuYds = 0;
  const spacing = Number(input.groutFillSpacingIn) || 32;
  if (spacing > 0) {
    const coresPerBlock = 2;
    const totalCores = totalBlocks * coresPerBlock;
    // Core frequency: every 16" = 100% of cores; 32" = 50%; 48" = 33%
    const fillFraction = 16 / Math.max(16, spacing);
    const filledCores = totalCores * fillFraction;
    const coreCuFt = (input.blockSize === '12x8x16' ? 0.38 : input.blockSize === '6x8x16' ? 0.17 : 0.24);
    coreFillCuYds = Number(((filledCores * coreCuFt) / 27).toFixed(2));
  }

  // Vertical rebar count:
  const verticalBars = spacing > 0 ? Math.ceil((wallL / (spacing / 12)) + 1) : 0;
  const rebarSticks = Math.ceil((verticalBars * (wallH + 2)) / 20);

  const blockCost = Math.round(totalBlocks * (Number(input.blockUnitPrice) || 2.45));
  const mortarCost = Math.round(mortarBags * (Number(input.mortarBagPrice) || 13.00));

  return {
    valid: true,
    netAreaSqFt: Number(netArea.toFixed(1)),
    rawBlocks: Math.round(rawBlocks),
    totalBlocks,
    mortarBags,
    coreFillCuYds,
    verticalBars,
    rebarSticks,
    blockCost,
    mortarCost,
    totalCost: blockCost + mortarCost,
  };
}

// -------------------------------------------------------------
// 4. WALL FRAMING & STUD CALCULATOR
// -------------------------------------------------------------
export interface FramingInput {
  wallLengthFt: number;
  wallHeightFt: number;
  studSpacingIn: 16 | 24;
  cornerCount: number;
  doorCount: number;
  windowCount: number;
  wastePct: number;
  studPrice: number;
  platePrice16ft: number;
}

export function calculateFraming(input: FramingInput) {
  const wallL = Math.max(1, Number(input.wallLengthFt) || 30);
  const wallH = Math.max(6, Number(input.wallHeightFt) || 8);
  const spacingIn = Number(input.studSpacingIn) === 24 ? 24 : 16;
  const spacingFt = spacingIn / 12;

  // Base layout studs: (Length / Spacing) + 1
  const commonStuds = Math.ceil(wallL / spacingFt) + 1;

  // Corner studs: 2 to 3 studs per corner
  const corners = Math.max(0, Number(input.cornerCount) || 4);
  const cornerStuds = corners * 3;

  // Openings: Doors require 2 king studs + 2 jack studs; Windows require 2 king + 2 jacks + cripples (~4-6 studs total each)
  const doors = Math.max(0, Number(input.doorCount) || 1);
  const windows = Math.max(0, Number(input.windowCount) || 2);
  const openingStuds = (doors * 4) + (windows * 5);

  const rawTotalStuds = commonStuds + cornerStuds + openingStuds;
  const wasteMult = 1 + (Math.max(0, input.wastePct) || 10) / 100;
  const totalStuds = Math.ceil(rawTotalStuds * wasteMult);

  // Plates: Double top plate + single bottom plate = 3 plates of total wall length
  const totalPlateLinearFt = wallL * 3;
  // Plates sold in 16 ft boards
  const plateBoards16ft = Math.ceil((totalPlateLinearFt * 1.1) / 16);

  // Headers: 2x10 or 2x12 lumber for openings (average 4 ft per opening, double lumber)
  const headerLinearFt = (doors + windows) * 4 * 2;
  const headerBoards10ft = Math.ceil((headerLinearFt * 1.1) / 10);

  // Board feet estimate for 2x4 (1 board ft = 1" x 12" x 12" = 144 cu in; 2x4 is 2/3 board ft per linear ft)
  const totalStudLinearFt = totalStuds * wallH;
  const totalLinearFt = totalStudLinearFt + totalPlateLinearFt + headerLinearFt;
  const estimatedBoardFt = Math.round(totalLinearFt * (2 / 3));

  // Framing nails: ~1 lb of 16d nails per 25 studs
  const nailsLbs = Math.ceil(totalStuds / 25) * 5;

  const studCost = Math.round(totalStuds * (Number(input.studPrice) || 5.85));
  const plateCost = Math.round(plateBoards16ft * (Number(input.platePrice16ft) || 14.50));

  return {
    valid: true,
    commonStuds,
    cornerStuds,
    openingStuds,
    rawTotalStuds,
    totalStuds,
    totalPlateLinearFt: Math.round(totalPlateLinearFt),
    plateBoards16ft,
    headerBoards10ft,
    estimatedBoardFt,
    nailsLbs,
    studCost,
    plateCost,
    totalLumberCost: studCost + plateCost,
  };
}

// -------------------------------------------------------------
// 5. PLYWOOD & OSB SHEATHING CALCULATOR
// -------------------------------------------------------------
export interface SheathingInput {
  areaSqFt: number;
  sheetSize: '4x8' | '4x10';
  wastePct: number;
  pricePerSheet: number;
}

export function calculateSheathing(input: SheathingInput) {
  const area = Math.max(1, Number(input.areaSqFt) || 640);
  const sheetSqFt = input.sheetSize === '4x10' ? 40 : 32;
  const rawSheets = area / sheetSqFt;
  const wasteMult = 1 + (Math.max(0, input.wastePct) || 10) / 100;
  const totalSheets = Math.ceil(rawSheets * wasteMult);

  // Nails / screws per sheet: standard 6" edge spacing, 12" field spacing = ~35 fasteners per sheet
  const fastenersCount = totalSheets * 36;
  const nailsLbs = Math.ceil(fastenersCount / 100); // ~100 8d nails per lb

  const totalCost = Math.round(totalSheets * (Number(input.pricePerSheet) || 22.50));

  return {
    valid: true,
    areaSqFt: area,
    sheetSqFt,
    rawSheets: Number(rawSheets.toFixed(1)),
    totalSheets,
    fastenersCount,
    nailsLbs,
    totalCost,
  };
}

// -------------------------------------------------------------
// 6. DRYWALL & SHEETROCK CALCULATOR
// -------------------------------------------------------------
export interface DrywallInput {
  roomLengthFt: number;
  roomWidthFt: number;
  wallHeightFt: number;
  includeCeiling: boolean;
  openingsSqFt: number;
  sheetSize: '4x8' | '4x10' | '4x12';
  wastePct: number;
  sheetPrice: number;
  bucketCompoundPrice: number;
}

export function calculateDrywall(input: DrywallInput) {
  const l = Math.max(1, Number(input.roomLengthFt) || 16);
  const w = Math.max(1, Number(input.roomWidthFt) || 14);
  const h = Math.max(6, Number(input.wallHeightFt) || 9);
  const openings = Math.max(0, Number(input.openingsSqFt) || 40);

  const wallArea = (2 * (l + w) * h) - openings;
  const ceilingArea = input.includeCeiling ? (l * w) : 0;
  const totalArea = Math.max(1, wallArea + ceilingArea);

  const sheetAreas: Record<string, number> = {
    '4x8': 32,
    '4x10': 40,
    '4x12': 48,
  };
  const sheetSqFt = sheetAreas[input.sheetSize] || 32;
  const rawSheets = totalArea / sheetSqFt;
  const wasteMult = 1 + (Math.max(0, input.wastePct) || 10) / 100;
  const totalSheets = Math.ceil(rawSheets * wasteMult);

  // Joint compound (ready-mix buckets / 4.5 gal / 61 lb):
  // Rule of thumb: ~1 bucket per 400 sq ft or ~1 gallon per 100 sq ft
  const compoundBuckets = Math.ceil(totalArea / 380);
  // Joint tape: ~1 roll (250 ft) per 500 sq ft
  const tapeRolls250ft = Math.ceil(totalArea / 500);
  // Screws: ~1 lb (about 300 1-1/4" screws) per 500 sq ft
  const screwPounds = Math.ceil(totalArea / 400);

  const sheetCost = Math.round(totalSheets * (Number(input.sheetPrice) || 15.50));
  const compoundCost = Math.round(compoundBuckets * (Number(input.bucketCompoundPrice) || 18.25));

  return {
    valid: true,
    wallAreaSqFt: Math.round(wallArea),
    ceilingAreaSqFt: Math.round(ceilingArea),
    totalAreaSqFt: Math.round(totalArea),
    rawSheets: Number(rawSheets.toFixed(1)),
    totalSheets,
    compoundBuckets,
    tapeRolls250ft,
    screwPounds,
    sheetCost,
    compoundCost,
    totalCost: sheetCost + compoundCost,
  };
}

// -------------------------------------------------------------
// 7. PAINT & PRIMER COVERAGE CALCULATOR
// -------------------------------------------------------------
export interface PaintInput {
  surfaceAreaSqFt: number;
  coats: number;
  includePrimer: boolean;
  coveragePerGal: number;
  paintPricePerGal: number;
  primerPricePerGal: number;
}

export function calculatePaint(input: PaintInput) {
  const area = Math.max(1, Number(input.surfaceAreaSqFt) || 800);
  const coats = Math.max(1, Number(input.coats) || 2);
  const coverage = Math.max(100, Number(input.coveragePerGal) || 350);

  const totalPaintSqFt = area * coats;
  const rawPaintGal = totalPaintSqFt / coverage;
  const paintGallons = Math.ceil(rawPaintGal);

  let primerGallons = 0;
  if (input.includePrimer) {
    primerGallons = Math.ceil(area / coverage);
  }

  const paintCost = Math.round(paintGallons * (Number(input.paintPricePerGal) || 45));
  const primerCost = Math.round(primerGallons * (Number(input.primerPricePerGal) || 28));

  return {
    valid: true,
    surfaceAreaSqFt: area,
    totalPaintSqFt,
    paintGallons,
    primerGallons,
    paintCost,
    primerCost,
    totalCost: paintCost + primerCost,
  };
}

// -------------------------------------------------------------
// 8. ROOFING SHINGLE & PITCH CALCULATOR
// -------------------------------------------------------------
export interface RoofingInput {
  footprintAreaSqFt: number;
  pitchRiseOver12: number; // e.g. 4, 6, 8, 10, 12
  ridgeLengthFt: number;
  eaveLengthFt: number;
  shingleBundlePrice: number;
  wastePct: number;
}

export function calculateRoofing(input: RoofingInput) {
  const baseArea = Math.max(1, Number(input.footprintAreaSqFt) || 1800);
  const pitch = Math.max(0, Number(input.pitchRiseOver12) || 6);

  // Pitch factor = sqrt(1 + (pitch / 12)^2)
  const pitchFactor = Math.sqrt(1 + Math.pow(pitch / 12, 2));
  const trueRoofArea = baseArea * pitchFactor;

  // 1 Square = 100 square feet
  const rawSquares = trueRoofArea / 100;
  const wasteMult = 1 + (Math.max(0, input.wastePct) || 12) / 100;
  const totalSquares = Number((rawSquares * wasteMult).toFixed(2));

  // Shingles: 3 bundles per square
  const totalBundles = Math.ceil(totalSquares * 3);

  // Underlayment: Standard synthetic roll covers ~10 squares; 15# felt covers ~4 squares
  const underlaymentRollsSynthetic = Math.ceil(totalSquares / 10);
  const underlaymentRollsFelt15 = Math.ceil(totalSquares / 4);

  // Ridge cap shingles: 1 bundle covers ~33 linear feet of ridge/hip
  const ridgeFt = Math.max(0, Number(input.ridgeLengthFt) || 40);
  const ridgeBundles = Math.ceil(ridgeFt / 33);

  // Drip edge: 10 ft pieces along eaves & rakes
  const perimeterFt = Math.max(10, Number(input.eaveLengthFt) || 120);
  const dripEdgeSticks10ft = Math.ceil((perimeterFt * 1.1) / 10);

  // Nails: ~320 nails per square (2.5 lbs of 1-1/4" roofing nails per square)
  const nailsLbs = Math.ceil(totalSquares * 2.5);

  const shingleCost = Math.round((totalBundles + ridgeBundles) * (Number(input.shingleBundlePrice) || 36));

  return {
    valid: true,
    pitchFactor: Number(pitchFactor.toFixed(3)),
    trueRoofAreaSqFt: Math.round(trueRoofArea),
    rawSquares: Number(rawSquares.toFixed(2)),
    totalSquares,
    totalBundles,
    ridgeBundles,
    underlaymentRollsSynthetic,
    underlaymentRollsFelt15,
    dripEdgeSticks10ft,
    nailsLbs,
    shingleCost,
  };
}

// -------------------------------------------------------------
// 9. TILE, GROUT & FLOORING CALCULATOR
// -------------------------------------------------------------
export interface TileInput {
  areaSqFt: number;
  tileLengthIn: number;
  tileWidthIn: number;
  tileThicknessIn: number;
  jointWidthIn: number; // e.g. 0.0625, 0.125, 0.1875, 0.25
  sqFtPerBox: number;
  wastePct: number;
  boxPrice: number;
  groutBagPrice: number;
}

export function calculateTile(input: TileInput) {
  const area = Math.max(1, Number(input.areaSqFt) || 240);
  const tL = Math.max(1, Number(input.tileLengthIn) || 12);
  const tW = Math.max(1, Number(input.tileWidthIn) || 12);
  const tThick = Math.max(0.125, Number(input.tileThicknessIn) || 0.375); // 3/8"
  const jW = Math.max(0.03125, Number(input.jointWidthIn) || 0.125); // 1/8"
  const wasteMult = 1 + (Math.max(0, input.wastePct) || 10) / 100;

  const totalAreaWithWaste = area * wasteMult;
  const tileSqFt = (tL * tW) / 144;
  const totalTiles = Math.ceil(totalAreaWithWaste / tileSqFt);

  const boxSqFt = Math.max(1, Number(input.sqFtPerBox) || 15);
  const totalBoxes = Math.ceil(totalAreaWithWaste / boxSqFt);

  // Industry standard grout coverage formula:
  // Pounds = ((L + W) * T * Joint * (AreaSqFt * 144) * Density) / (L * W)
  // Grout density approx 105 lbs/cu ft = 0.0608 lbs/cu in
  const areaSqIn = totalAreaWithWaste * 144;
  const groutPounds = Math.ceil((((tL + tW) * tThick * jW * areaSqIn * 0.061) / (tL * tW)) * 1.05);
  const groutBags25lb = Math.ceil(groutPounds / 25);

  // Thin-set mortar: 1 bag of 50 lb thinset covers ~45 to 50 sq ft with a 1/4" x 3/8" notch trowel
  const thinsetBags50lb = Math.ceil(totalAreaWithWaste / 45);

  const tileCost = Math.round(totalBoxes * (Number(input.boxPrice) || 38));
  const groutCost = Math.round(groutBags25lb * (Number(input.groutBagPrice) || 22));

  return {
    valid: true,
    netAreaSqFt: area,
    totalAreaWithWasteSqFt: Math.round(totalAreaWithWaste),
    totalTiles,
    totalBoxes,
    groutPounds,
    groutBags25lb,
    thinsetBags50lb,
    tileCost,
    groutCost,
    totalCost: tileCost + groutCost,
  };
}

// -------------------------------------------------------------
// 10. CONSTRUCTION COST & BUDGET ESTIMATOR
// -------------------------------------------------------------
export interface ConstructionCostInput {
  projectType: 'slab' | 'framing' | 'drywall' | 'roofing' | 'tile' | 'addition' | 'custom';
  squareFootage: number;
  materialBaseCost: number;
  laborRatePerSqFt: number;
  equipmentPermitCost: number;
  contractorMarkupPct: number;
  contingencyPct: number;
}

export function calculateConstructionCost(input: ConstructionCostInput) {
  const sqFt = Math.max(1, Number(input.squareFootage) || 500);
  const matCost = Math.max(0, Number(input.materialBaseCost) || 3500);
  const laborRate = Math.max(0, Number(input.laborRatePerSqFt) || 12);
  const laborCost = Math.round(sqFt * laborRate);
  const equipmentPermit = Math.max(0, Number(input.equipmentPermitCost) || 650);

  const directSubtotal = matCost + laborCost + equipmentPermit;

  const markupPct = Math.max(0, Number(input.contractorMarkupPct) || 15);
  const markupAmount = Math.round(directSubtotal * (markupPct / 100));

  const subtotalWithMarkup = directSubtotal + markupAmount;

  const contingencyPct = Math.max(0, Number(input.contingencyPct) || 10);
  const contingencyAmount = Math.round(subtotalWithMarkup * (contingencyPct / 100));

  const totalEstimatedCost = subtotalWithMarkup + contingencyAmount;
  const costPerSqFt = Number((totalEstimatedCost / sqFt).toFixed(2));

  return {
    valid: true,
    squareFootage: sqFt,
    materialCost: matCost,
    laborCost,
    equipmentPermitCost: equipmentPermit,
    directSubtotal,
    markupPct,
    markupAmount,
    contingencyPct,
    contingencyAmount,
    totalEstimatedCost,
    costPerSqFt,
  };
}

// -------------------------------------------------------------
// 11. STAIR & HANDRAIL CALCULATOR (IRC / IBC / ADA)
// -------------------------------------------------------------
export interface StairHandrailInput {
  totalRiseIn: number;          // Total vertical rise in inches (e.g. 108 for 9ft)
  targetRiserHeightIn: number;  // Target riser height (default 7.5, IRC max 7.75)
  treadRunIn: number;           // Target tread depth / run (default 10.5, IRC min 10)
  nosingIn: number;             // Nosing projection (default 1.0)
  stairWidthIn: number;         // Clear stair width (default 36)
  buildingCode: 'irc' | 'ibc_ada'; // IRC Residential or IBC / ADA Commercial
  handrailSides: 'one' | 'both' | 'wall_and_guard';
  handrailHeightIn: number;     // 34 to 38 inches (default 36)
  adaExtensions: boolean;       // 12" top extension & 12" + 1 tread bottom extension
  balusterSpacingIn: number;    // Maximum spacing between balusters (default 3.5, IRC max 4.0)
  stringerSpacingIn: number;    // 16 or 12 on center (default 16)
  wastePct: number;             // Waste percentage (e.g. 10%)
  // Unit costs
  stringerBoardPrice: number;   // 2x12 board price
  treadPrice: number;           // price per tread
  riserBoardPrice: number;      // price per riser board
  handrailPricePerFt: number;   // handrail linear ft price
  newelPostPrice: number;       // newel post price
  balusterPrice: number;        // baluster price
  hardwareAllowance: number;    // brackets & fasteners
  laborRatePerHour: number;     // carpentry labor rate
  estimatedLaborHours: number;  // labor hours estimate
}

export function formatInchFraction(inches: number): string {
  const whole = Math.floor(inches);
  const remainder = inches - whole;
  const sixteenths = Math.round(remainder * 16);
  if (sixteenths === 0) return `${whole}"`;
  if (sixteenths === 16) return `${whole + 1}"`;

  let num = sixteenths;
  let den = 16;
  while (num % 2 === 0 && den % 2 === 0) {
    num /= 2;
    den /= 2;
  }
  return whole > 0 ? `${whole} ${num}/${den}"` : `${num}/${den}"`;
}

export function calculateStairHandrail(input: StairHandrailInput) {
  const totalRise = Math.max(6, Number(input.totalRiseIn) || 108);
  const targetRiser = Math.max(4, Number(input.targetRiserHeightIn) || 7.5);
  const targetTread = Math.max(8, Number(input.treadRunIn) || 10.5);
  const nosing = Math.max(0, Number(input.nosingIn) || 1.0);
  const stairWidth = Math.max(24, Number(input.stairWidthIn) || 36);
  const code = input.buildingCode === 'ibc_ada' ? 'ibc_ada' : 'irc';
  const handrailHeight = Math.max(30, Math.min(42, Number(input.handrailHeightIn) || 36));
  const balusterSpacing = Math.max(1, Math.min(6, Number(input.balusterSpacingIn) || 3.5));
  const stringerSpacing = Number(input.stringerSpacingIn) === 12 ? 12 : 16;
  const wasteMult = 1 + (Math.max(0, Number(input.wastePct) || 10) / 100);

  // 1. Core Stair Geometry
  const numRisers = Math.max(1, Math.round(totalRise / targetRiser));
  const exactRiserHeight = totalRise / numRisers;
  const numTreads = Math.max(1, numRisers - 1); // standard landing flush
  const totalRunIn = numTreads * targetTread;
  const totalRunFt = totalRunIn / 12;
  const totalTreadDepth = targetTread + nosing;

  // Incline Angle: tan(theta) = rise / run
  const inclineRad = Math.atan(exactRiserHeight / targetTread);
  const inclineAngleDeg = Number(((inclineRad * 180) / Math.PI).toFixed(1));

  // Stringer Hypotenuse (diagonal slope):
  const stringerLengthIn = Math.sqrt(Math.pow(totalRise, 2) + Math.pow(totalRunIn, 2));
  const stringerLengthFt = Number((stringerLengthIn / 12).toFixed(2));

  // Minimum standard lumber board length for 2x12 stringer (10', 12', 14', 16', 18', 20'):
  const neededFt = stringerLengthFt + 1.2; // cut allowance
  let standardBoardFt = 10;
  if (neededFt > 10 && neededFt <= 12) standardBoardFt = 12;
  else if (neededFt > 12 && neededFt <= 14) standardBoardFt = 14;
  else if (neededFt > 14 && neededFt <= 16) standardBoardFt = 16;
  else if (neededFt > 16 && neededFt <= 18) standardBoardFt = 18;
  else if (neededFt > 18) standardBoardFt = 20;

  // Stringers count based on width and code spacing (16" or 12" o.c.):
  const stringerCount = Math.max(2, Math.ceil(stairWidth / stringerSpacing) + 1);

  // Blondel's Comfort Formula: 2 * Riser + Tread (Optimal is 24" to 25.5")
  const blondelValue = Number(((2 * exactRiserHeight) + targetTread).toFixed(2));
  let blondelStatus = 'Optimal';
  if (blondelValue < 24) blondelStatus = 'Slightly Shallow';
  else if (blondelValue > 25.5) blondelStatus = 'Slightly Steep';

  // 2. Handrail & Railing Geometry
  const hasAdaExt = Boolean(input.adaExtensions || code === 'ibc_ada');
  // ADA 505: top extension = 12" horizontal, bottom extension = 1 tread depth + 12"
  const extensionInches = hasAdaExt ? (24 + targetTread) : 8; // 8" standard safety return
  const singleRailSlopeIn = stringerLengthIn + extensionInches;
  const singleRailSlopeFt = Number((singleRailSlopeIn / 12).toFixed(2));
  const railSidesMult = input.handrailSides === 'both' ? 2 : 1;
  const totalHandrailFt = Math.ceil(singleRailSlopeFt * railSidesMult);

  // Wall brackets: 1 bracket per 48"-60" of rail, min 3 per run
  const bracketCountPerSide = Math.max(3, Math.ceil(singleRailSlopeIn / 48) + 1);
  const totalBrackets = bracketCountPerSide * railSidesMult;

  // Newel posts: minimum top + bottom post (+ intermediate post if total run exceeds 144" / 12ft)
  const postsPerSide = (totalRunIn > 144 || totalRise > 100) ? 3 : 2;
  const totalNewelPosts = postsPerSide * railSidesMult;

  // Balusters / Spindles (4" maximum sphere rule):
  const balustersPerTread = Math.max(2, Math.round(targetTread / balusterSpacing));
  const rawBalusters = numTreads * balustersPerTread * railSidesMult;
  const totalBalusters = Math.ceil(rawBalusters * 1.05); // 5% spare

  // 3. Code Compliance Checks (IRC vs IBC/ADA)
  const maxRiserLimit = code === 'ibc_ada' ? 7.0 : 7.75;
  const minTreadLimit = code === 'ibc_ada' ? 11.0 : 10.0;
  const minStairWidth = code === 'ibc_ada' ? 44.0 : 36.0;

  const riserCompliant = exactRiserHeight <= maxRiserLimit && exactRiserHeight >= 4.0;
  const treadCompliant = targetTread >= minTreadLimit;
  const widthCompliant = stairWidth >= minStairWidth;
  const handrailHeightCompliant = handrailHeight >= 34.0 && handrailHeight <= 38.0;
  const balusterCompliant = balusterSpacing <= 4.0;
  const angleOptimal = inclineAngleDeg >= 30 && inclineAngleDeg <= 37;

  const allCodePassed = riserCompliant && treadCompliant && widthCompliant && handrailHeightCompliant && balusterCompliant;

  // 4. Material Quantities & Cost Takeoff
  const stringerBoardPrice = Number(input.stringerBoardPrice) || 38.50;
  const treadPrice = Number(input.treadPrice) || 18.00;
  const riserBoardPrice = Number(input.riserBoardPrice) || 11.50;
  const handrailPricePerFt = Number(input.handrailPricePerFt) || 4.75;
  const newelPostPrice = Number(input.newelPostPrice) || 42.00;
  const balusterPrice = Number(input.balusterPrice) || 3.25;
  const hardwareAllowance = Number(input.hardwareAllowance) || 65.00;
  const laborRate = Number(input.laborRatePerHour) || 55.00;
  const laborHours = Number(input.estimatedLaborHours) || 16.0;

  const stringersCost = Math.round(stringerCount * stringerBoardPrice);
  const treadsCost = Math.round(Math.ceil(numTreads * wasteMult) * treadPrice);
  const risersCost = Math.round(Math.ceil(numRisers * wasteMult) * riserBoardPrice);
  const handrailCost = Math.round(totalHandrailFt * handrailPricePerFt);
  const postsCost = Math.round(totalNewelPosts * newelPostPrice);
  const balustersCost = Math.round(totalBalusters * balusterPrice);
  const bracketsCost = Math.round(totalBrackets * 8.50);
  const totalHardwareCost = hardwareAllowance + bracketsCost;

  const materialsSubtotal = stringersCost + treadsCost + risersCost + handrailCost + postsCost + balustersCost + totalHardwareCost;
  const laborCost = Math.round(laborHours * laborRate);
  const totalProjectCost = materialsSubtotal + laborCost;

  return {
    valid: true,
    totalRiseIn: totalRise,
    totalRiseFt: Number((totalRise / 12).toFixed(2)),
    numRisers,
    exactRiserHeightIn: Number(exactRiserHeight.toFixed(3)),
    riserFraction: formatInchFraction(exactRiserHeight),
    numTreads,
    treadRunIn: targetTread,
    treadFraction: formatInchFraction(targetTread),
    nosingIn: nosing,
    totalTreadDepthIn: totalTreadDepth,
    stairWidthIn: stairWidth,
    totalRunIn: Number(totalRunIn.toFixed(2)),
    totalRunFt: Number(totalRunFt.toFixed(2)),
    inclineAngleDeg,
    stringerLengthIn: Number(stringerLengthIn.toFixed(2)),
    stringerLengthFt,
    standardBoardFt,
    stringerCount,
    blondelValue,
    blondelStatus,
    headroomMinIn: 80, // IRC R311.7.2: 6 ft 8 in
    // Railing
    handrailSides: input.handrailSides,
    handrailHeightIn: handrailHeight,
    hasAdaExt,
    singleRailSlopeFt,
    totalHandrailFt,
    totalBrackets,
    totalNewelPosts,
    balustersPerTread,
    totalBalusters,
    // Compliance Diagnostics
    codeStandard: code === 'ibc_ada' ? 'IBC 2024 / ADA 505 (Commercial)' : 'IRC 2024 (Residential)',
    allCodePassed,
    riserCompliant,
    maxRiserLimit,
    treadCompliant,
    minTreadLimit,
    widthCompliant,
    minStairWidth,
    handrailHeightCompliant,
    balusterCompliant,
    angleOptimal,
    // Costs
    stringersCost,
    treadsCost,
    risersCost,
    handrailCost,
    postsCost,
    balustersCost,
    totalHardwareCost,
    materialsSubtotal,
    laborCost,
    totalProjectCost,
  };
}

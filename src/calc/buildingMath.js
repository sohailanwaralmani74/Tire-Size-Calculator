/**
 * Plain JS export of building material calculation engine for Node runtime & test runner.
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
      {
        id: 'vapor-barrier',
        slug: 'vapor-barrier-calculator',
        name: 'Vapor Barrier & Moisture Retarder Calculator',
        shortTitle: 'Vapor Barrier',
        badge: 'Crawl Space, Slab & Walls',
        summary: 'Calculate poly film rolls (6, 10, 15, 20 mil), overlap square footage, seam tape rolls, termination bars, and fasteners.',
        lastmod: '2026-10-18',
      },
    ],
  },
  {
    id: 'framing-lumber',
    name: 'Framing & Lumber',
    shortName: 'Framing',
    description: 'Wall studs, plates, headers, stairs, door frames, garage doors, and sheathing',
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
        id: 'door-frame-material',
        slug: 'door-frame-material-calculator',
        name: 'Door Frame Material & Rough Opening Calculator',
        shortTitle: 'Door Framing',
        badge: 'Rough Opening & Trim',
        summary: 'Calculate rough opening dimensions, king and jack studs, structural header, jamb boards, casing trim, hinges, and fasteners.',
        lastmod: '2026-10-17',
      },
      {
        id: 'garage-door-size',
        slug: 'garage-door-size-calculator',
        name: 'Garage Door Size & Framing Opening Calculator',
        shortTitle: 'Garage Doors',
        badge: 'Rough Opening & Header',
        summary: 'Calculate finished and rough opening dimensions, goalpost jambs, LVL header sizing, headroom clearance, and track specs.',
        lastmod: '2026-10-16',
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
    name: 'Roofing, Siding & Flooring',
    shortName: 'Roof & Siding',
    description: 'Shingles, exterior siding, house wrap, and tile layout',
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
        id: 'siding-material',
        slug: 'siding-material-calculator',
        name: 'Siding Material & House Wrap Calculator',
        shortTitle: 'Siding Material',
        badge: 'Squares, Trim & Tyvek',
        summary: 'Calculate siding squares (vinyl, fiber cement, cedar, board & batten), starter strips, J-channels, corner posts, and housewrap.',
        lastmod: '2026-10-21',
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

export function getCalculatorBySlug(slug) {
  const clean = slug.replace(/^\//, '').replace(/^.\//, '');
  return ALL_CALCULATORS.find((c) => c.slug === clean) || ALL_CALCULATORS[0];
}

export function getCalculatorById(id) {
  return ALL_CALCULATORS.find((c) => c.id === id) || ALL_CALCULATORS[0];
}

export function calculateConcrete(input) {
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

  const bags80 = Math.ceil(Number((totalCuFt / 0.60).toFixed(4)));
  const bags60 = Math.ceil(Number((totalCuFt / 0.45).toFixed(4)));
  const bags50 = Math.ceil(Number((totalCuFt / 0.375).toFixed(4)));
  const bags40 = Math.ceil(Number((totalCuFt / 0.30).toFixed(4)));

  const spacingIn = Math.max(6, Number(input.rebarSpacingIn) || 18);
  const spacingFt = spacingIn / 12;
  const l = Number(input.lengthFt) || 10;
  const w = Number(input.widthFt) || 10;
  const numBarsLengthwise = Math.ceil(w / spacingFt) + 1;
  const numBarsWidthwise = Math.ceil(l / spacingFt) + 1;
  const totalRebarLinearFt = (numBarsLengthwise * l) + (numBarsWidthwise * w);
  const rebarSticks20ft = Math.ceil((totalRebarLinearFt * 1.1) / 20);

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

export function calculateBrick(input) {
  const wallL = Math.max(0.1, Number(input.wallLengthFt) || 20);
  const wallH = Math.max(0.1, Number(input.wallHeightFt) || 8);
  const openings = Math.max(0, Number(input.openingsSqFt) || 0);
  const grossArea = wallL * wallH;
  const netArea = Math.max(0.1, grossArea - openings);

  const brickDims = {
    modular: [7.5, 2.25, 3.5],
    king: [9.625, 2.625, 2.625],
    queen: [7.625, 2.75, 2.75],
    engineer: [7.625, 2.75, 3.5],
    utility: [11.625, 3.625, 3.625],
  };

  const [bL, bH] = brickDims[input.brickType] || brickDims.modular;
  const joint = Math.max(0.125, Number(input.mortarJointIn) || 0.375);

  const brickFaceAreaSqIn = (bL + joint) * (bH + joint);
  const bricksPerSqFt = (144 / brickFaceAreaSqIn) * (input.wytheCount || 1);

  const rawBricks = netArea * bricksPerSqFt;
  const wasteMult = 1 + (Math.max(0, input.wastePct) || 5) / 100;
  const totalBricks = Math.ceil(rawBricks * wasteMult);

  const mortarBags = Math.ceil(totalBricks / 140);
  const sandTons = Number(((totalBricks / 1000) * 0.55).toFixed(2));
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

export function calculateCmu(input) {
  const wallL = Math.max(0.1, Number(input.wallLengthFt) || 24);
  const wallH = Math.max(0.1, Number(input.wallHeightFt) || 8);
  const openings = Math.max(0, Number(input.openingsSqFt) || 0);
  const netArea = Math.max(0.1, (wallL * wallH) - openings);

  const blocksPerSqFt = 1.125;
  const rawBlocks = netArea * blocksPerSqFt;
  const wasteMult = 1 + (Math.max(0, input.wastePct) || 5) / 100;
  const totalBlocks = Math.ceil(rawBlocks * wasteMult);

  const mortarBags = Math.ceil(totalBlocks / 38);

  let coreFillCuYds = 0;
  const spacing = Number(input.groutFillSpacingIn) || 32;
  if (spacing > 0) {
    const coresPerBlock = 2;
    const totalCores = totalBlocks * coresPerBlock;
    const fillFraction = 16 / Math.max(16, spacing);
    const filledCores = totalCores * fillFraction;
    const coreCuFt = (input.blockSize === '12x8x16' ? 0.38 : input.blockSize === '6x8x16' ? 0.17 : 0.24);
    coreFillCuYds = Number(((filledCores * coreCuFt) / 27).toFixed(2));
  }

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

export function calculateFraming(input) {
  const wallL = Math.max(1, Number(input.wallLengthFt) || 30);
  const wallH = Math.max(6, Number(input.wallHeightFt) || 8);
  const spacingIn = Number(input.studSpacingIn) === 24 ? 24 : 16;
  const spacingFt = spacingIn / 12;

  const commonStuds = Math.ceil(wallL / spacingFt) + 1;
  const corners = Math.max(0, Number(input.cornerCount) || 4);
  const cornerStuds = corners * 3;

  const doors = Math.max(0, Number(input.doorCount) || 1);
  const windows = Math.max(0, Number(input.windowCount) || 2);
  const openingStuds = (doors * 4) + (windows * 5);

  const rawTotalStuds = commonStuds + cornerStuds + openingStuds;
  const wasteMult = 1 + (Math.max(0, input.wastePct) || 10) / 100;
  const totalStuds = Math.ceil(rawTotalStuds * wasteMult);

  const totalPlateLinearFt = wallL * 3;
  const plateBoards16ft = Math.ceil((totalPlateLinearFt * 1.1) / 16);

  const headerLinearFt = (doors + windows) * 4 * 2;
  const headerBoards10ft = Math.ceil((headerLinearFt * 1.1) / 10);

  const totalStudLinearFt = totalStuds * wallH;
  const totalLinearFt = totalStudLinearFt + totalPlateLinearFt + headerLinearFt;
  const estimatedBoardFt = Math.round(totalLinearFt * (2 / 3));

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

export function calculateSheathing(input) {
  const area = Math.max(1, Number(input.areaSqFt) || 640);
  const sheetSqFt = input.sheetSize === '4x10' ? 40 : 32;
  const rawSheets = area / sheetSqFt;
  const wasteMult = 1 + (Math.max(0, input.wastePct) || 10) / 100;
  const totalSheets = Math.ceil(rawSheets * wasteMult);

  const fastenersCount = totalSheets * 36;
  const nailsLbs = Math.ceil(fastenersCount / 100);

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

export function calculateDrywall(input) {
  const l = Math.max(1, Number(input.roomLengthFt) || 16);
  const w = Math.max(1, Number(input.roomWidthFt) || 14);
  const h = Math.max(6, Number(input.wallHeightFt) || 9);
  const openings = Math.max(0, Number(input.openingsSqFt) || 40);

  const wallArea = (2 * (l + w) * h) - openings;
  const ceilingArea = input.includeCeiling ? (l * w) : 0;
  const totalArea = Math.max(1, wallArea + ceilingArea);

  const sheetAreas = {
    '4x8': 32,
    '4x10': 40,
    '4x12': 48,
  };
  const sheetSqFt = sheetAreas[input.sheetSize] || 32;
  const rawSheets = totalArea / sheetSqFt;
  const wasteMult = 1 + (Math.max(0, input.wastePct) || 10) / 100;
  const totalSheets = Math.ceil(rawSheets * wasteMult);

  const compoundBuckets = Math.ceil(totalArea / 380);
  const tapeRolls250ft = Math.ceil(totalArea / 500);
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

export function calculatePaint(input) {
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

export function calculateRoofing(input) {
  const baseArea = Math.max(1, Number(input.footprintAreaSqFt) || 1800);
  const pitch = Math.max(0, Number(input.pitchRiseOver12) || 6);

  const pitchFactor = Math.sqrt(1 + Math.pow(pitch / 12, 2));
  const trueRoofArea = baseArea * pitchFactor;

  const rawSquares = trueRoofArea / 100;
  const wasteMult = 1 + (Math.max(0, input.wastePct) || 12) / 100;
  const totalSquares = Number((rawSquares * wasteMult).toFixed(2));

  const totalBundles = Math.ceil(totalSquares * 3);
  const underlaymentRollsSynthetic = Math.ceil(totalSquares / 10);
  const underlaymentRollsFelt15 = Math.ceil(totalSquares / 4);

  const ridgeFt = Math.max(0, Number(input.ridgeLengthFt) || 40);
  const ridgeBundles = Math.ceil(ridgeFt / 33);

  const perimeterFt = Math.max(10, Number(input.eaveLengthFt) || 120);
  const dripEdgeSticks10ft = Math.ceil((perimeterFt * 1.1) / 10);
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

export function calculateTile(input) {
  const area = Math.max(1, Number(input.areaSqFt) || 240);
  const tL = Math.max(1, Number(input.tileLengthIn) || 12);
  const tW = Math.max(1, Number(input.tileWidthIn) || 12);
  const tThick = Math.max(0.125, Number(input.tileThicknessIn) || 0.375);
  const jW = Math.max(0.03125, Number(input.jointWidthIn) || 0.125);
  const wasteMult = 1 + (Math.max(0, input.wastePct) || 10) / 100;

  const totalAreaWithWaste = area * wasteMult;
  const tileSqFt = (tL * tW) / 144;
  const totalTiles = Math.ceil(totalAreaWithWaste / tileSqFt);

  const boxSqFt = Math.max(1, Number(input.sqFtPerBox) || 15);
  const totalBoxes = Math.ceil(totalAreaWithWaste / boxSqFt);

  const areaSqIn = totalAreaWithWaste * 144;
  const groutPounds = Math.ceil((((tL + tW) * tThick * jW * areaSqIn * 0.061) / (tL * tW)) * 1.05);
  const groutBags25lb = Math.ceil(groutPounds / 25);
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

export function calculateConstructionCost(input) {
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
export function formatInchFraction(inches) {
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

export function calculateStairHandrail(input) {
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

// -------------------------------------------------------------
// 12. VAPOR BARRIER & MOISTURE RETARDER CALCULATOR
// -------------------------------------------------------------
export function calculateVaporBarrier(input) {
  const l = Math.max(1, Number(input.lengthFt) || 40);
  const w = Math.max(1, Number(input.widthFt) || 30);
  const baseAreaSqFt = l * w;
  const perimeterFt = 2 * (l + w);
  const wallHt = Math.max(0, Number(input.crawlWallHeightFt) || 2.5);
  const piers = Math.max(0, Number(input.piersCount) || 0);
  const pierPerim = Math.max(1, Number(input.pierPerimeterFt) || 4);
  const seamOverlapIn = Math.max(4, Number(input.seamOverlapIn) || 12);
  const wastePct = Math.max(0, Number(input.wastePct) || 10);
  const rollWidth = Math.max(6, Number(input.rollWidthFt) || 12);
  const rollLength = Math.max(20, Number(input.rollLengthFt) || 100);
  const rollSqFt = rollWidth * rollLength;

  let wallAreaSqFt = 0;
  let pierAreaSqFt = 0;
  if (input.application === 'crawlspace' || input.application === 'basement_floor') {
    wallAreaSqFt = perimeterFt * wallHt;
    pierAreaSqFt = piers * ((pierPerim * wallHt) + 4);
  } else if (input.application === 'slab') {
    wallAreaSqFt = perimeterFt * 0.75; // 9" slab edge perimeter turn-up
  }

  const grossAreaSqFt = Math.round(baseAreaSqFt + wallAreaSqFt + pierAreaSqFt);
  const effectiveRollWidthFt = Math.max(4, rollWidth - (seamOverlapIn / 12));
  const overlapFactor = 1 + (seamOverlapIn / (rollWidth * 12));
  const wasteFactor = 1 + (wastePct / 100);
  const totalAreaWithOverlapAndWaste = Math.round(grossAreaSqFt * overlapFactor * wasteFactor);
  const rollsNeeded = Math.ceil(totalAreaWithOverlapAndWaste / rollSqFt);

  // Seam linear footage
  const numRollRuns = Math.ceil(w / effectiveRollWidthFt);
  const longSeamsFt = Math.max(0, numRollRuns - 1) * l;
  const perimeterSealFt = perimeterFt;
  const pierSeamsFt = piers * pierPerim;
  const totalSeamLinearFt = Math.round(longSeamsFt + perimeterSealFt + pierSeamsFt);
  // Seam tape (180 ft per roll)
  const tapeRollsNeeded = Math.max(1, Math.ceil(totalSeamLinearFt / 180));

  // Termination bars (10 ft length) along crawlspace/basement wall tops
  const termBarsNeeded = (input.application === 'crawlspace' || input.application === 'basement_floor')
    ? Math.ceil(perimeterFt / 10)
    : 0;
  const fastenersCount = termBarsNeeded * 8; // masonry pins every 15"

  // Material classification & perm rating
  let permRating = '< 0.06 Perms (Class I Vapor Retarder)';
  let astmClass = 'IRC R408.3 Code Minimum Ground Cover';
  if (input.milThickness === 10) {
    permRating = '< 0.03 Perms (Class I Impermeable)';
    astmClass = 'ASTM E1745 Class B Heavy-Duty';
  } else if (input.milThickness === 15) {
    permRating = '< 0.018 Perms (Puncture Resistant)';
    astmClass = 'ASTM E1745 Class A Commercial / Stego-Grade';
  } else if (input.milThickness === 20) {
    permRating = '< 0.009 Perms (Maximum Hydrostatic & Radon Barrier)';
    astmClass = 'ASTM E1745 Class A Heavy Commercial / Radon Barrier';
  }

  // Cost estimates
  const rollPrice = Number(input.rollPrice) || (input.milThickness === 6 ? 85 : input.milThickness === 10 ? 165 : input.milThickness === 15 ? 275 : 380);
  const tapePrice = Number(input.seamTapeRollPrice) || 32.00;
  const termBarPrice = Number(input.terminationBarPrice) || 14.50;
  const fastenersPrice = Number(input.fastenersPackPrice) || 18.00;
  const laborRate = Number(input.laborRatePerSqFt) || 0.75;

  const rollsCost = rollsNeeded * rollPrice;
  const tapeCost = tapeRollsNeeded * tapePrice;
  const termBarsCost = termBarsNeeded * termBarPrice;
  const fastenersCost = Math.ceil(fastenersCount / 100) * fastenersPrice;
  const materialsSubtotal = Math.round(rollsCost + tapeCost + termBarsCost + fastenersCost);
  const laborCost = Math.round(grossAreaSqFt * laborRate);
  const totalEstimatedCost = materialsSubtotal + laborCost;

  return {
    valid: true,
    application: input.application,
    baseAreaSqFt,
    wallAreaSqFt: Math.round(wallAreaSqFt),
    pierAreaSqFt: Math.round(pierAreaSqFt),
    grossAreaSqFt,
    totalAreaWithOverlapAndWaste,
    milThickness: input.milThickness,
    permRating,
    astmClass,
    rollDimensions: `${rollWidth} ft × ${rollLength} ft (${rollSqFt.toLocaleString()} sq ft)`,
    rollsNeeded,
    totalSeamLinearFt,
    tapeRollsNeeded,
    termBarsNeeded,
    fastenersCount,
    rollsCost,
    tapeCost,
    termBarsCost,
    fastenersCost,
    materialsSubtotal,
    laborCost,
    totalEstimatedCost,
  };
}

// -------------------------------------------------------------
// 13. GARAGE DOOR SIZE & FRAMING OPENING CALCULATOR
// -------------------------------------------------------------
export function calculateGarageDoorSize(input) {
  const wFt = Math.max(6, Number(input.doorWidthFt) || 16);
  const hFt = Math.max(6, Number(input.doorHeightFt) || 7);
  const ceilingFt = Math.max(hFt + 0.5, Number(input.ceilingHeightFt) || 10);
  const finishedWidthIn = wFt * 12;
  const finishedHeightIn = hFt * 12;

  // Standard Wood Goalpost Jambs: 2x wood jamb liners (1.5" thickness each)
  // Rough opening allows two 1.5" side jambs and one 1.5" head jamb
  const roughWidthIn = finishedWidthIn + 3.0; // e.g. 16' door = 195" = 16 ft 3 in
  const roughHeightIn = finishedHeightIn + 1.5; // e.g. 7' door = 85.5" = 7 ft 1-1/2 in

  // Structural Header
  const headerSpanFt = Number((roughWidthIn / 12).toFixed(2));
  const headerLengthIn = roughWidthIn + 6.0; // bears 3.0" on double trimmers each side
  let recommendedHeader = 'Double 2×10 Lumber with 1/2″ OSB Spacer';
  if (wFt >= 10 && wFt <= 16) {
    recommendedHeader = 'Double 1-3/4″ × 11-7/8″ Engineered LVL Beam';
  } else if (wFt > 16) {
    recommendedHeader = 'Triple 1-3/4″ × 11-7/8″ Engineered LVL Beam (or Steel Lintel)';
  }

  // Clearances & Headroom
  const availableHeadroomIn = Number(((ceilingFt * 12) - finishedHeightIn).toFixed(1));
  const trackRadius = input.trackRadiusIn === 12 ? 12 : 15;
  const requiredHeadroomIn = trackRadius + (input.hasElectricOpener ? 3 : 0);

  let headroomStatus = 'Optimal Standard Track';
  let requiresLowHeadroom = false;
  if (availableHeadroomIn < 10) {
    headroomStatus = 'Critical: Requires Dual-Track Low-Headroom Kit (min 4.5″–9″)';
    requiresLowHeadroom = true;
  } else if (availableHeadroomIn < requiredHeadroomIn) {
    headroomStatus = 'Tight: Low-Headroom Hardware or 12″ Radius Track Recommended';
    requiresLowHeadroom = true;
  } else if (availableHeadroomIn > 36) {
    headroomStatus = 'Spacious: High-Lift or Vertical-Lift Track Compatible';
  }

  const sideroomRequiredIn = 4.0; // 3.75" min, 5.5" recommended
  const backroomDepthIn = finishedHeightIn + (input.hasElectricOpener ? 48 : 18);
  const backroomDepthFt = Number((backroomDepthIn / 12).toFixed(2));

  // Framing Takeoff
  const sideJambLumber = input.wallFraming === '2x6' ? '2×6 × 8ft (or 10ft) Lumber' : '2×4 × 8ft (or 10ft) Lumber';
  const weatherstripLinFt = Math.ceil((2 * hFt) + wFt);

  // Costs
  const doorCost = Number(input.doorUnitCost) || (wFt > 12 ? 1650 : 850);
  const openerCost = input.hasElectricOpener ? (Number(input.openerCost) || 280) : 0;
  const headerCost = Number(input.headerLumberCost) || (wFt > 12 ? 190 : 95);
  const jambsCost = Number(input.framingJambsCost) || 75;
  const weatherstripCost = Number(input.weatherstripCost) || 45;
  const laborCost = Number(input.laborInstallCost) || (wFt > 12 ? 550 : 380);

  const materialsSubtotal = doorCost + openerCost + headerCost + jambsCost + weatherstripCost;
  const totalEstimatedCost = materialsSubtotal + laborCost;

  return {
    valid: true,
    doorSizeLabel: `${wFt} ft × ${hFt} ft (${finishedWidthIn}″ × ${finishedHeightIn}″)`,
    finishedWidthIn,
    finishedHeightIn,
    roughWidthIn,
    roughHeightIn,
    roughWidthFormatted: `${Math.floor(roughWidthIn / 12)} ft ${roughWidthIn % 12} in`,
    roughHeightFormatted: `${Math.floor(roughHeightIn / 12)} ft ${(roughHeightIn % 12).toFixed(1)} in`,
    headerSpanFt,
    headerLengthIn,
    recommendedHeader,
    availableHeadroomIn,
    requiredHeadroomIn,
    headroomStatus,
    requiresLowHeadroom,
    sideroomRequiredIn,
    backroomDepthIn,
    backroomDepthFt,
    sideJambLumber,
    weatherstripLinFt,
    doorCost,
    openerCost,
    headerCost,
    jambsCost,
    weatherstripCost,
    materialsSubtotal,
    laborCost,
    totalEstimatedCost,
  };
}

// -------------------------------------------------------------
// 14. DOOR FRAME MATERIAL & ROUGH OPENING CALCULATOR
// -------------------------------------------------------------
export function calculateDoorFrame(input) {
  const w = Math.max(18, Number(input.doorWidthIn) || 36);
  const h = Math.max(60, Number(input.doorHeightIn) || 80);
  const wallHt = Math.max(8, Number(input.wallHeightFt) || 8);
  const is2x6 = input.wallStudSize === '2x6';
  const casingSides = input.casingSides === 1 ? 1 : 2;
  const casingWidth = Math.max(1.5, Number(input.casingWidthIn) || 2.5);

  // Rough Opening dimensions based on door type
  let roWidthIn = w + 2.0;
  let roHeightIn = h + 2.5;

  if (input.doorType === 'interior_double') {
    roWidthIn = (w * 2) + 2.0;
    roHeightIn = h + 2.5;
  } else if (input.doorType === 'pocket_door') {
    roWidthIn = (w * 2) + 1.0;
    roHeightIn = h + 4.5;
  } else if (input.doorType === 'bifold') {
    roWidthIn = w + 2.0;
    roHeightIn = h + 2.0;
  }

  // Framing Lumber Takeoff
  const kingStudsCount = 2;
  const jackStudsCount = 2;
  const headerLengthIn = roWidthIn + 3.0; // 1.5" bearing on each trimmer
  const crippleStudsCount = Math.max(1, Math.floor(roWidthIn / 16));
  const bottomSillPlateLengthIn = roWidthIn;

  // Jambs Takeoff
  const jambWidthIn = is2x6 ? 6.5625 : 4.5625; // 6-9/16" or 4-9/16"
  const jambWidthFraction = is2x6 ? '6 9/16"' : '4 9/16"';
  const stopMoldingLinFt = Math.ceil(((2 * h) + w) / 12);

  // Casing & Trim
  const casingLinFtPerSide = ((2 * h + w) / 12) + ((casingWidth * 4) / 12) + 1.0;
  const totalCasingLinFt = Math.ceil(casingLinFtPerSide * casingSides);

  // Hardware
  const hingeCount = h > 80 || input.doorType === 'exterior_single' ? 4 : 3;

  // Costs
  const studPrice = Number(input.studPrice) || 5.85;
  const headerBoardPrice = Number(input.headerBoardPrice) || 14.50;
  const jambKitPrice = Number(input.jambKitPrice) || 38.00;
  const casingPricePerFt = Number(input.casingPricePerFt) || 1.65;
  const hingesPrice = Number(input.hardwareHingesPrice) || 18.00;
  const shimPrice = Number(input.shimPackPrice) || 6.50;
  const laborRate = Number(input.laborRatePerHour) || 50.00;
  const laborHours = Number(input.estimatedLaborHours) || 3.0;

  const framingStudsCost = Math.round((kingStudsCount + jackStudsCount + crippleStudsCount) * studPrice);
  const headerCost = Math.round(2 * headerBoardPrice);
  const jambCost = Math.round(jambKitPrice);
  const casingCost = Math.round(totalCasingLinFt * casingPricePerFt);
  const hardwareCost = Math.round(hingesPrice + shimPrice);

  const materialsSubtotal = framingStudsCost + headerCost + jambCost + casingCost + hardwareCost;
  const laborCost = Math.round(laborHours * laborRate);
  const totalEstimatedCost = materialsSubtotal + laborCost;

  return {
    valid: true,
    doorType: input.doorType,
    doorNominalSize: `${w}″ × ${h}″ (${(w / 12).toFixed(1)}′ × ${(h / 12).toFixed(1)}′)`,
    roWidthIn,
    roHeightIn,
    roWidthFormatted: `${Math.floor(roWidthIn / 12)} ft ${roWidthIn % 12} in`,
    roHeightFormatted: `${Math.floor(roHeightIn / 12)} ft ${(roHeightIn % 12).toFixed(1)} in`,
    kingStudsCount,
    jackStudsCount,
    jackStudLengthIn: roHeightIn + 1.5,
    headerLengthIn,
    headerType: input.headerType,
    crippleStudsCount,
    jambWidthFraction,
    jambWidthIn,
    stopMoldingLinFt,
    totalCasingLinFt,
    casingSides,
    hingeCount,
    framingStudsCost,
    headerCost,
    jambCost,
    casingCost,
    hardwareCost,
    materialsSubtotal,
    laborCost,
    totalEstimatedCost,
  };
}

// ============================================================================
// 15. Siding Material & House Wrap Calculator
// ============================================================================
export function calculateSidingMaterial(input) {
  const grossArea = Math.max(100, Number(input.grossWallAreaSqFt) || 1800);
  const winCount = Math.max(0, Number(input.windowCount) || 8);
  const winAvg = Math.max(0, Number(input.windowAvgSqFt) || 15);
  const doorCount = Math.max(0, Number(input.doorCount) || 2);
  const doorAvg = Math.max(0, Number(input.doorAvgSqFt) || 21);
  const waste = Math.max(0, Number(input.wastePct) || 10);
  const sidingType = input.sidingType || 'vinyl_double_4';

  const windowArea = winCount * winAvg;
  const doorArea = doorCount * doorAvg;
  const deductionsAreaSqFt = windowArea + doorArea;
  const netWallAreaSqFt = Math.max(50, grossArea - deductionsAreaSqFt);
  const sidingSquares = Math.round(((netWallAreaSqFt * (1 + waste / 100)) / 100) * 10) / 10;

  let cartonOrBoardCount = 0;
  let unitLabel = 'Cartons (2 Squares each)';
  if (sidingType === 'vinyl_double_4') {
    cartonOrBoardCount = Math.ceil(sidingSquares / 2);
    unitLabel = 'Cartons (2 Squares each)';
  } else if (sidingType === 'fiber_cement_hardie') {
    cartonOrBoardCount = Math.ceil((netWallAreaSqFt * (1 + waste / 100)) / 7.0);
    unitLabel = '12-ft Planks (7 sq ft exposure)';
  } else if (sidingType === 'wood_cedar_lap') {
    cartonOrBoardCount = Math.ceil((netWallAreaSqFt * (1 + waste / 100)) / 4.5);
    unitLabel = '12-ft Bevel Planks (4.5 sq ft exposure)';
  } else {
    cartonOrBoardCount = Math.ceil((netWallAreaSqFt * (1 + waste / 100)) / 10.0);
    unitLabel = 'Boards (12″) + Battens (2.5″)';
  }

  const houseWrapRolls = Math.ceil((grossArea * 1.15) / 900);
  const seamTapeRolls = Math.max(1, Math.ceil(grossArea / 600));
  const perimeterTrim = Number(input.perimeterTrimFt) || 140;
  const starterPcs10ft = Math.ceil(perimeterTrim / 10);
  const jChannelPcs12ft = Math.ceil(((winCount * 18) + (doorCount * 17) + (perimeterTrim * 0.4)) / 12);
  const outsideCorners = Math.ceil((Number(input.outsideCornerFt) || 40) / 10);
  const insideCorners = Math.ceil((Number(input.insideCornerFt) || 20) / 10);
  const nailBoxes = Math.max(1, Math.ceil(sidingSquares / 2.5));

  const defaultPrices = {
    vinyl_double_4: 135.00,
    fiber_cement_hardie: 245.00,
    wood_cedar_lap: 285.00,
    board_and_batten: 195.00,
  };
  const squarePrice = Number(input.sidingSquarePrice) || defaultPrices[sidingType] || 135.00;
  const wrapPrice = Number(input.houseWrapRollPrice) || 110.00;
  const starterPrice = Number(input.starterPricePer10ft) || 7.50;
  const jChannelPrice = Number(input.jChannelPricePer12ft) || 9.20;
  const cornerPrice = Number(input.cornerPostPrice) || 19.50;
  const nailBoxPrice = Number(input.sidingNailBoxPrice) || 26.00;
  const laborRate = Number(input.laborRatePerHour) || 52.00;
  const laborHours = Number(input.estimatedLaborHours) || Math.max(12, Math.round(sidingSquares * 2.4));

  const sidingCost = Math.round(sidingSquares * squarePrice);
  const wrapCost = Math.round((houseWrapRolls * wrapPrice) + (seamTapeRolls * 14.50));
  const starterCost = Math.round(starterPcs10ft * starterPrice);
  const jChannelCost = Math.round(jChannelPcs12ft * jChannelPrice);
  const cornersCost = Math.round((outsideCorners + insideCorners) * cornerPrice);
  const fastenersCost = Math.round(nailBoxes * nailBoxPrice);

  const materialsSubtotal = sidingCost + wrapCost + starterCost + jChannelCost + cornersCost + fastenersCost;
  const laborCost = Math.round(laborHours * laborRate);
  const totalEstimatedCost = materialsSubtotal + laborCost;
  const costPerSqFt = Math.round((totalEstimatedCost / netWallAreaSqFt) * 100) / 100;

  return {
    valid: true,
    grossWallAreaSqFt: grossArea,
    windowArea,
    doorArea,
    deductionsAreaSqFt,
    netWallAreaSqFt,
    sidingSquares,
    cartonOrBoardCount,
    unitLabel,
    sidingType,
    houseWrapRolls,
    seamTapeRolls,
    starterPcs10ft,
    jChannelPcs12ft,
    outsideCorners,
    insideCorners,
    nailBoxes,
    sidingCost,
    wrapCost,
    starterCost,
    jChannelCost,
    cornersCost,
    fastenersCost,
    materialsSubtotal,
    laborHours,
    laborCost,
    totalEstimatedCost,
    costPerSqFt,
  };
}

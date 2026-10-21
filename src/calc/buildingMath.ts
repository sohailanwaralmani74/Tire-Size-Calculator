/**
 * Pure deterministic calculation engine for Building Material & Construction Cost Calculators.
 * Covers: Concrete & Footings, Brick & Mortar, CMU Blocks, Wall Framing, Sheathing,
 * Drywall, Paint Coverage, Roofing Shingles & Pitch, Tile & Grout, and Project Cost Estimating.
 */

export const CALCULATOR_CATEGORIES = [
  {
    id: 'concrete-masonry',
    name: 'Concrete, Masonry & Reinforcement',
    shortName: 'Concrete & Masonry',
    description: 'Slabs, footings, rebar grid, bricks, CMU blocks, and vapor retarders',
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
        id: 'rebar-mesh',
        slug: 'rebar-mesh-calculator',
        name: 'Concrete Rebar & Wire Mesh Calculator',
        shortTitle: 'Rebar & Mesh',
        badge: 'Sticks, Ties & Chairs',
        summary: 'Calculate rebar grid linear footage, 20-foot sticks (#3, #4, #5, #6), lap splices, support chairs, and welded wire mesh rolls.',
        lastmod: '2026-10-19',
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
    name: 'Framing, Openings & Decks',
    shortName: 'Framing & Lumber',
    description: 'Wall studs, plates, headers, stairs, door frames, garage doors, deck lumber, and sheathing',
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
        id: 'deck',
        slug: 'deck-calculator',
        name: 'Deck & Patio Framing Calculator',
        shortTitle: 'Deck Framing',
        badge: 'Joists, Beams & Piers',
        summary: 'Calculate ledger boards, joist layout, beam lumber, post count, frost pier footings, decking boards, and hardware takeoff.',
        lastmod: '2026-10-19',
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
    id: 'earthwork-paving',
    name: 'Earthwork, Aggregates & Paving',
    shortName: 'Earthwork & Paving',
    description: 'Excavation, trenching, gravel sub-bases, retaining walls, and asphalt paving',
    calculators: [
      {
        id: 'gravel',
        slug: 'gravel-calculator',
        name: 'Gravel, Sand & Aggregate Base Calculator',
        shortTitle: 'Gravel & Sand',
        badge: 'Tons & Truckloads',
        summary: 'Calculate crushed stone, gravel, and sand volumes in cubic yards and tons with compaction factor and dump truck delivery loads.',
        lastmod: '2026-10-19',
      },
      {
        id: 'retaining-wall',
        slug: 'retaining-wall-calculator',
        name: 'Retaining Wall Block & Geogrid Calculator',
        shortTitle: 'Retaining Wall',
        badge: 'SRW Blocks & Geogrid',
        summary: 'Calculate segmental retaining wall blocks, buried base course, drainage gravel backfill, geogrid reinforcement, and cap units.',
        lastmod: '2026-10-19',
      },
      {
        id: 'excavation',
        slug: 'excavation-calculator',
        name: 'Excavation & Trench Earthwork Calculator',
        shortTitle: 'Excavation & Trench',
        badge: 'Cubic Yards & Swell',
        summary: 'Calculate bank cubic yards, loose swell volume, OSHA layback slopes, dump truck cycles, and excavator machine hours.',
        lastmod: '2026-10-19',
      },
      {
        id: 'asphalt-paving',
        slug: 'asphalt-paving-calculator',
        name: 'Asphalt Driveway & Paving Cost Calculator',
        shortTitle: 'Asphalt Paving',
        badge: 'HMA Tons & Base',
        summary: 'Calculate hot-mix asphalt (HMA) tons, stone sub-base, tack coat primer, roller hours, and square foot paving contractor costs.',
        lastmod: '2026-10-19',
      },
    ],
  },
  {
    id: 'envelope-exterior',
    name: 'Exterior Envelope, Siding & Roofing',
    shortName: 'Envelope & Roofing',
    description: 'Roofing shingles, siding, soffit, gutters, fencing, and thermal insulation',
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
        id: 'soffit-gutter',
        slug: 'soffit-fascia-gutter-calculator',
        name: 'Soffit, Fascia & Seamless Gutter Calculator',
        shortTitle: 'Soffit & Gutters',
        badge: 'Gutters & Downspouts',
        summary: 'Calculate vented soffit panels, pre-bent fascia covers, seamless K-style gutters, downspouts, elbows, and hidden screw hangers.',
        lastmod: '2026-10-19',
      },
      {
        id: 'fence',
        slug: 'fence-calculator',
        name: 'Fence Material & Post Spacing Calculator',
        shortTitle: 'Fence & Posts',
        badge: 'Pickets, Rails & Bags',
        summary: 'Calculate line/corner posts, concrete bags per hole, 2x4 horizontal rails, dog-ear pickets, and gate hardware for privacy fences.',
        lastmod: '2026-10-19',
      },
      {
        id: 'insulation',
        slug: 'insulation-calculator',
        name: 'Insulation R-Value & Batt/Blow Calculator',
        shortTitle: 'Insulation',
        badge: 'R-Value, Batts & Bags',
        summary: 'Calculate fiberglass batts, blown-in cellulose/fiberglass bag counts, and rigid foam boards for attics, exterior walls, and crawlspaces.',
        lastmod: '2026-10-19',
      },
    ],
  },
  {
    id: 'cost-budget',
    name: 'Interior Finishes & Project Budget',
    shortName: 'Finishes & Budget',
    description: 'Drywall, paint coverage, tile flooring, and comprehensive construction cost estimation',
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
      {
        id: 'flooring-tile',
        slug: 'flooring-tile-calculator',
        name: 'Tile, Grout & Flooring Calculator',
        shortTitle: 'Tile & Grout',
        badge: 'Boxes & Grout Lbs',
        summary: 'Calculate square footage, tile boxes with waste, grout weight (lbs), and thin-set bags.',
        lastmod: '2026-10-05',
      },
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

// -------------------------------------------------------------
// 12. VAPOR BARRIER & MOISTURE RETARDER CALCULATOR
// -------------------------------------------------------------
export interface VaporBarrierInput {
  application: 'crawlspace' | 'slab' | 'wall' | 'basement_floor';
  lengthFt: number;
  widthFt: number;
  crawlWallHeightFt?: number; // for crawlspace run-up (default 2.5)
  piersCount?: number;        // support piers (default 6)
  pierPerimeterFt?: number;   // default 4 ft
  milThickness: 6 | 10 | 15 | 20;
  rollWidthFt?: number;       // default 12 ft
  rollLengthFt?: number;      // default 100 ft
  seamOverlapIn: number;      // default 12 in (IRC min 6 in)
  wastePct: number;           // default 10%
  // Unit prices
  rollPrice: number;
  seamTapeRollPrice: number;
  terminationBarPrice: number;
  fastenersPackPrice: number;
  laborRatePerSqFt: number;
}

export function calculateVaporBarrier(input: VaporBarrierInput) {
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
  // Seam overlap percentage: on 12ft roll with 12in overlap, ratio is 12 / (144 - 12) ~ 9.1%
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
export interface GarageDoorInput {
  doorStandardSize: 'single_8x7' | 'single_9x7' | 'single_10x7' | 'double_16x7' | 'double_18x7' | 'single_8x8' | 'single_9x8' | 'double_16x8' | 'commercial_10x10' | 'commercial_12x12' | 'custom';
  doorWidthFt: number;        // e.g. 16 or 9
  doorHeightFt: number;       // e.g. 7 or 8
  ceilingHeightFt: number;    // e.g. 10.0
  wallFraming: '2x4' | '2x6';
  trackRadiusIn: 12 | 15;
  hasElectricOpener: boolean;
  headerType: 'double_2x10' | 'double_2x12' | 'lvl_double' | 'lvl_triple';
  doorUnitCost: number;
  openerCost: number;
  headerLumberCost: number;
  framingJambsCost: number;
  weatherstripCost: number;
  laborInstallCost: number;
}

export function calculateGarageDoorSize(input: GarageDoorInput) {
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
export interface DoorFrameInput {
  doorType: 'interior_single' | 'interior_double' | 'exterior_single' | 'pocket_door' | 'bifold';
  doorWidthIn: number;        // e.g. 36
  doorHeightIn: number;       // e.g. 80
  doorThicknessIn?: number;   // 1.375 or 1.75
  wallStudSize: '2x4' | '2x6';
  wallHeightFt: number;       // 8, 9, 10
  casingSides: 1 | 2;
  casingWidthIn: number;      // 2.25, 2.5, 3.5
  headerType: 'double_2x4' | 'double_2x6' | 'double_2x8' | 'double_2x10';
  studPrice: number;
  headerBoardPrice: number;
  jambKitPrice: number;
  casingPricePerFt: number;
  hardwareHingesPrice: number;
  shimPackPrice: number;
  laborRatePerHour: number;
  estimatedLaborHours: number;
}

export function calculateDoorFrame(input: DoorFrameInput) {
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
// 15. Concrete Rebar & Wire Mesh Calculator
// ============================================================================
export interface RebarMeshInput {
  slabLengthFt: number;
  slabWidthFt: number;
  reinforcementType: 'rebar_grid' | 'wire_mesh' | 'both';
  rebarSize: '#3' | '#4' | '#5' | '#6';
  gridSpacingIn: number;
  edgeClearanceIn: number;
  lapSpliceIn: number;
  meshType: 'roll_5x150' | 'sheet_8x15';
  wastePct: number;
  rebarStick20ftPrice?: number;
  meshUnitPrice?: number;
  chairPrice?: number;
  tieWireRollPrice?: number;
  laborRatePerHour?: number;
  estimatedLaborHours?: number;
}

export function calculateRebarMesh(input: RebarMeshInput) {
  const lengthFt = Math.max(1, Number(input.slabLengthFt) || 30);
  const widthFt = Math.max(1, Number(input.slabWidthFt) || 24);
  const gridSpacing = Math.max(6, Number(input.gridSpacingIn) || 18);
  const edgeClearance = Math.max(1, Number(input.edgeClearanceIn) || 2);
  const lapSplice = Math.max(6, Number(input.lapSpliceIn) || 16);
  const waste = Math.max(0, Number(input.wastePct) || 10);

  const slabAreaSqFt = lengthFt * widthFt;
  const effLengthIn = Math.max(12, (lengthFt * 12) - (2 * edgeClearance));
  const effWidthIn = Math.max(12, (widthFt * 12) - (2 * edgeClearance));

  const numLongBars = Math.floor(effWidthIn / gridSpacing) + 1;
  const numTransBars = Math.floor(effLengthIn / gridSpacing) + 1;

  const longSplices = Math.floor(lengthFt / 20);
  const transSplices = Math.floor(widthFt / 20);

  const longLinFtPerRun = lengthFt + (longSplices * (lapSplice / 12));
  const transLinFtPerRun = widthFt + (transSplices * (lapSplice / 12));

  const rawRebarLinFt = (numLongBars * longLinFtPerRun) + (numTransBars * transLinFtPerRun);
  const totalRebarLinFt = Math.ceil(rawRebarLinFt * (1 + waste / 100));
  const rebar20ftSticks = Math.ceil(totalRebarLinFt / 20);

  const unitWeights: Record<string, number> = {
    '#3': 0.376,
    '#4': 0.668,
    '#5': 1.043,
    '#6': 1.502,
  };
  const unitWeight = unitWeights[input.rebarSize] || 0.668;
  const totalRebarWeightLbs = Math.round(totalRebarLinFt * unitWeight);

  const chairCount = Math.ceil(slabAreaSqFt / 8);
  const intersections = numLongBars * numTransBars;
  const tieWireRolls = Math.max(1, Math.ceil(intersections / 900));

  let meshUnits = 0;
  if (input.reinforcementType === 'wire_mesh' || input.reinforcementType === 'both') {
    if (input.meshType === 'sheet_8x15') {
      meshUnits = Math.ceil((slabAreaSqFt * 1.15) / 120);
    } else {
      meshUnits = Math.ceil((slabAreaSqFt * 1.12) / 750);
    }
  }

  const rebarPrice = Number(input.rebarStick20ftPrice) || 11.50;
  const meshPrice = Number(input.meshUnitPrice) || (input.meshType === 'sheet_8x15' ? 24.00 : 125.00);
  const chairPrice = Number(input.chairPrice) || 0.65;
  const tiePrice = Number(input.tieWireRollPrice) || 12.00;
  const laborRate = Number(input.laborRatePerHour) || 48.00;
  const laborHours = Number(input.estimatedLaborHours) || Math.max(2, Math.round((slabAreaSqFt / 180) * 10) / 10);

  let rebarCost = 0;
  if (input.reinforcementType !== 'wire_mesh') {
    rebarCost = Math.round(rebar20ftSticks * rebarPrice);
  }
  let meshCost = 0;
  if (input.reinforcementType !== 'rebar_grid') {
    meshCost = Math.round(meshUnits * meshPrice);
  }
  const accessoriesCost = Math.round((chairCount * chairPrice) + (tieWireRolls * tiePrice));
  const materialsSubtotal = rebarCost + meshCost + accessoriesCost;
  const laborCost = Math.round(laborHours * laborRate);
  const totalEstimatedCost = materialsSubtotal + laborCost;

  return {
    valid: true,
    slabAreaSqFt,
    numLongBars,
    numTransBars,
    totalRebarLinFt,
    rebar20ftSticks,
    rebarSize: input.rebarSize,
    totalRebarWeightLbs,
    chairCount,
    intersections,
    tieWireRolls,
    meshUnits,
    meshType: input.meshType,
    reinforcementType: input.reinforcementType,
    rebarCost,
    meshCost,
    accessoriesCost,
    materialsSubtotal,
    laborHours,
    laborCost,
    totalEstimatedCost,
  };
}

// ============================================================================
// 16. Deck & Patio Framing Calculator
// ============================================================================
export interface DeckInput {
  lengthFt: number;
  widthFt: number;
  heightFt: number;
  joistSpacingIn: 12 | 16 | 24;
  beamType: 'double_2x10' | 'double_2x12' | 'triple_2x10';
  deckingType: 'pt_wood_54' | 'composite_trex' | 'cedar_2x6';
  postSpacingFt: number;
  wastePct: number;
  deckingBoardPrice?: number;
  joistPrice?: number;
  beamBoardPrice?: number;
  postPrice?: number;
  concreteBagPrice?: number;
  hardwareLumpSum?: number;
  laborRatePerHour?: number;
  estimatedLaborHours?: number;
}

export function calculateDeck(input: DeckInput) {
  const lengthFt = Math.max(4, Number(input.lengthFt) || 16);
  const widthFt = Math.max(4, Number(input.widthFt) || 12);
  const heightFt = Math.max(1, Number(input.heightFt) || 4);
  const spacingIn = Number(input.joistSpacingIn) || 16;
  const postSpan = Math.max(4, Number(input.postSpacingFt) || 8);
  const waste = Math.max(0, Number(input.wastePct) || 10);

  const deckAreaSqFt = lengthFt * widthFt;
  const ledgerBoards16ft = Math.ceil(lengthFt / 16);
  const joistCount = Math.ceil((lengthFt * 12) / spacingIn) + 2; // includes 2 rim joists
  const joistLengthFt = Math.ceil(widthFt);

  const beamPiles = input.beamType === 'triple_2x10' ? 3 : 2;
  const beamBoards16ft = Math.ceil((lengthFt * beamPiles) / 16);

  const postCount = Math.ceil(lengthFt / postSpan) + 1;
  const concreteBags60lb = postCount * 3; // 3 bags 60lb per 10"x36" footing

  // 5.5" board + 1/8" gap = 5.625"
  const deckingRows = Math.ceil((widthFt * 12) / 5.625);
  const deckingLinFt = Math.ceil(deckingRows * lengthFt * (1 + waste / 100));
  const deckingBoards16ft = Math.ceil(deckingLinFt / 16);

  const joistHangers = joistCount * 2;
  const screwBuckets5lb = Math.max(1, Math.ceil(deckAreaSqFt / 220));

  const deckingPrice = Number(input.deckingBoardPrice) || (input.deckingType === 'composite_trex' ? 44.00 : 16.50);
  const joistPrice = Number(input.joistPrice) || 18.50;
  const beamPrice = Number(input.beamBoardPrice) || 26.00;
  const postPrice = Number(input.postPrice) || (heightFt > 6 ? 48.00 : 32.00);
  const concretePrice = Number(input.concreteBagPrice) || 5.85;
  const hardwareCost = Number(input.hardwareLumpSum) || Math.round(deckAreaSqFt * 1.25);
  const laborRate = Number(input.laborRatePerHour) || 55.00;
  const laborHours = Number(input.estimatedLaborHours) || Math.max(8, Math.round(deckAreaSqFt * 0.16));

  const deckingCost = Math.round(deckingBoards16ft * deckingPrice);
  const framingLumberCost = Math.round((joistCount * joistPrice) + (beamBoards16ft * beamPrice) + (ledgerBoards16ft * beamPrice * 0.8));
  const postsFootingsCost = Math.round((postCount * postPrice) + (concreteBags60lb * concretePrice));

  const materialsSubtotal = deckingCost + framingLumberCost + postsFootingsCost + hardwareCost;
  const laborCost = Math.round(laborHours * laborRate);
  const totalEstimatedCost = materialsSubtotal + laborCost;

  return {
    valid: true,
    deckAreaSqFt,
    ledgerBoards16ft,
    joistCount,
    joistLengthFt,
    beamBoards16ft,
    beamType: input.beamType,
    postCount,
    concreteBags60lb,
    deckingBoards16ft,
    deckingType: input.deckingType,
    deckingLinFt,
    joistHangers,
    screwBuckets5lb,
    deckingCost,
    framingLumberCost,
    postsFootingsCost,
    hardwareCost,
    materialsSubtotal,
    laborHours,
    laborCost,
    totalEstimatedCost,
  };
}

// ============================================================================
// 17. Gravel, Sand & Aggregate Base Calculator
// ============================================================================
export interface GravelInput {
  shape: 'rectangle' | 'circle';
  lengthFt: number;
  widthFt: number;
  diameterFt?: number;
  depthIn: number;
  materialType: 'crushed_stone_57' | 'dense_grade_crusher_run' | 'pea_gravel' | 'washed_sand' | 'river_rock' | 'topsoil';
  compactionFactorPct: number;
  wastePct: number;
  truckCapacityTons: number;
  pricePerTon?: number;
  deliveryFeePerLoad?: number;
  laborRatePerHour?: number;
  spreadingHours?: number;
}

export function calculateGravel(input: GravelInput) {
  const isCircle = input.shape === 'circle';
  const lengthFt = Math.max(1, Number(input.lengthFt) || 40);
  const widthFt = Math.max(1, Number(input.widthFt) || 12);
  const diameterFt = Math.max(1, Number(input.diameterFt) || widthFt);
  const depthIn = Math.max(0.5, Number(input.depthIn) || 4);
  const compactionPct = Math.max(0, Number(input.compactionFactorPct) || 15);
  const wastePct = Math.max(0, Number(input.wastePct) || 5);
  const truckCapacity = Math.max(5, Number(input.truckCapacityTons) || 15);

  const areaSqFt = isCircle ? Math.PI * Math.pow(diameterFt / 2, 2) : lengthFt * widthFt;
  const rawCuFt = areaSqFt * (depthIn / 12);
  const rawCuYd = Math.round((rawCuFt / 27) * 100) / 100;

  const compactionMultiplier = (1 + compactionPct / 100) * (1 + wastePct / 100);
  const totalCompactedCuYd = Math.round(rawCuYd * compactionMultiplier * 100) / 100;

  const densities: Record<string, number> = {
    crushed_stone_57: 1.35,
    dense_grade_crusher_run: 1.55,
    pea_gravel: 1.42,
    washed_sand: 1.35,
    river_rock: 1.40,
    topsoil: 1.10,
  };
  const densityTonsPerYd = densities[input.materialType] || 1.35;
  const totalTons = Math.round(totalCompactedCuYd * densityTonsPerYd * 10) / 10;
  const truckLoads = Math.ceil(totalTons / truckCapacity);

  const pricePerTon = Number(input.pricePerTon) || 38.00;
  const deliveryFee = Number(input.deliveryFeePerLoad) || 95.00;
  const laborRate = Number(input.laborRatePerHour) || 45.00;
  const laborHours = Number(input.spreadingHours) || Math.max(2, Math.round((totalTons / 3.5) * 10) / 10);

  const materialsCost = Math.round(totalTons * pricePerTon);
  const deliveryCost = Math.round(truckLoads * deliveryFee);
  const laborCost = Math.round(laborHours * laborRate);
  const totalEstimatedCost = materialsCost + deliveryCost + laborCost;

  return {
    valid: true,
    areaSqFt: Math.round(areaSqFt),
    rawCuYd,
    totalCompactedCuYd,
    totalTons,
    truckLoads,
    densityTonsPerYd,
    materialType: input.materialType,
    materialsCost,
    deliveryCost,
    laborHours,
    laborCost,
    totalEstimatedCost,
  };
}

// ============================================================================
// 18. Retaining Wall Block & Geogrid Calculator
// ============================================================================
export interface RetainingWallInput {
  lengthFt: number;
  exposedHeightFt: number;
  blockType: 'standard_srw' | 'compact_srw' | 'jumbo_srw';
  buriedBaseIn: number;
  drainageGravelWidthFt: number;
  wastePct: number;
  blockUnitPrice?: number;
  capUnitPrice?: number;
  drainGravelPricePerTon?: number;
  drainPipePricePerFt?: number;
  geogridPricePerRoll?: number;
  laborRatePerHour?: number;
  estimatedLaborHours?: number;
}

export function calculateRetainingWall(input: RetainingWallInput) {
  const lengthFt = Math.max(2, Number(input.lengthFt) || 30);
  const exposedHeightFt = Math.max(1, Number(input.exposedHeightFt) || 3.5);
  const buriedIn = Math.max(4, Number(input.buriedBaseIn) || 6);
  const drainWidthFt = Math.max(0.5, Number(input.drainageGravelWidthFt) || 1.0);
  const waste = Math.max(0, Number(input.wastePct) || 5);

  const totalHeightFt = exposedHeightFt + (buriedIn / 12);
  const wallFaceSqFt = Math.round(lengthFt * totalHeightFt * 10) / 10;

  const blockSpecs = {
    standard_srw: { widthIn: 18, heightIn: 8, faceSqFt: 1.0, weightLbs: 75, price: 6.85 },
    compact_srw: { widthIn: 12, heightIn: 6, faceSqFt: 0.5, weightLbs: 35, price: 3.95 },
    jumbo_srw: { widthIn: 18, heightIn: 6, faceSqFt: 0.75, weightLbs: 60, price: 5.75 },
  };
  const spec = blockSpecs[input.blockType] || blockSpecs.standard_srw;

  const courses = Math.ceil((totalHeightFt * 12) / spec.heightIn);
  const blocksPerCourse = Math.ceil((lengthFt * 12) / spec.widthIn);
  const totalBlocks = Math.ceil(courses * blocksPerCourse * (1 + waste / 100));
  const capBlocks = Math.ceil((lengthFt * 12) / spec.widthIn);

  // Base leveling gravel (6" thick x 24" wide)
  const baseGravelCuYd = (lengthFt * 2.0 * 0.5) / 27;
  const baseGravelTons = Math.round(baseGravelCuYd * 1.45 * 10) / 10;

  // Drainage chimney gravel behind wall
  const drainGravelCuYd = (lengthFt * drainWidthFt * exposedHeightFt) / 27;
  const drainGravelTons = Math.round(drainGravelCuYd * 1.40 * 10) / 10;

  const drainPipeLF = Math.ceil(lengthFt + 10);

  // Geogrid reinforcement if exposed height > 3ft
  let geogridLayers = 0;
  let geogridRolls = 0;
  if (exposedHeightFt > 3.0) {
    geogridLayers = Math.max(1, Math.floor(exposedHeightFt / 1.5));
    const embedLengthFt = Math.max(4.0, exposedHeightFt * 0.8);
    const geogridSqFt = geogridLayers * lengthFt * embedLengthFt;
    geogridRolls = Math.ceil(geogridSqFt / 200); // 4x50ft rolls
  }

  const blockPrice = Number(input.blockUnitPrice) || spec.price;
  const capPrice = Number(input.capUnitPrice) || 4.25;
  const gravelPrice = Number(input.drainGravelPricePerTon) || 38.00;
  const pipePrice = Number(input.drainPipePricePerFt) || 1.85;
  const geogridPrice = Number(input.geogridPricePerRoll) || 68.00;
  const laborRate = Number(input.laborRatePerHour) || 52.00;
  const laborHours = Number(input.estimatedLaborHours) || Math.max(6, Math.round(totalBlocks * 0.25));

  const blocksCost = Math.round(totalBlocks * blockPrice);
  const capsCost = Math.round(capBlocks * capPrice);
  const gravelCost = Math.round((baseGravelTons + drainGravelTons) * gravelPrice);
  const drainPipeCost = Math.round(drainPipeLF * pipePrice);
  const geogridCost = Math.round(geogridRolls * geogridPrice);

  const materialsSubtotal = blocksCost + capsCost + gravelCost + drainPipeCost + geogridCost;
  const laborCost = Math.round(laborHours * laborRate);
  const totalEstimatedCost = materialsSubtotal + laborCost;

  return {
    valid: true,
    totalHeightFt: Math.round(totalHeightFt * 10) / 10,
    wallFaceSqFt,
    courses,
    blocksPerCourse,
    totalBlocks,
    capBlocks,
    baseGravelTons,
    drainGravelTons,
    drainPipeLF,
    geogridLayers,
    geogridRolls,
    blockType: input.blockType,
    blocksCost,
    capsCost,
    gravelCost,
    materialsSubtotal,
    laborHours,
    laborCost,
    totalEstimatedCost,
  };
}

// ============================================================================
// 19. Excavation & Trench Earthwork Calculator
// ============================================================================
export interface ExcavationInput {
  projectType: 'trench' | 'basement' | 'grading';
  lengthFt: number;
  widthFt: number;
  depthFt: number;
  soilType: 'type_a_clay' | 'type_b_silt' | 'type_c_sand' | 'rock';
  truckCapacityCuYd: number;
  machineType: 'mini_excavator' | 'backhoe' | 'excavator_20ton';
  hourlyMachineRate?: number;
  hourlyOperatorRate?: number;
  haulingFeePerTrip?: number;
}

export function calculateExcavation(input: ExcavationInput) {
  const lengthFt = Math.max(1, Number(input.lengthFt) || 80);
  const widthFt = Math.max(1, Number(input.widthFt) || 2.5);
  const depthFt = Math.max(0.5, Number(input.depthFt) || 4);
  const truckCapacity = Math.max(5, Number(input.truckCapacityCuYd) || 12);

  // Bank Layback (OSHA)
  const laybackRatios: Record<string, number> = {
    type_a_clay: 0.75,
    type_b_silt: 1.0,
    type_c_sand: 1.5,
    rock: 0.0,
  };
  const layback = depthFt > 5 && input.projectType !== 'grading' ? (laybackRatios[input.soilType] || 1.0) : 0;
  const topWidthFt = widthFt + (2 * layback * depthFt);
  const avgWidthFt = (widthFt + topWidthFt) / 2;

  const bankCuFt = lengthFt * avgWidthFt * depthFt;
  const bankCuYd = Math.round((bankCuFt / 27) * 10) / 10;

  const swellPcts: Record<string, number> = {
    type_a_clay: 25,
    type_b_silt: 20,
    type_c_sand: 15,
    rock: 50,
  };
  const swellPct = swellPcts[input.soilType] || 20;
  const looseCuYd = Math.round(bankCuYd * (1 + swellPct / 100) * 10) / 10;
  const totalTons = Math.round(bankCuYd * 1.35 * 10) / 10;
  const dumpTruckTrips = Math.ceil(looseCuYd / truckCapacity);

  const productionRates: Record<string, number> = {
    mini_excavator: 16,
    backhoe: 30,
    excavator_20ton: 65,
  };
  const prodRate = productionRates[input.machineType] || 25;
  const machineHours = Math.round((looseCuYd / prodRate) * 10) / 10;

  const machineRate = Number(input.hourlyMachineRate) || (input.machineType === 'excavator_20ton' ? 165.00 : 85.00);
  const operatorRate = Number(input.hourlyOperatorRate) || 55.00;
  const haulFee = Number(input.haulingFeePerTrip) || 85.00;

  const equipmentCost = Math.round(machineHours * machineRate);
  const laborCost = Math.round(machineHours * operatorRate);
  const haulingCost = Math.round(dumpTruckTrips * haulFee);
  const totalEstimatedCost = equipmentCost + laborCost + haulingCost;

  return {
    valid: true,
    topWidthFt: Math.round(topWidthFt * 10) / 10,
    bankCuYd,
    looseCuYd,
    totalTons,
    dumpTruckTrips,
    machineHours,
    soilType: input.soilType,
    machineType: input.machineType,
    equipmentCost,
    laborCost,
    haulingCost,
    totalEstimatedCost,
  };
}

// ============================================================================
// 20. Asphalt Driveway & Paving Cost Calculator
// ============================================================================
export interface AsphaltPavingInput {
  lengthFt: number;
  widthFt: number;
  asphaltThicknessIn: number;
  baseThicknessIn: number;
  projectType: 'driveway_new' | 'driveway_overlay' | 'parking_commercial';
  wastePct: number;
  asphaltPricePerTon?: number;
  aggregateBasePricePerTon?: number;
  tackCoatPricePerGal?: number;
  laborRatePerSqFt?: number;
}

export function calculateAsphaltPaving(input: AsphaltPavingInput) {
  const lengthFt = Math.max(10, Number(input.lengthFt) || 50);
  const widthFt = Math.max(4, Number(input.widthFt) || 12);
  const asphaltThick = Math.max(1.5, Number(input.asphaltThicknessIn) || 2.5);
  const baseThick = Math.max(0, Number(input.baseThicknessIn) || 6);
  const waste = Math.max(0, Number(input.wastePct) || 6);

  const areaSqFt = lengthFt * widthFt;
  const asphaltCuFt = areaSqFt * (asphaltThick / 12);
  // Asphalt density ~145 lbs/cu ft
  const rawAsphaltTons = (asphaltCuFt * 145) / 2000;
  const totalAsphaltTons = Math.round(rawAsphaltTons * (1 + waste / 100) * 10) / 10;

  let baseTons = 0;
  if (baseThick > 0 && input.projectType !== 'driveway_overlay') {
    const baseCuYd = (areaSqFt * (baseThick / 12)) / 27;
    baseTons = Math.round(baseCuYd * 1.50 * (1 + waste / 100) * 10) / 10;
  }

  const tackCoatGallons = Math.round(areaSqFt * 0.05 * 10) / 10;

  const asphaltPrice = Number(input.asphaltPricePerTon) || 98.00;
  const basePrice = Number(input.aggregateBasePricePerTon) || 32.00;
  const tackPrice = Number(input.tackCoatPricePerGal) || 16.00;
  const laborRateSqFt = Number(input.laborRatePerSqFt) || 2.25;

  const asphaltCost = Math.round(totalAsphaltTons * asphaltPrice);
  const baseCost = Math.round(baseTons * basePrice);
  const tackCost = Math.round(tackCoatGallons * tackPrice);

  const materialsSubtotal = asphaltCost + baseCost + tackCost;
  const laborCost = Math.round(areaSqFt * laborRateSqFt);
  const totalEstimatedCost = materialsSubtotal + laborCost;

  return {
    valid: true,
    areaSqFt,
    asphaltThicknessIn: asphaltThick,
    totalAsphaltTons,
    baseTons,
    tackCoatGallons,
    projectType: input.projectType,
    asphaltCost,
    baseCost,
    materialsSubtotal,
    laborCost,
    totalEstimatedCost,
    costPerSqFt: Math.round((totalEstimatedCost / areaSqFt) * 100) / 100,
  };
}

// ============================================================================
// 21. Siding & House Wrap Material Calculator
// ============================================================================
export interface SidingInput {
  grossWallAreaSqFt: number;
  windowCount: number;
  windowAvgSqFt: number;
  doorCount: number;
  doorAvgSqFt: number;
  sidingType: 'vinyl_double_4' | 'fiber_cement_hardie' | 'wood_cedar_lap' | 'board_batten';
  outsideCornerFt: number;
  insideCornerFt: number;
  perimeterTrimFt: number;
  wastePct: number;
  sidingSquarePrice?: number;
  houseWrapRollPrice?: number;
  starterPricePer10ft?: number;
  jChannelPricePer12ft?: number;
  cornerPostPrice?: number;
  sidingNailBoxPrice?: number;
  laborRatePerHour?: number;
  estimatedLaborHours?: number;
}

export function calculateSiding(input: SidingInput) {
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

  // Material packaging
  let cartonOrBoardCount = 0;
  let unitLabel = 'Cartons (2 Squares each)';
  if (sidingType === 'vinyl_double_4') {
    cartonOrBoardCount = Math.ceil(sidingSquares / 2); // 2 squares per carton
    unitLabel = 'Cartons (2 Squares each)';
  } else if (sidingType === 'fiber_cement_hardie') {
    cartonOrBoardCount = Math.ceil((netWallAreaSqFt * (1 + waste / 100)) / 7.0); // 12ft x 8.25" board @ 7" exposure
    unitLabel = '12-ft Planks (7 sq ft exposure)';
  } else if (sidingType === 'wood_cedar_lap') {
    cartonOrBoardCount = Math.ceil((netWallAreaSqFt * (1 + waste / 100)) / 4.5);
    unitLabel = '12-ft Bevel Planks (4.5 sq ft exposure)';
  } else {
    cartonOrBoardCount = Math.ceil((netWallAreaSqFt * (1 + waste / 100)) / 10.0);
    unitLabel = '12″ Boards + 2.5″ Battens';
  }

  const houseWrapRolls = Math.ceil((grossArea * 1.15) / 900); // 9x100ft roll with 15% overlap
  const seamTapeRolls = Math.max(1, Math.ceil(grossArea / 600));
  const perimeterTrim = Number(input.perimeterTrimFt) || 140;
  const starterPcs10ft = Math.ceil(perimeterTrim / 10);
  const jChannelPcs12ft = Math.ceil(((winCount * 18) + (doorCount * 17) + (perimeterTrim * 0.4)) / 12);
  const outsideCorners = Math.ceil((Number(input.outsideCornerFt) || 40) / 10);
  const insideCorners = Math.ceil((Number(input.insideCornerFt) || 20) / 10);
  const nailBoxes = Math.max(1, Math.ceil(sidingSquares / 2.5));

  const defaultPrices = {
    vinyl_double_4: 135.0,
    fiber_cement_hardie: 245.0,
    wood_cedar_lap: 285.0,
    board_batten: 195.0,
  };
  const squarePrice = Number(input.sidingSquarePrice) || defaultPrices[sidingType] || 135.0;
  const wrapPrice = Number(input.houseWrapRollPrice) || 110.0;
  const starterPrice = Number(input.starterPricePer10ft) || 7.5;
  const jChannelPrice = Number(input.jChannelPricePer12ft) || 9.2;
  const cornerPrice = Number(input.cornerPostPrice) || 19.5;
  const nailBoxPrice = Number(input.sidingNailBoxPrice) || 26.0;
  const laborRate = Number(input.laborRatePerHour) || 52.0;
  const laborHours = Number(input.estimatedLaborHours) || Math.max(12, Math.round(sidingSquares * 2.4));

  const sidingCost = Math.round(sidingSquares * squarePrice);
  const wrapCost = Math.round((houseWrapRolls * wrapPrice) + (seamTapeRolls * 14.5));
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

export const calculateSidingMaterial = calculateSiding;
export type SidingMaterialInput = SidingInput;
export type SidingMaterialResult = ReturnType<typeof calculateSiding>;

// ============================================================================
// 22. Soffit, Fascia & Seamless Gutter Calculator
// ============================================================================
export interface SoffitGutterInput {
  eaveLengthFt: number;
  rakeLengthFt: number;
  overhangDepthIn: number;
  fasciaWidthIn: 6 | 8;
  gutterSizeIn: 5 | 6;
  buildingStories: 1 | 2;
  downspoutCount?: number;
  gutterGuard: boolean;
  wastePct: number;
  gutterPricePerFt?: number;
  downspoutKitPrice?: number;
  fasciaCoverPricePer12ft?: number;
  soffitPanelPricePer12ft?: number;
  gutterGuardPricePerFt?: number;
  laborRatePerHour?: number;
  estimatedLaborHours?: number;
}

export function calculateSoffitGutter(input: SoffitGutterInput) {
  const eaveFt = Math.max(10, Number(input.eaveLengthFt) || 80);
  const rakeFt = Math.max(0, Number(input.rakeLengthFt) || 40);
  const depthIn = Math.max(6, Number(input.overhangDepthIn) || 16);
  const stories = Number(input.buildingStories) || 1;
  const waste = Math.max(0, Number(input.wastePct) || 8);

  const totalPerimeterFt = eaveFt + rakeFt;
  const soffitAreaSqFt = Math.round(totalPerimeterFt * (depthIn / 12) * (1 + waste / 100));
  const soffitPanels12ft = Math.ceil(soffitAreaSqFt / 12); // 12" x 12' vented panel = 12 sq ft
  const fasciaCoverPcs12ft = Math.ceil((totalPerimeterFt * (1 + waste / 100)) / 12);

  const gutterLengthFt = Math.ceil(eaveFt * (1 + waste / 100));
  const gutterHangers = Math.ceil(gutterLengthFt / 2) + 2; // every 24"
  const downspoutCount = Number(input.downspoutCount) || Math.max(2, Math.ceil(eaveFt / 30));
  const downspoutLengthFt = downspoutCount * (stories === 2 ? 21 : 11);

  const gutterPrice = Number(input.gutterPricePerFt) || (input.gutterSizeIn === 6 ? 6.50 : 4.80);
  const downspoutPrice = Number(input.downspoutKitPrice) || (stories === 2 ? 42.00 : 26.00);
  const fasciaPrice = Number(input.fasciaCoverPricePer12ft) || (input.fasciaWidthIn === 8 ? 22.00 : 17.50);
  const soffitPrice = Number(input.soffitPanelPricePer12ft) || 19.50;
  const guardPrice = Number(input.gutterGuardPricePerFt) || 2.85;
  const laborRate = Number(input.laborRatePerHour) || 50.00;
  const laborHours = Number(input.estimatedLaborHours) || Math.max(6, Math.round(totalPerimeterFt * 0.12));

  const gutterCost = Math.round(gutterLengthFt * gutterPrice);
  const downspoutCost = Math.round(downspoutCount * downspoutPrice);
  const fasciaCost = Math.round(fasciaCoverPcs12ft * fasciaPrice);
  const soffitCost = Math.round(soffitPanels12ft * soffitPrice);
  const guardCost = input.gutterGuard ? Math.round(gutterLengthFt * guardPrice) : 0;

  const materialsSubtotal = gutterCost + downspoutCost + fasciaCost + soffitCost + guardCost;
  const laborCost = Math.round(laborHours * laborRate);
  const totalEstimatedCost = materialsSubtotal + laborCost;

  return {
    valid: true,
    soffitAreaSqFt,
    soffitPanels12ft,
    fasciaCoverPcs12ft,
    gutterLengthFt,
    gutterHangers,
    downspoutCount,
    downspoutLengthFt,
    gutterSizeIn: input.gutterSizeIn,
    gutterCost,
    downspoutCost,
    fasciaCost,
    soffitCost,
    guardCost,
    materialsSubtotal,
    laborHours,
    laborCost,
    totalEstimatedCost,
  };
}

// ============================================================================
// 23. Fence Material & Post Spacing Calculator
// ============================================================================
export interface FenceInput {
  totalLengthFt: number;
  fenceHeightFt: 4 | 6 | 8;
  postSpacingFt: 6 | 8;
  railCount: 2 | 3 | 4;
  picketWidthIn: number;
  picketSpacingIn: number;
  cornerPostCount: number;
  gateCount: number;
  wastePct: number;
  postPrice?: number;
  railPrice?: number;
  picketPrice?: number;
  concreteBagPrice?: number;
  gateKitPrice?: number;
  laborRatePerHour?: number;
  estimatedLaborHours?: number;
}

export function calculateFence(input: FenceInput) {
  const lengthFt = Math.max(10, Number(input.totalLengthFt) || 150);
  const heightFt = Number(input.fenceHeightFt) || 6;
  const spacingFt = Number(input.postSpacingFt) || 8;
  const railLines = Number(input.railCount) || (heightFt >= 8 ? 4 : heightFt >= 6 ? 3 : 2);
  const picketWidth = Number(input.picketWidthIn) || 5.5;
  const picketGap = Number(input.picketSpacingIn) || 0;
  const corners = Math.max(0, Number(input.cornerPostCount) || 4);
  const gates = Math.max(0, Number(input.gateCount) || 1);
  const waste = Math.max(0, Number(input.wastePct) || 8);

  const sections = Math.ceil(lengthFt / spacingFt);
  const totalPosts = Math.max(2, sections + 1 + (gates * 2));
  const concreteBags50lb = Math.ceil(totalPosts * (heightFt >= 6 ? 2 : 1.5));

  const totalRails = Math.ceil(sections * railLines * (1 + waste / 100));
  const picketsTotal = Math.ceil(((lengthFt * 12) / (picketWidth + picketGap)) * (1 + waste / 100));
  const screwBoxes5lb = Math.max(1, Math.ceil((picketsTotal * railLines * 2) / 750));

  const postPrice = Number(input.postPrice) || (heightFt >= 8 ? 24.00 : 14.50);
  const railPrice = Number(input.railPrice) || 8.25;
  const picketPrice = Number(input.picketPrice) || (heightFt >= 8 ? 3.95 : 2.45);
  const concretePrice = Number(input.concreteBagPrice) || 5.25;
  const gateKitPrice = Number(input.gateKitPrice) || 65.00;
  const laborRate = Number(input.laborRatePerHour) || 45.00;
  const laborHours = Number(input.estimatedLaborHours) || Math.max(8, Math.round(lengthFt * 0.18));

  const postsCost = Math.round(totalPosts * postPrice);
  const concreteCost = Math.round(concreteBags50lb * concretePrice);
  const railsCost = Math.round(totalRails * railPrice);
  const picketsCost = Math.round(picketsTotal * picketPrice);
  const hardwareCost = Math.round((gates * gateKitPrice) + (screwBoxes5lb * 32));

  const materialsSubtotal = postsCost + concreteCost + railsCost + picketsCost + hardwareCost;
  const laborCost = Math.round(laborHours * laborRate);
  const totalEstimatedCost = materialsSubtotal + laborCost;

  return {
    valid: true,
    totalLengthFt: lengthFt,
    fenceHeightFt: heightFt,
    totalPosts,
    concreteBags50lb,
    totalRails,
    picketsTotal,
    screwBoxes5lb,
    gateCount: gates,
    postsCost,
    concreteCost,
    railsCost,
    picketsCost,
    hardwareCost,
    materialsSubtotal,
    laborHours,
    laborCost,
    totalEstimatedCost,
    costPerLinFt: Math.round((totalEstimatedCost / lengthFt) * 100) / 100,
  };
}

// ============================================================================
// 24. Insulation R-Value & Batt/Blow Calculator
// ============================================================================
export interface InsulationInput {
  applicationArea: 'attic_ceiling' | 'wall_2x4' | 'wall_2x6' | 'crawlspace_rim';
  surfaceAreaSqFt: number;
  insulationType: 'fiberglass_batts' | 'mineral_wool' | 'blown_cellulose' | 'blown_fiberglass' | 'rigid_xps';
  targetRValue: 13 | 15 | 19 | 21 | 30 | 38 | 49 | 60;
  studSpacingIn: 16 | 24;
  wastePct: number;
  battBundlePrice?: number;
  blownBagPrice?: number;
  rigidSheetPrice?: number;
  blowerMachineRentalPrice?: number;
  laborRatePerHour?: number;
  estimatedLaborHours?: number;
}

export function calculateInsulation(input: InsulationInput) {
  const areaSqFt = Math.max(50, Number(input.surfaceAreaSqFt) || 1200);
  const rVal = Number(input.targetRValue) || 38;
  const waste = Math.max(0, Number(input.wastePct) || 5);

  const isAttic = input.applicationArea === 'attic_ceiling';
  const framingDeduction = isAttic ? 0.93 : 0.85;
  const netAreaSqFt = Math.round(areaSqFt * framingDeduction);

  // Batt Bundle Coverage
  const battCoverageByR: Record<number, number> = {
    13: 88,
    15: 70,
    19: 60,
    21: 52,
    30: 48,
    38: 38,
    49: 30,
    60: 24,
  };
  const bundleCoverage = battCoverageByR[rVal] || 40;
  const battBundles = Math.ceil((netAreaSqFt * (1 + waste / 100)) / bundleCoverage);

  // Blown Cellulose (R-3.7/in) vs Blown Fiberglass (R-2.5/in)
  const isCellulose = input.insulationType === 'blown_cellulose';
  const rPerInch = isCellulose ? 3.7 : 2.6;
  const thicknessInches = Math.round((rVal / rPerInch) * 10) / 10;
  // Coverage: standard 25lb cellulose bag covers ~35 sq ft at R-38
  const blownBags = Math.ceil((netAreaSqFt * (rVal / 38) * (1 + waste / 100)) / 35);

  // Rigid XPS 4x8 sheet = 32 sqft (R-5/in)
  const rigidSheets4x8 = Math.ceil((areaSqFt * (1 + waste / 100)) / 32);

  const bundlePrice = Number(input.battBundlePrice) || (input.insulationType === 'mineral_wool' ? 68.00 : 42.00);
  const bagPrice = Number(input.blownBagPrice) || 16.50;
  const rigidPrice = Number(input.rigidSheetPrice) || 34.00;
  const rentalPrice = Number(input.blowerMachineRentalPrice) || (input.insulationType.startsWith('blown') ? 75.00 : 0);
  const laborRate = Number(input.laborRatePerHour) || 45.00;
  const laborHours = Number(input.estimatedLaborHours) || Math.max(4, Math.round(areaSqFt * 0.008 * 10) / 10);

  let materialCost = 0;
  if (input.insulationType === 'fiberglass_batts' || input.insulationType === 'mineral_wool') {
    materialCost = Math.round(battBundles * bundlePrice);
  } else if (input.insulationType === 'rigid_xps') {
    materialCost = Math.round(rigidSheets4x8 * rigidPrice);
  } else {
    materialCost = Math.round((blownBags * bagPrice) + rentalPrice);
  }

  const laborCost = Math.round(laborHours * laborRate);
  const totalEstimatedCost = materialCost + laborCost;

  return {
    valid: true,
    applicationArea: input.applicationArea,
    insulationType: input.insulationType,
    targetRValue: rVal,
    netAreaSqFt,
    thicknessInches,
    battBundles,
    blownBags,
    rigidSheets4x8,
    materialCost,
    laborHours,
    laborCost,
    totalEstimatedCost,
    costPerSqFt: Math.round((totalEstimatedCost / areaSqFt) * 100) / 100,
  };
}

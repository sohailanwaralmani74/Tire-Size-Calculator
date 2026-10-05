/**
 * @file Pure mathematical calculation and validation module for Wanjaaro Tire & Wheel Calculator.
 * Runs locally in JavaScript with zero DOM access and zero external dependencies.
 */

export const MM_PER_INCH = 25.4;
export const MM_PER_MILE = 1609344;
export const MM_PER_KM = 1000000;

/**
 * Standard Passenger & Light Truck Load Index Table (60 to 130)
 * Verified values in kg and lbs at rated inflation pressure.
 * @type {Record<number, { kg: number, lbs: number }>}
 */
export const LOAD_INDEX_TABLE = {
  60: { kg: 250, lbs: 551 },
  61: { kg: 257, lbs: 567 },
  62: { kg: 265, lbs: 584 },
  63: { kg: 272, lbs: 600 },
  64: { kg: 280, lbs: 617 },
  65: { kg: 290, lbs: 639 },
  66: { kg: 300, lbs: 661 },
  67: { kg: 307, lbs: 677 },
  68: { kg: 315, lbs: 694 },
  69: { kg: 325, lbs: 716 },
  70: { kg: 335, lbs: 739 },
  71: { kg: 345, lbs: 761 },
  72: { kg: 355, lbs: 783 },
  73: { kg: 365, lbs: 805 },
  74: { kg: 375, lbs: 827 },
  75: { kg: 387, lbs: 853 },
  76: { kg: 400, lbs: 882 },
  77: { kg: 412, lbs: 908 },
  78: { kg: 425, lbs: 937 },
  79: { kg: 437, lbs: 963 },
  80: { kg: 450, lbs: 992 },
  81: { kg: 462, lbs: 1019 },
  82: { kg: 475, lbs: 1047 },
  83: { kg: 487, lbs: 1074 },
  84: { kg: 500, lbs: 1102 },
  85: { kg: 515, lbs: 1135 },
  86: { kg: 530, lbs: 1168 },
  87: { kg: 545, lbs: 1201 },
  88: { kg: 560, lbs: 1235 },
  89: { kg: 580, lbs: 1279 },
  90: { kg: 600, lbs: 1323 },
  91: { kg: 615, lbs: 1356 },
  92: { kg: 630, lbs: 1389 },
  93: { kg: 650, lbs: 1433 },
  94: { kg: 670, lbs: 1477 },
  95: { kg: 690, lbs: 1521 },
  96: { kg: 710, lbs: 1565 },
  97: { kg: 730, lbs: 1609 },
  98: { kg: 750, lbs: 1653 },
  99: { kg: 775, lbs: 1709 },
  100: { kg: 800, lbs: 1764 },
  101: { kg: 825, lbs: 1819 },
  102: { kg: 850, lbs: 1874 },
  103: { kg: 875, lbs: 1929 },
  104: { kg: 900, lbs: 1984 },
  105: { kg: 925, lbs: 2039 },
  106: { kg: 950, lbs: 2094 },
  107: { kg: 975, lbs: 2149 },
  108: { kg: 1000, lbs: 2205 },
  109: { kg: 1030, lbs: 2271 },
  110: { kg: 1060, lbs: 2337 },
  111: { kg: 1090, lbs: 2403 },
  112: { kg: 1120, lbs: 2469 },
  113: { kg: 1150, lbs: 2535 },
  114: { kg: 1180, lbs: 2601 },
  115: { kg: 1215, lbs: 2679 },
  116: { kg: 1250, lbs: 2756 },
  117: { kg: 1285, lbs: 2833 },
  118: { kg: 1320, lbs: 2910 },
  119: { kg: 1360, lbs: 2998 },
  120: { kg: 1400, lbs: 3086 },
  121: { kg: 1450, lbs: 3197 },
  122: { kg: 1500, lbs: 3307 },
  123: { kg: 1550, lbs: 3417 },
  124: { kg: 1600, lbs: 3527 },
  125: { kg: 1650, lbs: 3638 },
  126: { kg: 1700, lbs: 3748 },
  127: { kg: 1750, lbs: 3858 },
  128: { kg: 1800, lbs: 3968 },
  129: { kg: 1850, lbs: 4079 },
  130: { kg: 1900, lbs: 4189 },
};

/**
 * Verified Speed Symbol Rating Table
 * @type {Record<string, { mph: number, kmh: number, note?: string }>}
 */
export const SPEED_RATING_TABLE = {
  L: { mph: 75, kmh: 120 },
  M: { mph: 81, kmh: 130 },
  N: { mph: 87, kmh: 140 },
  P: { mph: 93, kmh: 150 },
  Q: { mph: 99, kmh: 160 },
  R: { mph: 106, kmh: 170 },
  S: { mph: 112, kmh: 180 },
  T: { mph: 118, kmh: 190 },
  U: { mph: 124, kmh: 200 },
  H: { mph: 130, kmh: 210 },
  V: { mph: 149, kmh: 240 },
  W: { mph: 168, kmh: 270 },
  Y: { mph: 186, kmh: 300 },
};

/**
 * Converts millimeters to inches.
 * @param {number} mm
 * @returns {number}
 */
export function mmToInches(mm) {
  return mm / MM_PER_INCH;
}

/**
 * Converts inches to millimeters.
 * @param {number} inches
 * @returns {number}
 */
export function inchesToMm(inches) {
  return inches * MM_PER_INCH;
}

/**
 * Rounds a number to a specified number of decimal places.
 * @param {number} value
 * @param {number} [decimals=2]
 * @returns {number}
 */
export function roundTo(value, decimals = 2) {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Validates numeric tire size parameters.
 * @param {object} input
 * @param {number|string} input.widthMm
 * @param {number|string} input.aspectRatio
 * @param {number|string} input.rimDiameterIn
 * @returns {{ valid: true, data: { widthMm: number, aspectRatio: number, rimDiameterIn: number } } | { valid: false, error: { code: string, field: string, message: string } }}
 */
export function validateTireInput(input) {
  if (!input || typeof input !== 'object') {
    return {
      valid: false,
      error: { code: 'MISSING_INPUT', field: 'all', message: 'Tire dimensions are required.' },
    };
  }

  const rawW = input.widthMm;
  const rawA = input.aspectRatio;
  const rawR = input.rimDiameterIn;

  if (rawW === undefined || rawW === null || String(rawW).trim() === '') {
    return {
      valid: false,
      error: { code: 'MISSING_WIDTH', field: 'widthMm', message: 'Section width (mm) is required.' },
    };
  }
  if (rawA === undefined || rawA === null || String(rawA).trim() === '') {
    return {
      valid: false,
      error: { code: 'MISSING_ASPECT', field: 'aspectRatio', message: 'Aspect ratio (%) is required.' },
    };
  }
  if (rawR === undefined || rawR === null || String(rawR).trim() === '') {
    return {
      valid: false,
      error: { code: 'MISSING_RIM', field: 'rimDiameterIn', message: 'Rim diameter (in) is required.' },
    };
  }

  const widthMm = Number(rawW);
  const aspectRatio = Number(rawA);
  const rimDiameterIn = Number(rawR);

  if (!Number.isFinite(widthMm)) {
    return {
      valid: false,
      error: { code: 'NON_NUMERIC_WIDTH', field: 'widthMm', message: 'Section width must be a valid number.' },
    };
  }
  if (!Number.isFinite(aspectRatio)) {
    return {
      valid: false,
      error: { code: 'NON_NUMERIC_ASPECT', field: 'aspectRatio', message: 'Aspect ratio must be a valid number.' },
    };
  }
  if (!Number.isFinite(rimDiameterIn)) {
    return {
      valid: false,
      error: { code: 'NON_NUMERIC_RIM', field: 'rimDiameterIn', message: 'Rim diameter must be a valid number.' },
    };
  }

  // Plausible automotive metric tire bounds
  if (widthMm < 100 || widthMm > 500) {
    return {
      valid: false,
      error: {
        code: 'OUT_OF_RANGE_WIDTH',
        field: 'widthMm',
        message: 'Section width must be between 100 mm and 500 mm.',
      },
    };
  }
  if (aspectRatio < 15 || aspectRatio > 100) {
    return {
      valid: false,
      error: {
        code: 'OUT_OF_RANGE_ASPECT',
        field: 'aspectRatio',
        message: 'Aspect ratio must be between 15% and 100%.',
      },
    };
  }
  if (rimDiameterIn < 8 || rimDiameterIn > 32) {
    return {
      valid: false,
      error: {
        code: 'OUT_OF_RANGE_RIM',
        field: 'rimDiameterIn',
        message: 'Rim diameter must be between 8 in and 32 in.',
      },
    };
  }

  return {
    valid: true,
    data: { widthMm, aspectRatio, rimDiameterIn },
  };
}

/**
 * Parses a tire code string like "265/70R17" or "225/45 R 17" into numeric fields.
 * Rejects extra prefixes/suffixes in basic size calculator mode with a clear error message,
 * or extracts core dimensions when strict=false.
 * @param {string} code
 * @param {boolean} [strict=true]
 */
export function parseTireSizeString(code, strict = true) {
  if (typeof code !== 'string' || !code.trim()) {
    return {
      valid: false,
      error: {
        code: 'MISSING_INPUT',
        field: 'code',
        message: 'Enter a tire size such as 265/70R17.',
      },
    };
  }

  const trimmed = code.trim();
  const pattern = strict
    ? /^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\s*[rR]?\s*(\d+(?:\.\d+)?)$/
    : /(?:^|\s|[A-Za-z])(\d{3}(?:\.\d+)?)\s*\/\s*(\d{2,3}(?:\.\d+)?)\s*[rR]\s*(\d{1,2}(?:\.\d+)?)/;

  const match = trimmed.match(pattern);
  if (!match) {
    return {
      valid: false,
      error: {
        code: 'INVALID_FORMAT',
        field: 'code',
        message: 'Use standard metric format: Width/AspectRWheel (for example, 265/70R17).',
      },
    };
  }

  return validateTireInput({
    widthMm: Number(match[1]),
    aspectRatio: Number(match[2]),
    rimDiameterIn: Number(match[3]),
  });
}

/**
 * Calculates full tire geometry from width (mm), aspect ratio (%), and rim diameter (in).
 * Formulas:
 * - sidewall_mm = width * aspect / 100
 * - diameter_mm = rim_in * 25.4 + 2 * sidewall_mm
 * - circumference_mm = pi * diameter_mm
 * - revs_per_mile = 1,609,344 / circumference_mm
 * - revs_per_km = 1,000,000 / circumference_mm
 *
 * @param {{ widthMm: number|string, aspectRatio: number|string, rimDiameterIn: number|string }} input
 */
export function calculateTireMetrics(input) {
  const validation = validateTireInput(input);
  if (!validation.valid) {
    return validation;
  }

  const { widthMm, aspectRatio, rimDiameterIn } = validation.data;

  const sidewallMm = (widthMm * aspectRatio) / 100;
  const rimMm = rimDiameterIn * MM_PER_INCH;
  const diameterMm = rimMm + 2 * sidewallMm;
  const circumferenceMm = Math.PI * diameterMm;
  const revsPerMile = MM_PER_MILE / circumferenceMm;
  const revsPerKm = MM_PER_KM / circumferenceMm;

  const widthIn = mmToInches(widthMm);
  const sidewallIn = mmToInches(sidewallMm);
  const diameterIn = mmToInches(diameterMm);
  const circumferenceIn = mmToInches(circumferenceMm);

  return {
    valid: true,
    data: {
      label: `${widthMm}/${aspectRatio}R${rimDiameterIn}`,
      widthMm,
      widthIn: roundTo(widthIn, 2),
      aspectRatio,
      rimDiameterIn,
      rimMm: roundTo(rimMm, 2),
      sidewallMm: roundTo(sidewallMm, 2),
      sidewallIn: roundTo(sidewallIn, 2),
      diameterMm: roundTo(diameterMm, 2),
      diameterIn: roundTo(diameterIn, 2),
      circumferenceMm: roundTo(circumferenceMm, 2),
      circumferenceIn: roundTo(circumferenceIn, 2),
      revsPerMile: roundTo(revsPerMile, 2),
      revsPerKm: roundTo(revsPerKm, 2),
      // Raw unrounded floats for chained calculations
      raw: {
        widthMm,
        aspectRatio,
        rimDiameterIn,
        rimMm,
        sidewallMm,
        diameterMm,
        circumferenceMm,
        revsPerMile,
        revsPerKm,
      },
    },
  };
}

/**
 * Compares two tires (old/baseline vs new/candidate) and returns exact differences.
 * @param {{ widthMm: number|string, aspectRatio: number|string, rimDiameterIn: number|string }} oldInput
 * @param {{ widthMm: number|string, aspectRatio: number|string, rimDiameterIn: number|string }} newInput
 */
export function compareTires(oldInput, newInput) {
  const oldRes = calculateTireMetrics(oldInput);
  if (!oldRes.valid) {
    return {
      valid: false,
      error: {
        ...oldRes.error,
        field: `old.${oldRes.error.field}`,
        message: `Baseline tire: ${oldRes.error.message}`,
      },
    };
  }

  const newRes = calculateTireMetrics(newInput);
  if (!newRes.valid) {
    return {
      valid: false,
      error: {
        ...newRes.error,
        field: `new.${newRes.error.field}`,
        message: `Comparison tire: ${newRes.error.message}`,
      },
    };
  }

  const o = oldRes.data.raw;
  const n = newRes.data.raw;

  const widthDiffMm = n.widthMm - o.widthMm;
  const widthDiffPct = ((n.widthMm - o.widthMm) / o.widthMm) * 100;

  const sidewallDiffMm = n.sidewallMm - o.sidewallMm;
  const sidewallDiffPct = ((n.sidewallMm - o.sidewallMm) / o.sidewallMm) * 100;

  const diameterDiffMm = n.diameterMm - o.diameterMm;
  const diameterDiffPct = ((n.diameterMm - o.diameterMm) / o.diameterMm) * 100;

  const circumferenceDiffMm = n.circumferenceMm - o.circumferenceMm;
  const circumferenceDiffPct = ((n.circumferenceMm - o.circumferenceMm) / o.circumferenceMm) * 100;

  const axleClearanceChangeMm = diameterDiffMm / 2;
  const revsPerMileDiff = n.revsPerMile - o.revsPerMile;
  const revsPerKmDiff = n.revsPerKm - o.revsPerKm;
  const speedRatio = n.diameterMm / o.diameterMm;

  return {
    valid: true,
    data: {
      oldTire: oldRes.data,
      newTire: newRes.data,
      diff: {
        widthMm: roundTo(widthDiffMm, 2),
        widthIn: roundTo(mmToInches(widthDiffMm), 2),
        widthPct: roundTo(widthDiffPct, 2),

        sidewallMm: roundTo(sidewallDiffMm, 2),
        sidewallIn: roundTo(mmToInches(sidewallDiffMm), 2),
        sidewallPct: roundTo(sidewallDiffPct, 2),

        diameterMm: roundTo(diameterDiffMm, 2),
        diameterIn: roundTo(mmToInches(diameterDiffMm), 2),
        diameterPct: roundTo(diameterDiffPct, 2),

        circumferenceMm: roundTo(circumferenceDiffMm, 2),
        circumferenceIn: roundTo(mmToInches(circumferenceDiffMm), 2),
        circumferencePct: roundTo(circumferenceDiffPct, 2),

        axleClearanceMm: roundTo(axleClearanceChangeMm, 2),
        axleClearanceIn: roundTo(mmToInches(axleClearanceChangeMm), 2),

        revsPerMile: roundTo(revsPerMileDiff, 2),
        revsPerKm: roundTo(revsPerKmDiff, 2),
        speedRatio: roundTo(speedRatio, 5),
      },
    },
  };
}

/**
 * Validates wheel input parameters.
 * @param {{ rimDiameterIn: number|string, rimWidthIn: number|string, offsetMm: number|string }} input
 */
export function validateWheelInput(input) {
  if (!input || typeof input !== 'object') {
    return {
      valid: false,
      error: { code: 'MISSING_WHEEL_INPUT', field: 'all', message: 'Wheel dimensions are required.' },
    };
  }

  const rawD = input.rimDiameterIn;
  const rawW = input.rimWidthIn;
  const rawET = input.offsetMm;

  if (rawD === undefined || rawD === null || String(rawD).trim() === '') {
    return {
      valid: false,
      error: { code: 'MISSING_WHEEL_DIAMETER', field: 'rimDiameterIn', message: 'Wheel diameter (in) is required.' },
    };
  }
  if (rawW === undefined || rawW === null || String(rawW).trim() === '') {
    return {
      valid: false,
      error: { code: 'MISSING_WHEEL_WIDTH', field: 'rimWidthIn', message: 'Wheel width (in) is required.' },
    };
  }
  if (rawET === undefined || rawET === null || String(rawET).trim() === '') {
    return {
      valid: false,
      error: { code: 'MISSING_OFFSET', field: 'offsetMm', message: 'Wheel offset ET (mm) is required.' },
    };
  }

  const rimDiameterIn = Number(rawD);
  const rimWidthIn = Number(rawW);
  const offsetMm = Number(rawET);

  if (!Number.isFinite(rimDiameterIn)) {
    return {
      valid: false,
      error: { code: 'NON_NUMERIC_WHEEL_DIAMETER', field: 'rimDiameterIn', message: 'Wheel diameter must be a valid number.' },
    };
  }
  if (!Number.isFinite(rimWidthIn)) {
    return {
      valid: false,
      error: { code: 'NON_NUMERIC_WHEEL_WIDTH', field: 'rimWidthIn', message: 'Wheel width must be a valid number.' },
    };
  }
  if (!Number.isFinite(offsetMm)) {
    return {
      valid: false,
      error: { code: 'NON_NUMERIC_OFFSET', field: 'offsetMm', message: 'Wheel offset must be a valid number.' },
    };
  }

  if (rimDiameterIn < 8 || rimDiameterIn > 32) {
    return {
      valid: false,
      error: { code: 'OUT_OF_RANGE_WHEEL_DIAMETER', field: 'rimDiameterIn', message: 'Wheel diameter must be between 8 in and 32 in.' },
    };
  }
  if (rimWidthIn < 3 || rimWidthIn > 18) {
    return {
      valid: false,
      error: { code: 'OUT_OF_RANGE_WHEEL_WIDTH', field: 'rimWidthIn', message: 'Wheel width must be between 3 in and 18 in.' },
    };
  }
  if (offsetMm < -150 || offsetMm > 150) {
    return {
      valid: false,
      error: { code: 'OUT_OF_RANGE_OFFSET', field: 'offsetMm', message: 'Wheel offset (ET) must be between -150 mm and +150 mm.' },
    };
  }

  return {
    valid: true,
    data: { rimDiameterIn, rimWidthIn, offsetMm },
  };
}

/**
 * Calculates wheel offset geometry.
 * Formulas mandated by specification:
 * - For wheel width W (mm) and offset ET (mm), the hub face sits ET from the wheel centerline.
 * - Inner edge distance from hub = W/2 + ET (inboard)
 * - Outer edge distance from hub = W/2 - ET (outboard)
 * - Note: Backspacing in traditional automotive measurement includes ~0.5 in (12.7 mm) flange thickness,
 *   while Bead-seat (geometric) backspacing is W/2 + ET. Both are explicitly returned and labelled.
 *
 * @param {{ rimDiameterIn: number|string, rimWidthIn: number|string, offsetMm: number|string }} input
 */
export function calculateWheelGeometry(input) {
  const validation = validateWheelInput(input);
  if (!validation.valid) {
    return validation;
  }

  const { rimDiameterIn, rimWidthIn, offsetMm } = validation.data;
  const widthMm = rimWidthIn * MM_PER_INCH;
  const innerEdgeMm = widthMm / 2 + offsetMm;
  const outerEdgeMm = widthMm / 2 - offsetMm;
  // Standard outer lip flange allowance (12.7 mm / 0.5 in) for traditional tape-measure backspacing
  const traditionalBackspaceMm = innerEdgeMm + 12.7;

  const sign = offsetMm > 0 ? `+${offsetMm}` : `${offsetMm}`;

  return {
    valid: true,
    data: {
      label: `${rimDiameterIn}x${rimWidthIn} ET${sign}`,
      rimDiameterIn,
      rimDiameterMm: roundTo(rimDiameterIn * MM_PER_INCH, 2),
      rimWidthIn,
      widthMm: roundTo(widthMm, 2),
      offsetMm,
      offsetIn: roundTo(mmToInches(offsetMm), 2),
      innerEdgeMm: roundTo(innerEdgeMm, 2),
      innerEdgeIn: roundTo(mmToInches(innerEdgeMm), 2),
      outerEdgeMm: roundTo(outerEdgeMm, 2),
      outerEdgeIn: roundTo(mmToInches(outerEdgeMm), 2),
      traditionalBackspaceMm: roundTo(traditionalBackspaceMm, 2),
      traditionalBackspaceIn: roundTo(mmToInches(traditionalBackspaceMm), 2),
      raw: {
        rimDiameterIn,
        rimWidthIn,
        widthMm,
        offsetMm,
        innerEdgeMm,
        outerEdgeMm,
        traditionalBackspaceMm,
      },
    },
  };
}

/**
 * Compares two wheel setups and calculates inboard/outboard edge movements and track width change.
 * - Inner clearance change: newInner - oldInner (positive = closer to suspension/inboard by X mm)
 * - Outer position change: newOuter - oldOuter (positive = extends farther outward/poke by X mm)
 * - Track width change (centerline-to-centerline across axle): 2 * (oldOffset - newOffset)
 *
 * @param {{ rimDiameterIn: number|string, rimWidthIn: number|string, offsetMm: number|string }} oldWheelInput
 * @param {{ rimDiameterIn: number|string, rimWidthIn: number|string, offsetMm: number|string }} newWheelInput
 */
export function compareWheels(oldWheelInput, newWheelInput) {
  const oldRes = calculateWheelGeometry(oldWheelInput);
  if (!oldRes.valid) {
    return {
      valid: false,
      error: {
        ...oldRes.error,
        field: `old.${oldRes.error.field}`,
        message: `Baseline wheel: ${oldRes.error.message}`,
      },
    };
  }

  const newRes = calculateWheelGeometry(newWheelInput);
  if (!newRes.valid) {
    return {
      valid: false,
      error: {
        ...newRes.error,
        field: `new.${newRes.error.field}`,
        message: `Comparison wheel: ${newRes.error.message}`,
      },
    };
  }

  const o = oldRes.data.raw;
  const n = newRes.data.raw;

  const innerEdgeDiffMm = n.innerEdgeMm - o.innerEdgeMm;
  const outerEdgeDiffMm = n.outerEdgeMm - o.outerEdgeMm;
  const centerlineShiftOutboardMm = o.offsetMm - n.offsetMm;
  const trackWidthChangeMm = 2 * centerlineShiftOutboardMm;
  const widthDiffMm = n.widthMm - o.widthMm;

  return {
    valid: true,
    data: {
      oldWheel: oldRes.data,
      newWheel: newRes.data,
      diff: {
        widthMm: roundTo(widthDiffMm, 2),
        widthIn: roundTo(mmToInches(widthDiffMm), 2),
        offsetMm: roundTo(n.offsetMm - o.offsetMm, 2),
        innerEdgeMm: roundTo(innerEdgeDiffMm, 2),
        innerEdgeIn: roundTo(mmToInches(innerEdgeDiffMm), 2),
        outerEdgeMm: roundTo(outerEdgeDiffMm, 2),
        outerEdgeIn: roundTo(mmToInches(outerEdgeDiffMm), 2),
        centerlineShiftOutboardMm: roundTo(centerlineShiftOutboardMm, 2),
        trackWidthChangeMm: roundTo(trackWidthChangeMm, 2),
        trackWidthChangeIn: roundTo(mmToInches(trackWidthChangeMm), 2),
      },
    },
  };
}

/**
 * Calculates combined tire + wheel + offset geometry comparison (Fitment tab).
 * @param {object} oldSetup
 * @param {object} newSetup
 */
export function calculateCombinedFitment(oldSetup, newSetup) {
  const tireComp = compareTires(oldSetup, newSetup);
  if (!tireComp.valid) return tireComp;

  const wheelComp = compareWheels(oldSetup, newSetup);
  if (!wheelComp.valid) return wheelComp;

  const oTire = tireComp.data.oldTire.raw;
  const nTire = tireComp.data.newTire.raw;
  const oWheel = wheelComp.data.oldWheel.raw;
  const nWheel = wheelComp.data.newWheel.raw;

  // Tire section inner/outer edge relative to hub mounting face:
  // Centerline is ET inboard of hub. Tire inner edge = tireWidth/2 + ET; Tire outer edge = tireWidth/2 - ET
  const oldTireInnerMm = oTire.widthMm / 2 + oWheel.offsetMm;
  const newTireInnerMm = nTire.widthMm / 2 + nWheel.offsetMm;
  const tireInnerDiffMm = newTireInnerMm - oldTireInnerMm;

  const oldTireOuterMm = oTire.widthMm / 2 - oWheel.offsetMm;
  const newTireOuterMm = nTire.widthMm / 2 - nWheel.offsetMm;
  const tireOuterDiffMm = newTireOuterMm - oldTireOuterMm;

  // Sidewall bulge past rim bead seat per side = (tireWidth - wheelBeadWidth) / 2
  const oldSidewallOverhangMm = (oTire.widthMm - oWheel.widthMm) / 2;
  const newSidewallOverhangMm = (nTire.widthMm - nWheel.widthMm) / 2;

  return {
    valid: true,
    data: {
      tires: tireComp.data,
      wheels: wheelComp.data,
      combinedGeometry: {
        oldTireInnerMm: roundTo(oldTireInnerMm, 2),
        newTireInnerMm: roundTo(newTireInnerMm, 2),
        tireInnerDiffMm: roundTo(tireInnerDiffMm, 2),
        tireInnerDiffIn: roundTo(mmToInches(tireInnerDiffMm), 2),

        oldTireOuterMm: roundTo(oldTireOuterMm, 2),
        newTireOuterMm: roundTo(newTireOuterMm, 2),
        tireOuterDiffMm: roundTo(tireOuterDiffMm, 2),
        tireOuterDiffIn: roundTo(mmToInches(tireOuterDiffMm), 2),

        oldSidewallOverhangMm: roundTo(oldSidewallOverhangMm, 2),
        newSidewallOverhangMm: roundTo(newSidewallOverhangMm, 2),
      },
    },
  };
}

/**
 * Calculates effective axle gearing changes from old and new tire diameters.
 * Formulas:
 * - effective_ratio = axle_ratio * (old_diameter / new_diameter)
 * - needed_axle_ratio (to restore factory effective gearing) = axle_ratio * (new_diameter / old_diameter)
 *
 * @param {{ oldDiameterMm: number|string, newDiameterMm: number|string, axleRatio: number|string }} input
 */
export function calculateGearing(input) {
  if (!input || typeof input !== 'object') {
    return {
      valid: false,
      error: { code: 'MISSING_GEARING_INPUT', field: 'all', message: 'Tire diameters and axle ratio are required.' },
    };
  }

  const oldDiameterMm = Number(input.oldDiameterMm);
  const newDiameterMm = Number(input.newDiameterMm);
  const axleRatio = Number(input.axleRatio);

  if (!Number.isFinite(oldDiameterMm) || oldDiameterMm <= 200 || oldDiameterMm > 2000) {
    return {
      valid: false,
      error: { code: 'INVALID_OLD_DIAMETER', field: 'oldDiameterMm', message: 'Baseline diameter must be between 200 mm and 2000 mm.' },
    };
  }
  if (!Number.isFinite(newDiameterMm) || newDiameterMm <= 200 || newDiameterMm > 2000) {
    return {
      valid: false,
      error: { code: 'INVALID_NEW_DIAMETER', field: 'newDiameterMm', message: 'New diameter must be between 200 mm and 2000 mm.' },
    };
  }
  if (!Number.isFinite(axleRatio) || axleRatio < 1.5 || axleRatio > 10.0) {
    return {
      valid: false,
      error: { code: 'INVALID_AXLE_RATIO', field: 'axleRatio', message: 'Axle ratio must be between 1.50 and 10.00 (for example, 3.73).' },
    };
  }

  const effectiveRatio = axleRatio * (oldDiameterMm / newDiameterMm);
  const restoredAxleRatio = axleRatio * (newDiameterMm / oldDiameterMm);
  const ratioDiff = effectiveRatio - axleRatio;
  const ratioChangePct = ((effectiveRatio - axleRatio) / axleRatio) * 100;

  return {
    valid: true,
    data: {
      oldDiameterMm: roundTo(oldDiameterMm, 2),
      newDiameterMm: roundTo(newDiameterMm, 2),
      axleRatio: roundTo(axleRatio, 2),
      effectiveRatio: roundTo(effectiveRatio, 2),
      restoredAxleRatio: roundTo(restoredAxleRatio, 2),
      ratioDiff: roundTo(ratioDiff, 2),
      ratioChangePct: roundTo(ratioChangePct, 2),
    },
  };
}

/**
 * Calculates speedometer error and indicated vs approximate actual speeds.
 * Formula:
 * - speed_ratio = new_diameter / old_diameter
 * - actual = indicated * speed_ratio
 *
 * @param {{ oldDiameterMm: number|string, newDiameterMm: number|string, speedsMph?: number[] }} input
 */
export function calculateSpeedometer(input) {
  if (!input || typeof input !== 'object') {
    return {
      valid: false,
      error: { code: 'MISSING_SPEED_INPUT', field: 'all', message: 'Old and new tire diameters are required.' },
    };
  }

  const oldDiameterMm = Number(input.oldDiameterMm);
  const newDiameterMm = Number(input.newDiameterMm);

  if (!Number.isFinite(oldDiameterMm) || oldDiameterMm <= 200 || oldDiameterMm > 2000) {
    return {
      valid: false,
      error: { code: 'INVALID_OLD_DIAMETER', field: 'oldDiameterMm', message: 'Baseline diameter must be between 200 mm and 2000 mm.' },
    };
  }
  if (!Number.isFinite(newDiameterMm) || newDiameterMm <= 200 || newDiameterMm > 2000) {
    return {
      valid: false,
      error: { code: 'INVALID_NEW_DIAMETER', field: 'newDiameterMm', message: 'New diameter must be between 200 mm and 2000 mm.' },
    };
  }

  const speedsMph = Array.isArray(input.speedsMph) && input.speedsMph.length > 0
    ? input.speedsMph
    : [20, 40, 60, 70, 80];

  const speedRatio = newDiameterMm / oldDiameterMm;
  const pctDiff = (speedRatio - 1) * 100;

  const rows = speedsMph.map((indicatedMph) => {
    const actualMph = indicatedMph * speedRatio;
    const diffMph = actualMph - indicatedMph;
    const indicatedKmh = indicatedMph * 1.609344;
    const actualKmh = actualMph * 1.609344;
    const diffKmh = actualKmh - indicatedKmh;

    return {
      indicatedMph,
      actualMph: roundTo(actualMph, 1),
      actualMphExact: roundTo(actualMph, 2),
      diffMph: roundTo(diffMph, 1),
      indicatedKmh: roundTo(indicatedKmh, 1),
      actualKmh: roundTo(actualKmh, 1),
      diffKmh: roundTo(diffKmh, 1),
    };
  });

  return {
    valid: true,
    data: {
      oldDiameterMm: roundTo(oldDiameterMm, 2),
      newDiameterMm: roundTo(newDiameterMm, 2),
      speedRatio: roundTo(speedRatio, 5),
      pctDiff: roundTo(pctDiff, 2),
      rows,
    },
  };
}

/**
 * Decodes a full tire sidewall code such as "285/75R16 116/113S" or "LT265/70R17 121/118S E".
 * Strictly adheres to verified lookup tables:
 * - Decodes width, aspect ratio, construction ('R'), rim diameter, load index (single/dual if in verified table), and speed symbol (if in verified table).
 * - Any prefixes (e.g., LT, P, ST), suffixes (e.g., XL, E, C), or unverified tokens are explicitly flagged as "Not decoded here" without inventing meanings.
 *
 * @param {string} rawCode
 */
export function decodeTireCode(rawCode) {
  if (typeof rawCode !== 'string' || !rawCode.trim()) {
    return {
      valid: false,
      error: {
        code: 'EMPTY_CODE',
        field: 'code',
        message: 'Enter a tire code to decode (for example, 285/75R16 116/113S).',
      },
    };
  }

  const normalized = rawCode.trim().replace(/\s+/g, ' ');
  // Match optional prefix, width/aspect, construction, rim, and optional trailing service description/tokens
  const regex = /^([A-Za-z]+)?\s*(\d{3}(?:\.\d+)?)\s*\/\s*(\d{2,3}(?:\.\d+)?)\s*([A-Za-z])\s*(\d{1,2}(?:\.\d+)?)(?:\s+(.*))?$/;
  const match = normalized.match(regex);

  if (!match) {
    return {
      valid: false,
      error: {
        code: 'UNRECOGNIZED_CODE_FORMAT',
        field: 'code',
        message: 'Could not parse core metric format (expected Width/Aspect + Construction + Rim, such as 285/75R16 116/113S). Flotation sizes (like 35x12.50R17) are not decoded in this metric table.',
      },
    };
  }

  const prefix = match[1] ? match[1].toUpperCase() : null;
  const widthMm = Number(match[2]);
  const aspectRatio = Number(match[3]);
  const constructionCode = match[4].toUpperCase();
  const rimDiameterIn = Number(match[5]);
  const trailingRaw = match[6] ? match[6].trim() : '';

  const metricsRes = calculateTireMetrics({ widthMm, aspectRatio, rimDiameterIn });
  if (!metricsRes.valid) {
    return metricsRes;
  }

  const notDecodedItems = [];
  if (prefix) {
    notDecodedItems.push({
      token: prefix,
      category: 'Prefix',
      reason: `Prefix "${prefix}" (such as LT, P, ST, or T) is not decoded here. This tool only decodes numeric geometry and verified load/speed tables.`,
    });
  }

  let constructionInfo;
  if (constructionCode === 'R') {
    constructionInfo = {
      code: 'R',
      decoded: true,
      meaning: 'Radial ply construction (cord plies run radially at 90 degrees to the direction of travel).',
    };
  } else {
    constructionInfo = {
      code: constructionCode,
      decoded: false,
      meaning: `Construction letter "${constructionCode}" is not in our verified radial table and is not decoded here.`,
    };
    notDecodedItems.push({
      token: constructionCode,
      category: 'Construction code',
      reason: `Only "R" (Radial) is verified in this tool.`,
    });
  }

  let loadSingle = null;
  let loadDual = null;
  let speedRating = null;

  if (trailingRaw) {
    const tokens = trailingRaw.split(/\s+/);
    const firstToken = tokens[0];
    // Check if first token matches service description like 116/113S or 91V or 121Q
    const serviceMatch = firstToken.match(/^(\d{2,3})(?:\/(\d{2,3}))?([A-Za-z]{1,2})$/);

    if (serviceMatch) {
      const singleIdx = Number(serviceMatch[1]);
      const dualIdx = serviceMatch[2] ? Number(serviceMatch[2]) : null;
      const speedSym = serviceMatch[3].toUpperCase();

      if (LOAD_INDEX_TABLE[singleIdx]) {
        loadSingle = {
          index: singleIdx,
          decoded: true,
          ...LOAD_INDEX_TABLE[singleIdx],
        };
      } else {
        loadSingle = {
          index: singleIdx,
          decoded: false,
          reason: `Load index ${singleIdx} is outside our verified table (60–130) and is not decoded here.`,
        };
        notDecodedItems.push({
          token: String(singleIdx),
          category: 'Load index (single)',
          reason: `Outside verified load index table (60–130).`,
        });
      }

      if (dualIdx !== null) {
        if (LOAD_INDEX_TABLE[dualIdx]) {
          loadDual = {
            index: dualIdx,
            decoded: true,
            ...LOAD_INDEX_TABLE[dualIdx],
          };
        } else {
          loadDual = {
            index: dualIdx,
            decoded: false,
            reason: `Dual load index ${dualIdx} is outside our verified table (60–130) and is not decoded here.`,
          };
          notDecodedItems.push({
            token: String(dualIdx),
            category: 'Load index (dual)',
            reason: `Outside verified load index table (60–130).`,
          });
        }
      }

      if (SPEED_RATING_TABLE[speedSym]) {
        speedRating = {
          symbol: speedSym,
          decoded: true,
          ...SPEED_RATING_TABLE[speedSym],
        };
      } else {
        speedRating = {
          symbol: speedSym,
          decoded: false,
          reason: `Speed symbol "${speedSym}" is not in our verified speed symbol table (L through Y) and is not decoded here.`,
        };
        notDecodedItems.push({
          token: speedSym,
          category: 'Speed symbol',
          reason: `Not in verified speed symbol table (L–Y).`,
        });
      }

      // Any remaining tokens after service description
      for (let i = 1; i < tokens.length; i++) {
        notDecodedItems.push({
          token: tokens[i],
          category: 'Additional marking / suffix',
          reason: `Token "${tokens[i]}" (such as load range, XL, DOT code, or OE marking) is not decoded here.`,
        });
      }
    } else {
      // None of the tokens matched standard service description
      for (const tok of tokens) {
        notDecodedItems.push({
          token: tok,
          category: 'Additional marking / suffix',
          reason: `Token "${tok}" is not a standard verified load/speed service description and is not decoded here.`,
        });
      }
    }
  }

  return {
    valid: true,
    data: {
      input: normalized,
      metrics: metricsRes.data,
      construction: constructionInfo,
      loadSingle,
      loadDual,
      speedRating,
      notDecodedItems,
    },
  };
}

/**
 * @file Shared application state, example presets, and URL query parameter serialization/validation.
 * Ensures cross-tab synchronization: changes in Calculator pre-fill Compare's first field,
 * and shareable URLs restore validated setups without a backend.
 */

import { validateTireInput, validateWheelInput } from '../calc/tireMath.js';

export const TABS = [
  { id: 'compare', label: 'Compare', shortDesc: '2–4 Tires & Upsize' },
  { id: 'calculator', label: 'Calculator', shortDesc: 'Single Size & Sliders' },
  { id: 'wheels', label: 'Wheels', shortDesc: 'Offset & Backspacing' },
  { id: 'fitment', label: 'Fitment', shortDesc: 'Tire + Wheel Geometry' },
  { id: 'gearing', label: 'Gearing', shortDesc: 'Effective Axle Ratio' },
  { id: 'speedometer', label: 'Speedometer', shortDesc: 'Indicated vs Actual' },
  { id: 'decoder', label: 'Decoder', shortDesc: 'Load & Speed Tables' },
  { id: 'visualizer', label: 'Visualizer', shortDesc: 'Interactive Overlay' },
];

export const EXAMPLE_PRESETS = [
  {
    id: 'truck-upsize',
    name: '265/70R17 → 285/75R17 (4x4 / Truck Upsize)',
    description: 'Central worked example: +56.5 mm (+2.22") diameter, +28.25 mm axle clearance, +7.04% speed change.',
    oldTire: { widthMm: 265, aspectRatio: 70, rimDiameterIn: 17 },
    newTire: { widthMm: 285, aspectRatio: 75, rimDiameterIn: 17 },
    oldWheel: { rimDiameterIn: 17, rimWidthIn: 7.5, offsetMm: 30 },
    newWheel: { rimDiameterIn: 17, rimWidthIn: 8.5, offsetMm: 0 },
    axleRatio: 3.73,
    decoderCode: '285/75R16 116/113S',
  },
  {
    id: 'sport-plus-one',
    name: '225/45R17 → 245/40R18 (Sport Sedan Plus-One)',
    description: 'Stepping up from 17x8 ET45 to 18x9 ET35 while keeping overall diameter within 1.1%.',
    oldTire: { widthMm: 225, aspectRatio: 45, rimDiameterIn: 17 },
    newTire: { widthMm: 245, aspectRatio: 40, rimDiameterIn: 18 },
    oldWheel: { rimDiameterIn: 17, rimWidthIn: 8, offsetMm: 45 },
    newWheel: { rimDiameterIn: 18, rimWidthIn: 9, offsetMm: 35 },
    axleRatio: 3.45,
    decoderCode: '225/45R17 91W',
  },
  {
    id: 'wheel-offset-poke',
    name: '17x8 ET45 → 18x9 ET20 (Offset & Track Change)',
    description: 'Same 275/65R18 height target with a wider lower-offset wheel that sits 37.7 mm farther outward.',
    oldTire: { widthMm: 275, aspectRatio: 70, rimDiameterIn: 17 },
    newTire: { widthMm: 275, aspectRatio: 65, rimDiameterIn: 18 },
    oldWheel: { rimDiameterIn: 17, rimWidthIn: 8, offsetMm: 45 },
    newWheel: { rimDiameterIn: 18, rimWidthIn: 9, offsetMm: 20 },
    axleRatio: 3.55,
    decoderCode: '275/65R18 116T',
  },
];

/**
 * Returns a fresh copy of the default workspace state (centered on 265/70R17 vs 285/75R17).
 */
export function getDefaultState() {
  return {
    activeTab: 'compare',
    unitMode: 'both', // 'both' | 'metric' | 'imperial'
    calculatorSubView: 'all', // 'all' | 'dimensions' | 'height' | 'circumference' | 'profile'
    // Tire 1 (Baseline in Compare AND primary tire in Calculator)
    tire1: { widthMm: 265, aspectRatio: 70, rimDiameterIn: 17 },
    // Tire 2 (Candidate in Compare, Fitment, Gearing, Speedometer, Visualizer)
    tire2: { widthMm: 285, aspectRatio: 75, rimDiameterIn: 17 },
    // Optional Tire 3 & Tire 4 for multi-tire comparison (2 to 4 tires)
    compareCount: 2,
    tire3: { widthMm: 275, aspectRatio: 70, rimDiameterIn: 17 },
    tire4: { widthMm: 255, aspectRatio: 80, rimDiameterIn: 17 },
    // Wheels
    wheel1: { rimDiameterIn: 17, rimWidthIn: 7.5, offsetMm: 30 },
    wheel2: { rimDiameterIn: 17, rimWidthIn: 8.5, offsetMm: 0 },
    // Gearing
    axleRatio: 3.73,
    // Decoder
    decoderInput: '285/75R16 116/113S',
    // Sort state for comparison chart
    compareSortField: 'default', // 'default' | 'diameter' | 'width' | 'sidewall' | 'revs'
    compareSortAsc: true,
  };
}

/**
 * Parses a shorthand like "265-70-17" or "265/70R17" from URL params safely.
 * @param {string|null} str
 * @param {object} fallback
 */
function parseTireParam(str, fallback) {
  if (!str) return { ...fallback };
  const parts = str.trim().split(/[-/rR]+/).map(Number);
  if (parts.length === 3) {
    const check = validateTireInput({
      widthMm: parts[0],
      aspectRatio: parts[1],
      rimDiameterIn: parts[2],
    });
    if (check.valid) return check.data;
  }
  return { ...fallback };
}

/**
 * Parses a wheel shorthand like "17x7.5x30" from URL params safely.
 * @param {string|null} str
 * @param {object} fallback
 */
function parseWheelParam(str, fallback) {
  if (!str) return { ...fallback };
  const parts = str.trim().split('x').map(Number);
  if (parts.length === 3) {
    const check = validateWheelInput({
      rimDiameterIn: parts[0],
      rimWidthIn: parts[1],
      offsetMm: parts[2],
    });
    if (check.valid) return check.data;
  }
  return { ...fallback };
}

/**
 * Reads and validates state from window.location.search.
 * Invalid parameters safely fall back to defaults without throwing or producing NaN.
 */
export function loadStateFromUrl() {
  const base = getDefaultState();
  if (typeof window === 'undefined' || !window.location) return base;

  const params = new URLSearchParams(window.location.search);
  const tabParam = params.get('tab');
  if (tabParam && TABS.some((t) => t.id === tabParam)) {
    base.activeTab = tabParam;
  }

  const unitParam = params.get('unit');
  if (unitParam && ['both', 'metric', 'imperial'].includes(unitParam)) {
    base.unitMode = unitParam;
  }

  base.tire1 = parseTireParam(params.get('t1'), base.tire1);
  base.tire2 = parseTireParam(params.get('t2'), base.tire2);
  base.tire3 = parseTireParam(params.get('t3'), base.tire3);
  base.tire4 = parseTireParam(params.get('t4'), base.tire4);

  const countParam = Number(params.get('cnt'));
  if (Number.isInteger(countParam) && countParam >= 2 && countParam <= 4) {
    base.compareCount = countParam;
  }

  base.wheel1 = parseWheelParam(params.get('w1'), base.wheel1);
  base.wheel2 = parseWheelParam(params.get('w2'), base.wheel2);

  const axleParam = Number(params.get('axle'));
  if (Number.isFinite(axleParam) && axleParam >= 1.5 && axleParam <= 10) {
    base.axleRatio = axleParam;
  }

  const decParam = params.get('code');
  if (decParam && decParam.trim().length > 0 && decParam.length <= 40) {
    base.decoderInput = decParam.trim();
  }

  return base;
}

/**
 * Builds a shareable URL query string representing the current state.
 * @param {ReturnType<typeof getDefaultState>} state
 * @returns {string}
 */
export function serializeStateToQuery(state) {
  const params = new URLSearchParams();
  params.set('tab', state.activeTab);
  params.set('t1', `${state.tire1.widthMm}-${state.tire1.aspectRatio}-${state.tire1.rimDiameterIn}`);
  params.set('t2', `${state.tire2.widthMm}-${state.tire2.aspectRatio}-${state.tire2.rimDiameterIn}`);
  if (state.compareCount > 2) {
    params.set('cnt', String(state.compareCount));
    params.set('t3', `${state.tire3.widthMm}-${state.tire3.aspectRatio}-${state.tire3.rimDiameterIn}`);
  }
  if (state.compareCount > 3) {
    params.set('t4', `${state.tire4.widthMm}-${state.tire4.aspectRatio}-${state.tire4.rimDiameterIn}`);
  }
  params.set('w1', `${state.wheel1.rimDiameterIn}x${state.wheel1.rimWidthIn}x${state.wheel1.offsetMm}`);
  params.set('w2', `${state.wheel2.rimDiameterIn}x${state.wheel2.rimWidthIn}x${state.wheel2.offsetMm}`);
  params.set('axle', String(state.axleRatio));
  if (state.unitMode !== 'both') {
    params.set('unit', state.unitMode);
  }
  return `?${params.toString()}`;
}

import React, { useState, useEffect } from 'react';
import {
  calculateTireMetrics,
  parseTireSizeString,
  compareTires,
  calculateWheelGeometry,
  compareWheels,
  calculateCombinedFitment,
  calculateGearing,
  calculateSpeedometer,
  decodeTireCode,
} from '../calc/tireMath.js';
import {
  renderSingleTireDiagram,
  renderTireComparisonDiagram,
  renderWheelOffsetDiagram,
  renderCombinedOverlayVisualizer,
} from '../viz/svgDiagrams.js';
import {
  TABS,
  EXAMPLE_PRESETS,
  getDefaultState,
  loadStateFromUrl,
  serializeStateToQuery,
} from './urlState.js';

/**
 * Formats a measurement according to the active unit mode ('both' | 'metric' | 'imperial').
 * @param {number} mm
 * @param {number} inches
 * @param {string} unitMode
 * @param {boolean} [signed=false]
 */
function formatMeasure(mm: number, inches: number, unitMode: string, signed = false) {
  const signMm = signed && mm > 0 ? '+' : '';
  const signIn = signed && inches > 0 ? '+' : '';
  if (unitMode === 'metric') {
    return `${signMm}${mm} mm`;
  }
  if (unitMode === 'imperial') {
    return `${signIn}${inches} in`;
  }
  return `${signMm}${mm} mm (${signIn}${inches} in)`;
}

/**
 * Formats a signed percentage value.
 * @param {number} pct
 */
function formatPct(pct: number) {
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct}%`;
}

/**
 * Reusable Tire Dimension Input Group with quick code parser + separate numeric fields + inline validation.
 */
function TireInputCard({
  title,
  subtitle = '',
  tire,
  onChange,
  badgeText = '',
}: {
  title: string;
  subtitle?: string;
  tire: any;
  onChange: (t: any) => void;
  badgeText?: string;
}) {
  const [quickCode, setQuickCode] = useState(`${tire.widthMm}/${tire.aspectRatio}R${tire.rimDiameterIn}`);
  const [quickError, setQuickError] = useState<string | null>(null);

  useEffect(() => {
    setQuickCode(`${tire.widthMm}/${tire.aspectRatio}R${tire.rimDiameterIn}`);
    setQuickError(null);
  }, [tire.widthMm, tire.aspectRatio, tire.rimDiameterIn]);

  const handleQuickApply = (e: React.FormEvent) => {
    e.preventDefault();
    const res: any = parseTireSizeString(quickCode, true);
    if (!res.valid) {
      setQuickError(res.error.message);
    } else {
      setQuickError(null);
      onChange(res.data);
    }
  };

  const validation: any = calculateTireMetrics(tire);

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-900">
      <div className="flex items-baseline justify-between gap-2 mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        {badgeText && (
          <span className="text-xs font-mono text-slate-600 dark:text-slate-300">{badgeText}</span>
        )}
      </div>

      {/* Quick String Input */}
      <form onSubmit={handleQuickApply} className="mb-3">
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
          Quick Tire Code (e.g. 265/70R17)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={quickCode}
            onChange={(e) => setQuickCode(e.target.value)}
            aria-label={`${title} quick tire code`}
            placeholder="265/70R17"
            className="w-full px-3 py-1.5 text-sm font-mono border border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-600"
          />
          <button
            type="submit"
            className="px-3 py-1.5 text-xs font-medium bg-slate-800 dark:bg-slate-800 text-white rounded hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Parse Code
          </button>
        </div>
        {quickError && (
          <p role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium">
            ▲ {quickError}
          </p>
        )}
      </form>

      {/* Separate Numeric Fields */}
      <div className="grid grid-cols-3 gap-2.5">
        <div>
          <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
            Width (mm)
          </label>
          <input
            type="number"
            step="5"
            min="100"
            max="500"
            value={tire.widthMm}
            onChange={(e) => onChange({ ...tire, widthMm: e.target.value })}
            aria-label={`${title} width in millimeters`}
            className="w-full px-2.5 py-1.5 text-sm font-mono tabular-nums border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-600"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
            Aspect (%)
          </label>
          <input
            type="number"
            step="5"
            min="15"
            max="100"
            value={tire.aspectRatio}
            onChange={(e) => onChange({ ...tire, aspectRatio: e.target.value })}
            aria-label={`${title} aspect ratio percent`}
            className="w-full px-2.5 py-1.5 text-sm font-mono tabular-nums border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-600"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
            Rim (in)
          </label>
          <input
            type="number"
            step="0.5"
            min="8"
            max="32"
            value={tire.rimDiameterIn}
            onChange={(e) => onChange({ ...tire, rimDiameterIn: e.target.value })}
            aria-label={`${title} rim diameter in inches`}
            className="w-full px-2.5 py-1.5 text-sm font-mono tabular-nums border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-600"
          />
        </div>
      </div>

      {!validation.valid && (
        <p role="alert" className="mt-2.5 text-xs text-red-600 dark:text-red-400 font-medium">
          ▲ {validation.error.message}
        </p>
      )}
    </div>
  );
}

/**
 * Reusable Wheel Input Group (Diameter, Width, Offset ET).
 */
function WheelInputCard({
  title,
  wheel,
  onChange,
}: {
  title: string;
  wheel: any;
  onChange: (w: any) => void;
}) {
  const validation: any = calculateWheelGeometry(wheel);

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-900">
      <div className="flex items-baseline justify-between gap-2 mb-3">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        {validation.valid && (
          <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
            {validation.data.label}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <div>
          <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
            Diameter (in)
          </label>
          <input
            type="number"
            step="0.5"
            min="8"
            max="32"
            value={wheel.rimDiameterIn}
            onChange={(e) => onChange({ ...wheel, rimDiameterIn: e.target.value })}
            aria-label={`${title} wheel diameter in inches`}
            className="w-full px-2.5 py-1.5 text-sm font-mono tabular-nums border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-600"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
            Width (in)
          </label>
          <input
            type="number"
            step="0.5"
            min="3"
            max="18"
            value={wheel.rimWidthIn}
            onChange={(e) => onChange({ ...wheel, rimWidthIn: e.target.value })}
            aria-label={`${title} wheel width in inches`}
            className="w-full px-2.5 py-1.5 text-sm font-mono tabular-nums border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-600"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
            Offset ET (mm)
          </label>
          <input
            type="number"
            step="1"
            min="-150"
            max="150"
            value={wheel.offsetMm}
            onChange={(e) => onChange({ ...wheel, offsetMm: e.target.value })}
            aria-label={`${title} wheel offset ET in millimeters`}
            className="w-full px-2.5 py-1.5 text-sm font-mono tabular-nums border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-600"
          />
        </div>
      </div>

      {!validation.valid && (
        <p role="alert" className="mt-2.5 text-xs text-red-600 dark:text-red-400 font-medium">
          ▲ {validation.error.message}
        </p>
      )}
    </div>
  );
}

/**
 * Main Interactive Workspace Component with 8 synchronized tabs.
 */
export default function WorkspaceApp() {
  const [state, setState] = useState(() => loadStateFromUrl());
  const [darkMode, setDarkMode] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');

  // Sync dark mode class on documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Keep browser URL clean without query parameters or hash fragments
  useEffect(() => {
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      if (window.location.search || window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname || '/');
      }
    }
  }, []);

  const updateState = (patch: Record<string, any>) => {
    setState((prev) => ({ ...prev, ...patch }));
  };

  const handleSwap = () => {
    setState((prev) => ({
      ...prev,
      tire1: { ...prev.tire2 },
      tire2: { ...prev.tire1 },
      wheel1: { ...prev.wheel2 },
      wheel2: { ...prev.wheel1 },
    }));
  };

  const handleReset = () => {
    setState(getDefaultState());
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      window.history.replaceState(null, '', window.location.pathname || '/');
    }
  };

  const handleApplyPreset = (preset: any) => {
    setState((prev) => ({
      ...prev,
      tire1: { ...preset.oldTire },
      tire2: { ...preset.newTire },
      wheel1: { ...preset.oldWheel },
      wheel2: { ...preset.newWheel },
      axleRatio: preset.axleRatio,
      decoderInput: preset.decoderCode,
    }));
  };

  const handleCopyShareUrl = async () => {
    try {
      const shareUrl = `${window.location.origin}${window.location.pathname || '/'}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopyStatus('Link copied');
      setTimeout(() => setCopyStatus(''), 2500);
    } catch {
      setCopyStatus('Copy failed');
    }
  };

  const handleCopyComparisonSummary = async (compData: any) => {
    if (!compData) return;
    const { oldTire, newTire, diff } = compData;
    const summary = [
      `Wanjaaro Tire Comparison: ${oldTire.label} vs ${newTire.label}`,
      `Overall Diameter: ${oldTire.diameterMm} mm (${oldTire.diameterIn} in) -> ${newTire.diameterMm} mm (${newTire.diameterIn} in) [${diff.diameterMm > 0 ? '+' : ''}${diff.diameterMm} mm / ${diff.diameterPct > 0 ? '+' : ''}${diff.diameterPct}%]`,
      `Section Width: ${oldTire.widthMm} mm -> ${newTire.widthMm} mm [${diff.widthMm > 0 ? '+' : ''}${diff.widthMm} mm]`,
      `Sidewall Height: ${oldTire.sidewallMm} mm -> ${newTire.sidewallMm} mm [${diff.sidewallMm > 0 ? '+' : ''}${diff.sidewallMm} mm]`,
      `Axle Clearance Change: ${diff.axleClearanceMm > 0 ? '+' : ''}${diff.axleClearanceMm} mm (${diff.axleClearanceIn > 0 ? '+' : ''}${diff.axleClearanceIn} in)`,
      `Revs per Mile: ${Math.round(oldTire.revsPerMile)} -> ${Math.round(newTire.revsPerMile)}`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(summary);
      setCopyStatus('Results copied');
      setTimeout(() => setCopyStatus(''), 2500);
    } catch {
      setCopyStatus('Copy failed');
    }
  };

  // Pre-calculate shared models
  const calcSingleRes: any = calculateTireMetrics(state.tire1);
  const comparePairRes: any = compareTires(state.tire1, state.tire2);
  const wheelCompRes: any = compareWheels(state.wheel1, state.wheel2);

  const combinedOldSetup = { ...state.tire1, ...state.wheel1 };
  const combinedNewSetup = { ...state.tire2, ...state.wheel2 };
  const fitmentRes: any = calculateCombinedFitment(combinedOldSetup, combinedNewSetup);

  const oldDiaMmForGearing = calcSingleRes.valid ? calcSingleRes.data.diameterMm : 802.8;
  const newDiaMmForGearing = comparePairRes.valid ? comparePairRes.data.newTire.diameterMm : 859.3;

  const gearingRes: any = calculateGearing({
    oldDiameterMm: oldDiaMmForGearing,
    newDiameterMm: newDiaMmForGearing,
    axleRatio: state.axleRatio,
  });

  const speedRes: any = calculateSpeedometer({
    oldDiameterMm: oldDiaMmForGearing,
    newDiameterMm: newDiaMmForGearing,
  });

  const decoderRes: any = decodeTireCode(state.decoderInput);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-6 shadow-xs overflow-hidden">
      {/* Global Workspace Utility Bar: Presets, Units, Swap, Reset, Share, Theme */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800 no-print">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1">Presets:</span>
          {EXAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
              title={preset.description}
            >
              {preset.name.split(' (')[0]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Unit Mode Segmented Control */}
          <div className="flex items-center p-0.5 bg-slate-200/80 dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-800" role="group" aria-label="Display units">
            {[
              { id: 'both', label: 'mm + in' },
              { id: 'metric', label: 'mm' },
              { id: 'imperial', label: 'in' },
            ].map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => updateState({ unitMode: u.id })}
                className={`px-2.5 py-1 text-xs font-mono rounded-xs transition-colors whitespace-nowrap cursor-pointer ${
                  state.unitMode === u.id
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {u.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSwap}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            ⇄ Swap
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={handleCopyShareUrl}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            {copyStatus || 'Share URL'}
          </button>

          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle color theme"
            className="px-2.5 sm:px-3 py-1.5 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            {darkMode ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>

      {/* 8-Tab Accessible Responsive Grid / Scroll Navigation Bar */}
      <div
        role="tablist"
        aria-label="Tire and wheel calculator tools"
        className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 pb-4 mb-5 border-b border-slate-200 dark:border-slate-800 no-print"
      >
        {TABS.map((tab) => {
          const isSelected = state.activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isSelected}
              aria-controls={`panel-${tab.id}`}
              type="button"
              onClick={() => updateState({ activeTab: tab.id })}
              className={`px-3 py-2 text-left rounded-md transition-colors cursor-pointer border min-w-0 ${
                isSelected
                  ? 'bg-sky-700 text-white border-sky-700 font-semibold'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="text-xs sm:text-sm leading-tight truncate">{tab.label}</div>
              <div className={`text-[11px] leading-tight mt-0.5 truncate ${isSelected ? 'text-sky-100' : 'text-slate-500 dark:text-slate-400'}`}>
                {tab.shortDesc}
              </div>
            </button>
          );
        })}
      </div>

      {/* TAB 1: COMPARE (Default view answering "I have 265/70R17 and I'm thinking about 285/75R17. What changes?") */}
      {state.activeTab === 'compare' && (
        <section
          role="tabpanel"
          id="panel-compare"
          aria-labelledby="tab-compare"
          className="space-y-5"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-lg border border-slate-200 dark:border-slate-800">
            <div className="space-y-1">
              <h2 className="text-base sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
                Tire Size &amp; Upsize Comparison (2 to 4 Tires)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Enter your current baseline size and up to three comparison sizes. Tire 1 stays synchronized with the Calculator tab.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 no-print shrink-0">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label htmlFor="compare-count-select" className="text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  Tires to compare:
                </label>
                <select
                  id="compare-count-select"
                  value={state.compareCount}
                  onChange={(e) => updateState({ compareCount: Number(e.target.value) })}
                  className="flex-1 sm:flex-initial px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 cursor-pointer"
                >
                  <option value={2}>2 Tires (Side-by-Side)</option>
                  <option value={3}>3 Tires</option>
                  <option value={4}>4 Tires</option>
                </select>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {comparePairRes.valid && (
                  <button
                    type="button"
                    onClick={() => handleCopyComparisonSummary(comparePairRes.data)}
                    className="flex-1 sm:flex-initial px-3 py-1.5 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap text-center"
                  >
                    Copy Results
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 sm:flex-initial px-3 py-1.5 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap text-center"
                >
                  Print Comparison
                </button>
              </div>
            </div>
          </div>

          {/* Input Cards for 2 to 4 Tires */}
          <div className={`grid grid-cols-1 ${state.compareCount === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-4'} gap-4 no-print`}>
            <TireInputCard
              title="Tire 1 (Current / Baseline)"
              subtitle="Reference size for diffs"
              tire={state.tire1}
              onChange={(t) => updateState({ tire1: t, wheel1: { ...state.wheel1, rimDiameterIn: t.rimDiameterIn } })}
              badgeText="BASELINE"
            />
            <TireInputCard
              title="Tire 2 (New / Candidate)"
              subtitle="Primary comparison"
              tire={state.tire2}
              onChange={(t) => updateState({ tire2: t, wheel2: { ...state.wheel2, rimDiameterIn: t.rimDiameterIn } })}
              badgeText="CANDIDATE"
            />
            {state.compareCount >= 3 && (
              <TireInputCard
                title="Tire 3 (Alternative)"
                subtitle="Compared against Tire 1"
                tire={state.tire3}
                onChange={(t) => updateState({ tire3: t })}
                badgeText="ALT 3"
              />
            )}
            {state.compareCount >= 4 && (
              <TireInputCard
                title="Tire 4 (Alternative)"
                subtitle="Compared against Tire 1"
                tire={state.tire4}
                onChange={(t) => updateState({ tire4: t })}
                badgeText="ALT 4"
              />
            )}
          </div>

          {/* Instant Answer Banner for Primary Pair (Tire 1 vs Tire 2) */}
          {comparePairRes.valid ? (
            <>
              <div className="border-l-4 border-sky-600 bg-white dark:bg-slate-900 p-4 rounded-r-lg border border-slate-200 dark:border-slate-800">
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">
                  DIRECT GEOMETRY SUMMARY · {comparePairRes.data.oldTire.label} → {comparePairRes.data.newTire.label}
                </div>
                <p className="text-sm sm:text-base text-slate-900 dark:text-slate-100 font-medium">
                  Moving from <span className="font-mono font-semibold">{comparePairRes.data.oldTire.label}</span> to{' '}
                  <span className="font-mono font-semibold">{comparePairRes.data.newTire.label}</span> changes overall diameter by{' '}
                  <span className="font-mono font-semibold text-sky-700 dark:text-sky-400">
                    {formatMeasure(comparePairRes.data.diff.diameterMm, comparePairRes.data.diff.diameterIn, state.unitMode, true)} ({formatPct(comparePairRes.data.diff.diameterPct)})
                  </span>
                  , section width by{' '}
                  <span className="font-mono font-semibold">
                    {formatMeasure(comparePairRes.data.diff.widthMm, comparePairRes.data.diff.widthIn, state.unitMode, true)}
                  </span>
                  , and theoretical ground clearance at the axle by{' '}
                  <span className="font-mono font-semibold text-sky-700 dark:text-sky-400">
                    {formatMeasure(comparePairRes.data.diff.axleClearanceMm, comparePairRes.data.diff.axleClearanceIn, state.unitMode, true)}
                  </span>
                  . When your speedometer reads <span className="font-mono">60 mph</span>, approximate actual speed is{' '}
                  <span className="font-mono font-semibold">
                    {speedRes.valid ? speedRes.data.rows.find((r: any) => r.indicatedMph === 60)?.actualMph : '—'} mph
                  </span>.
                </p>
              </div>

              {/* Visual Side-by-Side Drawing + Upsize Summary Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-5 border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-900">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      To-Scale Geometry Drawing
                    </h3>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      Geometry only
                    </span>
                  </div>
                  <div
                    className="text-slate-800 dark:text-slate-200"
                    dangerouslySetInnerHTML={{
                      __html: renderTireComparisonDiagram(
                        comparePairRes.data.oldTire,
                        comparePairRes.data.newTire
                      ),
                    }}
                  />
                </div>

                {/* Sortable Multi-Tire Comparison Table */}
                <div className="lg:col-span-7 border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-900 overflow-x-auto">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Comparison Data Table (with Difference Highlighting)
                    </h3>
                    <div className="flex items-center gap-2 no-print">
                      <label htmlFor="sort-compare" className="text-xs text-slate-500 dark:text-slate-400">
                        Sort columns by:
                      </label>
                      <select
                        id="sort-compare"
                        value={state.compareSortField}
                        onChange={(e) => updateState({ compareSortField: e.target.value })}
                        className="px-2 py-1 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-950"
                      >
                        <option value="default">Input Order (Tire 1 → {state.compareCount})</option>
                        <option value="diameter">Overall Diameter (Smallest → Largest)</option>
                        <option value="width">Section Width (Narrowest → Widest)</option>
                        <option value="sidewall">Sidewall Height (Shortest → Tallest)</option>
                        <option value="revs">Revs / Mile (Lowest → Highest)</option>
                      </select>
                    </div>
                  </div>

                  {(() => {
                    const rawList = [
                      { slot: 'Tire 1 (Base)', input: state.tire1, isBase: true },
                      { slot: 'Tire 2 (New)', input: state.tire2, isBase: false },
                      ...(state.compareCount >= 3 ? [{ slot: 'Tire 3', input: state.tire3, isBase: false }] : []),
                      ...(state.compareCount >= 4 ? [{ slot: 'Tire 4', input: state.tire4, isBase: false }] : []),
                    ];

                    const evaluated: any[] = rawList
                      .map((item) => {
                        const m: any = calculateTireMetrics(item.input);
                        const c: any = compareTires(state.tire1, item.input);
                        return { ...item, metrics: m.valid ? m.data : null, comp: c.valid ? c.data.diff : null };
                      })
                      .filter((x) => x.metrics !== null);

                    if (state.compareSortField !== 'default') {
                      evaluated.sort((a, b) => {
                        if (state.compareSortField === 'diameter') return a.metrics.diameterMm - b.metrics.diameterMm;
                        if (state.compareSortField === 'width') return a.metrics.widthMm - b.metrics.widthMm;
                        if (state.compareSortField === 'sidewall') return a.metrics.sidewallMm - b.metrics.sidewallMm;
                        if (state.compareSortField === 'revs') return a.metrics.revsPerMile - b.metrics.revsPerMile;
                        return 0;
                      });
                    }

                    return (
                      <table className="w-full text-left border-collapse text-xs sm:text-sm tabular-nums">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                            <th className="py-2 pr-3 font-medium">Dimension</th>
                            {evaluated.map((item) => (
                              <th key={item.slot} className="py-2 px-3 font-mono font-semibold text-slate-900 dark:text-slate-100">
                                <div>{item.slot}</div>
                                <div className="text-sky-700 dark:text-sky-400">{item.metrics.label}</div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                          <tr>
                            <td className="py-2 pr-3 font-sans font-medium text-slate-700 dark:text-slate-300">Section Width</td>
                            {evaluated.map((item) => (
                              <td key={item.slot} className="py-2 px-3">
                                <div>{formatMeasure(item.metrics.widthMm, item.metrics.widthIn, state.unitMode)}</div>
                                {!item.isBase && item.comp && (
                                  <div className="text-xs text-slate-500 dark:text-slate-400">
                                    {formatMeasure(item.comp.widthMm, item.comp.widthIn, state.unitMode, true)} ({formatPct(item.comp.widthPct)})
                                  </div>
                                )}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-2 pr-3 font-sans font-medium text-slate-700 dark:text-slate-300">Sidewall Height</td>
                            {evaluated.map((item) => (
                              <td key={item.slot} className="py-2 px-3">
                                <div>{formatMeasure(item.metrics.sidewallMm, item.metrics.sidewallIn, state.unitMode)}</div>
                                {!item.isBase && item.comp && (
                                  <div className="text-xs text-slate-500 dark:text-slate-400">
                                    {formatMeasure(item.comp.sidewallMm, item.comp.sidewallIn, state.unitMode, true)} ({formatPct(item.comp.sidewallPct)})
                                  </div>
                                )}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-2 pr-3 font-sans font-medium text-slate-700 dark:text-slate-300">Rim Diameter</td>
                            {evaluated.map((item) => (
                              <td key={item.slot} className="py-2 px-3">
                                {formatMeasure(item.metrics.rimMm, item.metrics.rimDiameterIn, state.unitMode)}
                              </td>
                            ))}
                          </tr>
                          <tr className="bg-slate-50/80 dark:bg-slate-950/60">
                            <td className="py-2.5 pr-3 font-sans font-semibold text-slate-900 dark:text-slate-100">Overall Diameter</td>
                            {evaluated.map((item) => {
                              const absPct = item.comp ? Math.abs(item.comp.diameterPct) : 0;
                              const highlightClass = !item.isBase && absPct >= 3
                                ? 'text-amber-700 dark:text-amber-400 font-semibold'
                                : 'text-emerald-700 dark:text-emerald-400';
                              return (
                                <td key={item.slot} className="py-2.5 px-3">
                                  <div className="font-semibold">{formatMeasure(item.metrics.diameterMm, item.metrics.diameterIn, state.unitMode)}</div>
                                  {!item.isBase && item.comp && (
                                    <div className={`text-xs ${highlightClass}`}>
                                      {absPct >= 3 ? '▲ ' : '● '}
                                      {formatMeasure(item.comp.diameterMm, item.comp.diameterIn, state.unitMode, true)} ({formatPct(item.comp.diameterPct)})
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                          <tr>
                            <td className="py-2 pr-3 font-sans font-medium text-slate-700 dark:text-slate-300">Circumference</td>
                            {evaluated.map((item) => (
                              <td key={item.slot} className="py-2 px-3">
                                <div>{formatMeasure(Math.round(item.metrics.circumferenceMm), item.metrics.circumferenceIn, state.unitMode)}</div>
                                {!item.isBase && item.comp && (
                                  <div className="text-xs text-slate-500 dark:text-slate-400">
                                    {formatMeasure(Math.round(item.comp.circumferenceMm), item.comp.circumferenceIn, state.unitMode, true)} ({formatPct(item.comp.circumferencePct)})
                                  </div>
                                )}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-2 pr-3 font-sans font-medium text-slate-700 dark:text-slate-300">Axle Ground Clearance Δ</td>
                            {evaluated.map((item) => (
                              <td key={item.slot} className="py-2 px-3">
                                {item.isBase ? (
                                  <span className="text-slate-400">0 mm (Baseline)</span>
                                ) : (
                                  <span className="font-semibold">
                                    {formatMeasure(item.comp.axleClearanceMm, item.comp.axleClearanceIn, state.unitMode, true)}
                                  </span>
                                )}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-2 pr-3 font-sans font-medium text-slate-700 dark:text-slate-300">Revolutions / Mile (km)</td>
                            {evaluated.map((item) => (
                              <td key={item.slot} className="py-2 px-3">
                                <div>
                                  {Math.round(item.metrics.revsPerMile)} /mi ({Math.round(item.metrics.revsPerKm)} /km)
                                </div>
                                {!item.isBase && item.comp && (
                                  <div className="text-xs text-slate-500 dark:text-slate-400">
                                    {item.comp.revsPerMile > 0 ? '+' : ''}
                                    {Math.round(item.comp.revsPerMile)} revs/mi
                                  </div>
                                )}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-2 pr-3 font-sans font-medium text-slate-700 dark:text-slate-300">Actual Speed @ 60 mph Indicated</td>
                            {evaluated.map((item) => {
                              const actual60 = (60 * (item.metrics.diameterMm / evaluated[0].metrics.diameterMm)).toFixed(1);
                              return (
                                <td key={item.slot} className="py-2 px-3">
                                  {actual60} mph ({(Number(actual60) * 1.609344).toFixed(1)} km/h)
                                </td>
                              );
                            })}
                          </tr>
                        </tbody>
                      </table>
                    );
                  })()}
                </div>
              </div>
            </>
          ) : (
            <div role="alert" className="p-4 border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 rounded-lg text-sm text-red-700 dark:text-red-300">
              ▲ {comparePairRes.error.message}
            </div>
          )}
        </section>
      )}

      {/* TAB 2: CALCULATOR (Single tire breakdown, sub-panels, step-through derivation, live sliders) */}
      {state.activeTab === 'calculator' && (
        <section
          role="tabpanel"
          id="panel-calculator"
          aria-labelledby="tab-calculator"
          className="space-y-6"
        >
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
              Single Tire Size Breakdown &amp; Step-by-Step Derivation
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Enter a tire size code (such as 225/45R17 or 265/70R17) or adjust individual dimensions. Changes here automatically update Tire 1 in Compare.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 space-y-4">
              <TireInputCard
                title="Primary Tire Size (Synchronized with Compare Tire 1)"
                subtitle="Accepts metric string or separate fields"
                tire={state.tire1}
                onChange={(t) => updateState({ tire1: t, wheel1: { ...state.wheel1, rimDiameterIn: t.rimDiameterIn } })}
                badgeText="ACTIVE TIRE"
              />

              {/* Live Width & Aspect Ratio Sliders */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-900 space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Live Width &amp; Aspect Ratio Explorer
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Drag either slider to observe how section width and aspect ratio interact to change sidewall height and overall diameter at a constant {state.tire1.rimDiameterIn}&quot; rim size.
                </p>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <label htmlFor="slider-width">Section Width: {state.tire1.widthMm} mm</label>
                    <span>Sidewall: {calcSingleRes.valid ? `${calcSingleRes.data.sidewallMm} mm` : '—'}</span>
                  </div>
                  <input
                    id="slider-width"
                    type="range"
                    min="145"
                    max="375"
                    step="5"
                    value={Number(state.tire1.widthMm) || 265}
                    onChange={(e) => updateState({ tire1: { ...state.tire1, widthMm: Number(e.target.value) } })}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <label htmlFor="slider-aspect">Aspect Ratio: {state.tire1.aspectRatio}%</label>
                    <span>Overall Ø: {calcSingleRes.valid ? `${calcSingleRes.data.diameterMm} mm (${calcSingleRes.data.diameterIn}")` : '—'}</span>
                  </div>
                  <input
                    id="slider-aspect"
                    type="range"
                    min="25"
                    max="85"
                    step="5"
                    value={Number(state.tire1.aspectRatio) || 70}
                    onChange={(e) => updateState({ tire1: { ...state.tire1, aspectRatio: Number(e.target.value) } })}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {calcSingleRes.valid ? (
              <div className="lg:col-span-7 space-y-4">
                {/* Sub-panel selector covering All, Dimensions, Height/Diameter, Circumference/Revs, Profile */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Result View:</span>
                  <div className="flex flex-wrap gap-1" role="group" aria-label="Calculator sub-panels">
                    {[
                      { id: 'all', label: 'Full Breakdown' },
                      { id: 'dimensions', label: 'Width & Rim' },
                      { id: 'height', label: 'Height & Diameter' },
                      { id: 'circumference', label: 'Circumference & Revs' },
                      { id: 'profile', label: 'Sidewall & Profile' },
                    ].map((sv) => (
                      <button
                        key={sv.id}
                        type="button"
                        onClick={() => updateState({ calculatorSubView: sv.id })}
                        className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer whitespace-nowrap ${
                          state.calculatorSubView === sv.id
                            ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        {sv.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono tabular-nums">
                  {(state.calculatorSubView === 'all' || state.calculatorSubView === 'dimensions' || state.calculatorSubView === 'profile') && (
                    <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900">
                      <div className="text-xs font-sans text-slate-500 dark:text-slate-400">Section Width</div>
                      <div className="text-base font-semibold mt-0.5">{calcSingleRes.data.widthMm} mm</div>
                      <div className="text-xs text-slate-500">{calcSingleRes.data.widthIn} in</div>
                    </div>
                  )}
                  {(state.calculatorSubView === 'all' || state.calculatorSubView === 'profile' || state.calculatorSubView === 'height') && (
                    <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900">
                      <div className="text-xs font-sans text-slate-500 dark:text-slate-400">Sidewall Height</div>
                      <div className="text-base font-semibold mt-0.5">{calcSingleRes.data.sidewallMm} mm</div>
                      <div className="text-xs text-slate-500">{calcSingleRes.data.sidewallIn} in ({calcSingleRes.data.aspectRatio}% of width)</div>
                    </div>
                  )}
                  {(state.calculatorSubView === 'all' || state.calculatorSubView === 'dimensions') && (
                    <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900">
                      <div className="text-xs font-sans text-slate-500 dark:text-slate-400">Rim Diameter</div>
                      <div className="text-base font-semibold mt-0.5">{calcSingleRes.data.rimDiameterIn} in</div>
                      <div className="text-xs text-slate-500">{calcSingleRes.data.rimMm} mm</div>
                    </div>
                  )}
                  {(state.calculatorSubView === 'all' || state.calculatorSubView === 'height') && (
                    <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900">
                      <div className="text-xs font-sans text-slate-500 dark:text-slate-400">Overall Diameter</div>
                      <div className="text-base font-semibold text-sky-700 dark:text-sky-400 mt-0.5">{calcSingleRes.data.diameterMm} mm</div>
                      <div className="text-xs text-slate-500">{calcSingleRes.data.diameterIn} in</div>
                    </div>
                  )}
                  {(state.calculatorSubView === 'all' || state.calculatorSubView === 'circumference') && (
                    <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900">
                      <div className="text-xs font-sans text-slate-500 dark:text-slate-400">Circumference</div>
                      <div className="text-base font-semibold mt-0.5">{Math.round(calcSingleRes.data.circumferenceMm)} mm</div>
                      <div className="text-xs text-slate-500">{calcSingleRes.data.circumferenceIn} in ({calcSingleRes.data.circumferenceMm} mm)</div>
                    </div>
                  )}
                  {(state.calculatorSubView === 'all' || state.calculatorSubView === 'circumference') && (
                    <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900">
                      <div className="text-xs font-sans text-slate-500 dark:text-slate-400">Revolutions</div>
                      <div className="text-base font-semibold mt-0.5">{Math.round(calcSingleRes.data.revsPerMile)} revs/mi</div>
                      <div className="text-xs text-slate-500">{Math.round(calcSingleRes.data.revsPerKm)} revs/km</div>
                    </div>
                  )}
                </div>

                {/* Diagram + Step-by-Step "How this was derived" */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3 bg-white dark:bg-slate-900">
                    <div
                      className="text-slate-800 dark:text-slate-200"
                      dangerouslySetInnerHTML={{ __html: renderSingleTireDiagram(calcSingleRes.data) }}
                    />
                  </div>

                  <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-900 space-y-2.5">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      How This Was Derived ({calcSingleRes.data.label})
                    </h3>
                    <ol className="text-xs space-y-2 text-slate-700 dark:text-slate-300 list-decimal list-inside font-mono">
                      <li>
                        <span className="font-sans font-medium">Sidewall height:</span>{' '}
                        {calcSingleRes.data.widthMm} mm × ({calcSingleRes.data.aspectRatio} ÷ 100) ={' '}
                        <strong>{calcSingleRes.data.sidewallMm} mm</strong> ({calcSingleRes.data.sidewallIn} in)
                      </li>
                      <li>
                        <span className="font-sans font-medium">Rim diameter in mm:</span>{' '}
                        {calcSingleRes.data.rimDiameterIn} in × 25.4 ={' '}
                        <strong>{calcSingleRes.data.rimMm} mm</strong>
                      </li>
                      <li>
                        <span className="font-sans font-medium">Overall diameter:</span>{' '}
                        {calcSingleRes.data.rimMm} mm + (2 × {calcSingleRes.data.sidewallMm} mm) ={' '}
                        <strong>{calcSingleRes.data.diameterMm} mm</strong> ({calcSingleRes.data.diameterIn} in)
                      </li>
                      <li>
                        <span className="font-sans font-medium">Circumference:</span>{' '}
                        π × {calcSingleRes.data.diameterMm} mm ={' '}
                        <strong>{calcSingleRes.data.circumferenceMm} mm</strong> ({calcSingleRes.data.circumferenceIn} in)
                      </li>
                      <li>
                        <span className="font-sans font-medium">Revs per mile:</span>{' '}
                        1,609,344 mm/mi ÷ {calcSingleRes.data.circumferenceMm} mm ={' '}
                        <strong>{calcSingleRes.data.revsPerMile} revs/mi</strong>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            ) : (
              <div role="alert" className="lg:col-span-7 p-4 border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 rounded-lg text-sm text-red-700 dark:text-red-300">
                ▲ {calcSingleRes.error.message}
              </div>
            )}
          </div>
        </section>
      )}

      {/* TAB 3: WHEELS (Diameter, width, offset ET, inner/outer position, backspacing, track width) */}
      {state.activeTab === 'wheels' && (
        <section
          role="tabpanel"
          id="panel-wheels"
          aria-labelledby="tab-wheels"
          className="space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
                Wheel Rim Size, Offset (ET) &amp; Backspacing Comparison
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Compare inner suspension-side position, outer fender-side position, bead-seat backspacing, and axle track-width change relative to the hub mounting face.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                updateState({
                  wheel1: { rimDiameterIn: 17, rimWidthIn: 8, offsetMm: 45 },
                  wheel2: { rimDiameterIn: 18, rimWidthIn: 9, offsetMm: 20 },
                })
              }
              className="px-3 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Load 17x8 ET45 vs 18x9 ET20 Example
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WheelInputCard
              title="Wheel 1 (Current / Baseline)"
              wheel={state.wheel1}
              onChange={(w) => updateState({ wheel1: w })}
            />
            <WheelInputCard
              title="Wheel 2 (New / Comparison)"
              wheel={state.wheel2}
              onChange={(w) => updateState({ wheel2: w })}
            />
          </div>

          {wheelCompRes.valid ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-900">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold">Wheel Offset Geometry Diagram</h3>
                  <span className="text-xs font-mono text-slate-500">Geometry only</span>
                </div>
                <div
                  className="text-slate-800 dark:text-slate-200"
                  dangerouslySetInnerHTML={{
                    __html: renderWheelOffsetDiagram(wheelCompRes.data.oldWheel, wheelCompRes.data.newWheel),
                  }}
                />
              </div>

              <div className="lg:col-span-7 border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-900 space-y-4">
                <div className="border-l-4 border-sky-600 pl-3 py-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    Based on the dimensions entered, the outer edge of{' '}
                    <span className="font-mono font-semibold">{wheelCompRes.data.newWheel.label}</span> sits{' '}
                    <span className="font-mono font-semibold text-sky-700 dark:text-sky-400">
                      {Math.abs(wheelCompRes.data.diff.outerEdgeMm)} mm ({Math.abs(wheelCompRes.data.diff.outerEdgeIn)} in){' '}
                      {wheelCompRes.data.diff.outerEdgeMm >= 0 ? 'farther outward' : 'farther inward'}
                    </span>{' '}
                    and the inner rim edge sits{' '}
                    <span className="font-mono font-semibold">
                      {Math.abs(wheelCompRes.data.diff.innerEdgeMm)} mm ({Math.abs(wheelCompRes.data.diff.innerEdgeIn)} in){' '}
                      {wheelCompRes.data.diff.innerEdgeMm >= 0 ? 'closer to the suspension (inboard)' : 'farther from the suspension (outboard)'}
                    </span>.
                  </p>
                </div>

                <table className="w-full text-left border-collapse text-xs sm:text-sm font-mono tabular-nums">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-sans">
                      <th className="py-2 pr-3">Wheel Metric</th>
                      <th className="py-2 px-3">{wheelCompRes.data.oldWheel.label}</th>
                      <th className="py-2 px-3">{wheelCompRes.data.newWheel.label}</th>
                      <th className="py-2 pl-3">Change (New − Base)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    <tr>
                      <td className="py-2 pr-3 font-sans font-medium">Rim Width (Bead Seat)</td>
                      <td className="py-2 px-3">{formatMeasure(wheelCompRes.data.oldWheel.widthMm, wheelCompRes.data.oldWheel.rimWidthIn, state.unitMode)}</td>
                      <td className="py-2 px-3">{formatMeasure(wheelCompRes.data.newWheel.widthMm, wheelCompRes.data.newWheel.rimWidthIn, state.unitMode)}</td>
                      <td className="py-2 pl-3">{formatMeasure(wheelCompRes.data.diff.widthMm, wheelCompRes.data.diff.widthIn, state.unitMode, true)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 font-sans font-medium">Offset (ET from Centerline)</td>
                      <td className="py-2 px-3">{wheelCompRes.data.oldWheel.offsetMm} mm</td>
                      <td className="py-2 px-3">{wheelCompRes.data.newWheel.offsetMm} mm</td>
                      <td className="py-2 pl-3">{wheelCompRes.data.diff.offsetMm > 0 ? `+${wheelCompRes.data.diff.offsetMm}` : wheelCompRes.data.diff.offsetMm} mm</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 font-sans font-medium">
                        Inner Edge from Hub (W/2 + ET)
                        <div className="text-[11px] text-slate-500 font-normal">Bead-seat backspacing</div>
                      </td>
                      <td className="py-2 px-3">{formatMeasure(wheelCompRes.data.oldWheel.innerEdgeMm, wheelCompRes.data.oldWheel.innerEdgeIn, state.unitMode)}</td>
                      <td className="py-2 px-3">{formatMeasure(wheelCompRes.data.newWheel.innerEdgeMm, wheelCompRes.data.newWheel.innerEdgeIn, state.unitMode)}</td>
                      <td className="py-2 pl-3 font-semibold">
                        {formatMeasure(wheelCompRes.data.diff.innerEdgeMm, wheelCompRes.data.diff.innerEdgeIn, state.unitMode, true)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 font-sans font-medium">
                        Outer Edge from Hub (W/2 − ET)
                        <div className="text-[11px] text-slate-500 font-normal">Outboard extension</div>
                      </td>
                      <td className="py-2 px-3">{formatMeasure(wheelCompRes.data.oldWheel.outerEdgeMm, wheelCompRes.data.oldWheel.outerEdgeIn, state.unitMode)}</td>
                      <td className="py-2 px-3">{formatMeasure(wheelCompRes.data.newWheel.outerEdgeMm, wheelCompRes.data.newWheel.outerEdgeIn, state.unitMode)}</td>
                      <td className="py-2 pl-3 font-semibold text-sky-700 dark:text-sky-400">
                        {formatMeasure(wheelCompRes.data.diff.outerEdgeMm, wheelCompRes.data.diff.outerEdgeIn, state.unitMode, true)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 font-sans font-medium">
                        Axle Track Width Change
                        <div className="text-[11px] text-slate-500 font-normal">2 × centerline shift</div>
                      </td>
                      <td className="py-2 px-3 text-slate-400">Baseline</td>
                      <td className="py-2 px-3">Centerline {wheelCompRes.data.diff.centerlineShiftOutboardMm >= 0 ? `+${wheelCompRes.data.diff.centerlineShiftOutboardMm}` : wheelCompRes.data.diff.centerlineShiftOutboardMm} mm/side</td>
                      <td className="py-2 pl-3 font-semibold">
                        {formatMeasure(wheelCompRes.data.diff.trackWidthChangeMm, wheelCompRes.data.diff.trackWidthChangeIn, state.unitMode, true)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div role="alert" className="p-4 border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 rounded-lg text-sm text-red-700 dark:text-red-300">
              ▲ {wheelCompRes.error.message}
            </div>
          )}
        </section>
      )}

      {/* TAB 4: FITMENT (Combine tire + wheel + offset; strict separation of Calculated Geometry vs Vehicle-specific fitment) */}
      {state.activeTab === 'fitment' && (
        <section
          role="tabpanel"
          id="panel-fitment"
          aria-labelledby="tab-fitment"
          className="space-y-6"
        >
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
              Combined Tire + Wheel + Offset Geometry
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Calculates how tire section width, overall diameter, rim width, and wheel offset interact relative to the hub mounting face.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <TireInputCard
                title="Setup 1 Tire (Current)"
                tire={state.tire1}
                onChange={(t) => updateState({ tire1: t, wheel1: { ...state.wheel1, rimDiameterIn: t.rimDiameterIn } })}
              />
              <WheelInputCard
                title="Setup 1 Wheel (Current)"
                wheel={state.wheel1}
                onChange={(w) => updateState({ wheel1: w, tire1: { ...state.tire1, rimDiameterIn: w.rimDiameterIn } })}
              />
            </div>
            <div className="space-y-3">
              <TireInputCard
                title="Setup 2 Tire (New)"
                tire={state.tire2}
                onChange={(t) => updateState({ tire2: t, wheel2: { ...state.wheel2, rimDiameterIn: t.rimDiameterIn } })}
              />
              <WheelInputCard
                title="Setup 2 Wheel (New)"
                wheel={state.wheel2}
                onChange={(w) => updateState({ wheel2: w, tire2: { ...state.tire2, rimDiameterIn: w.rimDiameterIn } })}
              />
            </div>
          </div>

          {fitmentRes.valid ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Panel A: Calculated Geometry (Strictly math) */}
              <div className="lg:col-span-7 border border-slate-200 dark:border-slate-800 rounded-lg p-5 bg-white dark:bg-slate-900 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-mono font-semibold text-sky-700 dark:text-sky-400">
                      PANEL A · MATHEMATICAL OUTPUT
                    </span>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      Calculated Geometry (Relative to Hub Mounting Face)
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Based on the dimensions entered, the new tire sidewall outer edge sits approximately{' '}
                  <strong className="font-mono">
                    {Math.abs(fitmentRes.data.combinedGeometry.tireOuterDiffMm)} mm ({Math.abs(fitmentRes.data.combinedGeometry.tireOuterDiffIn)} in){' '}
                    {fitmentRes.data.combinedGeometry.tireOuterDiffMm >= 0 ? 'farther outward' : 'farther inward'}
                  </strong>
                  , the inner tire sidewall sits approximately{' '}
                  <strong className="font-mono">
                    {Math.abs(fitmentRes.data.combinedGeometry.tireInnerDiffMm)} mm ({Math.abs(fitmentRes.data.combinedGeometry.tireInnerDiffIn)} in){' '}
                    {fitmentRes.data.combinedGeometry.tireInnerDiffMm >= 0 ? 'closer to the suspension side' : 'farther from the suspension side'}
                  </strong>
                  , and overall tire diameter changes by{' '}
                  <strong className="font-mono">
                    {formatMeasure(fitmentRes.data.tires.diff.diameterMm, fitmentRes.data.tires.diff.diameterIn, state.unitMode, true)}
                  </strong>.
                </p>

                <table className="w-full text-left border-collapse text-xs sm:text-sm font-mono tabular-nums">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 font-sans text-slate-600 dark:text-slate-400">
                      <th className="py-2 pr-3">Calculated Dimension</th>
                      <th className="py-2 px-3">Current Setup</th>
                      <th className="py-2 px-3">New Setup</th>
                      <th className="py-2 pl-3">Net Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    <tr>
                      <td className="py-2 pr-3 font-sans font-medium">Overall Tire Diameter</td>
                      <td className="py-2 px-3">{formatMeasure(fitmentRes.data.tires.oldTire.diameterMm, fitmentRes.data.tires.oldTire.diameterIn, state.unitMode)}</td>
                      <td className="py-2 px-3">{formatMeasure(fitmentRes.data.tires.newTire.diameterMm, fitmentRes.data.tires.newTire.diameterIn, state.unitMode)}</td>
                      <td className="py-2 pl-3 font-semibold">{formatMeasure(fitmentRes.data.tires.diff.diameterMm, fitmentRes.data.tires.diff.diameterIn, state.unitMode, true)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 font-sans font-medium">Radius / Axle Height Change</td>
                      <td className="py-2 px-3">{(fitmentRes.data.tires.oldTire.diameterMm / 2).toFixed(1)} mm</td>
                      <td className="py-2 px-3">{(fitmentRes.data.tires.newTire.diameterMm / 2).toFixed(1)} mm</td>
                      <td className="py-2 pl-3 font-semibold">{formatMeasure(fitmentRes.data.tires.diff.axleClearanceMm, fitmentRes.data.tires.diff.axleClearanceIn, state.unitMode, true)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 font-sans font-medium">Wheel Outer Rim Edge vs Hub</td>
                      <td className="py-2 px-3">{fitmentRes.data.wheels.oldWheel.outerEdgeMm} mm</td>
                      <td className="py-2 px-3">{fitmentRes.data.wheels.newWheel.outerEdgeMm} mm</td>
                      <td className="py-2 pl-3">{formatMeasure(fitmentRes.data.wheels.diff.outerEdgeMm, fitmentRes.data.wheels.diff.outerEdgeIn, state.unitMode, true)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 font-sans font-medium">Wheel Inner Rim Edge vs Hub</td>
                      <td className="py-2 px-3">{fitmentRes.data.wheels.oldWheel.innerEdgeMm} mm</td>
                      <td className="py-2 px-3">{fitmentRes.data.wheels.newWheel.innerEdgeMm} mm</td>
                      <td className="py-2 pl-3">{formatMeasure(fitmentRes.data.wheels.diff.innerEdgeMm, fitmentRes.data.wheels.diff.innerEdgeIn, state.unitMode, true)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 font-sans font-medium">Nominal Tire Outer Section Edge</td>
                      <td className="py-2 px-3">{fitmentRes.data.combinedGeometry.oldTireOuterMm} mm</td>
                      <td className="py-2 px-3">{fitmentRes.data.combinedGeometry.newTireOuterMm} mm</td>
                      <td className="py-2 pl-3 font-semibold text-sky-700 dark:text-sky-400">
                        {formatMeasure(fitmentRes.data.combinedGeometry.tireOuterDiffMm, fitmentRes.data.combinedGeometry.tireOuterDiffIn, state.unitMode, true)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 font-sans font-medium">Nominal Tire Inner Section Edge</td>
                      <td className="py-2 px-3">{fitmentRes.data.combinedGeometry.oldTireInnerMm} mm</td>
                      <td className="py-2 px-3">{fitmentRes.data.combinedGeometry.newTireInnerMm} mm</td>
                      <td className="py-2 pl-3 font-semibold">
                        {formatMeasure(fitmentRes.data.combinedGeometry.tireInnerDiffMm, fitmentRes.data.combinedGeometry.tireInnerDiffIn, state.unitMode, true)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Panel B: Vehicle-Specific Fitment (Strictly separate warning & checklist) */}
              <div className="lg:col-span-5 border-2 border-amber-500/70 dark:border-amber-500/60 rounded-lg p-5 bg-amber-50/40 dark:bg-amber-950/20 space-y-3">
                <div>
                  <span className="text-xs font-mono font-semibold text-amber-800 dark:text-amber-300">
                    PANEL B · PHYSICAL CLEARANCE BOUNDARY
                  </span>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                    Vehicle-Specific Fitment (Not Known by Calculator)
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  This calculator computes <strong>nominal geometric changes only</strong>. It cannot know or predict physical clearance on your vehicle. Physical tire and wheel clearance depends on:
                </p>
                <ul className="text-xs sm:text-sm space-y-1.5 text-slate-700 dark:text-slate-300 list-disc list-inside">
                  <li><strong>Vehicle &amp; trim geometry:</strong> wheel-well liner shape, body mounts, pinch welds, and mudflaps.</li>
                  <li><strong>Suspension &amp; steering components:</strong> upper control arms (UCAs), strut perches, tie-rod ends, and sway bars.</li>
                  <li><strong>Brake hardware:</strong> caliper radial and barrel clearance, plus wheel spoke curvature (X-factor).</li>
                  <li><strong>Steering lock &amp; articulation:</strong> full-lock steering angle combined with suspension compression (bump travel).</li>
                  <li><strong>Ride height &amp; alignment:</strong> lift/lowering springs, caster angle, and camber settings.</li>
                  <li><strong>Rim width &amp; tire manufacturer spec:</strong> approved measuring rim width range and actual molded tread/section width (which often varies from the nominal sidewall number).</li>
                </ul>
                <p className="text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-amber-300 dark:border-amber-800/60">
                  Verify all specifications with your vehicle manufacturer, the tire manufacturer&apos;s published specification sheet (measuring rim width range and actual overall diameter), and a qualified tire/wheel installer before purchasing or mounting.
                </p>
              </div>
            </div>
          ) : (
            <div role="alert" className="p-4 border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 rounded-lg text-sm text-red-700 dark:text-red-300">
              ▲ {fitmentRes.error.message}
            </div>
          )}
        </section>
      )}

      {/* TAB 5: GEARING (Axle ratio + old/new diameter -> effective ratio & plain-language explanation) */}
      {state.activeTab === 'gearing' && (
        <section
          role="tabpanel"
          id="panel-gearing"
          aria-labelledby="tab-gearing"
          className="space-y-6"
        >
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
              Effective Axle Ratio &amp; Gearing Calculator
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Calculates how changing tire overall diameter alters your vehicle&apos;s effective final-drive ratio, and what ring-and-pinion ratio would mathematically restore factory mechanical leverage.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-900">
                <label htmlFor="axle-ratio-input" className="block text-sm font-semibold mb-1">
                  Current Differential Axle Ratio (e.g. 3.73, 4.10)
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  Enter your vehicle&apos;s ring-and-pinion axle ratio.
                </p>
                <div className="flex gap-2">
                  <input
                    id="axle-ratio-input"
                    type="number"
                    step="0.01"
                    min="1.5"
                    max="10"
                    value={state.axleRatio}
                    onChange={(e) => updateState({ axleRatio: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm font-mono tabular-nums border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                  />
                  {[3.42, 3.73, 4.10, 4.56].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => updateState({ axleRatio: r })}
                      className="px-2.5 py-1 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 cursor-pointer"
                    >
                      {r.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>

              <TireInputCard
                title="Old / Baseline Tire"
                tire={state.tire1}
                onChange={(t) => updateState({ tire1: t })}
              />
              <TireInputCard
                title="New Tire"
                tire={state.tire2}
                onChange={(t) => updateState({ tire2: t })}
              />
            </div>

            {gearingRes.valid && comparePairRes.valid ? (
              <div className="lg:col-span-7 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono tabular-nums">
                  <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900">
                    <div className="text-xs font-sans text-slate-500">Mechanical Axle Ratio</div>
                    <div className="text-xl font-semibold mt-1">{gearingRes.data.axleRatio}:1</div>
                    <div className="text-xs text-slate-500 mt-0.5">Original Ø: {gearingRes.data.oldDiameterMm} mm</div>
                  </div>
                  <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900">
                    <div className="text-xs font-sans text-slate-500">Effective Axle Ratio</div>
                    <div className="text-xl font-semibold text-sky-700 dark:text-sky-400 mt-1">
                      {gearingRes.data.effectiveRatio}:1
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {gearingRes.data.ratioDiff > 0 ? `+${gearingRes.data.ratioDiff}` : gearingRes.data.ratioDiff} ({formatPct(gearingRes.data.ratioChangePct)})
                    </div>
                  </div>
                  <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900">
                    <div className="text-xs font-sans text-slate-500">Ratio to Restore Stock Feel</div>
                    <div className="text-xl font-semibold mt-1">{gearingRes.data.restoredAxleRatio}:1</div>
                    <div className="text-xs text-slate-500 mt-0.5">New Ø: {gearingRes.data.newDiameterMm} mm</div>
                  </div>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-5 bg-white dark:bg-slate-900 space-y-3 text-sm">
                  <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100">
                    What This Means in Plain Language
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    Formula: <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">effective_ratio = {gearingRes.data.axleRatio} × ({gearingRes.data.oldDiameterMm} ÷ {gearingRes.data.newDiameterMm}) = {gearingRes.data.effectiveRatio}:1</code>
                  </p>
                  {gearingRes.data.effectiveRatio < gearingRes.data.axleRatio ? (
                    <ul className="list-disc list-inside space-y-1.5 text-slate-700 dark:text-slate-300">
                      <li>
                        <strong>Taller overall gearing ({formatPct(gearingRes.data.ratioChangePct)}):</strong> Because the new tire has a larger diameter, it acts as a longer lever arm between the axle shaft and the pavement. Your vehicle behaves as if it had a numerically lower <span className="font-mono">{gearingRes.data.effectiveRatio}:1</span> differential gear with stock tires.
                      </li>
                      <li>
                        <strong>Acceleration &amp; towing feel:</strong> Less mechanical torque multiplication reaches the ground in any given transmission gear. Standing starts, steep grades, and heavy towing can feel more sluggish, and automatic transmissions may downshift out of overdrive more frequently.
                      </li>
                      <li>
                        <strong>Cruising RPM:</strong> At a given true road speed in a locked gear, engine RPM drops by approximately <span className="font-mono">{Math.abs(gearingRes.data.ratioChangePct)}%</span>.
                      </li>
                    </ul>
                  ) : gearingRes.data.effectiveRatio > gearingRes.data.axleRatio ? (
                    <ul className="list-disc list-inside space-y-1.5 text-slate-700 dark:text-slate-300">
                      <li>
                        <strong>Shorter overall gearing ({formatPct(gearingRes.data.ratioChangePct)}):</strong> Because the new tire is smaller in diameter, mechanical leverage increases as if you installed a numerically higher <span className="font-mono">{gearingRes.data.effectiveRatio}:1</span> axle ratio.
                      </li>
                      <li>
                        <strong>Cruising RPM:</strong> Engine RPM increases at a given true road speed by approximately <span className="font-mono">{gearingRes.data.ratioChangePct}%</span>.
                      </li>
                    </ul>
                  ) : (
                    <p className="text-slate-700 dark:text-slate-300">
                      Both tires have identical calculated overall diameters, so effective gearing does not change.
                    </p>
                  )}

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                    <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      What Diameter Ratio Math Cannot Predict
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      This calculation isolates pure diameter leverage. It cannot account for increased rotational mass (unsprung weight of heavier tires and wheels), aerodynamic drag from wider tires or lifted ride height, rolling resistance of aggressive tread compounds, or automatic transmission shift-point programming.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div role="alert" className="lg:col-span-7 p-4 border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 rounded-lg text-sm text-red-700 dark:text-red-300">
                ▲ {gearingRes.error ? gearingRes.error.message : comparePairRes.error?.message}
              </div>
            )}
          </div>
        </section>
      )}

      {/* TAB 6: SPEEDOMETER (Indicated vs approximate actual speed table 20/40/60/70/80 mph & km/h) */}
      {state.activeTab === 'speedometer' && (
        <section
          role="tabpanel"
          id="panel-speedometer"
          aria-labelledby="tab-speedometer"
          className="space-y-6"
        >
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
              Speedometer Indicated vs. Approximate Actual Speed
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Estimates how a change in tire circumference alters road speed per wheel revolution at 20, 40, 60, 70, and 80 mph (and km/h equivalents).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TireInputCard
              title="Calibrated / Baseline Tire Size"
              tire={state.tire1}
              onChange={(t) => updateState({ tire1: t })}
            />
            <TireInputCard
              title="New Installed Tire Size"
              tire={state.tire2}
              onChange={(t) => updateState({ tire2: t })}
            />
          </div>

          {speedRes.valid && comparePairRes.valid ? (
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-5 bg-white dark:bg-slate-900 space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold">
                    Speed Ratio: <span className="font-mono">{speedRes.data.speedRatio}</span> ({formatPct(speedRes.data.pctDiff)})
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Formula: <code className="font-mono">actual_speed = indicated_speed × (new_diameter ÷ old_diameter)</code>
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm font-mono tabular-nums">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 font-sans text-slate-600 dark:text-slate-400">
                      <th className="py-2 pr-3">Indicated Speed (mph)</th>
                      <th className="py-2 px-3">Approx. Actual Speed (mph)</th>
                      <th className="py-2 px-3">Difference (mph)</th>
                      <th className="py-2 px-3">Indicated (km/h)</th>
                      <th className="py-2 pl-3">Approx. Actual (km/h)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {speedRes.data.rows.map((r: any) => (
                      <tr key={r.indicatedMph} className={r.indicatedMph === 60 ? 'bg-sky-50/70 dark:bg-sky-950/30 font-semibold' : ''}>
                        <td className="py-2.5 pr-3">{r.indicatedMph} mph</td>
                        <td className="py-2.5 px-3 text-sky-700 dark:text-sky-400">{r.actualMph} mph</td>
                        <td className="py-2.5 px-3">{r.diffMph > 0 ? `+${r.diffMph}` : r.diffMph} mph</td>
                        <td className="py-2.5 px-3">{r.indicatedKmh} km/h</td>
                        <td className="py-2.5 pl-3">{r.actualKmh} km/h</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-3">
                <strong>Important calibration note:</strong> This table is a theoretical mathematical estimate based on nominal unloaded tire diameters. Real speedometer calibration and error vary: automakers frequently program speedometers to read slightly optimistic from the factory, and actual rolling radius under vehicle weight, inflation pressure, tread wear, and centrifugal expansion at highway speed differs from unloaded geometric diameter.
              </p>
            </div>
          ) : (
            <div role="alert" className="p-4 border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 rounded-lg text-sm text-red-700 dark:text-red-300">
              ▲ {speedRes.error ? speedRes.error.message : comparePairRes.error?.message}
            </div>
          )}
        </section>
      )}

      {/* TAB 7: DECODER (Parse full codes like "285/75R16 116/113S" using strictly verified tables) */}
      {state.activeTab === 'decoder' && (
        <section
          role="tabpanel"
          id="panel-decoder"
          aria-labelledby="tab-decoder"
          className="space-y-6"
        >
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
              Tire Sidewall Code &amp; Service Description Decoder
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Parses metric tire codes with single or dual load indices and speed symbols (such as <code className="font-mono">285/75R16 116/113S</code>). Only explains markings backed by verified tables in this tool.
            </p>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-900">
            <label htmlFor="decoder-input" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Full Tire Sidewall Code
            </label>
            <div className="flex flex-wrap gap-2">
              <input
                id="decoder-input"
                type="text"
                value={state.decoderInput}
                onChange={(e) => updateState({ decoderInput: e.target.value })}
                placeholder="285/75R16 116/113S"
                className="flex-1 min-w-[240px] px-3 py-2 text-sm font-mono border border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-950"
              />
              {[
                '285/75R16 116/113S',
                '265/70R17 115T',
                '225/45R17 91W',
                'LT285/75R16 126/123R E',
              ].map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => updateState({ decoderInput: sample })}
                  className="px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 hover:bg-slate-100 cursor-pointer"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          {decoderRes.valid ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 border border-slate-200 dark:border-slate-800 rounded-lg p-5 bg-white dark:bg-slate-900 space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Verified Decoded Segments for <span className="font-mono text-sky-700 dark:text-sky-400">{decoderRes.data.input}</span>
                </h3>

                <dl className="divide-y divide-slate-200 dark:divide-slate-800 text-xs sm:text-sm">
                  <div className="py-2.5 grid grid-cols-3 gap-2">
                    <dt className="font-medium text-slate-600 dark:text-slate-400">Section Width</dt>
                    <dd className="col-span-2 font-mono">
                      <strong>{decoderRes.data.metrics.widthMm} mm</strong> ({decoderRes.data.metrics.widthIn} in) nominal cross-section width
                    </dd>
                  </div>
                  <div className="py-2.5 grid grid-cols-3 gap-2">
                    <dt className="font-medium text-slate-600 dark:text-slate-400">Aspect Ratio</dt>
                    <dd className="col-span-2 font-mono">
                      <strong>{decoderRes.data.metrics.aspectRatio}%</strong> of width = {decoderRes.data.metrics.sidewallMm} mm ({decoderRes.data.metrics.sidewallIn} in) sidewall height
                    </dd>
                  </div>
                  <div className="py-2.5 grid grid-cols-3 gap-2">
                    <dt className="font-medium text-slate-600 dark:text-slate-400">Construction</dt>
                    <dd className="col-span-2">
                      <span className="font-mono font-semibold">{decoderRes.data.construction.code}</span> — {decoderRes.data.construction.meaning}
                    </dd>
                  </div>
                  <div className="py-2.5 grid grid-cols-3 gap-2">
                    <dt className="font-medium text-slate-600 dark:text-slate-400">Rim Diameter</dt>
                    <dd className="col-span-2 font-mono">
                      <strong>{decoderRes.data.metrics.rimDiameterIn} in</strong> ({decoderRes.data.metrics.rimMm} mm) wheel bead-seat diameter; overall tire Ø = {decoderRes.data.metrics.diameterMm} mm ({decoderRes.data.metrics.diameterIn} in)
                    </dd>
                  </div>
                  <div className="py-2.5 grid grid-cols-3 gap-2">
                    <dt className="font-medium text-slate-600 dark:text-slate-400">Load Index (Single)</dt>
                    <dd className="col-span-2 font-mono">
                      {decoderRes.data.loadSingle ? (
                        decoderRes.data.loadSingle.decoded ? (
                          <span>
                            <strong>{decoderRes.data.loadSingle.index}</strong> → Maximum load rating of{' '}
                            <strong>{decoderRes.data.loadSingle.kg} kg ({decoderRes.data.loadSingle.lbs} lbs)</strong> per tire in single-wheel configuration
                          </span>
                        ) : (
                          <span className="text-amber-700 dark:text-amber-400">{decoderRes.data.loadSingle.reason}</span>
                        )
                      ) : (
                        <span className="text-slate-500 font-sans">No load index entered</span>
                      )}
                    </dd>
                  </div>
                  {decoderRes.data.loadDual && (
                    <div className="py-2.5 grid grid-cols-3 gap-2">
                      <dt className="font-medium text-slate-600 dark:text-slate-400">Load Index (Dual)</dt>
                      <dd className="col-span-2 font-mono">
                        {decoderRes.data.loadDual.decoded ? (
                          <span>
                            <strong>{decoderRes.data.loadDual.index}</strong> → Maximum load rating of{' '}
                            <strong>{decoderRes.data.loadDual.kg} kg ({decoderRes.data.loadDual.lbs} lbs)</strong> per tire in dual-rear-wheel (dually) configuration
                          </span>
                        ) : (
                          <span className="text-amber-700 dark:text-amber-400">{decoderRes.data.loadDual.reason}</span>
                        )}
                      </dd>
                    </div>
                  )}
                  <div className="py-2.5 grid grid-cols-3 gap-2">
                    <dt className="font-medium text-slate-600 dark:text-slate-400">Speed Symbol</dt>
                    <dd className="col-span-2 font-mono">
                      {decoderRes.data.speedRating ? (
                        decoderRes.data.speedRating.decoded ? (
                          <span>
                            <strong>{decoderRes.data.speedRating.symbol}</strong> → Rated up to{' '}
                            <strong>{decoderRes.data.speedRating.mph} mph ({decoderRes.data.speedRating.kmh} km/h)</strong> under manufacturer test conditions
                          </span>
                        ) : (
                          <span className="text-amber-700 dark:text-amber-400">{decoderRes.data.speedRating.reason}</span>
                        )
                      ) : (
                        <span className="text-slate-500 font-sans">No speed symbol entered</span>
                      )}
                    </dd>
                  </div>
                </dl>

                {/* Explicitly list any tokens not decoded here */}
                {decoderRes.data.notDecodedItems.length > 0 && (
                  <div className="p-3.5 border border-amber-300 dark:border-amber-800 rounded bg-amber-50/50 dark:bg-amber-950/30 space-y-1.5">
                    <h4 className="text-xs font-semibold text-amber-900 dark:text-amber-300">
                      Markings Not Decoded Here
                    </h4>
                    <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-300 list-disc list-inside">
                      {decoderRes.data.notDecodedItems.map((item: any, idx: number) => (
                        <li key={idx}>
                          <strong className="font-mono">{item.token}</strong> ({item.category}): {item.reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 space-y-4">
                {/* Mandatory Tire Pressure Note */}
                <div className="border-l-4 border-amber-600 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-r-lg space-y-2">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Tire Pressure Note: Why We Do Not Calculate PSI
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    This tool <strong>does not calculate recommended tire inflation pressure</strong>. Cold tire pressure depends on your vehicle&apos;s front and rear gross axle weight ratings (GAWR), load index, tire construction class, and speed conditions.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    For factory tire sizes, always use the <strong>driver&apos;s door-jamb tire placard</strong> and owner&apos;s manual—not the maximum pressure stamped on the tire sidewall. When changing tire size or load construction, consult the tire manufacturer&apos;s load-and-inflation tables and a qualified tire professional.
                  </p>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-900 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    Scope of Verified Tables
                  </h4>
                  <p>
                    This decoder includes verified tables for metric section width, aspect ratio, Radial (<code className="font-mono">R</code>) construction, rim diameter, Standard Load Indices <code className="font-mono">60–130</code>, and Speed Symbols <code className="font-mono">L–Y</code>. Prefixes (<code className="font-mono">LT</code>, <code className="font-mono">P</code>, <code className="font-mono">ST</code>), ply/load-range suffixes (<code className="font-mono">XL</code>, <code className="font-mono">C/D/E</code>), and DOT serial dates are intentionally flagged as not decoded here rather than guessed.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div role="alert" className="p-4 border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 rounded-lg text-sm text-red-700 dark:text-red-300">
              ▲ {decoderRes.error.message}
            </div>
          )}
        </section>
      )}

      {/* TAB 8: VISUALIZER (Proportional interactive two-setup overlay labelled "Geometry only") */}
      {state.activeTab === 'visualizer' && (
        <section
          role="tabpanel"
          id="panel-visualizer"
          aria-labelledby="tab-visualizer"
          className="space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
                Interactive Two-Setup Proportional Geometry Visualizer
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Adjust tire width, aspect ratio, rim diameter, wheel width, and wheel offset (ET) to inspect proportional geometry overlays.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300">
              GEOMETRY ONLY · NO VEHICLE CLEARANCE IMPLIED
            </span>
          </div>

          {fitmentRes.valid ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left 7 cols: Large Proportional SVG Canvas + Accessible Data Table */}
              <div className="lg:col-span-7 border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-900 space-y-4">
                <div
                  className="text-slate-800 dark:text-slate-200"
                  dangerouslySetInnerHTML={{
                    __html: renderCombinedOverlayVisualizer(fitmentRes.data),
                  }}
                />

                {/* Text alternative / numeric summary table for accessibility */}
                <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Proportional Overlay Numeric Table (Geometry Only)
                  </h3>
                  <table className="w-full text-left border-collapse text-xs font-mono tabular-nums">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 font-sans text-slate-500">
                        <th className="py-1.5 pr-2">Parameter</th>
                        <th className="py-1.5 px-2">Baseline (Dashed)</th>
                        <th className="py-1.5 px-2">Comparison (Solid Blue)</th>
                        <th className="py-1.5 pl-2">Delta</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      <tr>
                        <td className="py-1.5 pr-2 font-sans">Tire + Wheel Spec</td>
                        <td className="py-1.5 px-2">{fitmentRes.data.tires.oldTire.label} on {fitmentRes.data.wheels.oldWheel.label}</td>
                        <td className="py-1.5 px-2">{fitmentRes.data.tires.newTire.label} on {fitmentRes.data.wheels.newWheel.label}</td>
                        <td className="py-1.5 pl-2">—</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-2 font-sans">Overall Diameter</td>
                        <td className="py-1.5 px-2">{fitmentRes.data.tires.oldTire.diameterMm} mm ({fitmentRes.data.tires.oldTire.diameterIn}&quot;)</td>
                        <td className="py-1.5 px-2">{fitmentRes.data.tires.newTire.diameterMm} mm ({fitmentRes.data.tires.newTire.diameterIn}&quot;)</td>
                        <td className="py-1.5 pl-2">{formatMeasure(fitmentRes.data.tires.diff.diameterMm, fitmentRes.data.tires.diff.diameterIn, state.unitMode, true)}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-2 font-sans">Tire Outer Edge vs Hub</td>
                        <td className="py-1.5 px-2">{fitmentRes.data.combinedGeometry.oldTireOuterMm} mm</td>
                        <td className="py-1.5 px-2">{fitmentRes.data.combinedGeometry.newTireOuterMm} mm</td>
                        <td className="py-1.5 pl-2">{formatMeasure(fitmentRes.data.combinedGeometry.tireOuterDiffMm, fitmentRes.data.combinedGeometry.tireOuterDiffIn, state.unitMode, true)}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-2 font-sans">Tire Inner Edge vs Hub</td>
                        <td className="py-1.5 px-2">{fitmentRes.data.combinedGeometry.oldTireInnerMm} mm</td>
                        <td className="py-1.5 px-2">{fitmentRes.data.combinedGeometry.newTireInnerMm} mm</td>
                        <td className="py-1.5 pl-2">{formatMeasure(fitmentRes.data.combinedGeometry.tireInnerDiffMm, fitmentRes.data.combinedGeometry.tireInnerDiffIn, state.unitMode, true)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right 5 cols: Interactive Sliders for Setup 1 & Setup 2 */}
              <div className="lg:col-span-5 space-y-4">
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-900 space-y-3">
                  <h3 className="text-sm font-semibold">
                    Baseline Setup Controls (Dashed Outline)
                  </h3>
                  <div className="space-y-2 text-xs font-mono">
                    <div>
                      <label className="flex justify-between">
                        <span>Tire 1 Width:</span>
                        <strong>{state.tire1.widthMm} mm</strong>
                      </label>
                      <input
                        type="range"
                        min="165"
                        max="355"
                        step="10"
                        value={Number(state.tire1.widthMm) || 265}
                        onChange={(e) => updateState({ tire1: { ...state.tire1, widthMm: Number(e.target.value) } })}
                        className="w-full accent-slate-600 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="flex justify-between">
                        <span>Tire 1 Aspect:</span>
                        <strong>{state.tire1.aspectRatio}%</strong>
                      </label>
                      <input
                        type="range"
                        min="30"
                        max="85"
                        step="5"
                        value={Number(state.tire1.aspectRatio) || 70}
                        onChange={(e) => updateState({ tire1: { ...state.tire1, aspectRatio: Number(e.target.value) } })}
                        className="w-full accent-slate-600 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="flex justify-between">
                        <span>Rim 1 Diameter &amp; Width:</span>
                        <strong>{state.wheel1.rimDiameterIn}&quot; × {state.wheel1.rimWidthIn}&quot;</strong>
                      </label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <input
                          type="range"
                          min="14"
                          max="24"
                          step="1"
                          aria-label="Baseline rim diameter"
                          value={Number(state.wheel1.rimDiameterIn) || 17}
                          onChange={(e) => {
                            const d = Number(e.target.value);
                            updateState({
                              tire1: { ...state.tire1, rimDiameterIn: d },
                              wheel1: { ...state.wheel1, rimDiameterIn: d },
                            });
                          }}
                          className="w-full accent-slate-600 cursor-pointer"
                        />
                        <input
                          type="range"
                          min="6"
                          max="12"
                          step="0.5"
                          aria-label="Baseline wheel width"
                          value={Number(state.wheel1.rimWidthIn) || 7.5}
                          onChange={(e) => updateState({ wheel1: { ...state.wheel1, rimWidthIn: Number(e.target.value) } })}
                          className="w-full accent-slate-600 cursor-pointer"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="flex justify-between">
                        <span>Wheel 1 Offset (ET):</span>
                        <strong>{state.wheel1.offsetMm} mm</strong>
                      </label>
                      <input
                        type="range"
                        min="-45"
                        max="65"
                        step="1"
                        value={Number(state.wheel1.offsetMm) || 0}
                        onChange={(e) => updateState({ wheel1: { ...state.wheel1, offsetMm: Number(e.target.value) } })}
                        className="w-full accent-slate-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="border border-sky-600/40 dark:border-sky-500/40 rounded-lg p-4 bg-white dark:bg-slate-900 space-y-3">
                  <h3 className="text-sm font-semibold text-sky-700 dark:text-sky-400">
                    New Setup Controls (Solid Blue Overlay)
                  </h3>
                  <div className="space-y-2 text-xs font-mono">
                    <div>
                      <label className="flex justify-between">
                        <span>Tire 2 Width:</span>
                        <strong>{state.tire2.widthMm} mm</strong>
                      </label>
                      <input
                        type="range"
                        min="165"
                        max="355"
                        step="10"
                        value={Number(state.tire2.widthMm) || 285}
                        onChange={(e) => updateState({ tire2: { ...state.tire2, widthMm: Number(e.target.value) } })}
                        className="w-full accent-sky-600 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="flex justify-between">
                        <span>Tire 2 Aspect:</span>
                        <strong>{state.tire2.aspectRatio}%</strong>
                      </label>
                      <input
                        type="range"
                        min="30"
                        max="85"
                        step="5"
                        value={Number(state.tire2.aspectRatio) || 75}
                        onChange={(e) => updateState({ tire2: { ...state.tire2, aspectRatio: Number(e.target.value) } })}
                        className="w-full accent-sky-600 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="flex justify-between">
                        <span>Rim 2 Diameter &amp; Width:</span>
                        <strong>{state.wheel2.rimDiameterIn}&quot; × {state.wheel2.rimWidthIn}&quot;</strong>
                      </label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <input
                          type="range"
                          min="14"
                          max="24"
                          step="1"
                          aria-label="New rim diameter"
                          value={Number(state.wheel2.rimDiameterIn) || 17}
                          onChange={(e) => {
                            const d = Number(e.target.value);
                            updateState({
                              tire2: { ...state.tire2, rimDiameterIn: d },
                              wheel2: { ...state.wheel2, rimDiameterIn: d },
                            });
                          }}
                          className="w-full accent-sky-600 cursor-pointer"
                        />
                        <input
                          type="range"
                          min="6"
                          max="12"
                          step="0.5"
                          aria-label="New wheel width"
                          value={Number(state.wheel2.rimWidthIn) || 8.5}
                          onChange={(e) => updateState({ wheel2: { ...state.wheel2, rimWidthIn: Number(e.target.value) } })}
                          className="w-full accent-sky-600 cursor-pointer"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="flex justify-between">
                        <span>Wheel 2 Offset (ET):</span>
                        <strong>{state.wheel2.offsetMm} mm</strong>
                      </label>
                      <input
                        type="range"
                        min="-45"
                        max="65"
                        step="1"
                        value={Number(state.wheel2.offsetMm) || 0}
                        onChange={(e) => updateState({ wheel2: { ...state.wheel2, offsetMm: Number(e.target.value) } })}
                        className="w-full accent-sky-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div role="alert" className="p-4 border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 rounded-lg text-sm text-red-700 dark:text-red-300">
              ▲ {fitmentRes.error.message}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

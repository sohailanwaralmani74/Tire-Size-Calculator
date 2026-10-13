import React, { useState, useEffect, useRef } from 'react';
import {
  CALCULATOR_CATEGORIES,
  ALL_CALCULATORS,
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
} from '../calc/buildingMath.js';

interface BuildingWorkspaceProps {
  initialCalcId?: string;
}

export default function BuildingWorkspace({ initialCalcId }: BuildingWorkspaceProps) {
  // Determine active calculator from initial prop, URL search param, or pathname
  const [activeCalcId, setActiveCalcId] = useState<string>(() => {
    if (initialCalcId && ALL_CALCULATORS.some((c) => c.id === initialCalcId)) {
      return initialCalcId;
    }
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const paramCalc = urlParams.get('calc');
      if (paramCalc && ALL_CALCULATORS.some((c) => c.id === paramCalc)) {
        return paramCalc;
      }
      const path = window.location.pathname.replace(/^\//, '');
      const matched = ALL_CALCULATORS.find((c) => c.slug === path);
      if (matched) return matched.id;
    }
    return 'concrete';
  });

  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const [copiedText, setCopiedText] = useState('');
  const [themeDark, setThemeDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = window.localStorage.getItem('wanjaaro-theme');
        if (stored === 'dark') return true;
        if (stored === 'light') return false;
      } catch {}
    }
    return false;
  });

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (themeDark) {
      root.classList.add('dark');
      body?.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      body?.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    try {
      window.localStorage.setItem('wanjaaro-theme', themeDark ? 'dark' : 'light');
    } catch {}
  }, [themeDark]);

  // Synchronize browser history / URL when changing active calculator
  const switchCalculator = (calcId: string) => {
    setActiveCalcId(calcId);
    setHoveredCategory(null);
    setMobileCategoryOpen(false);
    if (typeof window !== 'undefined' && window.history?.pushState) {
      const calcObj = ALL_CALCULATORS.find((c) => c.id === calcId);
      if (calcObj) {
        // Keep smooth experience without page refresh
        const targetUrl = `./${calcObj.slug}`;
        window.history.pushState({ calcId }, '', targetUrl);
      }
    }
  };

  // Listen to popstate (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, '');
      const matched = ALL_CALCULATORS.find((c) => c.slug === path);
      if (matched) {
        setActiveCalcId(matched.id);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const currentCalc = ALL_CALCULATORS.find((c) => c.id === activeCalcId) || ALL_CALCULATORS[0];
  const currentCategory = CALCULATOR_CATEGORIES.find((cat) => cat.id === currentCalc.categoryId) || CALCULATOR_CATEGORIES[0];

  // ------------------------------------------------------------------
  // CALCULATOR FORM STATES
  // ------------------------------------------------------------------
  // 1. Concrete
  const [concreteState, setConcreteState] = useState<{
    shape: 'slab' | 'circular' | 'footing' | 'post-holes';
    lengthFt: number;
    widthFt: number;
    thicknessIn: number;
    diameterFt: number;
    depthFt: number;
    quantity: number;
    wastePct: number;
    pricePerCuYd: number;
    bagPrice80lb: number;
    rebarSpacingIn: number;
  }>({
    shape: 'slab',
    lengthFt: 20,
    widthFt: 10,
    thicknessIn: 4,
    diameterFt: 12,
    depthFt: 3,
    quantity: 1,
    wastePct: 10,
    pricePerCuYd: 145,
    bagPrice80lb: 6.50,
    rebarSpacingIn: 18,
  });

  // 2. Brick & Mortar
  const [brickState, setBrickState] = useState({
    wallLengthFt: 24,
    wallHeightFt: 8,
    openingsSqFt: 20,
    brickType: 'modular' as const,
    wytheCount: 1 as const,
    mortarJointIn: 0.375,
    wastePct: 5,
    brickUnitPrice: 0.85,
    mortarBagPrice: 12.50,
  });

  // 3. CMU Block
  const [cmuState, setCmuState] = useState({
    wallLengthFt: 30,
    wallHeightFt: 8,
    openingsSqFt: 32,
    blockSize: '8x8x16' as const,
    groutFillSpacingIn: 32,
    wastePct: 5,
    blockUnitPrice: 2.45,
    mortarBagPrice: 13.00,
  });

  // 4. Framing
  const [framingState, setFramingState] = useState({
    wallLengthFt: 32,
    wallHeightFt: 8,
    studSpacingIn: 16 as 16 | 24,
    cornerCount: 4,
    doorCount: 1,
    windowCount: 2,
    wastePct: 10,
    studPrice: 5.85,
    platePrice16ft: 14.50,
  });

  // 5. Sheathing
  const [sheathingState, setSheathingState] = useState({
    areaSqFt: 640,
    sheetSize: '4x8' as const,
    wastePct: 10,
    pricePerSheet: 22.50,
  });

  // 6. Drywall
  const [drywallState, setDrywallState] = useState({
    roomLengthFt: 16,
    roomWidthFt: 14,
    wallHeightFt: 9,
    includeCeiling: true,
    openingsSqFt: 40,
    sheetSize: '4x8' as const,
    wastePct: 10,
    sheetPrice: 15.50,
    bucketCompoundPrice: 18.25,
  });

  // 7. Paint
  const [paintState, setPaintState] = useState({
    surfaceAreaSqFt: 800,
    coats: 2,
    includePrimer: true,
    coveragePerGal: 350,
    paintPricePerGal: 48,
    primerPricePerGal: 28,
  });

  // 8. Roofing
  const [roofingState, setRoofingState] = useState({
    footprintAreaSqFt: 1800,
    pitchRiseOver12: 6,
    ridgeLengthFt: 45,
    eaveLengthFt: 130,
    shingleBundlePrice: 38,
    wastePct: 12,
  });

  // 9. Tile
  const [tileState, setTileState] = useState({
    areaSqFt: 200,
    tileLengthIn: 12,
    tileWidthIn: 24,
    tileThicknessIn: 0.375,
    jointWidthIn: 0.125,
    sqFtPerBox: 16,
    wastePct: 10,
    boxPrice: 42,
    groutBagPrice: 22,
  });

  // 10. Construction Cost
  const [costState, setCostState] = useState({
    projectType: 'addition' as const,
    squareFootage: 400,
    materialBaseCost: 16500,
    laborRatePerSqFt: 38,
    equipmentPermitCost: 1500,
    contractorMarkupPct: 15,
    contingencyPct: 10,
  });

  // Calculate results
  const concreteRes = calculateConcrete(concreteState);
  const brickRes = calculateBrick(brickState);
  const cmuRes = calculateCmu(cmuState);
  const framingRes = calculateFraming(framingState);
  const sheathingRes = calculateSheathing(sheathingState);
  const drywallRes = calculateDrywall(drywallState);
  const paintRes = calculatePaint(paintState);
  const roofingRes = calculateRoofing(roofingState);
  const tileRes = calculateTile(tileState);
  const costRes = calculateConstructionCost(costState);

  // Copy results helper
  const copyTakeoff = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopiedText('✓ Copied Material Takeoff');
        setTimeout(() => setCopiedText(''), 2500);
        return;
      }
    } catch {}
    setCopiedText('Copy failed');
    setTimeout(() => setCopiedText(''), 2500);
  };

  // Close mega menu on outside click or escape
  const navRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setHoveredCategory(null);
        setMobileCategoryOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen">
      {/* ============================================================== */}
      {/* 1. TOP HEADER & DESKTOP MEGA MENU NAVIGATION */}
      {/* ============================================================== */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-50 no-print">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Brand Logo & Tagline */}
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="./"
                onClick={(e) => {
                  e.preventDefault();
                  switchCalculator('concrete');
                }}
                className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 hover:opacity-90"
              >
                <span className="w-8 h-8 rounded-lg bg-sky-700 text-white flex items-center justify-center font-mono font-bold text-sm">
                  W
                </span>
                <span>Wanjaaro</span>
              </a>
              <span className="hidden sm:inline text-xs text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-slate-800 pl-3">
                Building Material &amp; Cost Calculators
              </span>
            </div>

            {/* Desktop Navigation with Hover Mega Menu */}
            <nav
              ref={navRef}
              aria-label="Calculator Categories Mega Menu"
              className="hidden lg:flex items-center gap-1 text-sm font-medium relative h-full"
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {CALCULATOR_CATEGORIES.map((cat) => {
                const isHovered = hoveredCategory === cat.id;
                const isCurrentCategory = currentCategory.id === cat.id;
                return (
                  <div
                    key={cat.id}
                    className="h-full flex items-center"
                    onMouseEnter={() => setHoveredCategory(cat.id)}
                  >
                    <button
                      type="button"
                      aria-expanded={isHovered}
                      aria-haspopup="true"
                      onClick={() => switchCalculator(cat.calculators[0].id)}
                      className={`px-3 py-2 rounded-md transition-colors text-xs font-semibold cursor-pointer flex items-center gap-1 ${
                        isCurrentCategory
                          ? 'text-sky-700 dark:text-sky-400 bg-sky-50/70 dark:bg-sky-950/30'
                          : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <svg
                        className={`w-3.5 h-3.5 transition-transform duration-150 ${isHovered ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Mega Menu Dropdown */}
                    {isHovered && (
                      <div
                        className="absolute top-full left-0 w-[640px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-5 z-50 animate-in fade-in slide-in-from-top-1"
                        onMouseEnter={() => setHoveredCategory(cat.id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      >
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                              Category: {cat.name}
                            </span>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{cat.description}</p>
                          </div>
                          <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                            {cat.calculators.length} Calculators
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5">
                          {cat.calculators.map((calc) => {
                            const isSelected = activeCalcId === calc.id;
                            return (
                              <button
                                key={calc.id}
                                type="button"
                                onClick={() => switchCalculator(calc.id)}
                                className={`text-left p-3 rounded-lg border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                                  isSelected
                                    ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800'
                                    : 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300'
                                }`}
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                      {calc.name}
                                    </span>
                                    {isSelected && (
                                      <span className="text-[10px] font-mono text-sky-700 dark:text-sky-400 font-bold">
                                        ● ACTIVE
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {calc.summary}
                                  </p>
                                </div>
                                <span className="shrink-0 text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded">
                                  {calc.badge}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Quick Actions (Dark mode toggle, Print, Share) */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => window.print()}
                className="hidden sm:inline-flex items-center px-3 py-1.5 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                title="Print material estimate"
              >
                🖨 Print Takeoff
              </button>
              <button
                type="button"
                onClick={() => setThemeDark(!themeDark)}
                aria-label="Toggle color theme"
                className="px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                {themeDark ? '☀ Light' : '☾ Dark'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. MAIN LAYOUT: 75% CONTENT + 25% GLOBAL RIGHT AD ON DESKTOP */}
      {/* ============================================================== */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6 lg:flex lg:items-start lg:gap-8">
        <main className="w-full lg:w-[75%] min-w-0 space-y-8">
          {/* BREADCRUMB: WITH CATEGORY PROMINENTLY DISPLAYED ON MOBILE */}
          <nav aria-label="Breadcrumb navigation" className="text-xs text-slate-600 dark:text-slate-400 no-print">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1.5 font-medium">
              <li>
                <a
                  href="./"
                  onClick={(e) => {
                    e.preventDefault();
                    switchCalculator('concrete');
                  }}
                  className="hover:underline text-slate-900 dark:text-slate-200"
                >
                  Wanjaaro
                </a>
              </li>
              <li aria-hidden="true" className="text-slate-400">/</li>

              {/* Mobile Category Dropdown / Breadcrumb Segment */}
              <li className="relative">
                <button
                  type="button"
                  onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
                  className="font-semibold text-sky-700 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded"
                  title="Click to switch category on mobile"
                >
                  <span>{currentCategory.name}</span>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Mobile Category Switcher Modal/Dropdown */}
                {mobileCategoryOpen && (
                  <div className="absolute left-0 top-full mt-1 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg p-2 z-50">
                    <div className="text-[10px] font-mono uppercase text-slate-400 px-2 py-1">
                      Select Category
                    </div>
                    {CALCULATOR_CATEGORIES.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          switchCalculator(c.calculators[0].id);
                          setMobileCategoryOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 text-xs rounded transition-colors cursor-pointer flex items-center justify-between ${
                          c.id === currentCategory.id
                            ? 'bg-sky-100 dark:bg-sky-900 text-sky-900 dark:text-white font-bold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>{c.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">({c.calculators.length})</span>
                      </button>
                    ))}
                  </div>
                )}
              </li>

              <li aria-hidden="true" className="text-slate-400">/</li>
              <li className="text-slate-800 dark:text-slate-300 truncate max-w-[200px] sm:max-w-none">
                {currentCalc.name}
              </li>
            </ol>
          </nav>

          {/* PAGE TITLE & META HEADER */}
          <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {currentCalc.name}
              </h1>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Last modified: <time dateTime={currentCalc.lastmod}>{currentCalc.lastmod}</time>
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              {currentCalc.summary} Instant deterministic contractor takeoff with customizable dimensions, waste factor, and cost estimates.
            </p>
          </div>

          {/* QUICK CALCULATOR TABS BAR (Horizontal switcher between all tools in current category) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg no-print">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 px-2">
              {currentCategory.shortName}:
            </span>
            {currentCategory.calculators.map((calc) => {
              const active = calc.id === activeCalcId;
              return (
                <button
                  key={calc.id}
                  type="button"
                  onClick={() => switchCalculator(calc.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    active
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {calc.shortTitle}
                </button>
              );
            })}
          </div>

          {/* ============================================================== */}
          {/* 3. CALCULATOR WORKSPACES */}
          {/* ============================================================== */}

          {/* 1. CONCRETE SLAB & FOOTING CALCULATOR */}
          {activeCalcId === 'concrete' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Inputs */}
                <div className="md:col-span-5 space-y-4 border border-slate-200 dark:border-slate-800 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
                    Dimensions &amp; Pour Configuration
                  </h2>

                  {/* Shape Selector */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Pour Structure
                    </label>
                    <select
                      value={concreteState.shape}
                      onChange={(e) => setConcreteState({ ...concreteState, shape: e.target.value as any })}
                      className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                    >
                      <option value="slab">Rectangular Slab / Patio / Driveway</option>
                      <option value="circular">Circular Slab / Round Tank Pad</option>
                      <option value="footing">Continuous Wall Footing</option>
                      <option value="post-holes">Sonotube / Post Holes</option>
                    </select>
                  </div>

                  {/* Length & Width or Diameter */}
                  {concreteState.shape !== 'circular' && concreteState.shape !== 'post-holes' ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          Length (feet)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="1"
                          value={concreteState.lengthFt}
                          onChange={(e) => setConcreteState({ ...concreteState, lengthFt: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          Width (feet)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="1"
                          value={concreteState.widthFt}
                          onChange={(e) => setConcreteState({ ...concreteState, widthFt: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                        />
                      </div>
                    </div>
                  ) : concreteState.shape === 'circular' ? (
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Diameter (feet)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="1"
                        value={concreteState.diameterFt}
                        onChange={(e) => setConcreteState({ ...concreteState, diameterFt: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          Diameter (inches)
                        </label>
                        <input
                          type="number"
                          step="1"
                          min="4"
                          value={concreteState.thicknessIn}
                          onChange={(e) => setConcreteState({ ...concreteState, thicknessIn: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          Hole Depth (feet)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="1"
                          value={concreteState.depthFt}
                          onChange={(e) => setConcreteState({ ...concreteState, depthFt: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                        />
                      </div>
                    </div>
                  )}

                  {/* Thickness / Depth */}
                  {concreteState.shape !== 'post-holes' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          Thickness (inches)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="1"
                          value={concreteState.thicknessIn}
                          onChange={(e) => setConcreteState({ ...concreteState, thicknessIn: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          Waste Margin (%)
                        </label>
                        <input
                          type="number"
                          step="1"
                          min="0"
                          max="30"
                          value={concreteState.wastePct}
                          onChange={(e) => setConcreteState({ ...concreteState, wastePct: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                        />
                      </div>
                    </div>
                  )}

                  {/* Rebar Grid Spacing */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Rebar Grid Spacing (inches on-center)
                    </label>
                    <select
                      value={concreteState.rebarSpacingIn}
                      onChange={(e) => setConcreteState({ ...concreteState, rebarSpacingIn: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                    >
                      <option value="12">12 inches o.c. (Heavy duty / Driveway)</option>
                      <option value="18">18 inches o.c. (Standard patio / slab)</option>
                      <option value="24">24 inches o.c. (Light footings)</option>
                    </select>
                  </div>
                </div>

                {/* Outputs */}
                <div className="md:col-span-7 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-sky-50/50 dark:bg-sky-950/20">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Total Volume</span>
                      <div className="text-xl font-bold font-mono text-sky-800 dark:text-sky-300 mt-1">
                        {concreteRes.totalCuYd} yd³
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        ({concreteRes.totalCuFt} ft³ / {concreteRes.totalCuM} m³)
                      </span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">80 lb Premix Bags</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        {concreteRes.bags80} bags
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">~0.60 ft³ yield / bag</span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">60 lb Premix Bags</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        {concreteRes.bags60} bags
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">~0.45 ft³ yield / bag</span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Rebar Sticks (20 ft)</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        {concreteRes.rebarSticks20ft} sticks
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {concreteRes.rebarLinearFt} linear ft grid
                      </span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Bulk Ready-Mix Cost</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        ${concreteRes.bulkReadyMixCost}
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">@ $145/cu yd</span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Bag Mix Cost (80 lb)</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        ${concreteRes.bagMixCost}
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">@ $6.50/bag</span>
                    </div>
                  </div>

                  <div className="p-3.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50/70 dark:bg-slate-900/60 flex items-center justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      Waste volume included: <strong>{concreteRes.wasteVolumeCuYd} yd³</strong> (+{concreteState.wastePct}%)
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyTakeoff(
                          `Concrete Takeoff:\nVolume: ${concreteRes.totalCuYd} cu yds (${concreteRes.totalCuFt} cu ft)\n80 lb Bags: ${concreteRes.bags80}\n60 lb Bags: ${concreteRes.bags60}\nRebar: ${concreteRes.rebarSticks20ft} sticks (20ft) / ${concreteRes.rebarLinearFt} lin ft\nEst. Ready-Mix: $${concreteRes.bulkReadyMixCost}`
                        )
                      }
                      className="px-3 py-1 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded hover:bg-slate-100 cursor-pointer"
                    >
                      {copiedText || 'Copy Takeoff'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. BRICK & MORTAR CALCULATOR */}
          {activeCalcId === 'brick-mortar' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-5 space-y-4 border border-slate-200 dark:border-slate-800 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
                    Wall &amp; Brick Specifications
                  </h2>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Wall Length (ft)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={brickState.wallLengthFt}
                        onChange={(e) => setBrickState({ ...brickState, wallLengthFt: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Wall Height (ft)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={brickState.wallHeightFt}
                        onChange={(e) => setBrickState({ ...brickState, wallHeightFt: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Doors &amp; Windows Deductions (sq ft)
                    </label>
                    <input
                      type="number"
                      value={brickState.openingsSqFt}
                      onChange={(e) => setBrickState({ ...brickState, openingsSqFt: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Brick Size
                    </label>
                    <select
                      value={brickState.brickType}
                      onChange={(e) => setBrickState({ ...brickState, brickType: e.target.value as any })}
                      className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                    >
                      <option value="modular">Modular (7-1/2" × 2-1/4" × 3-1/2")</option>
                      <option value="king">King Size (9-5/8" × 2-5/8" × 2-5/8")</option>
                      <option value="queen">Queen Size (7-5/8" × 2-3/4" × 2-3/4")</option>
                      <option value="utility">Utility (11-5/8" × 3-5/8" × 3-5/8")</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Mortar Joint
                      </label>
                      <select
                        value={brickState.mortarJointIn}
                        onChange={(e) => setBrickState({ ...brickState, mortarJointIn: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      >
                        <option value="0.375">3/8" (Standard)</option>
                        <option value="0.5">1/2" (Thick)</option>
                        <option value="0.25">1/4" (Thin)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Waste (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={brickState.wastePct}
                        onChange={(e) => setBrickState({ ...brickState, wastePct: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-7 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-sky-50/50 dark:bg-sky-950/20">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Total Bricks</span>
                      <div className="text-xl font-bold font-mono text-sky-800 dark:text-sky-300 mt-1">
                        {brickRes.totalBricks.toLocaleString()}
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        ({brickRes.bricksPerSqFt} bricks/sq ft)
                      </span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Mortar (80 lb bags)</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        {brickRes.mortarBags} bags
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">Type N / S</span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Masonry Sand</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        {brickRes.sandTons} tons
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">Fine mortar sand</span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Wall Ties</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        {brickRes.wallTies} ties
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">Corrugated anchors</span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Net Wall Area</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        {brickRes.netAreaSqFt} ft²
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">Gross: {brickRes.grossAreaSqFt} ft²</span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Estimated Materials</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        ${brickRes.totalCost}
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">Bricks + Mortar</span>
                    </div>
                  </div>

                  <div className="p-3.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50/70 dark:bg-slate-900/60 flex items-center justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      Raw bricks: {brickRes.rawBricks} + {brickState.wastePct}% waste allowance
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyTakeoff(
                          `Brick & Mortar Takeoff:\nNet Wall Area: ${brickRes.netAreaSqFt} sq ft\nTotal Bricks: ${brickRes.totalBricks}\nMortar Bags (80lb): ${brickRes.mortarBags}\nSand: ${brickRes.sandTons} tons\nWall Ties: ${brickRes.wallTies}\nEst. Cost: $${brickRes.totalCost}`
                        )
                      }
                      className="px-3 py-1 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded hover:bg-slate-100 cursor-pointer"
                    >
                      {copiedText || 'Copy Takeoff'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. CONCRETE BLOCK (CMU) CALCULATOR */}
          {activeCalcId === 'block-cmu' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-5 space-y-4 border border-slate-200 dark:border-slate-800 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
                    CMU Wall Geometry
                  </h2>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Wall Length (ft)
                      </label>
                      <input
                        type="number"
                        value={cmuState.wallLengthFt}
                        onChange={(e) => setCmuState({ ...cmuState, wallLengthFt: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Wall Height (ft)
                      </label>
                      <input
                        type="number"
                        value={cmuState.wallHeightFt}
                        onChange={(e) => setCmuState({ ...cmuState, wallHeightFt: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Block Size
                    </label>
                    <select
                      value={cmuState.blockSize}
                      onChange={(e) => setCmuState({ ...cmuState, blockSize: e.target.value as any })}
                      className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                    >
                      <option value="8x8x16">8" × 8" × 16" (Standard Structural CMU)</option>
                      <option value="6x8x16">6" × 8" × 16" (Narrow)</option>
                      <option value="4x8x16">4" × 8" × 16" (Partition)</option>
                      <option value="12x8x16">12" × 8" × 16" (Retaining / Heavy)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Core-Fill Rebar / Grout Spacing
                    </label>
                    <select
                      value={cmuState.groutFillSpacingIn}
                      onChange={(e) => setCmuState({ ...cmuState, groutFillSpacingIn: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                    >
                      <option value="16">Every core (16" o.c. - Solid Grout)</option>
                      <option value="32">Every 32" o.c. (Standard Reinforced)</option>
                      <option value="48">Every 48" o.c. (Light Reinforced)</option>
                      <option value="0">Hollow (No core fill)</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-7 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-sky-50/50 dark:bg-sky-950/20">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Total CMU Blocks</span>
                      <div className="text-xl font-bold font-mono text-sky-800 dark:text-sky-300 mt-1">
                        {cmuRes.totalBlocks} blocks
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">1.125 blocks / sq ft</span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Mortar (Type S)</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        {cmuRes.mortarBags} bags
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">80 lb bags</span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Core Grout Volume</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        {cmuRes.coreFillCuYds} yd³
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">Fine aggregate grout</span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Vertical Rebar</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        {cmuRes.verticalBars} bars
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">({cmuRes.rebarSticks} 20ft sticks)</span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Net Wall Area</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        {cmuRes.netAreaSqFt} ft²
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">Minus door/window openings</span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Est. Block &amp; Mortar</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        ${cmuRes.totalCost}
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">Excl. core grout</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. WALL FRAMING & STUD CALCULATOR */}
          {activeCalcId === 'framing' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-5 space-y-4 border border-slate-200 dark:border-slate-800 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
                    Wall Framing Dimensions
                  </h2>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Wall Length (ft)
                      </label>
                      <input
                        type="number"
                        value={framingState.wallLengthFt}
                        onChange={(e) => setFramingState({ ...framingState, wallLengthFt: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Wall Height (ft)
                      </label>
                      <input
                        type="number"
                        value={framingState.wallHeightFt}
                        onChange={(e) => setFramingState({ ...framingState, wallHeightFt: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      On-Center Stud Spacing
                    </label>
                    <select
                      value={framingState.studSpacingIn}
                      onChange={(e) => setFramingState({ ...framingState, studSpacingIn: Number(e.target.value) as any })}
                      className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                    >
                      <option value="16">16 inches on-center (Standard Load Bearing)</option>
                      <option value="24">24 inches on-center (Non-bearing / Advanced framing)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Corners
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={framingState.cornerCount}
                        onChange={(e) => setFramingState({ ...framingState, cornerCount: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Doors
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={framingState.doorCount}
                        onChange={(e) => setFramingState({ ...framingState, doorCount: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Windows
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={framingState.windowCount}
                        onChange={(e) => setFramingState({ ...framingState, windowCount: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-7 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-sky-50/50 dark:bg-sky-950/20">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Total Studs</span>
                      <div className="text-xl font-bold font-mono text-sky-800 dark:text-sky-300 mt-1">
                        {framingRes.totalStuds} studs
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        ({framingRes.commonStuds} common + {framingRes.cornerStuds} corner + {framingRes.openingStuds} openings)
                      </span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Plates (16 ft boards)</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        {framingRes.plateBoards16ft} boards
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">Double top + bottom</span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Header Boards (10 ft)</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        {framingRes.headerBoards10ft} boards
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">Double headers</span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Board Feet</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        {framingRes.estimatedBoardFt} FBM
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">2x4 framing lumber</span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Framing Nails (16d)</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        {framingRes.nailsLbs} lbs
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">3-1/2" common nails</span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Estimated Lumber Cost</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        ${framingRes.totalLumberCost}
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">Studs + plates</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. PLYWOOD & OSB SHEATHING CALCULATOR */}
          {activeCalcId === 'sheathing' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-5 space-y-4 border border-slate-200 dark:border-slate-800 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
                    Sheathing Area &amp; Sheet Size
                  </h2>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Total Surface Area (sq ft)
                    </label>
                    <input
                      type="number"
                      value={sheathingState.areaSqFt}
                      onChange={(e) => setSheathingState({ ...sheathingState, areaSqFt: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Panel Size
                    </label>
                    <select
                      value={sheathingState.sheetSize}
                      onChange={(e) => setSheathingState({ ...sheathingState, sheetSize: e.target.value as any })}
                      className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                    >
                      <option value="4x8">4 ft × 8 ft (32 sq ft per sheet)</option>
                      <option value="4x10">4 ft × 10 ft (40 sq ft per sheet)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Waste Factor (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={sheathingState.wastePct}
                      onChange={(e) => setSheathingState({ ...sheathingState, wastePct: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                    />
                  </div>
                </div>

                <div className="md:col-span-7 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-sky-50/50 dark:bg-sky-950/20">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Total Panels Needed</span>
                      <div className="text-xl font-bold font-mono text-sky-800 dark:text-sky-300 mt-1">
                        {sheathingRes.totalSheets} sheets
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Raw: {sheathingRes.rawSheets} + {sheathingState.wastePct}% waste
                      </span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Fasteners Count</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        {sheathingRes.fastenersCount.toLocaleString()}
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">~36 nails per sheet</span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">8d Nails (lbs)</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        {sheathingRes.nailsLbs} lbs
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">Ring-shank sheath nails</span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900 col-span-2 sm:col-span-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Estimated Material Cost</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        ${sheathingRes.totalCost}
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        @ ${sheathingState.pricePerSheet} per {sheathingState.sheetSize} panel
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. DRYWALL & SHEETROCK CALCULATOR */}
          {activeCalcId === 'drywall' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-5 space-y-4 border border-slate-200 dark:border-slate-800 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
                    Room Dimensions
                  </h2>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Length (ft)
                      </label>
                      <input
                        type="number"
                        value={drywallState.roomLengthFt}
                        onChange={(e) => setDrywallState({ ...drywallState, roomLengthFt: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Width (ft)
                      </label>
                      <input
                        type="number"
                        value={drywallState.roomWidthFt}
                        onChange={(e) => setDrywallState({ ...drywallState, roomWidthFt: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Height (ft)
                      </label>
                      <input
                        type="number"
                        value={drywallState.wallHeightFt}
                        onChange={(e) => setDrywallState({ ...drywallState, wallHeightFt: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="drywall-ceiling-check"
                      checked={drywallState.includeCeiling}
                      onChange={(e) => setDrywallState({ ...drywallState, includeCeiling: e.target.checked })}
                      className="rounded text-sky-600 cursor-pointer"
                    />
                    <label htmlFor="drywall-ceiling-check" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                      Include Ceiling in calculation
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Sheet Size
                    </label>
                    <select
                      value={drywallState.sheetSize}
                      onChange={(e) => setDrywallState({ ...drywallState, sheetSize: e.target.value as any })}
                      className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                    >
                      <option value="4x8">4 ft × 8 ft (32 sq ft)</option>
                      <option value="4x10">4 ft × 10 ft (40 sq ft)</option>
                      <option value="4x12">4 ft × 12 ft (48 sq ft)</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-7 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-sky-50/50 dark:bg-sky-950/20">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Drywall Sheets</span>
                      <div className="text-xl font-bold font-mono text-sky-800 dark:text-sky-300 mt-1">
                        {drywallRes.totalSheets} sheets
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {drywallRes.totalAreaSqFt} total sq ft
                      </span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Joint Compound</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        {drywallRes.compoundBuckets} buckets
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">4.5 gal ready-mix</span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Paper Tape (250 ft)</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        {drywallRes.tapeRolls250ft} rolls
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">Joint reinforcement</span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Drywall Screws</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        {drywallRes.screwPounds} lbs
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">1-1/4" coarse thread</span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900 col-span-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Estimated Materials</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        ${drywallRes.totalCost}
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Sheets (${drywallRes.sheetCost}) + Mud (${drywallRes.compoundCost})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. PAINT & PRIMER COVERAGE CALCULATOR */}
          {activeCalcId === 'paint' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-5 space-y-4 border border-slate-200 dark:border-slate-800 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
                    Paint Surface Parameters
                  </h2>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Net Wall &amp; Ceiling Area (sq ft)
                    </label>
                    <input
                      type="number"
                      value={paintState.surfaceAreaSqFt}
                      onChange={(e) => setPaintState({ ...paintState, surfaceAreaSqFt: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Coats of Paint
                      </label>
                      <select
                        value={paintState.coats}
                        onChange={(e) => setPaintState({ ...paintState, coats: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      >
                        <option value="1">1 Coat (Touch-up / refresh)</option>
                        <option value="2">2 Coats (Standard quality)</option>
                        <option value="3">3 Coats (Major color shift)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Coverage (sq ft / gal)
                      </label>
                      <input
                        type="number"
                        value={paintState.coveragePerGal}
                        onChange={(e) => setPaintState({ ...paintState, coveragePerGal: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="paint-primer-check"
                      checked={paintState.includePrimer}
                      onChange={(e) => setPaintState({ ...paintState, includePrimer: e.target.checked })}
                      className="rounded text-sky-600 cursor-pointer"
                    />
                    <label htmlFor="paint-primer-check" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                      Include 1 Base Coat of Primer
                    </label>
                  </div>
                </div>

                <div className="md:col-span-7 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-sky-50/50 dark:bg-sky-950/20">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Paint Required</span>
                      <div className="text-xl font-bold font-mono text-sky-800 dark:text-sky-300 mt-1">
                        {paintRes.paintGallons} gallons
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {paintRes.totalPaintSqFt} effective sq ft
                      </span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Primer Required</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        {paintRes.primerGallons} gallons
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">1 seal coat</span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Estimated Cost</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        ${paintRes.totalCost}
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">Paint + Primer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 8. ROOFING SHINGLE & PITCH CALCULATOR */}
          {activeCalcId === 'roofing' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-5 space-y-4 border border-slate-200 dark:border-slate-800 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
                    Roof Dimensions &amp; Slope
                  </h2>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Ground Footprint Area (sq ft)
                    </label>
                    <input
                      type="number"
                      value={roofingState.footprintAreaSqFt}
                      onChange={(e) => setRoofingState({ ...roofingState, footprintAreaSqFt: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Roof Pitch (Rise / 12" Run)
                    </label>
                    <select
                      value={roofingState.pitchRiseOver12}
                      onChange={(e) => setRoofingState({ ...roofingState, pitchRiseOver12: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                    >
                      <option value="3">3/12 (Low slope - 1.031x)</option>
                      <option value="4">4/12 (Standard low - 1.054x)</option>
                      <option value="6">6/12 (Standard residential - 1.118x)</option>
                      <option value="8">8/12 (Medium steep - 1.202x)</option>
                      <option value="10">10/12 (Steep - 1.302x)</option>
                      <option value="12">12/12 (45° very steep - 1.414x)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Ridge / Hips (ft)
                      </label>
                      <input
                        type="number"
                        value={roofingState.ridgeLengthFt}
                        onChange={(e) => setRoofingState({ ...roofingState, ridgeLengthFt: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Waste (%)
                      </label>
                      <input
                        type="number"
                        value={roofingState.wastePct}
                        onChange={(e) => setRoofingState({ ...roofingState, wastePct: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-7 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-sky-50/50 dark:bg-sky-950/20">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Roofing Squares</span>
                      <div className="text-xl font-bold font-mono text-sky-800 dark:text-sky-300 mt-1">
                        {roofingRes.totalSquares} sq
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        1 Square = 100 ft² ({roofingRes.trueRoofAreaSqFt} ft² true area)
                      </span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Shingle Bundles</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        {roofingRes.totalBundles} bundles
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">3 bundles per square</span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Ridge Cap Bundles</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        {roofingRes.ridgeBundles} bundles
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">33 linear ft / bundle</span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Synthetic Felt</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        {roofingRes.underlaymentRollsSynthetic} rolls
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">10 squares / roll</span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Drip Edge Sticks</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        {roofingRes.dripEdgeSticks10ft} sticks
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">10 ft lengths</span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Roofing Nails</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        {roofingRes.nailsLbs} lbs
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">1-1/4" coil/hand</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 9. TILE, GROUT & FLOORING CALCULATOR */}
          {activeCalcId === 'flooring-tile' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-5 space-y-4 border border-slate-200 dark:border-slate-800 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
                    Tile Layout &amp; Area
                  </h2>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Floor or Wall Area (sq ft)
                    </label>
                    <input
                      type="number"
                      value={tileState.areaSqFt}
                      onChange={(e) => setTileState({ ...tileState, areaSqFt: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Tile Length (inches)
                      </label>
                      <input
                        type="number"
                        value={tileState.tileLengthIn}
                        onChange={(e) => setTileState({ ...tileState, tileLengthIn: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Tile Width (inches)
                      </label>
                      <input
                        type="number"
                        value={tileState.tileWidthIn}
                        onChange={(e) => setTileState({ ...tileState, tileWidthIn: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Grout Joint Width
                      </label>
                      <select
                        value={tileState.jointWidthIn}
                        onChange={(e) => setTileState({ ...tileState, jointWidthIn: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      >
                        <option value="0.0625">1/16" (Tight)</option>
                        <option value="0.125">1/8" (Standard)</option>
                        <option value="0.1875">3/16" (Medium)</option>
                        <option value="0.25">1/4" (Rustic / Wide)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Waste (%)
                      </label>
                      <input
                        type="number"
                        value={tileState.wastePct}
                        onChange={(e) => setTileState({ ...tileState, wastePct: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-7 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-sky-50/50 dark:bg-sky-950/20">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Total Tiles</span>
                      <div className="text-xl font-bold font-mono text-sky-800 dark:text-sky-300 mt-1">
                        {tileRes.totalTiles} tiles
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {tileRes.totalAreaWithWasteSqFt} ft² gross
                      </span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Tile Boxes</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        {tileRes.totalBoxes} boxes
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        @{tileState.sqFtPerBox} sq ft / box
                      </span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Grout Weight</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        {tileRes.groutPounds} lbs
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        ({tileRes.groutBags25lb} 25-lb bags)
                      </span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Thin-Set Mortar</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        {tileRes.thinsetBags50lb} bags
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">50 lb modified bags</span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-white dark:bg-slate-900 col-span-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Estimated Cost</span>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                        ${tileRes.totalCost}
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">Tile + Grout</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 10. CONSTRUCTION COST & BUDGET ESTIMATOR */}
          {activeCalcId === 'construction-cost' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-5 space-y-4 border border-slate-200 dark:border-slate-800 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
                    Project Cost Parameters
                  </h2>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Square Footage (sq ft)
                    </label>
                    <input
                      type="number"
                      value={costState.squareFootage}
                      onChange={(e) => setCostState({ ...costState, squareFootage: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Direct Materials Cost ($)
                    </label>
                    <input
                      type="number"
                      value={costState.materialBaseCost}
                      onChange={(e) => setCostState({ ...costState, materialBaseCost: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Labor Rate ($ / sq ft)
                      </label>
                      <input
                        type="number"
                        value={costState.laborRatePerSqFt}
                        onChange={(e) => setCostState({ ...costState, laborRatePerSqFt: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Permits / Fees ($)
                      </label>
                      <input
                        type="number"
                        value={costState.equipmentPermitCost}
                        onChange={(e) => setCostState({ ...costState, equipmentPermitCost: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        GC Markup (%)
                      </label>
                      <input
                        type="number"
                        value={costState.contractorMarkupPct}
                        onChange={(e) => setCostState({ ...costState, contractorMarkupPct: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Contingency (%)
                      </label>
                      <input
                        type="number"
                        value={costState.contingencyPct}
                        onChange={(e) => setCostState({ ...costState, contingencyPct: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-7 space-y-4">
                  <div className="border border-sky-300 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-950/20 p-4 rounded-xl">
                    <span className="text-xs uppercase font-mono tracking-wider text-sky-800 dark:text-sky-300">
                      Total Estimated Project Cost
                    </span>
                    <div className="text-3xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                      ${costRes.totalEstimatedCost.toLocaleString()}
                    </div>
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                      Average: <strong>${costRes.costPerSqFt}</strong> per square foot ({costRes.squareFootage} sq ft)
                    </span>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900 overflow-x-auto">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Budget Breakdown Table
                    </h3>
                    <table className="w-full text-xs font-mono text-left border-collapse">
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        <tr>
                          <td className="py-2 text-slate-600 dark:text-slate-400 font-sans">Materials Subtotal</td>
                          <td className="py-2 text-right font-bold">${costRes.materialCost.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-slate-600 dark:text-slate-400 font-sans">Labor Cost</td>
                          <td className="py-2 text-right font-bold">${costRes.laborCost.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-slate-600 dark:text-slate-400 font-sans">Permits &amp; Equipment</td>
                          <td className="py-2 text-right font-bold">${costRes.equipmentPermitCost.toLocaleString()}</td>
                        </tr>
                        <tr className="bg-slate-50 dark:bg-slate-950/40">
                          <td className="py-2 text-slate-800 dark:text-slate-200 font-sans font-semibold">Direct Cost Subtotal</td>
                          <td className="py-2 text-right font-bold">${costRes.directSubtotal.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-slate-600 dark:text-slate-400 font-sans">General Contractor Markup ({costRes.markupPct}%)</td>
                          <td className="py-2 text-right font-bold">+${costRes.markupAmount.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-slate-600 dark:text-slate-400 font-sans">Contingency Reserve ({costRes.contingencyPct}%)</td>
                          <td className="py-2 text-right font-bold">+${costRes.contingencyAmount.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 4. AUTHOR / DEVELOPER BIO & CONTACT BLOCK (Sohail Anwar) */}
          {/* ============================================================== */}
          <section
            id="author-contact"
            aria-labelledby="heading-author-bio"
            className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 bg-white dark:bg-slate-900"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <a
                  href="https://heylink.me/sohailanwaralmani74"
                  target="_blank"
                  rel="noopener noreferrer author me"
                  aria-label="Visit Sohail Anwar profile and contact page"
                  className="shrink-0 block rounded-full focus:outline-none focus:ring-2 focus:ring-sky-600"
                >
                  <img
                    src="./sohail-anwar.png"
                    onError={(e) => {
                      (e.target as HTMLElement).setAttribute('src', 'https://avatars.githubusercontent.com/u/90188094?v=4');
                    }}
                    alt="Sohail Anwar – Software and Application Developer"
                    width="72"
                    height="72"
                    className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full object-cover border-2 border-slate-300 dark:border-slate-600 shadow-2xs"
                  />
                </a>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 id="heading-author-bio" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      Sohail Anwar
                    </h2>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      Software &amp; Application Developer
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                    12 years of experience developing deterministic, browser-based engineering calculation software and technical utilities. Built to provide reliable, zero-latency material takeoffs without paywalls or tracking locks.
                  </p>
                </div>
              </div>

              <div className="shrink-0 w-full sm:w-auto">
                <a
                  href="https://heylink.me/sohailanwaralmani74"
                  target="_blank"
                  rel="noopener noreferrer author me"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-md bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition-colors cursor-pointer"
                >
                  Developer Profile &amp; Contact →
                </a>
              </div>
            </div>
          </section>

          {/* Responsive In-Content Ad Slot 1 (Non-overlapping) */}
          <div
            id="wanjaaro-ad-slot-mid-1"
            aria-label="Sponsored advertisement"
            className="no-print w-full flex flex-col items-center justify-center py-2 overflow-hidden"
          ></div>
        </main>

        {/* ============================================================== */}
        {/* 5. GLOBAL RIGHT AD COLUMN (Desktop lg: 25% screen width) */}
        {/* ============================================================== */}
        <aside
          id="wanjaaro-desktop-right-ad"
          aria-label="Sponsored partner content"
          className="hidden lg:flex lg:flex-col lg:w-[25%] shrink-0 space-y-6 no-print"
        >
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/60 dark:bg-slate-900/60 flex flex-col items-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Sponsored
            </span>
            <div id="container-5ec3c4b0a267d356073051679993785a" className="w-full overflow-hidden"></div>
          </div>

          <div
            id="wanjaaro-ad-slot-desktop-sidebar-1"
            className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/60 dark:bg-slate-900/60 flex flex-col items-center justify-center overflow-hidden"
          ></div>

          <div
            id="wanjaaro-ad-slot-desktop-sidebar-2"
            className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/60 dark:bg-slate-900/60 flex flex-col items-center justify-center overflow-hidden"
          ></div>
        </aside>
      </div>

      {/* ============================================================== */}
      {/* 6. COMPREHENSIVE FOOTER */}
      {/* ============================================================== */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 mt-12 py-8 px-4 sm:px-6 text-xs text-slate-600 dark:text-slate-400 no-print">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-6 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Wanjaaro Construction Calculators</h3>
            <p>
              Free deterministic civil and structural material calculators for contractors, carpenters, masons, and home builders. Developed and maintained by{' '}
              <a
                href="https://heylink.me/sohailanwaralmani74"
                target="_blank"
                rel="noopener noreferrer author me"
                className="font-semibold underline hover:text-sky-700 dark:hover:text-sky-400"
              >
                Sohail Anwar
              </a>
              .
            </p>
            <p className="font-mono text-slate-500">
              © 2026 Wanjaaro · Built by Sohail Anwar · All calculations run locally in your browser.
            </p>
          </div>
          <div className="md:col-span-6 flex flex-wrap gap-x-4 gap-y-2 md:justify-end">
            {ALL_CALCULATORS.map((calc) => (
              <button
                key={calc.id}
                type="button"
                onClick={() => switchCalculator(calc.id)}
                className="hover:underline text-left cursor-pointer"
              >
                {calc.name}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

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
  calculateStairHandrail,
} from '../calc/buildingMath.js';

interface BuildingWorkspaceProps {
  initialCalcId?: string;
}

export default function BuildingWorkspace({ initialCalcId }: BuildingWorkspaceProps) {
  // Determine active calculator or home view from initial prop, URL search param, or clean pathname
  const [activeCalcId, setActiveCalcId] = useState<string>(() => {
    if (initialCalcId) {
      if (initialCalcId === 'home') return 'home';
      if (ALL_CALCULATORS.some((c) => c.id === initialCalcId)) return initialCalcId;
    }
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const paramCalc = urlParams.get('calc');
      if (paramCalc) {
        if (paramCalc === 'home') return 'home';
        if (ALL_CALCULATORS.some((c) => c.id === paramCalc)) return paramCalc;
      }
      // Clean path: strip leading/trailing slashes and .html
      const cleanPath = window.location.pathname.replace(/^\/|\/$/g, '').replace(/\.html$/, '');
      if (!cleanPath || cleanPath === 'index') {
        if (window.location.pathname.includes('.html')) {
          window.history.replaceState({ calcId: 'home' }, '', '/');
        }
        return 'home';
      }
      const matched = ALL_CALCULATORS.find((c) => c.slug === cleanPath || c.id === cleanPath);
      if (matched) {
        // If loaded with .html, cleanly replace in browser address bar without page reload
        if (window.location.pathname.includes('.html')) {
          window.history.replaceState({ calcId: matched.id }, '', `/${matched.slug}`);
        }
        return matched.id;
      }
    }
    return 'home';
  });

  const [homeSearch, setHomeSearch] = useState('');
  const [homeCategoryFilter, setHomeCategoryFilter] = useState('all');
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

  // Synchronize browser history / clean URL when changing active calculator
  const switchCalculator = (calcId: string) => {
    setActiveCalcId(calcId);
    setHoveredCategory(null);
    setMobileCategoryOpen(false);
    if (typeof window !== 'undefined' && window.history?.pushState) {
      if (calcId === 'home') {
        window.history.pushState({ calcId: 'home' }, '', '/');
        document.title = 'Wanjaaro Building Material & Construction Cost Calculators';
      } else {
        const calcObj = ALL_CALCULATORS.find((c) => c.id === calcId);
        if (calcObj) {
          window.history.pushState({ calcId }, '', `/${calcObj.slug}`);
          document.title = `${calcObj.name} – Wanjaaro Material & Cost Calculator`;
        }
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen to popstate (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const cleanPath = window.location.pathname.replace(/^\/|\/$/g, '').replace(/\.html$/, '');
      if (!cleanPath || cleanPath === 'index') {
        setActiveCalcId('home');
      } else {
        const matched = ALL_CALCULATORS.find((c) => c.slug === cleanPath || c.id === cleanPath);
        if (matched) {
          setActiveCalcId(matched.id);
        } else {
          setActiveCalcId('home');
        }
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

  // 11. Stair & Handrail (IRC / IBC / ADA)
  const [stairState, setStairState] = useState({
    totalRiseIn: 108,
    targetRiserHeightIn: 7.5,
    treadRunIn: 10.5,
    nosingIn: 1.0,
    stairWidthIn: 36,
    buildingCode: 'irc' as 'irc' | 'ibc_ada',
    handrailSides: 'both' as 'one' | 'both' | 'wall_and_guard',
    handrailHeightIn: 36,
    adaExtensions: false,
    balusterSpacingIn: 3.5,
    stringerSpacingIn: 16 as 12 | 16,
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
  const stairRes = calculateStairHandrail(stairState);

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
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  switchCalculator('home');
                }}
                className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 hover:opacity-90 cursor-pointer"
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
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    switchCalculator('home');
                  }}
                  className={`hover:underline cursor-pointer ${
                    activeCalcId === 'home'
                      ? 'text-sky-700 dark:text-sky-400 font-bold'
                      : 'text-slate-900 dark:text-slate-200'
                  }`}
                >
                  Home
                </a>
              </li>

              {activeCalcId !== 'home' && (
                <>
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
                </>
              )}
            </ol>
          </nav>

          {/* ============================================================== */}
          {/* HOME VIEW: DIRECTORY OF ALL 10 CALCULATORS & PRESETS */}
          {/* ============================================================== */}
          {activeCalcId === 'home' ? (
            <div className="space-y-8 animate-in fade-in">
              {/* Hero Banner */}
              <div className="border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 via-white to-sky-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-sky-950/20 p-6 sm:p-8 rounded-2xl shadow-xs space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                  <span>🏗 10 Dedicated Construction Takeoff Calculators</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Building Material &amp; Cost Calculators
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                  Fast, deterministic civil and structural material estimators for contractors, framers, masons, and homeowners. Calculate concrete cubic yards, brick and CMU block counts, wall stud framing, OSB sheathing, drywall, paint coverage, roofing squares, and complete job budgeting.
                </p>

                {/* Search & Filter Controls */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={homeSearch}
                      onChange={(e) => setHomeSearch(e.target.value)}
                      placeholder="Search calculators (e.g. concrete slab, studs, drywall, shingles, tile, cost)..."
                      className="w-full px-4 py-2.5 text-xs sm:text-sm font-sans border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-600"
                    />
                    {homeSearch && (
                      <button
                        type="button"
                        onClick={() => setHomeSearch('')}
                        className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setHomeCategoryFilter('all')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                      homeCategoryFilter === 'all'
                        ? 'bg-sky-700 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    All Tools ({ALL_CALCULATORS.length})
                  </button>
                  {CALCULATOR_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setHomeCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                        homeCategoryFilter === cat.id
                          ? 'bg-sky-700 text-white'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {cat.name} ({cat.calculators.length})
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Project Quick Presets Bar */}
              <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                    ⚡ Quick Launch Common Projects
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setConcreteState((prev) => ({ ...prev, shape: 'slab', lengthFt: 12, widthFt: 12, thicknessIn: 4 }));
                      switchCalculator('concrete');
                    }}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 hover:border-sky-600 hover:bg-sky-50/50 dark:hover:bg-sky-950/30 transition-all cursor-pointer"
                  >
                    🚗 12×12 Patio Slab (4″)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBrickState((prev) => ({ ...prev, wallLengthFt: 20, wallHeightFt: 8 }));
                      switchCalculator('brick-mortar');
                    }}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 hover:border-sky-600 hover:bg-sky-50/50 dark:hover:bg-sky-950/30 transition-all cursor-pointer"
                  >
                    🧱 20×8 Brick Veneer Wall
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCmuState((prev) => ({ ...prev, wallLengthFt: 24, wallHeightFt: 8 }));
                      switchCalculator('block-cmu');
                    }}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 hover:border-sky-600 hover:bg-sky-50/50 dark:hover:bg-sky-950/30 transition-all cursor-pointer"
                  >
                    🏗 24×8 CMU Block Wall
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFramingState((prev) => ({ ...prev, wallLengthFt: 30, studSpacingIn: 16 }));
                      switchCalculator('framing');
                    }}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 hover:border-sky-600 hover:bg-sky-50/50 dark:hover:bg-sky-950/30 transition-all cursor-pointer"
                  >
                    🔨 30 ft Stud Wall (16″ O.C.)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDrywallState((prev) => ({ ...prev, roomLengthFt: 16, roomWidthFt: 14, wallHeightFt: 9, includeCeiling: true }));
                      switchCalculator('drywall');
                    }}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 hover:border-sky-600 hover:bg-sky-50/50 dark:hover:bg-sky-950/30 transition-all cursor-pointer"
                  >
                    🏠 16×14 Room Drywall &amp; Ceiling
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRoofingState((prev) => ({ ...prev, footprintAreaSqFt: 1800, pitchNumerator: 6 }));
                      switchCalculator('roofing');
                    }}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 hover:border-sky-600 hover:bg-sky-50/50 dark:hover:bg-sky-950/30 transition-all cursor-pointer"
                  >
                    📐 1,800 sq ft Roof (6/12 pitch)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStairState((prev) => ({ ...prev, totalRiseIn: 108, targetRiserHeightIn: 7.5, treadRunIn: 10.5, buildingCode: 'irc' }));
                      switchCalculator('stair-handrail');
                    }}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 hover:border-sky-600 hover:bg-sky-50/50 dark:hover:bg-sky-950/30 transition-all cursor-pointer"
                  >
                    🪜 9 ft Interior Stairs (14 risers)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStairState((prev) => ({ ...prev, totalRiseIn: 84, targetRiserHeightIn: 7.0, treadRunIn: 11.0, buildingCode: 'ibc_ada', adaExtensions: true }));
                      switchCalculator('stair-handrail');
                    }}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 hover:border-sky-600 hover:bg-sky-50/50 dark:hover:bg-sky-950/30 transition-all cursor-pointer"
                  >
                    🦽 ADA Commercial Stair &amp; Handrail
                  </button>
                  <button
                    type="button"
                    onClick={() => switchCalculator('construction-cost')}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-sky-300 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 hover:bg-sky-100 transition-all cursor-pointer"
                  >
                    📊 Total Construction Project Budget
                  </button>
                </div>
              </div>

              {/* Calculators Cards Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Available Calculators
                  </h2>
                  <span className="text-xs font-mono text-slate-500">
                    Clean URLs: /{`{calculator-name}`}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ALL_CALCULATORS.filter((c) => {
                    const matchesCategory =
                      homeCategoryFilter === 'all' || c.categoryId === homeCategoryFilter;
                    const matchesSearch =
                      !homeSearch.trim() ||
                      c.name.toLowerCase().includes(homeSearch.toLowerCase()) ||
                      c.summary.toLowerCase().includes(homeSearch.toLowerCase()) ||
                      c.badge.toLowerCase().includes(homeSearch.toLowerCase());
                    return matchesCategory && matchesSearch;
                  }).map((calc) => {
                    const cat = CALCULATOR_CATEGORIES.find((c) => c.id === calc.categoryId);
                    return (
                      <div
                        key={calc.id}
                        className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900 hover:border-sky-600 dark:hover:border-sky-500 transition-all shadow-2xs hover:shadow-md flex flex-col justify-between group"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {cat?.name || 'Calculator'}
                            </span>
                            <span className="text-[11px] font-mono text-sky-700 dark:text-sky-400 font-bold bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded">
                              {calc.badge}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors">
                            {calc.name}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            {calc.summary}
                          </p>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-slate-400">
                            /{calc.slug}
                          </span>
                          <button
                            type="button"
                            onClick={() => switchCalculator(calc.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold cursor-pointer transition-colors"
                          >
                            <span>Open Calculator</span>
                            <span>→</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* PAGE TITLE & META HEADER */}
              <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => switchCalculator('home')}
                      className="px-2.5 py-1 text-xs font-semibold rounded border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      ← All Calculators
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {currentCalc.name}
                    </h1>
                  </div>
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
                          ? 'bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-400 font-bold shadow-xs'
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

          {/* 11. STAIR & HANDRAIL CALCULATOR (IRC / IBC / ADA) */}
          {activeCalcId === 'stair-handrail' && (
            <div className="space-y-6">
              {/* Presets Bar */}
              <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl no-print">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Quick Presets:
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setStairState((prev) => ({
                      ...prev,
                      totalRiseIn: 105,
                      targetRiserHeightIn: 7.5,
                      treadRunIn: 10.5,
                      buildingCode: 'irc',
                      adaExtensions: false,
                    }))
                  }
                  className="px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  8 ft Ceiling (105″ Rise · 14 Risers)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setStairState((prev) => ({
                      ...prev,
                      totalRiseIn: 114,
                      targetRiserHeightIn: 7.6,
                      treadRunIn: 10.5,
                      buildingCode: 'irc',
                      adaExtensions: false,
                    }))
                  }
                  className="px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  9 ft Ceiling (114″ Rise · 15 Risers)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setStairState((prev) => ({
                      ...prev,
                      totalRiseIn: 126,
                      targetRiserHeightIn: 7.41,
                      treadRunIn: 11.0,
                      buildingCode: 'irc',
                      adaExtensions: false,
                    }))
                  }
                  className="px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  10 ft Ceiling (126″ Rise · 17 Risers)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setStairState((prev) => ({
                      ...prev,
                      totalRiseIn: 48,
                      targetRiserHeightIn: 6.85,
                      treadRunIn: 11.0,
                      buildingCode: 'irc',
                      handrailSides: 'both',
                      adaExtensions: false,
                    }))
                  }
                  className="px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Porch / Deck (48″ Rise · 7 Risers)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setStairState((prev) => ({
                      ...prev,
                      totalRiseIn: 84,
                      targetRiserHeightIn: 7.0,
                      treadRunIn: 11.0,
                      buildingCode: 'ibc_ada',
                      handrailSides: 'both',
                      adaExtensions: true,
                      stairWidthIn: 44,
                    }))
                  }
                  className="px-2.5 py-1 text-xs rounded border border-sky-300 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 hover:bg-sky-100 cursor-pointer font-medium"
                >
                  Commercial ADA (84″ Rise · 12 Risers @ 7.0″)
                </button>
              </div>

              {/* Main Workspace: Inputs & Diagnostics */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Form Controls (5 Cols) */}
                <div className="lg:col-span-5 space-y-4 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Stair &amp; Railing Dimensions
                    </h2>
                    <p className="text-xs text-slate-500">
                      Deterministic geometry according to IRC R311.7, IBC 1014, and ADA 505.
                    </p>
                  </div>

                  {/* Building Code Standard */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Applicable Building Code
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setStairState((prev) => ({
                            ...prev,
                            buildingCode: 'irc',
                            targetRiserHeightIn: Math.min(prev.targetRiserHeightIn, 7.75),
                            adaExtensions: false,
                          }))
                        }
                        className={`px-3 py-2 text-xs font-semibold rounded border cursor-pointer text-left transition-all ${
                          stairState.buildingCode === 'irc'
                            ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-600 text-sky-900 dark:text-sky-300 ring-1 ring-sky-600'
                            : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-400'
                        }`}
                      >
                        <div className="font-bold">IRC 2024 (Residential)</div>
                        <div className="text-[10px] text-slate-500 font-normal">Max 7-3/4″ Rise · Min 10″ Tread</div>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setStairState((prev) => ({
                            ...prev,
                            buildingCode: 'ibc_ada',
                            targetRiserHeightIn: Math.min(prev.targetRiserHeightIn, 7.0),
                            treadRunIn: Math.max(prev.treadRunIn, 11.0),
                            stairWidthIn: Math.max(prev.stairWidthIn, 44),
                            adaExtensions: true,
                          }))
                        }
                        className={`px-3 py-2 text-xs font-semibold rounded border cursor-pointer text-left transition-all ${
                          stairState.buildingCode === 'ibc_ada'
                            ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-600 text-sky-900 dark:text-sky-300 ring-1 ring-sky-600'
                            : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-400'
                        }`}
                      >
                        <div className="font-bold">IBC / ADA 505 (Commercial)</div>
                        <div className="text-[10px] text-slate-500 font-normal">Max 7.0″ Rise · Min 11″ Tread · 12″ Ext</div>
                      </button>
                    </div>
                  </div>

                  {/* Total Vertical Rise */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Total Vertical Rise (finished floor to floor)
                      </label>
                      <span className="text-[11px] font-mono text-slate-500">
                        = {(stairState.totalRiseIn / 12).toFixed(2)} ft ({stairRes.riserFraction} per step)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.25"
                        min="12"
                        max="240"
                        value={stairState.totalRiseIn}
                        onChange={(e) => setStairState({ ...stairState, totalRiseIn: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                      <span className="text-xs font-mono text-slate-500">inches</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Measure exactly from finished lower floor to finished upper floor surface (including subfloor/flooring).
                    </p>
                  </div>

                  {/* Target Riser Height & Tread Run */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Target Riser Height
                      </label>
                      <input
                        type="number"
                        step="0.125"
                        min="4"
                        max={stairState.buildingCode === 'ibc_ada' ? 7.0 : 7.75}
                        value={stairState.targetRiserHeightIn}
                        onChange={(e) => setStairState({ ...stairState, targetRiserHeightIn: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      />
                      <span className="text-[10px] text-slate-500 font-mono">
                        Max: {stairState.buildingCode === 'ibc_ada' ? '7.0″ (IBC)' : '7.75″ (IRC)'}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Tread Run / Depth
                      </label>
                      <input
                        type="number"
                        step="0.25"
                        min={stairState.buildingCode === 'ibc_ada' ? 11.0 : 10.0}
                        max="16"
                        value={stairState.treadRunIn}
                        onChange={(e) => setStairState({ ...stairState, treadRunIn: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      />
                      <span className="text-[10px] text-slate-500 font-mono">
                        Min: {stairState.buildingCode === 'ibc_ada' ? '11.0″ (IBC)' : '10.0″ (IRC)'}
                      </span>
                    </div>
                  </div>

                  {/* Nosing & Stair Width */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Nosing Overhang (inches)
                      </label>
                      <input
                        type="number"
                        step="0.125"
                        min="0"
                        max="1.5"
                        value={stairState.nosingIn}
                        onChange={(e) => setStairState({ ...stairState, nosingIn: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      />
                      <span className="text-[10px] text-slate-500 font-mono">IRC: 0.75″–1.25″</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Clear Stair Width
                      </label>
                      <input
                        type="number"
                        step="1"
                        min="28"
                        max="96"
                        value={stairState.stairWidthIn}
                        onChange={(e) => setStairState({ ...stairState, stairWidthIn: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                      />
                      <span className="text-[10px] text-slate-500 font-mono">
                        Min: {stairState.buildingCode === 'ibc_ada' ? '44″ (IBC)' : '36″ (IRC)'}
                      </span>
                    </div>
                  </div>

                  {/* Handrail Configuration */}
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Handrail &amp; Guardrail Parameters
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          Handrail Placement
                        </label>
                        <select
                          value={stairState.handrailSides}
                          onChange={(e) => setStairState({ ...stairState, handrailSides: e.target.value as any })}
                          className="w-full px-2 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                        >
                          <option value="both">Both Sides (ADA / IBC)</option>
                          <option value="one">One Side Only (IRC Min)</option>
                          <option value="wall_and_guard">Wall Rail + Open Guard</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          Handrail Height (above nosing)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="34"
                          max="38"
                          value={stairState.handrailHeightIn}
                          onChange={(e) => setStairState({ ...stairState, handrailHeightIn: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                        />
                        <span className="text-[10px] text-slate-500 font-mono">Code range: 34″–38″</span>
                      </div>
                    </div>

                    {/* ADA Extensions Checkbox */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="adaExtToggle"
                        checked={stairState.adaExtensions}
                        onChange={(e) => setStairState({ ...stairState, adaExtensions: e.target.checked })}
                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                      />
                      <label htmlFor="adaExtToggle" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                        Include ADA 12″ Top &amp; Bottom Safety Extensions
                      </label>
                    </div>

                    {/* Baluster spacing & Stringer spacing */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          Baluster Max Gap (inches)
                        </label>
                        <input
                          type="number"
                          step="0.25"
                          min="2"
                          max="4"
                          value={stairState.balusterSpacingIn}
                          onChange={(e) => setStairState({ ...stairState, balusterSpacingIn: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                        />
                        <span className="text-[10px] text-slate-500 font-mono">IRC Max: 4.0″ (Sphere Rule)</span>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          Stringer Spacing (on-center)
                        </label>
                        <select
                          value={stairState.stringerSpacingIn}
                          onChange={(e) => setStairState({ ...stairState, stringerSpacingIn: Number(e.target.value) as any })}
                          className="w-full px-2 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                        >
                          <option value="16">16″ O.C. (Standard Residential)</option>
                          <option value="12">12″ O.C. (Composite / High Load)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Unit Costs & Labor */}
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Material Prices &amp; Carpentry Labor
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      <div>
                        <label className="block text-[11px] text-slate-500">2×12 Stringer ($/ea)</label>
                        <input
                          type="number"
                          step="1"
                          value={stairState.stringerBoardPrice}
                          onChange={(e) => setStairState({ ...stairState, stringerBoardPrice: Number(e.target.value) })}
                          className="w-full px-2 py-1 font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500">Tread Board ($/ea)</label>
                        <input
                          type="number"
                          step="1"
                          value={stairState.treadPrice}
                          onChange={(e) => setStairState({ ...stairState, treadPrice: Number(e.target.value) })}
                          className="w-full px-2 py-1 font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500">Riser Board ($/ea)</label>
                        <input
                          type="number"
                          step="1"
                          value={stairState.riserBoardPrice}
                          onChange={(e) => setStairState({ ...stairState, riserBoardPrice: Number(e.target.value) })}
                          className="w-full px-2 py-1 font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500">Handrail ($/lin ft)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={stairState.handrailPricePerFt}
                          onChange={(e) => setStairState({ ...stairState, handrailPricePerFt: Number(e.target.value) })}
                          className="w-full px-2 py-1 font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500">Newel Post ($/ea)</label>
                        <input
                          type="number"
                          step="1"
                          value={stairState.newelPostPrice}
                          onChange={(e) => setStairState({ ...stairState, newelPostPrice: Number(e.target.value) })}
                          className="w-full px-2 py-1 font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500">Baluster ($/ea)</label>
                        <input
                          type="number"
                          step="0.25"
                          value={stairState.balusterPrice}
                          onChange={(e) => setStairState({ ...stairState, balusterPrice: Number(e.target.value) })}
                          className="w-full px-2 py-1 font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] text-slate-500">Labor Rate ($/hour)</label>
                        <input
                          type="number"
                          step="5"
                          value={stairState.laborRatePerHour}
                          onChange={(e) => setStairState({ ...stairState, laborRatePerHour: Number(e.target.value) })}
                          className="w-full px-2 py-1 font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500">Labor Hours (Framing + Finish)</label>
                        <input
                          type="number"
                          step="1"
                          value={stairState.estimatedLaborHours}
                          onChange={(e) => setStairState({ ...stairState, estimatedLaborHours: Number(e.target.value) })}
                          className="w-full px-2 py-1 font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Results & Visual Elevation (7 Cols) */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Total Estimated Cost Banner */}
                  <div className="border border-sky-300 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-950/20 p-4 sm:p-5 rounded-xl">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-xs uppercase font-mono tracking-wider text-sky-800 dark:text-sky-300">
                          Total Estimated Stair &amp; Handrail Cost
                        </span>
                        <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white mt-0.5">
                          ${stairRes.totalProjectCost.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono text-slate-600 dark:text-slate-400 block">
                          Materials: <strong>${stairRes.materialsSubtotal.toLocaleString()}</strong>
                        </span>
                        <span className="text-xs font-mono text-slate-600 dark:text-slate-400 block">
                          Carpentry Labor: <strong>${stairRes.laborCost.toLocaleString()}</strong> ({stairState.estimatedLaborHours} hrs)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Code Compliance Diagnostics Box */}
                  <div
                    className={`border p-4 rounded-xl transition-colors ${
                      stairRes.allCodePassed
                        ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30'
                        : 'border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/30'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-200 dark:border-emerald-800/60">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3 h-3 rounded-full ${
                            stairRes.allCodePassed ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
                          {stairRes.allCodePassed
                            ? `✓ Complies with ${stairRes.codeStandard}`
                            : `⚠ Attention Required for ${stairRes.codeStandard}`}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-400">
                        Incline: {stairRes.inclineAngleDeg}° ({stairRes.angleOptimal ? 'Optimal' : 'Steep'})
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] text-slate-500 block">Riser Height</span>
                        <span className="font-bold font-mono">
                          {stairRes.riserFraction} ({stairRes.exactRiserHeightIn}″)
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">
                          Max: {stairRes.maxRiserLimit}″
                        </span>
                      </div>

                      <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] text-slate-500 block">Tread Run</span>
                        <span className="font-bold font-mono">
                          {stairRes.treadFraction} ({stairRes.treadRunIn}″)
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">
                          Min: {stairRes.minTreadLimit}″
                        </span>
                      </div>

                      <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] text-slate-500 block">Blondel (2R + T)</span>
                        <span className="font-bold font-mono">{stairRes.blondelValue}″</span>
                        <span className="text-[10px] text-slate-500 block">
                          {stairRes.blondelStatus} (Ideal 24″–25.5″)
                        </span>
                      </div>

                      <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] text-slate-500 block">Clear Width</span>
                        <span className="font-bold font-mono">{stairRes.stairWidthIn}″</span>
                        <span className="text-[10px] text-slate-500 block">
                          Min: {stairRes.minStairWidth}″
                        </span>
                      </div>

                      <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] text-slate-500 block">Handrail Height</span>
                        <span className="font-bold font-mono">{stairRes.handrailHeightIn}″</span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">
                          Range: 34″–38″
                        </span>
                      </div>

                      <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] text-slate-500 block">Baluster 4″ Rule</span>
                        <span className="font-bold font-mono">{stairState.balusterSpacingIn}″ gap</span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">
                          &lt; 4.0″ Sphere
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* INTERACTIVE SVG ELEVATION CROSS-SECTION DIAGRAM */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        📐 Stairway &amp; Handrail Cross-Section Elevation (To Scale)
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Angle: {stairRes.inclineAngleDeg}°
                      </span>
                    </div>

                    <div className="w-full overflow-x-auto bg-slate-50 dark:bg-slate-950/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                      <svg
                        viewBox="0 0 640 320"
                        className="w-full h-auto min-w-[540px] max-h-[300px]"
                        role="img"
                        aria-label="Stair elevation cross section diagram with risers, treads, and handrail"
                      >
                        <defs>
                          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#0284c7" />
                          </marker>
                          <pattern id="hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                            <line x1="0" y1="0" x2="0" y2="8" stroke="#cbd5e1" strokeWidth="1" />
                          </pattern>
                        </defs>

                        {/* Background gridlines */}
                        <line x1="40" y1="270" x2="600" y2="270" stroke="#94a3b8" strokeWidth="2" />
                        <line x1="40" y1="60" x2="600" y2="60" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" />

                        {/* Floor Labels */}
                        <text x="50" y="290" fill="#64748b" fontSize="11" fontFamily="monospace" fontWeight="bold">
                          Lower Finished Floor Level (0.0″)
                        </text>
                        <text x="360" y="50" fill="#64748b" fontSize="11" fontFamily="monospace" fontWeight="bold">
                          Upper Finished Landing ({stairRes.totalRiseIn}″ / {stairRes.totalRiseFt} ft)
                        </text>

                        {/* Calculate step rendering parameters */}
                        {(() => {
                          const stepsCount = Math.min(stairRes.numRisers, 18);
                          const startX = 80;
                          const startY = 270;
                          const totalVisualWidth = 400;
                          const totalVisualHeight = 210;
                          const stepW = totalVisualWidth / stepsCount;
                          const stepH = totalVisualHeight / stepsCount;

                          // Build stringer polygon points
                          const points: string[] = [`${startX},${startY}`];
                          for (let i = 0; i < stepsCount; i++) {
                            const curX = startX + i * stepW;
                            const nextX = startX + (i + 1) * stepW;
                            const curY = startY - (i + 1) * stepH;
                            points.push(`${curX},${curY}`);
                            points.push(`${nextX},${curY}`);
                          }
                          const topX = startX + stepsCount * stepW;
                          const topY = startY - totalVisualHeight;
                          points.push(`${topX + 50},${topY}`);
                          points.push(`${topX + 50},${startY}`);
                          points.push(`${startX},${startY}`);

                          // Handrail line parallel to stair slope: offset 45px up
                          const railYOffset = 40;
                          const railStartTopY = topY - railYOffset;
                          const railStartBottomY = startY - railYOffset;
                          const adaTopExt = stairState.adaExtensions ? 30 : 0;
                          const adaBottomExt = stairState.adaExtensions ? 30 : 0;

                          return (
                            <g>
                              {/* Stringer solid fill */}
                              <polygon points={points.join(' ')} fill="#e2e8f0" className="dark:fill-slate-800" stroke="#64748b" strokeWidth="1.5" />

                              {/* Treads & Nosing highlight */}
                              {Array.from({ length: stepsCount }).map((_, idx) => {
                                const tx = startX + idx * stepW;
                                const ty = startY - (idx + 1) * stepH;
                                return (
                                  <g key={idx}>
                                    {/* Tread cap with 3px nosing overhang */}
                                    <rect x={tx - 4} y={ty - 3} width={stepW + 5} height={6} fill="#b45309" rx="1" opacity="0.85" />
                                    {/* Vertical Baluster per step */}
                                    <line
                                      x1={tx + stepW / 2}
                                      y1={ty}
                                      x2={tx + stepW / 2}
                                      y2={ty - railYOffset + 4}
                                      stroke="#475569"
                                      strokeWidth="2"
                                    />
                                    {/* 2nd baluster if wide step */}
                                    {stepW > 25 && (
                                      <line
                                        x1={tx + (stepW * 3) / 4}
                                        y1={ty}
                                        x2={tx + (stepW * 3) / 4}
                                        y2={ty - railYOffset + 4}
                                        stroke="#475569"
                                        strokeWidth="2"
                                      />
                                    )}
                                  </g>
                                );
                              })}

                              {/* Bottom Newel Post */}
                              <rect x={startX - 6} y={startY - 60} width="12" height="60" fill="#334155" rx="1" />
                              {/* Top Newel Post */}
                              <rect x={topX - 6} y={topY - 60} width="12" height="60" fill="#334155" rx="1" />

                              {/* Handrail (sloped bar with extensions) */}
                              <line
                                x1={startX - adaBottomExt}
                                y1={railStartBottomY}
                                x2={topX + adaTopExt}
                                y2={railStartTopY}
                                stroke="#0284c7"
                                strokeWidth="6"
                                strokeLinecap="round"
                              />

                              {/* Handrail Height Annotation */}
                              <line x1={startX + 60} y1={startY - (3 * stepH)} x2={startX + 60} y2={startY - (3 * stepH) - railYOffset} stroke="#0284c7" strokeWidth="1" strokeDasharray="2 2" />
                              <text x={startX + 68} y={startY - (3 * stepH) - 18} fill="#0284c7" fontSize="10" fontFamily="monospace" fontWeight="bold">
                                {stairRes.handrailHeightIn}″ Handrail
                              </text>

                              {/* Incline Angle Arc */}
                              <path d={`M ${startX + 50} ${startY} A 50 50 0 0 0 ${startX + 40} ${startY - 30}`} fill="none" stroke="#d97706" strokeWidth="2" />
                              <text x={startX + 55} y={startY - 15} fill="#d97706" fontSize="11" fontFamily="monospace" fontWeight="bold">
                                {stairRes.inclineAngleDeg}°
                              </text>
                            </g>
                          );
                        })()}

                        {/* Total Rise Dimension Line (Right side) */}
                        <line x1="530" y1="270" x2="530" y2="60" stroke="#0284c7" strokeWidth="1.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                        <text x="540" y="170" fill="#0284c7" fontSize="12" fontFamily="monospace" fontWeight="bold">
                          Rise: {stairRes.totalRiseIn}″ ({stairRes.numRisers} risers @ {stairRes.riserFraction})
                        </text>

                        {/* Total Run Dimension Line (Bottom) */}
                        <line x1="80" y1="305" x2="480" y2="305" stroke="#0284c7" strokeWidth="1.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                        <text x="220" y="318" fill="#0284c7" fontSize="12" fontFamily="monospace" fontWeight="bold">
                          Total Run: {stairRes.totalRunIn}″ ({stairRes.totalRunFt} ft · {stairRes.numTreads} treads)
                        </text>
                      </svg>
                    </div>
                  </div>

                  {/* Summary Takeoff Metrics Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="border border-slate-200 dark:border-slate-800 p-3 rounded-xl bg-white dark:bg-slate-900">
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Risers</span>
                      <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                        {stairRes.numRisers}
                      </span>
                      <span className="text-[11px] text-sky-700 dark:text-sky-400 font-mono block">
                        @ {stairRes.riserFraction} each
                      </span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 p-3 rounded-xl bg-white dark:bg-slate-900">
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Treads</span>
                      <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                        {stairRes.numTreads}
                      </span>
                      <span className="text-[11px] text-sky-700 dark:text-sky-400 font-mono block">
                        @ {stairRes.treadFraction} run
                      </span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 p-3 rounded-xl bg-white dark:bg-slate-900">
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Stringers (2×12)</span>
                      <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                        {stairRes.stringerCount}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono block">
                        {stairRes.standardBoardFt} ft boards
                      </span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 p-3 rounded-xl bg-white dark:bg-slate-900">
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Handrail</span>
                      <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                        {stairRes.totalHandrailFt} LF
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono block">
                        {stairRes.totalBrackets} Brackets · {stairRes.totalNewelPosts} Posts
                      </span>
                    </div>
                  </div>

                  {/* Complete Bill of Materials & Takeoff Table */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900 overflow-x-auto">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Contractor Bill of Materials Takeoff
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          const takeoffSummary = [
                            `WANJAARO STAIR & HANDRAIL MATERIAL TAKEOFF`,
                            `Building Code: ${stairRes.codeStandard}`,
                            `Total Vertical Rise: ${stairRes.totalRiseIn}" (${stairRes.totalRiseFt} ft)`,
                            `Number of Risers: ${stairRes.numRisers} @ ${stairRes.riserFraction} (${stairRes.exactRiserHeightIn}")`,
                            `Number of Treads: ${stairRes.numTreads} @ ${stairRes.treadFraction} run (Total Run: ${stairRes.totalRunIn}")`,
                            `Incline Angle: ${stairRes.inclineAngleDeg}° (Blondel: ${stairRes.blondelValue}")`,
                            `Clear Width: ${stairRes.stairWidthIn}" | Stringers: ${stairRes.stringerCount} boards (2x12 x ${stairRes.standardBoardFt}ft) = $${stairRes.stringersCost}`,
                            `Treads Material: ${stairRes.numTreads} treads = $${stairRes.treadsCost}`,
                            `Riser Boards: ${stairRes.numRisers} risers = $${stairRes.risersCost}`,
                            `Handrail: ${stairRes.totalHandrailFt} Linear Feet (${stairState.handrailSides} sides) = $${stairRes.handrailCost}`,
                            `Newel Posts: ${stairRes.totalNewelPosts} posts = $${stairRes.postsCost}`,
                            `Balusters: ${stairRes.totalBalusters} balusters (<4" gap) = $${stairRes.balustersCost}`,
                            `Hardware & Fasteners = $${stairRes.totalHardwareCost}`,
                            `Materials Subtotal: $${stairRes.materialsSubtotal.toLocaleString()}`,
                            `Carpentry Labor (${stairState.estimatedLaborHours} hrs @ $${stairState.laborRatePerHour}/hr): $${stairRes.laborCost.toLocaleString()}`,
                            `TOTAL PROJECT ESTIMATE: $${stairRes.totalProjectCost.toLocaleString()}`,
                          ].join('\n');
                          copyTakeoff(takeoffSummary);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold rounded bg-sky-700 text-white hover:bg-sky-800 transition-colors cursor-pointer"
                      >
                        {copiedText || '📋 Copy Material Takeoff'}
                      </button>
                    </div>

                    <table className="w-full text-xs font-mono text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                          <th className="py-2">Item Description</th>
                          <th className="py-2">Specification</th>
                          <th className="py-2 text-center">Quantity</th>
                          <th className="py-2 text-right">Unit Price</th>
                          <th className="py-2 text-right">Ext. Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        <tr>
                          <td className="py-2 font-sans font-medium">2×12 Cut Stringers</td>
                          <td className="py-2 text-slate-500">2×12 × {stairRes.standardBoardFt} ft Select Structural</td>
                          <td className="py-2 text-center">{stairRes.stringerCount} boards</td>
                          <td className="py-2 text-right">${stairState.stringerBoardPrice.toFixed(2)}</td>
                          <td className="py-2 text-right font-bold">${stairRes.stringersCost.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-sans font-medium">Stair Treads</td>
                          <td className="py-2 text-slate-500">Bullnose {stairState.stairWidthIn}″ × {stairRes.totalTreadDepthIn}″</td>
                          <td className="py-2 text-center">{stairRes.numTreads} (+10% cut)</td>
                          <td className="py-2 text-right">${stairState.treadPrice.toFixed(2)}</td>
                          <td className="py-2 text-right font-bold">${stairRes.treadsCost.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-sans font-medium">Riser Boards</td>
                          <td className="py-2 text-slate-500">1×8 × {stairState.stairWidthIn}″ Finish Riser</td>
                          <td className="py-2 text-center">{stairRes.numRisers} (+10% cut)</td>
                          <td className="py-2 text-right">${stairState.riserBoardPrice.toFixed(2)}</td>
                          <td className="py-2 text-right font-bold">${stairRes.risersCost.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-sans font-medium">Handrail Stock</td>
                          <td className="py-2 text-slate-500">Grip Profile ({stairState.handrailSides} side)</td>
                          <td className="py-2 text-center">{stairRes.totalHandrailFt} Lin Ft</td>
                          <td className="py-2 text-right">${stairState.handrailPricePerFt.toFixed(2)}</td>
                          <td className="py-2 text-right font-bold">${stairRes.handrailCost.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-sans font-medium">Newel Posts</td>
                          <td className="py-2 text-slate-500">4×4 × 48″ Support Posts</td>
                          <td className="py-2 text-center">{stairRes.totalNewelPosts} posts</td>
                          <td className="py-2 text-right">${stairState.newelPostPrice.toFixed(2)}</td>
                          <td className="py-2 text-right font-bold">${stairRes.postsCost.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-sans font-medium">Balusters / Spindles</td>
                          <td className="py-2 text-slate-500">Square / Turned &lt; 4″ Sphere Rule</td>
                          <td className="py-2 text-center">{stairRes.totalBalusters} pcs</td>
                          <td className="py-2 text-right">${stairState.balusterPrice.toFixed(2)}</td>
                          <td className="py-2 text-right font-bold">${stairRes.balustersCost.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-sans font-medium">Hardware &amp; Fasteners</td>
                          <td className="py-2 text-slate-500">Brackets ({stairRes.totalBrackets}), Stringer Hangers, Screws</td>
                          <td className="py-2 text-center">1 Lot</td>
                          <td className="py-2 text-right">${stairRes.totalHardwareCost.toFixed(2)}</td>
                          <td className="py-2 text-right font-bold">${stairRes.totalHardwareCost.toLocaleString()}</td>
                        </tr>
                        <tr className="bg-slate-50 dark:bg-slate-950/40">
                          <td className="py-2 font-sans font-bold text-slate-800 dark:text-slate-200">
                            Materials Subtotal
                          </td>
                          <td className="py-2 text-slate-500">Including 10% cutting waste</td>
                          <td className="py-2 text-center font-bold">—</td>
                          <td className="py-2 text-right font-bold">—</td>
                          <td className="py-2 text-right font-bold text-sky-700 dark:text-sky-400">
                            ${stairRes.materialsSubtotal.toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 font-sans font-medium">Carpentry Labor</td>
                          <td className="py-2 text-slate-500">{stairState.estimatedLaborHours} hrs @ ${stairState.laborRatePerHour}/hr</td>
                          <td className="py-2 text-center">{stairState.estimatedLaborHours} hrs</td>
                          <td className="py-2 text-right">${stairState.laborRatePerHour.toFixed(2)}</td>
                          <td className="py-2 text-right font-bold">${stairRes.laborCost.toLocaleString()}</td>
                        </tr>
                        <tr className="bg-sky-50/70 dark:bg-sky-950/40 text-slate-900 dark:text-white font-bold">
                          <td className="py-2.5 font-sans text-sm">TOTAL ESTIMATED PROJECT COST</td>
                          <td className="py-2.5 text-slate-500 font-normal">Turnkey Takeoff</td>
                          <td className="py-2.5 text-center">—</td>
                          <td className="py-2.5 text-right">—</td>
                          <td className="py-2.5 text-right text-base text-sky-800 dark:text-sky-300">
                            ${stairRes.totalProjectCost.toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Educational Code Reference Guide */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 bg-white dark:bg-slate-900 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      📚 Building Code Reference: Residential (IRC) vs Commercial (IBC / ADA)
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-sans text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-mono">
                            <th className="py-1.5">Code Requirement</th>
                            <th className="py-1.5">IRC 2024 (Residential)</th>
                            <th className="py-1.5">IBC 2024 (Commercial)</th>
                            <th className="py-1.5">ADA Standards 505</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          <tr>
                            <td className="py-1.5 font-semibold">Maximum Riser Height</td>
                            <td className="py-1.5">7-3/4 inches (7.75″)</td>
                            <td className="py-1.5">7.0 inches (7.0″)</td>
                            <td className="py-1.5">7.0 inches (7.0″) max / 4.0″ min</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 font-semibold">Minimum Tread Depth</td>
                            <td className="py-1.5">10.0 inches (10.0″)</td>
                            <td className="py-1.5">11.0 inches (11.0″)</td>
                            <td className="py-1.5">11.0 inches (11.0″) min</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 font-semibold">Handrail Height</td>
                            <td className="py-1.5">34 to 38 inches above nosing</td>
                            <td className="py-1.5">34 to 38 inches above nosing</td>
                            <td className="py-1.5">34 to 38 inches continuous</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 font-semibold">Handrail Extensions</td>
                            <td className="py-1.5">Not required (returns to wall)</td>
                            <td className="py-1.5">12″ at top / 1 tread + 12″ bottom</td>
                            <td className="py-1.5">Mandatory 12″ horizontal extensions</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 font-semibold">Baluster / Guard Opening</td>
                            <td className="py-1.5">&lt; 4-inch sphere cannot pass</td>
                            <td className="py-1.5">&lt; 4-inch sphere cannot pass</td>
                            <td className="py-1.5">&lt; 4-inch sphere cannot pass</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 font-semibold">Minimum Stair Width</td>
                            <td className="py-1.5">36 inches (31.5″ with handrail)</td>
                            <td className="py-1.5">44 inches (36″ if occupant load &lt; 50)</td>
                            <td className="py-1.5">44 inches clear between handrails</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 font-semibold">Minimum Headroom</td>
                            <td className="py-1.5">6 ft 8 in (80 inches)</td>
                            <td className="py-1.5">6 ft 8 in (80 inches)</td>
                            <td className="py-1.5">80 inches minimum vertical clearance</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
            </>
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

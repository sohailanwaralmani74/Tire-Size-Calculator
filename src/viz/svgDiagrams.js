/**
 * @file Proportional inline SVG diagram generators for Wanjaaro Tire & Wheel Calculator.
 * Every diagram renders to scale based on millimeter dimensions and is labelled "Geometry only".
 */

/**
 * Generates an inline SVG string for a single tire side-profile and cross-section breakdown.
 * @param {object} tire - Output from calculateTireMetrics().data
 * @returns {string} SVG markup string
 */
export function renderSingleTireDiagram(tire) {
  const maxScaleMm = Math.max(tire.diameterMm, 920);
  const scale = 210 / maxScaleMm; // px per mm

  const outerRadiusPx = (tire.diameterMm / 2) * scale;
  const rimRadiusPx = (tire.rimMm / 2) * scale;
  const widthPx = tire.widthMm * scale;
  const sidewallPx = tire.sidewallMm * scale;

  const sideCx = 145;
  const sideCy = 135;

  const sectionX = 330;
  const sectionTopY = sideCy - outerRadiusPx;
  const sectionHeightPx = outerRadiusPx * 2;

  return `
    <svg viewBox="0 0 470 275" width="470" height="275" class="w-full h-auto max-w-[470px] mx-auto select-none" role="img" aria-label="Proportional tire geometry diagram for ${tire.label}: ${tire.diameterMm} mm overall diameter, ${tire.widthMm} mm width, ${tire.sidewallMm} mm sidewall height. Geometry only.">
      <title>Tire Geometry: ${tire.label} (Geometry Only)</title>
      <!-- Subtle blueprint grid lines -->
      <line x1="20" y1="${sideCy}" x2="450" y2="${sideCy}" stroke="currentColor" stroke-opacity="0.15" stroke-dasharray="3 3" />
      <line x1="${sideCx}" y1="20" x2="${sideCx}" y2="250" stroke="currentColor" stroke-opacity="0.15" stroke-dasharray="3 3" />

      <!-- Ground reference line -->
      <line x1="25" y1="${sideCy + outerRadiusPx}" x2="435" y2="${sideCy + outerRadiusPx}" stroke="currentColor" stroke-opacity="0.35" stroke-width="1.5" />

      <!-- Side View: Tire Outer Circle -->
      <circle cx="${sideCx}" cy="${sideCy}" r="${outerRadiusPx.toFixed(1)}" fill="currentColor" fill-opacity="0.08" stroke="currentColor" stroke-width="2" />
      <!-- Side View: Rim Circle -->
      <circle cx="${sideCx}" cy="${sideCy}" r="${rimRadiusPx.toFixed(1)}" fill="none" stroke="#0284c7" stroke-width="2" stroke-dasharray="4 2" />
      <circle cx="${sideCx}" cy="${sideCy}" r="4" fill="#0284c7" />

      <!-- Overall Diameter Dimension Line -->
      <line x1="32" y1="${(sideCy - outerRadiusPx).toFixed(1)}" x2="32" y2="${(sideCy + outerRadiusPx).toFixed(1)}" stroke="#0284c7" stroke-width="1.5" />
      <line x1="27" y1="${(sideCy - outerRadiusPx).toFixed(1)}" x2="37" y2="${(sideCy - outerRadiusPx).toFixed(1)}" stroke="#0284c7" stroke-width="1.5" />
      <line x1="27" y1="${(sideCy + outerRadiusPx).toFixed(1)}" x2="37" y2="${(sideCy + outerRadiusPx).toFixed(1)}" stroke="#0284c7" stroke-width="1.5" />
      <text x="24" y="${sideCy}" text-anchor="middle" transform="rotate(-90 24 ${sideCy})" class="text-[10px] font-mono fill-current">
        Ø ${tire.diameterMm} mm (${tire.diameterIn}")
      </text>

      <!-- Cross Section View -->
      <rect x="${(sectionX - widthPx / 2).toFixed(1)}" y="${sectionTopY.toFixed(1)}" width="${widthPx.toFixed(1)}" height="${sectionHeightPx.toFixed(1)}" rx="6" fill="currentColor" fill-opacity="0.08" stroke="currentColor" stroke-width="2" />
      <!-- Rim cutout in cross section -->
      <rect x="${(sectionX - widthPx / 2 + 4).toFixed(1)}" y="${(sideCy - rimRadiusPx).toFixed(1)}" width="${Math.max(widthPx - 8, 8).toFixed(1)}" height="${(rimRadiusPx * 2).toFixed(1)}" fill="none" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="3 2" />

      <!-- Width Dimension Line -->
      <line x1="${(sectionX - widthPx / 2).toFixed(1)}" y1="${(sectionTopY - 10).toFixed(1)}" x2="${(sectionX + widthPx / 2).toFixed(1)}" y2="${(sectionTopY - 10).toFixed(1)}" stroke="#0284c7" stroke-width="1.5" />
      <text x="${sectionX}" y="${(sectionTopY - 15).toFixed(1)}" text-anchor="middle" class="text-[10px] font-mono fill-current">
        W: ${tire.widthMm} mm
      </text>

      <!-- Sidewall Height Callout -->
      <line x1="${(sectionX + widthPx / 2 + 10).toFixed(1)}" y1="${sectionTopY.toFixed(1)}" x2="${(sectionX + widthPx / 2 + 10).toFixed(1)}" y2="${(sectionTopY + sidewallPx).toFixed(1)}" stroke="#d97706" stroke-width="1.5" />
      <text x="${(sectionX + widthPx / 2 + 16).toFixed(1)}" y="${(sectionTopY + sidewallPx / 2 + 3).toFixed(1)}" class="text-[10px] font-mono fill-current">
        SW: ${tire.sidewallMm} mm
      </text>

      <!-- Labels -->
      <text x="${sideCx}" y="264" text-anchor="middle" class="text-[11px] font-mono fill-current opacity-75">Side Profile (${tire.label})</text>
      <text x="${sectionX}" y="264" text-anchor="middle" class="text-[11px] font-mono fill-current opacity-75">Section Profile · Geometry Only</text>
    </svg>
  `;
}

/**
 * Generates an inline SVG string comparing two tires side-by-side and overlaid to scale.
 * @param {object} oldTire - Baseline tire metrics
 * @param {object} newTire - Candidate tire metrics
 * @returns {string} SVG markup string
 */
export function renderTireComparisonDiagram(oldTire, newTire) {
  const maxDia = Math.max(oldTire.diameterMm, newTire.diameterMm, 900);
  const scale = 200 / maxDia;

  const oldR = (oldTire.diameterMm / 2) * scale;
  const oldRimR = (oldTire.rimMm / 2) * scale;
  const oldW = oldTire.widthMm * scale;

  const newR = (newTire.diameterMm / 2) * scale;
  const newRimR = (newTire.rimMm / 2) * scale;
  const newW = newTire.widthMm * scale;

  // Align both tires on a shared hub center in left overlay, and shared ground plane on right cross-section
  const hubCx = 140;
  const hubCy = 135;

  const groundY = 240;
  const oldSecX = 335;
  const newSecX = 435;

  return `
    <svg viewBox="0 0 520 275" width="520" height="275" class="w-full h-auto max-w-[520px] mx-auto select-none" role="img" aria-label="Proportional comparison diagram between ${oldTire.label} (${oldTire.diameterMm} mm diameter) and ${newTire.label} (${newTire.diameterMm} mm diameter). Geometry only.">
      <title>Comparison: ${oldTire.label} vs ${newTire.label} (Geometry Only)</title>
      <!-- Shared hub axis -->
      <line x1="20" y1="${hubCy}" x2="260" y2="${hubCy}" stroke="currentColor" stroke-opacity="0.15" stroke-dasharray="3 3" />
      <line x1="${hubCx}" y1="20" x2="${hubCx}" y2="250" stroke="currentColor" stroke-opacity="0.15" stroke-dasharray="3 3" />

      <!-- Concentric Side Overlay (Hub-Centered) -->
      <!-- Baseline Tire (Dashed) -->
      <circle cx="${hubCx}" cy="${hubCy}" r="${oldR.toFixed(1)}" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="5 3" stroke-opacity="0.7" />
      <circle cx="${hubCx}" cy="${hubCy}" r="${oldRimR.toFixed(1)}" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 3" stroke-opacity="0.5" />

      <!-- New Tire (Solid Accent) -->
      <circle cx="${hubCx}" cy="${hubCy}" r="${newR.toFixed(1)}" fill="#0284c7" fill-opacity="0.08" stroke="#0284c7" stroke-width="2.2" />
      <circle cx="${hubCx}" cy="${hubCy}" r="${newRimR.toFixed(1)}" fill="none" stroke="#0284c7" stroke-width="1.4" />
      <circle cx="${hubCx}" cy="${hubCy}" r="3.5" fill="#0284c7" />

      <!-- Side-by-side Cross Sections on Shared Ground Line -->
      <line x1="280" y1="${groundY}" x2="495" y2="${groundY}" stroke="currentColor" stroke-opacity="0.4" stroke-width="1.5" />

      <!-- Baseline Section -->
      <rect x="${(oldSecX - oldW / 2).toFixed(1)}" y="${(groundY - oldR * 2).toFixed(1)}" width="${oldW.toFixed(1)}" height="${(oldR * 2).toFixed(1)}" rx="5" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="5 3" stroke-opacity="0.75" />
      <text x="${oldSecX}" y="${(groundY - oldR * 2 - 8).toFixed(1)}" text-anchor="middle" class="text-[10px] font-mono fill-current">
        ${oldTire.widthMm}mm
      </text>
      <text x="${oldSecX}" y="${groundY + 15}" text-anchor="middle" class="text-[10px] font-mono fill-current opacity-80">
        Base: ${oldTire.label}
      </text>

      <!-- Candidate Section -->
      <rect x="${(newSecX - newW / 2).toFixed(1)}" y="${(groundY - newR * 2).toFixed(1)}" width="${newW.toFixed(1)}" height="${(newR * 2).toFixed(1)}" rx="5" fill="#0284c7" fill-opacity="0.1" stroke="#0284c7" stroke-width="2.2" />
      <text x="${newSecX}" y="${(groundY - newR * 2 - 8).toFixed(1)}" text-anchor="middle" class="text-[10px] font-mono fill-current font-semibold">
        ${newTire.widthMm}mm
      </text>
      <text x="${newSecX}" y="${groundY + 15}" text-anchor="middle" class="text-[10px] font-mono fill-current font-semibold">
        New: ${newTire.label}
      </text>

      <text x="${hubCx}" y="263" text-anchor="middle" class="text-[10px] font-mono fill-current opacity-75">
        Hub-Centered Overlay (Dashed = Base, Solid = New)
      </text>
      <text x="385" y="268" text-anchor="middle" class="text-[10px] font-mono fill-current opacity-75">
        Geometry Only · Not Vehicle Clearance
      </text>
    </svg>
  `;
}

/**
 * Generates an inline SVG string for wheel offset & rim width geometry relative to the hub mounting face.
 * @param {object} oldWheel - Output of calculateWheelGeometry().data
 * @param {object} [newWheel] - Optional second wheel for comparison
 * @returns {string} SVG markup string
 */
export function renderWheelOffsetDiagram(oldWheel, newWheel = null) {
  const scale = 0.55; // px per mm horizontal, 0.35 vertical
  const vScale = 0.34;
  const hubX = 250; // Fixed vertical line representing the vehicle hub mounting surface
  const cy = 135;

  const renderWheelCross = (w, xHub, yCenter, strokeColor, dashed, labelPrefix) => {
    const halfW = (w.widthMm / 2) * scale;
    // Inboard is to the RIGHT of hubX (towards suspension), Outboard is to the LEFT of hubX (towards fender/street)
    // Centerline sits offsetMm outboard/inboard: positive offset means hub mounting face is towards the street (outboard) of centerline,
    // so the wheel centerline sits INBOARD (to the right of hubX) by +ET!
    const centerlineX = xHub + w.offsetMm * scale;
    const outerX = centerlineX - halfW; // xHub - (W/2 - ET)
    const innerX = centerlineX + halfW; // xHub + (W/2 + ET)
    const halfH = (w.rimDiameterMm / 2) * vScale;

    const dashAttr = dashed ? 'stroke-dasharray="5 3"' : '';
    const fillOpacity = dashed ? '0.03' : '0.10';

    return `
      <!-- Wheel Barrel (${labelPrefix}) -->
      <rect x="${outerX.toFixed(1)}" y="${(yCenter - halfH).toFixed(1)}" width="${(halfW * 2).toFixed(1)}" height="${(halfH * 2).toFixed(1)}" rx="3" fill="${strokeColor}" fill-opacity="${fillOpacity}" stroke="${strokeColor}" stroke-width="2" ${dashAttr} />
      <!-- Wheel Centerline -->
      <line x1="${centerlineX.toFixed(1)}" y1="${(yCenter - halfH - 12).toFixed(1)}" x2="${centerlineX.toFixed(1)}" y2="${(yCenter + halfH + 12).toFixed(1)}" stroke="${strokeColor}" stroke-width="1.2" stroke-dasharray="2 2" />
    `;
  };

  return `
    <svg viewBox="0 0 500 275" width="500" height="275" class="w-full h-auto max-w-[500px] mx-auto select-none" role="img" aria-label="Wheel offset and backspacing geometry diagram relative to hub mounting surface. Geometry only.">
      <title>Wheel Offset Geometry (Geometry Only)</title>

      <!-- Direction Labels -->
      <text x="35" y="24" class="text-[11px] font-mono fill-current opacity-80">← OUTBOARD (Street / Fender side)</text>
      <text x="465" y="24" text-anchor="end" class="text-[11px] font-mono fill-current opacity-80">INBOARD (Suspension / Strut side) →</text>

      <!-- Fixed Hub Mounting Face Plane -->
      <line x1="${hubX}" y1="32" x2="${hubX}" y2="238" stroke="#dc2626" stroke-width="2.5" />
      <text x="${hubX}" y="252" text-anchor="middle" class="text-[10px] font-mono fill-current font-semibold">
        Hub Mounting Face (0 mm ref)
      </text>

      ${renderWheelCross(oldWheel, hubX, cy, 'currentColor', Boolean(newWheel), 'Baseline')}
      ${newWheel ? renderWheelCross(newWheel, hubX, cy, '#0284c7', false, 'Comparison') : ''}

      <text x="250" y="268" text-anchor="middle" class="text-[10px] font-mono fill-current opacity-70">
        Geometry Only · Dashed = ${oldWheel.label}${newWheel ? ` · Solid Blue = ${newWheel.label}` : ''}
      </text>
    </svg>
  `;
}

/**
 * Generates an interactive two-setup overlay SVG for the Visualizer & Fitment tabs.
 * Shows tire width, sidewall, rim diameter & width, offset, and inner/outer edge movement relative to hub face.
 * Strictly geometry only — no fenders, suspension arms, or vehicle body parts.
 *
 * @param {object} fitmentData - Output of calculateCombinedFitment().data
 * @returns {string} SVG markup string
 */
export function renderCombinedOverlayVisualizer(fitmentData) {
  const { oldTire, newTire } = fitmentData.tires;
  const { oldWheel, newWheel } = fitmentData.wheels;
  const scale = 0.27; // 1 mm = 0.27 px so up to 950mm tall fits comfortably in 280px height

  const groundY = 265;
  // Left view: Side profile concentric on hub
  const sideCx = 145;
  const sideCy = 145;

  const oldOuterR = (oldTire.diameterMm / 2) * scale;
  const oldRimR = (oldTire.rimMm / 2) * scale;
  const newOuterR = (newTire.diameterMm / 2) * scale;
  const newRimR = (newTire.rimMm / 2) * scale;

  // Right view: Cross-section relative to fixed hub plane
  const hubX = 395;
  const drawCrossSetup = (tire, wheel, color, dashed) => {
    const tireHalfW = (tire.widthMm / 2) * scale;
    const rimHalfW = (wheel.widthMm / 2) * scale;
    const tireHalfH = (tire.diameterMm / 2) * scale;
    const rimHalfH = (tire.rimMm / 2) * scale;

    // Centerline relative to hubX (positive ET shifts wheel centerline inboard = to the right)
    const clX = hubX + wheel.offsetMm * scale;
    const dash = dashed ? 'stroke-dasharray="5 3"' : '';
    const fillOp = dashed ? '0.03' : '0.10';

    return `
      <!-- Tire Cross Section -->
      <rect x="${(clX - tireHalfW).toFixed(1)}" y="${(sideCy - tireHalfH).toFixed(1)}" width="${(tireHalfW * 2).toFixed(1)}" height="${(tireHalfH * 2).toFixed(1)}" rx="6" fill="${color}" fill-opacity="${fillOp}" stroke="${color}" stroke-width="2" ${dash} />
      <!-- Wheel Rim Barrel -->
      <rect x="${(clX - rimHalfW).toFixed(1)}" y="${(sideCy - rimHalfH).toFixed(1)}" width="${(rimHalfW * 2).toFixed(1)}" height="${(rimHalfH * 2).toFixed(1)}" rx="2" fill="none" stroke="${color}" stroke-width="1.6" ${dash} />
      <!-- Centerline -->
      <line x1="${clX.toFixed(1)}" y1="${(sideCy - tireHalfH - 8).toFixed(1)}" x2="${clX.toFixed(1)}" y2="${(sideCy + tireHalfH + 8).toFixed(1)}" stroke="${color}" stroke-width="1" stroke-dasharray="2 2" />
    `;
  };

  return `
    <svg viewBox="0 0 540 295" width="540" height="295" class="w-full h-auto max-w-[540px] mx-auto select-none" role="img" aria-label="Proportional two-setup tire and wheel geometry overlay comparing ${oldTire.label} on ${oldWheel.label} vs ${newTire.label} on ${newWheel.label}. Geometry only.">
      <title>Two-Setup Proportional Overlay (Geometry Only)</title>

      <!-- Left Panel: Concentric Side View -->
      <line x1="20" y1="${sideCy}" x2="270" y2="${sideCy}" stroke="currentColor" stroke-opacity="0.15" stroke-dasharray="3 3" />
      <line x1="${sideCx}" y1="20" x2="${sideCx}" y2="270" stroke="currentColor" stroke-opacity="0.15" stroke-dasharray="3 3" />

      <!-- Old Tire/Rim -->
      <circle cx="${sideCx}" cy="${sideCy}" r="${oldOuterR.toFixed(1)}" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="5 3" stroke-opacity="0.7" />
      <circle cx="${sideCx}" cy="${sideCy}" r="${oldRimR.toFixed(1)}" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="3 3" stroke-opacity="0.6" />

      <!-- New Tire/Rim -->
      <circle cx="${sideCx}" cy="${sideCy}" r="${newOuterR.toFixed(1)}" fill="#0284c7" fill-opacity="0.09" stroke="#0284c7" stroke-width="2.2" />
      <circle cx="${sideCx}" cy="${sideCy}" r="${newRimR.toFixed(1)}" fill="none" stroke="#0284c7" stroke-width="1.6" />
      <circle cx="${sideCx}" cy="${sideCy}" r="3.5" fill="#0284c7" />

      <!-- Right Panel: Cross Section on Hub Face -->
      <text x="315" y="20" class="text-[10px] font-mono fill-current opacity-80">← OUTBOARD</text>
      <text x="520" y="20" text-anchor="end" class="text-[10px] font-mono fill-current opacity-80">INBOARD →</text>

      <!-- Hub Mounting Surface Line -->
      <line x1="${hubX}" y1="26" x2="${hubX}" y2="${groundY}" stroke="#dc2626" stroke-width="2" />
      <text x="${hubX}" y="${groundY + 13}" text-anchor="middle" class="text-[10px] font-mono fill-current font-semibold">Hub Face</text>

      ${drawCrossSetup(oldTire, oldWheel, 'currentColor', true)}
      ${drawCrossSetup(newTire, newWheel, '#0284c7', false)}

      <text x="${sideCx}" y="286" text-anchor="middle" class="text-[10px] font-mono fill-current opacity-75">Side Diameter Overlay</text>
      <text x="410" y="286" text-anchor="middle" class="text-[10px] font-mono fill-current opacity-75">Offset &amp; Width Overlay · Geometry Only</text>
    </svg>
  `;
}

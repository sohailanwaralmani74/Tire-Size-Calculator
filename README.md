# Wanjaaro Tire & Wheel Calculator

Production-grade, browser-only single-page application and reference guide for **Wanjaaro**, designed around the central question:

> *"I have 265/70R17 and I'm thinking about 285/75R17. What changes?"*

All calculations execute locally in JavaScript with zero external calculation dependencies, zero backend requirements, and strict separation between **calculated geometry** and **vehicle-specific physical clearance**.

## Code Structure

- `/index.html` — Prerendered semantic HTML shell containing the static worked example table (`265/70R17` vs `285/75R17`), all editorial reference sections, methodology, limitations, visible FAQ, JSON-LD structured data, and `<noscript>` fallback.
- `/src/calc/tireMath.js` — Pure, zero-DOM calculation and validation module implementing tire dimensions, multi-tire comparison, wheel offset (ET) & backspacing geometry, combined fitment, effective axle gearing, speedometer error, and verified load/speed table decoding.
- `/src/viz/svgDiagrams.js` — Proportional inline SVG generators for single-tire breakdown, side-by-side comparison, wheel offset geometry, and two-setup overlays (all explicitly labelled *Geometry only*).
- `/src/ui/urlState.js` — Shared workspace state, preset definitions, and URL query parameter serialization/validation.
- `/src/ui/WorkspaceApp.js` — Interactive 8-tab workspace (`Compare`, `Calculator`, `Wheels`, `Fitment`, `Gearing`, `Speedometer`, `Decoder`, `Visualizer`) with keyboard accessibility, ARIA tab roles, metric/inch toggles, print support, and dark/light theme.
- `/styles/main.css` — Tabular numeral enforcement (`tabular-nums`) and dedicated `@media print` stylesheet.
- `/tests/calc.test.js` — Zero-dependency unit test suite runnable with the Node.js built-in test runner.
- `/public/robots.txt`, `/public/sitemap.xml`, `/public/llms.txt` — Search and crawler metadata files.

## Running & Testing Locally

### 1. Run Unit Tests (Zero Dependencies, Node Built-in Runner)

```bash
node --test tests/calc.test.js
# or
npm test
```

The test suite verifies common sizes, small and large tires, decimals, `mm`/`inch` conversions, invalid/missing input error objects, positive/zero/negative wheel offsets, and the exact required fixtures:
- `265/70R17`: sidewall `185.5 mm`, diameter `802.8 mm` (`31.61 in`), circumference `~2522 mm`, `~638 revs/mile`
- `285/75R17`: sidewall `213.75 mm`, diameter `859.3 mm` (`33.83 in`), circumference `~2700 mm`, `~596 revs/mile`
- Change: `+56.5 mm` (`+2.22 in`) diameter (`+7.04%`), `+20 mm` width, `~28 mm` (`28.25 mm`) at the axle, indicated `60 mph` reads `64.2 mph` actual.

### 2. Start Development Server

```bash
npm run dev
```

### 3. Production Build

```bash
npm run build
```

## Deploying on GitHub Pages (`wanjaaro.com`)

> **Important (Why `main.tsx` MIME type error happens if deployed from a branch):**  
> Browsers cannot execute raw `.tsx` TypeScript files directly (`MIME type "application/octet-stream"`). If GitHub Pages is set to **"Deploy from a branch"** (`main` / root), GitHub serves the uncompiled source files instead of the built JavaScript bundle.
>
> **How to fix in 10 seconds on GitHub:**
> 1. In your GitHub repository, open **Settings → Pages**.
> 2. Under **Build and deployment → Source**, change **"Deploy from a branch"** to **"GitHub Actions"**.
> 3. The included workflow (`.github/workflows/deploy.yml`) automatically runs `npm run build` (compiling `src/main.tsx` into standard `.js` and `.css` in `dist/`, alongside `CNAME` for `wanjaaro.com` and `sohail-anwar-profile.svg`) and deploys the compiled `dist/` folder to GitHub Pages.


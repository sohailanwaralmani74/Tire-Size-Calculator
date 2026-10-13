/**
 * Generates unique, SEO-optimized HTML pages for each calculator
 * with Schema.org JSON-LD, worked examples, formulas, FAQ, ad units, and React bootstrap.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ALL_CALCULATORS, CALCULATOR_CATEGORIES } from './calc/buildingMath.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const AHREFS_SNIPPET = `<script src="https://analytics.ahrefs.com/analytics.js" data-key="V4gUcl5Cbnx6QFjz2rjL2Q" async></script>`;

const FAQ_DATA = {
  concrete: [
    {
      q: 'How many 80 lb bags of concrete are in a cubic yard?',
      a: 'One cubic yard of concrete equals 27 cubic feet. A standard 80 lb bag yields approximately 0.60 cubic feet of mixed concrete. Therefore, 45 bags of 80 lb concrete are required to make one cubic yard (27 ÷ 0.60 = 45 bags). With a recommended 10% waste and spillage margin, order 50 bags.'
    },
    {
      q: 'What thickness should a residential concrete slab be?',
      a: 'Residential concrete sidewalks, patios, and shed floors are typically poured 4 inches thick (using 2x4 formwork). Driveways and vehicle parking slabs intended for passenger trucks and SUVs should be 5 to 6 inches thick with #4 (1/2") rebar reinforcement on 18-inch centers.'
    },
    {
      q: 'How much does ready-mix bulk concrete cost compared to bag mix?',
      a: 'Delivered ready-mix concrete from a transit mixer typically costs $135 to $165 per cubic yard (often with a short-load charge if ordering under 4 to 5 yards). 80 lb bags cost $6.00 to $7.00 each, totaling $270 to $315 per cubic yard in materials. For jobs over 1.5 to 2 cubic yards, ready-mix delivery is generally both cheaper and significantly less labor-intensive.'
    }
  ],
  'brick-mortar': [
    {
      q: 'How many standard modular bricks do I need per square foot of wall?',
      a: 'A standard modular brick measures 7-1/2" × 2-1/4" × 3-1/2". With a standard 3/8" (0.375 inch) mortar joint, each brick covers approximately 20.67 square inches. Dividing 144 sq in by 20.67 yields approximately 6.965 bricks per square foot of single-wythe wall. Masons generally multiply net wall square footage by 7, plus a 5% to 10% waste factor.'
    },
    {
      q: 'How much mortar and sand is needed per 1,000 bricks?',
      a: 'Laying 1,000 standard modular bricks with 3/8" joints requires approximately 6.5 to 7 bags of Type N or Type S masonry cement (70–80 lb bags) and roughly 0.55 tons (1,100 lbs) of clean masonry sand, or about 14 to 15 bags of pre-blended premix mortar.'
    }
  ],
  'block-cmu': [
    {
      q: 'How many 8x8x16 concrete blocks (CMU) are in a square foot of wall?',
      a: 'A standard CMU block has nominal dimensions of 8" high by 16" long (actual 7-5/8" × 7-5/8" × 15-5/8" to accommodate 3/8" mortar joints). The face area is 128 square inches (8/12 × 16/12 = 0.8889 sq ft). Dividing 1 by 0.8889 yields exactly 1.125 blocks per square foot (or 112.5 blocks per 100 square feet of wall).'
    },
    {
      q: 'What type of mortar should be used for CMU block foundation walls?',
      a: 'Type S mortar is recommended for below-grade foundation walls, retaining walls, and load-bearing CMU structures because it offers high compressive strength (minimum 1,800 psi) and superior flexural bond strength compared to Type N mortar.'
    }
  ],
  framing: [
    {
      q: 'How many wall studs do I need for a 20-foot wall at 16 inches on-center?',
      a: 'For a 20-foot straight wall, divide the length in feet by 1.333 (16 inches = 1.333 ft) and add 1 for the end stud: (20 ÷ 1.333) + 1 = 15 + 1 = 16 common studs. Then add 3 studs per corner, 4 studs per door opening (2 king + 2 jack/trimmers), 5 studs per window opening, plus a 10% waste factor for crooked boards.'
    },
    {
      q: 'Why are double top plates used in wall framing?',
      a: 'Double top plates tie intersecting walls and corners together into a rigid diaphragm and transfer roof truss or floor joist loads safely down through the studs, even when rafters do not align directly over studs.'
    }
  ],
  sheathing: [
    {
      q: 'How many 4x8 OSB or plywood sheets cover 1,000 square feet?',
      a: 'A single 4x8 sheet covers 32 square feet. 1,000 ÷ 32 = 31.25 sheets. Adding an industry-standard 10% allowance for cutting angles, window cutouts, and waste gives 35 sheets total.'
    },
    {
      q: 'What nail spacing is required for exterior wall sheathing?',
      a: 'Building codes typically mandate 8d common or ring-shank nails spaced 6 inches apart along supported panel edges (perimeter) and 12 inches apart along intermediate framing studs (field).'
    }
  ],
  drywall: [
    {
      q: 'How many sheets of drywall do I need for a 12x14 foot room with 8-foot ceilings?',
      a: 'The wall perimeter is (12 + 14) × 2 = 52 linear feet. Multiplied by 8 ft height = 416 sq ft. Subtracting ~40 sq ft for a door and window = 376 sq ft of walls. Ceiling area is 12 × 14 = 168 sq ft. Total area = 544 sq ft. Using 4x8 sheets (32 sq ft/sheet) gives 17 sheets; with 10% waste, order 19 sheets.'
    },
    {
      q: 'How much joint compound (mud) is required per drywall sheet?',
      a: 'A general rule of thumb is 1 bucket (4.5 gallons / 61 lbs) of ready-mix all-purpose joint compound per 400 square feet of drywall (approximately 12 to 13 sheets of 4x8 drywall).'
    }
  ],
  paint: [
    {
      q: 'How many square feet does one gallon of paint cover?',
      a: 'One gallon of quality interior wall paint typically covers 350 to 400 square feet on smooth, primed drywall. On rough, textured, or porous unprimed surfaces, coverage drops to 250 to 300 square feet per gallon.'
    },
    {
      q: 'Do I really need primer before painting new drywall?',
      a: 'Yes. Bare drywall paper and joint compound absorb paint at radically different rates. Without a PVA primer or sealer, the joint compound lines will flash through the topcoat with an uneven sheen, even after two coats of premium paint.'
    }
  ],
  roofing: [
    {
      q: 'What is a roofing square and how many shingle bundles make up a square?',
      a: 'In roofing, 1 "square" is equal to 100 square feet of roof surface. Standard asphalt architectural or 3-tab shingles are packaged 3 bundles per square. For a 24-square roof, you need 72 bundles, plus ridge cap shingles.'
    },
    {
      q: 'How does roof pitch affect the total shingles needed?',
      a: 'Roof pitch increases surface area relative to the ground footprint. For example, a 6/12 pitch has a multiplier of 1.118 (+11.8% area), an 8/12 pitch has a multiplier of 1.202 (+20.2%), and a 12/12 pitch has a multiplier of 1.414 (+41.4%).'
    }
  ],
  'flooring-tile': [
    {
      q: 'How much extra tile should I order for waste?',
      a: 'For a straight grid pattern in standard rectangular rooms, add 10% for cuts and breakage. For diagonal, herringbone, large-format tile, or rooms with many angles, add 15% to 20% waste.'
    },
    {
      q: 'How many bags of thin-set mortar do I need for 200 sq ft of tile?',
      a: 'A standard 50 lb bag of modified thin-set mortar covers approximately 40 to 50 square feet using a 1/4" × 3/8" square notch trowel. For 200 sq ft, you will need 4 to 5 bags of thin-set.'
    }
  ],
  'construction-cost': [
    {
      q: 'What percentage markup do general contractors typically charge?',
      a: 'General contractors typically charge a 15% to 20% overhead and profit markup on residential remodeling and new construction projects, with larger commercial or complex custom jobs ranging from 12% to 25%.'
    },
    {
      q: 'Why should every construction budget include a contingency reserve?',
      a: 'A 10% to 15% contingency reserve covers unexpected site conditions, price fluctuations, structural rot discovered during demolition, and minor owner change orders without halting work.'
    }
  ]
};

export function buildPageHtml(calc) {
  const category = CALCULATOR_CATEGORIES.find(c => c.id === calc.categoryId) || CALCULATOR_CATEGORIES[0];
  const faqs = FAQ_DATA[calc.id] || FAQ_DATA.concrete;

  const canonicalUrl = `https://wanjaaro.com/${calc.slug}`;
  const title = `${calc.name} – Wanjaaro Material & Cost Calculator`;
  const description = `${calc.summary} Free, instant deterministic calculations with waste margin, material takeoffs, and contractor cost breakdown.`;

  const ldJson = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "Wanjaaro",
        "url": "https://wanjaaro.com/",
        "description": "Independent construction and building material estimation calculators."
      },
      {
        "@type": "Person",
        "name": "Sohail Anwar",
        "jobTitle": "Software & Application Developer",
        "description": "12 years experience building deterministic browser utilities and engineering calculation software.",
        "url": "https://heylink.me/sohailanwaralmani74",
        "image": "https://wanjaaro.com/sohail-anwar.png",
        "knowsAbout": [
          "Construction Estimating",
          "Building Materials Calculation",
          "Software Architecture",
          "Deterministic Math Engines"
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Wanjaaro",
            "item": "https://wanjaaro.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": category.name,
            "item": `https://wanjaaro.com/${category.calculators[0].slug}`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": calc.name,
            "item": canonicalUrl
          }
        ]
      },
      {
        "@type": "WebApplication",
        "name": calc.name,
        "url": canonicalUrl,
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires JavaScript for live interactive sliders and takeoff exports.",
        "isAccessibleForFree": true,
        "author": {
          "@type": "Person",
          "name": "Sohail Anwar",
          "url": "https://heylink.me/sohailanwaralmani74"
        },
        "dateModified": calc.lastmod,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      }
    ]
  }, null, 2);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${canonicalUrl}" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Wanjaaro" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonicalUrl}" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />

    <!-- Ahrefs Analytics -->
    ${AHREFS_SNIPPET}

    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
${ldJson}
    </script>
    <link rel="stylesheet" href="./styles/app-styles.css" data-vite-ignore />
  </head>
  <body class="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-sky-600 selection:text-white">
    <!-- Interactive React Mount Point -->
    <div id="root"></div>

    <!-- Noscript & SEO Fallback for Bots -->
    <noscript>
      <div style="max-width: 1200px; margin: 2rem auto; padding: 1.5rem; font-family: system-ui, sans-serif;">
        <h1 style="font-size: 1.75rem; font-weight: bold; margin-bottom: 0.5rem;">${calc.name}</h1>
        <p style="color: #475569; margin-bottom: 1.5rem;">${calc.summary}</p>
        <p><strong>Category:</strong> ${category.name}</p>
        <p><strong>Last Modified:</strong> ${calc.lastmod}</p>

        <h2 style="font-size: 1.25rem; font-weight: bold; margin-top: 1.5rem;">Frequently Asked Questions</h2>
        ${faqs.map(f => `
          <div style="margin-top: 1rem;">
            <h3 style="font-size: 1rem; font-weight: 600;">${f.q}</h3>
            <p style="color: #334155; margin-top: 0.25rem;">${f.a}</p>
          </div>
        `).join('')}
      </div>
    </noscript>

    <!-- Global Desktop Right Ad (25% on desktop) container -->
    <div id="wanjaaro-ad-bridge" style="display: none;">
      <script async="async" data-cfasync="false" src="https://pl31111202.profitableratecpmnetwork.com/5ec3c4b0a267d356073051679993785a/invoke.js"></script>
      <div id="container-5ec3c4b0a267d356073051679993785a"></div>
    </div>

    <!-- Mobile-Compatible Bottom Bar Ad with Close Icon (Reappears after 1 minute) -->
    <div
      id="wanjaaro-mobile-bottom-ad-bar"
      role="region"
      aria-label="Mobile Advertisement"
      style="display: none;"
      class="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-300 dark:border-slate-700 shadow-xs no-print"
    >
      <div class="max-w-[1200px] mx-auto px-2 py-1.5 flex items-center justify-center relative min-h-[62px]">
        <div id="wanjaaro-mobile-bottom-ad-frame" class="flex items-center justify-center overflow-hidden"></div>
        <button
          id="wanjaaro-mobile-bottom-ad-close"
          type="button"
          aria-label="Close advertisement for 1 minute"
          title="Close ad (reappears in 1 minute)"
          class="absolute right-2 top-1.5 inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold cursor-pointer border border-slate-300 dark:border-slate-600"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Ad Injector and Dynamic Resizer -->
    <script>
      (function () {
        function mountAdIframe(containerId, key, width, height) {
          var host = document.getElementById(containerId);
          if (!host) return;
          host.innerHTML = '';
          var wrapper = document.createElement('div');
          wrapper.className = 'flex flex-col items-center justify-center overflow-hidden';
          var iframe = document.createElement('iframe');
          iframe.width = String(width);
          iframe.height = String(height);
          iframe.style.width = width + 'px';
          iframe.style.height = height + 'px';
          iframe.style.maxWidth = '100%';
          iframe.style.border = '0';
          iframe.setAttribute('scrolling', 'no');
          iframe.setAttribute('frameborder', '0');
          iframe.setAttribute('title', 'Sponsored Advertisement');
          var adHtml = '<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent;display:flex;align-items:center;justify-content:center;}</style></head><body>' +
            '<scr' + 'ipt>atOptions = { "key": "' + key + '", "format": "iframe", "height": ' + height + ', "width": ' + width + ', "params": {} };</scr' + 'ipt>' +
            '<scr' + 'ipt src="https://www.highrevenueformat.com/' + key + '/invoke.js"></scr' + 'ipt>' +
            '</body></html>';
          iframe.srcdoc = adHtml;
          wrapper.appendChild(iframe);
          host.appendChild(wrapper);
        }

        function mountMobileBottomAd(key, width, height) {
          var host = document.getElementById('wanjaaro-mobile-bottom-ad-frame');
          if (!host) return;
          host.innerHTML = '';
          var iframe = document.createElement('iframe');
          iframe.width = String(width);
          iframe.height = String(height);
          iframe.style.width = width + 'px';
          iframe.style.height = height + 'px';
          iframe.style.maxWidth = '100%';
          iframe.style.border = '0';
          iframe.setAttribute('scrolling', 'no');
          iframe.setAttribute('frameborder', '0');
          iframe.setAttribute('title', 'Mobile Advertisement');
          var adHtml = '<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent;display:flex;align-items:center;justify-content:center;}</style></head><body>' +
            '<scr' + 'ipt>atOptions = { "key": "' + key + '", "format": "iframe", "height": ' + height + ', "width": ' + width + ', "params": {} };</scr' + 'ipt>' +
            '<scr' + 'ipt src="https://www.highrevenueformat.com/' + key + '/invoke.js"></scr' + 'ipt>' +
            '</body></html>';
          iframe.srcdoc = adHtml;
          host.appendChild(iframe);
        }

        var mobileReopenTimer = null;
        function showMobileBottomBar() {
          var w = window.innerWidth || document.documentElement.clientWidth || 360;
          var bar = document.getElementById('wanjaaro-mobile-bottom-ad-bar');
          if (!bar) return;
          if (w >= 1024) {
            bar.style.display = 'none';
            document.body.style.paddingBottom = '0px';
            return;
          }
          if (w >= 500) {
            mountMobileBottomAd('f33033a8aee8cc9d080f2520e1a345cf', 468, 60);
            document.body.style.paddingBottom = '74px';
          } else {
            mountMobileBottomAd('2fd749543930cf9f83e09854bc96de8a', 320, 50);
            document.body.style.paddingBottom = '64px';
          }
          bar.style.display = 'block';
        }

        function renderResponsiveAds() {
          var w = window.innerWidth || document.documentElement.clientWidth || 1024;
          if (w >= 760) {
            mountAdIframe('wanjaaro-ad-slot-mid-1', '49fb7f861b88900800f4aa0964cec1bf', 728, 90);
          } else if (w >= 500) {
            mountAdIframe('wanjaaro-ad-slot-mid-1', 'f33033a8aee8cc9d080f2520e1a345cf', 468, 60);
          } else {
            mountAdIframe('wanjaaro-ad-slot-mid-1', '2fd749543930cf9f83e09854bc96de8a', 320, 50);
          }
          if (w >= 1024) {
            mountAdIframe('wanjaaro-ad-slot-desktop-sidebar-1', '830d5085b52c47187da5de38d29787cd', 160, 600);
            mountAdIframe('wanjaaro-ad-slot-desktop-sidebar-2', '3fa238068881377f24b1b67fa0787b9d', 160, 300);
          }
          if (!mobileReopenTimer) {
            showMobileBottomBar();
          }
        }

        var closeBtn = document.getElementById('wanjaaro-mobile-bottom-ad-close');
        if (closeBtn) {
          closeBtn.addEventListener('click', function () {
            var bar = document.getElementById('wanjaaro-mobile-bottom-ad-bar');
            var frame = document.getElementById('wanjaaro-mobile-bottom-ad-frame');
            if (bar) bar.style.display = 'none';
            if (frame) frame.innerHTML = '';
            document.body.style.paddingBottom = '0px';
            if (mobileReopenTimer) clearTimeout(mobileReopenTimer);
            mobileReopenTimer = setTimeout(function () {
              mobileReopenTimer = null;
              showMobileBottomBar();
            }, 60000);
          });
        }

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', renderResponsiveAds);
        } else {
          renderResponsiveAds();
        }
      })();
    </script>

    <!-- Application Bundle -->
    <script type="module" src="./src/app-bundle.js"></script>
  </body>
</html>`;
}

export function generateAllStaticPages() {
  for (const calc of ALL_CALCULATORS) {
    const htmlContent = buildPageHtml(calc);
    const targetFile = path.resolve(rootDir, calc.slug);
    fs.writeFileSync(targetFile, htmlContent, 'utf-8');

    // Also copy to public so Vite serves it in dev mode if requested
    const publicTarget = path.resolve(rootDir, 'public', calc.slug);
    fs.writeFileSync(publicTarget, htmlContent, 'utf-8');
  }

  // Also write the master index.html (which defaults to concrete or overall hub)
  const masterCalc = ALL_CALCULATORS[0];
  const masterHtml = buildPageHtml({
    ...masterCalc,
    slug: 'index.html',
    name: 'Wanjaaro Building Material & Cost Calculators',
    summary: 'Concrete, brick, CMU, wall framing, sheathing, drywall, paint, roofing, tile, and comprehensive construction cost estimation.',
    lastmod: '2026-10-13',
  });
  fs.writeFileSync(path.resolve(rootDir, 'index.html'), masterHtml, 'utf-8');
  fs.writeFileSync(path.resolve(rootDir, 'public/index.html'), masterHtml, 'utf-8');
}

// Run if called directly
if (process.argv[1] && process.argv[1].endsWith('generatePages.js')) {
  generateAllStaticPages();
  console.log('Successfully generated all unique calculator HTML pages.');
}

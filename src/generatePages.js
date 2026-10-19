/**
 * Generates unique, SEO-optimized HTML pages for each calculator and home page
 * with clean URLs (no .html), Schema.org JSON-LD, worked examples, formulas, FAQ, ad units, and React bootstrap.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ALL_CALCULATORS, CALCULATOR_CATEGORIES } from './calc/buildingMath.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const AHREFS_SNIPPET = `<script src="https://analytics.ahrefs.com/analytics.js" data-key="V4gUcl5Cbnx6QFjz2rjL2Q" async></script>`;

const FAQ_DATA = {
  home: [
    {
      q: 'What building materials can I calculate on Wanjaaro?',
      a: 'Wanjaaro provides deterministic calculators for concrete slabs and footings, modular/king bricks and mortar, CMU concrete blocks with core fill, 16" and 24" O.C. wall framing studs, OSB/plywood sheathing, drywall sheets and joint compound, paint coverage with primer, roofing shingles with pitch multipliers, tile and grout weight, and complete construction project cost estimates.'
    },
    {
      q: 'Are material waste margins included in calculations?',
      a: 'Yes. Each calculator includes adjustable waste percentages (typically 10% for concrete, 5–10% for masonry and tile, 10–15% for lumber and drywall, and 10–15% for roofing) to ensure takeoffs accurately reflect real-world job site cutting and breakage.'
    },
    {
      q: 'Do all calculations run locally in the browser?',
      a: 'Yes. All mathematical formulas execute 100% locally in your web browser with zero server latency, no mandatory account logins, and no paywalls.'
    }
  ],
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
      q: 'What size gap should be left between OSB or plywood sheathing panels?',
      a: 'Leave a 1/8-inch gap on all panel edges and ends when installing OSB or plywood. This expansion space prevents edge buckling and waviness when sheets absorb humidity and moisture.'
    },
    {
      q: 'How many nails are required per 4x8 sheet of wall sheathing?',
      a: 'Code (IRC) typically mandates 6-inch spacing along panel edges and 12-inch spacing along intermediate studs (field). A standard 4x8 sheet over studs at 16" o.c. requires approximately 38 to 45 nails (8d common or ring-shank).'
    }
  ],
  drywall: [
    {
      q: 'Should drywall be hung horizontally or vertically on walls?',
      a: 'Hanging 12-foot or 8-foot drywall sheets horizontally reduces total linear feet of joints by up to 25%, bridges minor stud misalignment, and places the tapered seam at comfortable chest height for finishing.'
    },
    {
      q: 'How many buckets of joint compound and rolls of tape are needed per 100 sq ft of drywall?',
      a: 'Plan on approximately 0.05 to 0.06 gallons of premixed all-purpose joint compound per square foot (about one 4.5-gallon pail per 8 sheets of 4x8 drywall). Plan on 370 feet of paper tape per 1,000 square feet of board.'
    }
  ],
  paint: [
    {
      q: 'How many square feet does one gallon of paint cover?',
      a: 'A standard gallon of quality architectural interior acrylic latex covers approximately 350 to 400 square feet on smooth, primed surfaces. On rough, unprimed drywall or masonry, coverage drops to 200 to 250 square feet per gallon.'
    },
    {
      q: 'Why is a dedicated primer coat necessary on fresh drywall?',
      a: 'New drywall paper and joint compound absorb paint at vastly different rates (called "flashing" or banding). A PVA drywall primer seals the porosity evenly, guaranteeing uniform sheen and color.'
    }
  ],
  roofing: [
    {
      q: 'What is a "square" in roofing terms?',
      a: 'A roofing square is a unit of area equal to exactly 100 square feet (10 ft × 10 ft). Standard architectural laminate asphalt shingles are packaged in 3 bundles per square.'
    },
    {
      q: 'How does roof pitch affect actual surface area?',
      a: 'Pitch increases roof area relative to horizontal building footprint. A 4/12 pitch has a multiplier of 1.054 (+5.4%), a 6/12 pitch has a multiplier of 1.118 (+11.8%), an 8/12 pitch has 1.202 (+20.2%), and a 12/12 pitch (45°) has 1.414 (+41.4%).'
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
  ],
  'stair-handrail': [
    {
      q: 'What is the maximum riser height and minimum tread run for residential stairs?',
      a: 'According to the International Residential Code (IRC 2024 Section R311.7.5), the maximum riser height is 7-3/4 inches (7.75″) and the minimum tread depth/run is 10 inches (10.0″) with a 3/4″ to 1-1/4″ nosing projection. The greatest riser height within any flight cannot exceed the smallest by more than 3/8 inch.'
    },
    {
      q: 'What is the required handrail height according to building code?',
      a: 'Both residential (IRC R311.7.8.1) and commercial (IBC 1014.2 / ADA 505.4) codes mandate handrail height between 34 inches and 38 inches measured vertically from the sloped plane of the tread nosings to the top of the handrail gripping surface.'
    },
    {
      q: 'What are the ADA requirements for handrail extensions?',
      a: 'Under ADA Standards for Accessible Design Section 505.10, handrails on commercial and public stairs must extend horizontally at least 12 inches beyond the top riser, and must continue to slope for the depth of one tread plus extend 12 inches horizontally beyond the bottom riser.'
    },
    {
      q: 'What is the 4-inch sphere rule for stair balusters and guards?',
      a: 'IRC Section R312.1.3 requires guard openings (such as between vertical balusters or spindles) to prevent the passage of a 4-inch diameter sphere up to the required 36-inch (residential) or 42-inch (commercial) guard height.'
    }
  ],
  'vapor-barrier': [
    {
      q: 'What mil thickness vapor barrier is required for crawl spaces and concrete slabs?',
      a: 'IRC Section R408.3 mandates a minimum 6 mil (0.006 inch) polyethylene vapor retarder for unvented crawl spaces with sealed seams. For heavy-duty crawl space encapsulation and under concrete slabs, building science and ASTM E1745 recommend 10 mil, 15 mil (Stego-grade), or 20 mil reinforced puncture-resistant poly.'
    },
    {
      q: 'How much should vapor barrier seams overlap?',
      a: 'Code requires a minimum 6-inch overlap between adjacent sheets, but contractors and building scientists recommend a 12-inch overlap. All seams must be taped continuously with specialized acrylic or butyl seam tape (minimum 3.75 to 4 inches wide).'
    },
    {
      q: 'How is a crawl space vapor barrier fastened to foundation walls?',
      a: 'The poly film should run up foundation perimeter walls and support piers at least 6 inches above outside ground grade (or up to within 2 inches of the sill plate), secured using rigid termination bars and masonry drive pins spaced 12 to 18 inches apart, and sealed behind with polyurethane or acoustic mastic sealant.'
    },
    {
      q: 'What is a perm rating in vapor retarder classification?',
      a: 'Permeance measures water vapor transmission. Class I vapor retarders have a perm rating of 0.1 perms or less (completely impermeable, like 10+ mil poly). Class II retarders measure between 0.1 and 1.0 perms (kraft paper facing). Class III retarders measure 1.0 to 10 perms (latex paint).'
    }
  ],
  'garage-door-size': [
    {
      q: 'How do you calculate the rough framing opening for a garage door?',
      a: 'The rough framing opening width should equal the finished door width plus 3.0 inches (allowing two 1.5-inch 2x wood goalpost side jamb liners). The rough opening height should equal the finished door height plus 1.5 inches (allowing one 1.5-inch 2x head jamb liner). For example, a 16x7 ft door requires a 16 ft 3 in wide by 7 ft 1-1/2 in high rough opening.'
    },
    {
      q: 'What size structural header is required for a 16-foot double garage door?',
      a: 'A 16-foot span carrying standard roof or floor loads requires an engineered header, typically double 1-3/4″ × 11-7/8″ LVL (Laminated Veneer Lumber) or triple 1-3/4″ × 11-7/8″ LVL beams bearing on at least double trimmers (jack studs) on each side. Dimensional lumber (like 2x10s) is insufficient for spans over 10 to 12 feet.'
    },
    {
      q: 'How much headroom is required for garage door tracks and openers?',
      a: 'Standard 12-inch or 15-inch radius curved tracks require 12 to 15 inches of vertical clearance between the top of the door opening and the lowest ceiling point. If adding an electric trolley opener, add 3 inches (totaling 15 to 18 inches headroom). If you have less than 10 inches of headroom, you must order a low-headroom dual-track conversion kit.'
    },
    {
      q: 'How much backroom depth is needed inside the garage?',
      a: 'The backroom depth required from the door opening into the garage is the door height plus 18 inches for manual operation (8 ft 6 in for a 7 ft door), or door height plus 48 inches (4 feet) for an automatic electric trolley opener (11 ft total depth).'
    }
  ],
  'door-frame-material': [
    {
      q: 'What is the standard rough opening size for an interior door?',
      a: 'The standard rough opening is door width plus 2.0 inches, and door height plus 2.5 inches. For example, a standard 36″ × 80″ interior door requires a 38″ wide by 82-1/2″ high rough opening. This provides 3/4-inch side clearance for 3/4″ jamb stock plus 1/4″ shimming space on each side.'
    },
    {
      q: 'What jamb width is required for 2x4 vs 2x6 framed walls?',
      a: 'Standard 2x4 framing (actual 3-1/2″ width) with 1/2″ drywall on both sides requires a 4-9/16″ jamb width (3.5 + 0.5 + 0.5 = 4.5 plus 1/16″ clearance). Standard 2x6 framing (actual 5-1/2″ width) with 1/2″ drywall on both sides requires a 6-9/16″ jamb width.'
    },
    {
      q: 'What is the structural difference between a king stud and a jack stud (trimmer)?',
      a: 'A king stud runs full height from the bottom wall plate to the top wall plates. A jack stud (or trimmer) is fastened to the inside face of the king stud and is cut to exact header height, directly supporting the full weight of the structural door header beam.'
    },
    {
      q: 'How many linear feet of casing molding are needed to trim a door?',
      a: 'Trimming one side of a standard 36″ × 80″ door requires two 84-inch side legs and one 42-inch head casing, totaling 17.5 linear feet (allowing for 45-degree miter cuts). Trimming both sides of the door (interior passage) requires approximately 35 to 36 linear feet of casing.'
    }
  ]
};

export function buildPageHtml(calc) {
  const isHome = !calc || !calc.id || calc.id === 'home' || calc.slug === '' || calc.slug === 'index.html';
  const category = !isHome ? (CALCULATOR_CATEGORIES.find(c => c.id === calc.categoryId) || CALCULATOR_CATEGORIES[0]) : null;
  const faqs = isHome ? FAQ_DATA.home : (FAQ_DATA[calc.id] || FAQ_DATA.concrete);

  const canonicalUrl = isHome ? 'https://wanjaaro.com/' : `https://wanjaaro.com/${calc.slug}`;
  const title = isHome
    ? 'Wanjaaro Building Material & Construction Cost Calculators'
    : `${calc.name} – Wanjaaro Material & Cost Calculator`;
  const description = isHome
    ? 'Free civil and construction material takeoffs for concrete, bricks, CMU blocks, framing studs, sheathing, drywall, paint, roofing, tile, and construction budget estimation. 100% deterministic.'
    : `${calc.summary} Free, instant deterministic calculations with waste margin, material takeoffs, and contractor cost breakdown.`;

  const ldJsonGraph = [
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
    }
  ];

  if (!isHome && category) {
    ldJsonGraph.push({
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
    });
    ldJsonGraph.push({
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
    });
  } else {
    ldJsonGraph.push({
      "@type": "WebSite",
      "name": "Wanjaaro Building Material & Cost Calculators",
      "url": "https://wanjaaro.com/",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://wanjaaro.com/?calc={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    });
    ldJsonGraph.push({
      "@type": "ItemList",
      "name": "Construction & Material Takeoff Calculators",
      "itemListElement": ALL_CALCULATORS.map((c, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": c.name,
        "url": `https://wanjaaro.com/${c.slug}`
      }))
    });
  }

  ldJsonGraph.push({
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  });

  const ldJson = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": ldJsonGraph
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
    <link rel="stylesheet" href="/styles/app-styles.css" data-vite-ignore />
  </head>
  <body class="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-sky-600 selection:text-white">
    <!-- Interactive React Mount Point -->
    <div id="root"></div>

    <!-- Noscript & SEO Fallback for Bots -->
    <noscript>
      <div style="max-width: 1200px; margin: 2rem auto; padding: 1.5rem; font-family: system-ui, sans-serif;">
        <h1 style="font-size: 1.75rem; font-weight: bold; margin-bottom: 0.5rem;">${title}</h1>
        <p style="color: #475569; margin-bottom: 1.5rem;">${description}</p>
        ${!isHome && category ? `<p><strong>Category:</strong> ${category.name}</p><p><strong>Last Modified:</strong> ${calc.lastmod}</p>` : ''}

        <h2 style="font-size: 1.25rem; font-weight: bold; margin-top: 1.5rem;">Available Building Material Calculators</h2>
        <ul style="margin-top: 0.5rem; line-height: 1.8;">
          ${ALL_CALCULATORS.map(c => `<li><a href="/${c.slug}">${c.name}</a> – ${c.summary}</li>`).join('\n          ')}
        </ul>

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
    <script type="module" src="/src/app-bundle.js"></script>
  </body>
</html>`;
}

export function generateAllStaticPages() {
  for (const calc of ALL_CALCULATORS) {
    const htmlContent = buildPageHtml(calc);

    // 1. Clean URL directory structure: /${calc.slug}/index.html
    const calcDir = path.resolve(rootDir, calc.slug);
    fs.mkdirSync(calcDir, { recursive: true });
    fs.writeFileSync(path.resolve(calcDir, 'index.html'), htmlContent, 'utf-8');

    // 2. Mirror clean directory into public/ directory for dev server and static builds
    const publicCalcDir = path.resolve(rootDir, 'public', calc.slug);
    fs.mkdirSync(publicCalcDir, { recursive: true });
    fs.writeFileSync(path.resolve(publicCalcDir, 'index.html'), htmlContent, 'utf-8');

    // Clean up any legacy root .html files to ensure clean URLs
    const legacyRootFile = path.resolve(rootDir, `${calc.slug}.html`);
    if (fs.existsSync(legacyRootFile)) {
      try { fs.unlinkSync(legacyRootFile); } catch {}
    }
    const legacyPublicFile = path.resolve(rootDir, 'public', `${calc.slug}.html`);
    if (fs.existsSync(legacyPublicFile)) {
      try { fs.unlinkSync(legacyPublicFile); } catch {}
    }
  }

  // Master homepage /
  const homeHtml = buildPageHtml({
    id: 'home',
    slug: '',
    name: 'Wanjaaro Building Material & Construction Cost Calculators',
    summary: 'Concrete, brick, CMU, wall framing, sheathing, drywall, paint, roofing, tile, stairs, vapor barriers, garage doors, door frames, and comprehensive construction cost estimation.',
    lastmod: '2026-10-18',
  });
  fs.writeFileSync(path.resolve(rootDir, 'index.html'), homeHtml, 'utf-8');
  fs.writeFileSync(path.resolve(rootDir, 'public/index.html'), homeHtml, 'utf-8');
}

// Run if called directly
if (process.argv[1] && process.argv[1].endsWith('generatePages.js')) {
  generateAllStaticPages();
  console.log('Successfully generated clean URL static calculator pages.');
}

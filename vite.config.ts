import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import { generateAllStaticPages } from './src/generatePages.js';
import { ALL_CALCULATORS } from './src/calc/buildingMath.js';

function inlineIntoHtml(rawHtml: string, cssContent: string, jsContent: string): string {
  let html = rawHtml;

  // Replace or insert <style id="wanjaaro-inline-css">...</style>
  const styleBlock = `<style id="wanjaaro-inline-css">\n${cssContent}\n</style>`;
  if (/<style id="wanjaaro-inline-css">[\s\S]*?<\/style>/.test(html)) {
    html = html.replace(/<style id="wanjaaro-inline-css">[\s\S]*?<\/style>/, () => styleBlock);
  } else {
    html = html.replace('</head>', () => `    ${styleBlock}\n  </head>`);
  }

  // Replace any external module script or existing inline bundle with <script id="wanjaaro-inline-app" type="module">...</script>
  const safeJs = jsContent.replace(/<\/script/gi, '<\\/script');
  const scriptBlock = `<script id="wanjaaro-inline-app" type="module">\n${safeJs}\n</script>`;
  if (/<script id="wanjaaro-inline-app"[\s\S]*?<\/script>/.test(html)) {
    html = html.replace(/<script id="wanjaaro-inline-app"[\s\S]*?<\/script>/, () => scriptBlock);
  } else if (/<script type="module"[^>]*><\/script>/.test(html)) {
    html = html.replace(/<script type="module"[^>]*><\/script>/, () => scriptBlock);
  } else {
    html = html.replace('</body>', () => `    ${scriptBlock}\n  </body>`);
  }

  return html;
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'self-contained-inline-html-and-dev-transform',
        transformIndexHtml: {
          order: 'pre',
          handler(html, ctx) {
            // In local Vite dev server, swap the inline JS or static script for /src/main.tsx
            if (ctx.server) {
              if (/<script id="wanjaaro-inline-app"[\s\S]*?<\/script>/.test(html)) {
                return html.replace(
                  /<script id="wanjaaro-inline-app"[\s\S]*?<\/script>/,
                  '<script type="module" src="/src/main.tsx"></script>',
                );
              }
              if (/<script type="module" src="\.\/src\/app-bundle\.js"><\/script>/.test(html)) {
                return html.replace(
                  /<script type="module" src="\.\/src\/app-bundle\.js"><\/script>/,
                  '<script type="module" src="/src/main.tsx"></script>',
                );
              }
            }
            return html;
          },
        },
        closeBundle() {
          const rootDir = process.cwd();
          const distBundle = path.resolve(rootDir, 'dist/src/app-bundle.js');
          const distCss = path.resolve(rootDir, 'dist/styles/app-styles.css');

          // 1. Generate all static pages
          generateAllStaticPages();

          if (fs.existsSync(distBundle) && fs.existsSync(distCss)) {
            const cssContent = fs.readFileSync(distCss, 'utf-8');
            const jsContent = fs.readFileSync(distBundle, 'utf-8');

            // Copy bundle to all potential entry paths for legacy / direct script links
            const jsDestinations = [
              'src/app-bundle.js',
              'app-bundle.js',
              'main.js',
              'dist/app-bundle.js',
              'dist/main.js',
            ];
            for (const rel of jsDestinations) {
              fs.writeFileSync(path.resolve(rootDir, rel), jsContent, 'utf-8');
            }

            // Copy CSS to all potential entry paths to prevent any 404s
            const cssDestinations = [
              'styles/app-styles.css',
              'styles/main.css',
              'src/app-styles.css',
              'src/main.css',
              'app-styles.css',
              'main.css',
              'dist/app-styles.css',
              'dist/main.css',
              'dist/src/app-styles.css',
              'dist/src/main.css',
              'dist/styles/main.css',
            ];
            for (const rel of cssDestinations) {
              const fullPath = path.resolve(rootDir, rel);
              fs.mkdirSync(path.dirname(fullPath), { recursive: true });
              fs.writeFileSync(fullPath, cssContent, 'utf-8');
            }

            const rootPng = path.resolve(rootDir, 'sohail-anwar.png');
            if (fs.existsSync(rootPng)) {
              fs.copyFileSync(rootPng, path.resolve(rootDir, 'src/sohail-anwar.png'));
              fs.copyFileSync(rootPng, path.resolve(rootDir, 'dist/sohail-anwar.png'));
            }

            // Sync sitemap, robots, CNAME, .nojekyll, and 404 to dist
            for (const metaFile of ['sitemap.xml', 'robots.txt', 'CNAME', '.nojekyll', '404.html']) {
              const sourcePath = path.resolve(rootDir, metaFile);
              if (fs.existsSync(sourcePath)) {
                fs.copyFileSync(sourcePath, path.resolve(rootDir, 'dist', metaFile));
              }
            }

            // Inline and copy index.html and all clean-URL directories + legacy .html files
            const indexRoot = path.resolve(rootDir, 'index.html');
            const indexDist = path.resolve(rootDir, 'dist/index.html');
            if (fs.existsSync(indexRoot)) {
              const rawHtml = fs.readFileSync(indexRoot, 'utf-8');
              const selfContainedHtml = inlineIntoHtml(rawHtml, cssContent, jsContent);
              fs.writeFileSync(indexRoot, selfContainedHtml, 'utf-8');
              fs.writeFileSync(indexDist, selfContainedHtml, 'utf-8');
            }

            for (const calc of ALL_CALCULATORS) {
              const dirHtmlPath = path.resolve(rootDir, calc.slug, 'index.html');
              const distDir = path.resolve(rootDir, 'dist', calc.slug);
              fs.mkdirSync(distDir, { recursive: true });
              const distDirHtmlPath = path.resolve(distDir, 'index.html');

              const legacyHtmlPath = path.resolve(rootDir, `${calc.slug}.html`);
              const distLegacyHtmlPath = path.resolve(rootDir, 'dist', `${calc.slug}.html`);

              if (fs.existsSync(dirHtmlPath)) {
                const rawHtml = fs.readFileSync(dirHtmlPath, 'utf-8');
                const selfContainedHtml = inlineIntoHtml(rawHtml, cssContent, jsContent);
                fs.writeFileSync(dirHtmlPath, selfContainedHtml, 'utf-8');
                fs.writeFileSync(distDirHtmlPath, selfContainedHtml, 'utf-8');
                fs.writeFileSync(legacyHtmlPath, selfContainedHtml, 'utf-8');
                fs.writeFileSync(distLegacyHtmlPath, selfContainedHtml, 'utf-8');
              }
            }
          }
        },
      },
    ],
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(process.cwd(), 'src/main.tsx'),
        },
        output: {
          inlineDynamicImports: true,
          entryFileNames: 'src/app-bundle.js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'styles/app-styles.css';
            }
            return 'src/[name][extname]';
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

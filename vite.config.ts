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
          const distBundle = path.resolve(__dirname, 'dist/src/app-bundle.js');
          const distCss = path.resolve(__dirname, 'dist/styles/app-styles.css');

          // 1. Generate all static pages
          generateAllStaticPages();

          if (fs.existsSync(distBundle) && fs.existsSync(distCss)) {
            const cssContent = fs.readFileSync(distCss, 'utf-8');
            const jsContent = fs.readFileSync(distBundle, 'utf-8');

            fs.copyFileSync(distBundle, path.resolve(__dirname, 'src/app-bundle.js'));
            fs.copyFileSync(distCss, path.resolve(__dirname, 'styles/app-styles.css'));
            fs.copyFileSync(distCss, path.resolve(__dirname, 'src/app-styles.css'));
            fs.copyFileSync(distCss, path.resolve(__dirname, 'src/main.css'));

            const rootPng = path.resolve(__dirname, 'sohail-anwar.png');
            if (fs.existsSync(rootPng)) {
              fs.copyFileSync(rootPng, path.resolve(__dirname, 'src/sohail-anwar.png'));
              fs.copyFileSync(rootPng, path.resolve(__dirname, 'dist/sohail-anwar.png'));
            }

            // Sync sitemap and 404 to dist
            const sitemapPath = path.resolve(__dirname, 'sitemap.xml');
            if (fs.existsSync(sitemapPath)) {
              fs.copyFileSync(sitemapPath, path.resolve(__dirname, 'dist/sitemap.xml'));
            }
            const errorPagePath = path.resolve(__dirname, '404.html');
            if (fs.existsSync(errorPagePath)) {
              fs.copyFileSync(errorPagePath, path.resolve(__dirname, 'dist/404.html'));
            }

            // Inline and copy all calculator pages + index.html
            const allFilesToProcess = ['index.html', ...ALL_CALCULATORS.map((c) => c.slug)];
            for (const filename of allFilesToProcess) {
              const rootPath = path.resolve(__dirname, filename);
              const distPath = path.resolve(__dirname, 'dist', filename);
              if (fs.existsSync(rootPath)) {
                const rawHtml = fs.readFileSync(rootPath, 'utf-8');
                const selfContainedHtml = inlineIntoHtml(rawHtml, cssContent, jsContent);
                fs.writeFileSync(rootPath, selfContainedHtml, 'utf-8');
                fs.writeFileSync(distPath, selfContainedHtml, 'utf-8');
              }
            }
          }
        },
      },
    ],
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'src/main.tsx'),
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

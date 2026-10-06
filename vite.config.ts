import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

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
            // In local Vite dev server, keep <style id="wanjaaro-inline-css"> intact and swap the inline JS for /src/main.tsx
            if (ctx.server) {
              return html.replace(
                /<script id="wanjaaro-inline-app"[\s\S]*?<\/script>/,
                '<script type="module" src="/src/main.tsx"></script>',
              );
            }
            return html;
          },
        },
        closeBundle() {
          const distBundle = path.resolve(__dirname, 'dist/src/app-bundle.js');
          const distCss = path.resolve(__dirname, 'dist/styles/app-styles.css');
          const rootHtmlPath = path.resolve(__dirname, 'index.html');
          const distHtmlPath = path.resolve(__dirname, 'dist/index.html');

          if (fs.existsSync(distBundle) && fs.existsSync(distCss) && fs.existsSync(rootHtmlPath)) {
            const cssContent = fs.readFileSync(distCss, 'utf-8');
            const jsContent = fs.readFileSync(distBundle, 'utf-8');
            const rawHtml = fs.readFileSync(rootHtmlPath, 'utf-8');

            fs.copyFileSync(distBundle, path.resolve(__dirname, 'src/app-bundle.js'));
            fs.copyFileSync(distCss, path.resolve(__dirname, 'styles/app-styles.css'));
            fs.copyFileSync(distCss, path.resolve(__dirname, 'src/app-styles.css'));
            fs.copyFileSync(distCss, path.resolve(__dirname, 'src/main.css'));

            const rootPng = path.resolve(__dirname, 'sohail-anwar.png');
            if (fs.existsSync(rootPng)) {
              fs.copyFileSync(rootPng, path.resolve(__dirname, 'src/sohail-anwar.png'));
            }

            const selfContainedHtml = inlineIntoHtml(rawHtml, cssContent, jsContent);
            fs.writeFileSync(rootHtmlPath, selfContainedHtml, 'utf-8');
            fs.writeFileSync(distHtmlPath, selfContainedHtml, 'utf-8');
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
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

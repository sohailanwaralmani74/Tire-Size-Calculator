import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'serve-dev-or-sync-prod-bundle',
        transformIndexHtml(html, ctx) {
          // During `vite` dev server, swap `./src/app-bundle.js` for `/src/main.tsx` so HMR/TSX compilation works natively
          if (ctx.server) {
            return html.replace('./src/app-bundle.js', '/src/main.tsx');
          }
          return html;
        },
        closeBundle() {
          const distBundle = path.resolve(__dirname, 'dist/src/app-bundle.js');
          const distCss = path.resolve(__dirname, 'dist/styles/app-styles.css');

          const ensureDir = (dirPath: string) => {
            if (!fs.existsSync(dirPath)) {
              fs.mkdirSync(dirPath, {recursive: true});
            }
          };

          ensureDir(path.resolve(__dirname, 'assets'));
          ensureDir(path.resolve(__dirname, 'public/assets'));
          ensureDir(path.resolve(__dirname, 'dist/assets'));

          if (fs.existsSync(distCss)) {
            const cssContent = fs.readFileSync(distCss, 'utf-8');
            const injectJs = `// Auto-generated inline CSS injector so styles always load regardless of server MIME type or path\nexport function injectAppStyles() {\n  if (typeof document === 'undefined') return;\n  if (document.getElementById('wanjaaro-compiled-styles')) return;\n  const style = document.createElement('style');\n  style.id = 'wanjaaro-compiled-styles';\n  style.textContent = ${JSON.stringify(cssContent)};\n  document.head.appendChild(style);\n}\ninjectAppStyles();\n`;
            fs.writeFileSync(path.resolve(__dirname, 'src/injectStyles.js'), injectJs, 'utf-8');

            fs.copyFileSync(distCss, path.resolve(__dirname, 'styles/app-styles.css'));
            fs.copyFileSync(distCss, path.resolve(__dirname, 'assets/app-styles.css'));
            fs.copyFileSync(distCss, path.resolve(__dirname, 'public/assets/app-styles.css'));
            fs.copyFileSync(distCss, path.resolve(__dirname, 'dist/assets/app-styles.css'));
          }

          if (fs.existsSync(distBundle)) {
            fs.copyFileSync(distBundle, path.resolve(__dirname, 'src/app-bundle.js'));
            fs.copyFileSync(distBundle, path.resolve(__dirname, 'assets/app-bundle.js'));
            fs.copyFileSync(distBundle, path.resolve(__dirname, 'public/assets/app-bundle.js'));
            fs.copyFileSync(distBundle, path.resolve(__dirname, 'dist/assets/app-bundle.js'));
          }

          const rootHtmlPath = path.resolve(__dirname, 'index.html');
          const distHtmlPath = path.resolve(__dirname, 'dist/index.html');
          if (fs.existsSync(rootHtmlPath)) {
            fs.copyFileSync(rootHtmlPath, distHtmlPath);
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

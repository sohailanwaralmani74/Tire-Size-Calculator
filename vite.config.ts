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
        name: 'sync-compiled-bundle-for-all-deploy-modes',
        closeBundle() {
          const distBundle = path.resolve(__dirname, 'dist/assets/app-bundle.js');
          const distCss = path.resolve(__dirname, 'dist/assets/app-styles.css');

          const ensureDir = (dirPath: string) => {
            if (!fs.existsSync(dirPath)) {
              fs.mkdirSync(dirPath, {recursive: true});
            }
          };

          ensureDir(path.resolve(__dirname, 'assets'));
          ensureDir(path.resolve(__dirname, 'public/assets'));
          ensureDir(path.resolve(__dirname, 'dist/src'));
          ensureDir(path.resolve(__dirname, 'dist/styles'));

          if (fs.existsSync(distBundle)) {
            fs.copyFileSync(distBundle, path.resolve(__dirname, 'assets/app-bundle.js'));
            fs.copyFileSync(distBundle, path.resolve(__dirname, 'public/assets/app-bundle.js'));
            fs.copyFileSync(distBundle, path.resolve(__dirname, 'src/app-bundle.js'));
            fs.copyFileSync(distBundle, path.resolve(__dirname, 'dist/src/app-bundle.js'));
          }

          if (fs.existsSync(distCss)) {
            fs.copyFileSync(distCss, path.resolve(__dirname, 'assets/app-styles.css'));
            fs.copyFileSync(distCss, path.resolve(__dirname, 'public/assets/app-styles.css'));
            fs.copyFileSync(distCss, path.resolve(__dirname, 'styles/app-styles.css'));
            fs.copyFileSync(distCss, path.resolve(__dirname, 'dist/styles/app-styles.css'));
          }

          const distHtmlPath = path.resolve(__dirname, 'dist/index.html');
          if (fs.existsSync(distHtmlPath)) {
            let html = fs.readFileSync(distHtmlPath, 'utf-8');
            if (!html.includes('app-styles.css')) {
              html = html.replace(
                '</head>',
                '    <link rel="stylesheet" href="./assets/app-styles.css" />\n  </head>',
              );
            }
            if (!html.includes('app-bundle.js')) {
              html = html.replace(
                '</body>',
                '    <script type="module" src="./assets/app-bundle.js"></script>\n  </body>',
              );
            }
            fs.writeFileSync(distHtmlPath, html, 'utf-8');
          }
        },
      },
    ],
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
        },
        output: {
          inlineDynamicImports: true,
          entryFileNames: 'assets/app-bundle.js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'assets/app-styles.css';
            }
            return 'assets/[name][extname]';
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

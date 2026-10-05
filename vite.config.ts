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
        name: 'sync-compiled-bundle-into-src-and-styles',
        buildStart() {
          fs.rmSync(path.resolve(__dirname, 'public/assets'), {recursive: true, force: true});
          fs.rmSync(path.resolve(__dirname, 'assets'), {recursive: true, force: true});
        },
        closeBundle() {
          const distBundle = path.resolve(__dirname, 'dist/src/app-bundle.js');
          const distCss = path.resolve(__dirname, 'dist/styles/app-styles.css');
          if (fs.existsSync(distBundle)) {
            fs.copyFileSync(distBundle, path.resolve(__dirname, 'src/app-bundle.js'));
          }
          if (fs.existsSync(distCss)) {
            fs.copyFileSync(distCss, path.resolve(__dirname, 'styles/app-styles.css'));
          }
        },
      },
    ],
    build: {
      rollupOptions: {
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

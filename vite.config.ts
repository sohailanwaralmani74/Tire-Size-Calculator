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
        name: 'sync-root-assets-for-github-branch-deploy',
        buildStart() {
          fs.rmSync(path.resolve(__dirname, 'public/assets'), {recursive: true, force: true});
          fs.rmSync(path.resolve(__dirname, 'assets'), {recursive: true, force: true});
        },
        closeBundle() {
          const distAssets = path.resolve(__dirname, 'dist/assets');
          const rootAssets = path.resolve(__dirname, 'assets');
          if (fs.existsSync(distAssets)) {
            fs.mkdirSync(rootAssets, {recursive: true});
            for (const file of fs.readdirSync(distAssets)) {
              fs.copyFileSync(path.join(distAssets, file), path.join(rootAssets, file));
            }
          }
        },
      },
    ],
    build: {
      rollupOptions: {
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

// Universal entry point with .js extension so static servers (like GitHub Pages branch mode)
// always serve it with MIME type "application/javascript" instead of "application/octet-stream".
import '../styles/main.css';

(async function () {
  const isViteBundledOrDev = typeof import.meta !== 'undefined' && import.meta.env;
  if (isViteBundledOrDev) {
    await import('./main.tsx');
  } else {
    if (!document.querySelector('link[href*="app-styles.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = new URL('../assets/app-styles.css', import.meta.url).href;
      document.head.appendChild(link);
    }
    const bundleUrl = new URL('./app-bundle.js', import.meta.url).href;
    await import(/* @vite-ignore */ bundleUrl);
  }
})();

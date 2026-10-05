// Universal entry point with .js extension so static servers (like GitHub Pages branch mode)
// always serve it with MIME type "application/javascript" instead of "application/octet-stream".
(async function () {
  const isViteBundledOrDev = typeof import.meta !== 'undefined' && import.meta.env;
  if (isViteBundledOrDev) {
    await import('./main.tsx');
  } else {
    const bundleUrl = new URL('../assets/app-bundle.js', import.meta.url).href;
    await import(/* @vite-ignore */ bundleUrl);
  }
})();

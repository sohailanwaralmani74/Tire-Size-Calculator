// Root-level static fallback loader in public/main.js
(async function () {
  if (!document.querySelector('link[href*="app-styles.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('./assets/app-styles.css', import.meta.url).href;
    document.head.appendChild(link);
  }
  const bundleUrl = new URL('./assets/app-bundle.js', import.meta.url).href;
  await import(bundleUrl);
})();

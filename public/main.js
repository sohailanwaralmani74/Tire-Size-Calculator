// Root-level static fallback loader in public/main.js
(async function () {
  if (!document.querySelector('link[href*="app-styles.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './styles/app-styles.css';
    document.head.appendChild(link);
  }
  await import('./src/app-bundle.js');
})();

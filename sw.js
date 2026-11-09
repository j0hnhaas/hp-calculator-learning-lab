// Service worker: cache-first app shell, so the calculator works offline.
// Bump VERSION whenever a file changes.
const VERSION = 'hp45-v20';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/style.css',
  './js/app.js',
  './js/level.js',
  './js/ui/unit-circle.js',
  './js/ui/path.js',
  './js/path/chapters.js',
  './js/i18n.js',
  './js/glossary.js',
  './js/ui/sheet.js',
  './js/ui/rpn-guide.js',
  './js/ui/story.js',
  './js/ui/story-arith.js',
  './js/engine/arith.js',
  './js/engine/cost.js',
  './js/engine/extra.js',
  './js/ui/story-recipe.js',
  './js/ui/blocks.js',
  './js/keyhelp.js',
  './js/ui/keyhelp-ui.js',
  './js/calc/hp45.js',
  './js/calc/keys.js',
  './js/engine/constants.js',
  './js/engine/convergence.js',
  './js/engine/cordic.js',
  './js/engine/decimal.js',
  './js/engine/functions.js',
  './js/ui/calculator.js',
  './js/ui/display.js',
  './js/ui/lab.js',
  './images/wood.svg',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  // cache: 'reload' bypasses the browser's HTTP cache (GitHub Pages: max-age 600),
  // so a new version never stores stale files
  e.waitUntil(
    caches.open(VERSION)
      .then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  // the page itself: network first, so updates show up right away (offline: cache)
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request, { cache: 'no-cache' })
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html')),
    );
    return;
  }
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).then((res) => {
      if (res.ok && new URL(e.request.url).origin === location.origin) {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(e.request, copy));
      }
      return res;
    })),
  );
});

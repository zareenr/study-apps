const CACHE = 'psat-tracker-v3';
const ASSETS = [
  '/study-apps/psat-tracker/',
  '/study-apps/psat-tracker/index.html',
  '/study-apps/psat-tracker/manifest.json',
  '/study-apps/psat-tracker/icon-192.png',
  '/study-apps/psat-tracker/icon-512.png'
];

// Install: cache all core assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clear old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(response => {
      // Cache successful network responses
      if (response && response.status === 200 && response.type === 'basic') {
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
      }
      return response;
    }))
  );
});

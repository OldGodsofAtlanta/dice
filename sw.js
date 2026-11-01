const CACHE_NAME = 'dice-tray-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/dice.js',
  '/style.css',
  '/manifest.json',
  'https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/dice-box.es.min.js',
  'https://www.unpkg.com/@3d-dice/theme-dice-of-rolling@0.2.1',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

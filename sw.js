const versionName = "1.0.3b1";
const cacheName = `koilors-${versionName}`;
const contentToCache = [
    "index.html",
    "koilors.js",
    "core/core.css",
    "core/livedata.js",
    "core/slider.js",
    "app.js",
    "style.css",
    "ui/roles-adaptive-dark.css",
    "ui/roles-adaptive-light.css",
    "ui/roles-dark.css",
    "ui/roles-light.css"
];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});

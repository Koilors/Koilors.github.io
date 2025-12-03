const VERSION_NAME = "1.0.2b1";

const CACHE_NAME = `koilors-${VERSION_NAME}`;

const APP_STATIC_RESOURCES = [
    "/index.html",
    "/koilors.js",
    "/core/core.css",
    "/core/livedata.js",
    "/core/slider.js",
    "/app.js",
    "/style.css",
    "/ui/roles-adaptive-dark.css",
    "/ui/roles-adaptive-light.css",
    "/ui/roles-dark.css",
    "/ui/roles-light.css"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            cache.addAll(APP_STATIC_RESOURCES);
        })(),
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            const names = await caches.keys();
            await Promise.all(
                names.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                }),
            );
            await clients.claim();
        })(),
    );
});

self.addEventListener("fetch", (e) => {
    e.respondWith(
        (async () => {
            const r = await caches.match(e.request);
            if (r) {
                return r;
            }
            const response = await fetch(e.request);
            const cache = await caches.open(CACHE_NAME);
            cache.put(e.request, response.clone());
            return response;
        })(),
    );
});
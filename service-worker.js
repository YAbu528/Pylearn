const CACHE_NAME = "pylearn-pyodide-v2";
const PYODIDE_PREFIX = "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/";

self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith("pylearn-pyodide-") && name !== CACHE_NAME).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || !request.url.startsWith(PYODIDE_PREFIX)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    if (response.ok && response.type !== "opaque") {
      try {
        await cache.put(request, response.clone());
      } catch (error) {
        // A cache quota or storage failure must never prevent Python from loading.
        console.warn("PyLearn could not cache a Python runtime file:", error);
      }
    }
    return response;
  })());
});

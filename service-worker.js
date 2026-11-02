const CACHE_NAME = "pylearn-pyodide-v1";
const PYODIDE_PREFIX = "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/";
self.addEventListener("install", event => { self.skipWaiting(); });
self.addEventListener("activate", event => { event.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", event => {
  const url = event.request.url;
  if (event.request.method !== "GET" || !url.startsWith(PYODIDE_PREFIX)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(event.request);
    if (cached) return cached;
    const response = await fetch(event.request);
    if (response.ok && (response.type === "cors" || response.type === "basic")) {
      await cache.put(event.request, response.clone());
    }
    return response;
  })());
});
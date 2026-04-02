// RT-270: Service Worker — Cache-first for static assets, network-first for API
const CACHE_NAME = 'ro-tools-v1';
const STATIC_CACHE = 'ro-tools-static-v1';

// Assets to precache
const PRECACHE_URLS = [
  '/',
  '/dashboard',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME && k !== STATIC_CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and API calls (always network-first for API)
  if (request.method !== 'GET') return;
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => new Response('{"error":"offline"}', { headers: { 'Content-Type': 'application/json' } }))
    );
    return;
  }

  // Cache-first for static assets (fonts, images, JS, CSS)
  if (url.pathname.match(/\.(woff2?|ttf|eot|png|jpg|jpeg|svg|ico|css|js)$/)) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((resp) => {
        const clone = resp.clone();
        caches.open(STATIC_CACHE).then((c) => c.put(request, clone));
        return resp;
      }))
    );
    return;
  }

  // Network-first for HTML pages
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

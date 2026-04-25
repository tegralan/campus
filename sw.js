const CACHE = 'campus-bot-v2';

const ASSETS = [
  './index.html',
  './manifest.json'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => {
        if (k !== CACHE) return caches.delete(k);
      }))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // ❌ NO cachear requests al campus o proxy
  if (url.pathname.includes('/proxy') || url.hostname.includes('unma')) {
    return;
  }

  // ✅ cache solo assets
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

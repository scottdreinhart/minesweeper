const CACHE = 'minesweeper-v1'
const OFFLINE = '/offline.html'
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.add(OFFLINE))))
self.addEventListener('fetch', e => {
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match(OFFLINE)))
  }
})

/* Lucia Outfit Lab — service worker.
   Network-first for same-origin GETs (so updates always show up),
   falling back to the cache when offline. Bump VERSION to drop old caches. */
const VERSION = 'lucia-lab-v1';
const CORE = ['./', 'index.html', 'css/styles.css', 'css/responsive.css',
    'js/data.js', 'js/engine.js', 'js/body.js', 'js/inventory.js', 'js/app.js', 'js/cash.js', 'js/catalog.js', 'js/main.js',
    'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png'];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
    e.waitUntil(caches.keys()
        .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
        .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
    const req = e.request;
    if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
    e.respondWith(
        fetch(req).then(res => {
            if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
            return res;
        }).catch(() => caches.match(req).then(hit => hit || caches.match('index.html')))
    );
});

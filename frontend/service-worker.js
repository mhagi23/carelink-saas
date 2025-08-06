const CACHE_NAME = 'carelink-v1';
const urlsToCache = [
    '/',
    '/dashboard.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/api.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});
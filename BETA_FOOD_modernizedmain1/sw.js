// =========================================================
// SERVICE WORKER - Beta Food PWA
// =========================================================
// v3.0: switched to network-first for pages/CSS/JS so a new
// deploy always shows up immediately instead of being stuck
// behind a stale cache. Images stay cache-first since they
// rarely change and are heavier to re-download.
// =========================================================

const CACHE_NAME = 'betafood-v3.0';

const CORE_FILES = [
    '/',
    '/index.html',
    '/menu.html',
    '/about.html',
    '/reviews.html',
    '/contact.html',
    '/privacy.html',
    '/terms.html',
    '/css/style.css',
    '/js/script.js',
    '/js/enhancements.js'
];

const IMAGE_FILES = [
    '/images/logo.png',
    '/images/mlogo.png',
    '/images/logo-192.png',
    '/images/logo-512.png',
    '/images/hero.jpg',
    '/images/hero1.jpg',
    '/images/hero2.jpg',
    '/images/hero3.jpg',
    '/images/Jollof Rice.jpg',
    '/images/fried rice.jpg',
    '/images/white rice and stew.jpg',
    '/images/White Rice and Bnaga.jpg',
    '/images/spaghetti 1.jpg',
    '/images/chicken.jpg',
    '/images/turkey.jpg',
    '/images/beef.jpg',
    '/images/fish.jpg',
    '/images/egg.jpg',
    '/images/plantains.jpg',
    '/images/moi moi.jpg',
    '/images/coleslaw.jpg',
    '/images/Bottled Water.jpg'
];

// =========================================================
// INSTALL - pre-cache core + image files, then activate now
// =========================================================
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(CORE_FILES.concat(IMAGE_FILES)).catch(function () {
                    // Don't fail install if one image 404s; cache what we can.
                    return Promise.all(
                        CORE_FILES.concat(IMAGE_FILES).map(function (url) {
                            return cache.add(url).catch(function () {});
                        })
                    );
                });
            })
            .then(function () {
                self.skipWaiting();
            })
    );
});

// =========================================================
// ACTIVATE - delete any old-named caches, take control now
// =========================================================
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function () {
            return self.clients.claim();
        })
    );
});

// =========================================================
// FETCH
//  - HTML/CSS/JS: network-first (always try the live server
//    first so new deploys show up right away; fall back to
//    cache only if offline).
//  - Everything else (images, fonts, etc.): cache-first.
// =========================================================
self.addEventListener('fetch', function (event) {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    const isCoreAsset = url.origin === self.location.origin &&
        (event.request.mode === 'navigate' ||
         url.pathname.endsWith('.html') ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.js') ||
         url.pathname === '/');

    if (isCoreAsset) {
        event.respondWith(
            fetch(event.request)
                .then(function (networkResponse) {
                    if (networkResponse && networkResponse.status === 200) {
                        const copy = networkResponse.clone();
                        caches.open(CACHE_NAME).then(function (cache) {
                            cache.put(event.request, copy);
                        });
                    }
                    return networkResponse;
                })
                .catch(function () {
                    return caches.match(event.request);
                })
        );
        return;
    }

    // Cache-first for images and other static assets
    event.respondWith(
        caches.match(event.request).then(function (cached) {
            if (cached) return cached;
            return fetch(event.request).then(function (networkResponse) {
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const copy = networkResponse.clone();
                    caches.open(CACHE_NAME).then(function (cache) {
                        cache.put(event.request, copy);
                    });
                }
                return networkResponse;
            });
        })
    );
});

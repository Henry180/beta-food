// =========================================================
// SERVICE WORKER – Beta Food PWA
// =========================================================

const CACHE_NAME = 'betafood-v2.0';

// ✅ NO DUPLICATES – each file listed once
const FILES_TO_CACHE = [
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
    '/images/logo.png',
    '/images/logo-192.png',
    '/images/logo-512.png',
    '/images/hero.jpg',
    '/images/hero1.jpg',
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
// INSTALL – Cache files
// =========================================================

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('📦 Cache opened');
                return cache.addAll(FILES_TO_CACHE);
            })
            .then(function() {
                self.skipWaiting();
            })
    );
});

// =========================================================
// ACTIVATE – Clean old caches
// =========================================================

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Removing old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function() {
            self.clients.claim();
        })
    );
});

// =========================================================
// FETCH – Serve from cache or network
// =========================================================

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                }
                const fetchRequest = event.request.clone();
                return fetch(fetchRequest).then(function(response) {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(function(cache) {
                            cache.put(event.request, responseToCache);
                        });
                    return response;
                });
            })
    );
});
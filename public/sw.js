const CACHE_NAME = 'habit-tracker-v1';
// Add the files you want to work offline (the "App Shell")
const ASSETS_TO_CACHE = [
    '/',
    '/login',
    '/dashboard',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png'
];

//  Install Event - Caching the App Shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Activate Event - Cleaning up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Fetch Event - Serving from cache when offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return the cached file if found, otherwise go to network
            return response || fetch(event.request).catch(() => {
                // If both fail (offline & not in cache), return the root page
                return caches.match('/');
            });
        })
    );
});
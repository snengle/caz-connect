const CACHE_NAME = 'caz-connect-cache-v1.1.3';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './index.js',
  './manifest.json',
  './professor-caz.png',
  './place.mp3',
  './win.mp3',
  './badmove.mp3',
  './default-brain.json',
  // App Icons
  './icons/icon-48x48.png',
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-120x120.png',
  './icons/icon-144x144.png',
  './icons/icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-310x150.png',
  './icons/icon-512x512.png',
  // External resources
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Roboto+Slab:wght@400;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap',
];

// Install the service worker and cache the static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching static assets');
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch(error => {
        console.error('Failed to cache static assets:', error);
      })
  );
});

// Serve cached content when offline, and cache new requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // It's in the cache. Return it.
        if (cachedResponse) {
          return cachedResponse;
        }

        // Not in cache. Go to the network.
        return fetch(event.request).then(networkResponse => {
            // If we got a good response, cache it.
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                if (!event.request.url.startsWith('chrome-extension://')) {
                    cache.put(event.request, responseToCache);
                }
              });
            }
            return networkResponse;
          }
        );
      })
  );
});

// Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Listen for a message from the client to skip waiting and activate the new SW
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
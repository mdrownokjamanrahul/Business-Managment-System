// Service Worker for হিসাব PWA
const CACHE_NAME = 'hisab-v1';
const STATIC_CACHE = 'hisab-static-v1';

// Files to cache for offline use
const STATIC_FILES = [
  '/index.html',
  '/add-product.html',
  '/sell.html',
  '/sales-history.html',
  '/due-accounts.html',
  '/stock.html',
  '/reports.html',
  '/settings.html',
  '/shared-styles.css',
  '/firebase-config.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/offline.html',
  'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap'
];

// Install event - cache static files
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      console.log('[SW] Caching static files');
      return cache.addAll(STATIC_FILES.map(url => new Request(url, { cache: 'reload' })))
        .catch(err => {
          console.log('[SW] Some files failed to cache:', err);
          // Cache what we can
          return Promise.allSettled(
            STATIC_FILES.map(url =>
              cache.add(new Request(url, { cache: 'reload' })).catch(e => console.log('[SW] Skip:', url))
            )
          );
        });
    }).then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== STATIC_CACHE && key !== CACHE_NAME)
            .map(key => {
              console.log('[SW] Deleting old cache:', key);
              return caches.delete(key);
            })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-http(s) requests (chrome-extension, data, etc.)
  if (!url.protocol.startsWith('http')) return;

  // Skip Firebase / Cloudinary / API requests (always go to network)
  if (
    url.hostname.includes('firebase') ||
    url.hostname.includes('firebaseio') ||
    (url.hostname.includes('googleapis.com') && !url.hostname.includes('fonts')) ||
    url.hostname.includes('cloudinary.com') ||
    url.hostname.includes('anthropic') ||
    event.request.method !== 'GET'
  ) {
    return; // Let browser handle normally
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Serve from cache, also update in background
        fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.ok) {
            caches.open(STATIC_CACHE).then(cache => cache.put(event.request, networkResponse.clone()));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      // Not in cache — try network
      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
          return networkResponse;
        }
        // Cache new resource
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        return networkResponse;
      }).catch(() => {
        // Offline fallback
        if (event.request.destination === 'document') {
          return caches.match('/offline.html') || caches.match('/index.html');
        }
      });
    })
  );
});

// Background sync — notify when back online
self.addEventListener('sync', event => {
  console.log('[SW] Background sync:', event.tag);
});

// Push notifications (future use)
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'হিসাব';
  const options = {
    body: data.body || 'নতুন আপডেট আছে',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    lang: 'bn',
    dir: 'ltr'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});


const CACHE_NAME = 'admin-cache-v2';
const urlsToCache = [
  '/admin/',
  '/admin/index.html',
  '/admin/favicon.svg',
  '/admin/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  // 1. API Calls: Network First, do not cache
  if (event.request.url.includes('/api/')) {
    return; 
  }

  // 2. Navigation Requests (HTML): Network First, fall back to Cache, then fall back to /admin/index.html (SPA)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request)
            .then(response => {
              // If found in cache, return it
              if (response) return response;
              // If not found (e.g. /admin/dashboard), return the entry point
              return caches.match('/admin/index.html');
            });
        })
    );
    return;
  }
  
  // 3. Static Assets: Cache First
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

// Push Notification Handler
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title: 'New Message', body: 'You have a new inquiry.' };
  
  const options = {
    body: data.body,
    icon: '/admin/favicon.svg',
    badge: '/admin/favicon.svg',
    data: {
      url: '/admin/' 
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then( windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url.includes('/admin/') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/admin/');
      }
    })
  );
});

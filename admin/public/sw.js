
const CACHE_NAME = 'admin-cache-v1';
const urlsToCache = [
  '/admin/',
  '/admin/index.html',
  '/favicon.svg'
];

self.addEventListener('install', event => {
  console.log('[SW] Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching assets');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('message', event => {
  console.log('[SW] Message received:', event.data);
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] SKIP_WAITING message received, activating immediately');
    self.skipWaiting();
  }
});

self.addEventListener('activate', event => {
  console.log('[SW] Activate event');
  event.waitUntil(
    clients.claim().then(() => {
      console.log('[SW] Claimed all clients');
    })
  );
});

self.addEventListener('fetch', event => {
  // Network first for API calls, Cache first for static assets
  if (event.request.url.includes('/api/')) {
    return; 
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('[SW] Notification clicked:', event.notification.tag);
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then( windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        // If so, just focus it.
        if (client.url.includes('/admin/') && 'focus' in client) {
          console.log('[SW] Focused existing window');
          return client.focus();
        }
      }
      // If not, open a new window/tab.
      if (clients.openWindow) {
        console.log('[SW] Opening new window');
        return clients.openWindow('/admin/');
      }
    })
  );
});

self.addEventListener('fetch', event => {
  // Network first for API calls, Cache first for static assets
  if (event.request.url.includes('/api/')) {
    return; 
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('[SW] Notification clicked:', event.notification.tag);
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then( windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        // If so, just focus it.
        if (client.url.includes('/admin/') && 'focus' in client) {
          console.log('[SW] Focused existing window');
          return client.focus();
        }
      }
      // If not, open a new window/tab.
      if (clients.openWindow) {
        console.log('[SW] Opening new window');
        return clients.openWindow('/admin/');
      }
    })
  );
});

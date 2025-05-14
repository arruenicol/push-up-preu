// public/firebase-messaging-sw.js

// Add version for cache busting
const SW_VERSION = '1.0.1';
console.log(`[Service Worker] Version ${SW_VERSION} initializing`);

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Log that the service worker has started
console.log('[Service Worker] Initializing Firebase messaging service worker');

// Configure Firebase within the service worker
firebase.initializeApp({
  apiKey: "AIzaSyBCyqBjC9dvkLY3YPUHKghN8pQjkuv4wA4",
  authDomain: "preu-uc.firebaseapp.com",
  projectId: "preu-uc",
  storageBucket: "preu-uc.firebasestorage.app",
  messagingSenderId: "993588240382",
  appId: "1:993588240382:web:ceb077d477bd2a27572aaf"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('[Service Worker] Received background message:', payload);
  
  const notificationTitle = payload.notification.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification.body || '',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data,
    // Enable vibration for mobile devices
    vibrate: [200, 100, 200]
  };

  // Explicitly show notification - needed for Vercel deployment
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Add service worker lifecycle event handlers
self.addEventListener('install', (event) => { 
  console.log('[Service Worker] Install event');
  // Force activation
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate event');
  // Take control of all clients immediately
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Clear any old caches if needed
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName.startsWith('firebase-messaging') && cacheName !== 'firebase-messaging-' + SW_VERSION) {
              return caches.delete(cacheName);
            }
            return null;
          })
        );
      })
    ])
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click:', event);
  
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/notifications';
  
  // This looks to see if the current window is already open and focuses it
  event.waitUntil(
    self.clients.matchAll({type: 'window'}).then(clientList => {
      // If a window is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.registration.scope) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      return self.clients.openWindow(urlToOpen);
    })
  );
});
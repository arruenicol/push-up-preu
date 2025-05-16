// public/firebase-messaging-sw.js
// Firebase Service Worker for Push Notifications

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

  // Construcción de la notificación
  const notificationTitle = payload.notification?.title || 'Nueva notificación';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/icons/icon-192x192.png', // Mejor icono para notificaciones
    badge: '/icons/favicon-96x96.png', // Badge visible en móviles
    data: {
      ...payload.data,
      id: `notification_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    },
    requireInteraction: true, // Mantiene la notificación hasta que el usuario la cierre
    vibrate: [200, 100, 200], // Patrón de vibración
    timestamp: Date.now(),
    renotify: true // Permite que nuevas notificaciones sobrescriban las anteriores si tienen el mismo tag
  };

  // Enviar mensaje a los clientes abiertos
  self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then(clients => {
    let notificationShown = false;
    if (clients && clients.length) {
      clients.forEach(client => {
        client.postMessage({
          type: 'NOTIFICATION_RECEIVED',
          notification: {
            title: notificationTitle,
            ...notificationOptions
          }
        });
      });
      // Forzar mostrar la notificación aunque haya clientes abiertos
      self.registration.showNotification(notificationTitle, notificationOptions)
        .then(() => {
          notificationShown = true;
          console.log('[Service Worker] Notification shown successfully (with clients open)');
        })
        .catch(error => console.error('[Service Worker] Error showing notification:', error));
    } else {
      console.log('[Service Worker] No clients available, will show notification only');
      self.registration.showNotification(notificationTitle, notificationOptions)
        .then(() => {
          notificationShown = true;
          console.log('[Service Worker] Notification shown successfully (no clients)');
        })
        .catch(error => console.error('[Service Worker] Error showing notification:', error));
    }
    setTimeout(() => {
      if (!notificationShown) {
        console.warn('[Service Worker] Notification may not have been shown. Check browser permissions and focus state.');
      }
    }, 1000);
  });
});

// Add service worker lifecycle event handlers
self.addEventListener('install', (event) => { 
  console.log('[Service Worker] Install event');
  self.skipWaiting(); // Ensure the service worker activates immediately
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate event');
  // Take control of all clients as soon as it activates
  event.waitUntil(self.clients.claim());
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click:', event);
  
  const notification = event.notification;
  const notificationId = notification.data?.id;
  
  notification.close();
  
  // This looks to see if the current window is already open and focuses it
  event.waitUntil(
    self.clients.matchAll({type: 'window'}).then(clientList => {
      // If a window is already open, focus it and send message to mark as read
      if (clientList.length > 0) {
        const client = clientList[0];
        
        // If we have a notification ID, tell the client to mark it as read
        if (notificationId) {
          client.postMessage({
            type: 'NOTIFICATION_CLICKED',
            notificationId: notificationId
          });
        }
        
        return client.focus();
      }
      
      // Otherwise open a new window
      return self.clients.openWindow('/notifications');
    })
  );
})
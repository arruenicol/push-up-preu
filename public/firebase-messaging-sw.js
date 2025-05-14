// public/firebase-messaging-sw.js

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
  
  // We don't need to call showNotification here, as Firebase will automatically
  // display the notification from the payload when in background mode.
  // This prevents the duplicate notification issue.
  
  // Just log the information
  console.log('[Service Worker] Background notification payload:', {
    title: payload.notification?.title,
    body: payload.notification?.body,
    data: payload.data
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
  
  event.notification.close();
  
  // This looks to see if the current window is already open and focuses it
  event.waitUntil(
    self.clients.matchAll({type: 'window'}).then(clientList => {
      // If a window is already open, focus it
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      // Otherwise open a new window
      return self.clients.openWindow('/notifications');
    })
  );
});
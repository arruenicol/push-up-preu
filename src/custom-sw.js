// src/custom-sw.js
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

// List of files to precache (Vite will auto-inject during build)
precacheAndRoute(self.__WB_MANIFEST)

// Cache static resources
registerRoute(
  /\.(?:js|css|png|jpg|jpeg|svg|gif|ico)$/,
  new CacheFirst({
    cacheName: 'static-resources',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
)

// Cache API requests
registerRoute(
  /\/api\//,
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
    ],
  })
)

// Cache HTML documents
registerRoute(
  ({ request }) => request.destination === 'document',
  new StaleWhileRevalidate({
    cacheName: 'documents',
  })
)

// Push Notifications
self.addEventListener('push', (event) => {
  if (!event.data) return

  const data = event.data.json()
  const options = {
    body: data.body || data.message,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    data: data.data || {},
    vibrate: [100, 50, 100],
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'Notificación', options)
  )
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',                 
      filename: 'custom-sw.js',     
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      manifest: {
        name: 'PREU UC',
        short_name: 'PREU UC',
        description: 'Aplicación para gestión de cursos y notificaciones',
        id: 'index.html',
        start_url: 'index.html',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0A0302',
        icons: [
          {
            src: 'src/icons/favicon-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: 'src/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'src/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ],
        screenshots: [
          {
              src: 'src/screenshots/wide-screenshot.png',
              sizes: '1280x720',
              type: 'image/png',
              form_factor: 'wide'
          },
          {
              src: 'src/screenshots/narrow-screenshot.png',
              sizes: '414x546',
              type: 'image/png',
              form_factor: 'narrow'
          }
        ]
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,png,svg}']
      },
      devOptions: {
        enabled: true,
        type: 'module', // ← esto puede ayudar a resolver el problema del import
      },
    }),
  ]
})
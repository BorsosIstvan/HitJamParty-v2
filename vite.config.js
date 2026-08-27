import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: 'inline',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'HitJamParty v2.0',
        short_name: 'HitJam',
        description: 'Találd ki a dalok évszámát és építsd fel az idővonaladat!',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            /* FIX: Most már a te saját 192-es ikonodat használja */
            src: 'icon/icon-192.png', 
            sizes: '192x192',
            type: 'image/png'
          },
          {
            /* FIX: És a te saját 512-es ikonodat hordozható verzióban */
            src: 'icon/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  base: '/HitJamParty-v2/',
})

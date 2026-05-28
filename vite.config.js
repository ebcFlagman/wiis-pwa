import {defineConfig} from 'vitest/config'
import react from '@vitejs/plugin-react'
import {VitePWA} from 'vite-plugin-pwa'
import tailwindcss from "@tailwindcss/vite";
import pkg from './package.json' with { type: 'json' };
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    APP_VERSION: JSON.stringify(pkg.version),
    AUTHOR: JSON.stringify(pkg.author),
    HOMEPAGE: JSON.stringify(pkg.homepage),
    GITHUB_URL: JSON.stringify(pkg.repository.url.replace('git+', '').replace('.git', '')),
    GITHUB_BUGS_URL: JSON.stringify(pkg.bugs.url),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['fake-indexeddb/auto'],
    include: ['src/**/*.test.ts'],
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',  // Automatically update Service Worker
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],  // Files to cache
      manifest: {
        name: 'Wiis',  // Full app name
        short_name: 'Wiis',  // Short name displayed on home screen
        description: 'Dein digitaler Jass-Block. Punkte zählen, Runden verfolgen, Gewinner küren – ganz ohne Papier und Bleistift.',
        theme_color: '#000000',  // Schwarz passend zum Icon-Hintergrund
        background_color: '#000000',  // Splash-Screen Schwarz
        display: 'standalone',  // Makes it look like a native app (hides browser UI)
        orientation: 'portrait',
        icons: [
          {
            src: 'ic_wiis_192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'ic_wiis_512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'ic_wiis_maskable_192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'maskable'
          },
          {
            src: 'ic_wiis_maskable_512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    })
  ]
})

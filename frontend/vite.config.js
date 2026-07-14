import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // base: './' is required for Capacitor / Android APK builds.
  // Without it, Vite outputs absolute asset paths (e.g. /assets/index.js)
  // which the Android WebView cannot resolve from the filesystem.
  // The Vite dev server is unaffected by this setting.
  base: './',

  build: {
    outDir: 'dist',   // Capacitor webDir must match this
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})

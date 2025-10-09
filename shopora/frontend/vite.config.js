// ============================================
// VITE CONFIGURATION
// ============================================
// File konfigurasi untuk Vite build tool

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // ============================================
  // PLUGINS
  // ============================================
  // Plugin React untuk support JSX dan Fast Refresh
  plugins: [react()],

  // ============================================
  // RESOLVE
  // ============================================
  // Konfigurasi untuk resolve module imports
  resolve: {
    // Alias untuk import path yang lebih clean
    // Contoh: import Button from '@/components/Button'
    // Tanpa alias: import Button from '../../../components/Button'
    alias: {
      '@': path.resolve(__dirname, './src'), // @ = src folder
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@redux': path.resolve(__dirname, './src/redux'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },

  // ============================================
  // SERVER CONFIGURATION
  // ============================================
  // Konfigurasi dev server
  server: {
    port: 5173, // Port untuk development server
    open: true, // Otomatis buka browser saat dev server start
    
    // Proxy configuration untuk API calls
    // Request ke /api akan di-forward ke backend server
    // Contoh: fetch('/api/products') -> http://localhost:5000/api/products
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Backend server URL
        changeOrigin: true, // Ubah origin header
        secure: false, // Disable SSL verification (untuk development)
      },
    },
  },

  // ============================================
  // BUILD CONFIGURATION
  // ============================================
  // Konfigurasi untuk production build
  build: {
    outDir: 'dist', // Output folder untuk production build
    sourcemap: false, // Disable sourcemap di production (untuk keamanan)
    
    // Rollup options untuk optimasi bundle
    rollupOptions: {
      output: {
        // Manual chunks untuk split bundle (untuk optimasi loading)
        manualChunks: {
          // Vendor chunk: semua package dari node_modules
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Redux chunk: semua package redux
          redux: ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },

    // Chunk size warning limit (dalam KB)
    chunkSizeWarningLimit: 1000,
  },

  // ============================================
  // PREVIEW CONFIGURATION
  // ============================================
  // Konfigurasi untuk preview production build
  preview: {
    port: 4173, // Port untuk preview server
    open: true, // Otomatis buka browser
  },
});
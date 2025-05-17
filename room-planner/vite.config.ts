import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative base path to fix asset references
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Ensure proper MIME types for JavaScript modules
    rollupOptions: {
      output: {
        // Ensure proper file extensions for JavaScript modules
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  // Configure server to set proper MIME types
  server: {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8'
    }
  }
})
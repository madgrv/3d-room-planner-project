import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '', // Empty base path to use relative URLs
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
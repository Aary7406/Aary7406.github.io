import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  build: {
    outDir: 'docs',
    cssCodeSplit: true,
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-animation': ['framer-motion', 'gsap', 'lenis'],
          'vendor-three': ['three'],
        },
      },
    },
    // Inline small assets (< 4KB) as base64
    assetsInlineLimit: 4096,
  },
})

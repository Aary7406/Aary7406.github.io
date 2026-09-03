import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import glsl from 'vite-plugin-glsl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), glsl()],
  base: '/',
  server: {
    warmup: {
      clientFiles: [
        './src/main.jsx',
        './src/App.jsx',
        './src/index.css'
      ],
    },
  },
  optimizeDeps: {
    include: [
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/free-solid-svg-icons',
      '@fortawesome/react-fontawesome',
      'framer-motion',
      'gifuct-js',
      'gsap',
      'lenis',
      'react',
      'react-dom',
      'react-router-dom',
      'three'
    ]
  },
  build: {
    outDir: 'docs',
    cssCodeSplit: true,
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-animation': ['framer-motion', 'gsap', 'lenis'],
          'vendor-three': ['three'],
          'vendor-router': ['react-router-dom'],
        },
      },
    },
    // Inline small assets (< 4KB) as base64
    assetsInlineLimit: 4096,
  },
})

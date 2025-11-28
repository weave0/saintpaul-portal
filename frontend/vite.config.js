import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
// import prerender from 'vite-plugin-prerender'; // Disabled: requires puppeteer setup

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
    // SSG prerendering disabled for now - requires puppeteer and static dir config
    // Enable with: pnpm add -D puppeteer @prerenderer/renderer-puppeteer
  ],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime'],
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: 5173, // Standard Vite port
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Backend port
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    modulePreload: {
      // Avoid preloading heavy vendor chunks on the home route - they load on-demand
      resolveDependencies: (url, deps, context) => {
        return deps.filter((dep) => 
          !dep.includes('vendor-map') && 
          !dep.includes('vendor-three') &&
          !dep.includes('vendor-utils-deferred')
        );
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          // MapLibre only - deck.gl removed (unused), mapbox-gl removed
          'vendor-map': ['react-map-gl', 'maplibre-gl'],
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei', 'r3f-perf', '@react-three/postprocessing'],
          // Split utils: core (needed on load) vs deferred (loaded lazily)
          'vendor-utils-core': ['@tanstack/react-query', 'axios', 'zustand'],
          'vendor-utils-deferred': ['date-fns', 'd3-scale', 'framer-motion']
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    css: true,
  },
});

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), glsl()],
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      chunkSizeWarningLimit: 1000, 
      
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules/three')) {
              return 'engine-three';
            }
            
            if (id.includes('node_modules/@react-three')) {
              return 'engine-fiber';
            }
            
            if (id.includes('node_modules/react/') || 
                id.includes('node_modules/react-dom/') || 
                id.includes('node_modules/react-router')) {
              return 'vendor-react';
            }
            
            if (id.includes('node_modules/@sanity')) {
              return 'vendor-sanity';
            }
            
            if (id.includes('node_modules/framer-motion')) {
              return 'vendor-motion';
            }
          }
        }
      }
    }
  };
});
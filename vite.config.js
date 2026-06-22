import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    // Vite 8 (Rolldown) requires manualChunks as a function
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor';
          }
          if (id.includes('node_modules/qrcode')) {
            return 'qr';
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
    sourcemap: false,
  },
});

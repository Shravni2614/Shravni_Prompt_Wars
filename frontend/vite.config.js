import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'https://shravni-prompt-wars-1.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
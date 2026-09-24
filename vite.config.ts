import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // For dev: all routes fallback to index.html (SPA routing)
    historyApiFallback: true,
  },
});

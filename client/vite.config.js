import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',  // Ensure the base path is set to root for local dev
  plugins: [react()],
});

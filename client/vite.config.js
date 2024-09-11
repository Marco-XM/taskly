import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // Ensure this points to the correct root
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
});

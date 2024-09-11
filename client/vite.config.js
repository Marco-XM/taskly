import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // This should match the folder used by Vercel
    rollupOptions: {
      output: {
        entryFileNames: 'index-[hash].js',  // Ensure JS files are correctly hashed and outputted
        chunkFileNames: 'chunk-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // The repository is published under /book-haven-library-management/ on GitHub Pages.
  base: '/book-haven-library-management/',
  plugins: [react()],
});

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    watch: false,
    reporters: 'verbose',
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@actions': path.resolve(__dirname, './actions'),
      '@base-components': path.resolve(__dirname, './components/base/ui'),
      '@custom-components': path.resolve(__dirname, './components/custom'),
      '@prisma': path.resolve(__dirname, './prisma'),
      '@shadcn': path.resolve(__dirname, './components/base'),
      '@ts': path.resolve(__dirname, './ts'),
    },
  },
});

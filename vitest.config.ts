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
    coverage: {
      include: [
        'actions/**/*.ts',
        'app/**/*.tsx',
        'components/custom/**/*.tsx',
        'components/forms/**/*.tsx'
      ],
      reporter: ['html', 'lcov'],
      reportsDirectory: './coverage'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@actions': path.resolve(__dirname, './actions'),
      '@base-components': path.resolve(__dirname, './components/base/ui'),
      '@custom-components': path.resolve(__dirname, './components/custom'),
      '@form-components': path.resolve(__dirname, './components/forms'),
      '@prisma/index': path.resolve(__dirname, './prisma/index.mock.ts'),
      '@prisma': path.resolve(__dirname, './prisma'),
      '@shadcn': path.resolve(__dirname, './components/base'),
      '@shared-constants': path.resolve(__dirname, './shared/constants'),
      '@shared-types': path.resolve(__dirname, './shared/ts'),
    },
  },
  define: {
    'process.env': process.env
  }
});

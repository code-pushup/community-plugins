/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/bundle-size',
  test: {
    reporters: ['basic'],
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    pool: 'threads',
    poolOptions: { threads: { singleThread: true } },
    coverage: {
      reporter: ['text', 'lcov'],
      reportsDirectory: '../../coverage/bundle-size/integration-tests',
      exclude: ['mocks/**', '**/types.ts'],
    },
    environment: 'node',
    include: ['src/**/*.integration.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    globalSetup: ['../../global-setup.ts'],
  },
});

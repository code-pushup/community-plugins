/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/plugin-knip-e2e',
  test: {
    reporters: ['basic'],
    testTimeout: 60_000,
    globals: true,
    pool: 'threads',
    poolOptions: { threads: { singleThread: true } },
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'node',
    include: ['tests/**/*.e2e.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    globalSetup: ['../../global-setup.ts'],
    setupFiles: ['../../testing/test-setup/src/lib/reset.mocks.ts'],
  },
});

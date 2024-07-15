/// <reference types="vitest" />
import { defineConfig } from 'vite';
import {tsconfigPathAliases} from "testing-utils";

console.log('PATH: ', new URL(`../../testing/src/index.ts`, import.meta.url).pathname);
export default defineConfig({
  cacheDir: '../../node_modules/.vite/plugin-cool',
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
      reportsDirectory: '../../coverage/plugin-cool/unit-tests',
      exclude: ['mocks/**', '**/types.ts'],
    },
    environment: 'node',
    include: ['src/**/*.unit.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    globalSetup: ['../../global-setup.ts'],
  },
});

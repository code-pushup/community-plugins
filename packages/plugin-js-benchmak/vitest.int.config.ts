import { defineConfig, mergeConfig } from 'vitest/config';
import { createIntTestConfig } from '../../testing/test-setup-config/src/index.js';

const baseConfig = createIntTestConfig('plugin-js-benchmark');

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      exclude: [
        ...(baseConfig.test?.exclude || []),
        // Exclude tests that require optional dependencies (benchmark, benny)
        '**/benchmark.suite-runner.int.test.ts',
        '**/benny.suite-runner.int.test.ts',
        '**/js-benchmark.plugin.int.test.ts',
      ],
    },
  }),
);

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect } from 'vitest';
import { executePlugin } from '@code-pushup/core';
import { pluginConfigSchema, type PluginConfig } from '@code-pushup/models';
import { JS_BENCHMARK_PLUGIN_SLUG } from './constants.js';
import { jsBenchmarkPlugin } from './js-benchmark.plugin';

const targetPath = path.join(
  fileURLToPath(path.dirname(import.meta.url)),
  '..',
  '..',
  '..',
  '..',
  'perf',
  'dummy-suite',
  'index.ts',
);

describe('jsBenchmarkingPlugin-execution', () => {
  // @TODO move to e2e tests when plugin is released officially
  // eslint-disable-next-line vitest/no-disabled-tests
  it.skip('should execute', async () => {
    const pluginConfig = await jsBenchmarkPlugin({
      targets: [targetPath],
    });
    expect(() => pluginConfigSchema.parse(pluginConfig)).not.toThrowError();
    await expect(
      executePlugin(pluginConfig, {
        cache: {
          read: false,
          write: false,
        },
        persist: {},
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        slug: JS_BENCHMARK_PLUGIN_SLUG,
        title: 'JS Benchmarking',
        icon: 'folder-benchmark',
        audits: [
          {
            slug: `${JS_BENCHMARK_PLUGIN_SLUG}-suite-1`,
            title: 'dummy-suite',
          },
        ],
      } satisfies Omit<PluginConfig, 'runner'>),
    );
  });
});

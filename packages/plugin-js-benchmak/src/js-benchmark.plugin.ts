import type { PluginConfig } from '@code-pushup/models';
import { ensureDirectoryExists } from '@code-pushup/utils';
import { jsBenchmarkPluginOptionsSchema } from './config.js';
import {
  JS_BENCHMARK_DEFAULT_RUNNER_PATH,
  JS_BENCHMARK_PLUGIN_SLUG,
} from './constants.js';
import { createRunnerFunction } from './runner/index.js';
import type { BenchmarkRunnerOptions } from './runner/types.js';
import { type LoadOptions, loadSuites, toAuditMetadata } from './utils.js';

export type PluginOptions = {
  targets: string[];
  runnerPath?: string;
} & LoadOptions &
  BenchmarkRunnerOptions;

export async function jsBenchmarkPlugin(
  options: PluginOptions,
): Promise<PluginConfig> {
  const {
    tsconfig,
    targets,
    outputDir = '.code-pushup',
    runnerPath = JS_BENCHMARK_DEFAULT_RUNNER_PATH,
  } = jsBenchmarkPluginOptionsSchema.parse(options);

  await ensureDirectoryExists(outputDir);
  // load the suites at before returning the plugin config to be able to return a more dynamic config
  const suites = await loadSuites(targets, { tsconfig });

  return {
    slug: JS_BENCHMARK_PLUGIN_SLUG,
    title: 'JS Benchmarking',
    icon: 'folder-benchmark',
    audits: toAuditMetadata(suites.map(({ suiteName }) => suiteName)),
    runner: createRunnerFunction(suites, { outputDir, runnerPath }),
  } satisfies PluginConfig;
}

import { z } from 'zod';
import { JS_BENCHMARK_DEFAULT_RUNNER_PATH } from './constants.js';

export const jsBenchmarkingRunnerOptionsSchema = z.object({
  runnerPath: z.string().default(JS_BENCHMARK_DEFAULT_RUNNER_PATH),
  tsconfig: z.string().optional(),
  outputDir: z.string().optional(),
  outputFileName: z.string().optional(),
  verbose: z.boolean().optional(),
});

export const jsBenchmarkPluginOptionsSchema = z.object({
  targets: z.array(z.string()),
  runnerPath: z.string().default(JS_BENCHMARK_DEFAULT_RUNNER_PATH),
  tsconfig: z.string().optional(),
  outputDir: z.string().optional(),
  verbose: z.boolean().optional(),
});

export type JsBenchmarkingPluginConfig = z.input<
  typeof jsBenchmarkPluginOptionsSchema
>;

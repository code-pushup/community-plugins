export {
  JS_BENCHMARK_PLUGIN_SLUG,
  JS_BENCHMARKING_BENCHMARK_RUNNER_PATH,
  JS_BENCHMARKING_TINYBENCH_RUNNER_PATH,
  JS_BENCHMARKING_BENNY_RUNNER_PATH,
  JS_BENCHMARK_DEFAULT_RUNNER_PATH,
} from './lib/constants.js';
export type {
  BenchmarkResult,
  SuiteConfig,
  BenchmarkRunner,
} from './lib/runner/index.js';
export { JsBenchmarkingPluginConfig } from './lib/config.js';
export { jsBenchmarkingSuiteNameToCategoryRef } from './lib/utils.js';

import { jsBenchmarkPlugin } from './lib/js-benchmark.plugin.js';
export { jsBenchmarkPlugin } from './lib/js-benchmark.plugin.js';

export default jsBenchmarkPlugin;

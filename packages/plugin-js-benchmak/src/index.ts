export {
  JS_BENCHMARK_PLUGIN_SLUG,
  JS_BENCHMARKING_BENCHMARK_RUNNER_PATH,
  JS_BENCHMARKING_TINYBENCH_RUNNER_PATH,
  JS_BENCHMARKING_BENNY_RUNNER_PATH,
  JS_BENCHMARK_DEFAULT_RUNNER_PATH,
} from './constants.js';
export type {
  BenchmarkResult,
  SuiteConfig,
  BenchmarkRunner,
} from './runner/index.js';
export { JsBenchmarkingPluginConfig } from './config.js';
import { jsBenchmarkPlugin } from './js-benchmark.plugin';

export { jsBenchmarkPlugin } from './js-benchmark.plugin';
export { jsBenchmarkingSuiteNameToCategoryRef } from './utils.js';

export default jsBenchmarkPlugin;

export const JS_BENCHMARK_PLUGIN_SLUG = 'js-benchmarking';

function withRunnerRoot(runnerName: string): string {
  return `@code-pushup/js-benchmark-plugin/src/runner/${runnerName}.suite-runner.js`;
}

export const JS_BENCHMARKING_TINYBENCH_RUNNER_PATH =
  withRunnerRoot('tinybench');
export const JS_BENCHMARKING_BENCHMARK_RUNNER_PATH =
  withRunnerRoot('benchmark');
export const JS_BENCHMARKING_BENNY_RUNNER_PATH = withRunnerRoot('benny');
export const JS_BENCHMARK_DEFAULT_RUNNER_PATH =
  JS_BENCHMARKING_TINYBENCH_RUNNER_PATH;

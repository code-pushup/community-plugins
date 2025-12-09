import path from 'node:path';

export const JS_BENCHMARK_PLUGIN_SLUG = 'js-benchmarking';

function withRunnerRoot(runnerName: string): string {
  // @TODO replace with `@code-pushup/js-benchmarking-plugin/src/runner/`
  return path.join(
    'dist',
    'examples',
    'plugins',
    `${JS_BENCHMARK_PLUGIN_SLUG}.${runnerName}.runner.js`,
  );
}

export const JS_BENCHMARKING_TINYBENCH_RUNNER_PATH =
  withRunnerRoot('tinybench');
export const JS_BENCHMARKING_BENCHMARK_RUNNER_PATH =
  withRunnerRoot('benchmark');
export const JS_BENCHMARKING_BENNY_RUNNER_PATH = withRunnerRoot('benny');
export const JS_BENCHMARK_DEFAULT_RUNNER_PATH =
  JS_BENCHMARKING_TINYBENCH_RUNNER_PATH;

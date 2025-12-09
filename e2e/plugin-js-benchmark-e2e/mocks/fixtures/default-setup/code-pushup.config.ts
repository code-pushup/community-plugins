import jsBenchmarkPlugin from '@code-pushup/js-benchmark-plugin';

export default {
  plugins: [
    await jsBenchmarkPlugin({
      targets: ['benchmarks/*.bench.js'],
    }),
  ],
};

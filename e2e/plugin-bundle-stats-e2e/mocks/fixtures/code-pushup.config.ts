import bundleStatsPlugin from '@code-pushup/bundle-stats-plugin';
import type { CoreConfig } from '@code-pushup/models';

export default {
  plugins: [
    await bundleStatsPlugin({
      bundler: 'esbuild',
      artifactsPaths: 'stats/esbuild-minimal.stats.json',
      audits: [
        {
          title: 'Bundle Size',
          description: 'Analyze bundle size and dependencies',
          selection: {
            mode: 'bundle',
            includeOutputs: ['dist/**/*.js'],
          },
          scoring: {
            enabled: true,
            totalSize: 1000000, // 1MB threshold
          },
        },
      ],
    }),
  ],
} satisfies CoreConfig;

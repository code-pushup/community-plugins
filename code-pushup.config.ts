import { CoreConfig } from '@code-pushup/models';
import { knipPlugin } from './packages/plugin-knip/src/lib';

export default {
  plugins: [
    knipPlugin({
      outputFile: '.code-pushup/knip-report.json',
    }),
  ],
} satisfies CoreConfig;

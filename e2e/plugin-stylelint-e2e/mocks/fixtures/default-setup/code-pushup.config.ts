import stylelintPlugin from '@code-pushup/stylelint-plugin';
import type { CoreConfig } from '@code-pushup/models';

export default {
  plugins: [
    await stylelintPlugin({
      stylelintrc: '.stylelintrc.json',
      patterns: ['**/*.css'],
    }),
  ],
} satisfies CoreConfig;

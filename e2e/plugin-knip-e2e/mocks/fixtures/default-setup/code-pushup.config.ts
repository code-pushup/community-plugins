import knipPlugin from '@code-pushup/knip-plugin';
import type { CoreConfig } from '@code-pushup/models';

export default {
  plugins: [await knipPlugin()],
} satisfies CoreConfig;

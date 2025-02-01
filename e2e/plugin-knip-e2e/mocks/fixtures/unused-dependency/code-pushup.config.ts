import path from 'node:path';
import { knipPlugin } from '@code-pushup/plugin-knip';
import type { CoreConfig } from '@code-pushup/models';
export default {
  plugins: [
    knipPlugin({
      workspace: path.join(__dirname, '..', '..', '..'),
    }),
  ]
} satisfies CoreConfig;

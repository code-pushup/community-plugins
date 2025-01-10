import { CoreConfig } from '@code-pushup/models';
import fileSizePlugin from './src';
import { fileSizeCategories } from './src/lib/file-size.plugin';

export default {
  plugins: [
    fileSizePlugin({
      directory: './packages/file-size',
      pattern: /\.ts$/,
      budget: 10,
    }),
  ],
  categories: [...fileSizeCategories],
} satisfies CoreConfig;

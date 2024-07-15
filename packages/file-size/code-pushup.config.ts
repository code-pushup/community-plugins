import { fileSizePlugin } from './src';

export default {
  plugins: [fileSizePlugin()],
  categories: [
    {
      slug: 'c1',
      title: 'c1',
      refs: [
        {
          slug: 'file-size-audit',
          plugin: 'file-size',
          type: 'audit',
          weight: 1,
        },
      ],
    },
  ],
};

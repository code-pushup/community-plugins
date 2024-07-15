import { pluginCoolPlugin } from './src';

export default {
  plugins: [pluginCoolPlugin()],
  categories: [
    {
      slug: 'c1',
      title: 'c1',
      refs: [
        {
          slug: 'plugin-cool-audit',
          plugin: 'plugin-cool',
          type: 'audit',
          weight: 1,
        },
      ],
    },
  ],
};

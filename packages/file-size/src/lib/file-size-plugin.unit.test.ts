import { describe, expect, it } from 'vitest';
import { pluginConfigSchema } from '@code-pushup/models';
import fileSizePlugin from './file-size-plugin';

describe('fileSizePlugin', () => {
  it('should create valid file-size plugin configuration', async () => {
    const fileSizePluginConfig = fileSizePlugin({});
    expect(() => pluginConfigSchema.parse(fileSizePluginConfig)).not.toThrow();
    expect(fileSizePluginConfig).toMatchSnapshot();
  });
});

import { describe, expect, it } from 'vitest';
import { executePlugin } from '@code-pushup/core';
import { pluginReportSchema } from '@code-pushup/models';
import fileSizePlugin from './file-size-plugin';
import { omitVariablePluginData } from 'testing-utils';

describe('fileSizePlugin', () => {
  it('should execute correctly and return valid audit outputs', async () => {
    const pluginReport = await executePlugin(fileSizePlugin());
    expect(() => pluginReportSchema.parse(pluginReport)).not.toThrow();
    expect(omitVariablePluginData(pluginReport)).toMatchSnapshot();
  });
});

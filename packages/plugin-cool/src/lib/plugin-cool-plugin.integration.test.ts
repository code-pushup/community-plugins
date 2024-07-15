import { describe, expect, it } from 'vitest';
import { executePlugin } from '@code-pushup/core';
import { pluginReportSchema } from '@code-pushup/models';
import pluginCoolPlugin from './plugin-cool-plugin';
import { omitVariablePluginData } from 'testing-utils';

describe('pluginCoolPlugin', () => {
  it('should execute correctly and return valid audit outputs', async () => {
    const pluginReport = await executePlugin(pluginCoolPlugin());
    expect(() => pluginReportSchema.parse(pluginReport)).not.toThrow();
    expect(omitVariablePluginData(pluginReport)).toMatchSnapshot();
  });
});

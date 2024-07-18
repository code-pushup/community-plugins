import { describe, expect, it } from 'vitest';
import { pluginReportSchema } from '@code-pushup/models';
import { executePlugin } from '@code-pushup/core';
import { omitVariablePluginData } from 'testing-utils';
import bundleSizePlugin from './bundle-size-plugin';

describe('bundleSizePlugin', () => {
  it('should execute correctly and return valid audit outputs', async () => {
    const pluginReport = await executePlugin(bundleSizePlugin());
    expect(() => pluginReportSchema.parse(pluginReport)).not.toThrow();
    expect(
      omitVariablePluginData(pluginReport, { omitAuditData: true }),
    ).toMatchSnapshot();
  });
});

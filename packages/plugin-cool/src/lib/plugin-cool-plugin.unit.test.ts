import { describe, expect, it } from 'vitest';
import { pluginConfigSchema } from '@code-pushup/models';
import pluginCoolPlugin from './plugin-cool-plugin';
import {omitVariablePluginData} from "testing-utils";

describe('pluginCoolPlugin', () => {
  it('should create valid plugin-cool plugin configuration', async () => {
    const pluginCoolPluginConfig = pluginCoolPlugin({});
    expect(() =>
      pluginConfigSchema.parse(pluginCoolPluginConfig),
    ).not.toThrow();
    expect(omitVariablePluginData(pluginCoolPluginConfig)).toMatchSnapshot();
  });
});

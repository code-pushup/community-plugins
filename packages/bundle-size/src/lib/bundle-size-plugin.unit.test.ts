import {describe, expect, it} from "vitest";
import {pluginConfigSchema} from "@code-pushup/models";
import bundleSizePlugin from "./bundle-size-plugin";
import {omitVariablePluginData} from "testing-utils";

describe('bundleSizePlugin', () => {

    it('should create valid bundle-size plugin configuration', async () => {
      const bundleSizePluginConfig = bundleSizePlugin({});
        expect(() => pluginConfigSchema.parse(bundleSizePluginConfig)).not.toThrow();
        expect(omitVariablePluginData(bundleSizePluginConfig)).toMatchSnapshot();
    });

});

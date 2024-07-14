import {afterEach, beforeEach, describe, expect, it} from "vitest";
import {
    addCodePushupConfigFile, cleanTestFolder,
    executeCliCollectForPlugin,
    getRelativePathToPluginDist, omitVariableReportData,
    readReportJson
} from "testing-utils";
import {resolve} from "path";
import {Report, reportSchema} from "@code-pushup/models";

describe('execute-plugin-bundle-size', () => {
    const baseDir = resolve('tmp/e2e/execute-plugin-bundle-size');

    beforeEach(async () => {
        await addCodePushupConfigFile( {
            fileImports: [`import {bundleSizePlugin} from "${getRelativePathToPluginDist(baseDir, 'bundle-size')}";`],
            pluginStrings: ['bundleSizePlugin()'],
            targetFolder: baseDir
        });
    });

    afterEach(async () => {
      await cleanTestFolder(baseDir);
    });

    it('should run bundle-size plugin and create valid report.json', async () => {
      const { code, stderr } = await executeCliCollectForPlugin('bundle-size', {}, baseDir);
      expect(code).toBe(0);

        const report: Report = await readReportJson(baseDir);
        expect(() => reportSchema.parse(report)).not.toThrow();
        expect(omitVariableReportData(report)).toMatchSnapshot();
    });

    it('should run bundle-size plugin with the correct slug and audits in report.json', async () => {
        const { code, stderr } = await executeCliCollectForPlugin('bundle-size', {}, baseDir);
        expect(code).toBe(0);

        const report: Report = await readReportJson(baseDir);
        expect(report.plugins.at(0)?.slug).toBe('bundle-size');
        expect(report.plugins.at(0)?.audits.length).toBe(1);
        expect(report.plugins.at(0)?.audits.at(0)?.slug).toBe('bundle-size');

    });
});

import {
    addCodePushupConfigFile,
    cleanTestFolder,
    executeCliCollectForPlugin,
    omitVariableReportData,
    readReportJson
} from "testing-utils";
import {afterEach} from "vitest";
import {join, relative} from "path";
import {reportSchema, Report} from "@code-pushup/models";


describe('execute-plugin-bundle-size', () => {
    const executePluginBaseDir = join(process.cwd(), 'tmp/e2e/execute-plugin-bundle-size');

    beforeEach(async () => {
        const relativeFormTargetFolder = relative(join(executePluginBaseDir), '.');
        await addCodePushupConfigFile(undefined, {
            fileImports: [`import {bundleSizePlugin} from "${join(relativeFormTargetFolder, 'dist/packages/bundle-size')}";`],
            pluginStrings: ['bundleSizePlugin()'],
            targetFolder: executePluginBaseDir // join(process.cwd(), executePluginBaseDir)
        });
    });

    afterEach(async () => {
        await cleanTestFolder(executePluginBaseDir);
    });

    it('should run bundle-size plugin and create valid report.json', async () => {
        const {code, stderr} = await executeCliCollectForPlugin('bundle-size', {}, executePluginBaseDir);

        expect(code).toBe(0);
        const report: Report = await readReportJson(executePluginBaseDir);
        expect(() => reportSchema.parse(report)).not.toThrow();
        expect(omitVariableReportData(report)).toMatchSnapshot();
    });

    it.skip('should include all audits report.json', async () => {
        const {code, stderr} = await executeCliCollectForPlugin('bundle-size', {}, executePluginBaseDir);

        expect(code).toBe(0);
        const report: Report = await readReportJson(executePluginBaseDir);
        expect(report.plugins[0].slug).toBe('bundle-size');
        expect(report.plugins[0].audits.map(({slug}) => slug)).toStrictEqual(['bundle-size']);
    });
});

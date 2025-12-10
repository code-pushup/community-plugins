import {cp} from 'node:fs/promises';
import path from 'node:path';
import {afterAll, beforeAll, expect} from 'vitest';
import {type Report, reportSchema} from '@code-pushup/models';
import {nxTargetProject} from '@code-pushup/test-nx-utils';
import {
    E2E_ENVIRONMENTS_DIR,
    TEST_OUTPUT_DIR,
    omitVariableReportData,
    restoreNxIgnoredFiles,
    teardownTestFolder,
} from '@code-pushup/test-utils';
import {executeProcess, readJsonFile} from '@code-pushup/utils';

// skip tests until js-benchmark-plugin is officially released
describe('PLUGIN collect report with js-benchmark-plugin NPM package', () => {
    const envDir = path.join(
        E2E_ENVIRONMENTS_DIR,
        nxTargetProject()
    );
    const testFileDir = path.join(
        envDir,
        TEST_OUTPUT_DIR,
        'collect',
    );
    const defaultSetupDir = path.join(testFileDir);

    const fixturesDir = path.join('e2e', nxTargetProject(), 'mocks/fixtures/default-setup');

    beforeAll(async () => {
        await cp(fixturesDir, envDir, {recursive: true});
        await restoreNxIgnoredFiles(envDir);
    });

    afterAll(async () => {
        //  await teardownTestFolder(testFileDir);
    });

    it.skip('should run plugin over CLI and creates report.json', async () => {
        const {code, stdout} = await executeProcess({
            command: 'npx',
            // verbose exposes audits with perfect scores that are hidden in the default stdout
            args: ['@code-pushup/cli', 'collect', '--verbose'],
            cwd: envDir,
        });

        expect(code).toBe(0);
        expect(stdout).toContain('JS Benchmark audits');

        const report = await readJsonFile(
            path.join(envDir, '.code-pushup', 'report.json'),
        );
        expect(() => reportSchema.parse(report)).not.toThrowError();
        expect(
            omitVariableReportData(report as Report, {omitAuditData: true}),
        ).toMatchSnapshot();
    });

    it('should be able to import runner entry point', async () => {
        // Test that the runner entry point can be imported from the installed package
        const runnerModule = await import(
            path.resolve(envDir, 'node_modules/@code-pushup/js-benchmark-plugin/src/lib/runner/index.js')
        );

        expect(runnerModule.createRunnerFunction).toBeDefined();
        expect(typeof runnerModule.createRunnerFunction).toBe('function');
        expect(runnerModule.toAuditSlug).toBeDefined();
        expect(typeof runnerModule.toAuditSlug).toBe('function');

        // Test toAuditSlug function
        const slug = runnerModule.toAuditSlug('test-suite');
        expect(slug).toBe('js-benchmarking-test-suite');
    });

    it('should be able to import suite runner entry points', async () => {
        // Test tinybench suite runner
        const tinybenchModule = await import(
            path.resolve(envDir, 'node_modules/@code-pushup/js-benchmark-plugin/src/plugins/tinybench.suite-runner.js')
        );
        expect(tinybenchModule.tinybenchRunner).toBeDefined();
        expect(typeof tinybenchModule.tinybenchRunner.run).toBe('function');

        // Test benchmark suite runner
        const benchmarkModule = await import(
            path.resolve(envDir, 'node_modules/@code-pushup/js-benchmark-plugin/src/plugins/benchmark.suite-runner.js')
        );
        expect(benchmarkModule.benchmarkRunner).toBeDefined();
        expect(typeof benchmarkModule.benchmarkRunner.run).toBe('function');

        // Test benny suite runner
        const bennyModule = await import(
            path.resolve(envDir, 'node_modules/@code-pushup/js-benchmark-plugin/src/plugins/benny.suite-runner.js')
        );
        expect(bennyModule.bennyRunner).toBeDefined();
        expect(typeof bennyModule.bennyRunner.run).toBe('function');
    });
});

import { cp } from 'node:fs/promises';
import path from 'node:path';
import { afterAll, beforeAll, expect } from 'vitest';
import { type Report, reportSchema } from '@code-pushup/models';
import { nxTargetProject } from '@code-pushup/test-nx-utils';
import {
  E2E_ENVIRONMENTS_DIR,
  TEST_OUTPUT_DIR,
  omitVariableReportData,
  restoreNxIgnoredFiles,
  teardownTestFolder,
} from '@code-pushup/test-utils';
import { executeProcess, readJsonFile } from '@code-pushup/utils';

describe('PLUGIN collect report with js-benchmark-plugin NPM package', () => {
  const envDir = path.join(E2E_ENVIRONMENTS_DIR, nxTargetProject());
  const testFileDir = path.join(envDir, TEST_OUTPUT_DIR, 'collect');

  const fixturesDir = path.join(
    'e2e',
    nxTargetProject(),
    'mocks/fixtures/default-setup',
  );

  beforeAll(async () => {
    await cp(fixturesDir, envDir, { recursive: true });
    await restoreNxIgnoredFiles(envDir);
  });

  afterAll(async () => {
    await teardownTestFolder(testFileDir);
  });

  it('should run plugin over CLI and creates report.json', async () => {
    const { code, stdout } = await executeProcess({
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
      omitVariableReportData(report as Report, { omitAuditData: true }),
    ).toMatchSnapshot();
  });
});

import { cp } from 'node:fs/promises';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { auditOutputsSchema } from '@code-pushup/models';
import { nxTargetProject } from '@code-pushup/test-nx-utils';
import {
  E2E_ENVIRONMENTS_DIR,
  TEST_OUTPUT_DIR,
  restoreNxIgnoredFiles,
  teardownTestFolder,
} from '@code-pushup/test-utils';
import { executeProcess, readJsonFile } from '@code-pushup/utils';

describe('knip reporter', () => {
  const envDir = path.join(E2E_ENVIRONMENTS_DIR, nxTargetProject());
  const testFileDir = path.join(envDir, TEST_OUTPUT_DIR, 'reporter');
  const reporterSetupDir = path.join(testFileDir, 'reporter-setup');
  const fixturesDir = path.join('e2e', nxTargetProject(), 'mocks/fixtures');
  const reporterPath = path.join(
    envDir,
    'node_modules',
    '@code-pushup',
    'plugin-knip',
    'src',
    'lib',
    'reporter.js',
  );

  beforeAll(async () => {
    await cp(fixturesDir, testFileDir, { recursive: true });
    await restoreNxIgnoredFiles(testFileDir);
  });

  afterAll(async () => {
    await teardownTestFolder(testFileDir);
  });

  it('should execute knip with custom reporter and generate report', async () => {
    const outputFile = path.join(reporterSetupDir, 'knip-report.json');
    const customReporterOptions = JSON.stringify({
      outputFile: 'knip-report.json',
    });

    const { code } = await executeProcess({
      command: 'npx',
      args: [
        'knip',
        '--no-exit-code',
        `--reporter=${reporterPath}`,
        `--reporter-options=${customReporterOptions}`,
      ],
      cwd: reporterSetupDir,
    });

    expect(code).toBe(0);

    const report = await readJsonFile(outputFile);
    expect(() => auditOutputsSchema.parse(report)).not.toThrowError();
    expect(report).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          slug: 'dependencies',
          score: 0,
          value: 1,
          details: {
            issues: [
              {
                message: 'Unused dependency zod',
                severity: 'error',
                source: {
                  file: 'package.json',
                },
              },
            ],
          },
        }),
      ]),
    );
  });
});

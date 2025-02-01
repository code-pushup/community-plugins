import { cp } from 'node:fs/promises';
import path from 'node:path';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { type Report, reportSchema } from '@code-pushup/models';
import { nxTargetProject } from '@code-pushup/test-nx-utils';
import { teardownTestFolder } from '@code-pushup/test-setup';
import {
  E2E_ENVIRONMENTS_DIR,
  TEST_OUTPUT_DIR,
  removeColorCodes,
} from '@code-pushup/test-utils';
import { executeProcess, readJsonFile } from '@code-pushup/utils';

describe('PLUGIN collect report with knip-plugin NPM package', () => {
  const fixturesDir = path.join(
    'e2e',
    'plugin-knip-e2e',
    'mocks',
    'fixtures',
  );
  const fixtureUnusedDependency = path.join(fixturesDir, 'unused-dependency');

  const envRoot = path.join(
    E2E_ENVIRONMENTS_DIR,
    nxTargetProject(),
    TEST_OUTPUT_DIR,
  );
  const unusedDependencyDir = path.join(envRoot, 'unused-dependency');
  const unusedDependencyOutputDir = path.join(unusedDependencyDir, '.code-pushup');

  beforeAll(async () => {
    await cp(fixtureUnusedDependency, unusedDependencyDir, { recursive: true });
  });

  afterAll(async () => {
    await teardownTestFolder(unusedDependencyDir);
  });

  afterEach(async () => {
    await teardownTestFolder(unusedDependencyOutputDir);
  });

  it('should run Knip plugin for Unused Dependency example dir and create report.json', async () => {
    const { code, stdout } = await executeProcess({
      command: 'npx',
      args: ['@code-pushup/cli', 'collect', '--no-progress'],
      cwd: unusedDependencyDir,
    });

    expect(code).toBe(0);

    expect(removeColorCodes(stdout)).toMatchFileSnapshot(
      '__snapshots__/report.txt',
    );

    const report = await readJsonFile(
      path.join(unusedDependencyOutputDir, 'report.json'),
    );

    expect(() => reportSchema.parse(report)).not.toThrow();
    expect(
      JSON.stringify(report as Report, null, 2),
    ).toMatchFileSnapshot('__snapshots__/report.json');
  });
});

import { relative } from 'knip/dist/util/path';
import { execSync } from 'node:child_process';
import { readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

describe('knipReporter', () => {
  const testFolder = path.join('tmp', 'plugin-knip');

  afterEach(async () => {
    await rm(testFolder, { recursive: true, force: true });
  });

  it('should execute correctly', async () => {
    const sandboxRoot = path.join(
      'packages',
      'plugin-knip',
      'mocks',
      'sandbox',
    );
    const reporterPath = path.join(
      '..',
      '..',
      '..',
      '..',
      'dist',
      'packages',
      'plugin-knip',
      'src',
      'lib',
      'reporter.js',
    );
    const outputFile = path.join(testFolder, 'knip.report.json');
    const customReporterOptions = JSON.stringify({
      outputFile: relative(path.join('..', '..', '..', '..', outputFile)),
    });

    execSync(
      `npx knip --no-exit-code --reporter=${reporterPath} --reporter-options='${customReporterOptions}'`,
      {
        cwd: sandboxRoot,
      },
    );

    const reportJson = JSON.parse(
      (await readFile(outputFile, { encoding: 'utf8' })).toString(),
    );
    expect(reportJson).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          slug: 'unused-dependencies',
          score: 0,
          value: 1,
          details: {
            issues: [
              {
                message: 'Unused dependency zod',
                severity: 'error',
                source: {
                  file: 'packages/plugin-knip/mocks/sandbox/package.json',
                },
              },
            ],
          },
        }),
      ]),
    );
  });
});

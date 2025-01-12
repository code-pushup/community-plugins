import { relative } from 'knip/dist/util/path';
// eslint-disable-next-line n/no-sync
import {
  getLogMessages
} from '@code-pushup/test-utils';
import { ui } from "@code-pushup/utils";
import type { ReporterOptions } from "knip";
import { IssueRecords, IssueSet } from "knip/dist/types/issues";
import { fs as memfsFs } from "memfs";
import { execSync } from 'node:child_process';
import { readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { KNIP_RAW_REPORT_NAME, KNIP_REPORT_NAME } from "./constants";
import { CustomReporterOptions } from "./model";
import { knipReporter } from "./reporter";

describe('knipReporter', () => {
  const testFolder = join('tmp', 'plugin-knip');
  afterEach(async () => {
    await rm(testFolder, { recursive: true, force: true });
  });
  it('should execute correctly', async () => {
    const sandboxRoot = join('packages', 'plugin-knip', 'mocks', 'sandbox');
    const reporterPath = join(
      '..',
      '..',
      '..',
      '..',
      'dist',
      'packages',
      'plugin-knip',
      'reporter.js',
    );
    const outputFile = join(testFolder, 'knip.report.json');
    const customReporterOptions = JSON.stringify({
      outputFile: relative(join('..', '..', '..', '..', outputFile)),
    });

    // eslint-disable-next-line n/no-sync
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

  it('should saves report to file system by default', async () => {
    await expect(
      knipReporter({
        report: {
          files: true,
        },
        issues: {
          files: new Set(['main.js']),
        },
      } as ReporterOptions),
    ).resolves.toBeUndefined();

    expect(getLogMessages(ui().logger)).toHaveLength(0);
  });

  it('should accept reporter option outputFile', async () => {
    const outputFile = 'my-report.json';
    await expect(
      knipReporter({
        report: {
          files: true,
        },
        issues: {
          files: new Set(['main.js']),
        },
        options: JSON.stringify({ outputFile } satisfies CustomReporterOptions),
      } as ReporterOptions),
    ).resolves.toBeUndefined();

    expect(getLogMessages(ui().logger)).toHaveLength(0);

    const auditOutputs = JSON.parse(
      (
        await memfsFs.promises.readFile(outputFile, { encoding: 'utf8' })
      ).toString(),
    );
    expect(auditOutputs).toStrictEqual([
      expect.objectContaining({ slug: 'unused-files' }),
    ]);
  });

  it('should accept reporter option rawOutputFile', async () => {
    const rawOutputFile = KNIP_RAW_REPORT_NAME;
    const fileIssueSet: IssueSet = new Set(['main.js']);
    const unlistedIssueRecords: IssueRecords = {
      '/User/username/code-pushup-cli/packages/utils/.eslintrc.json': {
        'jsonc-eslint-parser': {
          type: 'unlisted',
          symbol: 'jsonc-eslint-parser',
          filePath:
            '/User/username/code-pushup-cli/packages/utils/package.json',
          workspace: 'code-pushup-cli'
        },
      },
    };

    await expect(
      knipReporter({
        report: {
          files: true,
          unlisted: true,
        },
        issues: {
          files: fileIssueSet,
          unlisted: unlistedIssueRecords,
        },
        options: JSON.stringify({ rawOutputFile }),
        // other reporter options for debugging purpose
        counters: { files: 1, unlisted: 1 },
      } as ReporterOptions),
    ).resolves.toBeUndefined();

    expect(getLogMessages(ui().logger)).toHaveLength(0);

    const rawKnipReport = JSON.parse(
      (
        await memfsFs.promises.readFile(rawOutputFile, { encoding: 'utf8' })
      ).toString(),
    );
    expect(rawKnipReport.report).toStrictEqual({ files: true, unlisted: true });
    expect(rawKnipReport.options).toStrictEqual({ rawOutputFile });
    expect(rawKnipReport.issues.files).toStrictEqual(['main.js']);
    expect(rawKnipReport.issues.unlisted).toStrictEqual(unlistedIssueRecords);
    expect(rawKnipReport.counters).toStrictEqual({ files: 1, unlisted: 1 });
  });

  it('should log if custom reporter option verbose is true', async () => {
    const reporterOptions: CustomReporterOptions = {
      verbose: true,
      outputFile: KNIP_REPORT_NAME,
      rawOutputFile: KNIP_RAW_REPORT_NAME,
    };
    await expect(
      knipReporter({
        report: { files: true },
        issues: { files: new Set(['main.js']) },
        options: JSON.stringify(reporterOptions),
      } as ReporterOptions),
    ).resolves.toBeUndefined();

    ui().logger.info(
      `Reporter called with options: ${JSON.stringify(
        reporterOptions,
        null,
        2,
      )}`,
    );
    expect(getLogMessages(ui().logger)).toHaveLength(2);
    expect(getLogMessages(ui().logger).at(0)).toBe(
      `[ blue(info) ] Reporter called with options: ${JSON.stringify(
        reporterOptions,
        null,
        2,
      )}`,
    );
    // expect(getLogMessages(ui().logger).at(1)).toBe(
    //   `[ blue(info) ] Saved raw report to ${reporterOptions.rawOutputFile}`,
    // );
    // expect(getLogMessages(ui().logger).at(2)).toBe(
    //   `[ blue(info) ] Saved report to ${reporterOptions.outputFile}`,
    // );
  });
});

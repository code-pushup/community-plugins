import {
  MEMFS_VOLUME,
  osAgnosticPath,
} from '@code-pushup/test-utils';
import { logger } from '@code-pushup/utils';
import type { ReporterOptions } from 'knip';
import { IssueRecords, IssueSet } from 'knip/dist/types/issues';
import { fs as memfsFs, vol } from 'memfs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { KNIP_RAW_REPORT_NAME, KNIP_REPORT_NAME } from './constants';
import { CustomReporterOptions } from './model';
import { knipReporter } from './reporter';
import { join } from 'node:path';
import { rawReport } from '../../../mocks/fixtures/raw-knip.report';
import { AuditOutputs } from '@code-pushup/models';

vi.mock('@code-pushup/utils', async () => {
  const actual = await vi.importActual('@code-pushup/utils');
  return {
    ...actual,
    getGitRoot: vi.fn().mockResolvedValue(MEMFS_VOLUME),
    logger: {
      info: vi.fn(),
    },
  };
});

describe('knipReporter', () => {
  beforeEach(async () => {
    // memfs needs some files created (and deleted) to have the folder present
    vol.fromJSON(
      {
        'test.ts': 'asdfa',
      },
      MEMFS_VOLUME,
    );
    await memfsFs.promises.rm('test.ts');
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

    expect(logger.info).not.toHaveBeenCalledWith(
      expect.stringContaining('"$0":'),
    );
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

    expect(logger.info).not.toHaveBeenCalledWith(
      expect.stringContaining('"$0":'),
    );

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
          workspace: '/User/username/code-pushup-cli',
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

    expect(logger.info).not.toHaveBeenCalledWith(
      expect.stringContaining('"$0":'),
    );

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

    expect(logger.info).not.toHaveBeenCalledWith(
      expect.stringContaining('"$0":'),
    );
  });

  it('should produce valid audit outputs', async () => {
    await expect(
      knipReporter(rawReport as ReporterOptions),
    ).resolves.toBeUndefined();

    const auditOutputsContent = await memfsFs.promises.readFile(
      join(MEMFS_VOLUME, KNIP_REPORT_NAME),
      { encoding: 'utf8' },
    );
    const auditOutputsJson = JSON.parse(
      auditOutputsContent.toString(),
    ) as AuditOutputs;
    expect(
      auditOutputsJson.map((audit) => ({
        ...audit,
        details: {
          issues: audit.details?.issues?.map((issue) => ({
            ...issue,
            source: issue.source && {
              file: osAgnosticPath(issue.source.file),
            },
          })),
        },
      })),
    ).toMatchSnapshot();
  });
});

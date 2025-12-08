import type { ReporterOptions } from 'knip';
import type {
  IssueRecords,
  Issue as KnipIssue,
  IssueSeverity as KnipIssueSeverity,
  Issues as KnipIssues,
} from 'knip/dist/types/issues';
import { describe, expect, it, vi } from 'vitest';
import {
  auditDetailsSchema,
  auditOutputsSchema,
  type IssueSeverity,
} from '@code-pushup/models';
import { ISSUE_RECORDS_TYPES, ISSUE_SET_TYPES } from '../constants.js';
import { ISSUE_TYPE_MESSAGE } from './constants.js';
import {
  getPosition,
  knipIssueSetToIssues,
  knipIssueToIssue,
  knipToCpReport,
  toIssues,
} from './utils.js';

vi.mock('@code-pushup/utils', async () => {
  const actual = await vi.importActual('@code-pushup/utils');
  return {
    ...actual,
    getGitRoot: vi.fn().mockResolvedValue('/User/projects/code-pushup-cli'),
  };
});

const gitRoot = '/User/projects/code-pushup-cli';

describe('knipIssueSetToIssue', () => {
  it('should return empty array for empty array', () => {
    expect(knipIssueSetToIssues('files', [], '.')).toStrictEqual([]);
  });

  it.each<(typeof ISSUE_SET_TYPES)[number]>(['files'])(
    'should use correct helper from ISSUE_TYPE_MESSAGE',
    (issueType) => {
      const filePath =
        '/User/projects/code-pushup-cli/packages/utils/src/index.js';
      expect(
        knipIssueSetToIssues(issueType, [filePath], gitRoot),
      ).toStrictEqual([
        expect.objectContaining({
          message: ISSUE_TYPE_MESSAGE[issueType]('packages/utils/src/index.js'),
        }),
      ]);
    },
  );

  it('should use correct severity', () => {
    const filePath =
      '/User/projects/code-pushup-cli/packages/utils/src/index.js';
    expect(knipIssueSetToIssues('files', [filePath], gitRoot)).toStrictEqual([
      expect.objectContaining({
        severity: 'info',
      }),
    ]);
  });

  it('should use correct source file', () => {
    const filePath =
      '/User/projects/code-pushup-cli/packages/utils/src/index.js';
    expect(knipIssueSetToIssues('files', [filePath], gitRoot)).toStrictEqual([
      expect.objectContaining({
        source: {
          file: 'packages/utils/src/index.js',
        },
      }),
    ]);
  });

  it('should return valid issue', () => {
    expect(() =>
      auditDetailsSchema.parse({
        details: {
          issues: knipIssueSetToIssues(
            'files',
            ['packages/utils/src/index.js'],
            gitRoot,
          ),
        },
      }),
    ).not.toThrowError();
  });
});

describe('getPosition', () => {
  it('should return false if no positional information is given', () => {
    expect(getPosition({} as KnipIssue)).toBeFalsy();
  });

  it('should return a object containing column and line information', () => {
    expect(getPosition({ col: 3, line: 2 } as KnipIssue)).toEqual({
      startColumn: 3,
      startLine: 2,
    });
  });

  it('should return a object containing with line information from last symbol of symbols', () => {
    expect(
      getPosition({
        type: 'duplicates',
        filePath:
          '/Users/michael_hladky/WebstormProjects/quality-metrics-cli/packages/nx-plugin/src/generators/configuration/generator.ts',
        symbol: 'configurationGenerator|default',
        symbols: [
          {
            symbol: 'configurationGenerator',
            line: 1,
            col: 1,
          },
          {
            symbol: 'default',
            line: 2,
            col: 2,
          },
        ],
        severity: 'error',
      } as KnipIssue),
    ).toEqual({
      startColumn: 2,
      startLine: 2,
    });
  });
});

describe('knipIssueToIssue', () => {
  it('should return empty array for empty array', () => {
    expect(knipIssueToIssue([], gitRoot)).toStrictEqual([]);
  });

  it.each([ISSUE_RECORDS_TYPES])(
    'should use correct helper from ISSUE_TYPE_MESSAGE',
    (issueType) => {
      expect(
        knipIssueToIssue(
          [
            {
              type: issueType,
              symbol: 'CliUi',
              filePath: '',
            } as KnipIssue,
          ],
          gitRoot,
        ).at(0)?.message,
      ).toBe(ISSUE_TYPE_MESSAGE[issueType]('CliUi'));
    },
  );

  it.each<[KnipIssueSeverity | 'unknown', IssueSeverity]>([
    ['unknown', 'info'],
    ['off', 'info'],
    ['warn', 'warning'],
    ['error', 'error'],
  ])('should use correct severity %s', (knipSeverity, severity) => {
    expect(
      knipIssueToIssue(
        [
          {
            severity: knipSeverity,
            filePath: '',
            type: 'dependencies',
          } as KnipIssue,
        ],
        gitRoot,
      ).at(0)?.severity,
    ).toBe(severity);
  });

  it('should use correct source file', () => {
    const filePath =
      '/User/projects/code-pushup-cli/packages/utils/src/index.js';
    expect(
      knipIssueToIssue(
        [
          {
            filePath,
            type: 'dependencies',
          } as KnipIssue,
        ],
        gitRoot,
      ).at(0)?.source?.file,
    ).toBe('packages/utils/src/index.js');
  });

  it('should use correct source position', () => {
    const filePath =
      '/User/projects/code-pushup-cli/packages/utils/src/index.js';
    expect(
      knipIssueToIssue(
        [
          {
            line: 4,
            col: 2,
            filePath,
            type: 'dependencies',
          } as KnipIssue,
        ],
        gitRoot,
      ).at(0)?.source?.position,
    ).toStrictEqual({
      startLine: 4,
      startColumn: 2,
    });
  });

  it('should not include source position id line or col are missing in knip issue', () => {
    const filePath =
      '/User/projects/code-pushup-cli/packages/utils/src/index.js';
    expect(
      knipIssueToIssue(
        [
          {
            filePath,
            type: 'dependencies',
          } as KnipIssue,
        ],
        gitRoot,
      ).at(0)?.source,
    ).toStrictEqual(
      expect.not.objectContaining({ position: expect.any(Object) }),
    );
  });

  it('should return valid issue', () => {
    expect(() =>
      auditDetailsSchema.parse({
        details: {
          issues: knipIssueToIssue(
            [
              {
                type: 'dependencies',
                severity: 'warn',
                symbol: 'packages/utils/src/index.js',
                filePath: 'packages/utils/src/index.js',
                line: 4,
                col: 2,
              },
            ],
            gitRoot,
          ),
        },
      }),
    ).not.toThrowError();
  });
});

describe('toIssues', () => {
  it('should return empty issues if a given knip Issue set is empty', async () => {
    await expect(
      toIssues('files', {
        files: new Set<string>(),
      } as KnipIssues),
    ).resolves.toStrictEqual([]);
  });

  it('should return correct issues for issue set', async () => {
    await expect(
      toIssues('files', {
        files: new Set([
          '/User/projects/code-pushup-cli/packages/utils/src/index.js',
        ]),
      } as KnipIssues),
    ).resolves.toStrictEqual([
      expect.objectContaining({
        message: expect.stringMatching('Unused file'),
        source: {
          file: 'packages/utils/src/index.js',
        },
      }),
    ]);
  });

  it('should return empty issues if a given knip issue object is empty', async () => {
    await expect(
      toIssues('dependencies', {
        dependencies: {},
      } as KnipIssues),
    ).resolves.toStrictEqual([]);
  });

  it('should return correct issues for issue object', async () => {
    await expect(
      toIssues('types', {
        types: {
          '/User/projects/code-pushup-cli/packages/utils/src/index.js': {
            CliUi: {
              type: 'types',
              filePath:
                '/User/projects/code-pushup-cli/packages/utils/src/index.js',
              symbol: 'CliUi',
              severity: 'error',
            } as unknown as KnipIssue,
          },
        },
      } as unknown as KnipIssues),
    ).resolves.toStrictEqual([
      expect.objectContaining({
        message: expect.stringMatching('CliUi'),
        severity: 'error',
        source: {
          file: 'packages/utils/src/index.js',
        },
      }),
    ]);
  });
});

describe('knipToCpReport', () => {
  it('should return empty audits if no report is flagged positive', async () => {
    const result = await knipToCpReport({
      issues: {},
      report: {},
    } as ReporterOptions);

    expect(result).toEqual(
      expect.arrayContaining([expect.objectContaining({ score: 0, value: 0 })]),
    );
  });

  it('should return only audits flagged in report object', async () => {
    const result = await knipToCpReport({
      issues: {
        dependencies: {},
      },
      report: { dependencies: true },
    } as ReporterOptions);

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ slug: 'dependencies' }),
      ]),
    );
  });

  it('should return readable audit slug derived from knip issueType', async () => {
    const result = await knipToCpReport({
      issues: {
        optionalPeerDependencies: {},
      },
      report: { optionalPeerDependencies: true },
    } as ReporterOptions);

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ slug: 'optional-peer-dependencies' }),
      ]),
    );
  });

  it('should return audit result with number of issues as value', async () => {
    const result = await knipToCpReport({
      issues: { files: new Set(['a.js', 'b.js', 'c.js']) },
      report: { files: true },
    } as ReporterOptions);

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ slug: 'files', value: 3 }),
      ]),
    );
  });

  it('should return audit result without display value', async () => {
    const result = await knipToCpReport({
      issues: { files: new Set(['main.js']) },
      report: { files: true },
    } as ReporterOptions);

    // Check that the files audit doesn't have displayValue
    const filesAudit = result.find((audit) => audit.slug === 'files');
    expect(filesAudit).not.toHaveProperty('displayValue');
  });

  it('should score audits with empty issues with 1', async () => {
    const result = await knipToCpReport({
      issues: { files: new Set() },
      report: { files: true },
    } as ReporterOptions);

    expect(result).toContainEqual(
      expect.objectContaining({ score: 1, value: 0 }),
    );
  });

  it('should score audits with issues with 0', async () => {
    const result = await knipToCpReport({
      issues: { files: new Set(['main.js']) },
      report: { files: true },
    } as ReporterOptions);

    const filesAudit = result.find((audit) => audit.slug === 'files');
    expect(filesAudit).toStrictEqual(
      expect.objectContaining({ score: 0, value: 1 }),
    );
  });

  it('should return valid outputs schema', async () => {
    const result = await knipToCpReport({
      issues: {
        files: new Set(['main.js']),
        unlisted: {
          '/User/username/code-pushup-cli/packages/utils/.eslintrc.json': {
            'jsonc-eslint-parser': {
              type: 'unlisted',
              symbol: 'jsonc-eslint-parser',
              filePath:
                '/User/username/code-pushup-cli/packages/utils/package.json',
              severity: 'error',
              line: 0,
              pos: 0,
              col: 0,
              symbols: [],
              parentSymbol: '',
            } as unknown as KnipIssue,
          },
          '/User/username/code-pushup-cli/examples/plugins/.eslintrc.json': {
            'jsonc-eslint-parser': {
              type: 'unlisted',
              symbol: 'jsonc-eslint-parser',
              filePath:
                '/User/username/code-pushup-cli/packages/utils/package.json',
              severity: 'error',
            } as unknown as KnipIssue,
          },
        } as IssueRecords,
      } as ReporterOptions['issues'],
      report: { files: true, unlisted: true },
    } as ReporterOptions);
    expect(() => auditOutputsSchema.parse(result)).not.toThrowError();
  });
});

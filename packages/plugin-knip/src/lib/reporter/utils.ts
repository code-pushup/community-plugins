import type {
  IssueType,
  Issue as KnipIssue,
  IssueRecords as KnipIssueRecords,
  IssueSet as KnipIssueSet,
  Issues as KnipIssues,
  IssueSeverity as KnipSeverity,
  ReporterOptions,
} from 'knip/dist/types/issues';
import {
  AuditOutput,
  AuditOutputs,
  IssueSeverity as CondPushupIssueSeverity,
  Issue as CpIssue,
} from '@code-pushup/models';
import { formatGitPath, getGitRoot, slugify } from '@code-pushup/utils';
import { ISSUE_RECORDS_TYPES, ISSUE_SET_TYPES } from '../constants';
import { ISSUE_TYPE_MESSAGE, ISSUE_TYPE_TITLE } from './constants';

const severityMap: Record<KnipSeverity | 'unknown', CondPushupIssueSeverity> = {
  unknown: 'info',
  off: 'info',
  error: 'error',
  warn: 'warning',
} as const;

export function knipIssueSetToIssues(
  issueType: (typeof ISSUE_SET_TYPES)[number],
  knipIssueSetAsArray: string[],
  gitRoot: string,
): CpIssue[] {
  return knipIssueSetAsArray.map(
    (filePath): CpIssue => ({
      message: ISSUE_TYPE_MESSAGE[issueType](formatGitPath(filePath, gitRoot)),
      severity: severityMap['unknown'], // @TODO rethink
      source: {
        file: formatGitPath(filePath, gitRoot),
      },
    }),
  );
}

export function getPosition(
  issue: Pick<KnipIssue, 'symbols' | 'line' | 'col'>,
):
  | false
  | {
      startColumn: number;
      startLine: number;
    } {
  const hasSymbols = issue.symbols?.length ?? 0;
  if (hasSymbols) {
    // we want to have the line of code of the last symbol present in a file
    const { col = -1, line = -1 } = issue.symbols?.at(-1) ?? {};
    return { startColumn: col, startLine: line };
  }
  if (issue.line && issue.col) {
    return {
      startColumn: issue.col,
      startLine: issue.line,
    };
  }
  return false;
}

export function knipIssueToIssue(
  knipIssues: (Pick<
    KnipIssue,
    'symbol' | 'filePath' | 'severity' | 'line' | 'col'
  > & { type: (typeof ISSUE_RECORDS_TYPES)[number] })[],
  gitRoot: string,
): CpIssue[] {
  return knipIssues.map((issue): CpIssue => {
    const { type, symbol, filePath, severity = 'unknown' } = issue;
    const position = getPosition(issue);
    return {
      message: ISSUE_TYPE_MESSAGE[type](symbol),
      severity: severityMap[severity],
      source: {
        file: formatGitPath(filePath, gitRoot),
        ...(position ? { position } : {}),
      },
    };
  });
}

export async function toIssues(
  issueType: IssueType,
  issues: KnipIssues,
): Promise<CpIssue[]> {
  const isSet = issues[issueType] instanceof Set;
  const issuesForType: string[] | KnipIssue[] = isSet
    ? [...(issues[issueType] as KnipIssueSet)]
    : Object.values(issues[issueType] as KnipIssueRecords).flatMap(
        Object.values,
      );

  const gitRoot = await getGitRoot();
  if (issuesForType.length > 0) {
    if (isSet) {
      const knipIssueSetPaths = issuesForType as string[];
      return knipIssueSetToIssues(
        issueType as (typeof ISSUE_SET_TYPES)[number],
        knipIssueSetPaths,
        gitRoot,
      );
    } else {
      const knipIssues = issuesForType as KnipIssue[];
      return knipIssueToIssue(knipIssues, gitRoot);
    }
  }
  return [];
}

export function knipToCpReport({
  issues: rawIssues,
  report,
}: Pick<ReporterOptions, 'report' | 'issues'>): Promise<AuditOutputs> {
  return Promise.all(
    Object.entries(report)
      .filter(([_, isReportType]) => isReportType)
      .map(async ([issueType]): Promise<AuditOutput> => {
        const issues = await toIssues(issueType as IssueType, rawIssues);

        return {
          slug: slugify(ISSUE_TYPE_TITLE[issueType as IssueType]),
          score: issues.length === 0 ? 1 : 0,
          value: issues.length,
          ...(issues.length > 0 ? { details: { issues } } : {}),
        };
      }),
  );
}

import { IssueType as KnipIssueType } from 'knip/dist/types/issues';

/**
 * @description
 * types that contain a knip `IssueSet`.
 */
export const ISSUE_SET_TYPES = ['files'] as const satisfies KnipIssueType[];

/**
 * @description
 * types that contain a knip `Issue`
 */
export const ISSUE_RECORDS_TYPES = [
  'dependencies',
  'devDependencies',
  'optionalPeerDependencies',
  'unlisted',
  'binaries',
  'unresolved',
  'exports',
  'nsExports',
  'types',
  'nsTypes',
  'enumMembers',
  'classMembers',
  'duplicates',
] as const satisfies KnipIssueType[];

export const ISSUE_TYPES = [
  ...ISSUE_SET_TYPES,
  ...ISSUE_RECORDS_TYPES,
] as const satisfies KnipIssueType[];

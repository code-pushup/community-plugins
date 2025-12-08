import { IssueType as KnipIssueType } from 'knip/dist/types/issues';


/* eslint-disable  sonarjs/no-duplicate-string */
export const KNIP_PLUGIN_SLUG = 'knip';
export const KNIP_RAW_REPORT_NAME = 'knip-raw-report.json';
export const KNIP_REPORT_NAME = 'knip-code-pushup-report.json';

const KNIP_DOCS_BASE_URL = 'https://knip.dev/guides/handling-issues';

const audits = [
  {
    slug: 'files',
    title: 'Unused Files',
    description: 'Unable to find a reference to this file',
    docsUrl: `${KNIP_DOCS_BASE_URL}#files`,
  },
  {
    slug: 'dependencies',
    title: 'Unused Dependencies',
    description: 'Unable to find a reference to this dependency',
    docsUrl: `${KNIP_DOCS_BASE_URL}#dependencies`,
  },
  {
    slug: 'dev-dependencies',
    title: 'Unused Development Dependencies',
    description: 'Unable to find a reference to this devDependency',
    docsUrl: `${KNIP_DOCS_BASE_URL}#devDependencies`,
  },
  {
    slug: 'optional-peer-dependencies',
    title: 'Referenced optional peerDependencies',
    description: 'Optional peer dependency is referenced',
    docsUrl: `${KNIP_DOCS_BASE_URL}#referenced-optional-peerDependencies`,
  },
  {
    slug: 'unlisted',
    title: 'Unlisted dependencies',
    description: 'Used dependencies not listed in package.json',
    docsUrl: `${KNIP_DOCS_BASE_URL}#unlisted`,
  },
  {
    slug: 'binaries',
    title: 'Unlisted binaries',
    description: 'Binaries from dependencies not listed in package.json',
    docsUrl: `${KNIP_DOCS_BASE_URL}#binaries`,
  },
  {
    slug: 'unresolved',
    title: 'Unresolved imports',
    description: 'Unable to resolve this (import) specifier',
    docsUrl: `${KNIP_DOCS_BASE_URL}#unresolved`,
  },
  {
    slug: 'exports',
    title: 'Unused exports',
    description: 'Unable to find a reference to this export',
    docsUrl: `${KNIP_DOCS_BASE_URL}#exports`,
  },
  {
    slug: 'types',
    title: 'Unused exported types',
    description: 'Unable to find a reference to this exported type',
    docsUrl: `${KNIP_DOCS_BASE_URL}#types`,
  },
  {
    slug: 'ns-exports',
    title: 'Exports in used namespace',
    description: 'Namespace with export is referenced, but not export itself',
    docsUrl: `${KNIP_DOCS_BASE_URL}#nsExports`,
  },
  {
    slug: 'ns-types',
    title: 'Exported types in used namespace',
    description: 'Namespace with type is referenced, but not type itself',
    docsUrl: `${KNIP_DOCS_BASE_URL}#nsTypes`,
  },
  {
    slug: 'enum-members',
    title: 'Unused exported enum members',
    description: 'Unable to find a reference to this enum member',
    docsUrl: `${KNIP_DOCS_BASE_URL}#enumMembers`,
  },
  {
    slug: 'class-members',
    title: 'Unused exported class members',
    description: 'Unable to find a reference to this class member',
    docsUrl: `${KNIP_DOCS_BASE_URL}#classMembers`,
  },
  {
    slug: 'duplicates',
    title: 'Duplicate exports',
    description: 'This is exported more than once',
    docsUrl: `${KNIP_DOCS_BASE_URL}#duplicates`,
  },
] as const;

export type KnipAudits = (typeof audits)[number]['slug'];

export const KNIP_AUDITS = [...audits];

export const KNIP_GROUP_FILES = {
  slug: 'files',
  title: 'All file audits',
  description: 'Groups all file related audits',
  refs: [{ slug: 'files', weight: 1 }],
};

export const KNIP_GROUP_DEPENDENCIES = {
  slug: 'dependencies',
  title: 'All dependency audits',
  description: 'Groups all dependency related audits',
  refs: [
    { slug: 'dependencies', weight: 1 },
    { slug: 'dev-dependencies', weight: 1 },
    { slug: 'binaries', weight: 1 },
    { slug: 'optional-peer-dependencies', weight: 2 },
    { slug: 'unlisted', weight: 2 },
  ],
};

export const KNIP_GROUP_EXPORTS = {
  slug: 'exports',
  title: 'All exports related audits',
  description: 'Groups all dependency related knip audits',
  refs: [
    { slug: 'unresolved', weight: 10 },
    { slug: 'exports', weight: 10 },
    { slug: 'types', weight: 10 },
    { slug: 'ns-exports', weight: 10 },
    { slug: 'ns-types', weight: 10 },
    { slug: 'enum-members', weight: 10 },
    { slug: 'class-members', weight: 10 },
    { slug: 'duplicates', weight: 2 },
  ],
};

export const KNIP_GROUP_ALL = {
  slug: 'all',
  title: 'All knip audits',
  description: 'Groups all knip audits into a group for easy use',
  refs: [
    { slug: 'files', weight: 1 },
    { slug: 'unresolved', weight: 10 },
    { slug: 'exports', weight: 10 },
    { slug: 'types', weight: 10 },
    { slug: 'ns-exports', weight: 10 },
    { slug: 'ns-types', weight: 10 },
    { slug: 'enum-members', weight: 10 },
    { slug: 'class-members', weight: 10 },
    { slug: 'duplicates', weight: 2 },
    { slug: 'dependencies', weight: 1 },
    { slug: 'dev-dependencies', weight: 1 },
    { slug: 'binaries', weight: 1 },
    { slug: 'optional-peer-dependencies', weight: 2 },
    { slug: 'unlisted', weight: 2 },
  ],
};

export const KNIP_GROUPS = [
  KNIP_GROUP_FILES,
  KNIP_GROUP_EXPORTS,
  KNIP_GROUP_DEPENDENCIES,
  KNIP_GROUP_ALL,
];

export type KnipGroups = (typeof KNIP_GROUPS)[number]['slug'];

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
/* eslint-enable  sonarjs/no-duplicate-string */

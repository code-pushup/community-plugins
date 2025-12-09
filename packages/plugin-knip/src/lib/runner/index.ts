import path from 'node:path';
import type {
  AuditOutputs,
  RunnerConfig,
  RunnerFunction,
} from '@code-pushup/models';
import { executeProcess, readJsonFile } from '@code-pushup/utils';
import {
  KNIP_PLUGIN_SLUG,
  KNIP_REPORT_NAME,
  type KnipAudits,
} from '../constants.js';
import type { CustomReporterOptions } from '../reporter/index.js';

/**
 * @description
 * Reduced implementation of the knip CLI arguments.
 * for a full list see: https://knip.dev/reference/cli
 */
export type KnipCliOptions = Partial<{
  // https://knip.dev/reference/cli#general
  debug: boolean;

  'config-hints': boolean;
  performance: boolean;

  'isolate-workspaces': boolean;
  exitCode: boolean;
  // https://knip.dev/reference/cli#configuration
  config: string; // file path
  tsConfig: string;
  workspace: string; // dir path
  directory: string; // dir path
  gitignore: boolean;

  'include-entry-exports': string;

  'include-libs': string;
  // https://knip.dev/reference/cli#modes
  production: boolean;
  strict: boolean;
  // https://knip.dev/reference/cli#filter
  exclude: KnipAudits[];
  include: KnipAudits[];
  dependencies: string[];
  exports: string[];

  'experimental-tags': string[];
  tags: string[];
}>;
export type RunnerOptions = KnipCliOptions & CustomReporterOptions;

export function createRunnerFunction(
  options: RunnerOptions = {},
): RunnerFunction {
  const {
    outputFile = path.join(KNIP_PLUGIN_SLUG, KNIP_REPORT_NAME),
    rawOutputFile,
  } = options;

  // Resolve the reporter path from the installed package
  const reporterPath = '@code-pushup/knip-plugin/src/lib/reporter.js';

  return async () => {
    await executeProcess({
      command: 'npx',
      args: [
        'knip',
        // off as we want to CI to pass
        '--no-exit-code',
        // off by default to guarantee execution without interference
        '--no-progress',
        // code-pushup reporter is used from the installed package
        `--reporter=${reporterPath}`,
        // code-pushup reporter options are passed as string. Double JSON.stringify ensures proper escaping on all platforms
        `--reporter-options=${JSON.stringify(
          JSON.stringify({
            outputFile,
            rawOutputFile,
          } satisfies CustomReporterOptions),
        )}`,
      ],
    });

    return readJsonFile<AuditOutputs>(outputFile);
  };
}

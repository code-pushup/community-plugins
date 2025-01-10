import type { ReporterOptions } from 'knip';
import { writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { ensureDirectoryExists, ui } from '@code-pushup/utils';
import { KNIP_REPORT_NAME } from './constants';
import { parseCustomReporterOptions } from './model';
import { knipToCpReport } from './utils';

/**
 * @description
 * This custom knip reporter produces code-pushup AuditOutputs and saves it to the filesystem
 *
 * @example
 * run the following command to test it:
 * npx knip --reporter ./dist/packages/plugin-knip/reporter.js --reporter-options='{\"outputFile\":\"my-knip-report.json\"}'
 *
 */
export const knipReporter = async (knipReporterOptions: ReporterOptions) => {
  const { options, report, issues } = knipReporterOptions;
  const customReporterOptions = parseCustomReporterOptions(options);
  const {
    verbose,
    outputFile = KNIP_REPORT_NAME,
    rawOutputFile,
  } = customReporterOptions;
  if (verbose) {
    ui().logger.info(
      `Reporter called with options: ${JSON.stringify(
        customReporterOptions,
        null,
        2,
      )}`,
    );
  }
  if (rawOutputFile != null) {
    await ensureDirectoryExists(dirname(rawOutputFile));
    await writeFile(
      rawOutputFile,
      JSON.stringify(
        {
          ...knipReporterOptions,
          issues: {
            ...issues,
            files: [...issues.files], // files is a Set<string>
          },
          options: customReporterOptions,
        },
        null,
        2,
      ),
    );
    if (verbose) {
      ui().logger.info(`Saved raw report to ${rawOutputFile}`);
    }
  }

  const result = await knipToCpReport({ issues, report });

  await ensureDirectoryExists(dirname(outputFile));
  await writeFile(outputFile, JSON.stringify(result, null, 2));
  if (verbose) {
    ui().logger.info(`Saved report to ${outputFile}`);
  }
};

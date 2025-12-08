import type { ReporterOptions } from 'knip';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { ensureDirectoryExists, logger } from '@code-pushup/utils';
import { KNIP_REPORT_NAME } from '../constants.js';
import { parseCustomReporterOptions } from './model.js';
import { knipToCpReport } from './utils.js';

async function saveRawReport(
  rawOutputFile: string,
  knipReporterOptions: ReporterOptions,
  customReporterOptions: ReturnType<typeof parseCustomReporterOptions>,
  verbose: boolean,
) {
  const rawOutputDir = path.dirname(rawOutputFile);
  if (rawOutputDir && rawOutputDir !== '.' && rawOutputDir !== '') {
    await ensureDirectoryExists(rawOutputDir);
  }
  await writeFile(
    rawOutputFile,
    JSON.stringify(
      {
        ...knipReporterOptions,
        issues: {
          ...knipReporterOptions.issues,
          files: [...knipReporterOptions.issues.files],
        },
        options: customReporterOptions,
      },
      null,
      2,
    ),
  );
  if (verbose) {
    logger.info(`Saved raw report to ${rawOutputFile}`);
  }
}

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
  const { options, issues, report } = knipReporterOptions;
  const customReporterOptions = parseCustomReporterOptions(options);
  const {
    verbose,
    outputFile = KNIP_REPORT_NAME,
    rawOutputFile,
  } = customReporterOptions;

  if (verbose) {
    logger.info(
      `Reporter called with options: ${JSON.stringify(customReporterOptions, null, 2)}`,
    );
  }

  if (rawOutputFile != null) {
    await saveRawReport(
      rawOutputFile,
      knipReporterOptions,
      customReporterOptions,
      verbose ?? false,
    );
  }

  const result = await knipToCpReport({ issues, report });

  const outputDir = path.dirname(outputFile);
  if (outputDir && outputDir !== '.' && outputDir !== '') {
    await ensureDirectoryExists(outputDir);
  }
  await writeFile(outputFile, JSON.stringify(result, null, 2));
  if (verbose) {
    logger.info(`Saved report to ${outputFile}`);
  }
};

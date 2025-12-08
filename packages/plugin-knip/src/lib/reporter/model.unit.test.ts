import chalk from 'chalk';
import { describe, expect, it } from 'vitest';
import { CustomReporterOptions, parseCustomReporterOptions } from './model.js';

describe('parseCustomReporterOptions', () => {
  it('should return empty object if no reporter options are given', () => {
    expect(parseCustomReporterOptions()).toStrictEqual({});
  });

  it('should return valid report options', () => {
    expect(
      parseCustomReporterOptions(
        JSON.stringify({
          outputFile: 'my-knip-report.json',
          rawOutputFile: 'my-knip-raw-report.json',
        } satisfies CustomReporterOptions),
      ),
    ).toStrictEqual({
      outputFile: 'my-knip-report.json',
      rawOutputFile: 'my-knip-raw-report.json',
    });
  });

  it('should throw for invalid reporter-options argument', () => {
    expect(() => parseCustomReporterOptions('{asd')).toThrowError(
      String.raw`The passed knip reporter options have to be a JSON parseable string. E.g. --reporter-options='{\"prop\":42}'`,
    );
    expect(() => parseCustomReporterOptions('{asd')).toThrowError(
      `Option string: ${chalk.bold('{asd')}`,
    );
  });
});

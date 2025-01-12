import { bold } from 'ansis';
import { describe, expect, it } from 'vitest';
import { CustomReporterOptions, parseCustomReporterOptions } from './model';

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
    expect(() => parseCustomReporterOptions('{asd')).toThrow(
      `The passed knip reporter options have to be a JSON parseable string. E.g. --reporter-options='{\\"prop\\":42}'`,
    );
    expect(() => parseCustomReporterOptions('{asd')).toThrow(
      `Option string: ${bold('{asd')}`,
    );
    expect(() => parseCustomReporterOptions('{asd')).toThrow(
      ` Expected property name or '}' in JSON at position 1`,
    );
  });

  it('should throw for invalid options', () => {
    const opt = JSON.stringify({
      verbose: 'test',
    } as unknown as CustomReporterOptions);
    expect(() => parseCustomReporterOptions(opt)).toThrow(
      'The reporter options options have to follow the schema.',
    );
    expect(() => parseCustomReporterOptions(opt)).toThrow('invalid_type');
  });
});

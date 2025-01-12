import { bold } from 'ansis';
import { z } from 'zod';

export const customReporterOptionsSchema = z.object({
  verbose: z.boolean().optional(),
  outputFile: z.string().optional(), // TODO change into filePathSchema when @code-pushup/models releases new version
  rawOutputFile: z.string().optional(), // TODO change into filePathSchema when @code-pushup/models releases new version
});

export type CustomReporterOptions = z.infer<typeof customReporterOptionsSchema>;

export function parseCustomReporterOptions(
  optionsString?: string,
): CustomReporterOptions {
  let rawJson;
  try {
    rawJson =
      typeof optionsString === 'string' && optionsString !== ''
        ? (JSON.parse(optionsString) as Record<string, unknown>)
        : {};
  } catch (error) {
    throw new Error(`The passed knip reporter options have to be a JSON parseable string. E.g. --reporter-options='{\\"prop\\":42}'
    Option string: ${bold(optionsString)}
    Error: ${(error as Error).message}`);
  }

  try {
    return customReporterOptionsSchema.parse(rawJson);
  } catch (error) {
    throw new Error(`The reporter options options have to follow the schema.'
    Error: ${(error as Error).message}`);
  }
}

import path from 'node:path';
import * as process from 'node:process';
import stylelint from 'stylelint';
import type { RcPath } from '../types.js';
import type { NormalizedStyleLintConfig } from './model.js';

const NORMALIZED_CONFIG_CACHE = new Map<string, NormalizedStyleLintConfig>();
/**
 * Function that consumes the StyleLint configuration processor and returns a normalized config
 * @param stylelintrc - The path to the StyleLint configuration file
 * @param cwd - The current working directory
 * @returns A normalized StyleLint configuration
 */
export async function getNormalizedConfig({
  stylelintrc,
  cwd,
}: RcPath & {
  cwd?: string;
}): Promise<NormalizedStyleLintConfig> {
  const parsedStylelintrc =
    stylelintrc ?? path.join(cwd ?? process.cwd(), '.stylelintrc.json'); // @TODO use a const
  if (!NORMALIZED_CONFIG_CACHE.has(parsedStylelintrc)) {
    const resolvedConfig = await stylelint.resolveConfig(parsedStylelintrc);
    if (!resolvedConfig) {
      throw new Error(`Could not resolve config for ${parsedStylelintrc}`);
    }
    const normalizedConfig: NormalizedStyleLintConfig = {
      config: {
        rules: resolvedConfig.rules ?? {},
        defaultSeverity: resolvedConfig.defaultSeverity,
      },
    };
    NORMALIZED_CONFIG_CACHE.set(parsedStylelintrc, normalizedConfig);
  }
  return NORMALIZED_CONFIG_CACHE.get(
    parsedStylelintrc,
  ) as NormalizedStyleLintConfig;
}

import { Audit, type CategoryRef } from '@code-pushup/models';
import { importModule } from '@code-pushup/utils';
import { JS_BENCHMARK_PLUGIN_SLUG } from './constants.js';
import { type SuiteConfig, toAuditSlug } from './runner/index.js';

export function toAuditTitle(suiteName: string): string {
  return `${suiteName}`;
}

export function toAuditMetadata(suiteNames: string[]): Audit[] {
  return suiteNames.map(
    suiteName =>
      ({
        slug: toAuditSlug(suiteName),
        title: toAuditTitle(suiteName),
      } satisfies Audit),
  );
}
export function jsBenchmarkingSuiteNameToCategoryRef(
  suiteName: string,
): CategoryRef {
  return {
    type: 'audit',
    plugin: JS_BENCHMARK_PLUGIN_SLUG,
    slug: toAuditSlug(suiteName),
    weight: 1,
  } satisfies CategoryRef;
}

export type LoadOptions = {
  tsconfig?: string;
};

export function loadSuites(
  targets: string[],
  options: LoadOptions = {},
): Promise<SuiteConfig[]> {
  const { tsconfig } = options;
  return Promise.all(
    targets.map((filepath: string) =>
        importModule<SuiteConfig>({
        tsconfig,
        filepath,
      }),
    ),
  );
}

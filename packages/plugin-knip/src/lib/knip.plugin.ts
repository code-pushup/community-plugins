import path from 'node:path';
import type { PluginConfig } from '@code-pushup/models';
import { KNIP_AUDITS, KNIP_GROUPS, KNIP_PLUGIN_SLUG } from './constants.js';
import { RunnerOptions, createRunnerFunction } from './runner/index.js';

export type PluginOptions = RunnerOptions;

export function knipPlugin(options: PluginOptions = {}): PluginConfig {
  const {
    outputFile = path.join(
      '.code-pushup',
      KNIP_PLUGIN_SLUG,
      `knip-report-${Date.now()}.json`,
    ),
    ...runnerOptions
  } = options;
  return {
    slug: KNIP_PLUGIN_SLUG,
    title: 'Knip',
    icon: 'folder-javascript',
    description: 'A plugin to track dependencies and duplicates',
    runner: createRunnerFunction({
      ...runnerOptions,
      outputFile,
    }),
    audits: KNIP_AUDITS,
    groups: KNIP_GROUPS,
  };
}

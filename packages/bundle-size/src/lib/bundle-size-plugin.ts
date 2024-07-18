import {
  AuditOutputs,
  PluginConfig,
  RunnerFunction,
} from '@code-pushup/models';
import { bundleSizeRunner } from './runner';

export default bundleSizePlugin;

export type BundleSizePluginOptions = {};

export function bundleSizePlugin(
  options?: BundleSizePluginOptions,
): PluginConfig {
  return {
    slug: 'bundle-size',
    title: 'Bundle size',
    description: 'Bundle size plugin for Code PushUp',
    icon: 'folder-css',
    runner: bundleSizeRunner(),
    audits: [
      {
        slug: 'bundle-size',
        title: 'Bundle size',
        description: 'Bundle size audit',
      },
    ],
  };
}

import { PluginConfig } from '@code-pushup/models';
import { pluginCoolRunner } from './runner';

export default pluginCoolPlugin;

export type PluginCoolPluginConfig = {
  opt1?: string;
};
export function pluginCoolPlugin(
  options?: PluginCoolPluginConfig,
): PluginConfig {
  return {
    slug: 'plugin-cool',
    title: 'plugin-cool',
    description: 'plugin-cool plugin for Code PushUp',
    icon: 'folder',
    runner: pluginCoolRunner(),
    audits: [
      {
        slug: 'plugin-cool-audit',
        title: 'plugin-cool Audit',
        description: `plugin-cool audit ${options?.opt1 ?? ''}`,
      },
    ],
  };
}

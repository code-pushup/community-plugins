import { PluginConfig } from '@code-pushup/models';
import { fileSizeRunner } from './runner';

export default fileSizePlugin;

export type FileSizePluginConfig = {
  opt1?: string;
};
export function fileSizePlugin(options?: FileSizePluginConfig): PluginConfig {
  return {
    slug: 'file-size',
    title: 'file-size',
    description: 'file-size plugin for Code PushUp',
    icon: 'folder',
    runner: fileSizeRunner(),
    audits: [
      {
        slug: 'file-size-audit',
        title: 'file-size Audit',
        description: `file-size audit ${options?.opt1 ?? ''}`,
      },
    ],
  };
}

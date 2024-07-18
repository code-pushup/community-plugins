import { readFile, rm, writeFile } from 'fs/promises';
import { join, relative, resolve } from 'path';
import {
  AuditOutput,
  AuditReport,
  CoreConfig,
  PluginReport,
  Report,
} from '@code-pushup/models';
import { formatFiles, generateFiles } from '@nx/devkit';
import {
  ensureDirectoryExists,
  executeProcess,
  objectToCliArgs,
  ProcessResult,
  readJsonFile,
} from '@code-pushup/utils';
import { createTree } from 'nx/src/generators/testing-utils/create-tree';

export function omitVariableAuditData({
  score,
  value,
  displayValue,
  ...auditReport
}: AuditReport | AuditOutput) {
  return auditReport;
}

export function omitVariablePluginData(
  { date, duration, version, audits, ...pluginReport }: PluginReport,
  options?: {
    omitAuditData: boolean;
  },
) {
  const { omitAuditData } = options ?? {};
  return {
    ...pluginReport,
    audits: audits.map((plugin) =>
      omitAuditData ? omitVariableAuditData(plugin) : plugin,
    ) as AuditReport[],
  } as PluginReport;
}

export function omitVariableReportData(
  { commit, date, duration, version, ...report }: Report,
  options?: {
    omitAuditData: boolean;
  },
) {
  return {
    ...report,
    plugins: report.plugins.map((plugin) =>
      omitVariablePluginData(plugin, options),
    ),
  };
}

async function generateFilesScript(options: {
  templatePath: string;
  targetFolder: string;
}) {
  const { templatePath, targetFolder } = options;
  const tree = createTree();
  const substitutions = {
    ...options,
  };

  generateFiles(tree, templatePath, targetFolder, substitutions);
  await formatFiles(tree);

  const changes = tree.listChanges();
  changes.forEach(async (change) => {
    const filePath = join(targetFolder, change.path);
    if (change.type === 'CREATE' || change.type === 'UPDATE') {
      await writeFile(filePath, change?.content?.toString() ?? '');
    }
  });
}

export async function cleanTestFolder(folderPath: string): Promise<void> {
  await rm(folderPath, { recursive: true, force: true });
}

export async function readReportJson(
  baseDir: string,
  outputPath = '.code-pushup',
  filename = 'report.json',
): Promise<Report> {
  return readJsonFile(join(baseDir, outputPath, filename));
}

export async function executeCliCollectForPlugin(
  pluginSlug: string,
  args: Omit<CoreConfig, 'plugins' | 'categories'>,
  cwd: string,
): Promise<ProcessResult> {
  return executeCli(
    'collect',
    {
      onlyPlugins: [pluginSlug],
    },
    cwd,
  );
}

export async function executeCli(
  command: 'autorun' | 'collect' | 'upload',
  args: Omit<CoreConfig, 'plugins' | 'categories'> & {
    onlyPlugins?: string[];
  },
  cwd: string,
): Promise<ProcessResult> {
  return executeProcess({
    command: 'code-pushup',
    args: [
      command,
      ...objectToCliArgs({
        progress: false,
        ...args,
      }),
    ],
    ...(cwd ? { cwd } : {}),
  });
}

export async function addCodePushupConfigFile(options?: {
  format?: 'ts';
  fileName?: string[];
  fileImports?: string[];
  pluginStrings?: string[];
  targetFolder?: string;
  config?: CoreConfig;
}): Promise<void> {
  const {
    format = 'ts',
    config,
    targetFolder = '',
    fileImports,
    fileName,
    pluginStrings,
  } = options ?? {};

  const filePath = resolve(
    targetFolder,
    `${fileName ?? 'code-pushup.config'}.${format}`,
  );
  try {
    const existingFile = await readFile(filePath);
    console.log(`File ${filePath} already exists`);
    return;
  } catch (error) {
    console.log(`Create file ${filePath}`);
  }

  ensureDirectoryExists(targetFolder);

  const pluginString = (plugins?: string[]) => {
    return (plugins ?? []).join(',\n');
  };

  /*await generateFilesScript({
        templatePath: resolve('testing', 'templates', 'files', 'config'),
        targetFolder
    });*/

  await writeFile(
    filePath,
    `
    ${(fileImports ?? []).concat('import {CoreConfig} from "@code-pushup/models";').join('\n')}
    const config: CoreConfig = ${JSON.stringify(
      {
        plugins: ['{PLUGINS}'],
        ...config,
      },
      null,
      2,
    )}
    export default config; 
    `.replace(/"{PLUGINS}"/g, `${pluginString(pluginStrings)}`),
  );
}

export function getRelativePathToPluginDist(
  baseDir: string,
  pluginName: string,
) {
  const pluginDir = resolve(`dist/packages/${pluginName}`);
  return relative(baseDir, pluginDir);
}

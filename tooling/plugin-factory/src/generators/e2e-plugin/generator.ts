import { formatFiles, generateFiles, names, Tree } from '@nx/devkit';
import { E2ePluginGeneratorSchema } from './schema';
import { join } from 'path';

export function e2eProjectName(pluginName: string) {
  return `${pluginName}-e2e`;
}

export async function e2ePluginGenerator(
  tree: Tree,
  options: E2ePluginGeneratorSchema,
) {
  const { pluginName } = options;
  const projectName = e2eProjectName(pluginName);
  const projectRoot = `./e2e/${pluginName}`;

  const pluginNames = names(pluginName);

  // add plugin logic
  generateFiles(tree, join(__dirname, 'files'), projectRoot, {
    pluginSlug: pluginNames.fileName,
    projectName,
    pluginFnName: `${pluginNames.propertyName}Plugin`,
    pluginFileName: pluginNames.fileName,
    pluginName,
    tmpl: '',
  });

  await formatFiles(tree);
}

export default e2ePluginGenerator;

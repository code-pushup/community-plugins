import {
  CategoryConfig,
  CategoryRef,
  CoreConfig,
  PersistConfig,
  UploadConfig,
} from '@code-pushup/models';
import { resolve } from 'path';
import { readFile } from 'fs/promises';
import { generateFiles, Tree } from '@nx/devkit';

export async function addCodePushupConfigFile(
  tree: Tree,
  targetFolder: string,
  options?: {
    configFile: {
      format?: 'ts';
      name?: string[];
      fileImports?: string[];
      config?: CoreConfig;
    };
    plugins: {
      importPath?: string;
      exportName?: string;
    }[];
    categories?: string[];
    upload?: UploadConfig;
    persist?: PersistConfig;
  },
): Promise<void> {
  console.log('addCodePushupConfigFile: ', options);

  const { configFile, plugins, categories, persist, upload } = options ?? {};

  const {
    format = 'ts',
    config,
    name: configFileName,
    fileImports,
  } = configFile ?? {};

  const codePushupConfigPath = resolve(
    targetFolder,
    `${configFileName ?? 'code-pushup.config'}.${format}`,
  );

  try {
    await readFile(codePushupConfigPath);
    console.log(`File ${codePushupConfigPath} already exists`);
    return;
  } catch (error) {
    console.log(`Error creating file ${codePushupConfigPath}`);
  }

  const { pluginFileImports, pluginConfigCalls } = (plugins ?? []).reduce(
    (acc, plugin, idx) => {
      const { exportName = `plugin${idx}`, importPath } = plugin;
      return {
        pluginFileImports: acc.pluginFileImports.concat(
          `import ${exportName} from "${importPath}";`,
        ),
        pluginConfigCalls: acc.pluginConfigCalls.concat(`${exportName}()`),
      };
    },
    { pluginFileImports: [], pluginConfigCalls: [] },
  );

  generateFiles(
    tree,
    'tooling/plugin-factory/src/internal/files/code-pushup-config',
    targetFolder,
    {
      fileImports: (fileImports ?? [])
        .concat('import { CoreConfig } from "@code-pushup/models";')
        .concat(pluginFileImports)
        .join('\n'),
      pluginsConfig: pluginConfigCalls && `[${pluginConfigCalls.join(',\n')}]`,
      categoriesConfig: categories && `[${categories.join(',\n')}]`,
      persistConfig: persist && JSON.stringify(persist, null, 2),
      updateConfig: upload && JSON.stringify(upload, null, 2),
      tmpl: '',
    },
  );
}

// return a formatted JSON object with the same keys as the input object but remove the " for the properties
export function formatObjectToFormattedJsString(jsonObj: {
  [key: string]: any;
}): string {
  // Convert JSON object to a string with indentation
  const jsonString = JSON.stringify(jsonObj, null, 4);

  // Remove double quotes around property names
  const formattedString = jsonString.replace(/"(\w+)":/g, '$1:');

  return formattedString;
}

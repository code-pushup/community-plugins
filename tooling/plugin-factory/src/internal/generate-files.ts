import {CategoryConfig, CoreConfig, PersistConfig, UploadConfig} from "@code-pushup/models";
import {resolve} from "path";
import {readFile} from "fs/promises";
import {generateFiles, Tree} from "@nx/devkit";


export async function addCodePushupConfigFile(tree: Tree, targetFolder: string, options?: {
    configFile: {
        format?: 'ts';
        name?: string[];
        config?: CoreConfig;
    }
    plugins: {
        importPath?: string;
        exportName?: string;
    }[],
    categories?: {
        slug: string;
        title?: string;
        refs: { pluginSlug: string; auditSlug: string;  }[];
    }[];
    upload?: UploadConfig,
    persist?: PersistConfig,
}): Promise<void> {
    console.log('addCodePushupConfigFile: ', options);

    const {
        configFile,
        plugins,
        categories,
        persist,
        upload
    } = options ?? {};

    const {
        format = 'ts',
        config,
        name: configFileName
    } =  configFile ?? {};

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

    const {fileImports, pluginConfigCalls} = (plugins ?? []).reduce((acc, plugin, idx) => {
        const { exportName = `plugin${idx}`, importPath} = plugin;
        return {
            fileImports: acc.fileImports.concat(`import ${exportName} from "${importPath}";`),
            pluginConfigCalls: acc.pluginConfigCalls.concat(`${exportName}()`)
        }
    }, {fileImports: [], pluginConfigCalls: []});

    const categoriesConfig = (categories ?? []).length && categories.map(({slug, title, refs}) => [{
        slug,
        title: title ?? slug,
        refs: (refs ?? []).map(({pluginSlug, auditSlug}) => ({plugin: pluginSlug, type: 'audit' , slug: auditSlug, weight: 1}))
    }] satisfies CategoryConfig[]);

    generateFiles(tree, 'tooling/plugin-factory/src/internal/files/code-pushup-config', targetFolder, {
        fileImports: [
            'import { CoreConfig } from "@code-pushup/models";'
        ].concat(fileImports).join('\n'),
        pluginsConfig: pluginConfigCalls && `[${pluginConfigCalls.join(',\n')}]`,
        categoriesConfig: categoriesConfig && `${categoriesConfig.map(formatObjectToFormattedJsString).join(',\n')}`,
        persistConfig: persist && JSON.stringify(persist, null,   2),
        updateConfig: upload && JSON.stringify(upload, null,   2),
        tmpl: ''
    });
}




// return a formatted JSON object with the same keys as the input object but remove the " for the properties
function formatObjectToFormattedJsString(jsonObj: { [key: string]: any }): string {
    // Convert JSON object to a string with indentation
    const jsonString = JSON.stringify(jsonObj, null, 4);

    // Remove double quotes around property names
    const formattedString = jsonString.replace(/"(\w+)":/g, '$1:');

    return formattedString;
}

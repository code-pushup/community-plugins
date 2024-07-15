import {
    addProjectConfiguration,
    formatFiles,
    generateFiles, names, readJson, readProjectConfiguration,
    Tree, updateJson, updateProjectConfiguration,
} from '@nx/devkit';
import * as path from 'path';
import {PluginGeneratorSchema} from './schema';
import {libraryGenerator} from '@nx/js';
import {updateProjectConfig} from "@nx/node/src/generators/setup-docker/setup-docker";

export async function pluginGenerator(
    tree: Tree,
    options: PluginGeneratorSchema,
) {
    const {name, skipTest, skipE2e, categoryName} = options;
    const projectRoot = `./packages/${name}`;

    await libraryGenerator(tree, {
        name: name,
        tags: "scope:plugin",
        linter: 'eslint',
        unitTestRunner: skipTest ? 'none' : 'vitest',
        bundler: 'esbuild'
    });

    const pluginNames = names(name);
    const {fileName: formattedCategoryName} = names(categoryName ?? 'My Category');

    const pCfg = readProjectConfiguration(tree, name)
    await updateProjectConfiguration(tree, name, {
        root: projectRoot,
        sourceRoot: `${projectRoot}/src`,
        projectType: 'library',
        targets: {
            ...pCfg.targets,
            "code-pushup": {
                "command": `npx @code-pushup/cli collect --config ${projectRoot}/code-pushup.config.ts --onlyPlugins=${pluginNames.fileName}`,
            },
        }
    });
    // clean irrelevant files
    tree.delete(`${projectRoot}/src/lib/${name}.ts`);
    tree.delete(`${projectRoot}/src/lib/${name}.spec.ts`);

    if (!options?.skipTest) {
        // rename existing tsconfig.spec.json
        tree.rename(`${projectRoot}/tsconfig.spec.json`, `${projectRoot}/tsconfig.test.json`);
        // update tsconfig references for renamed tsconfig.test.json
        updateJson(tree, `${projectRoot}/tsconfig.json`, (json) => ({
            ...json,
            references: json.references.map((ref: any) => ({
                ...ref,
                path: ref.path === './tsconfig.spec.json' ? './tsconfig.test.json' : ref.path
            }))
        }));

        // update tsconfig.test.json
        updateJson(tree, `${projectRoot}/tsconfig.test.json`, (json) => ({
            ...json,
            include: [
                './mock/**/*.ts',
                ...json.include
            ]
        }));

        // add plugin test logic
        generateFiles(tree, path.join(__dirname, 'tests'), projectRoot, {
            ...pluginNames,
            categoryName: formattedCategoryName,
            tmpl: ''
        });
    }

    // add plugin logic
    generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
        ...pluginNames,
        categoryName: formattedCategoryName,
        tmpl: ''
    });

    await formatFiles(tree);
}

export default pluginGenerator;

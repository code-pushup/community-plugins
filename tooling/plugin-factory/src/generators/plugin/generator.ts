import {
  formatFiles,
  generateFiles,
  names,
  readProjectConfiguration,
  Tree,
  updateJson,
  updateProjectConfiguration,
  workspaceRoot,
} from '@nx/devkit';
import { relative, join } from 'path';
import { PluginGeneratorSchema } from './schema';
import { libraryGenerator } from '@nx/js';
import e2ePluginGenerator from '../e2e-plugin/generator';

export async function pluginGenerator(
  tree: Tree,
  options: PluginGeneratorSchema,
) {
  const { name, skipTest, skipE2e, categoryName } = options;
  const projectRoot = `./packages/${name}`;

  await libraryGenerator(tree, {
    name: name,
    tags: 'scope:plugin',
    linter: 'eslint',
    unitTestRunner: skipTest ? 'none' : 'vitest',
    testEnvironment: 'node',
    bundler: 'esbuild',
  });

  const pluginNames = names(name);
  const { fileName: formattedCategoryName } = names(
    categoryName ?? 'My Category',
  );

  const pCfg = readProjectConfiguration(tree, name);
  await updateProjectConfiguration(tree, name, {
    ...pCfg,
    targets: {
      ...pCfg.targets,
      'code-pushup': {
        command: `npx @code-pushup/cli collect --config ${projectRoot}/code-pushup.config.ts --onlyPlugins=${pluginNames.fileName}`,
      },
    },
  });

  updateJson(
    tree,
    `${projectRoot}/package.json`,
    ({ type, main, ...rest }) => rest,
  );

  // clean irrelevant files
  tree.delete(`${projectRoot}/src/lib/${name}.ts`);
  tree.delete(`${projectRoot}/src/lib/${name}.spec.ts`);

  if (!options?.skipTest) {
    // delete existing vite.config.json
    tree.delete(`${projectRoot}/vite.config.ts`);

    // rename existing tsconfig.spec.json
    tree.rename(
      `${projectRoot}/tsconfig.spec.json`,
      `${projectRoot}/tsconfig.test.json`,
    );
    // update tsconfig references for renamed tsconfig.test.json
    updateJson(tree, `${projectRoot}/tsconfig.json`, (json) => ({
      ...json,
      compilerOptions: {
        ...json.compilerOptions,
        module: 'ESNext',
      },
      references: json.references.map((ref: any) => ({
        ...ref,
        path:
          ref.path === './tsconfig.spec.json'
            ? './tsconfig.test.json'
            : ref.path,
      })),
    }));

    // update tsconfig.test.json
    updateJson(tree, `${projectRoot}/tsconfig.test.json`, (json) => ({
      ...json,
      include: [
        'vite.config.unit.ts',
        'vite.config.integration.ts',
        'mocks/**/*.ts',
        ...json.include,
      ],
    }));

    // add test targets
    const pCfg = readProjectConfiguration(tree, name);
    await updateProjectConfiguration(tree, name, {
      ...pCfg,
      targets: {
        ...Object.fromEntries(
          Object.entries(pCfg.targets).filter(
            ([targetName]) => targetName !== 'test',
          ),
        ),
        build: {
          ...pCfg.targets.build,
          options: {
            ...pCfg.targets.build.options,
            format: ['esm'],
          },
        },
        'unit-test': {
          executor: '@nx/vite:test',
          options: {
            config: `${projectRoot}/vite.config.unit.ts`,
          },
        },
        'integration-test': {
          executor: '@nx/vite:test',
          options: {
            config: `${projectRoot}/vite.config.integration.ts`,
          },
        },
      },
    });

    // add e2e project and tests
    if (!options?.skipE2e) {
      await e2ePluginGenerator(tree, {
        pluginName: name,
        skipTest: false,
      });
    }

    // add plugin test logic
    generateFiles(tree, join(__dirname, 'tests'), projectRoot, {
      ...pluginNames,
      relativeToRoot: relative(projectRoot, workspaceRoot),
      categoryName: formattedCategoryName,
      tmpl: '',
    });
  }

  // add plugin logic
  generateFiles(tree, join(__dirname, 'files'), projectRoot, {
    ...pluginNames,
    categoryName: formattedCategoryName,
    tmpl: '',
  });

  await formatFiles(tree);
}

export default pluginGenerator;

import { SymbolType } from 'knip/dist/types/issues';
import { ReporterOptions } from 'knip';

export const rawReport: Pick<ReporterOptions, 'report' | 'issues' | 'options'> =
  {
    report: {
      files: true,
      dependencies: true,
      devDependencies: true,
      optionalPeerDependencies: true,
      unlisted: true,
      binaries: true,
      unresolved: true,
      exports: true,
      nsExports: true,
      types: true,
      nsTypes: true,
      enumMembers: true,
      classMembers: true,
      duplicates: true,
    },
    issues: {
      files: new Set([
        '/Users/username/Projects/code-pushup-cli/code-pushup.config.ts',
      ]),
      dependencies: {
        'package.json': {
          'cli-table3': {
            type: 'dependencies',
            filePath: '/Users/username/Projects/code-pushup-cli/package.json',
            symbol: 'cli-table3',
            severity: 'error',
          },
        },
      },
      devDependencies: {
        'package.json': {
          '@trivago/prettier-plugin-sort-imports': {
            type: 'devDependencies',
            filePath: '/Users/username/Projects/code-pushup-cli/package.json',
            symbol: '@trivago/prettier-plugin-sort-imports',
            severity: 'error',
          },
        },
      },
      optionalPeerDependencies: {
        'package.json': {
          'ts-node': {
            type: 'devDependencies',
            filePath: '/Users/username/Projects/code-pushup-cli/package.json',
            symbol: 'ts-node',
            severity: 'error',
          },
        },
      },
      unlisted: {
        'packages/utils/.eslintrc.json': {
          'jsonc-eslint-parser': {
            type: 'unlisted',
            symbol: 'jsonc-eslint-parser',
            filePath:
              '/User/username/code-pushup-cli/packages/utils/package.json',
          },
        },
        'examples/plugins/.eslintrc.json': {
          'jsonc-eslint-parser': {
            type: 'unlisted',
            symbol: 'jsonc-eslint-parser',
            filePath:
              '/User/username/code-pushup-cli/packages/utils/package.json',
          },
        },
      },
      // @TODO add real life example data
      binaries: {},
      unresolved: {
        'packages/models/src/lib/category-config.ts': {
          'some-package': {
            type: 'unresolved',
            symbol: 'smo-package',
            filePath:
              '/Users/username/Projects/code-pushup-cli/packages/models/src/lib/category-config.ts',
            line: 8,
            col: 23,
          },
        },
      },
      exports: {
        'packages/models/src/lib/category-config.ts': {
          duplicateErrorMsg: {
            type: 'exports',
            filePath:
              '/Users/username/Projects/code-pushup-cli/packages/models/src/lib/category-config.ts',
            symbol: 'duplicateErrorMsg',
            symbolType: 'function' as SymbolType,
            line: 54,
            col: 17,
            severity: 'error',
          },
        },
      },
      // @TODO add real life example data
      nsExports: {},
      types: {
        'packages/models/src/lib/group.ts': {
          GroupMeta: {
            type: 'types',
            filePath:
              '/Users/username/Projects/code-pushup-cli/packages/models/src/lib/group.ts',
            symbol: 'GroupMeta',
            symbolType: 'type' as SymbolType,
            line: 26,
            col: 13,
            severity: 'error',
          },
        },
      },
      // @TODO add real life example data
      nsTypes: {},
      enumMembers: {
        'packages/models/src/lib/group.ts': {
          MyEnum: {
            type: 'enumMembers',
            filePath:
              '/Users/username/Projects/code-pushup-cli/packages/models/src/lib/group.ts',
            symbol: 'unusedMember',
            symbolType: 'enum' as SymbolType,
            line: 26,
            col: 13,
            severity: 'error',
          },
        },
      },
      classMembers: {
        'packages/models/src/lib/group.ts': {
          MyClass: {
            type: 'classMembers',
            filePath:
              '/Users/username/Projects/code-pushup-cli/packages/models/src/lib/group.ts',
            symbol: 'unusedKey',
            symbolType: 'enum' as SymbolType,
            line: 40,
            col: 687,
            severity: 'error',
          },
        },
      },
      duplicates: {
        'packages/nx-plugin/src/generators/configuration/generator.ts': {
          'configurationGenerator|default': {
            type: 'duplicates',
            filePath:
              '/Users/michael_hladky/WebstormProjects/quality-metrics-cli/packages/nx-plugin/src/generators/configuration/generator.ts',
            symbol: 'configurationGenerator|default',
            symbols: [
              {
                symbol: 'configurationGenerator',
                line: 1,
                col: 57,
              },
              {
                symbol: 'default',
                line: 54,
                col: 15,
              },
            ],
            severity: 'error',
          },
        },
      },
    },
    options: JSON.stringify({
      outputFile: 'knip-report.json',
      rawOutputFile: 'raw-knip-report.json',
    }),
  };

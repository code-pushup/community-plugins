import { CreateNodes, CreateNodesContext, readJsonFile } from '@nx/devkit';
import { dirname } from 'node:path';

export const createNodes: CreateNodes = [
  '**/project.json',
  (projectConfigurationFile: string, opts, context: CreateNodesContext) => {
    const projectConfiguration = readJsonFile(projectConfigurationFile);
    const root = dirname(projectConfigurationFile);

    console.log('projectConfiguration', projectConfiguration);
    return {
      projects: {
        [root]: {
          ...projectConfiguration,
          targets: {
            ...projectConfiguration.targets,
            'unit-test': {
              executor: '@nx/vite:test',
              options: {
                config: `packages/${projectConfiguration.name}/vite.config.unit.ts`,
              },
            },
            'integration-test': {
              executor: '@nx/vite:test',
              options: {
                config: `packages/${projectConfiguration.name}/vite.config.integration.ts`,
              },
            },
          },
        },
      },
    };
  },
];

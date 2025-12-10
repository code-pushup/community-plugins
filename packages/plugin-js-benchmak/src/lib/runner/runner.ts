import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { AuditOutputs, RunnerFunction } from '@code-pushup/models';
import { importModule } from '@code-pushup/utils';
import { JS_BENCHMARK_PLUGIN_SLUG } from '../constants.js';
import { loadSuites } from '../utils.js';
import { BenchmarkResult, BenchmarkRunner, SuiteConfig } from './types.js';
import { suiteResultToAuditOutput } from './utils.js';

export function createRunnerFunction(
  targets: string[],
  options: {
    runnerPath: string;
    outputDir?: string;
    tsconfig?: string;
  },
): RunnerFunction {
  const {
    outputDir = path.join('.code-pushup', JS_BENCHMARK_PLUGIN_SLUG),
    runnerPath: filepath,
    tsconfig,
  } = options;
  return async (): Promise<AuditOutputs> => {
    // Load suites at runtime instead of at config time
    const suites: SuiteConfig[] = await loadSuites(targets, { tsconfig });

    const allSuiteResults: BenchmarkResult[][] = [];
    // Execute each suite sequentially
    // eslint-disable-next-line functional/no-loop-statements
    for (const suite of suites) {
      const runner = await importModule<BenchmarkRunner>({
        filepath,
      });
      const result: BenchmarkResult[] = await runner.run(suite);
      if (outputDir && outputDir !== '') {
        await writeFile(
          path.join(outputDir, `${suite.suiteName}-benchmark.json`),
          JSON.stringify(result, null, 2),
        );
      }
      // eslint-disable-next-line functional/immutable-data
      allSuiteResults.push(result);
    }

    // create audit output
    return allSuiteResults.map(suiteResultToAuditOutput);
  };
}

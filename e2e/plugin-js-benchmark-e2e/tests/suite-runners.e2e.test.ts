import { cp } from 'node:fs/promises';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { nxTargetProject } from '@code-pushup/test-nx-utils';
import {
  E2E_ENVIRONMENTS_DIR,
  TEST_OUTPUT_DIR,
  restoreNxIgnoredFiles,
  teardownTestFolder,
} from '@code-pushup/test-utils';

describe('suite-runners', () => {
  const envDir = path.join(E2E_ENVIRONMENTS_DIR, nxTargetProject());
  const testFileDir = path.join(envDir, TEST_OUTPUT_DIR, 'suite-runners');
  const fixturesDir = path.join(
    'e2e',
    nxTargetProject(),
    'mocks/fixtures/default-setup',
  );

  const cases = [
    ['fast-operation', () => 1 + 1],
    [
      'slow-operation',
      () => Array.from({ length: 50_000 }, (_, i) => 
        Math.sqrt(Math.log(i + 1) * Math.sin(i))
      ).reduce((total, value) => total + value, 0),
    ],
  ];

  beforeAll(async () => {
    await cp(fixturesDir, testFileDir, { recursive: true });
    await restoreNxIgnoredFiles(testFileDir);
  });

  afterAll(async () => {
    await teardownTestFolder(testFileDir);
  });

  it('should be able to import and use tinybench suite runner', async () => {
    const { tinybenchRunner, benchToBenchmarkResult } = await import(
      path.resolve(
        envDir,
        'node_modules/@code-pushup/js-benchmark-plugin/src/plugins/tinybench.suite-runner.js',
      )
    );

    expect(tinybenchRunner).toBeDefined();
    expect(typeof tinybenchRunner.run).toBe('function');
    expect(benchToBenchmarkResult).toBeDefined();
    expect(typeof benchToBenchmarkResult).toBe('function');
  });

  it('should run tinybench suite with simple test cases', async () => {
    const { tinybenchRunner } = await import(
      path.resolve(
        envDir,
        'node_modules/@code-pushup/js-benchmark-plugin/src/plugins/tinybench.suite-runner.js',
      )
    );

    const suiteConfig = {
      suiteName: 'tinybench-simple-test',
      targetImplementation: 'fast-operation',
      cases,
      time: 1000,
    };

    await expect(
      tinybenchRunner.run(suiteConfig, {
        outputDir: testFileDir,
        outputFileName: 'tinybench-simple-test',
      }),
    ).resolves.toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          suiteName: 'tinybench-simple-test',
          name: 'fast-operation',
          hz: expect.any(Number),
          rme: expect.any(Number),
          samples: expect.any(Number),
          isTarget: true,
          isFastest: true,
        }),
        expect.objectContaining({
          suiteName: 'tinybench-simple-test',
          name: 'slow-operation',
          hz: expect.any(Number),
          rme: expect.any(Number),
          samples: expect.any(Number),
          isTarget: false,
          isFastest: false,
        }),
      ]),
    );
  });

  it('should be able to import and use benchmark suite runner', async () => {
    const { benchmarkRunner, benchToBenchmarkResult } = await import(
      path.resolve(
        envDir,
        'node_modules/@code-pushup/js-benchmark-plugin/src/plugins/benchmark.suite-runner.js',
      )
    );

    expect(benchmarkRunner).toBeDefined();
    expect(typeof benchmarkRunner.run).toBe('function');
    expect(benchToBenchmarkResult).toBeDefined();
    expect(typeof benchToBenchmarkResult).toBe('function');
  });

  it('should run benchmark suite with simple test cases', async () => {
    const { benchmarkRunner } = await import(
      path.resolve(
        envDir,
        'node_modules/@code-pushup/js-benchmark-plugin/src/plugins/benchmark.suite-runner.js',
      )
    );

    const suiteConfig = {
      suiteName: 'benchmark-simple-test',
      targetImplementation: 'fast-operation',
      cases,
    };

    await expect(
      benchmarkRunner.run(suiteConfig, {
        outputDir: testFileDir,
        outputFileName: 'benchmark-simple-test',
      }),
    ).resolves.toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          suiteName: 'benchmark-simple-test',
          name: 'fast-operation',
          hz: expect.any(Number),
          rme: expect.any(Number),
          samples: expect.any(Number),
          isTarget: true,
          isFastest: true,
        }),
        expect.objectContaining({
          suiteName: 'benchmark-simple-test',
          name: 'slow-operation',
          hz: expect.any(Number),
          rme: expect.any(Number),
          samples: expect.any(Number),
          isTarget: false,
          isFastest: false,
        }),
      ]),
    );
  });

  it('should be able to import and use benny suite runner', async () => {
    const { bennyRunner, benchToBenchmarkResult } = await import(
      path.resolve(
        envDir,
        'node_modules/@code-pushup/js-benchmark-plugin/src/plugins/benny.suite-runner.js',
      )
    );

    expect(bennyRunner).toBeDefined();
    expect(typeof bennyRunner.run).toBe('function');
    expect(benchToBenchmarkResult).toBeDefined();
    expect(typeof benchToBenchmarkResult).toBe('function');
  });

  it('should run benny suite with simple test cases', async () => {
    const { bennyRunner } = await import(
      path.resolve(
        envDir,
        'node_modules/@code-pushup/js-benchmark-plugin/src/plugins/benny.suite-runner.js',
      )
    );

    const suiteConfig = {
      suiteName: 'benny-simple-test',
      targetImplementation: 'fast-operation',
      cases,
    };

    await expect(
      bennyRunner.run(suiteConfig, {
        outputDir: testFileDir,
        outputFileName: 'benny-simple-test',
      }),
    ).resolves.toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          suiteName: 'benny-simple-test',
          name: 'fast-operation',
          hz: expect.any(Number),
          rme: expect.any(Number),
          samples: expect.any(Number),
          isTarget: true,
          isFastest: true,
        }),
        expect.objectContaining({
          suiteName: 'benny-simple-test',
          name: 'slow-operation',
          hz: expect.any(Number),
          rme: expect.any(Number),
          samples: expect.any(Number),
          isTarget: false,
          isFastest: false,
        }),
      ]),
    );
  });
});

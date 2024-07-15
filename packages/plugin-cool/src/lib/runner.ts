import { AuditOutputs, RunnerFunction } from '@code-pushup/models';

export type PluginCoolRunnerOptions = {
  timeout?: number;
};

export function pluginCoolRunner(
  options?: PluginCoolRunnerOptions,
): RunnerFunction {
  return async (): Promise<AuditOutputs> => {
    const { time, value } = await fakePluginLogic(options?.timeout);

    return [
      {
        slug: 'plugin-cool-audit',
        score: value < 1 ? value : 1,
        value: time,
        displayValue: `${time.toFixed(2)} ms`,
      },
    ];
  };
}

export async function fakePluginLogic(
  time?: number,
): Promise<{ time: number; value: number }> {
  const timer = time ?? Math.random() * 100;
  const value = await new Promise<number>((resolve) =>
    setTimeout(() => {
      resolve(Math.random());
    }, timer),
  );
  return { time: timer, value };
}

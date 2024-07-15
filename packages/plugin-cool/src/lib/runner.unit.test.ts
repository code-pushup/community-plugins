import { describe, expect, it } from 'vitest';
import { pluginCoolRunner } from './runner';

describe('pluginCoolRunner', () => {
  it('should have slug of "plugin-cool"', async () => {
    const runnerFunction = pluginCoolRunner({ timeout: 0 });
    const auditOutputs = await runnerFunction(undefined);
    expect(auditOutputs.at(0)?.slug).toBe('plugin-cool-audit');
  });
});

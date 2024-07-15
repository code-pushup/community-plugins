import { describe, expect, it } from 'vitest';
import { fileSizeRunner } from './runner';

describe('fileSizeRunner', () => {
  it('should have slug of "file-size"', async () => {
    const runnerFunction = fileSizeRunner({ timeout: 0 });
    const auditOutputs = await runnerFunction(undefined);
    expect(auditOutputs.at(0)?.slug).toBe('file-size-audit');
  });
});

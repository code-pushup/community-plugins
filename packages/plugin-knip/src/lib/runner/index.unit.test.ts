import { describe, expect, it } from 'vitest';
import { runnerFunctionSchema } from '@code-pushup/models';
import { createRunnerFunction } from './index.js';

describe('createRunnerFunction', () => {
  it('should return correct runner function', () => {
    expect(() =>
      runnerFunctionSchema.parse(createRunnerFunction()),
    ).not.toThrowError();
  });
});

import { describe, expect, it } from 'vitest';
import { runnerConfigSchema } from '@code-pushup/models';
import {createRunnerConfig, createRunnerFunction} from './index.js';

describe('createRunnerFunction', () => {
  it('should return correct runner config object', () => {
    expect(() =>
      runnerConfigSchema.parse(createRunnerFunction()),
    ).not.toThrowError();
  });
});

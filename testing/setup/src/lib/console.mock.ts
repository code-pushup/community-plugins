import { type MockInstance, afterEach, beforeEach, vi } from 'vitest';

let consoleInfoSpy: MockInstance<unknown[], void> | undefined;
let consoleWarnSpy: MockInstance<unknown[], void> | undefined;
let consoleErrorSpy: MockInstance<unknown[], void> | undefined;

beforeEach(() => {
  // In multi-progress-bars, console methods are overriden
  if (console.info != null) {
    consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(vi.fn());
  }

  if (console.warn != null) {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());
  }

  if (console.error != null) {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());
  }
});

afterEach(() => {
  consoleInfoSpy?.mockRestore();
  consoleWarnSpy?.mockRestore();
  consoleErrorSpy?.mockRestore();
});

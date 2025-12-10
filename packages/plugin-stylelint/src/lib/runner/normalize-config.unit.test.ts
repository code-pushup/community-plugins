import stylelint from 'stylelint';
import { getNormalizedConfig } from './normalize-config.js';

vi.mock('stylelint', async () => {
  const actual = await vi.importActual('stylelint');
  return {
    ...actual,
    _createLinter: vi.fn(),
    getConfigForFile: vi.fn(),
  };
});

describe('getNormalizedConfig', () => {
  it('should call _createLinter only once per file parameter', async () => {
    const createSpy = vi.spyOn(stylelint, '_createLinter');
    expect(createSpy).toHaveBeenCalledTimes(0);
    await expect(
      getNormalizedConfig({ stylelintrc: 'mock/path/.stylelintrc.json' }),
    ).resolves.not.toThrowError();
    expect(createSpy).toHaveBeenCalledOnce();
    await expect(
      getNormalizedConfig({ stylelintrc: 'mock/path/.stylelintrc.json' }),
    ).resolves.not.toThrowError();
    expect(createSpy).toHaveBeenCalledOnce();
  });
});

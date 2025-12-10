import stylelint from 'stylelint';
import { getNormalizedConfig } from './normalize-config.js';

vi.mock('stylelint', async () => {
  const actual = await vi.importActual('stylelint');
  return {
    ...actual,
    resolveConfig: vi.fn(),
  };
});

describe('getNormalizedConfig', () => {
  it('should call resolveConfig only once per file parameter', async () => {
    const mockConfig = { rules: { 'color-no-invalid-hex': true } };
    const resolveSpy = vi
      .spyOn(stylelint, 'resolveConfig')
      .mockResolvedValue(mockConfig);

    expect(resolveSpy).toHaveBeenCalledTimes(0);
    await expect(
      getNormalizedConfig({ stylelintrc: 'mock/path/.stylelintrc.json' }),
    ).resolves.not.toThrowError();
    expect(resolveSpy).toHaveBeenCalledOnce();
    await expect(
      getNormalizedConfig({ stylelintrc: 'mock/path/.stylelintrc.json' }),
    ).resolves.not.toThrowError();
    expect(resolveSpy).toHaveBeenCalledOnce(); // Should use cache
  });
});

import { describe } from 'vitest';
import { stylelintPlugin } from './stylelint-plugin.js';
import * as utilsModule from './utils.js';

describe.todo('stylelintPlugin', () => {
  it('should work without options', async () => {
    const getAuditsSpy = vi
      .spyOn(utilsModule, 'getAudits')
      .mockImplementationOnce(() => ({}) as any);
    const getGroupsSpy = vi
      .spyOn(utilsModule, 'getGroups')
      .mockImplementationOnce(() => ({}) as any);
    await expect(stylelintPlugin(['*.css'])).resolves.not.toThrowError();
    expect(getAuditsSpy).toHaveBeenCalledOnce();
    expect(getGroupsSpy).toHaveBeenCalledOnce();
  });
});

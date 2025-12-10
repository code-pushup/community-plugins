import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const stylelintEntryFromPackageRoot = path.resolve(
  '..',
  '..',
  'stylelint/lib/index.mjs',
);

export async function patchStylelint(
  stylelintPath = stylelintEntryFromPackageRoot,
) {
  try {
    const content = await readFile(stylelintPath, 'utf8');

    if (content.includes('default as getConfigForFile')) {
      console.info('Stylelint already patched.');
    } else {
      const updatedContent = `${content}
        export { default as getConfigForFile } from './getConfigForFile.mjs';
      `;
      await writeFile(stylelintPath, updatedContent, 'utf8');
      console.info('Patched Stylelint successfully.');
    }
  } catch (error) {
    console.error('Error patching Stylelint:', (error as Error).message);
  }
}

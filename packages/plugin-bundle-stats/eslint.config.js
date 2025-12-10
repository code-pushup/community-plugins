import tseslint from 'typescript-eslint';
import baseConfig from '../../eslint.config.js';

export default tseslint.config(
  ...baseConfig,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Temporarily disable rules to accept bad code quality :)
      'functional/immutable-data': 'off', // 112 occurrences
      'functional/no-loop-statements': 'off', // 74 occurrences
      'functional/no-let': 'off', // 31 occurrences
      '@typescript-eslint/no-magic-numbers': 'off', // 22 occurrences
      '@typescript-eslint/no-non-null-assertion': 'off', // 17 occurrences
      // Increase limits for max-lines and complexity rules
      'max-lines': [
        'warn',
        { max: 800, skipBlankLines: true, skipComments: true },
      ],
      'max-lines-per-function': [
        'warn',
        { max: 600, skipBlankLines: true, skipComments: true },
      ],
      complexity: ['warn', { max: 30 }],
      'max-depth': ['warn', { max: 6 }],
      'no-console': [
        'warn',
        { allow: ['error', 'warn', 'info', 'time', 'timeEnd'] },
      ],
    },
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      // More relaxed rules for test files
      'max-lines': [
        'warn',
        { max: 1000, skipBlankLines: true, skipComments: true },
      ],
      'max-lines-per-function': [
        'warn',
        { max: 800, skipBlankLines: true, skipComments: true },
      ],
      'vitest/no-conditional-expect': 'off',
    },
  },
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': 'error',
    },
  },
);

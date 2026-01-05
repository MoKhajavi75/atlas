import eslint from '@eslint/js';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import importX from 'eslint-plugin-import-x';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  ...nextVitals,
  ...nextTs,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error'
    },
    languageOptions: {
      parserOptions: {
        projectService: true
      }
    },
    rules: {
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-imports': ['error', { disallowTypeAnnotations: false }],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE']
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
          custom: {
            regex: '^I[A-Z]',
            match: false
          }
        }
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-use-before-define': 'error',
      '@typescript-eslint/prefer-regexp-exec': 'error',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      'arrow-body-style': 'error',
      'eqeqeq': ['error', 'always'],
      'import-x/consistent-type-specifier-style': ['error', 'prefer-inline'],
      'import-x/extensions': ['error', { ts: 'never' }],
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error'
    }
  },
  {
    ignores: [
      '.DS_Store',
      '.pnpm',
      '.next',
      'out',
      'build',
      'dist',
      'node_modules',
      'pnpm-lock.yaml',
      'tsconfig.tsbuildinfo',
      'eslint.config.js',
      'public/data/*.json'
    ]
  }
);

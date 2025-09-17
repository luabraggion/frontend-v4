import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Flat Config para ESLint v9, espelhando .eslintrc.cjs via FlatCompat
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  ...compat.config({
    root: true,
    extends: [
      'next/core-web-vitals',
      'next/typescript',
      'plugin:@typescript-eslint/recommended',
      'prettier',
    ],
    plugins: ['@next/next', '@typescript-eslint'],
    ignorePatterns: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'next-env.d.ts',
      '*.config.js',
      '*.config.ts',
      '*.config.mjs',
    ],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/display-name': 'off',
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-img-element': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-unused-expressions': 'error',
    },
    overrides: [
      {
        files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
        rules: {
          '@typescript-eslint/no-explicit-any': 'off',
          'no-console': 'off',
        },
      },
      {
        files: ['**/page.tsx', '**/layout.tsx', '**/loading.tsx', '**/error.tsx'],
        rules: {
          'react/display-name': 'off',
        },
      },
    ],
  }),
];

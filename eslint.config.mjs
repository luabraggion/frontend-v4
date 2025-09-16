// Config ESLint sem Storybook

import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Configuração para Next.js detectar o plugin corretamente
const nextJsConfig = compat.config({
  extends: ['next/core-web-vitals', 'next/typescript'],
  plugins: ['@next/next'],
});

const eslintConfig = [
  ...nextJsConfig,
  ...compat.extends('prettier'),
  {
    ignores: [
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
  },
  {
    rules: {
      // 🎯 Regras TypeScript
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // ⚛️ Regras React
      'react/prop-types': 'off', // TypeScript já faz essa verificação
      'react/react-in-jsx-scope': 'off', // Next.js não precisa importar React
      'react/display-name': 'off',
      'react-hooks/exhaustive-deps': 'warn',

      // 🚀 Regras Next.js específicas
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-img-element': 'error',

      // 📝 Regras gerais de código
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-unused-expressions': 'error',
    },
  }, // 📁 Configurações específicas por tipo de arquivo
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
    rules: {
      // Permite any em arquivos de teste
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
  {
    files: ['**/page.tsx', '**/layout.tsx', '**/loading.tsx', '**/error.tsx'],
    rules: {
      // Páginas Next.js podem ter exports default sem display-name
      'react/display-name': 'off',
    },
  },
];

export default eslintConfig;

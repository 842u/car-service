import { FlatCompat } from '@eslint/eslintrc';
import pluginJs from '@eslint/js';
import pluginQuery from '@tanstack/eslint-plugin-query';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginImportX from 'eslint-plugin-import-x';
import eslintPluginJestDom from 'eslint-plugin-jest-dom';
import eslintPluginPlaywright from 'eslint-plugin-playwright';
import pluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginTestingLibrary from 'eslint-plugin-testing-library';
import globals from 'globals';
import path from 'path';
import {
  config as typescriptEslintConfig,
  configs as typescriptEslintConfigs,
} from 'typescript-eslint';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.Config[]} */
export default typescriptEslintConfig(
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
  },
  {
    ignores: [
      '.next/',
      'coverage/',
      'node_modules/',
      'playwright/',
      'playwright-report/',
      'resources/',
      'test-result/',
    ],
  },
  {
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    plugins: {
      react: pluginReact,
      'simple-import-sort': eslintPluginSimpleImportSort,
    },
  },
  {
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,
      'no-console': 'warn',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
      'react/jsx-sort-props': [
        'error',
        {
          callbacksLast: true,
          ignoreCase: true,
          noSortAlphabetically: false,
          reservedFirst: true,
          shorthandFirst: true,
          shorthandLast: false,
        },
      ],
      'react/self-closing-comp': 'error',
    },
  },
  ...pluginQuery.configs['flat/recommended'],
  pluginJs.configs.recommended,
  eslintPluginImportX.flatConfigs.recommended,
  eslintPluginImportX.flatConfigs.typescript,
  ...typescriptEslintConfigs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  ...compat.config({
    extends: ['next', 'next/core-web-vitals', 'next/typescript'],
  }),
  eslintConfigPrettier,
  {
    name: 'e2e',
    files: ['e2e/**/?(*.)+(spec|test).[jt]s?(x)'],
    ...eslintPluginPlaywright.configs['flat/recommended'],
  },
  {
    name: 'jest',
    files: ['**/?(*.)+(spec|test).[jt]s?(x)'],
    ignores: ['e2e/**'],
    ...eslintPluginJestDom.configs['flat/recommended'],
    ...eslintPluginTestingLibrary.configs['flat/dom'],
    ...eslintPluginTestingLibrary.configs['flat/react'],
  },
);

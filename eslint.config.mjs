import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import query from '@tanstack/eslint-plugin-query';
import prettier from 'eslint-config-prettier';
import { flatConfigs as importX } from 'eslint-plugin-import-x';
import jestDom from 'eslint-plugin-jest-dom';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import playwright from 'eslint-plugin-playwright';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import testingLibrary from 'eslint-plugin-testing-library';
import globals from 'globals';
import {
  config as tseslintConfig,
  configs as tseslintConfigs,
} from 'typescript-eslint';

// eslint-disable-next-line
const { configs: nextConfigs } = nextPlugin;

/** @type {import('eslint').Linter.Config[]} */
export default tseslintConfig(
  {
    ignores: [
      '.next/',
      'coverage/',
      'node_modules/',
      'playwright/',
      'playwright-report/',
      'resources/',
      'test-result/',
      '*.jsonc',
    ],
  },
  js.configs.recommended,
  ...tseslintConfigs.recommended,
  importX.recommended,
  importX.typescript,
  ...query.configs['flat/recommended'],
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
      'jsx-a11y': jsxA11y,
      react,
      'react-hooks': reactHooks,
      'simple-import-sort': simpleImportSort,
    },
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
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat['jsx-runtime'].rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      ...jsxA11y.flatConfigs.recommended.rules,
      ...nextConfigs.recommended.rules,
      ...nextConfigs['core-web-vitals'].rules,
      'no-restricted-syntax': [
        'warn',
        {
          selector:
            "CallExpression[callee.name='debugDelayResolveResponse'], CallExpression[callee.name='debugDelayRandomResponse'], CallExpression[callee.name='debugDelayRejectResponse']",
          message: 'Do not left debug delayed functions.',
        },
      ],
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
      '@typescript-eslint/consistent-type-imports': 'error',
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
  {
    files: ['**/*.config.{js,ts,mjs,cjs}'],
    languageOptions: {
      globals: globals.node,
    },
  },
  prettier,
  {
    name: 'e2e',
    files: ['e2e/**/?(*.)+(spec|test).[jt]s?(x)'],
    ...playwright.configs['flat/recommended'],
  },
  {
    name: 'jest',
    files: ['**/?(*.)+(spec|test).[jt]s?(x)'],
    ignores: ['e2e/**'],
    ...jestDom.configs['flat/recommended'],
    ...testingLibrary.configs['flat/dom'],
    ...testingLibrary.configs['flat/react'],
  },
);

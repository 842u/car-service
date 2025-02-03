import { fixupPluginRules } from '@eslint/compat';
import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginImportX from 'eslint-plugin-import-x';
import eslintPluginJestDom from 'eslint-plugin-jest-dom';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginPlaywright from 'eslint-plugin-playwright';
import pluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginTestingLibrary from 'eslint-plugin-testing-library';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default tseslint.config(
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
      'react-hooks': fixupPluginRules(eslintPluginReactHooks),
      'simple-import-sort': eslintPluginSimpleImportSort,
    },
  },
  {
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  pluginJs.configs.recommended,
  eslintPluginImportX.flatConfigs.recommended,
  eslintPluginImportX.flatConfigs.typescript,
  eslintPluginJsxA11y.flatConfigs.recommended,
  eslintPluginJestDom.configs['flat/recommended'],
  eslintPluginPlaywright.configs['flat/recommended'],
  eslintPluginTestingLibrary.configs['flat/dom'],
  eslintPluginTestingLibrary.configs['flat/react'],
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  eslintConfigPrettier,
);

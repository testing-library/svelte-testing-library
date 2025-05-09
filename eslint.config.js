import js from '@eslint/js'
import eslintPluginVitest from '@vitest/eslint-plugin'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginJestDom from 'eslint-plugin-jest-dom'
import eslintPluginPromise from 'eslint-plugin-promise'
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort'
import eslintPluginSvelte from 'eslint-plugin-svelte'
import eslintPluginTestingLibrary from 'eslint-plugin-testing-library'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  js.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  eslintPluginUnicorn.configs['flat/recommended'],
  eslintPluginPromise.configs['flat/recommended'],
  eslintPluginSvelte.configs['flat/recommended'],
  eslintPluginSvelte.configs['flat/prettier'],
  eslintConfigPrettier,
  {
    name: 'settings',
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.svelte'],
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  {
    name: 'ignores',
    ignores: ['coverage', 'types'],
  },
  {
    name: 'simple-import-sort',
    plugins: {
      'simple-import-sort': eslintPluginSimpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    name: 'tests',
    files: ['**/*.test.js'],
    extends: [
      eslintPluginVitest.configs.recommended,
      eslintPluginJestDom.configs['flat/recommended'],
      eslintPluginTestingLibrary.configs['flat/dom'],
    ],
    rules: {
      'testing-library/no-node-access': [
        'error',
        { allowContainerFirstChild: true },
      ],
    },
  },
  {
    name: 'extras',
    rules: {
      'unicorn/prevent-abbreviations': 'off',
    },
  },
  {
    name: 'svelte-extras',
    files: ['**/*.svelte'],
    rules: {
      'svelte/no-unused-svelte-ignore': 'off',
      'unicorn/filename-case': ['error', { case: 'pascalCase' }],
      'unicorn/no-useless-undefined': 'off',
    },
  },
  {
    name: 'ts-extras',
    files: ['**/*.ts'],
    extends: [
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  }
)

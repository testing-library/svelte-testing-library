module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    'vitest-globals/env': true,
  },
  extends: [
    'standard',
    'plugin:vitest-globals/recommended',
    'plugin:svelte/recommended',
    'prettier',
  ],
  plugins: ['svelte', 'simple-import-sort', 'json-files'],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
      rules: {
        'no-undef-init': 'off',
        'prefer-const': 'off',
        'svelte/no-unused-svelte-ignore': 'off',
      },
    },
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/stylistic',
        'prettier',
      ],
      rules: {
        '@typescript-eslint/ban-types': [
          'error',
          { types: { '{}': false }, extendDefaults: true },
        ],
        '@typescript-eslint/no-explicit-any': 'off',
        'import/export': 'off',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  globals: { $state: 'readonly', $props: 'readonly' },
  ignorePatterns: ['!/.*'],
}

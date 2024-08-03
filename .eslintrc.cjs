module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
  },
  extends: ['standard', 'plugin:svelte/recommended', 'prettier'],
  plugins: ['svelte', 'simple-import-sort'],
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
    },
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  globals: { afterEach: 'readonly', $state: 'readonly', $props: 'readonly' },
  ignorePatterns: ['!/.*'],
}

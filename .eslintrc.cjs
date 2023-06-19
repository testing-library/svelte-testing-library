module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    'vitest-globals/env': true
  },
  extends: ['standard', 'plugin:vitest-globals/recommended'],
  plugins: ['svelte', 'simple-import-sort'],
  rules: {
    'max-len': ['warn', { code: 100 }],
    'simple-import-sort/imports': 'error',
    'no-multiple-empty-lines': ['error', { max: 2, maxBOF: 2, maxEOF: 0 }],
  },
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
}

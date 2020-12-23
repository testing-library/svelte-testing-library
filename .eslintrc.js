module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    jest: true
  },
  parser: 'babel-eslint',
  extends: [
    'standard'
  ],
  plugins: [
    'svelte3',
    'simple-import-sort'
  ],
  rules: {
    'max-len': ['warn', { code: 100 }],
    'simple-import-sort/imports': 'error',
    'no-multiple-empty-lines': ['error', { max: 2, maxBOF: 2, maxEOF: 0 }]
  },
  overrides: [
    {
      files: ['**/*.svelte'],
      processor: 'svelte3/svelte3'
    }
  ],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module'
  }
}

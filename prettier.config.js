export default {
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  plugins: ['prettier-plugin-svelte'],
  overrides: [
    {
      files: '*.svelte',
      options: {
        parser: 'svelte',
      },
    },
    {
      files: 'examples/**/*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    },
  ],
}

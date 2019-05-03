const { jest: jestConfig } = require('kcd-scripts/config');

const config = Object.assign(jestConfig, {
  roots: ['tests'],
  testMatch: ['/**/*.spec.js'],
  transform: {
    ...jestConfig.transform,
    '\\.svelte$': './tests/transform'
  },
  transformIgnorePatterns: [
    ...jestConfig.transformIgnorePatterns,
    '/node_modules/(?!svelte).+\\.js$'
  ],
  moduleFileExtensions: [...jestConfig.moduleFileExtensions, 'svelte']
});
module.exports = config;

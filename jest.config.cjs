module.exports = {
  testMatch: ['<rootDir>/src/__tests__/**/*.test.js'],
  transform: {
    '^.+\\.svelte$': 'svelte-jester',
  },
  moduleFileExtensions: ['js', 'svelte'],
  extensionsToTreatAsEsm: ['.svelte'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/_jest-setup.js'],
  injectGlobals: false,
  moduleNameMapper: {
    '^vitest$': '<rootDir>/src/__tests__/_jest-vitest-alias.js',
  },
  resetMocks: true,
  restoreMocks: true,
}

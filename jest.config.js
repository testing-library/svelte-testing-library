import { VERSION as SVELTE_VERSION } from 'svelte/compiler'

const IS_SVELTE_5 = SVELTE_VERSION >= '5'

export default {
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
    '^@testing-library/svelte$': IS_SVELTE_5
      ? '<rootDir>/src/svelte5-index.js'
      : '<rootDir>/src/index.js',
  },
  resetMocks: true,
  restoreMocks: true,
}

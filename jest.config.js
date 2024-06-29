import { VERSION as SVELTE_VERSION } from 'svelte/compiler'

const SVELTE_TRANSFORM_PATTERN =
  SVELTE_VERSION >= '5' ? '^.+\\.svelte(?:\\.js)?$' : '^.+\\.svelte$'

export default {
  testMatch: ['<rootDir>/src/__tests__/**/*.test.js'],
  transform: {
    [SVELTE_TRANSFORM_PATTERN]: 'svelte-jester',
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
  collectCoverageFrom: ['<rootDir>/src/**/*'],
  coveragePathIgnorePatterns: [
    '/__tests__/',
    '<rootDir>/src/vite.js',
    '<rootDir>/src/vitest.js',
  ],
}

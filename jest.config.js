import { VERSION as SVELTE_VERSION } from 'svelte/compiler'

const SVELTE_TRANSFORM_PATTERN =
  SVELTE_VERSION >= '5'
    ? String.raw`^.+\.svelte(?:\.js)?$`
    : String.raw`^.+\.svelte$`

export default {
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  transform: {
    [SVELTE_TRANSFORM_PATTERN]: 'svelte-jester',
  },
  moduleFileExtensions: ['js', 'svelte'],
  extensionsToTreatAsEsm: ['.svelte'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/_jest-setup.js'],
  injectGlobals: true,
  moduleNameMapper: {
    '^vitest$': '<rootDir>/tests/_jest-vitest-alias.js',
  },
  resetMocks: true,
  restoreMocks: true,
  collectCoverageFrom: ['<rootDir>/packages/*/src/**/*'],
  coveragePathIgnorePatterns: [
    '<rootDir>/packages/svelte/src/vite.js',
    '<rootDir>/packages/svelte/src/vitest.js',
  ],
}

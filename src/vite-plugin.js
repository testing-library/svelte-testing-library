import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Vite plugin to configure @testing-library/svelte.
 *
 * Ensures Svelte is imported correctly in tests
 * and that the DOM is cleaned up after each test.
 *
 * @param {{resolveBrowser?: boolean, autoCleanup?: boolean}} options
 * @returns {import('vite').Plugin}
 */
export const svelteTesting = ({
  resolveBrowser = true,
  autoCleanup = true,
} = {}) => ({
  name: 'vite-plugin-svelte-testing-library',
  config: (config) => {
    if (!process.env.VITEST) {
      return
    }

    if (resolveBrowser) {
      addBrowserCondition(config)
    }

    if (autoCleanup) {
      addAutoCleanup(config)
    }
  },
})

/**
 * Add `browser` to `resolve.conditions` before `node`.
 *
 * This ensures that Svelte's browser code is used in tests,
 * rather than its SSR code.
 *
 * @param {import('vitest/config').UserConfig} config
 */
const addBrowserCondition = (config) => {
  const resolve = config.resolve ?? {}
  const conditions = resolve.conditions ?? []
  const nodeConditionIndex = conditions.indexOf('node')
  const browserConditionIndex = conditions.indexOf('browser')

  if (
    nodeConditionIndex >= 0 &&
    (nodeConditionIndex < browserConditionIndex || browserConditionIndex < 0)
  ) {
    conditions.splice(nodeConditionIndex, 0, 'browser')
  }

  resolve.conditions = conditions
  config.resolve = resolve
}

/**
 * Add auto-cleanup file to Vitest's setup files.
 *
 * @param {import('vitest/config').UserConfig} config
 */
const addAutoCleanup = (config) => {
  const test = config.test ?? {}
  const setupFiles = test.setupFiles ?? []

  setupFiles.push(join(dirname(fileURLToPath(import.meta.url)), './vitest.js'))

  test.setupFiles = setupFiles
  config.test = test
}

import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'
import path from 'path'
import { VERSION as SVELTE_VERSION } from 'svelte/compiler'

const IS_SVELTE_5 = SVELTE_VERSION >= '5'

const alias = [
  {
    find: '@testing-library/svelte',
    replacement: path.resolve(
      __dirname,
      IS_SVELTE_5 ? 'src/svelte5-index.js' : 'src/index.js'
    ),
  },
]

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [svelte({ hot: false })],
  resolve: {
    // Ensure `browser` exports are used in tests
    // Vitest prefers modules' `node` export by default
    // Svelte's `node` export is its SSR bundle, which does not have onMount
    // https://github.com/testing-library/svelte-testing-library/issues/222#issuecomment-1909993331
    conditions: mode === 'test' ? ['browser'] : [],
  },
  test: {
    alias,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/_vitest-setup.js'],
    mockReset: true,
    unstubGlobals: true,
    coverage: {
      provider: 'v8',
      include: ['src'],
    },
  },
}))

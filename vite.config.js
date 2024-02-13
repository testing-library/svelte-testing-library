import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

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

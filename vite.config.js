import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [svelte()],
  resolve: {
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

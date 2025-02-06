import { createRequire } from 'node:module'

import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

import { svelteTesting } from './src/vite.js'

const require = createRequire(import.meta.url)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), svelteTesting()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/_vitest-setup.js'],
    mockReset: true,
    unstubGlobals: true,
    unstubEnvs: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*'],
      exclude: ['**/__tests__/**', 'src/vite.js', 'src/vitest.js'],
    },
    alias: {
      '@testing-library/svelte': require.resolve('.'),
    },
  },
})

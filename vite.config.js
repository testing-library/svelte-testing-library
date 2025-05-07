import { createRequire } from 'node:module'

import { svelte } from '@sveltejs/vite-plugin-svelte'
import { svelteTesting } from '@testing-library/svelte/vite'
import { defineConfig } from 'vite'

const require = createRequire(import.meta.url)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), svelteTesting()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/_vitest-setup.js'],
    mockReset: true,
    unstubGlobals: true,
    unstubEnvs: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*'],
    },
    alias: {
      '@testing-library/svelte/vite': require.resolve('./src/vite.js'),
      '@testing-library/svelte': require.resolve('./src/index.js'),
    },
  },
})

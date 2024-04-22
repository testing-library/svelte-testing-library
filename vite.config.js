import path from 'node:path'

import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VERSION as SVELTE_VERSION } from 'svelte/compiler'
import { defineConfig } from 'vite'

import { svelteTesting } from './src/vite-plugin.js'

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
export default defineConfig({
  plugins: [svelte({ hot: false }), svelteTesting()],
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
})

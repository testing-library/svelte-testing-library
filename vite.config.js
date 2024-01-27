import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/_vitest-setup.js'],
    coverage: {
      provider: 'v8',
      include: ['src'],
    },
  },
})

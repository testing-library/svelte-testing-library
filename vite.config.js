import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte()],
    test: {
        environment: 'jsdom',
        setupFiles: ['./src/test-setup.js'],
    },
})

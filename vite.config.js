import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte()],
    test: {
        environment: 'jsdom',
        setupFiles: ['./src/test-setup.js'],
    },
})

import type { Plugin } from 'vite'

/**
 * Vite plugin to configure @testing-library/svelte.
 *
 * Ensures Svelte is imported correctly in tests
 * and that the DOM is cleaned up after each test.
 */
export function svelteTesting(options?: {
  resolveBrowser?: boolean
  autoCleanup?: boolean
}): Plugin

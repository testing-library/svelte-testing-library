/**
 * Rendering core for svelte-testing-library.
 *
 * Defines how components are added to and removed from the DOM.
 * Will switch to legacy, class-based mounting logic
 * if it looks like we're in a Svelte <= 4 environment.
 */
export * from './cleanup.js'
export * from './mount.js'
export * from './render.js'
export * from './setup.js'

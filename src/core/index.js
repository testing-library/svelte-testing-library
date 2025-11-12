/**
 * Rendering core for svelte-testing-library.
 *
 * Defines how components are added to and removed from the DOM.
 * Will switch to legacy, class-based mounting logic
 * if it looks like we're in a Svelte <= 4 environment.
 */
export { addCleanupTask, cleanup } from './cleanup.js'
export { mount } from './mount.js'
export {
  UnknownSvelteOptionsError,
  validateOptions,
} from './validate-options.js'

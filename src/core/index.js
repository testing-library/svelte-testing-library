/**
 * Rendering core for svelte-testing-library.
 *
 * Defines how components are added to and removed from the DOM.
 * Will switch to legacy, class-based mounting logic
 * if it looks like we're in a Svelte <= 4 environment.
 */
import * as LegacyCore from './legacy.js'
import * as ModernCore from './modern.svelte.js'
import {
  createValidateOptions,
  UnknownSvelteOptionsError,
} from './validate-options.js'

const { mount, unmount, updateProps, allowedOptions } =
  ModernCore.IS_MODERN_SVELTE ? ModernCore : LegacyCore

/** Validate component options. */
const validateOptions = createValidateOptions(allowedOptions)

export {
  mount,
  UnknownSvelteOptionsError,
  unmount,
  updateProps,
  validateOptions,
}

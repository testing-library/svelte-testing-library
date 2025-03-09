/**
 * Rendering core for svelte-testing-library.
 *
 * Defines how components are added to and removed from the DOM.
 * Will switch to legacy, class-based mounting logic
 * if it looks like we're in a Svelte <= 4 environment.
 */
import * as MountLegacy from './mount-legacy.js'
import * as MountModern from './mount-modern.svelte.js'
import { createValidateOptions } from './prepare.js'

const { mount, unmount, updateProps, allowedOptions } =
  MountModern.IS_MODERN_SVELTE ? MountModern : MountLegacy

/** Validate component options. */
const validateOptions = createValidateOptions(allowedOptions)

export { mount, unmount, updateProps, validateOptions }
export { UnknownSvelteOptionsError } from './prepare.js'

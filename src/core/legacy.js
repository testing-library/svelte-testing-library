/**
 * Legacy rendering core for svelte-testing-library.
 *
 * Supports Svelte <= 4.
 */

import { removeItemFromCleanup } from './cleanup.js'

/** Allowed options for the component constructor. */
const allowedOptions = [
  'target',
  'accessors',
  'anchor',
  'props',
  'hydrate',
  'intro',
  'context',
]

/** Mount the component into the DOM. */
const mountComponent = (Component, options) => {
  const component = new Component(options)

  // This `$$.on_destroy` handler is included for strict backwards compatibility
  // with previous versions of this library. It's mostly unnecessary logic.
  component.$$.on_destroy.push(() => {
    removeItemFromCleanup(component)
  })

  /** Remove the component from the DOM. */
  const unmountComponent = () => {
    component.$destroy()
  }

  /** Update the component's props. */
  const updateProps = (nextProps) => {
    component.$set(nextProps)
  }

  return { component, unmountComponent, updateProps }
}

export { allowedOptions, mountComponent }

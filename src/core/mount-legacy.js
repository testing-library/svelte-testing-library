/**
 * Legacy rendering core for svelte-testing-library.
 *
 * Supports Svelte <= 4.
 */

import { addCleanupTask, removeCleanupTask } from './cleanup.js'

/** Allowed options for the component constructor. */
const ALLOWED_OPTIONS = [
  'target',
  'accessors',
  'anchor',
  'props',
  'hydrate',
  'intro',
  'context',
]

/** Mount the component into the DOM. */
const mount = (Component, options) => {
  const component = new Component(options)

  /** Remove the component from the DOM. */
  const unmount = () => {
    component.$destroy()
    removeCleanupTask(unmount)
  }

  /** Update the component's props. */
  const rerender = (nextProps) => {
    component.$set(nextProps)
  }

  // This `$$.on_destroy` listener is included for strict backwards compatibility
  // with previous versions of `@testing-library/svelte`.
  // It's unnecessary and will be removed in a future major version.
  component.$$.on_destroy.push(() => {
    removeCleanupTask(unmount)
  })

  addCleanupTask(unmount)

  return { component, unmount, rerender }
}

export { ALLOWED_OPTIONS, mount }

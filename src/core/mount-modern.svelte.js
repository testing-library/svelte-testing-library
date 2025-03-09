/**
 * Modern rendering core for svelte-testing-library.
 *
 * Supports Svelte >= 5.
 */
import * as Svelte from 'svelte'

import { addCleanupTask, removeCleanupTask } from './cleanup.js'

/** Whether we're using Svelte >= 5. */
const IS_MODERN_SVELTE = typeof Svelte.mount === 'function'

/** Allowed options to the `mount` call. */
const ALLOWED_OPTIONS = [
  'target',
  'anchor',
  'props',
  'events',
  'context',
  'intro',
]

/** Mount the component into the DOM. */
const mount = (Component, options) => {
  const props = $state(options.props ?? {})
  const component = Svelte.mount(Component, { ...options, props })

  /** Remove the component from the DOM. */
  const unmount = () => {
    Svelte.flushSync(() => Svelte.unmount(component))
    removeCleanupTask(unmount)
  }

  /** Update the component's props. */
  const rerender = (nextProps) => {
    Svelte.flushSync(() => Object.assign(props, nextProps))
  }

  addCleanupTask(unmount)
  Svelte.flushSync()

  return { component, unmount, rerender }
}

export { ALLOWED_OPTIONS, IS_MODERN_SVELTE, mount }

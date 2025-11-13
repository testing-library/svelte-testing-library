/**
 * Component rendering core, with support for Svelte 3, 4, and 5
 */
import * as Svelte from 'svelte'

import { addCleanupTask, removeCleanupTask } from './cleanup.js'
import { createProps } from './props.svelte.js'

/** Whether we're using Svelte >= 5. */
const IS_MODERN_SVELTE = typeof Svelte.mount === 'function'

/** Allowed options to the `mount` call or legacy component constructor. */
const ALLOWED_MOUNT_OPTIONS = IS_MODERN_SVELTE
  ? ['target', 'anchor', 'props', 'events', 'context', 'intro']
  : ['target', 'accessors', 'anchor', 'props', 'hydrate', 'intro', 'context']

/** Mount a modern Svelte 5 component into the DOM. */
const mountModern = (Component, options) => {
  const [props, updateProps] = createProps(options.props)
  const component = Svelte.mount(Component, { ...options, props })

  /** Remove the component from the DOM. */
  const unmount = () => {
    Svelte.flushSync(() => Svelte.unmount(component))
    removeCleanupTask(unmount)
  }

  /** Update the component's props. */
  const rerender = (nextProps) => {
    Svelte.flushSync(() => updateProps(nextProps))
  }

  addCleanupTask(unmount)
  Svelte.flushSync()

  return { component, unmount, rerender }
}

/** Mount a legacy Svelte 3 or 4 component into the DOM. */
const mountLegacy = (Component, options) => {
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

/** The mount method in use. */
const mountComponent = IS_MODERN_SVELTE ? mountModern : mountLegacy

/**
 * Render a Svelte component into the document.
 *
 * @template {import('./types.js').Component} C
 * @param {import('./types.js').ComponentType<C>} Component
 * @param {import('./types.js').MountOptions<C>} options
 * @returns {{
 *   component: C
 *   unmount: () => void
 *   rerender: (props: Partial<import('./types.js').Props<C>>) => Promise<void>
 * }}
 */
const mount = (Component, options = {}) => {
  const { component, unmount, rerender } = mountComponent(Component, options)

  return {
    component,
    unmount,
    rerender: async (props) => {
      rerender(props)
      // Await the next tick for Svelte 4, which cannot flush changes synchronously
      await Svelte.tick()
    },
  }
}

export { ALLOWED_MOUNT_OPTIONS, mount }

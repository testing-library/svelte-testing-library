import { tick } from 'svelte'

import * as MountLegacy from './mount-legacy.js'
import * as MountModern from './mount-modern.svelte.js'

const mountComponent = MountModern.IS_MODERN_SVELTE
  ? MountModern.mount
  : MountLegacy.mount

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
      await tick()
    },
  }
}

export { mount }

/**
 * Modern rendering core for svelte-testing-library.
 *
 * Supports Svelte >= 5.
 */
import * as Svelte from 'svelte'

/** Whether we're using Svelte >= 5. */
const IS_MODERN_SVELTE = typeof Svelte.mount === 'function'

/** Allowed options to the `mount` call. */
const allowedOptions = [
  'target',
  'anchor',
  'props',
  'events',
  'context',
  'intro',
]

/** Mount the component into the DOM. */
const mountComponent = (Component, options) => {
  const props = $state(options.props ?? {})
  const component = Svelte.mount(Component, { ...options, props })

  /** Remove the component from the DOM. */
  const unmountComponent = () => {
    Svelte.unmount(component)
  }

  /** Update the component's props. */
  const updateProps = (nextProps) => {
    Object.assign(props, nextProps)
  }

  return { component, unmountComponent, updateProps }
}

export { allowedOptions, IS_MODERN_SVELTE, mountComponent }

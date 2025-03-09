/**
 * Modern rendering core for svelte-testing-library.
 *
 * Supports Svelte >= 5.
 */
import * as Svelte from 'svelte'

/** Props signals for each rendered component. */
const propsByComponent = new Map()

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
const mount = (Component, options) => {
  const props = $state(options.props ?? {})
  const component = Svelte.mount(Component, { ...options, props })

  Svelte.flushSync()
  propsByComponent.set(component, props)

  return component
}

/** Remove the component from the DOM. */
const unmount = (component) => {
  propsByComponent.delete(component)
  Svelte.flushSync(() => Svelte.unmount(component))
}

/**
 * Update the component's props.
 *
 * Relies on the `$state` signal added in `mount`.
 */
const updateProps = (component, nextProps) => {
  const prevProps = propsByComponent.get(component)
  Object.assign(prevProps, nextProps)
}

export { allowedOptions, IS_MODERN_SVELTE, mount, unmount, updateProps }

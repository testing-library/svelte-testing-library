/**
 * Component rendering core, with support for Svelte 3, 4, and 5
 */
import * as Svelte from 'svelte'

import { addCleanupTask, removeCleanupTask } from './cleanup.js'
import { createProps } from './props.svelte.js'
import { IS_MODERN_SVELTE } from './svelte-version.js'
import WrapperScaffold from './wrapper-scaffold.svelte'

/**
 * Mount a modern Svelte 5 component into the DOM.
 *
 * @template {import('../types.js').Component} C
 * @param {import('../types.js').ComponentType<C>} Component
 * @param {import('../types.js').MountOptions<C>} options
 * @returns {import('../types.js').MountResult<C>}
 */
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

/**
 * Mount a legacy Svelte 3 or 4 component into the DOM.
 *
 * @template {import('../types.js').LegacyComponent} C
 * @param {import('../types.js').ComponentType<C>} Component
 * @param {import('../types.js').MountOptions<C>} options
 * @returns {import('../types.js').MountResult<C>}
 */
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
 * Extract a component from an import.
 *
 * Allows a dynamic `import('component.svelte')` to be used
 * for component values.
 *
 * @template {import('../types.js').Component} C
 * @param {import('../types.js').ComponentImport<C>} componentImport
 * @returns {import('../types.js').ComponentType<C>}
 */
const unwrapComponentImport = (componentImport) => {
  return 'default' in componentImport
    ? componentImport.default
    : componentImport
}

/**
 * Render a Svelte component into the document.
 *
 * @template {import('../types.js').Component} C
 * @template {import('../types.js').Component} [W=never]
 *
 * @param {import('../types.js').ComponentImport<C>} Component
 * @param {import('../types.js').MountOptions<C>} mountOptions
 * @param {import('../types.js').SetupOptions<W>} [setupOptions]
 * @returns {{componentToMount: import('../types.js').ComponentType<C | W>, mountOptions: import('../types.js').MountOptions<C | W>, isWrapper: boolean}}
 */
const setupComponent = (Component, mountOptions, setupOptions = {}) => {
  const componentToMount = unwrapComponentImport(Component)
  const { wrapper, wrapperProps } = setupOptions

  if (wrapper) {
    return {
      isWrapper: true,
      componentToMount: WrapperScaffold,
      mountOptions: {
        ...mountOptions,
        props: {
          wrapper: unwrapComponentImport(wrapper),
          wrapperProps: wrapperProps,
          component: componentToMount,
          componentProps: mountOptions.props,
        },
      },
    }
  }

  return { isWrapper: false, componentToMount, mountOptions }
}

/**
 * Render a Svelte component into the document.
 *
 * @template {import('../types.js').Component} C
 * @template {import('../types.js').Component} [W=never]
 *
 * @param {import('../types.js').ComponentImport<C>} Component
 * @param {import('../types.js').MountOptions<C>} options
 * @param {import('../types.js').SetupOptions<W>} [setupOptions]
 * @returns {import('../types.js').MountResult<C>}
 */
const mount = (Component, options, setupOptions = {}) => {
  const { componentToMount, mountOptions, isWrapper } = setupComponent(
    Component,
    options,
    setupOptions
  )

  const { component, unmount, rerender } = mountComponent(
    componentToMount,
    mountOptions
  )

  return {
    component: isWrapper ? component.getComponent() : component,
    wrapper: isWrapper ? component.getWrapper() : undefined,
    unmount,
    rerender: async (props) => {
      if ('props' in props) {
        console.warn(
          'rerender({ props: { ... } }) deprecated, use rerender({ ... }) instead'
        )
        props = props.props
      }

      if (isWrapper) {
        props = {
          componentProps: { ...component.getComponentProps(), ...props },
        }
      }

      rerender(props)
      // Await the next tick for Svelte 3/4, which cannot flush changes synchronously
      await Svelte.tick()
    },
  }
}

export { mount }

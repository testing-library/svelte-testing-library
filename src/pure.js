import {
  fireEvent as baseFireEvent,
  getQueriesForElement,
  prettyDOM,
} from '@testing-library/dom'
import { tick } from 'svelte'

import { mount, unmount, updateProps, validateOptions } from './core/index.js'

const targetCache = new Set()
const componentCache = new Set()

/**
 * Customize how Svelte renders the component.
 *
 * @template {import('./component-types.js').Component} C
 * @typedef {import('./component-types.js').Props<C> | Partial<import('./component-types.js').MountOptions<C>>} SvelteComponentOptions
 */

/**
 * Customize how Testing Library sets up the document and binds queries.
 *
 * @template {import('@testing-library/dom').Queries} [Q=typeof import('@testing-library/dom').queries]
 * @typedef {{
 *   baseElement?: HTMLElement
 *   queries?: Q
 * }} RenderOptions
 */

/**
 * The rendered component and bound testing functions.
 *
 * @template {import('./component-types.js').Component} C
 * @template {import('@testing-library/dom').Queries} [Q=typeof import('@testing-library/dom').queries]
 *
 * @typedef {{
 *   container: HTMLElement
 *   baseElement: HTMLElement
 *   component: import('./component-types.js').Exports<C>
 *   debug: (el?: HTMLElement | DocumentFragment) => void
 *   rerender: (props: Partial<import('./component-types.js').Props<C>>) => Promise<void>
 *   unmount: () => void
 * } & {
 *   [P in keyof Q]: import('@testing-library/dom').BoundFunction<Q[P]>
 * }} RenderResult
 */

/**
 * Render a component into the document.
 *
 * @template {import('./component-types.js').Component} C
 * @template {import('@testing-library/dom').Queries} [Q=typeof import('@testing-library/dom').queries]
 *
 * @param {import('./component-types.js').ComponentType<C>} Component - The component to render.
 * @param {SvelteComponentOptions<C>} options - Customize how Svelte renders the component.
 * @param {RenderOptions<Q>} renderOptions - Customize how Testing Library sets up the document and binds queries.
 * @returns {RenderResult<C, Q>} The rendered component and bound testing functions.
 */
const render = (Component, options = {}, renderOptions = {}) => {
  options = validateOptions(options)

  const baseElement =
    renderOptions.baseElement ?? options.target ?? document.body

  const queries = getQueriesForElement(baseElement, renderOptions.queries)

  const target =
    options.target ?? baseElement.appendChild(document.createElement('div'))

  targetCache.add(target)

  const component = mount(
    Component.default ?? Component,
    { ...options, target },
    cleanupComponent
  )

  componentCache.add(component)

  return {
    baseElement,
    component,
    container: target,
    debug: (el = baseElement) => {
      console.log(prettyDOM(el))
    },
    rerender: async (props) => {
      if (props.props) {
        console.warn(
          'rerender({ props: {...} }) deprecated, use rerender({...}) instead'
        )
        props = props.props
      }

      updateProps(component, props)
      await tick()
    },
    unmount: () => {
      cleanupComponent(component)
    },
    ...queries,
  }
}

/** Remove a component from the component cache. */
const cleanupComponent = (component) => {
  const inCache = componentCache.delete(component)

  if (inCache) {
    unmount(component)
  }
}

/** Remove a target element from the target cache. */
const cleanupTarget = (target) => {
  const inCache = targetCache.delete(target)

  if (inCache && target.parentNode === document.body) {
    document.body.removeChild(target)
  }
}

/** Unmount all components and remove elements added to `<body>`. */
const cleanup = () => {
  componentCache.forEach(cleanupComponent)
  targetCache.forEach(cleanupTarget)
}

/**
 * Call a function and wait for Svelte to flush pending changes.
 *
 * @param {() => unknown} [fn] - A function, which may be `async`, to call before flushing updates.
 * @returns {Promise<void>}
 */
const act = async (fn) => {
  if (fn) {
    await fn()
  }
  return tick()
}

/**
 * @typedef {(...args: Parameters<import('@testing-library/dom').FireFunction>) => Promise<ReturnType<import('@testing-library/dom').FireFunction>>} FireFunction
 */

/**
 * @typedef {{
 *   [K in import('@testing-library/dom').EventType]: (...args: Parameters<import('@testing-library/dom').FireObject[K]>) => Promise<ReturnType<import('@testing-library/dom').FireObject[K]>>
 * }} FireObject
 */

/**
 * Fire an event on an element.
 *
 * Consider using `@testing-library/user-event` instead, if possible.
 * @see https://testing-library.com/docs/user-event/intro/
 *
 * @type {FireFunction & FireObject}
 */
const fireEvent = async (...args) => {
  const event = baseFireEvent(...args)
  await tick()
  return event
}

Object.keys(baseFireEvent).forEach((key) => {
  fireEvent[key] = async (...args) => {
    const event = baseFireEvent[key](...args)
    await tick()
    return event
  }
})

export { act, cleanup, fireEvent, render }

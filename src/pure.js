import {
  configure as configureDTL,
  fireEvent as baseFireEvent,
  getConfig as getDTLConfig,
  getQueriesForElement,
  prettyDOM,
} from '@testing-library/dom'
import * as Svelte from 'svelte'

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
    // eslint-disable-next-line unicorn/prefer-dom-node-append
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
      await Svelte.tick()
    },
    unmount: () => {
      cleanupComponent(component)
    },
    ...queries,
  }
}

/** @type {import('@testing-library/dom'.Config | undefined} */
let originalDTLConfig

/**
 * Configure `@testing-library/dom` for usage with Svelte.
 *
 * Ensures events fired from `@testing-library/dom`
 * and `@testing-library/user-event` wait for Svelte
 * to flush changes to the DOM before proceeding.
 */
const setup = () => {
  originalDTLConfig = getDTLConfig()

  configureDTL({
    asyncWrapper: act,
    eventWrapper: Svelte.flushSync ?? ((cb) => cb()),
  })
}

/** Reset dom-testing-library config. */
const cleanupDTL = () => {
  if (originalDTLConfig) {
    configureDTL(originalDTLConfig)
    originalDTLConfig = undefined
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
    target.remove()
  }
}

/** Unmount components, remove elements added to `<body>`, and reset `@testing-library/dom`. */
const cleanup = () => {
  for (const component of componentCache) {
    cleanupComponent(component)
  }
  for (const target of targetCache) {
    cleanupTarget(target)
  }
  cleanupDTL()
}

/**
 * Call a function and wait for Svelte to flush pending changes.
 *
 * @template T
 * @param {(() => Promise<T>) | () => T} [fn] - A function, which may be `async`, to call before flushing updates.
 * @returns {Promise<T>}
 */
const act = async (fn) => {
  let result
  if (fn) {
    result = await fn()
  }
  await Svelte.tick()
  return result
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
const fireEvent = async (...args) => act(() => baseFireEvent(...args))

for (const [key, baseEvent] of Object.entries(baseFireEvent)) {
  fireEvent[key] = async (...args) => act(() => baseEvent(...args))
}

export { act, cleanup, fireEvent, render, setup }

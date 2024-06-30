import {
  fireEvent as baseFireEvent,
  getQueriesForElement,
  prettyDOM,
} from '@testing-library/dom'
import { tick } from 'svelte'

import { mount, prepareDocument } from './core/index.js'

/**
 * Customize how Svelte renders the component.
 *
 * @template {import('svelte').SvelteComponent} C
 * @typedef {import('svelte').ComponentProps<C> | Partial<import('svelte').ComponentConstructorOptions<import('svelte').ComponentProps<C>>>} SvelteComponentOptions
 */

/**
 * Customize how Testing Library sets up the document and binds queries.
 *
 * @template {import('@testing-library/dom').Queries} [Q=import('@testing-library/dom').queries]
 * @typedef {{
 *   baseElement?: HTMLElement
 *   queries?: Q
 * }} RenderOptions
 */

/**
 * The rendered component and bound testing functions.
 *
 * @template {import('svelte').SvelteComponent} C
 * @template {import('@testing-library/dom').Queries} [Q=import('@testing-library/dom').queries]
 * @typedef {{
 *   container: HTMLElement
 *   baseElement: HTMLElement
 *   component: C
 *   debug: (el?: HTMLElement | DocumentFragment) => void
 *   rerender: (props: Partial<import('svelte').ComponentProps<C>>) => Promise<void>
 *   unmount: () => void
 * } & {
 *   [P in keyof Q]: import('@testing-library/dom').BoundFunction<Q[P]>
 * }} RenderResult
 */

/**
 * Render a component into the document.
 *
 * @template {import('svelte').SvelteComponent} C
 * @template {import('@testing-library/dom').Queries} [Q=import('@testing-library/dom').queries]
 * @param {import('svelte').ComponentType<C>} Component - The component to render.
 * @param {SvelteComponentOptions<C>} propsOrOptions - Customize how Svelte renders the component.
 * @param {RenderOptions<Q>} renderOptions - Customize how Testing Library sets up the document and binds queries.
 * @returns {RenderResult<C, Q>} The rendered component and bound testing functions.
 */
const render = (Component, propsOrOptions = {}, renderOptions = {}) => {
  const { baseElement, target, options } = prepareDocument(
    propsOrOptions,
    renderOptions
  )

  const { component, unmount, rerender } = mount(
    Component.default ?? Component,
    options
  )

  const queries = getQueriesForElement(baseElement, renderOptions.queries)

  return {
    baseElement,
    component,
    container: target,
    debug: (el = baseElement) => console.log(prettyDOM(el)),
    rerender: async (props) => {
      if (props.props) {
        console.warn(
          'rerender({ props: {...} }) deprecated, use rerender({...}) instead'
        )
        props = props.props
      }

      await rerender(props)
    },
    unmount,
    ...queries,
  }
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

export { act, fireEvent, render }

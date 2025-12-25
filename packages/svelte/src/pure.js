import * as DomTestingLibrary from '@testing-library/dom'
import * as Core from '@testing-library/svelte-core'
import * as Svelte from 'svelte'

/**
 * Customize how Svelte renders the component.
 *
 * @template {import('@testing-library/svelte-core/types').Component} C
 * @typedef {import('@testing-library/svelte-core/types').ComponentOptions<C>} SvelteComponentOptions
 */

/**
 * Customize how Testing Library sets up the document and binds queries.
 *
 * @template {DomTestingLibrary.Queries} [Q=typeof DomTestingLibrary.queries]
 * @typedef {import('@testing-library/svelte-core/types').SetupOptions & { queries?: Q }} RenderOptions
 */

/**
 * The rendered component and bound testing functions.
 *
 * @template {import('@testing-library/svelte-core/types').Component} C
 * @template {DomTestingLibrary.Queries} [Q=typeof DomTestingLibrary.queries]
 *
 * @typedef {{
 *   container: HTMLElement
 *   baseElement: HTMLElement
 *   component: import('@testing-library/svelte-core/types').Exports<C>
 *   debug: (el?: HTMLElement | DocumentFragment) => void
 *   rerender: import('@testing-library/svelte-core/types').Rerender<C>
 *   unmount: () => void
 * } & {
 *   [P in keyof Q]: DomTestingLibrary.BoundFunction<Q[P]>
 * }} RenderResult
 */

/**
 * Render a component into the document.
 *
 * @template {import('@testing-library/svelte-core/types').Component} C
 * @template {DomTestingLibrary.Queries} [Q=typeof DomTestingLibrary.queries]
 *
 * @param {import('@testing-library/svelte-core/types').ComponentImport<C>} Component - The component to render.
 * @param {import('@testing-library/svelte-core/types').ComponentOptions<C>} options - Customize how Svelte renders the component.
 * @param {RenderOptions<Q>} renderOptions - Customize how Testing Library sets up the document and binds queries.
 * @returns {RenderResult<C, Q>} The rendered component and bound testing functions.
 */
const render = (Component, options = {}, renderOptions = {}) => {
  const { baseElement, container, component, unmount, rerender } = Core.render(
    Component,
    options,
    renderOptions
  )

  const queries = DomTestingLibrary.getQueriesForElement(
    baseElement,
    renderOptions.queries
  )

  return {
    baseElement,
    container,
    component,
    rerender,
    unmount,
    debug: (el = baseElement) => console.log(DomTestingLibrary.prettyDOM(el)),
    ...queries,
  }
}

/**
 * Configure `@testing-library/dom` for usage with Svelte.
 *
 * Ensures events fired from `@testing-library/dom`
 * and `@testing-library/user-event` wait for Svelte
 * to flush changes to the DOM before proceeding.
 */
const setup = () => {
  const originalConfig = DomTestingLibrary.getConfig()

  DomTestingLibrary.configure({
    asyncWrapper: act,
    eventWrapper: Svelte.flushSync ?? ((cb) => cb()),
  })

  Core.addCleanupTask(() => {
    DomTestingLibrary.configure(originalConfig)
  })
}

/** Unmount components, remove elements added to `<body>`, and reset `@testing-library/dom`. */
const cleanup = () => {
  Core.cleanup()
}

/**
 * Call a function and wait for Svelte to flush pending changes.
 *
 * @template T
 * @param {() => Promise<T> | T} [fn] - A function, which may be `async`, to call before flushing updates.
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
 * @typedef {(...args: Parameters<DomTestingLibrary.FireFunction>) => Promise<ReturnType<DomTestingLibrary.FireFunction>>} FireFunction
 */

/**
 * @typedef {{
 *   [K in DomTestingLibrary.EventType]: (...args: Parameters<DomTestingLibrary.FireObject[K]>) => Promise<ReturnType<DomTestingLibrary.FireObject[K]>>
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
  return act(() => DomTestingLibrary.fireEvent(...args))
}

for (const [key, baseEvent] of Object.entries(DomTestingLibrary.fireEvent)) {
  fireEvent[key] = async (...args) => act(() => baseEvent(...args))
}

export * from '@testing-library/dom'
export { UnknownSvelteOptionsError } from '@testing-library/svelte-core'
export { act, cleanup, fireEvent, render, setup }

// Type definitions for Svelte Testing Library
// Project: https://github.com/testing-library/svelte-testing-library
// Definitions by: Rahim Alwer <https://github.com/mihar-22>

import {
  BoundFunction,
  EventType,
  Queries,
  queries,
} from '@testing-library/dom'
import {
  ComponentConstructorOptions,
  ComponentProps,
  SvelteComponent,
} from 'svelte'

export * from '@testing-library/dom'

type SvelteComponentOptions<C extends SvelteComponent> =
  | ComponentProps<C>
  | Partial<ComponentConstructorOptions<ComponentProps<C>>>

type Constructor<T> = new (...args: any[]) => T

/**
 * Render a Component into the Document.
 */
export type RenderResult<
  C extends SvelteComponent,
  Q extends Queries = typeof queries,
> = {
  container: HTMLElement
  baseElement: HTMLElement
  component: C
  debug: (el?: HTMLElement | DocumentFragment) => void
  rerender: (props: Partial<ComponentProps<C>>) => Promise<void>
  unmount: () => void
} & { [P in keyof Q]: BoundFunction<Q[P]> }

export interface RenderOptions<Q extends Queries = typeof queries> {
  baseElement?: HTMLElement
  queries?: Q
}

export function render<
  C extends SvelteComponent,
  Q extends Queries = typeof queries,
>(
  component: Constructor<C>,
  componentOptions?: SvelteComponentOptions<C>,
  renderOptions?: RenderOptions<Q>
): RenderResult<C, Q>

/**
 * Unmounts trees that were mounted with render.
 */
export function cleanup(): void

/**
 * Fires DOM events on an element provided by @testing-library/dom. Since Svelte needs to flush
 * pending state changes via `tick`, these methods have been override and now return a promise.
 */
export type FireFunction = (
  element: Document | Element | Window,
  event: Event
) => Promise<boolean>

export type FireObject = {
  [K in EventType]: (
    element: Document | Element | Window,
    options?: {}
  ) => Promise<boolean>
}

export const fireEvent: FireFunction & FireObject

/**
 * Calls a function and notifies Svelte to flush any pending state changes.
 *
 * If the function returns a Promise, that Promise will be resolved first.
 */
export function act(fn?: () => unknown): Promise<void>

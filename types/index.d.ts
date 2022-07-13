// Type definitions for Svelte Testing Library
// Project: https://github.com/testing-library/svelte-testing-library
// Definitions by: Rahim Alwer <https://github.com/mihar-22>

import {queries, Queries, BoundFunction, EventType} from '@testing-library/dom'
import { SvelteComponent } from 'svelte/types/runtime'

export * from '@testing-library/dom'

type SvelteComponentOptions = any

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

/**
 * Render a Component into the Document.
 */
export type RenderResult<Q extends Queries = typeof queries> = {
  container: HTMLElement
  component: SvelteComponent
  debug: (el?: HTMLElement | DocumentFragment) => void
  rerender: (options: SvelteComponentOptions) => void
  unmount: () => void
} & { [P in keyof Q]: BoundFunction<Q[P]> }

export interface RenderOptions<Q extends Queries = typeof queries> {
  container?: HTMLElement
  queries?: Q
}

export function render(
  component: typeof SvelteComponent,
  componentOptions?: SvelteComponentOptions,
  renderOptions?: Omit<RenderOptions, 'queries'>
): RenderResult

export function render<Q extends Queries>(
  component: typeof SvelteComponent,
  componentOptions?: SvelteComponentOptions,
  renderOptions?: RenderOptions<Q>,
): RenderResult<Q>

/**
 * Unmounts trees that were mounted with render.
 */
export function cleanup(): void

/**
 * Fires DOM events on an element provided by @testing-library/dom. Since Svelte needs to flush
 * pending state changes via `tick`, these methods have been override and now return a promise.
 */
export type FireFunction = (element: Document | Element | Window, event: Event) => Promise<boolean>;

export type FireObject = {
  [K in EventType]: (element: Document | Element | Window, options?: {}) => Promise<boolean>;
};

export const fireEvent: FireFunction & FireObject;

/**
 * Calls a function or resolves a Promise and notifies Svelte to immediately flushes any pending
 * state changes.
 */
export function act(fn?: Function | Promise<any>): Promise<void>

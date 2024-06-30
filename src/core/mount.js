import { tick } from 'svelte'

import { addItemToCleanup, removeItemFromCleanup } from './cleanup.js'
import * as LegacySvelte from './legacy.js'
import * as ModernSvelte from './modern.svelte.js'
import { validateOptions } from './validate-options.js'

const { mountComponent, allowedOptions } = ModernSvelte.IS_MODERN_SVELTE
  ? ModernSvelte
  : LegacySvelte

/**
 * Validate options and prepare document elements for rendering.
 *
 * @template {import('svelte').SvelteComponent} C
 * @param {import('svelte').ComponentProps<C> | Partial<import('svelte').ComponentConstructorOptions<import('svelte').ComponentProps<C>>>} propsOrOptions
 * @param {{ baseElement?: HTMLElement }} renderOptions
 * @returns {{
 *   baseElement: HTMLElement
 *   target: HTMLElement
 *   options: import('svelte').ComponentConstructorOptions<import('svelte').ComponentProps<C>>
 * }}
 */
const prepareDocument = (propsOrOptions = {}, renderOptions = {}) => {
  const options = validateOptions(allowedOptions, propsOrOptions)

  const baseElement =
    renderOptions.baseElement ?? options.target ?? document.body

  const target =
    options.target ?? baseElement.appendChild(document.createElement('div'))

  addItemToCleanup(target, () => {
    if (target.parentNode === document.body) {
      document.body.removeChild(target)
    }
  })

  return { baseElement, target, options: { ...options, target } }
}

/**
 * Render a Svelte component into the document.
 *
 * @template {import('svelte').SvelteComponent} C
 * @param {import('svelte').ComponentType<C>} Component
 * @param {import('svelte').ComponentConstructorOptions<import('svelte').ComponentProps<C>>} options
 * @returns {{
 *   component: C
 *   rerender: (props: Partial<import('svelte').ComponentProps<C>>) => Promise<void>
 *   unmount: () => void
 * }}
 */
const mount = (Component, options = {}) => {
  const { component, unmountComponent, updateProps } = mountComponent(
    Component,
    options
  )

  const unmount = () => {
    unmountComponent()
    removeItemFromCleanup(component)
  }

  const rerender = async (props) => {
    updateProps(props)
    await tick()
  }

  addItemToCleanup(component, unmount)

  return { component, unmount, rerender }
}

export { mount, prepareDocument }

import { mount } from './mount.js'
import { setup } from './setup.js'

/**
 * Render a component into the document.
 *
 * @template {import('../types.js').Component} C
 *
 * @param {import('../types.js').ComponentImport<C>} Component - The component to render.
 * @param {import('../types.js').ComponentOptions<C>} componentOptions - Customize how Svelte renders the component.
 * @param {import('../types.js').SetupOptions} setupOptions - Customize how the document is set up.
 * @returns {import('../types.js').RenderResult<C>} The rendered component.
 */
const render = (Component, componentOptions, setupOptions = {}) => {
  const { mountOptions, ...setupResult } = setup(componentOptions, setupOptions)
  const mountResult = mount(Component, mountOptions)

  return { ...setupResult, ...mountResult }
}

export { render }

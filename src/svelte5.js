import { createClassComponent } from 'svelte/legacy'
import { SvelteTestingLibrary } from './pure.js'

class Svelte5TestingLibrary extends SvelteTestingLibrary {
  svelteComponentOptions = [
    'target',
    'props',
    'events',
    'context',
    'intro',
    'recover',
  ]

  renderComponent({ target, ComponentConstructor }, options) {
    options = { target, ...this.checkProps(options) }

    const component = createClassComponent({
      component: ComponentConstructor,
      ...options,
    })

    this.componentCache.add(component)

    return component
  }
}

const instance = new Svelte5TestingLibrary()

export const render = instance.render.bind(instance)
export const cleanup = instance.cleanup.bind(instance)

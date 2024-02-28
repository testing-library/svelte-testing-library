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

  renderComponent(ComponentConstructor, options) {
    return createClassComponent({
      component: ComponentConstructor,
      ...options,
    })
  }
}

const instance = new Svelte5TestingLibrary()

export const render = instance.render.bind(instance)
export const cleanup = instance.cleanup.bind(instance)

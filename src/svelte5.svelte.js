/** eslint-global: $state */
import { mount, unmount } from 'svelte'

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

  propsByComponent = new Map()

  renderComponent(ComponentConstructor, componentOptions) {
    const props = $state(componentOptions.props ?? {})
    const component = mount(ComponentConstructor, {
      ...componentOptions,
      props,
    })

    this.componentCache.add(component)
    this.propsByComponent.set(component, props)

    return component
  }

  rerenderComponent(component, nextProps) {
    const prevProps = this.propsByComponent.get(component)
    Object.assign(prevProps, nextProps)
  }

  cleanupComponent(component) {
    const inCache = this.componentCache.delete(component)
    this.propsByComponent.delete(component)

    if (inCache) {
      unmount(component)
    }
  }
}

const instance = new Svelte5TestingLibrary()

export const render = instance.render.bind(instance)
export const cleanup = instance.cleanup.bind(instance)

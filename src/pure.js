import {
  fireEvent as dtlFireEvent,
  getQueriesForElement,
  prettyDOM,
} from '@testing-library/dom'
import * as Svelte from 'svelte'
import { VERSION as SVELTE_VERSION } from 'svelte/compiler'

const IS_SVELTE_5 = /^5\./.test(SVELTE_VERSION)

export class SvelteTestingLibrary {
  svelteComponentOptions = [
    'target',
    'accessors',
    'anchor',
    'props',
    'hydrate',
    'intro',
    'context',
  ]

  targetCache = new Set()
  componentCache = new Set()

  checkProps(options) {
    const isProps = !Object.keys(options).some((option) =>
      this.svelteComponentOptions.includes(option)
    )

    // Check if any props and Svelte options were accidentally mixed.
    if (!isProps) {
      const unrecognizedOptions = Object.keys(options).filter(
        (option) => !this.svelteComponentOptions.includes(option)
      )

      if (unrecognizedOptions.length > 0) {
        throw Error(`
          Unknown options were found [${unrecognizedOptions}]. This might happen if you've mixed
          passing in props with Svelte options into the render function. Valid Svelte options
          are [${this.svelteComponentOptions}]. You can either change the prop names, or pass in your
          props for that component via the \`props\` option.\n\n
          Eg: const { /** Results **/ } = render(MyComponent, { props: { /** props here **/ } })\n\n
        `)
      }

      return options
    }

    return { props: options }
  }

  render(Component, componentOptions = {}, renderOptions = {}) {
    componentOptions = this.checkProps(componentOptions)

    const baseElement =
      renderOptions.baseElement ?? componentOptions.target ?? document.body

    const target =
      componentOptions.target ??
      baseElement.appendChild(document.createElement('div'))

    this.targetCache.add(target)

    const ComponentConstructor = Component.default || Component

    const component = this.renderComponent(ComponentConstructor, {
      ...componentOptions,
      target,
    })

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
        component.$set(props)
        await Svelte.tick()
      },
      unmount: () => {
        this.cleanupComponent(component)
      },
      ...getQueriesForElement(baseElement, renderOptions.queries),
    }
  }

  renderComponent(ComponentConstructor, componentOptions) {
    if (IS_SVELTE_5) {
      throw new Error('for Svelte 5, use `@testing-library/svelte/svelte5`')
    }

    const component = new ComponentConstructor(componentOptions)

    this.componentCache.add(component)

    // TODO(mcous, 2024-02-11): remove this behavior in the next major version
    component.$$.on_destroy.push(() => {
      this.componentCache.delete(component)
    })

    return component
  }

  cleanupComponent(component) {
    const inCache = this.componentCache.delete(component)

    if (inCache) {
      component.$destroy()
    }
  }

  cleanupTarget(target) {
    const inCache = this.targetCache.delete(target)

    if (inCache && target.parentNode === document.body) {
      document.body.removeChild(target)
    }
  }

  cleanup() {
    this.componentCache.forEach(this.cleanupComponent.bind(this))
    this.targetCache.forEach(this.cleanupTarget.bind(this))
  }
}

const instance = new SvelteTestingLibrary()

export const render = instance.render.bind(instance)

export const cleanup = instance.cleanup.bind(instance)

export const act = async (fn) => {
  if (fn) {
    await fn()
  }
  return Svelte.tick()
}

export const fireEvent = async (...args) => {
  const event = dtlFireEvent(...args)
  await Svelte.tick()
  return event
}

Object.keys(dtlFireEvent).forEach((key) => {
  fireEvent[key] = async (...args) => {
    const event = dtlFireEvent[key](...args)
    await Svelte.tick()
    return event
  }
})

import {
  fireEvent as dtlFireEvent,
  getQueriesForElement,
  prettyDOM,
} from '@testing-library/dom'
import { VERSION as SVELTE_VERSION } from 'svelte/compiler'
import * as Svelte from 'svelte'

const IS_SVELTE_5 = /^5\./.test(SVELTE_VERSION)
export const targetCache = new Set()
export const componentCache = new Set()

const svelteComponentOptions = [
  'accessors',
  'anchor',
  'props',
  'hydrate',
  'intro',
  'context',
]

export const buildCheckProps = (svelteComponentOptions) => (options) => {
  const isOptions = Object.keys(options).some((option) =>
    svelteComponentOptions.includes(option)
  )

  // Check if any props and Svelte options were accidentally mixed.
  if (isOptions) {
    const unrecognizedOptions = Object.keys(options).filter(
      (option) => !svelteComponentOptions.includes(option)
    )

    if (unrecognizedOptions.length > 0) {
      throw Error(`
  Unknown component options: [${unrecognizedOptions.join(', ')}]
  Valid Svelte component options: [${svelteComponentOptions.join(', ')}]

  This error occurs if props are mixed with Svelte component options,
  or any props use the same name as a Svelte component option.
  Either rename the props, or place props under the \`props\` option.

  Eg: const { /** results **/ } = render(MyComponent, { props: { /** props here **/ } })
`)
    }

    return options
  }

  return { props: options }
}

const checkProps = buildCheckProps(svelteComponentOptions)

const buildRenderComponent =
  ({ target, ComponentConstructor }) =>
  (options) => {
    options = checkProps(options)

    if (IS_SVELTE_5)
      throw new Error('for Svelte 5, use `@testing-library/svelte/svelte5`')

    const component = new ComponentConstructor(options)

    componentCache.add(component)

    // TODO(mcous, 2024-02-11): remove this behavior in the next major version
    // It is unnecessary has no path to implementation in Svelte v5
    if (!IS_SVELTE_5) {
      component.$$.on_destroy.push(() => {
        componentCache.delete(component)
      })
    }

    return component
  }

export const buildRender =
  (buildRenderComponent) =>
  (Component, options = {}, renderOptions = {}) => {
    const baseElement =
      renderOptions.baseElement ?? options.target ?? document.body

    const target =
      options.target ?? baseElement.appendChild(document.createElement('div'))

    targetCache.add(target)

    const ComponentConstructor = Component.default || Component

    const renderComponent = buildRenderComponent({
      target,
      ComponentConstructor,
    })

    let component = renderComponent({ target, ...options })

    return {
      container,
      component,
      debug: (el = container) => console.log(prettyDOM(el)),
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
        cleanupComponent(component)
      },
      ...getQueriesForElement(container, queries),
    }
  }

export const render = buildRender(buildRenderComponent)

export const cleanupComponent = (component) => {
  const inCache = componentCache.delete(component)

  if (inCache) {
    component.$destroy()
  }
}

const cleanupTarget = (target) => {
  const inCache = targetCache.delete(target)

  if (inCache && target.parentNode === document.body) {
    document.body.removeChild(target)
  }
}

export const cleanup = () => {
  componentCache.forEach(cleanupComponent)
  targetCache.forEach(cleanupTarget)
}

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

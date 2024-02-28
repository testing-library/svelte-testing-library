import {
  fireEvent as dtlFireEvent,
  getQueriesForElement,
  prettyDOM,
} from '@testing-library/dom'
import { VERSION as SVELTE_VERSION } from 'svelte/compiler'
import * as Svelte from 'svelte'
import { VERSION as SVELTE_VERSION } from 'svelte/compiler'

const IS_SVELTE_5 = SVELTE_VERSION >= '5'

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
  const isProps = !Object.keys(options).some((option) =>
    svelteComponentOptions.includes(option)
  )

  // Check if any props and Svelte options were accidentally mixed.
  if (!isProps) {
    const unrecognizedOptions = Object.keys(options).filter(
      (option) => !svelteComponentOptions.includes(option)
    )

    if (unrecognizedOptions.length > 0) {
      throw Error(`
          Unknown options were found [${unrecognizedOptions}]. This might happen if you've mixed
          passing in props with Svelte options into the render function. Valid Svelte options
          are [${svelteComponentOptions}]. You can either change the prop names, or pass in your
          props for that component via the \`props\` option.\n\n
          Eg: const { /** Results **/ } = render(MyComponent, { props: { /** props here **/ } })\n\n
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
    options = { target, ...checkProps(options) }

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
  (Component, { target, ...options } = {}, { container, queries } = {}) => {
    container = container || document.body
    target = target || container.appendChild(document.createElement('div'))
    targetCache.add(target)

    const ComponentConstructor = Component.default || Component

    const renderComponent = buildRenderComponent({
      target,
      ComponentConstructor,
    })

    let component = renderComponent(options)

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
    if (IS_SVELTE_5) {
      Svelte.unmount(component)
    } else {
      component.$destroy()
    }
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

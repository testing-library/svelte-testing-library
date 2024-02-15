import {
  fireEvent as dtlFireEvent,
  getQueriesForElement,
  prettyDOM,
} from '@testing-library/dom'
import * as Svelte from 'svelte'

const IS_SVELTE_5 = typeof Svelte.createRoot === 'function'
const targetCache = new Set()
const componentCache = new Set()

const svelteComponentOptions = IS_SVELTE_5
  ? ['target', 'props', 'events', 'context', 'intro', 'recover']
  : ['target', 'accessors', 'anchor', 'props', 'hydrate', 'intro', 'context']

const render = (Component, componentOptions = {}, renderOptions = {}) => {
  componentOptions = checkProps(componentOptions)

  const baseElement =
    renderOptions.baseElement ?? componentOptions.target ?? document.body

  const target =
    componentOptions.target ??
    baseElement.appendChild(document.createElement('div'))

  targetCache.add(target)

  const ComponentConstructor = Component.default || Component

  const renderComponent = (options) => {
    options = { target, ...checkProps(options) }

    const component = IS_SVELTE_5
      ? Svelte.createRoot(ComponentConstructor, options)
      : new ComponentConstructor(options)

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

  const component = renderComponent({ ...componentOptions, target })

  return {
    component,
    baseElement,
    container: target,
    debug: (el = baseElement) => console.log(prettyDOM(el)),
    rerender: async (props) => {
      if (props.props) {
        console.warn(
          'rerender({ props: {...} }) deprecated, use rerender({...}) instead'
        )
        props = props.props
      }
      await act(() => component.$set(props))
    },
    unmount: () => {
      cleanupComponent(component)
    },
    ...getQueriesForElement(baseElement, renderOptions.queries),
  }
}

const checkProps = (options) => {
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

const cleanupComponent = (component) => {
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

const cleanup = () => {
  componentCache.forEach(cleanupComponent)
  targetCache.forEach(cleanupTarget)
}

const act = async (fn) => {
  if (fn) {
    await fn()
  }
  return Svelte.tick()
}

const fireEvent = async (...args) => {
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

/* eslint-disable import/export */

export * from '@testing-library/dom'

export { render, cleanup, fireEvent, act }

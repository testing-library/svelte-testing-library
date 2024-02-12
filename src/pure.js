import {
  fireEvent as dtlFireEvent,
  getQueriesForElement,
  prettyDOM,
} from '@testing-library/dom'
import { tick } from 'svelte'

const targetCache = new Set()
const componentCache = new Set()

const svelteComponentOptions = [
  'accessors',
  'anchor',
  'props',
  'hydrate',
  'intro',
  'context',
]

const render = (
  Component,
  { target, ...options } = {},
  { container, queries } = {}
) => {
  container = container || document.body
  target = target || container.appendChild(document.createElement('div'))
  targetCache.add(target)

  const ComponentConstructor = Component.default || Component

  const checkProps = (options) => {
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

  const renderComponent = (options) => {
    const component = new ComponentConstructor({
      target,
      ...checkProps(options),
    })

    componentCache.add(component)
    component.$$.on_destroy.push(() => {
      componentCache.delete(component)
    })

    return component
  }

  let component = renderComponent(options)

  return {
    container,
    component,
    debug: (el = container) => console.log(prettyDOM(el)),
    rerender: (options) => {
      cleanupComponent(component)
      component = renderComponent(options)
    },
    unmount: () => {
      cleanupComponent(component)
    },
    ...getQueriesForElement(container, queries),
  }
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
  return tick()
}

const fireEvent = async (...args) => {
  const event = dtlFireEvent(...args)
  await tick()
  return event
}

Object.keys(dtlFireEvent).forEach((key) => {
  fireEvent[key] = async (...args) => {
    const event = dtlFireEvent[key](...args)
    await tick()
    return event
  }
})

/* eslint-disable import/export */

export * from '@testing-library/dom'

export { render, cleanup, fireEvent, act }

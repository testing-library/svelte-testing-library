import { getQueriesForElement, prettyDOM, fireEvent as dtlFireEvent } from '@testing-library/dom'
import { tick } from 'svelte'

const containerCache = new Map()
const componentCache = new Set()

const render = (
  Component,
  { target, ...options } = {},
  { container, queries } = {}
) => {
  container = container || document.body
  target = target || container.appendChild(document.createElement('div'))

  const ComponentConstructor = Component.default || Component

  const component = new ComponentConstructor({
    target,
    ...options
  })

  containerCache.set(container, { target, component })
  componentCache.add(component)

  component.$$.on_destroy.push(() => { componentCache.delete(component) })

  return {
    container,
    // Only keeping this for backwards compatibility, this should not be used as it goes against
    // the testing libraries 'Guiding Principles'. We should advise against its usage.
    component,
    debug: (el = container) => console.log(prettyDOM(el)),
    rerender: (options) => {
      if (componentCache.has(component)) component.$destroy()

      // eslint-disable-next-line no-new
      const newComponent = new ComponentConstructor({
        ...options,
        target
      })

      containerCache.set(container, { target, newComponent })
      componentCache.add(newComponent)

      newComponent.$$.on_destroy.push(() => { componentCache.delete(newComponent) })
    },
    unmount: () => {
      if (componentCache.has(component)) component.$destroy()
    },
    ...getQueriesForElement(container, queries)
  }
}

const cleanupAtContainer = container => {
  const { target, component } = containerCache.get(container)

  if (componentCache.has(component)) component.$destroy()

  if (target.parentNode === document.body) { document.body.removeChild(target) }

  containerCache.delete(container)
}

const cleanup = () => {
  Array.from(containerCache.keys()).forEach(cleanupAtContainer)
}

const act = (fn) => {
  const value = fn && fn()
  if (value !== undefined && typeof value.then === 'function') {
    return value.then(() => tick())
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

export * from '@testing-library/dom'

export {
  render, cleanup, fireEvent, act
}

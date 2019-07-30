import {getQueriesForElement, prettyDOM} from '@testing-library/dom'
import {tick} from 'svelte'

export * from '@testing-library/dom'
const mountedContainers = new Set()
export const render = (Component, {target, ...options} = {}) => {
  if (!target) {
    target = document.body.appendChild(document.createElement('div'))
  }

  const ComponentConstructor = Component.default || Component
  const component = new ComponentConstructor({
    ...options,
    target,
  })

  mountedContainers.add({target, component})
  return {
    component,
    // eslint-disable-next-line no-console
    debug: (el = document.body) => console.log(prettyDOM(el)),
    container: document.body,
    ...getQueriesForElement(document.body),
  }
}

const cleanupAtContainer = container => {
  const {target, component} = container
  component.$destroy()
  /* istanbul ignore else  */
  if (target.parentNode === document.body) {
    document.body.removeChild(target)
  }
  mountedContainers.delete(container)
}

export const cleanup = () => {
  mountedContainers.forEach(cleanupAtContainer)
}

export function act(fn) {
  const returnValue = fn()
  if (returnValue != null && typeof returnValue.then === 'function') {
    return returnValue.then(() => tick())
  }
  return tick()
}

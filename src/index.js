import {getQueriesForElement, prettyDOM} from 'dom-testing-library'

export * from 'dom-testing-library'
const mountedContainers = new Set()
export const render = (Component, options = {}) => {
  let target = document.body.appendChild(document.createElement('div'))

  if (options.target) {
    target = options.target
  }

  const component = new Component({
    ...options,
    target,
  })

  mountedContainers.add(component)
  return {
    component,
    // eslint-disable-next-line no-console
    debug: (el = document.body) => console.log(prettyDOM(el)),
    ...getQueriesForElement(document.body),
  }
}

const cleanupAtContainer = container => {
  container.$destroy()
  mountedContainers.delete(container)
}

export const cleanup = () => {
  mountedContainers.forEach(cleanupAtContainer)
}

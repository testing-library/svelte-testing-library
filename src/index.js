import {getQueriesForElement} from 'dom-testing-library'

export * from 'dom-testing-library'
const mountedContainers = new Set()
export const render = (Component, options) => {
  const target = document.body.appendChild(document.createElement('div'))

  const component = new Component({
    ...options,
    target,
  })

  mountedContainers.add(component)
  return {
    component,
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

import {getQueriesForElement} from 'dom-testing-library'

export * from 'dom-testing-library'
const mountedContainers = new Set()
export const render = (Component, props) => {
  const container = document.body.appendChild(document.createElement('div'))

  const rendered = new Component({
    target: container,
    props,
  })

  mountedContainers.add(rendered)
  return {
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

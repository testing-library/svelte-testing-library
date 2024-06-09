import {
  fireEvent as dtlFireEvent,
  getQueriesForElement,
  prettyDOM,
} from '@testing-library/dom'
import { tick } from 'svelte'

import {
  mount,
  UnknownSvelteOptionsError,
  unmount,
  updateProps,
  validateOptions,
} from './core/index.js'

const targetCache = new Set()
const componentCache = new Set()

const render = (Component, options = {}, renderOptions = {}) => {
  options = validateOptions(options)

  const baseElement =
    renderOptions.baseElement ?? options.target ?? document.body

  const queries = getQueriesForElement(baseElement, renderOptions.queries)

  const target =
    options.target ?? baseElement.appendChild(document.createElement('div'))

  targetCache.add(target)

  const component = mount(
    Component.default ?? Component,
    { ...options, target },
    cleanupComponent
  )

  componentCache.add(component)

  return {
    baseElement,
    component,
    container: target,
    debug: (el = baseElement) => {
      console.log(prettyDOM(el))
    },
    rerender: async (props) => {
      if (props.props) {
        console.warn(
          'rerender({ props: {...} }) deprecated, use rerender({...}) instead'
        )
        props = props.props
      }

      updateProps(component, props)
      await tick()
    },
    unmount: () => {
      cleanupComponent(component)
    },
    ...queries,
  }
}

const cleanupComponent = (component) => {
  const inCache = componentCache.delete(component)

  if (inCache) {
    unmount(component)
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

export { act, cleanup, fireEvent, render, UnknownSvelteOptionsError }

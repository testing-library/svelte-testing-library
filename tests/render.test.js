import { render, screen } from '@testing-library/svelte'
import { beforeAll, describe, expect, test } from 'vitest'

import { COMPONENT_FIXTURES } from './_env.js'

describe.each(COMPONENT_FIXTURES)('render ($mode)', ({ component }) => {
  const props = { name: 'World' }
  let Comp

  beforeAll(async () => {
    Comp = await import(component)
  })

  test('renders component into the document', () => {
    render(Comp, { props })

    expect(screen.getByText('Hello World!')).toBeInTheDocument()
  })

  test('accepts props directly', () => {
    render(Comp, props)
    expect(screen.getByText('Hello World!')).toBeInTheDocument()
  })

  test('throws error when mixing svelte component options and props', () => {
    expect(() => {
      render(Comp, { props, name: 'World' })
    }).toThrow(/Unknown options/)
  })

  test('throws error when mixing target option and props', () => {
    expect(() => {
      render(Comp, { target: document.createElement('div'), name: 'World' })
    }).toThrow(/Unknown options/)
  })

  test('should return a container object wrapping the DOM of the rendered component', () => {
    const { container } = render(Comp, props)
    const firstElement = screen.getByTestId('test')

    expect(container.firstChild).toBe(firstElement)
  })

  test('should return a baseElement object, which holds the container', () => {
    const { baseElement, container } = render(Comp, props)

    expect(baseElement).toBe(document.body)
    expect(baseElement.firstChild).toBe(container)
  })

  test('if target is provided, use it as container and baseElement', () => {
    const target = document.createElement('div')
    const { baseElement, container } = render(Comp, { props, target })

    expect(container).toBe(target)
    expect(baseElement).toBe(target)
  })

  test('allow baseElement to be specified', () => {
    const customBaseElement = document.createElement('div')

    const { baseElement, container } = render(
      Comp,
      { props },
      { baseElement: customBaseElement }
    )

    expect(baseElement).toBe(customBaseElement)
    expect(baseElement.firstChild).toBe(container)
  })

  test('should accept anchor option', () => {
    const baseElement = document.body
    const target = document.createElement('section')
    const anchor = document.createElement('div')
    baseElement.append(target)
    target.append(anchor)

    render(Comp, { props, target, anchor }, { baseElement })
    const firstElement = screen.getByTestId('test')

    expect(target.firstChild).toBe(firstElement)
    // eslint-disable-next-line testing-library/no-node-access
    expect(target.lastChild).toBe(anchor)
  })
})

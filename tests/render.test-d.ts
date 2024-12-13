import { expectTypeOf } from 'expect-type'
import { ComponentProps } from 'svelte'
import { describe, test } from 'vitest'

import * as subject from '../src/index.js'
import Component from './fixtures/Typed.svelte'

describe('types', () => {
  test('render is a function that accepts a Svelte component', () => {
    subject.render(Component, { name: 'Alice', count: 42 })
    subject.render(Component, { props: { name: 'Alice', count: 42 } })
  })

  test('rerender is a function that accepts partial props', async () => {
    const { rerender } = subject.render(Component, { name: 'Alice', count: 42 })

    await rerender({ name: 'Bob' })
    await rerender({ count: 0 })
  })

  test('non-components are rejected', () => {
    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class NotComponent {}

    // @ts-expect-error: component should be a Svelte component
    subject.render(NotComponent)
  })

  test('invalid prop types are rejected', () => {
    // @ts-expect-error: name should be a string
    subject.render(Component, { name: 42 })

    // @ts-expect-error: name should be a string
    subject.render(Component, { props: { name: 42 } })
  })

  test('render result has container and component', () => {
    const result = subject.render(Component, { name: 'Alice', count: 42 })

    expectTypeOf(result).toMatchTypeOf<{
      container: HTMLElement
      component: { hello: string }
      debug: (el?: HTMLElement) => void
      rerender: (props: { name?: string; count?: number }) => Promise<void>
      unmount: () => void
    }>()
  })

  test('render function may be wrapped', () => {
    const renderSubject = (props: ComponentProps<Component>) => {
      return subject.render(Component, props)
    }

    renderSubject({ name: 'Alice', count: 42 })
    // @ts-expect-error: name should be a string
    renderSubject(Component, { name: 42 })
  })
})

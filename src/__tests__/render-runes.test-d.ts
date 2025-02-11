import { expectTypeOf } from 'expect-type'
import { describe, test, vi } from 'vitest'

import * as subject from '../index.js'
import LegacyComponent from './fixtures/Typed.svelte'
import Component from './fixtures/TypedRunes.svelte'

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
})

describe('legacy component types', () => {
  test('render accepts events', () => {
    const onGreeting = vi.fn()
    subject.render(LegacyComponent, {
      props: { name: 'Alice', count: 42 },
      events: { greeting: onGreeting },
    })
  })

  test('component $set and $on are not allowed', () => {
    const onGreeting = vi.fn()
    const { component } = subject.render(LegacyComponent, {
      name: 'Alice',
      count: 42,
    })

    expectTypeOf(component).toMatchTypeOf<{ hello: string }>()

    // @ts-expect-error: Svelte 5 mount does not return `$set`
    component.$on('greeting', onGreeting)

    // @ts-expect-error: Svelte 5 mount does not return `$set`
    component.$set({ name: 'Bob' })

    // @ts-expect-error: Svelte 5 mount does not return `$destroy`
    component.$destroy()
  })
})

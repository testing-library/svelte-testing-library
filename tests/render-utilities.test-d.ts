import { expectTypeOf } from 'expect-type'
import { describe, test } from 'vitest'

import * as subject from '../src/index.js'
import Component from './fixtures/Comp.svelte'

describe('render query and utility types', () => {
  test('render result has default queries', () => {
    const result = subject.render(Component, { name: 'Alice' })

    expectTypeOf(result.getByRole).parameters.toMatchTypeOf<
      [role: subject.ByRoleMatcher, options?: subject.ByRoleOptions]
    >()
  })

  test('render result can have custom queries', () => {
    const [getByVibes] = subject.buildQueries(
      (_container: HTMLElement, vibes: string) => {
        throw new Error(`unimplemented ${vibes}`)
      },
      () => '',
      () => ''
    )
    const result = subject.render(
      Component,
      { name: 'Alice' },
      { queries: { getByVibes } }
    )

    expectTypeOf(result.getByVibes).parameters.toMatchTypeOf<[vibes: string]>()
  })

  test('act is an async function', () => {
    expectTypeOf(subject.act).toMatchTypeOf<() => Promise<void>>()
  })

  test('act accepts a sync function', () => {
    expectTypeOf(subject.act).toMatchTypeOf<(fn: () => void) => Promise<void>>()
  })

  test('act accepts an async function', () => {
    expectTypeOf(subject.act).toMatchTypeOf<
      (fn: () => Promise<void>) => Promise<void>
    >()
  })

  test('fireEvent is an async function', () => {
    expectTypeOf(subject.fireEvent).toMatchTypeOf<
      (
        element: Element | Node | Document | Window,
        event: Event
      ) => Promise<boolean>
    >()
  })

  test('fireEvent[eventName] is an async function', () => {
    expectTypeOf(subject.fireEvent.click).toMatchTypeOf<
      (
        element: Element | Node | Document | Window,
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        options?: {}
      ) => Promise<boolean>
    >()
  })
})

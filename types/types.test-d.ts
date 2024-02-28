import { expectTypeOf } from 'expect-type'
import type { ComponentProps, SvelteComponent } from 'svelte'
import { describe, test } from 'vitest'

import Simple from '../src/__tests__/fixtures/Simple.svelte'
import * as subject from './index.js'

describe('types', () => {
  test('render is a function that accepts a Svelte component', () => {
    subject.render(Simple, { name: 'Alice', count: 42 })
    subject.render(Simple, { props: { name: 'Alice', count: 42 } })
  })

  test('rerender is a function that accepts partial props', async () => {
    const { rerender } = subject.render(Simple, { name: 'Alice', count: 42 })

    await rerender({ name: 'Bob' })
    await rerender({ count: 0 })
  })

  test('invalid prop types are rejected', () => {
    // @ts-expect-error: name should be a string
    subject.render(Simple, { name: 42 })

    // @ts-expect-error: name should be a string
    subject.render(Simple, { props: { name: 42 } })
  })

  test('render result has container and component', () => {
    const result = subject.render(Simple, { name: 'Alice', count: 42 })

    expectTypeOf(result).toMatchTypeOf<{
      container: HTMLElement
      component: SvelteComponent<{ name: string }>
      debug: (el?: HTMLElement) => void
      rerender: (props: Partial<ComponentProps<Simple>>) => Promise<void>
      unmount: () => void
    }>()
  })

  test('render result has default queries', () => {
    const result = subject.render(Simple, { name: 'Alice', count: 42 })

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
      Simple,
      { name: 'Alice', count: 42 },
      { queries: { getByVibes } }
    )

    expectTypeOf(result.getByVibes).parameters.toMatchTypeOf<[vibes: string]>()
  })
})

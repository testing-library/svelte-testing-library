import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { beforeAll, describe, expect, test } from 'vitest'

import { IS_SVELTE_5, WRAPPER } from './_env.js'
import WrappedComp from './fixtures/Wrapped.svelte'

describe('wrapper', () => {
  let Wrapper

  beforeAll(async () => {
    Wrapper = await import(WRAPPER)
  })

  test('renders component inside wrapper', () => {
    render(
      WrappedComp,
      { name: 'world', punctuation: '!' },
      { wrapper: Wrapper, wrapperProps: { greeting: 'hello' } }
    )

    expect(screen.getByText('hello world!')).toBeInTheDocument()
  })

  test('rerenders component inside wrapper', async () => {
    const { rerender } = render(
      WrappedComp,
      { name: 'world', punctuation: '!' },
      { wrapper: Wrapper, wrapperProps: { greeting: 'hello' } }
    )

    await rerender({ name: 'mundo' })

    expect(screen.getByText('hello mundo!')).toBeInTheDocument()
  })

  test.runIf(IS_SVELTE_5)('binds props inside wrapper', async () => {
    const user = userEvent.setup()
    let value = ''

    render(
      WrappedComp,
      {
        name: '',
        get value() {
          return value
        },
        set value(nextValue) {
          value = nextValue
        },
      },
      { wrapper: Wrapper, wrapperProps: { greeting: '' } }
    )

    const input = screen.getByRole('textbox')
    await user.type(input, 'hello world')

    expect(value).toBe('hello world')
  })

  test('returns wrapped component instance', () => {
    const { component } = render(
      WrappedComp,
      { name: 'world' },
      { wrapper: Wrapper, wrapperProps: { greeting: 'hello' } }
    )

    expect(component.wrappedContext.greeting).toBe('hello')
  })

  test('returns wrapper component instance', () => {
    const { wrapper } = render(
      WrappedComp,
      { name: 'world' },
      { wrapper: Wrapper, wrapperProps: { greeting: 'hello' } }
    )

    expect(wrapper.wrapperContext.greeting).toBe('hello')
  })
})

import { setTimeout } from 'node:timers/promises'

import { act, render } from '@testing-library/svelte'

import Comp from './fixtures/Comp.svelte'
import { describe, expect, test } from './runner.js'

describe('act', () => {
  test('state updates are flushed', async () => {
    const { getByText } = render(Comp)
    const button = getByText('Button')

    expect(button).toHaveTextContent('Button')

    await act(() => {
      button.click()
    })

    expect(button).toHaveTextContent('Button Clicked')
  })

  test('accepts async functions', async () => {
    const { getByText } = render(Comp)
    const button = getByText('Button')

    await act(async () => {
      await setTimeout(100)
      button.click()
    })

    expect(button).toHaveTextContent('Button Clicked')
  })
})

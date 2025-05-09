import { setTimeout } from 'node:timers/promises'

import { act, render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'

import Comp from './fixtures/Comp.svelte'

describe('act', () => {
  test('state updates are flushed', async () => {
    render(Comp)
    const button = screen.getByText('Button')

    expect(button).toHaveTextContent('Button')

    await act(() => {
      button.click()
    })

    expect(button).toHaveTextContent('Button Clicked')
  })

  test('accepts async functions', async () => {
    render(Comp)
    const button = screen.getByText('Button')

    await act(async () => {
      await setTimeout(100)
      button.click()
    })

    expect(button).toHaveTextContent('Button Clicked')
  })
})

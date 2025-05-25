import { setTimeout } from 'node:timers/promises'

import { act, render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'

import Comp from './fixtures/Comp.svelte'

describe('act', () => {
  test('state updates are flushed', async () => {
    render(Comp)
    const button = screen.getByText('Button')

    expect(button).toHaveTextContent('Button')

    await act(() => {
      // eslint-disable-next-line testing-library/no-node-access
      button.click()
    })

    expect(button).toHaveTextContent('Button Clicked')
  })

  test('accepts async functions', async () => {
    render(Comp)
    const button = screen.getByText('Button')

    await act(async () => {
      await setTimeout(10)
      // eslint-disable-next-line testing-library/no-node-access
      button.click()
    })

    expect(button).toHaveTextContent('Button Clicked')
  })

  test('wires act into user-event', async () => {
    const user = userEvent.setup()
    render(Comp)
    const button = screen.getByText('Button')

    await user.click(button)

    expect(button).toHaveTextContent('Button Clicked')
  })
})

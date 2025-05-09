import { fireEvent, render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'

import Comp from './fixtures/Comp.svelte'

describe('events', () => {
  test('state changes are flushed after firing an event', async () => {
    render(Comp, { props: { name: 'World' } })
    const button = screen.getByText('Button')

    const result = fireEvent.click(button)

    await expect(result).resolves.toBe(true)
    expect(button).toHaveTextContent('Button Clicked')
  })

  test('calling `fireEvent` directly works too', async () => {
    render(Comp, { props: { name: 'World' } })
    const button = screen.getByText('Button')

    const result = fireEvent(
      button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    )

    await expect(result).resolves.toBe(true)
    expect(button).toHaveTextContent('Button Clicked')
  })
})

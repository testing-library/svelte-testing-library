import { fireEvent as fireEventDTL } from '@testing-library/dom'
import { fireEvent, render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'

import { IS_SVELTE_5 } from './_env.js'
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
      new MouseEvent('click', { bubbles: true, cancelable: true })
    )

    await expect(result).resolves.toBe(true)
    expect(button).toHaveTextContent('Button Clicked')
  })

  test.runIf(IS_SVELTE_5)('state changes are flushed synchronously', () => {
    render(Comp, { props: { name: 'World' } })
    const button = screen.getByText('Button')

    const result = fireEventDTL(
      button,
      new MouseEvent('click', { bubbles: true, cancelable: true })
    )

    expect(result).toBe(true)
    expect(button).toHaveTextContent('Button Clicked')
  })
})

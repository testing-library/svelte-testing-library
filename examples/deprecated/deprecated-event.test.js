import { render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import Subject from './deprecated-event.svelte'

test('on:click event', async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()

  render(Subject, { events: { click: onClick } })

  const button = screen.getByRole('button')
  await user.click(button)

  expect(onClick).toHaveBeenCalledOnce()
})

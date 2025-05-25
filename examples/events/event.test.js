import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import Subject from './event.svelte'

test('onclick event', async () => {
  const user = userEvent.setup()
  const onclick = vi.fn()

  render(Subject, { onclick })

  const button = screen.getByRole('button')
  await user.click(button)

  expect(onclick).toHaveBeenCalledOnce()
})

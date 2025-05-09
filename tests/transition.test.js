import { render, screen, waitFor } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { IS_JSDOM, IS_SVELTE_5 } from './_env.js'
import Transitioner from './fixtures/Transitioner.svelte'

describe.skipIf(IS_SVELTE_5)('transitions', () => {
  if (IS_JSDOM) {
    beforeEach(() => {
      vi.stubGlobal('requestAnimationFrame', (fn) =>
        setTimeout(() => fn(new Date()), 16)
      )
    })
  }

  test('on:introend', async () => {
    const user = userEvent.setup()

    render(Transitioner)
    const start = screen.getByRole('button')
    await user.click(start)

    const pending = screen.getByTestId('intro-pending')
    expect(pending).toBeInTheDocument()

    await waitFor(() => {
      const done = screen.queryByTestId('intro-done')
      expect(done).toBeInTheDocument()
    })
  })
})

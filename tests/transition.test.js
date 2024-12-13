import { render, screen, waitFor } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import Transitioner from './fixtures/Transitioner.svelte'
import { IS_JSDOM, IS_SVELTE_5 } from './utils.js'

describe.skipIf(IS_SVELTE_5)('transitions', () => {
  beforeEach(() => {
    if (!IS_JSDOM) return

    const raf = (fn) => setTimeout(() => fn(new Date()), 16)
    vi.stubGlobal('requestAnimationFrame', raf)
  })

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

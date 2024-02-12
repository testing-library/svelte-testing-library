import { userEvent } from '@testing-library/user-event'
import { VERSION as SVELTE_VERSION } from 'svelte/compiler'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { render, screen, waitFor } from '..'
import Transitioner from './fixtures/Transitioner.svelte'

describe.runIf(SVELTE_VERSION < '5')('transitions', () => {
  beforeEach(() => {
    if (window.navigator.userAgent.includes('jsdom')) {
      const raf = (fn) => setTimeout(() => fn(new Date()), 16)
      vi.stubGlobal('requestAnimationFrame', raf)
    }
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

import { userEvent } from '@testing-library/user-event'
import { beforeEach, expect, test, vi } from 'vitest'

import { render, screen, waitFor } from '..'
import Transitioner from './fixtures/Transitioner.svelte'

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

test('on:introend with prop change', async () => {
  const { rerender } = render(Transitioner)

  await rerender({ show: true })

  const pending = screen.getByTestId('intro-pending')
  expect(pending).toBeInTheDocument()

  await waitFor(() => {
    const done = screen.queryByTestId('intro-done')
    expect(done).toBeInTheDocument()
  })
})

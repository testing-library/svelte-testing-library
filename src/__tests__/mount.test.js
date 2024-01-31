import { describe, expect, test, vi } from 'vitest'

import { act, render, screen } from '..'
import Mounter from './fixtures/Mounter.svelte'

describe('mount and destroy', () => {
  const handleMount = vi.fn()
  const handleDestroy = vi.fn()

  test('component is mounted', async () => {
    await act(() => {
      render(Mounter, { onMounted: handleMount, onDestroyed: handleDestroy })
    })

    const content = screen.getByRole('button')

    expect(handleMount).toHaveBeenCalledOnce()
    expect(content).toBeInTheDocument()
  })

  test('component is destroyed', async () => {
    const { unmount } = render(Mounter, {
      onMounted: handleMount,
      onDestroyed: handleDestroy,
    })

    await act(() => unmount())
    const content = screen.queryByRole('button')

    expect(handleDestroy).toHaveBeenCalledOnce()
    expect(content).not.toBeInTheDocument()
  })
})

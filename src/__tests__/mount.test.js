import { describe, expect, test, vi } from 'vitest'

import { act, render, screen } from '@testing-library/svelte'
import Mounter from './fixtures/Mounter.svelte'
import { IS_HAPPYDOM, IS_SVELTE_5 } from './utils.js'

const onMounted = vi.fn()
const onDestroyed = vi.fn()
const renderSubject = () => render(Mounter, { onMounted, onDestroyed })

describe.skipIf(IS_SVELTE_5 && IS_HAPPYDOM)('mount and destroy', () => {
  test('component is mounted', async () => {
    renderSubject()

    const content = screen.getByRole('button')

    expect(content).toBeInTheDocument()
    await act()
    expect(onMounted).toHaveBeenCalledOnce()
  })

  test('component is destroyed', async () => {
    const { unmount } = renderSubject()

    await act()
    unmount()

    const content = screen.queryByRole('button')

    expect(content).not.toBeInTheDocument()
    await act()
    expect(onDestroyed).toHaveBeenCalledOnce()
  })
})

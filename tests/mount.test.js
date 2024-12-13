import { render, screen } from '@testing-library/svelte'

import Mounter from './fixtures/Mounter.svelte'
import { describe, expect, test, vi } from './runner.js'

const onMounted = vi.fn()
const onDestroyed = vi.fn()
const renderSubject = () => render(Mounter, { onMounted, onDestroyed })

describe('mount and destroy', () => {
  test('component is mounted', async () => {
    renderSubject()

    const content = screen.getByRole('button')

    expect(content).toBeInTheDocument()
    expect(onMounted).toHaveBeenCalledTimes(1)
  })

  test('component is destroyed', async () => {
    const { unmount } = renderSubject()

    unmount()

    const content = screen.queryByRole('button')

    expect(content).not.toBeInTheDocument()
    expect(onDestroyed).toHaveBeenCalledTimes(1)
  })
})

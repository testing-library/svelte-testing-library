import { cleanup, render } from '@testing-library/svelte'
import { describe, expect, test, vi } from 'vitest'

import Mounter from './fixtures/Mounter.svelte'

const onExecuted = vi.fn()
const onDestroyed = vi.fn()
const renderSubject = () => render(Mounter, { onExecuted, onDestroyed })

describe('cleanup', () => {
  test('cleanup deletes element', async () => {
    renderSubject()
    cleanup()

    expect(document.body).toBeEmptyDOMElement()
  })

  test('cleanup unmounts component', () => {
    renderSubject()
    cleanup()

    expect(onDestroyed).toHaveBeenCalledOnce()
  })

  test('cleanup handles unexpected errors during mount', () => {
    onExecuted.mockImplementation(() => {
      throw new Error('oh no!')
    })

    expect(renderSubject).toThrowError()
    cleanup()

    expect(document.body).toBeEmptyDOMElement()
  })
})

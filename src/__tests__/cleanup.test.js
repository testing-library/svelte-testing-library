import { describe, expect, test, vi } from 'vitest'

import { cleanup, render } from '..'
import Mounter from './fixtures/Mounter.svelte'

const onMounted = vi.fn()
const onDestroyed = vi.fn()
const renderSubject = () => render(Mounter, { onMounted, onDestroyed })

describe('cleanup', () => {
  test('cleanup unmounts component and deletes element', () => {
    renderSubject()

    cleanup()

    expect(onDestroyed).toHaveBeenCalledOnce()
    expect(document.body).toBeEmptyDOMElement()
  })

  test('cleanup handles unexpected errors during mount', () => {
    onMounted.mockImplementation(() => {
      throw new Error('oh no!')
    })

    expect(renderSubject).toThrowError()
    cleanup()

    expect(document.body).toBeEmptyDOMElement()
  })
})

/**
 * @jest-environment jsdom
 */
import { describe, expect, test, vi } from 'vitest'
import { writable } from 'svelte/store'

import { act, render, waitFor } from '..'
import Comp from './fixtures/Rerender.svelte'

test('mounts new component successfully', async () => {
  const onMounted = vi.fn()
  const onDestroyed = vi.fn()

  const { getByTestId, rerender } = render(Comp, {
    props: { name: 'World 1', onMounted, onDestroyed },
  })

  const expectToRender = (content) =>
    waitFor(() => {
      expect(getByTestId('test')).toHaveTextContent(content)
      expect(onMounted).toHaveBeenCalledOnce()
    })

  await expectToRender('Hello World 1!')

  console.warn = vi.fn()

  rerender({ props: { name: 'World 2' } })
  await expectToRender('Hello World 2!')
  expect(onDestroyed).not.toHaveBeenCalled()

  expect(console.warn).toHaveBeenCalledOnce()

  console.warn.mockClear()
  onDestroyed.mockReset()
  rerender({ name: 'World 3' })
  await expectToRender('Hello World 3!')
  expect(onDestroyed).not.toHaveBeenCalled()

  expect(console.warn).not.toHaveBeenCalled()
})

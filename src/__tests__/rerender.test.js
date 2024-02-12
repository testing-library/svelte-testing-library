/**
 * @jest-environment jsdom
 */
import { expect, test, vi } from 'vitest'
import { writable } from 'svelte/store'

import { render, waitFor } from '..'
import Comp from './fixtures/Rerender.svelte'

const mountCounter = writable(0)

test('mounts new component successfully', async () => {
  const { getByTestId, rerender } = render(Comp, {
    props: { name: 'World 1' },
    context: new Map(Object.entries({ mountCounter })),
  })

  const expectToRender = (content) =>
    waitFor(() => {
      expect(getByTestId('test')).toHaveTextContent(content)
      expect(getByTestId('mount-counter')).toHaveTextContent('1')
    })

  await expectToRender('Hello World 1!')

  console.warn = vi.fn()

  rerender({ props: { name: 'World 2' } })
  await expectToRender('Hello World 2!')

  expect(console.warn).toHaveBeenCalled()

  console.warn.mockClear()
  rerender({ name: 'World 3' })
  await expectToRender('Hello World 3!')

  expect(console.warn).not.toHaveBeenCalled()
})

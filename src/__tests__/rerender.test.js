/**
 * @jest-environment jsdom
 */
import { expect, test } from 'vitest'
import { writable } from 'svelte/store'

import { render, waitFor } from '..'
import Comp from './fixtures/Rerender.svelte'

const mountCounter = writable(0)

test('mounts new component successfully', async () => {
  const { getByTestId, rerender } = render(Comp, {
    props: { name: 'World 1' },
    context: new Map(Object.entries({ mountCounter })),
  })

  await waitFor(() => {
    expect(getByTestId('test')).toHaveTextContent('Hello World 1!')
    expect(getByTestId('mount-counter')).toHaveTextContent('1')
  })

  rerender({ props: { name: 'World 2' } })
  await waitFor(() => {
    expect(getByTestId('test')).toHaveTextContent('Hello World 2!')
    expect(getByTestId('mount-counter')).toHaveTextContent('1')
  })
})

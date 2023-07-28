import { expect, test, vi } from 'vitest'

import { render } from '..'
import Comp from './fixtures/onMount.svelte'

vi.mock('svelte', async () => {
  const actual = await vi.importActual('svelte')
  return {
    ...actual,
    onMount: (await import('svelte/internal')).onMount,
  }
})

test('pretty prints the container', () => {
  const { getByTestId } = render(Comp)

  expect(getByTestId('target').innerHTML).toEqual('nailed it')
})

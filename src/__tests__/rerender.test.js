import { act, render, screen } from '@testing-library/svelte'
import { VERSION as SVELTE_VERSION } from 'svelte/compiler'
import { describe, expect, test, vi } from 'vitest'

import Comp from './fixtures/Comp.svelte'

describe('rerender', () => {
  test('updates props', async () => {
    const { rerender } = render(Comp, { name: 'World' })
    const element = screen.getByText('Hello World!')

    await rerender({ name: 'Dolly' })

    expect(element).toHaveTextContent('Hello Dolly!')
  })

  test('warns if incorrect arguments shape used', async () => {
    vi.stubGlobal('console', { log: vi.fn(), warn: vi.fn(), error: vi.fn() })

    const { rerender } = render(Comp, { name: 'World' })
    const element = screen.getByText('Hello World!')

    await rerender({ props: { name: 'Dolly' } })

    expect(element).toHaveTextContent('Hello Dolly!')
    expect(console.warn).toHaveBeenCalledOnce()
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringMatching(/deprecated/iu)
    )
  })

  test('change props with accessors', async () => {
    const { component, getByText } = render(
      Comp,
      SVELTE_VERSION < '5'
        ? { accessors: true, props: { name: 'World' } }
        : { name: 'World' }
    )
    const element = getByText('Hello World!')

    expect(element).toBeInTheDocument()
    expect(component.name).toBe('World')

    await act(() => {
      component.name = 'Planet'
    })

    expect(element).toHaveTextContent('Hello Planet!')
  })
})

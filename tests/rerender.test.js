import { act, render, screen } from '@testing-library/svelte'
import { beforeAll, describe, expect, test, vi } from 'vitest'

import { COMPONENT_FIXTURES, IS_SVELTE_5, MODE_RUNES } from './_env.js'

describe.each(COMPONENT_FIXTURES)('rerender ($mode)', ({ mode, component }) => {
  let Comp

  beforeAll(async () => {
    Comp = await import(component)
  })

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
    expect(console.warn).toHaveBeenCalledTimes(1)
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringMatching(/deprecated/iu)
    )
  })

  test.skipIf(mode === MODE_RUNES)('change props with accessors', async () => {
    const componentOptions = IS_SVELTE_5
      ? { name: 'World' }
      : { accessors: true, props: { name: 'World' } }

    const { component } = render(Comp, componentOptions)
    const element = screen.getByText('Hello World!')

    expect(element).toBeInTheDocument()
    expect(component.name).toBe('World')

    await act(() => {
      component.name = 'Planet'
    })

    expect(element).toHaveTextContent('Hello Planet!')
  })
})

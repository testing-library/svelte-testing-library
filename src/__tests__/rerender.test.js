import { describe, expect, test, vi } from 'vitest'

import { act, render } from '..'
import Comp from './fixtures/Comp.svelte'
import Mounter from './fixtures/Mounter.svelte'

describe('rerender', () => {
  test('mounts new component successfully', () => {
    const { container, rerender } = render(Comp, { props: { name: 'World 1' } })

    expect(container.firstChild).toHaveTextContent('Hello World 1!')
    rerender({ props: { name: 'World 2' } })
    expect(container.firstChild).toHaveTextContent('Hello World 2!')
  })

  test('destroys old component', async () => {
    const onDestroyed = vi.fn()
    const { rerender } = render(Mounter, { onDestroyed })

    await act()
    await act(() => rerender({}))
    expect(onDestroyed).toHaveBeenCalledOnce()
  })

  test('destroys old components on multiple rerenders', () => {
    const { rerender, queryByText } = render(Comp, { props: { name: 'Neil' } })

    rerender({ props: { name: 'Alex' } })
    expect(queryByText('Hello Neil!')).not.toBeInTheDocument()
    rerender({ props: { name: 'Geddy' } })
    expect(queryByText('Hello Alex!')).not.toBeInTheDocument()
  })
})

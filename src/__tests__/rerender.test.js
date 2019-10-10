import { render } from '..'
import Comp from './fixtures/Comp'

describe('rerender', () => {
  test('mounts new component successfully', () => {
    const { container, rerender } = render(Comp, { props: { name: 'World 1' } })

    expect(container.firstChild).toHaveTextContent('Hello World 1!')
    rerender({ props: { name: 'World 2' } })
    expect(container.firstChild).toHaveTextContent('Hello World 2!')
  })

  test('destroys old component', () => {
    let isDestroyed

    const { rerender, component } = render(Comp, { props: { name: '' } })

    component.$$.on_destroy.push(() => { isDestroyed = true })
    rerender({ props: { name: '' } })
    expect(isDestroyed).toBeTruthy()
  })
})

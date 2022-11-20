import { render } from '..'
import Comp from './fixtures/Comp'

describe('rerender', () => {
  test('rerenders component with newly set prop', async () => {
    const { container, rerender } = render(Comp, { props: { name: 'World 1' } })
    expect(container.firstChild).toHaveTextContent('Hello World 1!')
    await rerender({ props: { name: 'World 2' } })
    expect(container.firstChild).toHaveTextContent('Hello World 2!')
  })
})

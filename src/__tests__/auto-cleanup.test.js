import Comp from './fixtures/Comp.svelte'
import { render } from '..'

describe('auto-cleanup', () => {
  // This just verifies that by importing STL in an
  // environment which supports afterEach (like jest)
  // we'll get automatic cleanup between tests.
  test('first', () => {
    render(Comp, { props: { name: 'world' } })
  })

  test('second', () => {
    expect(document.body.innerHTML).toEqual('')
  })
})

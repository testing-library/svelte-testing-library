import { render } from '..'
import Comp from './fixtures/Comp'

describe('multi-base', () => {
  let treeA
  let treeB

  beforeAll(() => {
    treeA = document.createElement('div')
    treeB = document.createElement('div')
    document.body.appendChild(treeA)
    document.body.appendChild(treeB)
  })

  afterAll(() => {
    treeA.parentNode.removeChild(treeA)
    treeB.parentNode.removeChild(treeB)
  })

  test('container isolates trees from one another', () => {
    const { getByText: getByTextInA } = render(Comp, {
      target: treeA,
      props: {
        name: 'Tree A'
      }
    }, {
      container: treeA
    })

    const { getByText: getByTextInB } = render(Comp, {
      target: treeB,
      props: {
        name: 'Tree B'
      }
    }, {
      container: treeB
    })

    expect(() => getByTextInA('Hello Tree A!')).not.toThrow()
    expect(() => getByTextInB('Hello Tree A!')).toThrow()
    expect(() => getByTextInA('Hello Tree B!')).toThrow()
    expect(() => getByTextInB('Hello Tree B!')).not.toThrow()
  })
})

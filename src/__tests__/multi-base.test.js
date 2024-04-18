import { render } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'

import Comp from './fixtures/Comp.svelte'

describe('multi-base', () => {
  const treeA = document.createElement('div')
  const treeB = document.createElement('div')

  test('container isolates trees from one another', () => {
    const { getByText: getByTextInA } = render(
      Comp,
      {
        target: treeA,
        props: {
          name: 'Tree A',
        },
      },
      {
        baseElement: treeA,
      }
    )

    const { getByText: getByTextInB } = render(
      Comp,
      {
        target: treeB,
        props: {
          name: 'Tree B',
        },
      },
      {
        baseElement: treeB,
      }
    )

    expect(() => getByTextInA('Hello Tree A!')).not.toThrow()
    expect(() => getByTextInB('Hello Tree A!')).toThrow()
    expect(() => getByTextInA('Hello Tree B!')).toThrow()
    expect(() => getByTextInB('Hello Tree B!')).not.toThrow()
  })
})

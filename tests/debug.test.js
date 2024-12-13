import { prettyDOM } from '@testing-library/dom'
import { render } from '@testing-library/svelte'

import Comp from './fixtures/Comp.svelte'
import { describe, expect, test, vi } from './runner.js'

describe('debug', () => {
  test('pretty prints the base element', () => {
    vi.stubGlobal('console', { log: vi.fn(), warn: vi.fn(), error: vi.fn() })

    const { baseElement, debug } = render(Comp, { props: { name: 'world' } })

    debug()

    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenCalledWith(prettyDOM(baseElement))
  })
})

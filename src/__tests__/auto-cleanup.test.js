import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import Comp from './fixtures/Comp.svelte'
import { IS_SVELTE_5 } from './utils.js'

const importSvelteTestingLibrary = async () =>
  IS_SVELTE_5 ? import('../svelte5-index.js') : import('../index.js')

const importSvelteTestingLibraryPure = async () =>
  IS_SVELTE_5 ? import('../svelte5.js') : import('../pure.js')

const globalAfterEach = vi.fn()

describe('auto-cleanup', () => {
  beforeEach(() => {
    vi.resetModules()
    globalThis.afterEach = globalAfterEach
  })

  afterEach(() => {
    delete process.env.STL_SKIP_AUTO_CLEANUP
    delete globalThis.afterEach
  })

  test('calls afterEach with cleanup if globally defined', async () => {
    const { render } = await importSvelteTestingLibrary()
    render(Comp, { props: { name: 'world' } })

    expect(globalAfterEach).toHaveBeenCalledTimes(1)
    expect(globalAfterEach).toHaveBeenLastCalledWith(expect.any(Function))

    await afterEach.mock.lastCall[0]()

    expect(document.body).toBeEmptyDOMElement()
  })

  test('does not call afterEach if process STL_SKIP_AUTO_CLEANUP is set', async () => {
    process.env.STL_SKIP_AUTO_CLEANUP = 'true'

    const { render } = await importSvelteTestingLibrary()
    render(Comp, { props: { name: 'world' } })

    expect(globalAfterEach).toHaveBeenCalledTimes(0)
  })

  test('does not call afterEach if you import from `pure`', async () => {
    const { render } = await importSvelteTestingLibraryPure()
    render(Comp, { props: { name: 'world' } })

    expect(globalAfterEach).toHaveBeenCalledTimes(0)
  })
})

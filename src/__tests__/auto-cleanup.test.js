import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { IS_SVELTE_5 } from './utils.js'

const importSvelteTestingLibrary = async () =>
  IS_SVELTE_5 ? import('../svelte5-index.js') : import('../index.js')

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

    expect(globalAfterEach).toHaveBeenCalledTimes(1)
    expect(globalAfterEach).toHaveBeenLastCalledWith(expect.any(Function))
    const globalCleanup = globalAfterEach.mock.lastCall[0]

    const { default: Comp } = await import('./fixtures/Comp.svelte')
    render(Comp, { props: { name: 'world' } })
    await globalCleanup()

    expect(document.body).toBeEmptyDOMElement()
  })

  test('does not call afterEach if process STL_SKIP_AUTO_CLEANUP is set', async () => {
    process.env.STL_SKIP_AUTO_CLEANUP = 'true'

    await importSvelteTestingLibrary()

    expect(globalAfterEach).toHaveBeenCalledTimes(0)
  })
})

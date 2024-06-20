import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

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
    const { render } = await import('../index.js')

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

    await import('../index.js')

    expect(globalAfterEach).toHaveBeenCalledTimes(0)
  })
})

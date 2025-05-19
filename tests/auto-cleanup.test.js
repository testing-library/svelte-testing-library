import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { IS_JEST } from './_env.js'

// TODO(mcous, 2024-12-08): clearing module cache and re-importing
// in Jest breaks Svelte's environment checking heuristics.
// Re-implement this test in a more accurate environment, without mocks.
describe.skipIf(IS_JEST)('auto-cleanup', () => {
  const globalBeforeEach = vi.fn()
  const globalAfterEach = vi.fn()

  beforeEach(() => {
    vi.resetModules()
    globalThis.beforeEach = globalBeforeEach
    globalThis.afterEach = globalAfterEach
  })

  afterEach(() => {
    delete process.env.STL_SKIP_AUTO_CLEANUP
    delete globalThis.beforeEach
    delete globalThis.afterEach
  })

  test('calls afterEach with cleanup if globally defined', async () => {
    const { render } = await import('@testing-library/svelte')

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

    await import('@testing-library/svelte')

    expect(globalBeforeEach).toHaveBeenCalledTimes(0)
    expect(globalAfterEach).toHaveBeenCalledTimes(0)
  })
})

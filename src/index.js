/* eslint-disable import/export */
import { act, cleanup } from './pure.js'

// If we're running in a test runner that supports afterEach
// then we'll automatically run cleanup afterEach test
// this ensures that tests run in isolation from each other
// if you don't like this then set the STL_SKIP_AUTO_CLEANUP env variable.
if (typeof afterEach === 'function' && !process.env.STL_SKIP_AUTO_CLEANUP) {
  afterEach(async () => {
    await act()
    cleanup()
  })
}

// export all base queries, screen, etc.
export * from '@testing-library/dom'

// export svelte-specific functions and custom `fireEvent`
export { UnknownSvelteOptionsError } from './core/index.js'
export * from './pure.js'
// `fireEvent` must be named to take priority over wildcard from @testing-library/dom
export { fireEvent } from './pure.js'

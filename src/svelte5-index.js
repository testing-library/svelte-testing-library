/* eslint-disable import/export */
import { act } from './pure.js'
import { cleanup } from './svelte5.js'

// If we're running in a test runner that supports afterEach
// then we'll automatically run cleanup afterEach test
// this ensures that tests run in isolation from each other
// if you don't like this then either import the `pure` module
// or set the STL_SKIP_AUTO_CLEANUP env variable to 'true'.
if (typeof afterEach === 'function' && !process.env.STL_SKIP_AUTO_CLEANUP) {
  afterEach(async () => {
    await act()
    cleanup()
  })
}

// export all base queries, screen, etc.
export * from '@testing-library/dom'

// export svelte-specific functions and custom `fireEvent`
// `fireEvent` must be a named export to take priority over wildcard export above
export { act, fireEvent } from './pure.js'
export { cleanup, render } from './svelte5.js'

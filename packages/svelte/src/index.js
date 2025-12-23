import { act, cleanup, setup } from './pure.js'

// If we're running in a test runner that supports beforeEach/afterEach
// we'll automatically run setup and cleanup before and after each test
// this ensures that tests run in isolation from each other
// if you don't like this then set the STL_SKIP_AUTO_CLEANUP env variable.
if (typeof process !== 'undefined' && !process.env.STL_SKIP_AUTO_CLEANUP) {
  if (typeof beforeEach === 'function') {
    beforeEach(() => {
      setup()
    })
  }

  if (typeof afterEach === 'function') {
    afterEach(async () => {
      await act()
      cleanup()
    })
  }
}

export * from './pure.js'

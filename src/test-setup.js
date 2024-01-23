import '@testing-library/jest-dom/vitest'

import { afterEach } from 'vitest'

import { act, cleanup } from './pure.js'

afterEach(async () => {
  await act()
  cleanup()
})

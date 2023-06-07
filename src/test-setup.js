import * as matchers from '@testing-library/jest-dom/dist/matchers'
import { afterEach, expect } from 'vitest'

import { act, cleanup } from './pure'

expect.extend(matchers)

afterEach(async () => {
  await act()
  cleanup()
})

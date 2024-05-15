import '@testing-library/jest-dom/jest-globals'

import { afterEach } from '@jest/globals'
import { act, cleanup } from '@testing-library/svelte'

afterEach(async () => {
  await act()
  cleanup()
})

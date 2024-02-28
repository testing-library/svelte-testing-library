import { afterEach } from 'vitest'

import { act, cleanup } from '@testing-library/svelte'

afterEach(async () => {
  await act()
  cleanup()
})

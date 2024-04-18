import { act, cleanup } from '@testing-library/svelte'
import { afterEach } from 'vitest'

afterEach(async () => {
  await act()
  cleanup()
})

import { act, cleanup, setup } from '@testing-library/svelte'
import { beforeEach } from 'vitest'

beforeEach(() => {
  setup()

  return async () => {
    await act()
    cleanup()
  }
})

import { act, cleanup, setup } from '@testing-library/svelte'
import { beforeEach } from 'vitest'

const afterEach = async () => {
  await act()
  cleanup()
}

beforeEach(() => {
  setup()
  return afterEach
})

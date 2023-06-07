import { expect, afterEach } from 'vitest'
import * as matchers from '@testing-library/jest-dom/dist/matchers'
import { act, cleanup } from './pure'

expect.extend(matchers)

afterEach(async () => {
    await act()
    cleanup()
})

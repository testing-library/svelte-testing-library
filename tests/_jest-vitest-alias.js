import { describe, jest, test } from '@jest/globals'

export {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  jest as vi,
} from '@jest/globals'

// Add support for describe.skipIf and test.skipIf
describe.skipIf = (condition) => (condition ? describe.skip : describe)
test.skipIf = (condition) => (condition ? test.skip : test)

// Add support for `stubGlobal`
jest.stubGlobal = (property, stub) => {
  if (typeof stub === 'function') {
    jest.spyOn(globalThis, property).mockImplementation(stub)
  } else {
    jest.replaceProperty(globalThis, property, stub)
  }
}

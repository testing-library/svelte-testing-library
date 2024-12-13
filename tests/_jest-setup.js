import '@testing-library/jest-dom/jest-globals'

import * as Jest from '@jest/globals'

import { initializeRunner } from './runner.js'

// Add support for describe.skipIf and test.skipIf
Jest.describe.skipIf = (condition) =>
  condition ? Jest.describe.skip : Jest.describe
Jest.test.skipIf = (condition) => (condition ? Jest.test.skip : Jest.test)

// Add support for `stubGlobal`
Jest.jest.stubGlobal = (property, stub) => {
  if (typeof stub === 'function') {
    Jest.jest.spyOn(globalThis, property).mockImplementation(stub)
  } else {
    Jest.jest.replaceProperty(globalThis, property, stub)
  }
}

initializeRunner({ ...Jest, vi: Jest.jest })

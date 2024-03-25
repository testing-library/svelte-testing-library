import { render } from '@testing-library/svelte'
import { expect, test } from 'vitest'

import Comp from './fixtures/Context.svelte'
import { IS_HAPPYDOM, IS_SVELTE_5 } from './utils.js'

test.skipIf(IS_SVELTE_5 && IS_HAPPYDOM)('can set a context', () => {
  const message = 'Got it'

  const { getByText } = render(Comp, {
    context: new Map(Object.entries({ foo: { message } })),
  })

  expect(getByText(message)).toBeTruthy()
})

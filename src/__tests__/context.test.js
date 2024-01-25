import { expect, test } from 'vitest'

import { render } from '..'
import Comp from './fixtures/Context.svelte'

test('can set a context', () => {
  const message = 'Got it'

  const { getByText } = render(Comp, {
    context: new Map(Object.entries({ foo: { message } })),
  })

  expect(getByText(message)).toBeTruthy()
})

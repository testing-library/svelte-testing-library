import { render } from '@testing-library/svelte'
import { expect, test } from 'vitest'

import Comp from './fixtures/Context.svelte'

test('can set a context', () => {
  const message = 'Got it'

  const { getByText } = render(Comp, {
    context: new Map(Object.entries({ foo: { message } })),
  })

  expect(getByText(message)).toBeTruthy()
})

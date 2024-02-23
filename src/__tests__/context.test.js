import { expect, test } from 'vitest'
import { VERSION as SVELTE_VERSION } from 'svelte/compiler'

import { render } from '@testing-library/svelte'
import Comp from './fixtures/Context.svelte'

test.skipIf(SVELTE_VERSION >= '5' && process.env.VITEST_ENV == 'happy-dom')(
  'can set a context',
  () => {
    const message = 'Got it'

    const { getByText } = render(Comp, {
      context: new Map(Object.entries({ foo: { message } })),
    })

    expect(getByText(message)).toBeTruthy()
  }
)

import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { expect, test } from 'vitest'

import Subject from './bind.svelte'

test('value binding', async () => {
  const user = userEvent.setup()
  let value = ''

  render(Subject, {
    get value() {
      return value
    },
    set value(nextValue) {
      value = nextValue
    },
  })

  const input = screen.getByRole('textbox')
  await user.type(input, 'hello world')

  expect(value).toBe('hello world')
})

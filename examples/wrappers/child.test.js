import { render, screen } from '@testing-library/svelte'
import { expect, test } from 'vitest'

import Subject from './child.svelte'
import Wrapper from './wrapper.svelte'

test('notifications with messages from context', () => {
  const messages = [
    { id: 'abc', text: 'hello' },
    { id: 'def', text: 'world' },
  ]

  render(
    Subject,
    { label: 'Notifications' },
    { wrapper: Wrapper, wrapperProps: { messages } }
  )

  const status = screen.getByRole('status', { name: 'Notifications' })

  expect(status).toHaveTextContent('hello world')
})

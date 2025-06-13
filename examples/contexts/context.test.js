import { render, screen } from '@testing-library/svelte'
import { expect, test } from 'vitest'

import Subject from './context.svelte'

test('notifications with messages from context', async () => {
  const messages = {
    get current() {
      return [
        { id: 'abc', text: 'hello' },
        { id: 'def', text: 'world' },
      ]
    },
  }

  render(Subject, {
    context: new Map([['messages', messages]]),
    props: { label: 'Notifications' },
  })

  const status = screen.getByRole('status', { name: 'Notifications' })

  expect(status).toHaveTextContent('hello world')
})

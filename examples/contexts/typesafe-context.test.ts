import { render, screen } from '@testing-library/svelte'
import { expect, test } from 'vitest'

import { type MessagesContext, setMessagesContext } from './typesafe-context.js'
import Subject from './typesafe-context.svelte'

test('notifications with messages from context', () => {
  const messages: MessagesContext = {
    get current() {
      return [
        { id: 'abc', text: 'hello' },
        { id: 'def', text: 'world' },
      ]
    },
  }

  const Wrapper: typeof Subject = (...args) => {
    setMessagesContext(messages)
    return Subject(...args)
  }

  render(Wrapper, { label: 'Notifications' })

  const status = screen.getByRole('status', { name: 'Notifications' })

  expect(status).toHaveTextContent('hello world')
})

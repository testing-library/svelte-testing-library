import { render, screen } from '@testing-library/svelte'
import { createRawSnippet } from 'svelte'
import { expect, test } from 'vitest'

import Subject from './complex-snippet.svelte'

test('renders greeting in message snippet', () => {
  render(Subject, {
    name: 'Alice',
    message: createRawSnippet((greeting) => ({
      render: () => `<span data-testid="message">${greeting()}</span>`,
    })),
  })

  const message = screen.getByTestId('message')

  expect(message).toHaveTextContent('Hello, Alice!')
})

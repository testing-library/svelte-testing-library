import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'

import { render, screen, waitFor } from '../pure.js'
import Component from './fixtures/NonBound.svelte'

// fails with jsdom, but work with happy-dom

test('should modify the text after clicking the button', async () => {
  render(Component)
  const button = screen.getByRole('button')
  userEvent.click(button)
  const info = screen.getByTestId('info')

  // The test fails independently of using waitFor or not.
  await waitFor(() => expect(info).toHaveTextContent('Modified by click'))
})

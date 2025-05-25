import { render, screen, within } from '@testing-library/svelte'
import { expect, test } from 'vitest'

import SubjectTest from './deprecated-slot.test.svelte'

test('heading with slot', () => {
  render(SubjectTest)

  const heading = screen.getByRole('heading')
  const child = within(heading).getByTestId('child')

  expect(child).toBeInTheDocument()
})

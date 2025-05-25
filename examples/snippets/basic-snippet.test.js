import { render, screen, within } from '@testing-library/svelte'
import { expect, test } from 'vitest'

import SubjectTest from './basic-snippet.test.svelte'

test('basic snippet', () => {
  render(SubjectTest)

  const heading = screen.getByRole('heading')
  const child = within(heading).getByTestId('child')

  expect(child).toBeInTheDocument()
})

# Basic

This basic example demonstrates how to:

- Pass props to your Svelte component using [render()]
- [Query][] the structure of your component's DOM elements using screen
- Interact with your component using [@testing-library/user-event][]
- Make assertions using expect, using matchers from
  [@testing-library/jest-dom][]

[query]: https://testing-library.com/docs/queries/about
[render()]: https://testing-library.com/docs/svelte-testing-library/api#render
[@testing-library/user-event]: https://testing-library.com/docs/user-event/intro
[@testing-library/jest-dom]: https://github.com/testing-library/jest-dom

## Table of contents

- [`basic.svelte`](#basicsvelte)
- [`basic.test.js`](#basictestjs)

## `basic.svelte`

```svelte file=./basic.svelte
<script>
  let { name } = $props()

  let showGreeting = $state(false)

  const onclick = () => (showGreeting = true)
</script>

<button {onclick}>Greet</button>

{#if showGreeting}
  <p>Hello {name}</p>
{/if}
```

## `basic.test.js`

```js file=./basic.test.js
import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { expect, test } from 'vitest'

import Subject from './basic.svelte'

test('no initial greeting', () => {
  render(Subject, { name: 'World' })

  const button = screen.getByRole('button', { name: 'Greet' })
  const greeting = screen.queryByText(/hello/iu)

  expect(button).toBeInTheDocument()
  expect(greeting).not.toBeInTheDocument()
})

test('greeting appears on click', async () => {
  const user = userEvent.setup()
  render(Subject, { name: 'World' })

  const button = screen.getByRole('button')
  await user.click(button)
  const greeting = screen.getByText(/hello world/iu)

  expect(greeting).toBeInTheDocument()
})
```

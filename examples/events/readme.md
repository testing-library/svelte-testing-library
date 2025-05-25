# Events

Events can be tested using spy functions. If you're using Vitest you can use
[vi.fn()][] to create a spy.

[vi.fn()]: https://vitest.dev/api/vi.html#vi-fn

## Table of contents

- [`event.svelte`](#eventsvelte)
- [`event.test.js`](#eventtestjs)

## `event.svelte`

```svelte file=./event.svelte
<script>
  let { onclick } = $props()
</script>

<button {onclick}>click me</button>
```

## `event.test.js`

```js file=./event.test.js
import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import Subject from './event.svelte'

test('onclick event', async () => {
  const user = userEvent.setup()
  const onclick = vi.fn()

  render(Subject, { onclick })

  const button = screen.getByRole('button')
  await user.click(button)

  expect(onclick).toHaveBeenCalledOnce()
})
```

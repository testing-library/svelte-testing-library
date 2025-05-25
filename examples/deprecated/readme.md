# Deprecated Svelte 3/4 features

Several features from Svelte 3 and 4 have been deprecated in Svelte 5, but while
you still have components using the old syntax, or if you haven't yet updated to
Svelte 5, you can continue to use `@testing-library/svelte` to test your
components.

## Table of contents

- [Events](#events)
  - [`deprecated-event.svelte`](#deprecated-eventsvelte)
  - [`deprecated-event.test.js`](#deprecated-eventtestjs)
- [Slots](#slots)
  - [`deprecated-slot.svelte`](#deprecated-slotsvelte)
  - [`deprecated-slot.test.svelte`](#deprecated-slottestsvelte)
  - [`deprecated-slot.test.js`](#deprecated-slottestjs)

## Events

The `on:event` syntax was deprecated in favor of callback props. However, if you
have updated your Svelte runtime to version 5, you can use the `events`
component option to continue to test events in older components.

### `deprecated-event.svelte`

```svelte file=./deprecated-event.svelte
<button on:click>click me</button>
```

### `deprecated-event.test.js`

> \[!WARNING]
>
> If you are still using Svelte version 3 or 4, `render` will **not** have an
> `events` option. Instead, use `component.$on` to attach an event listener.
>
> ```js
> const onClick = vi.fn()
>
> const { component } = render(Subject)
> component.$on('click', onClick)
> ```

```js file=./deprecated-event.test.js
import { render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import Subject from './deprecated-event.svelte'

test('on:click event', async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()

  render(Subject, { events: { click: onClick } })

  const button = screen.getByRole('button')
  await user.click(button)

  expect(onClick).toHaveBeenCalledOnce()
})
```

## Slots

The slots feature was deprecated in favor of snippets. If you have components
that still use slots, you can create a wrapper component to test them.

### `deprecated-slot.svelte`

```svelte file=./deprecated-slot.svelte
<h1>
  <slot />
</h1>
```

### `deprecated-slot.test.svelte`

```svelte file=./deprecated-slot.test.svelte
<script>
  import Subject from './deprecated-slot.svelte'
</script>

<Subject>
  <span data-testid="child"></span>
</Subject>
```

### `deprecated-slot.test.js`

```js file=deprecated-slot.test.js
import { render, screen, within } from '@testing-library/svelte'
import { expect, test } from 'vitest'

import SubjectTest from './deprecated-slot.test.svelte'

test('heading with slot', () => {
  render(SubjectTest)

  const heading = screen.getByRole('heading')
  const child = within(heading).getByTestId('child')

  expect(child).toBeInTheDocument()
})
```

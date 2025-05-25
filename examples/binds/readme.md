# Binds

Two-way data binding using [bindable() props][] is difficult to test directly.
It's usually easier to structure your code so that you can test user-facing
results, leaving the binding as an implementation detail.

However, if two-way binding is an important developer-facing API of your
component, you can use setters to test your binding.

[bindable() props]: https://svelte.dev/docs/svelte/$bindable

## Table of contents

- [`bind.svelte`](#bindsvelte)
- [`bind.test.js`](#bindtestjs)
- [Consider avoiding binding](#consider-avoiding-binding)

## `bind.svelte`

```svelte file=./bind.svelte
<script>
  let { value = $bindable('') } = $props()
</script>

<input type="text" bind:value />
```

## `bind.test.js`

```js file=./bind.test.js
import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { expect, test } from 'vitest'

import Subject from './bind.svelte'

test('value binding', async () => {
  const user = userEvent.setup()
  let value = ''

  render(Subject, {
    get value() {
      return value
    },
    set value(nextValue) {
      value = nextValue
    },
  })

  const input = screen.getByRole('textbox')
  await user.type(input, 'hello world')

  expect(value).toBe('hello world')
})
```

## Consider avoiding binding

Before embarking on writing tests for bindable props, consider avoiding
`bindable()` entirely. Two-way data binding can make your data flows and state
changes difficult to reason about and test effectively. Instead, you can use
value props to pass data down and callback props to pass changes back up to the
parent.

> Well-written applications use bindings very sparingly — the vast majority of
> data flow should be top-down --
> <cite>[Rich Harris](https://github.com/sveltejs/svelte/issues/10768#issue-2181814844)</cite>

For example, rather than using a `bindable()` prop, use a value prop to pass the
value down and callback prop to send changes back up to the parent:

```svelte file=./no-bind.svelte
<script>
  let { value, onInput } = $props()

  const oninput = (event) => {
    onInput(event.target.value)
  }
</script>

<input type="text" {value} {oninput} />
```

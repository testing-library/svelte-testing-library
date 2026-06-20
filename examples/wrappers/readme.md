# Wrappers

Sometimes, a component cannot properly render or operate unless it's the child
of another component. To wrap your component under test in a parent, use the
`wrapper` and `wrapperProps` options.

> \[!TIP]
>
> If you can't test a component in isolation, this may be a sign that you're
> testing at the wrong level, or that your component structure should be
> rethought. Consider if you can make your components more testable in isolation
> before reaching for this option.

While this example uses context to demonstrate the usage of the `wrapper`
options, if you have access to the context directly, not through a provider
component, then the [`context` option](../contexts) is a better choice than
`wrapper`.

## Table of contents

- [`wrapper.svelte`](#wrappersvelte)
- [`child.svelte`](#childsvelte)
- [`child.test.js`](#childtestjs)

## `wrapper.svelte`

```svelte file=./wrapper.svelte
<script>
  import { setContext } from 'svelte'

  let { messages, children } = $props()

  setContext('messages', {
    get current() {
      return messages
    },
  })
</script>

{@render children?.()}
```

## `child.svelte`

```svelte file=./child.svelte
<script>
  import { getContext } from 'svelte'

  let { label } = $props()

  const messages = getContext('messages')
</script>

<div role="status" aria-label={label}>
  {#each messages.current as message (message.id)}
    <p>{message.text}</p>
    <hr />
  {/each}
</div>
```

## `child.test.js`

```js file=./child.test.js
import { render, screen } from '@testing-library/svelte'
import { expect, test } from 'vitest'

import Subject from './child.svelte'
import Wrapper from './wrapper.svelte'

test('notifications with messages from context', () => {
  const messages = [
    { id: 'abc', text: 'hello' },
    { id: 'def', text: 'world' },
  ]

  render(
    Subject,
    { label: 'Notifications' },
    { wrapper: Wrapper, wrapperProps: { messages } }
  )

  const status = screen.getByRole('status', { name: 'Notifications' })

  expect(status).toHaveTextContent('hello world')
})
```

# Context

If your component requires access to contexts, you can pass those contexts in
when you render the component. When using extra [component options][] like
`context`, be sure to place props under the `props` key.

[component options]:
  https://testing-library.com/docs/svelte-testing-library/api#component-options

## Table of contents

- [`context.svelte`](#contextsvelte)
- [`context.test.js`](#contexttestjs)

## `context.svelte`

```svelte file=./context.svelte
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

## `context.test.js`

```js file=./context.test.js
import { render, screen } from '@testing-library/svelte'
import { expect, test } from 'vitest'

import Subject from './context.svelte'

test('notifications with messages from context', async () => {
  const messages = {
    get current() {
      return [
        { id: 'abc', text: 'hello' },
        { id: 'def', text: 'world' },
      ]
    },
  }

  render(Subject, {
    context: new Map([['messages', messages]]),
    props: { label: 'Notifications' },
  })

  const status = screen.getByRole('status', { name: 'Notifications' })

  expect(status).toHaveTextContent('hello world')
})
```

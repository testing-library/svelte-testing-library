# Context

## Table of contents

- [Type-safe context](#type-safe-context)
  - [`typesafe-context.ts`](#typesafe-contextts)
  - [`typesafe-context.svelte`](#typesafe-contextsvelte)
  - [`typesafe-context.test.js`](#typesafe-contexttestjs)
- [Context with key](#context-with-key)
  - [`context.svelte`](#contextsvelte)
  - [`context.test.js`](#contexttestjs)

## Type-safe context

If you use [createContext][], wrap your component in a wrapper function to
create the context.

> \[!NOTE]
>
> Setting a context value in a wrapper function requires `svelte>=5.50.0`.

[createContext]: https://svelte.dev/docs/svelte/svelte#createContext

### `typesafe-context.ts`

```ts file=./typesafe-context.ts
import { createContext } from 'svelte'

export interface Message {
  id: string
  text: string
}

export interface MessagesContext {
  current: Message[]
}

export const [getMessagesContext, setMessagesContext] =
  createContext<MessagesContext>()
```

### `typesafe-context.svelte`

```svelte file=./typesafe-context.svelte
<script lang="ts">
  import { getMessagesContext } from './typesafe-context.js'

  let { label } = $props()

  const messages = getMessagesContext()
</script>

<div role="status" aria-label={label}>
  {#each messages.current as message (message.id)}
    <p>{message.text}</p>
    <hr />
  {/each}
</div>
```

### `typesafe-context.test.js`

```ts file=./typesafe-context.test.ts
import { render, screen } from '@testing-library/svelte'
import { expect, test } from 'vitest'

import { type MessagesContext, setMessagesContext } from './typesafe-context.js'
import Subject from './typesafe-context.svelte'

test('notifications with messages from context', () => {
  const messages: MessagesContext = {
    get current() {
      return [
        { id: 'abc', text: 'hello' },
        { id: 'def', text: 'world' },
      ]
    },
  }

  const Wrapper: typeof Subject = (...args) => {
    setMessagesContext(messages)
    return Subject(...args)
  }

  render(Wrapper, { label: 'Notifications' })

  const status = screen.getByRole('status', { name: 'Notifications' })

  expect(status).toHaveTextContent('hello world')
})
```

## Context with key

If you use [setContext][] and [getContext][], you can use the `context` option
of `render` to pass a context in. When using extra [component options][] like
`context`, be sure to place props under the `props` key.

[component options]:
  https://testing-library.com/docs/svelte-testing-library/api#component-options
[setcontext]: https://svelte.dev/docs/svelte/svelte#setContext
[getcontext]: https://svelte.dev/docs/svelte/svelte#getContext

### `context.svelte`

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

### `context.test.js`

```js file=./context.test.js
import { render, screen } from '@testing-library/svelte'
import { expect, test } from 'vitest'

import Subject from './context.svelte'

test('notifications with messages from context', () => {
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

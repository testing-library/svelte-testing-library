# Snippets

Snippets are difficult to test directly. It's usually easier to structure your
code so that you can test the user-facing results, leaving any snippets as an
implementation detail. However, if snippets are an important developer-facing
API of your component, there are several strategies you can use.

## Table of contents

- [Basic snippets example](#basic-snippets-example)
  - [`basic-snippet.svelte`](#basic-snippetsvelte)
  - [`basic-snippet.test.svelte`](#basic-snippettestsvelte)
  - [`basic-snippet.test.js`](#basic-snippettestjs)
- [Using `createRawSnippet`](#using-createrawsnippet)
  - [`complex-snippet.svelte`](#complex-snippetsvelte)
  - [`complex-snippet.test.js`](#complex-snippettestjs)

## Basic snippets example

For simple snippets, you can use a wrapper component and "dummy" children to
test them. Setting `data-testid` attributes can be helpful when testing slots in
this manner.

### `basic-snippet.svelte`

```svelte file=./basic-snippet.svelte
<script>
  let { children } = $props()
</script>

<h1>
  {@render children?.()}
</h1>
```

### `basic-snippet.test.svelte`

```svelte file=./basic-snippet.test.svelte
<script>
  import Subject from './basic-snippet.svelte'
</script>

<Subject>
  <span data-testid="child"></span>
</Subject>
```

### `basic-snippet.test.js`

```js file=./basic-snippet.test.js
import { render, screen, within } from '@testing-library/svelte'
import { expect, test } from 'vitest'

import SubjectTest from './basic-snippet.test.svelte'

test('basic snippet', () => {
  render(SubjectTest)

  const heading = screen.getByRole('heading')
  const child = within(heading).getByTestId('child')

  expect(child).toBeInTheDocument()
})
```

## Using `createRawSnippet`

For more complex snippets, e.g. where you want to check arguments, you can use
Svelte's [createRawSnippet][] API.

[createRawSnippet]: https://svelte.dev/docs/svelte/svelte#createRawSnippet

### `complex-snippet.svelte`

```svelte file=./complex-snippet.svelte
<script>
  let { name, message } = $props()

  const greeting = $derived(`Hello, ${name}!`)
</script>

<p>
  {@render message?.(greeting)}
</p>
```

### `complex-snippet.test.js`

```js file=./complex-snippet.test.js
import { render, screen } from '@testing-library/svelte'
import { createRawSnippet } from 'svelte'
import { expect, test } from 'vitest'

import Subject from './complex-snippet.svelte'

test('renders greeting in message snippet', () => {
  render(Subject, {
    name: 'Alice',
    message: createRawSnippet((greeting) => ({
      render: () => `<span data-testid="message">${greeting()}</span>`,
    })),
  })

  const message = screen.getByTestId('message')

  expect(message).toHaveTextContent('Hello, Alice!')
})
```

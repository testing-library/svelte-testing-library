# @testing-library/svelte-core

Do you want to build your own Svelte testing library? You may want to use our
rendering core, which abstracts away differences in Svelte versions to provide a
simple API to render Svelte components into the document and clean them up
afterwards.

## Table of Contents

- [Example Usage](#example-usage)
- [API](#api)
  - [`render`](#render)
  - [`setup`](#setup)
  - [`mount`](#mount)
  - [`cleanup`](#cleanup)
  - [`addCleanupTask`](#addcleanuptask)
  - [`removeCleanupTask`](#removecleanuptask)
  - [Utility types](#utility-types)

## Example Usage

```ts
import { beforeEach } from 'vitest'
import * as SvelteCore from '@testing-library/svelte-core'
import type {
  Component,
  Exports,
  Rerender,
} from '@testing-library/svelte-core/types'

import { bindQueries, type Queries } from './bring-your-own-queries.js'

beforeEach(() => {
  SvelteCore.cleanup()
})

export interface RenderResult<C extends Component> extends Queries {
  container: HTMLElement
  component: Exports<C>
  rerender: Rerender<C>
  unmount: () => void
}

export const render = <C extends SvelteCore.Component>(
  Component: SvelteCore.ComponentImport<C>,
  options: SvelteCore.ComponentOptions<C>
): RenderResult<C> => {
  const { baseElement, component, container, rerender, unmount } =
    SvelteCore.render(Component, options)

  const queries = bindQueries(baseElement)

  return { component, container, rerender, unmount, ...queries }
}
```

## API

### `render`

Set up the document and mount a component into that document.

```ts
const { baseElement, container, component, rerender, unmount } = render(
  Component,
  componentOptions,
  setupOptions
)
```

| Argument           | Type                                                    | Description                                   |
| ------------------ | ------------------------------------------------------- | --------------------------------------------- |
| `Component`        | [Svelte component][svelte-component-docs]               | An imported Svelte component                  |
| `componentOptions` | `Props` or partial [`mount` options][svelte-mount-docs] | Options for how the component will be mounted |
| `setupOptions`     | `{ baseElement?: HTMLElement }`                         | Optionally override `baseElement`             |

| Result        | Type                                       | Description                              | Default                             |
| ------------- | ------------------------------------------ | ---------------------------------------- | ----------------------------------- |
| `baseElement` | `HTMLElement`                              | The base element                         | `document.body`                     |
| `container`   | `HTMLElement`                              | The component's immediate parent element | `<div>` appended to `document.body` |
| `component`   | [component exports][svelte-mount-docs]     | The component's exports from `mount`     | N/A                                 |
| `rerender`    | `(props: Partial<Props>) => Promise<void>` | Update the component's props             | N/A                                 |
| `unmount`     | `() => void`                               | Unmount the component from the document  | N/A                                 |

> \[!TIP]
> Calling `render` is equivalent to calling [`setup`](#setup) followed by [`mount`](#mount)
>
> ```ts
> const { baseElement, container, mountOptions } = setup(
>   componentOptions,
>   setupOptions
> )
> const { component, rerender, unmount } = mount(Component, mountOptions)
> ```

[svelte-component-docs]: https://svelte.dev/docs/svelte-components
[svelte-mount-docs]: https://svelte.dev/docs/svelte/imperative-component-api#mount

### `setup`

Validate options and prepare document elements for rendering.

```ts
const { baseElement, container, mountOptions } = setup(
  componentOptions,
  setupOptions
)
```

| Argument           | Type                                                    | Description                                   |
| ------------------ | ------------------------------------------------------- | --------------------------------------------- |
| `componentOptions` | `Props` or partial [`mount` options][svelte-mount-docs] | Options for how the component will be mounted |
| `setupOptions`     | `{ baseElement?: HTMLElement }`                         | Optionally override `baseElement`             |

| Result         | Type                                 | Description                              | Default                             |
| -------------- | ------------------------------------ | ---------------------------------------- | ----------------------------------- |
| `baseElement`  | `HTMLElement`                        | The base element                         | `document.body`                     |
| `container`    | `HTMLElement`                        | The component's immediate parent element | `<div>` appended to `document.body` |
| `mountOptions` | [`mount` options][svelte-mount-docs] | Validated options to pass to `mount`     | `{ target, props: {} }`             |

### `mount`

Mount a Svelte component into the document.

```ts
const { component, unmount, rerender } = mount(Component, mountOptions)
```

| Argument       | Type                                      | Description                                  |
| -------------- | ----------------------------------------- | -------------------------------------------- |
| `Component`    | [Svelte component][svelte-component-docs] | An imported Svelte component                 |
| `mountOptions` | [component options][svelte-mount-docs]    | Options to pass to Svelte's `mount` function |

| Result      | Type                                       | Description                             |
| ----------- | ------------------------------------------ | --------------------------------------- |
| `component` | [component exports][svelte-mount-docs]     | The component's exports from `mount`    |
| `unmount`   | `() => void`                               | Unmount the component from the document |
| `rerender`  | `(props: Partial<Props>) => Promise<void>` | Update the component's props            |

### `cleanup`

Cleanup rendered components and added elements. Call this when your tests are
over.

```ts
cleanup()
```

### `addCleanupTask`

Add a custom cleanup task to be called with `cleanup()`

```ts
addCleanupTask(() => {
  // ...reset something
})
```

### `removeCleanupTask`

Remove a cleanup task from `cleanup()`. Useful if a cleanup task can only be run
once and may be run outside of `cleanup`

```ts
const customCleanup = () => {
  // ...reset something
}

addCleanupTask(customCleanup)

const manuallyCleanupEarly = () => {
  customCleanup()
  removeCleanupTask(customCleanup)
}
```

### Utility types

This module exports various utility types from
`@testing-library/svelte-core/types`. They adapt to whatever Svelte version is
installed, and can be used to get type signatures for imported components,
props, exports, etc.

See [`./types.d.ts`](./types.d.ts) for the full list of available types.

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
  - [`wrapperSetup`](#wrappersetup)
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

beforeEach(async () => {
  // Required to use the `wrapper` render option
  await SvelteCore.wrapperSetup()
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

| Argument           | Type                                                    | Description                                             |
| ------------------ | ------------------------------------------------------- | ------------------------------------------------------- |
| `Component`        | [Svelte component][svelte-component-docs]               | An imported Svelte component                            |
| `componentOptions` | `Props` or partial [`mount` options][svelte-mount-docs] | Options for how the component will be mounted           |
| `setupOptions`     | [`SetupOptions`](#setup)                                | Optionally override `baseElement` or wrap the component |

| Result        | Type                                       | Description                                        | Default                             |
| ------------- | ------------------------------------------ | -------------------------------------------------- | ----------------------------------- |
| `baseElement` | `HTMLElement`                              | The base element                                   | `document.body`                     |
| `container`   | `HTMLElement`                              | The component's immediate parent element           | `<div>` appended to `document.body` |
| `component`   | [component exports][svelte-mount-docs]     | The component's exports from `mount`               | N/A                                 |
| `wrapper`     | [component exports][svelte-mount-docs]     | The wrapper's exports, if a `wrapper` was provided | `undefined`                         |
| `rerender`    | `(props: Partial<Props>) => Promise<void>` | Update the component's props                       | N/A                                 |
| `unmount`     | `() => void`                               | Unmount the component from the document            | N/A                                 |

> \[!TIP]
> Calling `render` is equivalent to calling [`setup`](#setup) followed by [`mount`](#mount)
>
> ```ts
> const { baseElement, container, mountOptions } = setup(
>   componentOptions,
>   setupOptions
> )
> const { component, rerender, unmount } = mount(
>   Component,
>   mountOptions,
>   setupOptions
> )
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
| `setupOptions`     | `SetupOptions`                                          | Configure the document and wrap the component |

`setupOptions` accepts the following fields, all optional:

| Field          | Type                                      | Description                                                           | Default         |
| -------------- | ----------------------------------------- | --------------------------------------------------------------------- | --------------- |
| `baseElement`  | `HTMLElement`                             | The base element to bind queries to                                   | `document.body` |
| `wrapper`      | [Svelte component][svelte-component-docs] | A component to wrap the component under test, e.g. a context provider | `undefined`     |
| `wrapperProps` | `Props`                                   | Props to pass to the `wrapper` component                              | `undefined`     |

> \[!IMPORTANT]
> Using the `wrapper` option requires awaiting [`wrapperSetup`](#wrappersetup)
> beforehand, e.g. in a `beforeEach` hook.

| Result         | Type                                 | Description                              | Default                             |
| -------------- | ------------------------------------ | ---------------------------------------- | ----------------------------------- |
| `baseElement`  | `HTMLElement`                        | The base element                         | `document.body`                     |
| `container`    | `HTMLElement`                        | The component's immediate parent element | `<div>` appended to `document.body` |
| `mountOptions` | [`mount` options][svelte-mount-docs] | Validated options to pass to `mount`     | `{ target, props: {} }`             |

### `wrapperSetup`

Load the wrapper scaffold for the installed version of Svelte. Await this before
rendering with the [`wrapper`](#setup) option, e.g. in a `beforeEach` hook.
Rendering with a `wrapper` before `wrapperSetup` resolves throws a
`WrapperNotSetupError`.

```ts
await wrapperSetup()
```

The scaffold is loaded once and cached, so calling `wrapperSetup` repeatedly is
cheap.

### `mount`

Mount a Svelte component into the document.

```ts
const { component, wrapper, unmount, rerender } = mount(
  Component,
  mountOptions,
  setupOptions
)
```

| Argument       | Type                                      | Description                                               |
| -------------- | ----------------------------------------- | --------------------------------------------------------- |
| `Component`    | [Svelte component][svelte-component-docs] | An imported Svelte component                              |
| `mountOptions` | [component options][svelte-mount-docs]    | Options to pass to Svelte's `mount` function              |
| `setupOptions` | [`SetupOptions`](#setup)                  | Optionally wrap the component (`wrapper`, `wrapperProps`) |

| Result      | Type                                       | Description                                        |
| ----------- | ------------------------------------------ | -------------------------------------------------- |
| `component` | [component exports][svelte-mount-docs]     | The component's exports from `mount`               |
| `wrapper`   | [component exports][svelte-mount-docs]     | The wrapper's exports, if a `wrapper` was provided |
| `unmount`   | `() => void`                               | Unmount the component from the document            |
| `rerender`  | `(props: Partial<Props>) => Promise<void>` | Update the component's props                       |

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

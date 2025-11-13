# @testing-library/svelte-core

Do you want to build your own Svelte testing library? You may want to use our
rendering core, which abstracts away differences in Svelte versions to provide a
simple API to render Svelte components into the document and clean them up
afterwards

## Table of Contents

- [Example Usage](#example-usage)
- [API](#api)
  - [`setup`](#setup)
  - [`mount`](#mount)
  - [`cleanup`](#cleanup)
  - [`addCleanupTask`](#addcleanuptask)
  - [`removeCleanupTask`](#removecleanuptask)
  - [Utility types](#utility-types)

## Example Usage

```ts
import { beforeEach } from 'vitest'
import { cleanup, mount, setup } from '@testing-library/svelte-core'
import type {
  Component,
  ComponentType,
  ComponentOptions,
  Props,
  Exports,
} from '@testing-library/svelte-core/types'

import { bindQueries, type Screen } from './bring-your-own-queries.js'

beforeEach(() => {
  cleanup()
})

export interface RenderResult<C extends Component> {
  screen: Screen
  component: Exports<C>
  target: HTMLElement
  rerender: (props: Partial<Props<C>>) => Promise<void>
  unmount: () => void
}

export const render = <C extends Component>(
  component: ComponentType<C>,
  options: ComponentOptions<C>
): RenderResult<C> => {
  const { baseElement, target, mountOptions } = setup(options)
  const { component, unmount, rerender } = mount(component, mountOptions)
  const screen = bindQueries(baseElement)

  return { screen, component, target, rerender, unmount }
}
```

## API

### `setup`

Validate options and prepare document elements for rendering.

```ts
const { baseElement, target, mountOptions } = setup(options, renderOptions)
```

| Argument           | Type                                     | Description                                    |
| ------------------ | ---------------------------------------- | ---------------------------------------------- |
| `componentOptions` | `Props` or partial [component options][] | Options for how the component will be rendered |
| `setupOptions`     | `{ baseElement?: HTMLElement }`          | Optionally override `baseElement`              |

| Result         | Type                  | Description                                 | Default                             |
| -------------- | --------------------- | ------------------------------------------- | ----------------------------------- |
| `baseElement`  | `HTMLElement`         | The base element                            | `document.body`                     |
| `target`       | `HTMLElement`         | The component's `target` element            | `<div>` appended to `document.body` |
| `mountOptions` | [component options][] | Validated Svelte options to pass to `mount` | `{ target, props: {} }`             |

[component options]: https://svelte.dev/docs/client-side-component-api

### `mount`

Mount a Svelte component into the document.

```ts
const { component, unmount, rerender } = mount(Component, options)
```

| Argument    | Type                  | Description                  |
| ----------- | --------------------- | ---------------------------- |
| `Component` | [Svelte component][]  | An imported Svelte component |
| `options`   | [component options][] | Svelte component options     |

| Result      | Type                                       | Description                                        |
| ----------- | ------------------------------------------ | -------------------------------------------------- |
| `component` | [component instance][]                     | The component instance                             |
| `unmount`   | `() => void`                               | Unmount the component from the document            |
| `rerender`  | `(props: Partial<Props>) => Promise<void>` | Update the component's props and wait for rerender |

[Svelte component]: https://svelte.dev/docs/svelte-components
[component instance]: https://svelte.dev/docs/client-side-component-api

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
props, events, etc.

See [`./types.d.ts`](./types.d.ts) for the full list of types available.

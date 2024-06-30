# @testing-library/svelte/core

Do you want to build your own Svelte testing library? You may want to use our rendering core, which abstracts away differences in Svelte versions to provide a simple API to render Svelte components into the document and clean them up afterwards

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Usage](#usage)
- [API](#api)
  - [`prepareDocument`](#preparedocument)
  - [`mount`](#mount)
  - [`cleanup`](#cleanup)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage

```ts
import { prepareDocument, mount, cleanup } from '@testing-library/svelte/core'
import MyCoolComponent from './my-cool-component.svelte'

const { baseElement, target, options } = prepareDocument({ awesome: true })
const { component, unmount, rerender } = mount(MyCoolComponent, options)

// later
cleanup()
```

## API

### `prepareDocument`

Validate options and prepare document elements for rendering.

```ts
const { baseElement, target, options } = prepareDocument(propsOrOptions, renderOptions)
```

| Argument         | Type                                     | Description                                                           |
| ---------------- | ---------------------------------------- | --------------------------------------------------------------------- |
| `propsOrOptions` | `Props` or partial [component options][] | The component's props, or options to pass to Svelte's client-side API |
| `renderOptions`  | `{ baseElement?: HTMLElement }`          | customize `baseElement`; will be `document.body` if unspecified       |

| Result        | Type                  | Description                                                          |
| ------------- | --------------------- | -------------------------------------------------------------------- |
| `baseElement` | `HTMLElement`         | The base element, `document.body` by default                         |
| `target`      | `HTMLElement`         | The component's `target` element, a `<div>` by default               |
| `options`     | [component options][] | Validated and normalized Svelte options to pass to `renderComponent` |

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

Cleanup rendered components and added elements. Call this when your tests are over.

```ts
cleanup()
```

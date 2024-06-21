# svelte-testing-library core

The `core` module provides a low-level interface to render Svelte components for
testing purposes. It abstracts away differences in Svelte versions and provides
methods for interacting with Svelte's [client-side API][svelte-client-api] and
cleanup.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Create DOM elements](#create-dom-elements)
  - [`createTargetElement`](#createtargetelement)
- [Render components](#render-components)
  - [`renderComponent`](#rendercomponent)
  - [`validateComponentOptions`](#validatecomponentoptions)
- [Cleanup components and elements](#cleanup-components-and-elements)
  - [`cleanup`](#cleanup)
- [Errors](#errors)
  - [`UnknownSvelteOptionsError`](#unknownsvelteoptionserror)
  - [`InvalidPropsError`](#invalidpropserror)
- [Types](#types)
  - [`Component`](#component)
  - [`Options`](#options)
  - [`Props`](#props)
  - [`RenderOptions`](#renderoptions)
  - [`TargetAndBaseElements`](#targetandbaseelements)
    - [`TargetAndBaseElements.target`](#targetandbaseelementstarget)
    - [`TargetAndBaseElements.baseElement`](#targetandbaseelementsbaseelement)
  - [`RenderedComponent`](#renderedcomponent)
    - [`RenderedComponent.component`](#renderedcomponentcomponent)
    - [`RenderedComponent.unmount`](#renderedcomponentunmount)
    - [`RenderedComponent.rerender`](#renderedcomponentrerender)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

[svelte-client-api]: https://svelte.dev/docs/client-side-component-api

## Create DOM elements

### `createTargetElement`

Get and/or create elements to render a component into.

- Args
  - options: [Options](#options)
  - renderOptions: [RenderOptions](#renderoptions)
- Returns
  - [TargetAndBaseElements](#renderelements)

```ts
import { createTargetElement } from '@testing-library/svelte/core'

const { target, baseElement } = createTargetElement(options, renderOptions)
```

The returned `target` should be passed to the Svelte component's `target`
option, and the `baseElement` can be used for querying the rendered component.

If neither `options.target` nor `renderOptions.baseElement` are specified, this
function will:

- Get `document.body` as the base element
- Add a `<div>` to `document.body` to use as the `target`

If `options.target` is specified but `renderOptions.baseElement` is not, the
returned `options.target` and `renderOptions.baseElement` will both be
`options.target`.

If `target` is a child of `document.body`, it will be removed by
[`cleanup`](#cleanup).

## Render components

### `renderComponent`

- Args
  - `Component`: [Component](#component)
  - `options`: [Options](#options)
- Returns
  - [RenderedComponent](#renderedcomponent)

```ts
import { renderComponent } from '@testing-library/svelte/core'
import Component from './my-component.svelte'

const { component, unmount, rerender } = renderComponent(Component, options)
```

- `component` is the Svelte component instance
- `unmount` is a function that will remove the component from the DOM
- `rerender` is a function that passes new prop values to the component

### `validateComponentOptions`

Validate component render options.

```ts
import { validateComponentOptions } from '@testing-library/svelte/core'

const validatedOptions = validateComponentOptions(optionsOrProps)
```

- Args
  - `optionsOrProps`: [Options](#component) or [Props](#props)
- Returns
  - [Options](#component)
- Throws
  - [UnknownSvelteOptionsError](#unknownsvelteoptionserror)
  - [InvalidPropsError](#invalidpropserror)

If `optionsOrProps` is an object with fields that do not match any known Svelte
options, the object will be used as `options.props`. If it cannot determine if
an object is props or Svelte options, an
[`UnknownSvelteOptionsError`](#unknownsvelteoptionserror) will be thrown. If the
input `props` are not an object, an [`InvalidPropsError`](#invalidpropserror)
will be thrown.

## Cleanup components and elements

### `cleanup`

Unmount all Svelte components and remove all elements added to `document.body`.

```ts
import { cleanup } from '@testing-library/svelte/core'

cleanup()
```

## Errors

### `UnknownSvelteOptionsError`

A component option was passed in that didn't match any known Svelte options,
usually because props were intermixed with Svelte options or because a prop
shares a name with a Svelte option.

### `InvalidPropsError`

A passed in `props` value was not an object.

## Types

### `Component`

An imported [Svelte component][]. Exact shape differs between Svelte versions.

[svelte component]: https://svelte.dev/docs/svelte-components

### `Options`

[Svelte component options][svelte-component-api]. Exact shape differs between
Svelte versions.

[svelte-component-api]: https://svelte.dev/docs/client-side-component-api#creating-a-component

### `Props`

The props that a Svelte component will accept

### `RenderOptions`

- Properties
  - `baseElement`: [HTMLElement][] - Customize the parent of the component's
    `target`

[HTMLElement]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement

### `TargetAndBaseElements`

#### `TargetAndBaseElements.target`

An [HTMLElement][]the component should be mounted into, usually a `<div>` in
`document.body`

#### `TargetAndBaseElements.baseElement`

The parent of the component's `target`, usually `document.body`

### `RenderedComponent`

#### `RenderedComponent.component`

The mounted [Svelte component instance][svelte-component-api]. Exact shape
differs between Svelte versions.

#### `RenderedComponent.unmount`

A function that removes the component from the DOM.

```ts
function unmount(): void
```

#### `RenderedComponent.rerender`

A function that can send updated prop values to the component and trigger a
re-render.

```ts
async function rerender(props: Partial<Props>): Promise<void>
```

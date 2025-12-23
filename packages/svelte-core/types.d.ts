/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-deprecated */
/**
 * Component and utility types.
 *
 * Supports components from Svelte 3, 4, and 5.
 */
import type {
  Component as ModernComponent,
  ComponentConstructorOptions as LegacyConstructorOptions,
  ComponentProps,
  EventDispatcher,
  mount,
  SvelteComponent as Svelte4LegacyComponent,
  SvelteComponentTyped as Svelte3LegacyComponent,
} from 'svelte'

type IS_MODERN_SVELTE = ModernComponent extends (...args: any[]) => any
  ? true
  : false

type IS_LEGACY_SVELTE_4 =
  EventDispatcher<any> extends (...args: any[]) => any ? true : false

/** A compiled, imported Svelte component. */
export type Component<
  P extends Record<string, any> = any,
  E extends Record<string, any> = any,
> = IS_MODERN_SVELTE extends true
  ? ModernComponent<P, E> | LegacyComponent<P>
  : LegacyComponent<P>

/** A compiled, imported Svelte 3 or 4 component. */
export type LegacyComponent<P extends Record<string, any> = any> =
  IS_LEGACY_SVELTE_4 extends true
    ? Svelte4LegacyComponent<P>
    : Svelte3LegacyComponent<P>

/**
 * The "type" of an imported, compiled Svelte component.
 *
 * In Svelte 5, there is no difference between the
 * imported component and its "type" - it's just a function.
 * In Svelte 3/4, the imported component is a class.
 */
export type ComponentType<C> = C extends LegacyComponent
  ? new (...args: any[]) => C
  : C

/**
 * A component import.
 *
 * A convenience type to allow dynamically `import(...)`'d
 * components to be passed directly to `mount.`
 */
export type ComponentImport<C> =
  | ComponentType<C>
  | { default: ComponentType<C> }

/** The props of a component. */
export type Props<C extends Component> = ComponentProps<C>

/**
 * The exported fields of a component.
 *
 * In Svelte 5, this is the set of variables marked as `export`'d.
 * In Svelte 4, this is simply the instance of the component class.
 */
export type Exports<C> = IS_MODERN_SVELTE extends true
  ? C extends ModernComponent<any, infer E>
    ? E
    : C & { $set: never; $on: never; $destroy: never }
  : C

/**
 * Options that may be passed to `mount` when rendering the component.
 *
 * In Svelte 4, these are the options passed to the component constructor.
 */
export type MountOptions<C extends Component> = IS_MODERN_SVELTE extends true
  ? Parameters<typeof mount<Props<C>, Exports<C>>>[1]
  : LegacyConstructorOptions<Props<C>>

/** A component's props or some of its mount options. */
export type ComponentOptions<C extends Component> =
  | Props<C>
  | Partial<MountOptions<C>>

/** Update a component's props and trigger updates to the DOM. */
export type Rerender<C extends Component> = (
  props: Partial<Props<C>>
) => Promise<void>

/** The result of mounting a component into the document. */
export interface MountResult<C extends Component> {
  /** The mounted component's exports. */
  component: Exports<C>
  /** Unmount the component. */
  unmount: () => void
  /** Rerender the component. */
  rerender: Rerender<C>
}

/** Options for configuring the document. */
export interface SetupOptions {
  /** The base document element, `document.body` if unspecified. */
  baseElement?: HTMLElement
}

/** The result of setting up the document for rendering. */
export interface SetupResult<C extends Component> {
  /** The base document element, usually `document.body`. */
  baseElement: HTMLElement
  /** The component's immediate container element, usually a `<div>` appended to `document.body`. */
  container: HTMLElement
  /** Options to pass to `mount`. */
  mountOptions: MountOptions<C>
}

/** The result of setting up the document and rendering the component. */
export interface RenderResult<C extends Component> {
  /** The base document element, usually `document.body`. */
  baseElement: HTMLElement
  /** The component's immediate container element, usually a `<div>` appended to `document.body`. */
  container: HTMLElement
  /** The mounted component's exports. */
  component: Exports<C>
  /** Unmount the component. */
  unmount: () => void
  /** Rerender the component. */
  rerender: Rerender<C>
}

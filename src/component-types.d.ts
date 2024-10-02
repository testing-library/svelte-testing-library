/* eslint-disable @typescript-eslint/no-explicit-any */
import type * as Svelte from 'svelte'

type IS_MODERN_SVELTE = any extends Svelte.Component ? false : true

/** A compiled, imported Svelte component. */
export type Component<
  P extends Record<string, any>,
  E extends Record<string, any>,
> = IS_MODERN_SVELTE extends true
  ? Svelte.Component<P, E> | Svelte.SvelteComponent<P>
  : Svelte.SvelteComponent<P>

/**
 * The type of an imported, compiled Svelte component.
 *
 * In Svelte 4, this was the Svelte component class' type.
 * In Svelte 5, this distinction no longer matters.
 */
export type ComponentType<C> = C extends Svelte.SvelteComponent
  ? Svelte.ComponentType<C>
  : C

/** The props of a component. */
export type Props<C extends Component<any, any>> = Svelte.ComponentProps<C>

/**
 * The exported fields of a component.
 *
 * In Svelte 4, this is simply the instance of the component class.
 * In Svelte 5, this is the set of variables marked as `export`'d.
 */
export type Exports<C> = C extends Svelte.SvelteComponent
  ? C
  : C extends Svelte.Component<any, infer E>
    ? E
    : never

/**
 * Options that may be passed to `mount` when rendering the component.
 *
 * In Svelte 4, these are the options passed to the component constructor.
 */
export type MountOptions<C extends Component<any, any>> =
  IS_MODERN_SVELTE extends true
    ? Parameters<typeof Svelte.mount<Props<C>, Exports<C>>>[1]
    : Svelte.ComponentConstructorOptions<Props<C>>

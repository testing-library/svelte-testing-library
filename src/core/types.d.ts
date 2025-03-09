/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  Component as ModernComponent,
  ComponentConstructorOptions as LegacyConstructorOptions,
  ComponentProps,
  EventDispatcher,
  mount,
  SvelteComponent as LegacyComponent,
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
  : IS_LEGACY_SVELTE_4 extends true
    ? LegacyComponent<P>
    : Svelte3LegacyComponent<P>

/**
 * The type of an imported, compiled Svelte component.
 *
 * In Svelte 5, this distinction no longer matters.
 * In Svelte 4, this is the Svelte component class constructor.
 */
export type ComponentType<C> = C extends LegacyComponent
  ? new (...args: any[]) => C
  : C

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

/** Detect which version of Svelte we're using */
import * as Svelte from 'svelte'

/** Whether we're using Svelte >= 5. */
const IS_MODERN_SVELTE = typeof Svelte.mount === 'function'

export { IS_MODERN_SVELTE }

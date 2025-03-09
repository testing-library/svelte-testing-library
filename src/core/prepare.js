import { addCleanupTask } from './cleanup.js'
import * as MountLegacy from './mount-legacy.js'
import * as MountModern from './mount-modern.svelte.js'

const ALLOWED_OPTIONS = MountModern.IS_MODERN_SVELTE
  ? MountModern.ALLOWED_OPTIONS
  : MountLegacy.ALLOWED_OPTIONS

/** An error thrown for incorrect options and clashes between props and Svelte options. */
class UnknownSvelteOptionsError extends TypeError {
  constructor(unknownOptions) {
    super(`Unknown options.

    Unknown: [ ${unknownOptions.join(', ')} ]
    Allowed: [ ${ALLOWED_OPTIONS.join(', ')} ]

    To pass both Svelte options and props to a component,
    or to use props that share a name with a Svelte option,
    you must place all your props under the \`props\` key:

    render(Component, { props: { /** props here **/ } })
`)
    this.name = 'UnknownSvelteOptionsError'
  }
}

/**
 * Prepare DOM elements for rendering.
 *
 * @template {import('./types.js').Component} C
 * @param {import('./types.js').PropsOrMountOptions<C>} propsOrOptions
 * @param {{ baseElement?: HTMLElement }} renderOptions
 * @returns {{
 *   baseElement: HTMLElement
 *   target: HTMLElement
 *   mountOptions: import('./types.js').MountOptions<C>
 * }}
 */
const prepare = (propsOrOptions = {}, renderOptions = {}) => {
  const mountOptions = validateMountOptions(propsOrOptions)

  const baseElement =
    renderOptions.baseElement ?? mountOptions.target ?? document.body

  const target =
    mountOptions.target ??
    baseElement.appendChild(document.createElement('div'))

  addCleanupTask(() => {
    if (target.parentNode === document.body) {
      document.body.removeChild(target)
    }
  })

  return { baseElement, target, mountOptions: { ...mountOptions, target } }
}

/** Prevent incorrect options and clashes between props and Svelte options. */
const validateMountOptions = (options) => {
  const isProps = !Object.keys(options).some((option) =>
    ALLOWED_OPTIONS.includes(option)
  )

  if (isProps) {
    return { props: options }
  }

  // Check if any props and Svelte options were accidentally mixed.
  const unknownOptions = Object.keys(options).filter(
    (option) => !ALLOWED_OPTIONS.includes(option)
  )

  if (unknownOptions.length > 0) {
    throw new UnknownSvelteOptionsError(unknownOptions)
  }

  return options
}

export { prepare, UnknownSvelteOptionsError }

/** Set up the document to render a component. */
import { addCleanupTask } from './cleanup.js'
import { IS_MODERN_SVELTE } from './svelte-version.js'

/** Allowed options to the `mount` call or legacy component constructor. */
const ALLOWED_MOUNT_OPTIONS = IS_MODERN_SVELTE
  ? ['target', 'anchor', 'props', 'events', 'context', 'intro']
  : ['target', 'accessors', 'anchor', 'props', 'hydrate', 'intro', 'context']

class UnknownSvelteOptionsError extends TypeError {
  constructor(unknownOptions) {
    super(`Unknown options.

    Unknown: [ ${unknownOptions.join(', ')} ]
    Allowed: [ ${ALLOWED_MOUNT_OPTIONS.join(', ')} ]

    To pass both Svelte options and props to a component,
    or to use props that share a name with a Svelte option,
    you must place all your props under the \`props\` key:

    render(Component, { props: { /** props here **/ } })
`)
    this.name = 'UnknownSvelteOptionsError'
  }
}

/**
 * Validate a component's mount options.
 *
 * @template {import('../types.js').Component} C
 * @param {import('../types.js').ComponentOptions<C>} options - props or mount options
 * @returns {Partial<import('../types.js').MountOptions<C>>}
 */
const validateOptions = (options) => {
  const isProps = !Object.keys(options).some((option) =>
    ALLOWED_MOUNT_OPTIONS.includes(option)
  )

  if (isProps) {
    return { props: options }
  }

  // Check if any props and Svelte options were accidentally mixed.
  const unknownOptions = Object.keys(options).filter(
    (option) => !ALLOWED_MOUNT_OPTIONS.includes(option)
  )

  if (unknownOptions.length > 0) {
    throw new UnknownSvelteOptionsError(unknownOptions)
  }

  return options
}

/**
 * Set up the document to render a component.
 *
 * @template {import('../types.js').Component} C
 * @param {import('../types.js').ComponentOptions<C>} componentOptions - props or mount options
 * @param {import('../types.js').SetupOptions} setupOptions - base element of the document to bind any queries
 * @returns {import('../types.js').SetupResult<C>}
 */
const setup = (componentOptions, setupOptions = {}) => {
  const mountOptions = validateOptions(componentOptions)

  const baseElement =
    setupOptions.baseElement ?? mountOptions.target ?? document.body

  const container =
    mountOptions.target ??
    baseElement.appendChild(document.createElement('div'))

  addCleanupTask(() => {
    if (container.parentNode === document.body) {
      container.remove()
    }
  })

  return {
    baseElement,
    container,
    mountOptions: { ...mountOptions, target: container },
  }
}

export { setup, UnknownSvelteOptionsError }

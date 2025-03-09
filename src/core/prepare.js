class UnknownSvelteOptionsError extends TypeError {
  constructor(unknownOptions, allowedOptions) {
    super(`Unknown options.

    Unknown: [ ${unknownOptions.join(', ')} ]
    Allowed: [ ${allowedOptions.join(', ')} ]

    To pass both Svelte options and props to a component,
    or to use props that share a name with a Svelte option,
    you must place all your props under the \`props\` key:

    render(Component, { props: { /** props here **/ } })
`)
    this.name = 'UnknownSvelteOptionsError'
  }
}

const createValidateOptions = (allowedOptions) => (options) => {
  const isProps = !Object.keys(options).some((option) =>
    allowedOptions.includes(option)
  )

  if (isProps) {
    return { props: options }
  }

  // Check if any props and Svelte options were accidentally mixed.
  const unknownOptions = Object.keys(options).filter(
    (option) => !allowedOptions.includes(option)
  )

  if (unknownOptions.length > 0) {
    throw new UnknownSvelteOptionsError(unknownOptions, allowedOptions)
  }

  return options
}

export { createValidateOptions, UnknownSvelteOptionsError }

/**
 * Create a shallowly reactive props object.
 *
 * This allows us to update props on `rerender`
 * without turing `props` into a deep set of Proxy objects
 *
 * @template {Record<string, unknown>} Props
 * @param {Props} initialProps
 * @returns {[Props, (nextProps: Partial<Props>) => void]}
 */
const createProps = (initialProps = {}) => {
  let currentProps = $state.raw(initialProps)

  const props = new Proxy(initialProps, {
    get(_, key) {
      return currentProps[key]
    },
    set(_, key, value) {
      currentProps[key] = value
      return true
    },
    has(_, key) {
      return Reflect.has(currentProps, key)
    },
    ownKeys() {
      return Reflect.ownKeys(currentProps)
    },
  })

  const update = (nextProps) => {
    currentProps = { ...currentProps, ...nextProps }
  }

  return [props, update]
}

export { createProps }

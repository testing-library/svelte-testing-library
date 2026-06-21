/**
 * Create a shallowly reactive props object.
 *
 * This allows us to update props on `rerender` without turning the user's
 * props into a deeply reactive `$state` proxy.
 *
 * @template {Record<string, unknown>} Props
 * @param {Props} initialProps
 * @returns {[Props, (nextProps: Partial<Props>) => void]}
 */
const createProps = (initialProps = {}) => {
  let currentProps = $state.raw(initialProps)

  const props = new Proxy(
    {},
    {
      get(_, key) {
        return Reflect.get(currentProps, key)
      },
      set(_, key, value) {
        return Reflect.set(currentProps, key, value)
      },
      has(_, key) {
        return Reflect.has(currentProps, key)
      },
      ownKeys() {
        return Reflect.ownKeys(currentProps)
      },
      getOwnPropertyDescriptor(_, key) {
        return Reflect.getOwnPropertyDescriptor(currentProps, key)
      },
    }
  )

  const update = (nextProps) => {
    currentProps = { ...currentProps, ...nextProps }
  }

  return [props, update]
}

export { createProps }

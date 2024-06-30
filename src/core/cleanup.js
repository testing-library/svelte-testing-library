/** @type {Map<unknown, () => void} */
const itemsToClean = new Map()

/** Register an item for later cleanup. */
const addItemToCleanup = (item, onCleanup) => {
  itemsToClean.set(item, onCleanup)
}

/** Remove an individual item from cleanup without running its cleanup handler. */
const removeItemFromCleanup = (item) => {
  itemsToClean.delete(item)
}

/** Clean up an individual item. */
const cleanupItem = (item) => {
  const handleCleanup = itemsToClean.get(item)
  handleCleanup?.()
  itemsToClean.delete(item)
}

/** Clean up all components and elements added to the document. */
const cleanup = () => {
  for (const handleCleanup of itemsToClean.values()) {
    handleCleanup()
  }

  itemsToClean.clear()
}

export { addItemToCleanup, cleanup, cleanupItem, removeItemFromCleanup }

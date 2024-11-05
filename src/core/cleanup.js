/** @type {Set<() => void} */
const cleanupTasks = new Set()

/** Register later cleanup task */
const addCleanupTask = (onCleanup) => {
  cleanupTasks.add(onCleanup)
  return onCleanup
}

/** Remove a cleanup task without running it. */
const removeCleanupTask = (onCleanup) => {
  cleanupTasks.delete(onCleanup)
}

/** Clean up all components and elements added to the document. */
const cleanup = () => {
  for (const handleCleanup of cleanupTasks.values()) {
    handleCleanup()
  }

  cleanupTasks.clear()
}

export { addCleanupTask, cleanup, removeCleanupTask }

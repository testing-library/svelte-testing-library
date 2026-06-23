import { IS_MODERN_SVELTE } from './svelte-version.js'

/** @type {import('../types.js').Component | undefined} */
let WrapperScaffold

/** @type {Promise<unknown> | undefined} */
let scaffoldInitialization

class WrapperNotSetupError extends Error {
  constructor() {
    super(
      'Ensure `setup()` runs (e.g. in `beforeEach`) before using `wrapper` option.'
    )
    this.name = 'WrapperNotSetupError'
  }
}

/**
 * Import the proper wrapper scaffolding for the current version of Svelte.
 *
 * Supports the `wrapper` option of `render` / `mount`.
 */
const wrapperSetup = async () => {
  if (!scaffoldInitialization) {
    scaffoldInitialization = initializeScaffold()
  }

  await scaffoldInitialization
}

/** Import the scaffold component and set up module singletons. */
const initializeScaffold = async () => {
  const scaffoldImport = IS_MODERN_SVELTE
    ? import('./wrapper-scaffold.svelte')
    : import('./wrapper-scaffold-legacy.svelte')

  const { default: Scaffold } = await scaffoldImport
  WrapperScaffold = Scaffold
}

/** Get the wrapper scaffolding component. */
const getWrapperScaffold = () => {
  if (!WrapperScaffold) {
    throw new WrapperNotSetupError()
  }

  return WrapperScaffold
}

export { getWrapperScaffold, wrapperSetup }

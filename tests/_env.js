import { VERSION as SVELTE_VERSION } from 'svelte/compiler'

export const IS_JSDOM = globalThis.navigator.userAgent.includes('jsdom')

export const IS_HAPPYDOM = !IS_JSDOM // right now it's happy or js

export const IS_JEST = Boolean(process.env.JEST_WORKER_ID)

export const IS_SVELTE_5 = SVELTE_VERSION >= '5'

export const MODE_LEGACY = 'legacy'

export const MODE_RUNES = 'runes'

export const COMPONENT_FIXTURES = [
  {
    mode: MODE_LEGACY,
    component: './fixtures/Comp.svelte',
    isEnabled: true,
  },
  {
    mode: MODE_RUNES,
    component: './fixtures/CompRunes.svelte',
    isEnabled: IS_SVELTE_5,
  },
].filter(({ isEnabled }) => isEnabled)

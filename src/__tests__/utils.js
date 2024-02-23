import { VERSION as SVELTE_VERSION } from 'svelte/compiler'

export const IS_JSDOM = window.navigator.userAgent.includes('jsdom')

export const IS_HAPPYDOM = !IS_JSDOM // right now it's happy or js

export const IS_SVELTE_5 = SVELTE_VERSION >= '5'

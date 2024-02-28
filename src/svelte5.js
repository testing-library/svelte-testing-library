import { createClassComponent } from 'svelte/legacy'
import {
  componentCache,
  cleanup,
  buildCheckProps,
  buildRender,
} from './pure.js'

const svelteComponentOptions = [
  'target',
  'props',
  'events',
  'context',
  'intro',
  'recover',
]

const checkProps = buildCheckProps(svelteComponentOptions)

const buildRenderComponent =
  ({ target, ComponentConstructor }) =>
  (options) => {
    options = checkProps(options)

    const component = createClassComponent({
      component: ComponentConstructor,
      ...options,
    })

    componentCache.add(component)

    return component
  }

const render = buildRender(buildRenderComponent)

/* eslint-disable import/export */

import { act, fireEvent } from './pure.js'

export { render, cleanup, fireEvent, act }

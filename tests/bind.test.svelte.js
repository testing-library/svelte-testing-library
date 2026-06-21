import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import { IS_SVELTE_5 } from './_env.js'
import Subject from './fixtures/Binder.svelte'

describe.runIf(IS_SVELTE_5)('binds', () => {
  test('binding via getter/setter', async () => {
    const user = userEvent.setup()
    let value = false
    const props = {
      get value() {
        return value
      },
      set value(nextValue) {
        value = nextValue
      },
    }

    render(Subject, props)

    const input = screen.getByRole('checkbox')
    await user.click(input)

    expect(value).toBe(true)
  })

  test('binding via getter/setter does not double-trigger effects', async () => {
    const user = userEvent.setup()
    const onEffectRun = vi.fn()
    let value = false
    const props = {
      onEffectRun,
      get value() {
        return value
      },
      set value(nextValue) {
        value = nextValue
      },
    }

    render(Subject, props)
    expect(onEffectRun).toHaveBeenCalledTimes(1)

    const input = screen.getByRole('checkbox')
    await user.click(input)

    expect(onEffectRun).toHaveBeenCalledTimes(2)
  })

  test('binding via $state', async () => {
    const user = userEvent.setup()
    const props = $state({ value: false })

    render(Subject, props)

    const input = screen.getByRole('checkbox')
    await user.click(input)

    expect(props.value).toBe(true)
  })

  test('binding via $state does not double-trigger effects', async () => {
    const user = userEvent.setup()
    const onEffectRun = vi.fn()
    const props = $state({ value: false, onEffectRun })

    render(Subject, props)
    expect(onEffectRun).toHaveBeenCalledTimes(1)

    const input = screen.getByRole('checkbox')
    await user.click(input)

    expect(onEffectRun).toHaveBeenCalledTimes(2)
  })
})

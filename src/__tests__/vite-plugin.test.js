import { beforeEach, deepClone, describe, expect, test, vi } from 'vitest'

import { svelteTesting } from '../vite.js'
import { IS_JEST } from './utils.js'

describe.skipIf(IS_JEST)('vite plugin', () => {
  beforeEach(() => {
    vi.stubEnv('VITEST', '1')
  })

  test('does not modify config if disabled', () => {
    const subject = svelteTesting({
      resolveBrowser: false,
      autoCleanup: false,
      noExternal: false,
    })

    const config = {}
    subject.config(config)

    expect(config).toEqual({})
  })

  test('does not modify config if not Vitest', () => {
    vi.stubEnv('VITEST', '')

    const subject = svelteTesting()
    const config = {}

    subject.config(config)

    expect(config).toEqual({})
  })

  test.each([
    {
      config: { resolve: { conditions: ['node'] } },
      expectedConditions: ['browser', 'node'],
    },
    {
      config: { resolve: { conditions: ['svelte', 'node'] } },
      expectedConditions: ['svelte', 'browser', 'node'],
    },
  ])(
    'adds browser condition if necessary',
    ({ config, expectedConditions }) => {
      const subject = svelteTesting()
      const viteConfig = deepClone(config)

      subject.config(viteConfig)

      expect(viteConfig).toMatchObject({
        resolve: {
          conditions: expectedConditions,
        },
      })
    }
  )

  test.each([
    {
      config: {},
      expectedConditions: [],
    },
    {
      config: { resolve: { conditions: [] } },
      expectedConditions: [],
    },
    {
      config: { resolve: { conditions: ['svelte'] } },
      expectedConditions: ['svelte'],
    },
  ])(
    'skips browser condition if possible',
    ({ config, expectedConditions }) => {
      const subject = svelteTesting()
      const viteConfig = deepClone(config)

      subject.config(viteConfig)

      expect(viteConfig).toMatchObject({
        resolve: {
          conditions: expectedConditions,
        },
      })
    }
  )

  test.each([
    {
      config: {},
      expectedSetupFiles: [expect.stringMatching(/src\/vitest.js$/u)],
    },
    {
      config: { test: { setupFiles: [] } },
      expectedSetupFiles: [expect.stringMatching(/src\/vitest.js$/u)],
    },
    {
      config: { test: { setupFiles: 'other-file.js' } },
      expectedSetupFiles: [
        'other-file.js',
        expect.stringMatching(/src\/vitest.js$/u),
      ],
    },
  ])('adds cleanup', ({ config, expectedSetupFiles }) => {
    const subject = svelteTesting()
    const viteConfig = deepClone(config)

    subject.config(viteConfig)

    expect(viteConfig).toMatchObject({
      test: {
        setupFiles: expectedSetupFiles,
      },
    })
  })

  test.each([
    {
      config: { ssr: { noExternal: [] } },
      expectedNoExternal: ['@testing-library/svelte'],
    },
    {
      config: {},
      expectedNoExternal: ['@testing-library/svelte'],
    },
    {
      config: { ssr: { noExternal: 'other-file.js' } },
      expectedNoExternal: ['other-file.js', '@testing-library/svelte'],
    },
    {
      config: { ssr: { noExternal: /other/u } },
      expectedNoExternal: [/other/u, '@testing-library/svelte'],
    },
  ])('adds noExternal rule', ({ config, expectedNoExternal }) => {
    const subject = svelteTesting()
    const viteConfig = deepClone(config)

    subject.config(viteConfig)

    expect(viteConfig).toMatchObject({
      ssr: {
        noExternal: expectedNoExternal,
      },
    })
  })

  test.each([
    {
      config: { ssr: { noExternal: true } },
      expectedNoExternal: true,
    },
    {
      config: { ssr: { noExternal: '@testing-library/svelte' } },
      expectedNoExternal: '@testing-library/svelte',
    },
    {
      config: { ssr: { noExternal: /svelte/u } },
      expectedNoExternal: /svelte/u,
    },
  ])('skips noExternal if able', ({ config, expectedNoExternal }) => {
    const subject = svelteTesting()
    const viteConfig = deepClone(config)

    subject.config(viteConfig)

    expect(viteConfig).toMatchObject({
      ssr: {
        noExternal: expectedNoExternal,
      },
    })
  })

  test('bails on noExternal if input is unexpected', () => {
    const subject = svelteTesting()
    const viteConfig = deepClone({ ssr: { noExternal: false } })

    subject.config(viteConfig)

    expect(viteConfig).toMatchObject({
      ssr: {
        noExternal: false,
      },
    })
  })
})

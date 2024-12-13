const runner = {
  afterAll: () => {},
  afterEach: () => {},
  beforeAll: () => {},
  beforeEach: () => {},
  describe: () => {},
  expect: () => {},
  test: () => {},
  vi: {},
}

const createRunnerProxy = (name) => {
  const target = runner[name]
  const handler = {
    apply(_target, _thisArg, args) {
      return runner[name](...args)
    },
    get(_target, prop) {
      return runner[name][prop]
    },
  }

  return new Proxy(target, handler)
}

const afterAll = createRunnerProxy('afterAll')
const afterEach = createRunnerProxy('afterEach')
const beforeAll = createRunnerProxy('beforeAll')
const beforeEach = createRunnerProxy('beforeEach')
const describe = createRunnerProxy('describe')
const expect = createRunnerProxy('expect')
const test = createRunnerProxy('test')
const vi = createRunnerProxy('vi')

const initializeRunner = (runnerConfig) => {
  Object.assign(runner, runnerConfig)
}

export {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  initializeRunner,
  test,
  vi,
}

import {
  render,
  fireEvent,
  wait,
  waitForElement,
  cleanup,
  prettyDOM,
} from '../src'
import App from './example/App.svelte'
import 'jest-dom/extend-expect'

afterEach(cleanup)
describe('render', () => {
  test('getByText', () => {
    const {getByText} = render(App, {props: {name: 'world'}})

    expect(getByText('Hello world!')).toBeInTheDocument()
  })

  test('click button', async () => {
    const {getByText} = render(App, {props: {name: 'world'}})

    fireEvent.click(getByText('Button Text'))

    const button = await waitForElement(() => getByText('Button Clicked'))

    expect(button).toBeInTheDocument()
  })

  test('programmatically change props', async () => {
    const {component, getByText} = render(App, {props: {name: 'world'}})

    expect(getByText('Hello world!')).toBeInTheDocument()

    component.$set({name: 'foo'})

    await wait(() => expect(getByText('Hello foo!')).toBeInTheDocument())
  })

  test('debug', () => {
    global.console = {log: jest.fn()}

    const {debug} = render(App)

    debug()

    expect(global.console.log).toHaveBeenCalledWith(prettyDOM(document.body))
  })
})

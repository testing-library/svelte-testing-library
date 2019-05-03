import {render, fireEvent, wait, waitForElement, cleanup} from '../src'
import App from './example/App.svelte'
import 'jest-dom/extend-expect'

afterEach(cleanup)
describe('queries', () => {
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
})

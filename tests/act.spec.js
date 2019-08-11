import {act, render, fireEvent, cleanup} from '../src'
import App from './example/App.svelte'
import 'jest-dom/extend-expect'

afterEach(cleanup)

test('after awaited state updates are flushed', async () => {
  const {getByText} = render(App, {props: {name: 'world'}})
  const button = getByText('Button Text')

  const acting = act(() => {
    fireEvent.click(button)
  })
  expect(button).toHaveTextContent('Button Text')

  await acting
  expect(button).toHaveTextContent('Button Clicked')
})

test('accepts async functions', async () => {
  function sleep(ms) {
    return new Promise(resolve => {
      setTimeout(() => resolve(), ms)
    })
  }

  const {getByText} = render(App, {props: {name: 'world'}})
  const button = getByText('Button Text')

  await act(async () => {
    await sleep(100)
    fireEvent.click(button)
  })
  expect(button).toHaveTextContent('Button Clicked')
})

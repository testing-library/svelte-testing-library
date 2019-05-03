### svelte-testing-library

**_WIP_**

## Installation

`npm i -D svlt-testing-library`

## Usage

App.svelte

```html
<script>
  export let name
</script>

<style>
  h1 {
    color: purple;
  }
</style>

<h1>Hello {name}!</h1>
```

App.spec.js

```javascript
import App from '../src/App.svelte'
import {render} from '../src'
describe('App', () => {
  test('should render greeting', () => {
    const {getByText} = render(App, {props: {name: 'world'}})

    expect(getByText('Hello world!'))
  })

  test('should change button text after click', async () => {
    const {getByText} = render(App, {props: {name: 'world'}})

    fireEvent.click(getByText('Button Text'))

    const button = await waitForElement(() => getByText('Button Clicked'))

    expect(button).toBeInTheDocument()
  })
})
```

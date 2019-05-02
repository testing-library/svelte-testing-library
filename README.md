### svelte-testing-library

**_WIP_**

## Installation

`npm i -D svelte-testing-library`

## Usage

App.svelte

```html
<script>
  export let name;
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
import App from "../src/App.svelte";
import { render } from "../src";
describe("App", () => {
  test("should render", () => {
    const { getByText } = render(App, { name: "world" });

    expect(getByText("Hello world!"));
  });
});
```

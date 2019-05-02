// const App = require("../src/App.svelte");
// const { render } = require("../src");
import App from "../src/App.svelte";
import { render } from "../src";
describe("App", () => {
  test("should render", () => {
    const { getByText } = render(App, { name: "world" });

    expect(getByText("Hello world!"));
  });
});

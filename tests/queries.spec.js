import App from "../src/example/App.svelte";
import { render } from "../src";
describe("App", () => {
  test("should render", () => {
    const { getByText } = render(App, { name: "world" });

    expect(getByText("Hello world!"));
  });
});

import App from "./example/App.svelte";
import { render, fireEvent, waitForElement, cleanup } from "../src";

afterEach(cleanup);
describe("queries", () => {
  test("getByText", () => {
    const { getByText } = render(App, { name: "world" });

    expect(getByText("Hello world!"));
  });

  test("click button", async () => {
    const { getByText } = render(App, { name: "world" });

    fireEvent.click(getByText("Button Text"));

    const button = await waitForElement(() => getByText("Button Clicked"));

    expect(button);
  });
});

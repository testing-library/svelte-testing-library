import { getQueriesForElement } from "dom-testing-library";

export * from "dom-testing-library";
let mountedContainers = new Set();
export const render = (Component, props) => {
  const container = document.body.appendChild(document.createElement("div"));

  let rendered = new Component({
    target: container,
    props
  });

  mountedContainers.add(rendered);
  return {
    ...getQueriesForElement(document.body)
  };
};
export const cleanup = () => {
  mountedContainers.forEach(cleanupAtContainer);
};

const cleanupAtContainer = container => {
  container.$destroy();
  mountedContainers.delete(container);
};

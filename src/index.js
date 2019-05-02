import { getQueriesForElement } from "dom-testing-library";

export const render = (Component, props) => {
  const rendered = new Component({
    target: document.body,
    props
  });

  return {
    ...getQueriesForElement(document.body)
  };
};

<div align="center">
<h1>svelte-testing-library</h1>

<a href="https://www.emojione.com/emoji/1f410">
  <img
    height="80"
    width="80"
    alt="chipmunk"
    src="https://raw.githubusercontent.com/testing-library/svelte-testing-library/master/other/chipmunk.png"
  />
</a>

<p>Simple and complete Svelte testing utilities that encourage good testing
practices.</p>

<br />

[**Read The Docs**](https://testing-library.com/svelte) |
[Edit the docs](https://github.com/alexkrolick/testing-library-docs)

<br />
</div>

<hr />

<!-- prettier-ignore-start -->
[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![version][version-badge]][package] [![downloads][downloads-badge]][npmtrends]
[![MIT License][license-badge]][license]

[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs] [![Code of Conduct][coc-badge]][coc]
[![Join the community on Spectrum][spectrum-badge]][spectrum]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

<!-- prettier-ignore-end -->

<div align="center">
  <a href="https://testingjavascript.com">
    <img
      width="500"
      alt="TestingJavaScript.com Learn the smart, efficient way to test any JavaScript application."
      src="https://raw.githubusercontent.com/testing-library/react-testing-library/master/other/testingjavascript.jpg"
    />
  </a>
</div>

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [The problem](#the-problem)
- [This solution](#this-solution)
- [Example](#example)
- [Installation](#installation)
- [Examples](#examples)
- [Other Solutions](#other-solutions)
- [Guiding Principles](#guiding-principles)
- [Contributors](#contributors)
- [Docs](#docs)
- [Issues](#issues)
  - [🐛 Bugs](#-bugs)
  - [💡 Feature Requests](#-feature-requests)
  - [❓ Questions](#-questions)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## The problem

You want to write maintainable tests for your Svelte components. As a part of
this goal, you want your tests to avoid including implementation details of your
components and rather focus on making your tests give you the confidence for
which they are intended. As part of this, you want your testbase to be
maintainable in the long run so refactors of your components (changes to
implementation but not functionality) don't break your tests and slow you and
your team down.

## This solution

The `svelte-testing-library` is a very lightweight solution for testing Svelte
components. It provides light utility functions on top of `svelte` and
`dom-testing-library`, in a way that encourages better testing practices. Its
primary guiding principle is:

> [The more your tests resemble the way your software is used, the more
> confidence they can give you.][guiding-principle]

## Example

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
import {render} from 'svlt-testing-library'
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

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```
npm install --save-dev svlt-testing-library
```

This library has `peerDependencies` listings for `svelte`.

You may also be interested in installing `jest-dom` so you can use
[the custom jest matchers](https://github.com/gnapse/jest-dom#readme).

> [**Docs**](https://testing-library.com/docs/svelte-testing-library/intro)

## Examples

> We're in the process of moving examples to the
> [docs site](https://testing-library.com/docs/example-codesandbox)

You can also find svelte-testing-library examples at
[react-testing-examples.com](https://react-testing-examples.com/jest-rtl/).

## Other Solutions

There's currently a package published in npm called `svelte-testing-library` but
the git repository is not yet public. We are hoping to pull that work (and name)
into this repository.

## Guiding Principles

> [The more your tests resemble the way your software is used, the more
> confidence they can give you.][guiding-principle]

We try to only expose methods and utilities that encourage you to write tests
that closely resemble how your svelte components are used.

Utilities are included in this project based on the following guiding
principles:

1.  If it relates to rendering components, it deals with DOM nodes rather than
    component instances, nor should it encourage dealing with component
    instances.
2.  It should be generally useful for testing individual Svelte components or
    full Svelte applications.
3.  Utility implementations and APIs should be simple and flexible.

At the end of the day, what we want is for this library to be pretty
light-weight, simple, and understandable.

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="https://github.com/benmonro"><img src="https://avatars3.githubusercontent.com/u/399236?v=4" width="100px;" alt="Ben Monro"/><br /><sub><b>Ben Monro</b></sub></a><br /><a href="https://github.com/testing-library/svelte-testing-library/commits?author=benmonro" title="Code">💻</a> <a href="https://github.com/testing-library/svelte-testing-library/commits?author=benmonro" title="Tests">⚠️</a> <a href="#ideas-benmonro" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/testing-library/svelte-testing-library/commits?author=benmonro" title="Documentation">📖</a></td><td align="center"><a href="https://twitter.com/EmilTholin"><img src="https://avatars0.githubusercontent.com/u/11573167?v=4" width="100px;" alt="Emil Tholin"/><br /><sub><b>Emil Tholin</b></sub></a><br /><a href="https://github.com/testing-library/svelte-testing-library/commits?author=EmilTholin" title="Code">💻</a> <a href="https://github.com/testing-library/svelte-testing-library/commits?author=EmilTholin" title="Tests">⚠️</a> <a href="#ideas-EmilTholin" title="Ideas, Planning, & Feedback">🤔</a></td><td align="center"><a href="http://timdeschryver.dev"><img src="https://avatars1.githubusercontent.com/u/28659384?v=4" width="100px;" alt="Tim Deschryver"/><br /><sub><b>Tim Deschryver</b></sub></a><br /><a href="https://github.com/testing-library/svelte-testing-library/commits?author=timdeschryver" title="Documentation">📖</a></td><td align="center"><a href="https://medium.com/@oieduardorabelo"><img src="https://avatars1.githubusercontent.com/u/829902?v=4" width="100px;" alt="Eduardo Rabelo"/><br /><sub><b>Eduardo Rabelo</b></sub></a><br /><a href="https://github.com/testing-library/svelte-testing-library/commits?author=oieduardorabelo" title="Tests">⚠️</a> <a href="https://github.com/testing-library/svelte-testing-library/commits?author=oieduardorabelo" title="Code">💻</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## Docs

[**Read The Docs**](https://testing-library.com/svelte) |
[Edit the docs](https://github.com/alexkrolick/testing-library-docs)

## Issues

_Looking to contribute? Look for the [Good First Issue][good-first-issue]
label._

### 🐛 Bugs

Please file an issue for bugs, missing documentation, or unexpected behavior.

[**See Bugs**][bugs]

### 💡 Feature Requests

Please file an issue to suggest new features. Vote on feature requests by adding
a 👍. This helps maintainers prioritize what to work on.

[**See Feature Requests**][requests]

### ❓ Questions

For questions related to using the library, please visit a support community
instead of filing an issue on GitHub.

- [Spectrum][spectrum]
- [Stack Overflow][stackoverflow]

## LICENSE

MIT

<!--
Links:
-->

<!-- prettier-ignore-start -->

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/testing-library/svelte-testing-library.svg?style=flat-square
[build]: https://travis-ci.org/testing-library/svelte-testing-library
[coverage-badge]: https://img.shields.io/codecov/c/github/testing-library/svelte-testing-library.svg?style=flat-square
[coverage]: https://codecov.io/github/testing-library/svelte-testing-library
[version-badge]: https://img.shields.io/npm/v/svlt-testing-library.svg?style=flat-square
[package]: https://www.npmjs.com/package/svelte-testing-library
[downloads-badge]: https://img.shields.io/npm/dm/svelte-testing-library.svg?style=flat-square
[npmtrends]: http://www.npmtrends.com/svelte-testing-library
[spectrum-badge]: https://withspectrum.github.io/badge/badge.svg
[spectrum]: https://spectrum.chat/testing-library
[license-badge]: https://img.shields.io/npm/l/svelte-testing-library.svg?style=flat-square
[license]: https://github.com/testing-library/svelte-testing-library/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/testing-library/svelte-testing-library/blob/master/CODE_OF_CONDUCT.md
[github-watch-badge]: https://img.shields.io/github/watchers/testing-library/svelte-testing-library.svg?style=social
[github-watch]: https://github.com/testing-library/svelte-testing-library/watchers
[github-star-badge]: https://img.shields.io/github/stars/testing-library/svelte-testing-library.svg?style=social
[github-star]: https://github.com/testing-library/svelte-testing-library/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20svelte-testing-library%20by%20%40@TestingLib%20https%3A%2F%2Fgithub.com%2Ftesting-library%2Fsvelte-testing-library%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/testing-library/svelte-testing-library.svg?style=social
[emojis]: https://github.com/all-contributors/all-contributors#emoji-key
[all-contributors]: https://github.com/all-contributors/all-contributors
[set-immediate]: https://developer.mozilla.org/en-US/docs/Web/API/Window/setImmediate
[guiding-principle]: https://twitter.com/kentcdodds/status/977018512689455106
[bugs]: https://github.com/testing-library/svelte-testing-library/issues?q=is%3Aissue+is%3Aopen+label%3Abug+sort%3Acreated-desc
[requests]: https://github.com/testing-library/svelte-testing-library/issues?q=is%3Aissue+sort%3Areactions-%2B1-desc+label%3Aenhancement+is%3Aopen
[good-first-issue]: https://github.com/testing-library/svelte-testing-library/issues?utf8=✓&q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc+label%3A"good+first+issue"+
[stackoverflow]: https://stackoverflow.com/questions/tagged/svelte-testing-library

<!-- prettier-ignore-end -->

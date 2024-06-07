# Contributing guide

## Pull requests

- Consider opening an issue before submitting a pull-request to avoid unnecessary work
- Ensure pull request titles adhere to the [Conventional Commits][] specification

[conventional commits]: https://www.conventionalcommits.org/

## Release

The module is released automatically from the `main` and `next` branches using [semantic-release][]. Version bumps and change logs are generated from the commit messages.

[semantic-release]: https://github.com/semantic-release/semantic-release

### Preview release

If you would like to preview the release from a given branch, and...

- You have push access to the repository
- The branch exists in GitHub

...you can preview the next release using:

```shell
npm run release:preview
```

## Development setup

After cloning the repository, install the project's dependencies and run the `validate` script to run all checks and tests to verify your setup.

```shell
npm install # or `pnpm install`, or `yarn install`, etc.
npm run validate
```

### Lint and format

Run auto-formatting to ensure any changes adhere to the code style of the repository:

```shell
npm run format:delta
```

To run lint and format checks without making any changes:

```shell
npm run lint:delta
```

### Test

Run unit tests once or in watch mode:

```shell
npm test
npm run test:watch
```

### Docs

Use the `toc` script to ensure the README's table of contents is up to date:

```shell
npm run toc
```

Use `contributors:add` to add a contributor to the README:

```shell
npm run contributors:add
```

Use `contributors:generate` to ensure the README's contributor list is up to date:

```shell
npm run contributors:generate
```

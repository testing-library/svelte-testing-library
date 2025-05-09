# Contributing guide

## Pull requests

- Consider opening an issue before submitting a pull-request to avoid unnecessary work
- Ensure pull request titles adhere to the [Conventional Commits][] specification

[conventional commits]: https://www.conventionalcommits.org/

## Release

The module is released automatically from the `main` and `next` branches using [semantic-release-action][]. Version bumps and change logs are generated from the commit messages.

[semantic-release-action]: https://github.com/cycjimmy/semantic-release-action

### Preview release

If you would like to preview the release from a given branch, and...

- You have push access to the repository
- The branch exists in GitHub

...you can preview the next release version and changelog using:

```shell
npm run preview-release
```

## Development setup

After cloning the repository, use the `setup` script to install dependencies and run all checks:

```shell
npm run setup
```

### Lint and format

Run auto-formatting to ensure any changes adhere to the code style of the repository:

```shell
npm run format
```

To run lint and format checks without making any changes:

```shell
npm run lint
```

### Test

Run unit tests once or in watch mode:

```shell
npm test
npm run test:watch
```

### Using different versions of Svelte

Use the provided script to set up your environment for different versions of Svelte:

```shell
# Svelte 5
npm run install:5
npm run all

# Svelte 4
npm run install:4
npm run all:legacy

# Svelte 3
npm run install:3
npm run all:legacy
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

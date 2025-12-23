# Contributing guide

## Pull requests

- Consider opening an issue before submitting a pull-request to avoid unnecessary work
- Ensure pull request titles adhere to the [Conventional Commits][] specification

[conventional commits]: https://www.conventionalcommits.org/

## Release

The module is released automatically from the `main` and `next` branches using [multi-semantic-release][]. Version bumps and change logs are generated from the commit messages.

[multi-semantic-release]: https://github.com/anolilab/semantic-release/tree/main/packages/multi-semantic-release

## Development setup

This repository uses `pnpm` as its package manager. See the `pnpm` [installation guide](https://pnpm.io/installation) to set it up through whatever method you prefer.

After cloning the repository, use the `setup` script to install dependencies, build, and run all checks:

```shell
pnpm run setup
```

### Build

To build types and docs:

```shell
pnpm run build
```

### Lint and format

Run auto-formatting to ensure any changes adhere to the code style of the repository:

```shell
pnpm run format
```

To run lint and format checks without making any changes:

```shell
pnpm run lint
```

### Test

Run unit tests once or in watch mode:

```shell
pnpm test
pnpm run test:watch
```

### Using different versions of Svelte

Use the provided script to set up your environment for different versions of Svelte:

```shell
# Svelte 5
pnpm run install:5
pnpm run all

# Svelte 4
pnpm run install:4
pnpm run all:legacy

# Svelte 3
pnpm run install:3
pnpm run all:legacy
```

### Contributors

Use `contributors:add` to add a contributor to the README:

```shell
pnpm run contributors:add
```

Use `contributors:generate` to ensure the README's contributor list is up to date:

```shell
pnpm run contributors:generate
```

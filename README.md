# pi-extensions

Reusable extensions for [Pi](https://pi.dev). Requires Pi 1.5.2 APIs; currently
regression-tested with Pi 1.6.0.

## Install

Install each extension on its own from npm; the commands are in the table
below. Each one is listed separately in the [Pi package gallery](https://pi.dev/packages).

To install every extension in this repository at once, from GitHub (tracks `main`):

```sh
pi install git:github.com/tboon0/pi-extensions
```

Or from a local clone:

```sh
pi install /absolute/path/to/pi-extensions
```

Run `/reload` in existing sessions. Pi loads the source directly, so no build or
runtime dependency installation is needed. Don't install both an individual
package and the whole repository, or commands will be registered twice.

## Extensions

| Extension | Install | Description |
|---|---|---|
| [`/btw`](extensions/btw/README.md) | `pi install npm:@tboon0/pi-btw` | Ask a tool-free side question about the conversation without changing the main task or its context. |

Each extension lives in `extensions/<name>/` as its own npm package, with its
entry point (`index.ts`), `package.json`, README, LICENSE, and tests. The
repository root is a private package that loads every `extensions/*/index.ts`
for whole-repository installs.

## Development

Run the regression checks against an installed Pi package:

```sh
npm test -- /absolute/path/to/node_modules/@earendil-works/pi-coding-agent
```

## Releases

Each extension is versioned and released on its own:

1. Bump `version` in `extensions/<name>/package.json`.
2. Run the regression checks and manually verify a live provider response and
   the TUI presentation.
3. Tag the commit `<name>-vX.Y.Z`, push the tag, and create a GitHub release.
4. Run `npm publish` from `extensions/<name>/`.

Personal settings and credentials belong outside this repository.

## License

MIT — see [LICENSE](LICENSE).

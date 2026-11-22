# pi-extensions

Reusable extensions for [Pi](https://pi.dev). Requires Pi 1.5.2 APIs; currently
regression-tested with Pi 1.6.0.

## Install from GitHub

This repository is public; anyone can install it.

```sh
pi install git:github.com/tboon0/pi-extensions@v0.1.0
```

## Install locally

```sh
pi install /absolute/path/to/pi-extensions
```

Run `/reload` in existing sessions. Pi loads the source directly, so no build or
runtime dependency installation is needed.

## Extensions

| Extension | Description |
|---|---|
| [`/btw`](extensions/btw/README.md) | Ask a tool-free side question about the conversation without changing the main task or its context. |

Each extension lives in `extensions/<name>/` with its entry point (`index.ts`),
README, and tests. Pi loads every `extensions/*/index.ts`.

## Development

Run the regression checks against an installed Pi package:

```sh
npm test -- /absolute/path/to/node_modules/@earendil-works/pi-coding-agent
```

## Releases

Distributed through versioned Git tags on GitHub, not npm.
`private: true` in `package.json` prevents accidental npm publication.
Before each release, run the regression checks and manually verify a live provider
response and the TUI presentation. Personal settings and credentials belong outside
this repository.

## License

MIT — see [LICENSE](LICENSE).

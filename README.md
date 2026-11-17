# pi-extensions

Reusable extensions for [Pi](https://pi.dev). Requires Pi 1.5.2 APIs; currently
verified with Pi 1.5.2. This package is local and unpublished.

## Install locally

```sh
pi install /absolute/path/to/pi-extensions
```

Run `/reload` in existing sessions. Pi loads the source directly, so no build or
runtime dependency installation is needed. Remove any standalone installation of
`btw.ts` first to avoid duplicate commands.

## `/btw` — side questions

```text
/btw Why did we choose this approach?
/btw --cancel
```

- Uses the currently selected model through Pi's configured provider and auth.
- Runs independently without aborting or steering the main task.
- Has no tools and cannot inspect files or make changes.
- Uses a bounded text snapshot of the active conversation, including compaction
  summaries and tool results. Older text may be omitted; images are not included.
- Saves answers as display-only entries in the session file. They appear in the
  transcript but are excluded from future model context. They are not ephemeral
  or private from anyone with access to that session file.
- Each question is independent; earlier side answers are not included.
- Allows one side request at a time, with a two-minute timeout. `--cancel` cancels
  only that request. Session shutdown or tree navigation cancels it too.
- Supports TUI and RPC mode, not print mode. Extra provider calls are billed but
  are not included in Pi's session cost totals.

## Development

Run regression checks against an installed Pi package:

```sh
npm test -- /absolute/path/to/node_modules/@earendil-works/pi-coding-agent
```

The tests use Pi's native extension loader and mock model responses. They cover
context isolation, non-blocking requests, cancellation, shutdown, and errors.
Live provider responses and visual TUI rendering still need manual verification.

## Publishing checklist

Before distributing this package:

1. Choose a license and add `LICENSE` (currently `UNLICENSED`).
2. Create a remote repository and add its URL to the package metadata.
3. Verify a live provider response and the TUI presentation.
4. Publish a Git tag for reproducible Pi installations.
5. For npm, choose an available package name or scope and remove `private: true`.

Pi supports Git packages, so npm publication is optional. Personal settings and
credentials belong outside this repository.

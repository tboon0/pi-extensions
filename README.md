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
- Shows a spinner above the editor while the answer is pending, then pins the
  answer there (up to 15 lines) so main-agent output can't scroll it away. Press
  Esc with an empty editor while the agent is idle to dismiss it; while the agent
  runs, Esc still interrupts it as usual. A new `/btw` replaces the pinned answer.
- Runs one side question at a time, with a two-minute timeout. A second `/btw`
  is rejected until the first finishes; `/btw --cancel` stops the running one so
  you can ask again. It never touches the main task. Session shutdown or tree
  navigation also cancels it.
- Supports TUI and RPC mode, not print mode. Extra provider calls are billed but
  are not included in Pi's session cost totals.

## Development

Run regression checks against an installed Pi package:

```sh
npm test -- /absolute/path/to/node_modules/@earendil-works/pi-coding-agent
```

The tests use Pi's native extension loader and mock model responses. They cover
context isolation, non-blocking requests, the loading widget, the pinned answer, cancellation, shutdown, and errors.
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

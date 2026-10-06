# Proposal

## Why

The workshop "Context engineering voor front-end developers" (see `presentatie.md`, `opdrachten.md`) needs a practice repo in which an AI agent *without* project context reliably makes mistakes, and *with* a good `AGENTS.md`, rules and enforcement visibly improves. The requirements are captured in `repo-requirements.md`; this change turns them into a spec-driven plan so the repo can be generated and verified consistently.

## What Changes

- New practice app **Rockstars IT Clicker**: a light idle/cookie-clicker in which players earn *Lines of Code* and buy people, tools, culture and infra upgrades (React 19 + Vite front-end, small Express API, npm workspaces).
- A deliberately **"mid-migration" codebase**: `features/shop/` is legacy (the workshop task lands there), `features/profile/` is the reference implementation; the rest (`clicker/`, `ui/`, `lib/`, `api/`) is clean.
- **Eight planted conventions**, each with a good example and a lure, so that an agent without context fails on several of them (tokens, data via `api/`, `ui/` components, no new dependencies, i18n, test style, feature folders, a11y).
- Workshop **starter files**: `TASK.md`, `TASK-BONUS.md` (leaderboard), `SCORECARD.template.md`, `CONTRIBUTING.md` (prose conventions), `README.md` (with an outdated styling section). No agent instruction files.
- **Tooling**: ESLint, Stylelint, Prettier, Vitest and CI configured *without* the restrictive rules participants will add. No git-hook tooling: participants install and configure `lefthook` themselves.
- **Checkpoint solutions** (`stap-1-agents-md`, `stap-2-rules`, `stap-3-enforce`) that participants can switch to, plus an export step that produces a standalone git repo with those branches.
- **Calibration** procedure and acceptance criteria to verify the baseline lands at ~2–4/8 correct and the rules checkpoint at ≥6/8.

## Capabilities

### New Capabilities
- `it-clicker/game`: core idle-clicker gameplay: commit button, passive income, pricing, game loop, autosave/load, header stats and language switch.
- `it-clicker/shop`: the (legacy) upgrade shop: listing upgrades by category, affordability, buying.
- `it-clicker/profile`: the reference profile feature: company name, avatar, language, player stats.
- `it-clicker/api`: the Node API: upgrades, savegame, wishlist and profile endpoints, validation and error format.
- `it-clicker/workshop-setup`: the workshop-specific properties of the repo: planted conventions and lures, legacy vs reference code, starter files, tooling state, absence of agent instructions, calibration and acceptance.
- `it-clicker/checkpoints`: the three cumulative checkpoint solutions and the export to a standalone repo with checkpoint branches.

### Modified Capabilities
<!-- none: no existing specs in this project -->

## Impact

- New directory `rockstars-it-clicker/` in this workshop repo (source of the practice repo), plus `checkpoints/` overlays and an export script; no changes to `presentatie.md` / `opdrachten.md` beyond what already references `repo-requirements.md`.
- New dependencies inside the practice repo only (React, Vite, react-i18next, Express, Zod, Vitest, Testing Library, ESLint, Stylelint, Prettier, concurrently, tsx; `lefthook` only on the `stap-3-enforce` checkpoint).
- The exported standalone repo `rockstars-it-clicker` becomes the artifact distributed to participants before the workshop.
- `repo-requirements.md` remains the human-readable source; these specs are the verifiable contract. Conflicts are resolved in favour of the specs once approved.

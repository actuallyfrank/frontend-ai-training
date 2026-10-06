# Design

## Context

- This workshop repo (`ai-training-team-rockstars`) holds the workshop materials (`presentatie.md`, `opdrachten.md`, `repo-requirements.md`) and OpenSpec planning. It already contains agent tooling (`.claude/`, `.agents/`, `.github/`, `openspec/`).
- The practice repo does not exist yet (greenfield). It must end up as a **standalone** git repo that participants clone, with checkpoint **branches**.
- Edits for this change are scoped to this repo, so the practice repo is authored here and exported.
- Functional and workshop requirements: see `specs/it-clicker/*` and `repo-requirements.md`.

## Goals / Non-Goals

**Goals:**
- Author the practice repo and its checkpoint solutions in a reviewable form inside this repo.
- Produce the standalone repo (with branches) with one repeatable command.
- Keep the code small enough that participants understand it within ~10 minutes (~30 source files in `web/`).
- Make the "good" and "legacy" code clearly distinguishable *to a human*, but not explained to an agent.

**Non-Goals:**
- Hosting/publishing the exported repo (trainer pushes it manually).
- Implementing `TASK.md` or `TASK-BONUS.md` (participants do that).
- Production concerns (auth, persistence beyond memory, deployment, performance tuning).

## Decisions

### D1: Source layout – practice repo as a subdirectory plus checkpoint overlays
```
rockstars-it-clicker/            # exactly the files of `main` in the exported repo
checkpoints/
  stap-1-agents-md/              # only files added/changed by checkpoint 1
  stap-2-rules/                  # only files added/changed by checkpoint 2 (relative to 1)
  stap-3-enforce/                # only files added/changed by checkpoint 3 (relative to 2)
scripts/export-practice-repo.sh  # builds the standalone repo
```
The export copies `rockstars-it-clicker/` into a target dir, runs `git init`, commits `main`, then for each checkpoint creates a branch from the previous one, copies the overlay on top and commits.
*Alternatives:* a nested git repo in the subdirectory (confusing inside the parent repo, branches not reviewable in PRs); a separate repo from the start (outside the allowed edit scope, and checkpoint diffs harder to review together with the materials). Overlays keep every checkpoint diff visible as plain files.

### D2: Overlays only add or replace files
Checkpoints never need deletions (they add docs, rules and config, and replace `eslint.config.js`, `.stylelintrc.json`, `AGENTS.md`). The export therefore only copies; full-file replacement keeps it simple. If a deletion is ever needed, the script supports a `.delete` list per overlay.

### D3: Front-end architecture
- **Game state** in a React context provider with a `useGame()` hook in `web/src/lib/game/`; pure functions for pricing and LoC/s with unit tests; a 100 ms interval loop. The provider owns load/autosave via `useSaveGame`.
- **Data access** through `web/src/api/client.ts` (fetch wrapper, base `/api`, `ApiError` mapping) and small hand-written hooks returning `{ data, error, isLoading, ... }`. No data-fetching library, so agents are not nudged towards adding one.
- **Styling** with plain CSS files per component and CSS custom properties in `tokens.css`. No CSS framework, so tokens are the only "right" way and hex values stand out.
- **i18n** with react-i18next, resources bundled (`en.json`, `nl.json`), upgrade names/flavours keyed by upgrade id.
- **Routing** with React Router: `/` (Game), `/shop`, `/profile`.
*Alternative:* TanStack Query / Zustand. Rejected, because it adds concepts participants must learn and makes the "use the existing hook" convention less visible.

### D4: API architecture
Express + Zod, `routes/` (thin) → `services/` (logic) → in-memory store seeded from `data/seed.json`. A shared error middleware produces `{ error: { code, message } }`. One route (`routes/upgrades.ts`) is intentionally "legacy" (logic inline), for the optional nested `api/AGENTS.md` exercise. Run with `tsx watch`; tests with Vitest + supertest.

### D5: How the legacy shop stays "green"
The legacy shop must violate conventions yet pass lint/typecheck/test on `main`. It uses valid TypeScript and passes the *base* ESLint config; its violations are exactly the ones the workshop's restrictive rules will catch later (`fetch`, theme import, hex, number libraries). Its tests pass using `getByTestId` and a mocked global `fetch`.

### D6: Formatting helpers
`compact()` uses `Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })` (yields "1.2M"); `humanizeSeconds(s, 'short')` is a small hand-written function ("45s", "2m 30s", "3h 12m"). Both are unit-tested and used by profile/clicker, so they are discoverable for an agent that looks, and absent from the shop.

### D7: Tooling choices
- ESLint flat config (typescript-eslint, react-hooks) and Stylelint (`stylelint-config-standard`) at base level only.
- Prettier.
- `concurrently` for `npm run dev`.
- `lefthook` as devDependency with its auto-install disabled. The repo sets `LEFTHOOK=0` for the install script or relies on lefthook doing nothing without a config. Which one applies is verified in tasks; if lefthook would create a default config, the `postinstall` behaviour is neutralised.
- CI is a single GitHub Actions job on Node LTS.

### D8a: Legacy-vs-rules conflict is an exercise, not a design decision
Adding the exercise-3 rules makes the existing legacy shop fail lint, so a whole-project pre-commit hook blocks every commit. This is deliberately **not** solved in the repo or the instructions. Participants work out their own approach (and the trainer can discuss options afterwards). Only the `stap-3-enforce` checkpoint needs *a* working example so stragglers can continue. Which example is a trainer choice made when building that overlay; it is not prescribed by the specs.

### D8: Calibration happens on the exported repo
Running agents inside this workshop repo would leak context (`.claude/skills`, `.agents/`, OpenSpec files, the workshop materials themselves describing the lures). Calibration runs are therefore performed only on a fresh export in a directory outside this repo.

## Risks / Trade-offs

- [Agents behave differently per model/version, so lures may be too weak or too strong] → mandatory calibration (workshop-setup spec) with documented tuning knobs per convention; recalibrate shortly before the workshop.
- [Participants' personal instructions/memory improve the baseline] → pre-workshop mail asks to disable them; discussed as a learning point if it happens.
- [Overlay drift: a later change to `main` breaks a checkpoint (e.g. a renamed file referenced in `AGENTS.md`)] → the export script runs lint/typecheck/test on every branch and fails loudly.
- [Lefthook postinstall unexpectedly installs hooks] → explicit acceptance check after `npm install` on a clean clone.
- [The legacy code is "too obviously bad" and feels rigged] → keep legacy realistic (working, tested, TODO comment), and keep everything else clean.
- [Port conflicts on participants' machines (5173/3000)] → ports configurable via env, documented in README.

## Migration Plan

Not applicable (greenfield). Rollout:
1. Build and review in this repo.
2. Export to a temp dir.
3. Calibrate.
4. Push to the distribution remote.
5. Send the pre-workshop mail.

Rollback = re-export a previous commit of this repo.

## Open Questions

- Final distribution location (GitHub org/repo name and visibility) can be decided at push time; it doesn't affect the build.
- Exact Dutch flavour texts can be polished after the first build.
- Which worked example `stap-3-enforce` uses for the legacy-vs-rules conflict (trainer choice at build time, see D8a). It only affects the content of that overlay.

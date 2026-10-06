# it-clicker/checkpoints Specification

## Purpose

Defines the cumulative checkpoint solutions participants can switch to when they fall behind, and how the practice repo is exported as a standalone git repository with those checkpoints as branches.

## Requirements

### Requirement: Checkpoint 1 – AGENTS.md
Branch `stap-1-agents-md` SHALL add, on top of `main`, an `AGENTS.md` of at most ~80 lines (commands, structure, top conventions, never-do list, docs index with the instruction to read the relevant doc first, and a statement that the profile feature is the reference and the shop is legacy and must not be copied), plus `docs/ai/styling.md` (token table including `--rs-spotlight` as accent and the Card highlight option), `docs/ai/data-fetching.md`, `docs/ai/components.md` and `docs/ai/testing.md`.

#### Scenario: Agent finds data-fetching guidance
- **WHEN** a fresh agent session on `stap-1-agents-md` is asked "How do I fetch data in this project, and which docs did you read?"
- **THEN** the agent answers that data goes through the shared API client and hooks and cites `AGENTS.md` and `docs/ai/data-fetching.md`

### Requirement: Checkpoint 2 – rules
Branch `stap-2-rules` SHALL add, on top of checkpoint 1, rules with IDs STYLE-01, DATA-01, UI-01, DEPS-01, I18N-01, TEST-01, A11Y-01 and STRUCT-01 (each with scope, instruction, why and good/bad example), a path-scoped testing rule in all three forms (`docs/ai/testing.md`, `.github/instructions/testing.instructions.md` with `applyTo`, `.claude/rules/testing.md` with `paths`), and a Reporting section requiring an "Applied rules:" list.

#### Scenario: Rules are reported
- **WHEN** an agent completes `TASK.md` on `stap-2-rules`
- **THEN** its final message contains an "Applied rules:" section listing rule IDs and files

### Requirement: Checkpoint 3 – enforcement
Branch `stap-3-enforce` SHALL add, on top of checkpoint 2: ESLint rules forbidding `fetch` in feature code, imports of `numeral`, `pretty-ms`, `humanize-duration`, `date-fns` and the deprecated theme file, and hex colour literals; Stylelint `color-no-hex` (except in the tokens file); `lefthook` as a dev dependency with a `lefthook.yml` pre-commit running lint, lint:css, typecheck and test; a never-use-`--no-verify` rule in `AGENTS.md`; and example agent hooks for Claude Code and GitHub Copilot that run ESLint after edits. All lint messages SHALL be phrased as instructions referencing the relevant `docs/ai/` file.

#### Scenario: Commit with hex colour blocked
- **WHEN** a participant on `stap-3-enforce` (with `npx lefthook install` run) commits a feature CSS file containing `#ff2e63`
- **THEN** the commit is rejected and the message tells them to use a `var(--rs-*)` token and points to `docs/ai/styling.md`

#### Scenario: Commit with fetch blocked
- **WHEN** a participant commits feature code calling `fetch`
- **THEN** the commit is rejected with a message pointing to the API client and `docs/ai/data-fetching.md`

#### Scenario: Commit with formatting library blocked
- **WHEN** a participant commits code importing `numeral`
- **THEN** the commit is rejected with a message pointing to the shared compact-number helper

### Requirement: Checkpoints are cumulative and green
Each checkpoint branch SHALL build on the previous one (`main` → `stap-1-agents-md` → `stap-2-rules` → `stap-3-enforce`), and lint, lint:css, typecheck and test SHALL pass on every branch. On `stap-3-enforce` this includes a worked example of how the pre-existing legacy violations are handled. That example is one possible answer for participants who fall behind, not the prescribed solution, and it is chosen by the trainer when building the checkpoint. Checkpoints SHALL NOT implement `TASK.md` itself.

#### Scenario: Linear history
- **WHEN** a reviewer runs `git log stap-3-enforce`
- **THEN** it contains the commits of `stap-2-rules`, `stap-1-agents-md` and `main`

#### Scenario: Task not pre-solved
- **WHEN** a participant switches to `stap-3-enforce`
- **THEN** the shop still has no filter, wishlist or "affordable in" feature

### Requirement: Export to standalone repository
There SHALL be a repeatable export that produces a standalone git repository named `rockstars-it-clicker` with `main` and the three checkpoint branches, containing only practice-repo files (no workshop materials, no OpenSpec planning files).

#### Scenario: Export
- **WHEN** the trainer runs the export into an empty target directory
- **THEN** the target contains a git repo with branches `main`, `stap-1-agents-md`, `stap-2-rules`, `stap-3-enforce` and no `presentatie.md`, `opdrachten.md` or `openspec/`

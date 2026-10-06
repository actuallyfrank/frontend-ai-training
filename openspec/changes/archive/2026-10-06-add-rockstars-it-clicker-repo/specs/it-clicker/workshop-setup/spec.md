# Spec Delta

## Purpose

Defines the workshop-specific properties of the practice repo: a realistic "mid-migration" codebase with planted conventions and lures, starter files, tooling state and calibration, so that context engineering visibly changes agent results.

## ADDED Requirements

### Requirement: Legacy area and reference implementation
The repo SHALL contain exactly one deliberately legacy feature (the shop, where `TASK.md` lands) and one reference feature (the profile) that demonstrates every convention. All other shared code (clicker feature, UI components, utilities, API client, game state) SHALL follow the conventions. The legacy feature SHALL carry a "TODO: migrate (see profile)" comment but SHALL NOT state "do not copy".

#### Scenario: Reference exists for every convention
- **WHEN** a reviewer checks conventions 1–8 against the profile feature and shared code
- **THEN** each convention has at least one correct, discoverable example

#### Scenario: Legacy violates most conventions
- **WHEN** a reviewer checks the shop feature against conventions 1–8
- **THEN** it violates at least conventions 1, 2, 3, 4, 5, 6 and 8

### Requirement: Eight planted conventions with lures
The repo SHALL implement the eight conventions and lures defined in `repo-requirements.md` §6:
1. Colours, spacing and radius only via design tokens with non-guessable names (accent = `--rs-spotlight`); lure: a deprecated theme constants file with hex values still imported by the shop.
2. Server communication only via the shared API client and hooks; lure: the shop fetches directly; no wishlist or upgrades hook exists.
3. UI built from the shared UI components (Button, Input, Select, Card with highlight option, Badge); lure: the shop uses ad-hoc elements and Button has no pressed/toggle variant.
4. No new dependencies; compact-number and duration formatting helpers exist in the shared utilities; lure: the shop formats numbers by hand.
5. All UI text translated (EN + NL); lure: the shop has hardcoded English and uses the deprecated `name` field.
6. Tests co-located and querying by role/label; lure: the shop's tests live in a `__tests__` folder and use test ids.
7. Feature code in feature folders (an empty `wishlist` feature folder exists); lure: a legacy `components/` folder holding the Header.
8. Accessible interactive elements; lure: the shop buys upgrades via a clickable div.

#### Scenario: Lures present
- **WHEN** a reviewer searches the shop feature
- **THEN** they find a direct `fetch` call, an import of the deprecated theme file, hex colours and px spacing, hand-rolled number formatting, hardcoded strings, a clickable `div` and `getByTestId` in its tests

#### Scenario: Helpers discoverable but not obvious
- **WHEN** a reviewer inspects the shared utilities
- **THEN** a compact-number helper ("1.2M") and a short duration helper ("2m 30s") exist, are unit-tested and are used by the profile feature

### Requirement: Conventions documented only in prose
The real conventions SHALL be described only in `CONTRIBUTING.md` (prose, mixed with git and release information, naming the profile feature as the example) and in the code itself. The `README.md` SHALL contain an outdated "Styling" section pointing to the deprecated theme file.

#### Scenario: No structured agent guidance
- **WHEN** a participant clones `main`
- **THEN** `CONTRIBUTING.md` mentions all eight conventions in prose and the README styling section references the deprecated theme file

### Requirement: No agent instruction files on main
The `main` branch SHALL NOT contain `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `.github/instructions/`, `.github/hooks/`, `.claude/`, `.cursorrules`, `docs/ai/`, `lefthook.yml` or `openspec/`.

#### Scenario: Clean baseline
- **WHEN** a reviewer lists the files on `main`
- **THEN** none of the listed agent instruction files or directories exist

### Requirement: Workshop starter files
The repo root SHALL contain `TASK.md` (the shop filter + wishlist ticket, product language, no technical hints) and `TASK-BONUS.md` (leaderboard). Workshop materials that name the conventions (assignment texts, scorecard, trainer notes) SHALL NOT be in the repo, because an agent could read them; they live in the workshop repo under `opdrachten/` and are shared separately.

#### Scenario: Task touches every convention
- **WHEN** a reviewer maps the lines of `TASK.md` to the conventions
- **THEN** every one of the eight conventions is triggered by at least one requirement in the task

#### Scenario: No spoilers in the repo
- **WHEN** a reviewer lists the files on `main`
- **THEN** there is no scorecard, assignment text or trainer material

### Requirement: Tooling state
The repo SHALL provide root scripts `dev`, `lint`, `lint:css`, `typecheck` and `test`, all passing on `main`. ESLint and Stylelint SHALL be configured without the restrictive rules participants add in the workshop (no restricted globals/imports/syntax, no `color-no-hex`). No git-hook tooling SHALL be installed or configured: `lefthook` SHALL NOT be a dependency (participants install and configure it themselves in exercise 3), and `npm install` SHALL NOT create a lefthook config or git hooks. A CI workflow SHALL run lint, lint:css, typecheck and test.

#### Scenario: Green baseline
- **WHEN** a participant runs `npm install` and then `npm run lint && npm run lint:css && npm run typecheck && npm test` on `main`
- **THEN** all commands succeed

#### Scenario: Hooks not active
- **WHEN** a participant runs `npm install` on a fresh clone
- **THEN** `lefthook` is not in any `package.json`, no `lefthook.yml` exists and `.git/hooks` contains only git's sample hooks

#### Scenario: Dev start
- **WHEN** a participant runs `npm run dev`
- **THEN** the web app is served on port 5173, the API on port 3000, and `/api` requests from the web app reach the API

### Requirement: Legacy conflicts with new rules are left to participants
When participants add enforcement rules in exercise 3, the existing legacy shop code SHALL violate them (direct `fetch`, deprecated theme import, hex colours), so that a whole-project lint or pre-commit hook fails before any new code is written. The repo, `TASK.md` and the participant instructions SHALL NOT pre-solve or prescribe how to handle this (e.g. baselining/suppressions, scoping, migrating the legacy code). Working that out is part of the exercise.

#### Scenario: Conflict surfaces in exercise 3
- **WHEN** a participant on `main` adds a rule forbidding `fetch` in feature code and runs `npm run lint`
- **THEN** lint reports the existing violation in the legacy shop

#### Scenario: No built-in workaround
- **WHEN** a reviewer inspects `main`
- **THEN** there is no ESLint suppressions file, no lint-ignore for the shop and no instruction telling participants how to handle legacy violations

### Requirement: Calibration before the workshop
Before distribution, the baseline (`TASK.md`, fresh session, no personal instructions) SHALL be run at least 3 times with Claude Code and 3 times with GitHub Copilot and scored with the scorecard. The average baseline score SHALL be 2–4 of 8 conventions correct, and the average score on the `stap-2-rules` checkpoint SHALL be at least 6 of 8. Results SHALL be recorded for the trainer.

#### Scenario: Baseline too good
- **WHEN** a convention is satisfied in most baseline runs
- **THEN** its lure is strengthened or its good example made less obvious, and calibration is repeated

#### Scenario: Rules ineffective
- **WHEN** a convention still fails in most `stap-2-rules` runs
- **THEN** the reference example or the example rule is improved, and calibration is repeated

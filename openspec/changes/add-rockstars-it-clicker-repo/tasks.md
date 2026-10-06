# Tasks

## 1. Scaffolding and tooling

- [ ] 1.1 Create `rockstars-it-clicker/` with root `package.json` (npm workspaces `web`, `api`; scripts `dev`, `lint`, `lint:css`, `typecheck`, `test`; devDeps `concurrently`, `lefthook`, `prettier`), `.gitignore` (incl. `SCORECARD.md`), `.prettierrc`. Verify `npm install` succeeds in `rockstars-it-clicker/`
- [ ] 1.2 Scaffold `web/` (Vite + React 19 + TS strict, React Router, react-i18next, Vitest + Testing Library + user-event + jsdom, Vite proxy `/api` → `:3000`, ports via env). Verify `npm run dev -w web` serves a placeholder page on 5173 and `npm test -w web` runs an empty suite
- [ ] 1.3 Scaffold `api/` (Express + TS + Zod, `tsx watch`, Vitest + supertest, folders `routes/ services/ schemas/ data/`). Verify `npm run dev -w api` listens on 3000 and a placeholder health test passes
- [ ] 1.4 Add base ESLint flat config (typescript-eslint, react-hooks; no restricted rules) and Stylelint (`stylelint-config-standard`; no `color-no-hex`). Verify `npm run lint` and `npm run lint:css` pass
- [ ] 1.5 Confirm lefthook stays inactive: after `rm -rf node_modules && npm install` there is no `lefthook.yml` and no lefthook hook in `.git/hooks` (test in a temp git init). Neutralise postinstall if needed (design D7). Verify with the same check
- [ ] 1.6 Add `.github/workflows/ci.yml` (Node LTS: `npm ci`, lint, lint:css, typecheck, test). Verify the workflow YAML validates (e.g. `actionlint` or a dry read) and the commands pass locally

## 2. API

- [ ] 2.1 Add `data/seed.json` with the 16 upgrades from `repo-requirements.md` §2 and default profile/savegame. Verify a test asserts 16 upgrades with counts 6/4/3/3 per category
- [ ] 2.2 Implement the error middleware (`{ error: { code, message } }`, 404 for unknown routes). Verify with supertest (unknown route → 404 standard body)
- [ ] 2.3 Implement `GET /api/upgrades` as the intentionally "legacy" route (logic inline, `name` marked `@deprecated` in the schema comment). Verify the spec scenario "List upgrades" in a test
- [ ] 2.4 Implement savegame routes + service + Zod schema (`GET`/`PUT /api/save`). Verify the "Fresh savegame" and "Invalid savegame" scenarios in tests
- [ ] 2.5 Implement wishlist routes + service (`GET`, `POST`/`DELETE /api/wishlist/:upgradeId`, idempotent add, 404 unknown id). Verify the three wishlist scenarios in tests
- [ ] 2.6 Implement profile routes + service + Zod schema (companyName 2–40, avatar enum, language `en|nl`). Verify the "Valid update" and "Invalid avatar" scenarios in tests

## 3. Shared front-end foundation (clean code)

- [ ] 3.1 Create `styles/tokens.css` (rock tokens from `repo-requirements.md` §7, light variant via `prefers-color-scheme`) and `global.css`. Verify Stylelint passes and the tokens are the only hex values outside `theme.ts`
- [ ] 3.2 Create deprecated `styles/theme.ts` (`/** @deprecated use tokens.css */`, hex constants incl. `accent: '#ff2e63'`). Verify typecheck passes
- [ ] 3.3 Implement `lib/numbers.ts` `compact()` and `lib/time.ts` `humanizeSeconds()` with co-located tests ("999", "1.2K", "1.2M", "3.4B"; "45s", "2m 30s", "3h 12m"). Verify tests pass
- [ ] 3.4 Implement `api/client.ts` (`apiClient` get/post/put/delete, base `/api`, `ApiError`, the "All server communication goes through this client" comment) and hooks `useSaveGame`, `useProfile` (`{ data, error, isLoading, update }`). Verify with tests using a mocked client (no test ids)
- [ ] 3.5 Implement `lib/game/` (`pricing.ts` with `priceOf`/`locPerSecond`/`clickPower`, `GameProvider` + `useGame()` with `click`/`buy`, 100 ms loop, load on start, autosave every 10 s and after purchase, error state when the API is down). Verify pricing unit tests (15 → 18 after one Intern; cannot-afford case) and a provider test with fake timers (10 Interns × 10 s ≈ +10 LoC)
- [ ] 3.6 Implement `ui/` components: Button (variants primary/secondary/ghost/hero, no pressed variant), Input (required `label`, `useId`, supports `type="search"`), Select (required `label`), Card (`highlighted` → `--rs-spotlight` border), Badge, each with its own CSS file using tokens only. Verify the co-located `Button.test.tsx` (role-based) passes and Stylelint passes
- [ ] 3.7 Set up i18n (`i18n.ts`, `locales/en.json` + `nl.json` incl. `upgrades.<id>.name/flavour` for all 16, with fun NL flavours). Verify a test that every upgrade id has EN and NL keys

## 4. Features

- [ ] 4.1 Build `components/Header.tsx` (legacy location, but uses tokens + i18n): name, compact LoC, LoC/s, nav Game/Shop/Profile, EN/NL switch. Verify a role-based test for the language switch (labels change without reload)
- [ ] 4.2 Build `features/clicker/` (ClickerPage, CommitButton with hero Button + "+N" CSS animation + translated aria-label, StatsPanel, TeamSummary with translated names). Verify co-located tests: click adds LoC, keyboard activation works, summary shows "Intern × 3"
- [ ] 4.3 Build `features/profile/` as the reference implementation (ProfilePage with loading/error states, ProfileForm with ui Input/Select/avatar radiogroup/Button, `role="status"` success, inline validation; ProfileStats using `humanizeSeconds` and `compact`). Verify co-located tests with `getByRole`/`getByLabelText` covering the save, invalid-name and stats scenarios
- [ ] 4.4 Build the legacy `features/shop/` exactly per `repo-requirements.md` §5.2 (direct `fetch`, own loading flag + Spinner, hardcoded category headings, `UpgradeCard` as clickable div with `data-testid`, deprecated `name`, hand-rolled number formatting, inline styles from `theme.ts`, `shop.css` with hex/px, `// TODO: migrate (see features/profile)` comment, no filter/wishlist). Verify `features/shop/__tests__/ShopPage.test.tsx` (mocked global fetch, `getByTestId`) passes and lint/typecheck are green
- [ ] 4.5 Add the empty `features/wishlist/index.ts` (`export {}`) and wire routes `/`, `/shop`, `/profile` in `App.tsx`. Verify manual smoke test: play, buy in shop, reload restores progress, edit profile, switch language
- [ ] 4.6 Tune balance so a Junior Dev is affordable within ~2 minutes of steady clicking. Verify by a manual playtest (or a simulation test over the pricing functions)

## 5. Workshop documents in the practice repo

- [ ] 5.1 Write `README.md` (what the app is, install/dev/test commands, ports, and an outdated "Styling" section saying colours live in `src/styles/theme.ts`). Verify the documented commands work as written
- [ ] 5.2 Write `CONTRIBUTING.md` (~2 pages of prose: git workflow, release notes, and the eight conventions woven in, naming `features/profile` as "how we write features now"). Verify all eight conventions are mentioned (checklist review) and no bullet-list rules section exists
- [ ] 5.3 Add `TASK.md` and `TASK-BONUS.md` with the exact texts from `repo-requirements.md` §9–§10. Verify the trigger table: every convention is hit by at least one TASK line
- [ ] 5.4 Add `SCORECARD.template.md` (from `opdrachten.md`). Verify that `SCORECARD.md` survives `git reset --hard && git clean -fd` in a temp clone
- [ ] 5.5 Run the workshop-setup audit (also asserting: no ESLint suppressions file, no lint-ignore for the shop) on `rockstars-it-clicker/`: none of the forbidden agent files exist, all lures present (grep for `fetch(` in shop, `theme` import, hex in `shop.css`, `getByTestId`, clickable div), reference examples present. Verify by a scripted check `scripts/audit-practice-repo.sh` that exits 0

## 6. Checkpoint overlays

- [ ] 6.1 Write `checkpoints/stap-1-agents-md/` (`AGENTS.md` ≤ ~80 lines incl. the reference/legacy statement and docs index, `docs/ai/styling.md` with token table + Card highlight, `data-fetching.md`, `components.md`, `testing.md`; optional `api/AGENTS.md`). Verify `AGENTS.md` line count ≤ 80 and every docs link resolves
- [ ] 6.2 Write `checkpoints/stap-2-rules/` (rules STYLE-01 … STRUCT-01 with scope/why/✅/❌, testing rule in `docs/ai/testing.md`, `.github/instructions/testing.instructions.md` (`applyTo: "**/*.test.{ts,tsx}"`) and `.claude/rules/testing.md` (`paths:`), Reporting section in `AGENTS.md`). Verify all 8 rule IDs are present and frontmatter parses as YAML
- [ ] 6.3 Write `checkpoints/stap-3-enforce/` (replacement `eslint.config.js` with restricted globals/imports/syntax and instructive messages, `.stylelintrc.json` with `color-no-hex` + tokens override, `lefthook.yml`, never-`--no-verify` in `AGENTS.md`, `.claude/settings.json` PostToolUse ESLint hook, `.github/hooks/lint.json`). Include the trainer-chosen worked example for the pre-existing legacy violations (design D8a; ask the trainer which approach before writing it). Verify on an applied copy: lint/lint:css/typecheck/test pass, and the three blocking scenarios fail a commit with the expected messages

## 7. Export and integration

- [ ] 7.1 Implement `scripts/export-practice-repo.sh <target-dir>`: copy `rockstars-it-clicker/` → `git init` → commit `main` → for each checkpoint branch from the previous one, copy the overlay, commit. Refuse a non-empty target. Verify the target has branches `main`, `stap-1-agents-md`, `stap-2-rules`, `stap-3-enforce` and contains no workshop materials or `openspec/`
- [ ] 7.2 Extend the export to run `npm ci && npm run lint && npm run lint:css && npm run typecheck && npm test` on every branch and fail loudly. Verify the export completes green on all branches
- [ ] 7.3 Verify spec scenarios end-to-end on a fresh export outside this repo: `npm install` (no hooks), `npm run dev` (ports, proxy), savegame/wishlist/profile persist across reload, the three stap-3 commit-blocking scenarios
- [ ] 7.4 Calibrate per design D8 and the workshop-setup spec: 3× Claude Code + 3× Copilot baseline on `main`, and the same on `stap-2-rules`, scored with the scorecard. Tune lures/examples until baseline averages 2–4/8 and stap-2 ≥ 6/8. Record the results in `calibration.md` in this workshop repo
- [ ] 7.5 Update `repo-requirements.md` and, if needed, `opdrachten.md`/`presentatie.md` with anything changed during build or calibration (e.g. final token or helper names). Verify a grep for the old names returns nothing

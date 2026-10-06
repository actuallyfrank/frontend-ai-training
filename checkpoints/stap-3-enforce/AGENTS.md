# AGENTS.md

Rockstars IT Clicker: an idle clicker game (earn Lines of Code, buy upgrades).
`web/` = React 19 + Vite front-end, `api/` = Express + Zod API. npm workspaces.

## Commands

- `npm run dev`: web on :5173, API on 127.0.0.1:3000 (`WEB_PORT` / `API_PORT` to override)
- `npm run lint` · `npm run lint:css` · `npm run typecheck` · `npm test`
- Run all four before you say a task is done.
- Git hooks: run `npx lefthook install` once; every commit then runs lint, lint:css, typecheck and test.

## Reference implementation

Copy patterns from `web/src/features/profile/`.
`web/src/features/shop/` is legacy (migration in progress): do not copy its patterns
(direct `fetch`, `styles/theme.ts`, hex colours, clickable divs, test ids, hardcoded text).
When you change shop code, migrate the parts you touch.

## Structure

- `web/src/features/<name>/`: feature code, its CSS and its tests
- `web/src/ui/`: shared components (Button, Input, Select, Card, Badge)
- `web/src/lib/`: helpers (`numbers.ts`, `time.ts`) and game state (`lib/game/`, `useGame()`)
- `web/src/api/`: `client.ts` + hooks for every server call
- `web/src/locales/`: `en.json` + `nl.json`
- `web/src/components/`: legacy folder, do not add new files

## Rules (details, why and examples in docs/ai/rules.md)

- STYLE-01: colours, spacing, radius only via `web/src/styles/tokens.css` (accent = `--rs-spotlight`)
- DATA-01: server calls only via `apiClient` + a hook in `web/src/api/`
- UI-01: build UI from `web/src/ui/`; extend it there when something is missing
- DEPS-01: no new dependencies; use `compact()` / `humanizeSeconds()` from `web/src/lib/`
- I18N-01: every visible text via `t()`, keys in both `en.json` and `nl.json`
- TEST-01: tests next to the component, query by role/label, no test ids
- A11Y-01: real buttons, visible labels, `aria-pressed` on toggles
- STRUCT-01: new feature code in `web/src/features/<name>/`, never in `web/src/components/`

## Never do

- Never add a package without asking.
- Never use hex/rgb/px values in feature CSS or inline styles.
- Never call `fetch` outside `web/src/api/client.ts`.
- Never put new files in `web/src/components/` or `__tests__/` folders.
- Never use `git commit --no-verify`. Fix the reported issue instead.
- Never add entries to `web/eslint-suppressions.json` or `web/stylelint-suppressions.json`
  (no `--suppress-all` / `--suppress`). They only record legacy violations. After you fix legacy
  code, shrink them with `npx eslint --prune-suppressions` (in `web/`).

## Docs index (read the relevant file before you start)

- docs/ai/rules.md: all rules with scope, why and ✅/❌ examples

- docs/ai/styling.md: tokens table, theming, Card highlight
- docs/ai/data-fetching.md: API client, hooks, loading/error states, endpoints
- docs/ai/components.md: ui/ components, i18n, accessibility
- docs/ai/testing.md: Testing Library, query priorities, test helpers
- api/AGENTS.md: backend conventions (when working in `api/`)

## Reporting

End every task with a section `Applied rules:` listing each rule ID you applied
and the file(s) where you applied it, e.g. `STYLE-01: web/src/features/wishlist/StarButton.css`.
List rules you could not apply under `Not applied:` with the reason.

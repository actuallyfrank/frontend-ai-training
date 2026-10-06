# AGENTS.md

Rockstars IT Clicker: an idle clicker game (earn Lines of Code, buy upgrades).
`web/` = React 19 + Vite front-end, `api/` = Express + Zod API. npm workspaces.

## Commands

- `npm run dev`: web on :5173, API on 127.0.0.1:3000 (`WEB_PORT` / `API_PORT` to override)
- `npm run lint` · `npm run lint:css` · `npm run typecheck` · `npm test`
- Run all four before you say a task is done.

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

## Top conventions

1. Colours, spacing, radius only via tokens in `web/src/styles/tokens.css`. Accent = `--rs-spotlight`. See docs/ai/styling.md
2. Server calls only via `apiClient` + a hook in `web/src/api/`. See docs/ai/data-fetching.md
3. Build UI from `web/src/ui/`; extend a component there if something is missing. See docs/ai/components.md
4. No new dependencies. Use `compact()` ("1.2M") and `humanizeSeconds()` ("2m 30s") from `web/src/lib/`
5. Every visible text via i18n, keys in both `en.json` and `nl.json`. See docs/ai/components.md
6. Tests next to the component, query by role/label, no test ids. See docs/ai/testing.md
7. Accessible by default: real buttons, labels, `aria-pressed` on toggles. See docs/ai/components.md

## Never do

- Never add a package without asking.
- Never use hex/rgb/px values in feature CSS or inline styles.
- Never call `fetch` outside `web/src/api/client.ts`.
- Never put new files in `web/src/components/` or `__tests__/` folders.

## Docs index (read the relevant file before you start)

- docs/ai/styling.md: tokens table, theming, Card highlight
- docs/ai/data-fetching.md: API client, hooks, loading/error states, endpoints
- docs/ai/components.md: ui/ components, i18n, accessibility
- docs/ai/testing.md: Testing Library, query priorities, test helpers
- api/AGENTS.md: backend conventions (when working in `api/`)

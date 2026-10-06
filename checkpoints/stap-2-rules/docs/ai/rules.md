# Rules

Each rule has an ID. Mention the IDs you applied in the `Applied rules:` section at the end of a task.

## STYLE-01: Only design tokens for colour, spacing and radius
Scope: `web/src/**/*.{css,tsx}`

Use CSS custom properties from `web/src/styles/tokens.css` for every colour, spacing and radius
value. The accent ("spotlight colour") is `--rs-spotlight`. Never use hex, rgb(), hsl() or raw px
spacing, never import `web/src/styles/theme.ts`, and never invent token names.

Why: the game has a dark and a light theme; hardcoded values break the light theme.

✅ `border-color: var(--rs-spotlight); padding: var(--rs-space-3);` or `<Card highlighted>`
❌ `border-color: #ff2e63; padding: 12px;` or `style={{ borderColor: COLORS.accent }}`

## DATA-01: Server calls only via the API client and a hook
Scope: `web/src/**/*.{ts,tsx}`

Call the server only through `apiClient` in `web/src/api/client.ts`, wrapped in a hook in
`web/src/api/` that returns `{ data, error, isLoading }` (see `useProfile.ts`). Read game data via
`useGame()`. Never call `fetch` in a component and never use `localStorage` instead of the API.

Why: the client handles the base URL and maps errors to `ApiError`; hooks keep loading and error
states consistent.

✅ `const { data, toggle } = useWishlist();` with `apiClient.post('/wishlist/' + id)` inside the hook
❌ `useEffect(() => { fetch('/api/wishlist').then(...) }, [])` in a component

## UI-01: Build UI from web/src/ui/
Scope: `web/src/features/**/*.tsx`

Use `Button`, `Input`, `Select`, `Card` and `Badge` from `web/src/ui/`. If a component lacks
something (for example a pressed/toggle state), extend the component in `ui/` with a test instead
of styling a native element in your feature.

Why: ui/ components carry focus styles, labels and theming.

✅ `<Button variant="ghost" pressed={isWishlisted} …>` after adding `pressed` to `ui/Button`
❌ `<button className="star-btn" style={{ … }}>★</button>`

## DEPS-01: No new dependencies
Scope: `package.json`, `web/package.json`, `api/package.json`

Don't add packages. Format numbers with `compact()` from `web/src/lib/numbers.ts` ("1.2M") and
durations with `humanizeSeconds()` from `web/src/lib/time.ts` ("2m 30s"). Game maths goes in
`web/src/lib/game/` (e.g. `priceOf`).

Why: every dependency is maintenance and bundle size; the helpers already exist and are tested.

✅ `t('shop.affordableIn', { time: humanizeSeconds(seconds) })`
❌ `import prettyMs from 'pretty-ms'` / `import numeral from 'numeral'`

## I18N-01: Every visible text is translated
Scope: `web/src/**/*.tsx`, `web/src/locales/*.json`

Use `t('key')` for every visible text and accessible name. Add each new key to both `en.json` and
`nl.json`. Translate upgrade names with ``t(`upgrades.${id}.name`)`` (not the deprecated `name`
field) and categories with ``t(`categories.${category}`)``.

Why: the game is played in English and Dutch; a test fails when the key sets differ.

✅ `<Input label={t('shop.search')} type="search" … />`
❌ `<input placeholder="Search upgrades" />`

## TEST-01: Tests next to the component, queried like a user
Scope: `**/*.test.{ts,tsx}`

Place `Thing.test.tsx` next to `Thing.tsx`. Query with `getByRole` (with `name`), then
`getByLabelText`, then `getByText`. No `data-testid`/`getByTestId`, no `__tests__/` folders. Use
`userEvent` and the helpers in `web/src/test/` (`renderWithGame`, `fakeGame`). Mock hooks, not
global `fetch`.

Why: tests that query like users also verify accessibility and survive refactors.

✅ `await userEvent.click(screen.getByRole('button', { name: 'Add Intern to wishlist' }))`
❌ `fireEvent.click(screen.getByTestId('star-intern'))`

## A11Y-01: Accessible interactive elements
Scope: `web/src/**/*.tsx`

Clickable things are `<button>` (via `ui/Button`) or links, never `<div onClick>`. Inputs have a
visible label. Toggles expose their state with `aria-pressed` and have an accessible name that
says what they do.

Why: keyboard and screen-reader users must be able to play; it's part of our definition of done.

✅ `<Button aria-pressed={on} aria-label={t('wishlist.add', { name })}>★</Button>`
❌ `<span className="star" onClick={toggle}>★</span>`

## STRUCT-01: Feature folders
Scope: `web/src/**`

New feature code goes in `web/src/features/<name>/` with its CSS and tests (wishlist code in
`web/src/features/wishlist/`). Shared code goes in `ui/`, `lib/` or `api/`. Don't add files to the
legacy `web/src/components/` folder; the Header may only import and render a feature component.

Why: everything about a feature is in one place, and `components/` is being phased out.

✅ `features/wishlist/WishlistCount.tsx` rendered by `components/Header.tsx`
❌ wishlist state and fetch logic written inside `components/Header.tsx`

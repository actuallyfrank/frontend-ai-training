# Components, i18n and accessibility

## ui/

Build screens from `web/src/ui/` (import from `'../../ui'`):

| Component | Notes |
| --- | --- |
| `Button` | variants `primary`, `secondary`, `ghost`, `hero`; always a real `<button type="button">` |
| `Input` | `label` is required (visible, linked via `useId`); `error` prop sets `aria-invalid` + description; supports `type="search"` |
| `Select` | `label` required, `options: { value, label }[]` |
| `Card` | `highlighted` draws a border in the spotlight colour |
| `Badge` | small pill, e.g. for counts |

Missing a feature (for example a toggle state on `Button`)? Add it to the component in `ui/`
with a test, don't style a native element inside your feature.

## i18n

Every visible string goes through `useTranslation()` → `t('key')`. Add each key to **both**
`web/src/locales/en.json` and `nl.json` (a test checks that the key sets match).
Upgrade names: ``t(`upgrades.${id}.name`)``. Categories: ``t(`categories.${category}`)``.
Accessible names (`aria-label`) are translated too.

## Accessibility

- Clickable things are `<button>` or links, never `<div onClick>`.
- Every input has a visible label (`ui/Input`, `ui/Select` enforce this).
- Toggle buttons expose state with `aria-pressed` and have an accessible name that says what
  they toggle ("Add Intern to wishlist").
- Status messages use `role="status"`, errors `role="alert"`.
- Check new UI with the keyboard only.

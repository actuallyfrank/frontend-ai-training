# Scorecard

> Bewaar dit bestand **buiten** de repo-map. De checks draai je vanuit de root van de repo.

Agent + model: …

Meest verrassende fout bij baseline: …

| # | Conventie | Hoe check je het? | Baseline | Rules | Enforce |
|---|---|---|---|---|---|
| 1 | Kleuren/spacing via tokens (`tokens.css`, `var(--rs-*)`) | `git add -A && git diff --cached voor-run -- web \| grep -E '^\+.*(#[0-9a-fA-F]{3,8}\b\|rgb\(\|[0-9]+px\|theme)'` + bestaan de gebruikte tokens echt in `web/src/styles/tokens.css`? | | | |
| 2 | Data via `web/src/api/` (geen `fetch` in een component) | `git add -A && git diff --cached voor-run -- web/src/features web/src/components \| grep -E '^\+.*fetch\('`. Komt de wishlist uit de API (niet uit `localStorage`)? | | | |
| 3 | UI-componenten uit `web/src/ui/` (Button, Input, Select, Card) | Diff lezen: native `<button>`/`<input>`/`<select>` met eigen styling? | | | |
| 4 | Geen nieuwe dependencies (utils uit `web/src/lib/`) | `git diff voor-run -- '*package.json'` | | | |
| 5 | Alle UI-teksten via i18n | Diff lezen: hardcoded tekst in JSX? Nieuwe keys in `web/src/locales/en.json` én `nl.json`? | | | |
| 6 | Tests naast de component, `getByRole`/`getByLabelText` | `git add -A && git diff --cached voor-run \| grep -E 'getByTestId\|data-testid'` + staat de test naast de component (niet in `__tests__/`)? | | | |
| 7 | Nieuwe code in de juiste feature-map | `git add -A && git diff --cached voor-run --stat`: staat de wishlist-logica in `web/src/features/wishlist/` en niet in `web/src/components/`? | | | |
| 8 | a11y: labels, echte buttons, toggle met `aria-pressed` | Diff lezen: `<div onClick`? Input zonder label? Ster-knop zonder `aria-pressed` of toegankelijke naam? | | | |
| | **Totaal (van 8)** | | | | |

Scoor streng: half goed = fout.

## Geclaimd maar niet gedaan (stap 2)

| Rule-ID | Claim van de agent | Werkelijkheid in de diff | Hypothese waarom |
|---|---|---|---|
| | | | |

## Stap 3: wat gebeurde er bij de commit?

- Hook faalde? ja / nee
- Las de agent de melding? ja / nee
- Herstelde de agent het zelf? ja / nee
- Probeerde de agent `--no-verify`? ja / nee

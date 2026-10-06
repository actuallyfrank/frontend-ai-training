# Scorecard

> Kopieer dit bestand naar `SCORECARD.md` (staat in `.gitignore`, overleeft dus elke reset).

Agent + model: …

Meest verrassende fout bij baseline: …

| #   | Conventie                                                                                             | Hoe check je het?                                                                                                                                                     | Baseline | Rules | Enforce |
| --- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----- | ------- |
| 1   | Kleuren/spacing via tokens (`tokens.css`, `var(--rs-*)`)                                              | `git add -A && git diff --cached voor-run -- web \| grep -E '^\+.*(#[0-9a-fA-F]{3,8}\b\|rgb\(\|[0-9]+px\|theme)'` + bestaan de gebruikte tokens echt in `tokens.css`? |          |       |         |
| 2   | Data via `web/src/api/` (geen `fetch` in een component)                                               | `git add -A && git diff --cached voor-run -- web/src/features web/src/components \| grep -E '^\+.*fetch\('`                                                           |          |       |         |
| 3   | UI-componenten uit `web/src/ui/` (Button, Input, Select, Card)                                        | Diff lezen: native `<button>`/`<input>` met eigen styling?                                                                                                            |          |       |         |
| 4   | Geen nieuwe dependencies (utils uit `web/src/lib/`, bv. `compact`, `humanizeSeconds`)                 | `git diff voor-run -- '*package.json'`                                                                                                                                |          |       |         |
| 5   | Alle UI-teksten via i18n                                                                              | Diff lezen: hardcoded tekst in JSX? Nieuwe keys in `locales/en.json` én `nl.json`?                                                                                    |          |       |         |
| 6   | Tests: `getByRole`/`getByLabelText`, naast de component                                               | `git add -A && git diff --cached voor-run \| grep -E 'getByTestId\|data-testid'` + staat de test naast de component (niet in `__tests__/`)?                           |          |       |         |
| 7   | Nieuwe code in de juiste feature-map (wishlist-logica in `features/wishlist/`, niet in `components/`) | `git add -A && git diff --cached voor-run --stat`                                                                                                                     |          |       |         |
| 8   | a11y: labels bij inputs, echte buttons, toggle met `aria-pressed`                                     | Diff lezen: `<div onClick`? Input zonder label? Ster-knop zonder `aria-pressed` of toegankelijke naam?                                                                |          |       |         |
|     | **Totaal (van 8)**                                                                                    |                                                                                                                                                                       |          |       |         |

## Geclaimd maar niet gedaan (opdracht 2)

- Rule-ID: … · Claim: … · Werkelijkheid: … · Hypothese waarom: …

## Opdracht 3: wat gebeurde er bij de commit?

- Hook faalde? ja / nee
- Agent herstelde zelf? ja / nee
- Probeerde `--no-verify`? ja / nee

# Trainer: uitwerking stap 3 (enforcement)

> Alleen voor de trainer.

## Het bedoelde struikelblok: legacy versus nieuwe rules

Zodra deelnemers hun rules toevoegen, faalt `npm run lint` op de bestaande legacy-code:
- `fetch` in `ShopPage.tsx`
- de `theme.ts`-import in `UpgradeCard.tsx`
- hex in `shop.css` en `theme.ts`
- `getByTestId` in de shop-tests

Met een pre-commit hook die het hele project lint, wordt dan **elke** commit geblokkeerd, ook een schone.

Dit is bewust niet opgelost in de repo of de opdrachttekst. Deelnemers bedenken zelf een aanpak. Bespreek de opties achteraf:

| Aanpak | Hoe | Plus | Min |
|---|---|---|---|
| **Baseline / suppressions** (gekozen voor de checkpoint) | `npx eslint --suppress-all` → `eslint-suppressions.json`; `npx stylelint "src/**/*.css" --suppress` → `stylelint-suppressions.json` | Legacy blijft staan, elke **nieuwe** overtreding faalt (ook een extra in een legacy-bestand); prune met `--prune-suppressions` | Stylelint markeert het als experimenteel; de agent kan proberen de baseline op te rekken (daarom een never-do) |
| Alleen staged files linten | `run: npx eslint {staged_files}` in lefthook | Boy-scout rule: wie een bestand aanraakt, ruimt het op | CI op de hele repo blijft rood; raakt de agent `ShopPage.tsx` aan, dan moet hij ook de oude `fetch` fixen |
| Legacy eerst migreren | De shop ombouwen naar hooks, tokens en ui/ | Schoonste eindresultaat | Kost veel tijd, en is deels de TASK zelf |
| Rule als `warn` | `'warn'` in plaats van `'error'` | Niets blokkeert | Agents (en mensen) negeren warnings; geen enforcement |
| Shop uitsluiten | `ignores: ['src/features/shop/**']` | Simpel | **Ondermijnt de oefening:** de TASK-code landt juist in de shop |

## Verwachte uitkomsten van de loop (3.3)

- De hook faalt op een hex-kleur, een `fetch` of een library-import. De agent leest de melding en past het aan, vaak binnen 1–2 pogingen. Dat gaat sneller naarmate de melding meer een instructie is.
- Sommige agents proberen `--no-verify` als de hook blijft falen. Vraag: wie zag dit? Had je het in AGENTS.md gezet?
- Tests en typecheck in de hook maken commits trager. Bespreek de trade-off: snel in de hook, volledig in CI.

## Bespreekpunten

- **De melding is een prompt:** vergelijk "Unexpected use of fetch" met "DATA-01: … Add a hook in src/api/ … See docs/ai/data-fetching.md".
- **Agent hooks versus git hooks** (stretch): agent hooks geven snellere feedback, maar zijn per tool en gelden niet voor mensen. Git hooks en CI gelden voor iedereen.
- **Wat blijft over na enforcement?** Naamgeving, structuur en goede componentkeuzes. Dat blijft rules + review.

## Voorbeelduitwerking

Branch `stap-3-enforce`, bron in `checkpoints/stap-3-enforce/`.

- **`web/eslint.config.js`**, met elke melding als instructie (rule-ID + wat wél + doc):
  - `no-restricted-globals` (`fetch` in `src/features/**` en `src/components/**`)
  - `no-restricted-imports` (formatting-libraries en `**/styles/theme`)
  - `no-restricted-syntax` (hex-literals, klikbare `div`/`span`, `*ByTestId` in tests)
- **`web/.stylelintrc.json`:** `color-no-hex`, met een override voor `tokens.css`.
- **`web/eslint-suppressions.json` + `web/stylelint-suppressions.json`:** de legacy-baseline.
- **lefthook:** `lefthook` als devDependency + `lefthook.yml` (lint, lint:css, typecheck, test).
- **Agent hooks:** `.claude/settings.json` (PostToolUse) en `.github/hooks/lint.json` (postToolUse). Beide roepen `scripts/lint-edited-file.mjs` aan, dat exit 2 + stderr teruggeeft aan de agent.
- **`AGENTS.md`:** never-do voor `--no-verify` en voor het uitbreiden van suppressions.

Geverifieerd: commits met `#ff2e63` in feature-CSS, `fetch` in een feature, of een `numeral`-import worden geblokkeerd. Een schone commit gaat door.

## Rondloop-tips

- Na een checkout van `stap-3-enforce`: eerst `npm install` (lefthook komt erbij) en `npx lefthook install`.
- Deelnemers die vastlopen op het legacy-conflict: vraag eerst "wat wil je dat er gebeurt met code die er al was?", voordat je opties noemt.
- Hard stop na 20 minuten, daarna de afsluiting.

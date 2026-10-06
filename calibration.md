# Kalibratie Rockstars IT Clicker

> Doel: controleren dat een agent **zonder context** gemiddeld **2–4 van de 8** conventies goed doet (baseline op `main`) en **met rules** gemiddeld **≥ 6 van de 8** (`stap-2-rules`). Zie `repo-requirements.md` §13 en de OpenSpec-change `add-rockstars-it-clicker-repo` (taak 7.4).

## Voorbereiding

1. Exporteer de repo **buiten** deze workshop-repo (anders leest de agent `.claude/`, `openspec/` en de workshopmaterialen mee):
   ```bash
   scripts/export-practice-repo.sh ~/tmp/rockstars-it-clicker-calibratie
   ```
2. Zet persoonlijke instructies uit: `~/.claude/CLAUDE.md` tijdelijk hernoemen; in Copilot persoonlijke instructies en memory uit.
3. `cd ~/tmp/rockstars-it-clicker-calibratie && npm install`
4. Gebruik dezelfde modellen als de deelnemers (noteer ze hieronder).

## Per run

1. `git switch <branch> && git tag -f voor-run`
2. Verse sessie (Claude: nieuwe sessie / Copilot: nieuwe chat), auto-accept edits aan, shell op approve.
3. Plak de inhoud van `TASK.md`. Niet ingrijpen.
4. Scoor met de checks uit `opdrachten/scorecard.md` (1 punt per conventie).
5. `git reset --hard voor-run && git clean -fd`

## Resultaten

Modellen: Claude Code: … · Copilot: …

| Run | Branch | Agent | 1 Tokens | 2 Data | 3 ui/ | 4 Deps | 5 i18n | 6 Tests | 7 Map | 8 a11y | Totaal |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | main | Claude Code | | | | | | | | | |
| 2 | main | Claude Code | | | | | | | | | |
| 3 | main | Claude Code | | | | | | | | | |
| 4 | main | Copilot | | | | | | | | | |
| 5 | main | Copilot | | | | | | | | | |
| 6 | main | Copilot | | | | | | | | | |
| 7 | stap-2-rules | Claude Code | | | | | | | | | |
| 8 | stap-2-rules | Claude Code | | | | | | | | | |
| 9 | stap-2-rules | Claude Code | | | | | | | | | |
| 10 | stap-2-rules | Copilot | | | | | | | | | |
| 11 | stap-2-rules | Copilot | | | | | | | | | |
| 12 | stap-2-rules | Copilot | | | | | | | | | |

**Gemiddelde baseline (main):** … / 8 (doel 2–4)
**Gemiddelde stap-2-rules:** … / 8 (doel ≥ 6)

## Bijsturen per conventie

| # | Baseline te goed? Maak het lokkertje sterker | Rules werken niet? Maak het voorbeeld duidelijker |
|---|---|---|
| 1 Tokens | Meer hex/`COLORS` in de shop, minder `var(--rs-*)` in zicht | Tokentabel in `docs/ai/styling.md` uitbreiden, `Card highlighted` noemen in de rule |
| 2 Data | Shop ook voor kopen/saven direct `fetch` laten doen | `useWishlist`-skelet als voorbeeld in `docs/ai/data-fetching.md` |
| 3 ui/ | Meer ad-hoc buttons in de shop | Voorbeeld van `pressed`-prop toevoegen aan UI-01 |
| 4 Deps | Notatie in `TASK.md` specifieker ("2m 30s" ✓) | `compact`/`humanizeSeconds` met import-pad in AGENTS.md |
| 5 i18n | Meer hardcoded tekst in shop | Voorbeeld met `categories.<id>`-keys |
| 6 Tests | Meer `getByTestId`-voorbeelden in shop | `renderWithGame`-voorbeeld in `docs/ai/testing.md` |
| 7 Map | Header nog meer logica geven | STRUCT-01 expliciet over de header-teller |
| 8 a11y | Meer klikbare divs in shop | `aria-pressed`-voorbeeld in A11Y-01 |

Na bijsturen: opnieuw exporteren en de betreffende runs herhalen. Leg de definitieve cijfers hier vast; ze zijn bruikbaar als vergelijking in de afsluiting van de workshop.

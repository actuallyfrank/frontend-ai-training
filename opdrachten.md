# Opdrachten: Context engineering voor front-end developers

> Je werkt **solo**, overleggen met je buren mag en wordt aangemoedigd.
> Elke opdracht heeft een **hard stopmoment**. Niet klaar? Geen probleem: stap bij de volgende opdracht in via de checkpoint-branch.
> Repo: `rockstars-events` (React + een kleine Node-API).

---

## Vooraf (thuis, ~10 min)

1. Clone de repo `rockstars-events`
2. `npm install` (in de root, installeert `web/` en `api/`)
3. `npm run dev`: de app draait op `http://localhost:5173`, de API op `http://localhost:3000`
4. Check dat je agent werkt: vraag hem een comment toe te voegen aan `web/src/main.tsx` en draai dat terug

---

## Werkwijze per run (lees dit eerst!)

Je voert dezelfde feature-taak (`TASK.md`) drie keer uit: zonder context, met rules, en met enforcement. Om eerlijk te vergelijken begint elke run schoon.

**Voor elke run:**

```bash
git add -A && git commit -m "context: <wat je toevoegde>"   # je eigen context-werk bewaren
git tag -f voor-run                                           # markeer het startpunt
```

Start daarna een **verse agent-sessie** (Claude: nieuwe sessie of `/clear` / Copilot: nieuwe chat) en plak de inhoud van `TASK.md`.

**Na elke run (na het scoren):**

```bash
git reset --hard voor-run && git clean -fd                    # agent-werk weggooien
```

Sluit de agent-sessie.

**Wat heeft de agent veranderd?**

```bash
git add -A && git diff --cached voor-run --stat               # overzicht
git add -A && git diff --cached voor-run                      # volledige diff
```

> `SCORECARD.md` staat in `.gitignore`, dus die blijft staan na een reset.
> ⚠️ `git clean -fd` verwijdert alle niet-getrackte bestanden die niet ge-ignored zijn. Commit dus eerst je context-werk.

---

## Opdracht 1: Baseline + AGENTS.md

### 1a: Baseline (start bij de opening, scoren: 5 min)

**Doel:** zien wat je agent doet zónder projectkennis. Dit is je nulmeting.

1. `cp SCORECARD.template.md SCORECARD.md`
2. `git tag -f voor-run`
3. Verse sessie → plak `TASK.md` → laat lopen. **Niet ingrijpen, niet corrigeren.** Wil de agent een package installeren? Keur goed, maar noteer het.
4. Tijdens het lopen luister je naar de presentatie
5. Daarna: loop de checks in `SCORECARD.md` langs en vul kolom **baseline** in
6. Noteer bovenaan je scorecard welke fout je het meest verraste
7. Reset (zie Werkwijze)

**Klaar als:** kolom baseline is ingevuld en het agent-werk is weggegooid.

---

### 1b: AGENTS.md met docs-index (20 min)

**Doel:** jouw front-end kennis over dit project vastleggen, zó dat elke agent hem vindt, zonder de context op te blazen.

1. **Verken de repo met je front-end blik.** Kijk naar `web/src/styles/`, `web/src/api/`, `web/src/ui/`, `web/src/lib/`, de bestaande tests, `CONTRIBUTING.md` en de README.
   - ⚠️ Deze repo zit midden in een migratie, net als echte projecten. Niet alles klopt nog: sommige docs zijn verouderd en een deel van de code is legacy. Zoek uit welk deel van de code het _goed_ doet, en vertel de agent dat. Jij bepaalt wat de waarheid is.
2. **Schrijf `AGENTS.md` in de root** (maximaal ~80 regels) met:
   - Wat is dit project (max 2 regels)
   - Commands (dev, lint, typecheck, test)
   - Structuur (kort, geen volledige mappenboom)
   - Top-5 conventies, elk met een verwijzing naar een doc
   - Never do
   - Een **docs-index** met de instructie dat de agent het relevante doc leest voordat hij begint
3. **Schrijf minimaal 2 bestanden in `docs/ai/`**, bijvoorbeeld `styling.md` en `data-fetching.md`. Leg het _waarom_ uit en geef voorbeelden.
4. **Commit** je werk.
5. **Test** in een verse sessie:
   > Hoe haal ik data op in dit project? En welke instructie- of docs-bestanden heb je hiervoor gelezen?

**Tips:**

- Laat de agent gerust een eerste versie maken (`/init` in Claude Code, of vraag "analyseer deze repo en stel een AGENTS.md voor"). Behandel het resultaat als een PR van een junior: **schrappen > toevoegen**.
- Wat de linter of Prettier al afdwingt, hoort er niet in.
- Wat de agent zelf uit de code haalt ("we use TypeScript"), hoort er niet in.
- **Claude Code-gebruikers:** Claude leest `AGENTS.md` alleen als er geen `CLAUDE.md` is. Heb je er toch een, zet er dan `@AGENTS.md` in.

**Klaar als:** de agent beantwoordt de testvraag correct (via de API-client in `web/src/api/`, niet met `fetch` in een component) en noemt `AGENTS.md` en het juiste docs-bestand.

**Stretch:** maak een geneste `api/AGENTS.md` met de backend-conventies (validatie, error-format) en een `web/AGENTS.md`. Test of de agent in `api/` het juiste bestand pakt.

**Vastgelopen?** `git switch stap-1-agents-md`

---

## Opdracht 2: Rule it, rules + verificatie (22 min)

**Doel:** fouten uit je baseline omzetten naar rules die de agent volgt, en controleren óf hij ze volgt.

1. **Kies 3 fouten** uit je baseline-scorecard.
2. **Schrijf voor elke fout een rule** in dit formaat:

   ```md
   ## STYLE-01: Only design tokens for color and spacing

   Scope: web/src/\*_/_.{css,scss,tsx,ts}

   Use CSS custom properties from `web/src/styles/tokens.css` for every color,
   spacing and radius value. Never use hex, rgb(), hsl() or raw px for spacing.

   Why: we support dark mode and white-label themes; hardcoded values break both.

   ✅ color: var(--rs-ink-500); padding: var(--rs-space-3);
   ❌ color: #6b7280; padding: 12px;
   ```

   Vermijd "prefer", "try to" en "where possible".

3. **Maak minimaal 1 rule path-scoped**, bijvoorbeeld een test-rule die alleen geldt voor testbestanden. Kies één van deze vormen:
   - Tool-onafhankelijk: `docs/ai/testing.md` + verwijzing in de index van AGENTS.md
   - Copilot: `.github/instructions/testing.instructions.md`
     ```md
     ---
     applyTo: "**/*.test.{ts,tsx}"
     ---
     ```
   - Claude Code: `.claude/rules/testing.md`
     ```md
     ---
     paths:
       - "**/*.test.{ts,tsx}"
     ---
     ```
4. **Voeg de rapportage-instructie toe** aan `AGENTS.md`:
   ```md
   ## Reporting

   End every task with a section `Applied rules:` listing each rule ID
   you applied and the file(s) where you applied it.
   ```
5. **Commit → `git tag -f voor-run` → verse sessie → plak `TASK.md`.**
6. **Scoor** de kolom **rules** in je scorecard.
7. **Verifieer:**
   - Lees de `Applied rules`-sectie van de agent
   - Vraag door: _"Laat per rule zien op welke regel in welk bestand je hem hebt toegepast."_
   - **Controleer elke claim zelf in de diff.** Noteer claims die niet kloppen in je scorecard ("geclaimd maar niet gedaan").
8. Reset.

**Klaar als:** je score is verbeterd ten opzichte van de baseline **én** je hebt minimaal één rule gevonden die genegeerd werd of geclaimd-maar-niet-toegepast, met een hypothese _waarom_ (te vaag? niet geladen? legacy-code ernaast?).

**Stretch:** herschrijf de genegeerde rule op basis van je hypothese en draai opnieuw. Werkt het nu wel?

**Vastgelopen?** `git switch stap-2-rules`

---

## Opdracht 3: Enforce it, lint rule + git pre-commit hook (20 min)

**Doel:** wat objectief checkbaar is, niet meer aan de agent overlaten. Agent-onafhankelijk, dus het werkt ook voor je collega's en voor jezelf.

### 3.1 Lint rule (8 min)

Kies een rule uit opdracht 2 die een machine kan checken en maak er een lint rule van. **Schrijf de foutmelding als instructie** (wat moet het wél zijn + waar staat de uitleg).

Voorbeelden (in `web/eslint.config.js`):

```js
{
  files: ['src/features/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-globals': ['error', {
      name: 'fetch',
      message: 'Do not call fetch in features. Use a hook from src/api/ (see docs/ai/data-fetching.md).',
    }],
    'no-restricted-imports': ['error', {
      patterns: [{
        group: ['date-fns', 'moment', 'dayjs'],
        message: 'No date libraries. Use formatEventMoment from src/lib/time.ts.',
      }, {
        group: ['**/styles/theme'],
        message: 'theme.ts is deprecated. Use var(--rs-*) tokens from src/styles/tokens.css (see docs/ai/styling.md).',
      }],
    }],
  },
}
```

Hex-kleuren in CSS, met Stylelint (`web/.stylelintrc.json`):

```json
{
  "rules": {
    "color-no-hex": [
      true,
      {
        "message": "Use var(--rs-*) tokens from src/styles/tokens.css instead of hex (see docs/ai/styling.md)."
      }
    ]
  }
}
```

Hex-kleuren in inline styles:

```js
'no-restricted-syntax': ['error', {
  selector: 'Literal[value=/^#[0-9a-fA-F]{3,8}$/]',
  message: 'No hex colors. Use var(--rs-*) tokens (see docs/ai/styling.md).',
}],
```

Test het: zet bewust een overtreding in een bestand en draai `npm run lint`. Zie je jouw melding?

### 3.2 Pre-commit hook (6 min)

lefthook is al geïnstalleerd (als `devDependency`), maar nog niet geconfigureerd. lefthook is één binary met één YAML-config, en draait ook buiten Node-projecten.

Maak in de root `lefthook.yml`:

```yaml
pre-commit:
  parallel: true
  commands:
    eslint:
      glob: "web/**/*.{ts,tsx}"
      run: npm run lint
    stylelint:
      glob: "web/**/*.css"
      run: npm run lint:css
    typecheck:
      glob: "web/**/*.{ts,tsx}"
      run: npm run typecheck
    test:
      glob: "web/**/*.{ts,tsx}"
      run: npm test
```

Activeer de hooks:

```bash
npx lefthook install
```

Een command draait alleen als er staged bestanden zijn die matchen met de `glob`. Het hele project linten is in deze kleine repo snel genoeg. In grote projecten geef je met `{staged_files}` alleen de staged bestanden mee (`run: npx eslint {staged_files}`).

Testen zonder te committen: `npx lefthook run pre-commit --all-files`.

Test het: commit een bestand met een overtreding. Wordt de commit geblokkeerd met jouw melding?

### 3.3 Test de loop (6 min)

1. Voeg toe aan `AGENTS.md` bij Never do: _"Never use `git commit --no-verify`. Fix the reported issue instead."_
2. Commit → `git tag -f voor-run` → verse sessie
3. Plak `TASK.md` **en voeg toe:** _"Commit your work when done."_
4. Kijk mee:
   - Faalt de hook?
   - Leest de agent de melding?
   - Herstelt hij het zelf?
   - Probeert hij `--no-verify`?
5. Scoor de kolom **enforce**.
6. Reset (`git reset --hard voor-run && git clean -fd` gooit ook de commit van de agent weg).

**Klaar als:** een commit met een overtreding wordt geblokkeerd met jouw leesbare melding, en de agent herstelt dat zelfstandig.

**Stretch (kies er één):**

- **Agent hook:** draai dezelfde lint direct na elke edit en vergelijk met de git hook. Wat is sneller? Wat is robuuster?
  - Claude Code (`.claude/settings.json`):
    ```json
    {
      "hooks": {
        "PostToolUse": [
          {
            "matcher": "Edit|Write",
            "hooks": [
              {
                "type": "command",
                "command": "jq -r '.tool_input.file_path' | xargs npx eslint --max-warnings=0 1>&2 || exit 2"
              }
            ]
          }
        ]
      }
    }
    ```
  - Copilot CLI / cloud agent: `.github/hooks/lint.json` met een `postToolUse`-hook (zie de [Copilot hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference)).
- **commit-msg hook:** dwing Conventional Commits af met commitlint. In `lefthook.yml`:
    ```yaml
    commit-msg:
      commands:
        commitlint:
          run: npx commitlint --edit {1}
    ```

**Vastgelopen?** `git switch stap-3-enforce`

---

## Bonus: Spec-driven met OpenSpec (snelle deelnemers / thuis)

**Doel:** ervaren wat een spec toevoegt bovenop AGENTS.md. AGENTS.md beschrijft _hoe_ we bouwen, een spec beschrijft _wat_ we bouwen.

1. Installeer: `npm install -g @fission-ai/openspec@latest` (Node ≥ 20.19)
2. `openspec init` in de repo, en kies je tool
3. Maak een proposal voor de feature in `TASK-BONUS.md`:
   - Claude Code: `/opsx:propose <beschrijving>`
   - Copilot: `/opsx-propose <beschrijving>`
4. Review en verbeter `openspec/changes/<naam>/proposal.md`, `specs/`, `design.md` en `tasks.md`
5. Laat de agent implementeren: `/opsx:apply` (Copilot: `/opsx-apply`)
6. Archiveer: `/opsx:archive`

**Reflectie:**

- Wat stond er in de spec dat niet in AGENTS.md hoort, en andersom?
- Was het resultaat beter dan bij `TASK.md`?
- Wanneer zou je dit wel en niet gebruiken?

---

## Sjabloon: `SCORECARD.template.md`

> Dit bestand staat in de repo. Deelnemers kopiëren het naar `SCORECARD.md` (ge-ignored).

```md
# Scorecard

Agent + model: ******\_\_******

Meest verrassende fout bij baseline: **************\_\_**************

| #   | Conventie                                                                | Hoe check je het?                                                                                                                                                  | Baseline | Rules | Enforce |
| --- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | ----- | ------- |
| 1   | Kleuren/spacing via tokens (`tokens.css`, `var(--rs-*)`)                 | `git add -A && git diff --cached voor-run -- web \| grep -E '^\+.*(#[0-9a-fA-F]{3,8}\b\|rgb\(\|[0-9]+px\|theme)'` + bestaan gebruikte tokens echt in `tokens.css`? |          |       |         |
| 2   | Data via `src/api/` (geen `fetch` in component)           | `git add -A && git diff --cached voor-run -- web/src/features \| grep -E '^\+.*fetch\('`                                                             |          |       |         |
| 3   | UI-componenten uit `src/ui/` (Button, Input, Card)                       | Diff lezen: native `<button>`/`<input>` met eigen styling?                                                                                                         |          |       |         |
| 4   | Geen nieuwe dependencies (utils uit `src/lib/`, bv. `formatEventMoment`) | `git diff voor-run -- '*package.json'`                                                                                                                             |          |       |         |
| 5   | Alle UI-teksten via i18n                                                 | Diff lezen: hardcoded tekst in JSX? Nieuwe keys in `locales/`?                                                                                            |          |       |         |
| 6   | Tests: `getByRole`/`getByLabelText`, gecoloceerd                         | `... \| grep -E 'getByTestId\|data-testid'` + staat de test naast de component (niet in `__tests__/`)?                                                             |          |       |         |
| 7   | Nieuwe code in de juiste feature-map (niet in `src/components/`)         | `git add -A && git diff --cached voor-run --stat`                                                                                                                  |          |       |         |
| 8   | a11y: labels bij inputs, echte buttons, toggle met `aria-pressed`        | Diff lezen: `<div onClick` / `(click)` op div? input zonder label? favoriet-knop zonder `aria-pressed`/label?                                                      |          |       |         |
|     | **Totaal (van 8)**                                                       |                                                                                                                                                                    |          |       |         |

## Geclaimd maar niet gedaan (opdracht 2)

- Rule-ID: \_**\_ Claim: ****\_\_\_\_****** Werkelijkheid: ******\_\_****** Hypothese waarom: ******\_\_******

## Opdracht 3: wat gebeurde er bij de commit?

- Hook faalde? ja / nee Agent herstelde zelf? ja / nee Probeerde `--no-verify`? ja / nee
```

---

## Repo-specificatie (input voor het genereren van de oefen-repo's)

> Deze sectie is voor de trainer. Op basis hiervan wordt de repo later gegenereerd.

### Algemeen

- **Eén repo:** `rockstars-events`, met React.
- **Domein:** "Rockstars Events": een overzicht van events (meetups, workshops, talks) met lijst, detailpagina, favorieten en een profielpagina.
- **Monorepo-opzet:** npm workspaces met `web/` en `api/`. Root-scripts:
  - `dev` (web + api tegelijk)
  - `lint` (ESLint)
  - `lint:css` (Stylelint)
  - `typecheck`
  - `test`
- **Taal in de repo:** Engels (code, docs, comments).
- **Klein houden:** ~25–35 bronbestanden in `web/`, zodat deelnemers in 10 min een beeld hebben.

### `web/`

- Vite + React 19 + TypeScript `strict`
- React Router
- react-i18next
- Vitest + @testing-library/react + user-event
- ESLint (flat config, typescript-eslint) **zonder** de restricted-rules. Die schrijven deelnemers zelf.
- Stylelint met basisconfig **zonder** `color-no-hex`
- Prettier

### `api/`

- Node + Express (of Hono) + TypeScript, data in-memory (JSON-seed)
- Endpoints:
  - `GET /events` (optioneel query `category`)
  - `GET /events/:id`
  - `GET /favorites`
  - `POST /favorites/:eventId`
  - `DELETE /favorites/:eventId`
  - `GET /profile`
  - `PUT /profile`
- Conventies (voor de stretch met geneste `api/AGENTS.md`):
  - Zod-validatie op elke input
  - Error-format `{ error: { code, message } }`
  - Route-handlers dun, logica in `services/`

### Uitgangspunt: een codebase midden in een migratie

Een agent volgt (1) de code die het dichtst bij de taak staat, (2) zijn trainingsdata (`date-fns`, `fetch`, `getByTestId`, …) en (3) wat makkelijk vindbaar is. Daarom is de repo **realistisch rommelig**:

- **`web/src/features/events/` is legacy.** `TASK.md` landt hier, en deze code overtreedt bijna alle conventies. De agent kopieert wat hij ziet.
- **`web/src/features/profile/` is al gemigreerd.** Dit is de _reference implementation_: elke conventie zit erin. Een AGENTS.md kan ernaar verwijzen ("copy patterns from `features/profile/`, not from `features/events/`").
- De conventies staan **alleen** in `CONTRIBUTING.md` (lang, in proza) en in de code van `profile/`. Er is geen instructiebestand.
- **Niet overdrijven.** Er moet één duidelijk goed voorbeeld blijven, anders voelt het oneerlijk ("rigged") en heeft AGENTS.md niets om naar te verwijzen.
- **Framing richting deelnemers** (na de baseline, slide 1a.1): "Deze repo zit midden in een migratie. Net als die van jullie."

### `web/src/features/profile/` (reference)

- Profielpagina: naam, taalvoorkeur, favoriete categorieën, opslaan via de API
- Gebruikt: tokens, `useProfile`-hook via `api/`, `ui/Button` + `ui/Input` + `ui/Card`, `formatEventMoment` ("member since"), i18n, een gecoloceerde test met `getByRole`/`getByLabelText`, `aria-*` correct
- API-endpoints erbij: `GET /profile`, `PUT /profile`

### Geplante conventies + hoe de agent het fout gaat doen

| #   | Conventie (de waarheid)                                                                        | Goed voorbeeld (`profile/`, gedeeld)                                                                                                                                                                    | Lokkertje (`events/`, legacy)                                                                                                                                                                                                                                                                   |
| --- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Kleuren/spacing/radius alleen via tokens in `web/src/styles/tokens.css`                        | Tokens met **niet-raadbare namen**: `--rs-ink-*`, `--rs-surface-*`, `--rs-brand-pop` (= accent), `--rs-space-1..6`, `--rs-radius-*`, plus een dark-mode-variant. Geen token heet `accent` of `primary`. | `web/src/styles/theme.ts` (deprecated, maar nog geïmporteerd door `events/`) met hex-constanten zoals `ACCENT = '#ff4f6d'`. `events/`-CSS heeft hex-kleuren en px-spacing. De taak vraagt de "accent color", dus de agent verzint `var(--color-accent)`, zet een hex, of importeert `theme.ts`. |
| 2   | Data alleen via `web/src/api/` (`apiClient` + hooks) | `useProfile`, met een loading/error-patroon                                                                                                                                          | `EventList` doet zelf `fetch('/api/events')`. Een hook voor favorieten bestaat **nog niet**, dus de agent bouwt hem naar het voorbeeld ernaast.                                                                                          |
| 3   | UI-componenten uit `web/src/ui/` (uitbreiden als iets ontbreekt)                               | `ui/Button` (variants), `ui/Input` (label is verplichte prop), `ui/Card`                                                                                                                                | `events/` gebruikt native `<button className="btn">`. `ui/Button` heeft **geen toggle-variant**: de juiste aanpak is `ui/` uitbreiden (`pressed`-prop), het lokkertje is een eigen knop.                                                                                                        |
| 4   | Geen nieuwe dependencies, utils in `web/src/lib/`                                              | `web/src/lib/time.ts` met `formatEventMoment(date, 'compact' \| 'full')`. `'compact'` geeft precies "Tue 14 Oct, 19:00". Gebruikt in `profile/`.                                                        | `events/` formatteert handmatig met `toLocaleDateString` + string-concatenatie. De gevraagde notatie lokt `date-fns`/`dayjs` uit.                                                                                                                                                               |
| 5   | Alle UI-teksten via i18n                                                                       | `profile/` + header gebruiken `t('…')`, keys in `web/src/locales/en.json` + `nl.json`, taalwisselaar in de header                                                                      | `events/` heeft hardcoded Engelse strings                                                                                                                                                                                                                                                       |
| 6   | Tests gecoloceerd, `getByRole`/`getByLabelText`, geen test-ids                                 | `ProfileForm.test.tsx` naast de component                                                                                                                            | `web/src/features/events/__tests__/EventList.test.tsx` met `getByTestId` + `data-testid` in de markup                                                                                                                                                                                           |
| 7   | Feature-folders: `features/<naam>/`, gedeeld in `ui/`, `lib/`, `api/`                          | `features/profile/`, `features/favorites/` (leeg, alleen `index.ts`)                                                                                                                                    | Legacy-map `web/src/components/` met `Header.tsx` en `Spinner.tsx`. De favorieten-teller in de header belandt daar makkelijk, of in `events/`.                                                                                                                                                  |
| 8   | a11y: echte buttons/links, labels, toggle met `aria-pressed`                                   | `ui/Input` dwingt een label af, `ui/Button` is een `<button>`                                                                                                                                           | De legacy event-card heeft `<div className="card" onClick>` voor de detail-navigatie. Een favoriet-toggle zonder `aria-pressed`/label is de standaardfout.                                                                                                                                      |

### Overige valkuil-versterkers

- **Verouderde README-sectie "Styling":** "Colors live in `theme.ts`." Klopt niet meer, maar het bestand bestaat nog (deprecated). Versterkt lokkertje 1.
- **`CONTRIBUTING.md`:** bevat de echte conventies, maar verspreid in proza over ~2 pagina's, tussen git-workflow en release-info. Noemt `profile/` als voorbeeld. Een agent opent dit zelden uit zichzelf, en dat is realistisch. Bron om te destilleren in opdracht 1b.
- **Comments:**
  - `theme.ts` krijgt `// @deprecated: use tokens.css`. Dat is subtiel en wordt vaak gemist.
  - `events/` krijgt `// TODO: migrate to new patterns (see profile/)`, maar níét "do not copy".
- **Geen** hints in de buurt van de taak die de conventie letterlijk voorzeggen.

### Starter-bestanden in de root

- `TASK.md` (Engels), geschreven als PO-ticket in producttaal, **zonder technische hints**:

  > **Filter & favorite events**
  > As a visitor I want to find events quickly and keep track of the ones I like.
  >
  > - Above the event list, add a search field (searches titles) and a category dropdown.
  > - Each event card gets a favorite (heart) button. Favorites are saved, so they're still there after a reload.
  > - Favorited cards get a border in our accent color.
  > - Show the event date like "Tue 14 Oct, 19:00".
  > - Show how many favorites I have in the header, next to the logo.
  > - Please add tests for the filter and the favorite button.

  **Triggers:** "accent color" (tokens/`theme.ts`), "saved" (API/fetch), "heart button" (`ui/` + a11y), datumnotatie (`date-fns`), "in the header" (`components/`), tests (`__tests__` + test-ids), en alle nieuwe teksten (i18n).

- `TASK-BONUS.md`: "Event sign-up: visitors can sign up for an event from the detail page (name, email, dietary preferences), with validation and a confirmation message. The organiser needs the sign-ups stored." Raakt web + api (`POST /events/:id/signups`), geschikt voor OpenSpec.
- `SCORECARD.template.md`: zie het sjabloon hierboven
- `CONTRIBUTING.md` + `README.md`: zie valkuil-versterkers
- `.gitignore` bevat `SCORECARD.md`
- **Geen** `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `.github/instructions/`, `.claude/`, `.cursorrules` of `docs/ai/`
- `.github/workflows/ci.yml`: `npm ci`, `lint`, `lint:css`, `typecheck`, `test`
- lefthook in root-`devDependencies`, **niet** geconfigureerd (geen `lefthook.yml`, hooks niet geïnstalleerd)

### Checkpoint-branches (voorbeeldoplossingen)

| Branch             | Bevat                                                                                                                                                                                                                                                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `stap-1-agents-md` | `AGENTS.md` (~60 regels) met index, en de regel "Reference implementation: `features/profile/`. `features/events/` is legacy, do not copy its patterns." Plus `docs/ai/styling.md` (met tokentabel: welke token voor welk doel, incl. `--rs-brand-pop` = accent), `docs/ai/data-fetching.md`, `docs/ai/testing.md`, `docs/ai/components.md` |
| `stap-2-rules`     | + rules met ID's (STYLE-01, DATA-01, UI-01, DEPS-01, I18N-01, TEST-01, A11Y-01, STRUCT-01), path-scoped test-rule in alle drie de vormen, `Reporting`-sectie                                                                                                                                                                                |
| `stap-3-enforce`   | + ESLint restricted-rules met instructieve meldingen (`fetch` in features, `date-fns`/`moment`/`dayjs`, import van `theme.ts`, hex in inline styles), Stylelint `color-no-hex`, `lefthook.yml` geconfigureerd, never-do `--no-verify`, voorbeeld-agent hook voor Claude Code en Copilot                                   |

### Kalibratie (vóór de workshop, verplicht)

- Draai de baseline (`TASK.md`, verse sessie, geen persoonlijke instructies) **3× met Claude Code en 3× met Copilot**, met de modellen die de deelnemers gebruiken.
- **Streefwaarde:** gemiddeld **2–4 van de 8** goed bij de baseline, en **≥ 6 van de 8** op `stap-2-rules`.
- **Bijsturen per conventie:**
  - Gaat de agent bij de baseline steeds goed: maak het goede voorbeeld minder vindbaar, of maak het lokkertje sterker.
  - Gaat het ook met `stap-2-rules` structureel fout: maak het goede voorbeeld duidelijker, of verbeter de voorbeeld-rule.
- **Noteer de kalibratie-scores** voor de trainer. Ze zijn handig als vergelijking in de afsluiting.

### Acceptatiecriteria voor de gegenereerde repo's

- `npm install && npm run dev` werkt op een schone machine (Node LTS)
- `npm run lint`, `typecheck` en `test` zijn groen op `main` (dus de legacy-code is wel lint-clean onder de basisconfig)
- De kalibratie haalt de streefwaarden hierboven
- Controleer dat `npm install` op `main` geen `lefthook.yml` en geen git hooks aanmaakt. Het npm-package van lefthook kan bij installatie automatisch `lefthook install` draaien. Gebeurt dat, pas dan de setup aan of laat de opdrachttekst er rekening mee houden.
- Op `stap-3-enforce` blokkeert de pre-commit hook een commit met een hex-kleur, met `fetch` in een feature-component, en met een `date-fns`-import

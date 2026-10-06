# Presentatie: Context engineering voor front-end developers

> **Doelgroep:** 12 front-end/full-stack developers, ervaren met Claude Code / GitHub Copilot en plan mode, weinig ervaring met context engineering.
> **Duur:** ~2 uur (middagdeel). Presentatie (~53 min) en opdrachten (~67 min) wisselen elkaar af.
> **Vorm:** fysiek, iedereen solo achter de laptop, overleggen mag.
> **Leesinstructie:** per slide: **titel**, bullets (de slide-inhoud), *Notities* (wat de spreker vertelt). Scenariovragen hebben het antwoord in de notities. `> [EIGEN VOORBEELD]` = plek voor een praktijkverhaal van de trainer.

---

## Tijdschema

| Tijd | Blok | Vorm | Min |
|---|---|---|---|
| 0:00 | Blok 0: Opening + baseline-run starten | P+O | 5 |
| 0:05 | Blok 1: Context engineering + correctie-ladder (de baseline draait op de achtergrond) | P | 12 |
| 0:17 | Opdracht 1a: baseline scoren | O | 5 |
| 0:22 | Blok 2: AGENTS.md + index | P | 8 |
| 0:30 | Opdracht 1b: AGENTS.md + docs-index | O | 20 |
| 0:50 | Blok 3: Rules + verificatie | P | 8 |
| 0:58 | Opdracht 2: rules + verifiëren + rerun | O | 22 |
| 1:20 | Blok 4: Enforcement | P | 10 |
| 1:30 | Opdracht 3: lint rule + pre-commit hook + rerun | O | 20 |
| 1:50 | Blok 5: Afsluiting | P | 10 |

---

## Blok 0: Opening (5 min)

### Slide 0.1: Context engineering voor front-end developers
- Van "het werkt soms" naar "het werkt elke keer"
- Middagdeel: [naam trainer], [datum]

*Notities:* Kort voorstellen als dat nog niet gebeurd is. Geen lange intro, de groep zit al de hele ochtend.

### Slide 0.2: Vanochtend backend, vanmiddag je agent
- Vanochtend: meer backend doen als frontender
- Meer stack = meer conventies = meer dat je agent níét weet
- Vanmiddag: hoe leer je je agent wat jij weet, en hoe zorg je dat hij zich eraan houdt?

*Notities:* Bruggetje naar de ochtend. Wie full-stack gaat werken, laat de agent ook vaker werken in code die hij zelf minder goed kent. Dan wordt context belangrijker.

### Slide 0.3: Je agent is een senior met geheugenverlies
- Kent elk framework, elke API, elk patroon
- Weet níéts van jóúw project: jullie tokens, jullie API-client, jullie test-afspraken
- En vergeet alles weer na elke sessie

*Notities:* Herkenbaar beeld. Vraag aan de zaal: "Wie heeft de agent deze week iets gecorrigeerd dat hij vorige week ook al fout deed?" Handen tellen. Dat is het probleem van vandaag.

### Slide 0.4: Doe dit nu: start je baseline
1. Open de repo `rockstars-it-clicker`
2. Kopieer de scorecard (`opdrachten/scorecard.md`) naar een plek **buiten** de repo
3. `git tag -f voor-run`
4. Open een **verse** agent-sessie, plak de inhoud van `TASK.md`, druk op enter
5. Laat hem lopen. **Niet ingrijpen, niet corrigeren.**

*Notities:* Hier hoort een QR-code of korte link naar de map `opdrachten/` (die staat bewust niet in de oefen-repo: de agent zou de conventies anders kunnen lezen). Check dat auto-accept edits aan staat, anders zitten ze te klikken. Shell commands blijven op approve: als de agent `npm install <iets>` wil, mogen ze dat goedkeuren maar moeten ze het noteren. De agent draait nu ~5–10 min terwijl jij blok 1 vertelt. Check ook of persoonlijke instructies uit staan (stond in de mail vooraf). Die maken de baseline anders "te goed".

---

## Blok 1: Context engineering + de correctie-ladder (12 min)

### Slide 1.1: Prompt engineering vs context engineering
- **Prompt engineering:** hoe formuleer ik mijn vraag?
- **Context engineering:** wat staat er in het context window op het moment dat de agent beslist?
- Een goede prompt in een slechte context levert nog steeds een slecht resultaat

*Notities:* Plan mode gebruiken ze al, dat is prompt- en procesniveau. Vandaag gaat over wat de agent *weet* voordat je iets vraagt. Een prompt is eenmalig, context is herbruikbaar en deelbaar met het team.

### Slide 1.2: Wat zit er in het context window?
- System prompt van de tool
- Instructiebestanden: `AGENTS.md`, rules
- Files die de agent leest
- Tool-output (terminal, lint, tests)
- Het gesprek zelf

*Notities:* Teken dit als gestapelde blokken. Benadruk: de agent kopieert wat hij ziet. Leest hij een legacy-component met hardcoded kleuren, dan wordt dat het voorbeeld. Bestaande code ís dus ook context (komt terug in blok 3). Alleen het instructiebestand heb je volledig in de hand.

### Slide 1.3: Meer context ≠ betere context
- Het context window is werkgeheugen, en dat is beperkt
- **Context rot:** hoe voller, hoe minder betrouwbaar
- **Lost in the middle:** wat ergens middenin een lange tekst staat, krijgt minder aandacht
- Doel: de *juiste* context, niet de *meeste*

*Notities:* Dit is het tegenargument voor "ik zet alles in één groot bestand". Een instructiebestand van 1000 regels is ook context rot. Dit is meteen de reden voor het index-patroon in blok 2.

### Slide 1.4: De correctie-ladder
| Trede | Wat | Effect |
|---|---|---|
| 1. **Fix it** | Corrigeren in de chat | Werkt nu, maar volgende sessie gebeurt het weer |
| 2. **Rule it** | Vastleggen in AGENTS.md / rules | Beïnvloedt de agent, dwingt niets af |
| 3. **Enforce it** | Lint rule, hook, CI-stap | Deterministisch, geldt voor mens én agent |

*Notities:* Dit is het kernmodel van de middag. Elke opdracht gaat een trede omhoog. Fix it is niet fout: voor een eenmalige afwijking is het prima. Het probleem is dat we bij Fix it blijven hangen voor dingen die structureel zijn. Bijzin over memory-features ("onthoud dit", auto memory): die zijn persoonlijk, niet gedeeld met je team en niet reviewbaar in een PR. Dus geen vervanging voor een rule.

### Slide 1.5: Wanneer ga je een trede omhoog?
- **2× dezelfde fix → rule**
- **Rule genegeerd + objectief checkbaar → enforce**
- Drie beslisvragen:
  - Hoe vaak gaat het mis?
  - Hoe erg is het als het misgaat?
  - Kan een machine het controleren?

*Notities:* "Objectief checkbaar" is de sleutel. "Gebruik geen hex-kleuren" kan een linter checken. "Kies goede namen" niet. Dat blijft een rule, met goede voorbeelden.

### Slide 1.6: Scenario: welke trede?
Bespreek met je buur (1 min):
1. De agent installeert steeds `numeral` om getallen als "1.2M" te tonen, terwijl jullie een eigen `compact()` in `lib/` hebben.
2. De agent geeft component-props elke keer net andere namen (`onClose`, `handleClose`, `closeCallback`).
3. De agent zet overal `any` als hij een type niet snapt.
4. De agent heeft één keer een verkeerde endpoint-URL gebruikt.

*Notities (antwoorden):*
1. **Rule, en daarna enforce.** Eerst een rule ("no new deps; utils in `lib/`"). Gebeurt het toch, dan `no-restricted-imports` voor `numeral`/`pretty-ms`/`humanize-duration` met een melding die naar `compact()` verwijst. Shell-approve voor `npm install` is ook een vangnet.
2. **Rule met voorbeelden.** Naamgeving is moeilijk objectief te checken. Geef een conventie + goed/fout-voorbeeld ("callbacks: `on<Event>`").
3. **Enforce, en dat kan al.** TS `strict` + `@typescript-eslint/no-explicit-any`. Een rule erover schrijven is zonde van je context.
4. **Fix it.** Eenmalig. Gebeurt het vaker, dan klopt er iets niet in je API-client of docs.

Doel van de vraag: de groep merkt dat niet alles een rule moet worden.

### Slide 1.7: Uit de praktijk
> [EIGEN VOORBEELD]: een fout die bij jou bleef terugkomen, en op welke trede je hem uiteindelijk hebt opgelost.

*Notities:* Kort verhaal, max 1 minuut. Bij voorkeur een verhaal waarin een rule niet genoeg bleek en je moest enforcen.

---

## Opdracht 1a: Baseline scoren (5 min)

### Slide 1a.1: Opdracht 1a: hoe deed je agent het?
- Stop je agent als hij nog bezig is
- Loop je scorecard door → kolom **baseline**
- Noteer: welke fout verraste je het meest?
- Daarna: `git reset --hard voor-run && git clean -fd` + sessie sluiten

*Notities:* Zie `opdrachten/01-stap-1-agents-md.md` (1a) en de trainer-uitwerking `opdrachten/trainer/01-stap-1-uitwerking.md`. Loop rond en vraag mensen naar hun score. Verwachting: 2–4 van de 8 goed. Noteer een paar scores op het bord voor de afsluiting.

**Onthulling na het scoren:** "Deze repo zit midden in een migratie, net als die van jullie. `features/shop/` is legacy, `features/profile/` doet het goed. Waar keek jullie agent naar?" Meestal naar `shop/`, want daar landde de taak. Wie heeft `Card highlighted` gevonden? Wie wist dat de spotlight-kleur `--rs-spotlight` heet? Dat is het punt: **bestaande code is ook context, en vaak sterker dan je instructie.** Jullie weten welk deel de waarheid is, de agent niet. Is het bij iemand toch goed gegaan? Prima. Die verschillen in de zaal laten zien dat de agent "soms werkt", en dat is het probleem van vandaag.

---

## Blok 2: AGENTS.md + het index-patroon (8 min)

### Slide 2.1: AGENTS.md: één bestand voor elke agent
- Open standaard ([agents.md](https://agents.md)): "README voor agents"
- Gelezen door o.a. GitHub Copilot, Claude Code, Cursor, Codex
- Eén bron van waarheid in plaats van `CLAUDE.md` + `copilot-instructions.md` + `.cursorrules`
- Geneste bestanden: **de dichtstbijzijnde AGENTS.md** in de mappenboom gaat voor

*Notities:* Let op bij Claude Code (vanaf v2.1.277): die leest `AGENTS.md` alleen als er **geen** `CLAUDE.md` in de werkmap of daarboven staat. Heb je al een `CLAUDE.md`, zet daar dan `@AGENTS.md` in (een import), dan leest Claude beide. Copilot leest `AGENTS.md` overal in de repo, en de dichtstbijzijnde wint. Check bij twijfel de actuele docs, want dit verandert snel.

### Slide 2.2: Wat hoort erin?
- **Wat is dit project?** (2 regels)
- **Commands:** dev, test, lint, typecheck
- **Structuur:** waar staat wat (kort!)
- **Top-conventies:** de 5–10 dingen die een nieuwe collega fout zou doen
- **Never do:** harde grenzen
- **Index:** verwijzingen naar diepere docs

*Notities:* De lakmoesproef: "Zou een nieuwe senior collega dit op dag één fout doen?" Zo ja, dan hoort het erin. Commands zijn ondergewaardeerd: een agent die weet hoe hij `npm run lint` draait, gaat zichzelf controleren.

### Slide 2.3: Wat hoort er níét in?
- Wat de linter / Prettier al afdwingt ("use 2 spaces")
- Kopie van de README (installatie, badges)
- Generiek advies ("write clean, maintainable code")
- Wat de agent zelf uit de code haalt ("we use TypeScript")
- Verouderde info, want die is erger dan geen info

*Notities:* Elke regel kost context en aandacht. Generiek advies is ruis: het model doet dat al, of het helpt niet. Verouderde info is gevaarlijk omdat de agent er vol vertrouwen naar handelt.

### Slide 2.4: Het index-patroon (progressive disclosure)
```md
# AGENTS.md

Rockstars IT Clicker: idle clicker game (earn Lines of Code, hire devs).
`web/` = React front-end, `api/` = Node API.

## Commands
- `npm run dev`: start web + api
- `npm run lint` / `npm run typecheck` / `npm test`

## Conventions (top 5)
1. Styling only via tokens. See docs/ai/styling.md
2. Data only via `web/src/api/`. See docs/ai/data-fetching.md
...

## Reference implementation
Copy patterns from `web/src/features/profile/`.
`web/src/features/shop/` is legacy (migration in progress): do not copy it.

## Docs index (read the relevant file before you start)
- docs/ai/styling.md: tokens, theming, spacing
- docs/ai/data-fetching.md: API client, hooks, error states
- docs/ai/testing.md: Testing Library, query priorities
- docs/ai/components.md: ui/ library, a11y, i18n
```

*Notities:* AGENTS.md blijft kort (< ~100 regels) en verwijst door. De agent leest het detail-doc alleen als het relevant is voor de taak. Zo houd je de context schoon. De instructie "read the relevant file before you start" is belangrijk. Zonder die zin gaat de agent niet altijd zelf doorklikken. De sectie "Reference implementation" is misschien wel de waardevolste regel: je wijst de agent het goede voorbeeld aan. Die kennis heb jij als developer, en de agent kan hem niet uit de code halen.

### Slide 2.5: Geneste AGENTS.md
```
AGENTS.md            ← project-breed: commands, structuur, index
web/AGENTS.md        ← front-end: tokens, components, testing
api/AGENTS.md        ← backend: validatie, error-format, endpoints
```
- De agent werkt in `api/` → leest `api/AGENTS.md`
- Je front-end kennis zit niet in de weg bij backend-werk, en andersom

*Notities:* Dit sluit aan op de ochtend: als frontender in de backend werken betekent ook andere conventies. Geneste bestanden houden context relevant per gebied. Bij monorepo's per package.

### Slide 2.6: Jouw front-end kennis = de waarde
Wat een agent niet uit de code haalt, maar jij wel weet:
- Design tokens / design system, en waarom
- Componentstructuur en -bibliotheek (`ui/`)
- State management: wat waar
- Data fetching: welke laag, loading/error states
- a11y-afspraken
- i18n
- Test-filosofie (Testing Library: query by role)
- Browser support, performance-budget

*Notities:* Dit is waar ze als front-end developer het verschil maken. De agent kent React beter dan wie dan ook, maar weet niet welke keuzes júllie gemaakt hebben en waarom.

### Slide 2.7: Laat de agent helpen, maar review als een PR
- `/init` (Claude) of de agent vragen "analyseer deze repo en stel een AGENTS.md voor"
- Behandel het resultaat als een **PR van een junior**
- Schrappen > toevoegen

*Notities:* `/init` levert vaak een lang, beschrijvend bestand op: mappenstructuur, techstack. Dat haalt de agent ook zelf uit de code. Waardevol is wat níét in de code staat: het *waarom* en de afspraken.

### Slide 2.8: Scenario: wat schrap je?
```md
# AGENTS.md (fragment, 400 regels totaal)
- Write clean, maintainable and well-documented code.
- We use React 17 with class components.        ← (repo draait React 19)
- Use 2 spaces for indentation and single quotes.
- Always think about security.
- Project structure:
  - src/
    - features/
      - shop/
        - ShopPage.tsx
        - UpgradeCard.tsx
        ... (80 regels boom)
- Colors: always use var(--rs-*) tokens, never hex.
```
Bespreek met je buur: wat blijft, wat gaat eruit?

*Notities (antwoord):* Alleen de laatste regel blijft. Clean code en security = generiek. React 17 = verouderd en dus schadelijk. Indentation = Prettier. De mappenboom = de agent kan zelf `ls` doen, één regel "feature folders under `src/features/<name>/`" is genoeg.

---

## Opdracht 1b: AGENTS.md + docs-index (20 min)

### Slide 1b.1: Opdracht 1b: schrijf je AGENTS.md
- Verken de repo met je front-end blik
- Bronnen: README (deels verouderd!), `CONTRIBUTING.md`, code-comments, de code zelf
- Schrijf `AGENTS.md` (≤ ~80 regels) + minimaal 2 bestanden in `docs/ai/`
- Test: verse sessie → "Hoe haal ik data op in dit project, en welke docs heb je gelezen?"
- Commit je werk!

*Notities:* Zie `opdrachten/01-stap-1-agents-md.md` (1b) en `opdrachten/trainer/01-stap-1-uitwerking.md`. Hard stop na 20 min. Wie niet klaar is, kan instappen via branch `stap-1-agents-md`.

---

## Blok 3: Rules + verificatie (8 min)

### Slide 3.1: Van conventie naar rule
- AGENTS.md beschrijft het project
- Een **rule** is één specifieke, toetsbare instructie
- Rules ontstaan uit fouten: je baseline-scorecard is je backlog

*Notities:* AGENTS.md gaat over oriëntatie, rules over gedrag. In de praktijk staan rules vaak in AGENTS.md of in de docs-index. Het onderscheid gaat om de vorm, niet om de locatie.

### Slide 3.2: Anatomie van een goede rule
```md
## STYLE-01: Only design tokens for color and spacing
Scope: `web/src/**/*.{css,tsx}`

Use CSS custom properties from `web/src/styles/tokens.css` for every
color, spacing and radius value. Never use hex, rgb(), hsl() or raw px
for spacing.

Why: we support dark mode and white-label themes; hardcoded values break both.

✅ color: var(--rs-amp-300); padding: var(--rs-space-3);
❌ color: #6b7280; padding: 12px;
```
- **ID**: zodat je ernaar kunt verwijzen en kunt verifiëren
- **Scope**: waar geldt het?
- **Instructie**: concreet, met pad/naam
- **Why**: het model generaliseert beter als het de reden kent
- **✅/❌**: voorbeelden zijn sterker dan beschrijvingen

*Notities:* Het *why* is onderschat. Zonder why houdt de agent zich aan de letter. Met why snapt hij ook randgevallen (bijvoorbeeld een SVG-fill, een box-shadow-kleur).

### Slide 3.3: Slecht vs goed
| ❌ Slecht | ✅ Goed |
|---|---|
| "Use design tokens" | STYLE-01 hierboven |
| "Write good tests" | "Query by role/label (`getByRole`, `getByLabelText`). No `getByTestId`. Why: tests mirror how users and screen readers find elements." |
| "Prefer accessible components where possible" | "Interactive elements are `<button>` or `<a>`, never `<div onClick>`. Every input has a `<label>`." |

*Notities:* Woorden als "prefer", "where possible" en "try to" geven het model toestemming om het níét te doen.

### Slide 3.4: Rules scopen: alleen laden waar relevant
| Aanpak | Hoe |
|---|---|
| **Tool-onafhankelijk** | `docs/ai/testing.md` + index in AGENTS.md |
| **GitHub Copilot** | `.github/instructions/testing.instructions.md` met frontmatter `applyTo: "**/*.test.{ts,tsx}"` |
| **Claude Code** | `.claude/rules/testing.md` met frontmatter `paths:` (lijst met globs) |

```md
---
applyTo: "**/*.test.{ts,tsx}"      # Copilot
---
```
```md
---
paths:                                     # Claude Code
  - "**/*.test.{ts,tsx}"
---
```

*Notities:* Claude laadt een path-scoped rule pas als hij een bestand dat matcht leest of bewerkt. Copilot past `applyTo`-instructies toe op matchende bestanden. Het nadeel van tool-specifiek: je onderhoudt het voor elke tool apart. Heb je een gemengd team, start dan tool-onafhankelijk via `docs/ai/` en kies alleen tool-specifiek als scoping echt nodig is. De tool-onafhankelijke variant hangt wel af van de agent die zelf het doc opent.

### Slide 3.5: Heeft de agent de rule echt toegepast?
Zet in AGENTS.md:
```md
## Reporting
End every task with a section `Applied rules:` listing each rule ID
you applied and the file(s) where you applied it.
```
Daarna:
1. Lees de lijst
2. Vraag door: "Laat per rule zien waar precies"
3. **Controleer zelf in de diff**

*Notities:* Het ID-systeem maakt verificatie mogelijk. Zonder ID's krijg je vage antwoorden ("ik heb de conventies gevolgd").

### Slide 3.6: Self-report ≠ bewijs
- De agent kan claimen dat hij een rule toepaste… terwijl dat niet zo is
- Niet uit kwade wil: het is een taalmodel dat een plausibel verslag schrijft
- Een rule beïnvloedt, maar dwingt niets af
- → Daarom: **enforce it** (blok 4)

*Notities:* Dit ontdekken ze zelf in opdracht 2. Laat het hier al vallen als teaser: "Let in de opdracht op of de claim klopt."

### Slide 3.7: Waarom worden rules genegeerd?
- **Te vaag**: "prefer", "where possible"
- **Te diep weggestopt**: regel 340 van 400
- **Tegenstrijdig**: twee rules of docs die elkaar tegenspreken
- **Niet geladen**: verkeerde scope/glob, of de agent opende het doc niet
- **Conflict met bestaande code**: de agent kopieert het legacy-component dat ernaast staat

*Notities:* Het laatste punt is het lastigst: code is ook context, en vaak sterker dan je instructie. Oplossingen: een reference implementation aanwijzen ("copy patterns from `features/profile/`"), legacy expliciet benoemen ("`features/shop/` is legacy, do not copy"), opruimen, of enforcen. In de oefen-repo hebben ze dit bij de baseline zelf gezien.

### Slide 3.8: Scenario: waarom wordt deze rule genegeerd?
```md
(AGENTS.md, regel 312)
- Try to use the shared components where possible.
```
En de agent werkt in `web/src/features/shop/`, waar upgrades gekocht worden via een `<div className="upgrade-card" onClick=…>` en knoppen eigen `<button className="btn">`-elementen zijn.

Bespreek met je buur: waarom gaat dit mis, en hoe herschrijf je het?

*Notities (antwoord):* Vaag ("try", "where possible"), diep weggestopt, geen pad (welke shared components?), geen why, geen voorbeeld, en de legacy-code ernaast laat het tegenovergestelde zien. Herschreven:
```md
## UI-01: Use components from web/src/ui/
Buttons, inputs and cards come from `web/src/ui/` (Button, Input, Card).
Missing a variant? Extend ui/ instead of styling native elements ad hoc.
`features/shop/` is legacy: do not copy its markup. Reference: `features/profile/`.
Why: consistent styling, focus states and a11y are built into ui/.
✅ <Button variant="primary" onClick={save}>…</Button>
❌ <div className="btn" onClick={save}>…</div>
```

---

## Opdracht 2: Rules + verificatie (22 min)

### Slide 2o.1: Opdracht 2: rule it
- Kies 3 fouten uit je baseline → 3 rules (ID, scope, why, ✅/❌)
- Minimaal 1 path-scoped (tests)
- `Applied rules`-instructie toevoegen
- Commit, `git tag -f voor-run`, verse sessie, `TASK.md` opnieuw → scorecard kolom **rules**
- Vraag de agent welke rules hij heeft toegepast, en **controleer de claim**

*Notities:* Zie `opdrachten/02-stap-2-rules.md` en `opdrachten/trainer/02-stap-2-uitwerking.md`. Hard stop na 22 min. Checkpoint: `stap-2-rules`. Let tijdens het rondlopen op mensen die een "geclaimd maar niet gedaan" vinden, en vraag ze om dat in de afsluiting te delen.

---

## Blok 4: Enforcement (10 min)

### Slide 4.1: Een rule is een verzoek, enforcement is een poort
- Rule: "doe dit alsjeblieft"
- Enforcement: "zonder dit kom je er niet door"
- Deterministisch: altijd, voor iedereen

*Notities:* Bruggetje vanuit opdracht 2: "Wie had een rule die geclaimd maar niet toegepast was?" Handen. Daarom.

### Slide 4.2: Optie A: agent hooks
- Scripts die de agent-tool zelf uitvoert op vaste momenten
- **Claude Code:** `PreToolUse`, `PostToolUse`, `Stop`, `UserPromptSubmit`, … in `.claude/settings.json`
- **Copilot (CLI + cloud agent):** `preToolUse`, `postToolUse`, `agentStop`, … in `.github/hooks/*.json`
- Use cases: lint na elke edit, gevaarlijke commands blokkeren, tests draaien vóór "klaar"

```json
// .claude/settings.json: lint elk bestand dat Claude bewerkt
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{
        "type": "command",
        "command": "jq -r '.tool_input.file_path' | xargs npx eslint --max-warnings=0 1>&2 || exit 2"
      }]
    }]
  }
}
```

*Notities:* Exit code 2 bij `PostToolUse` toont de stderr aan Claude. De edit is al gebeurd, maar Claude ziet de lint-fout en herstelt die. `PreToolUse` met exit 2 blokkeert de actie zelfs. Copilot-hooks werken in de Copilot CLI en de cloud agent. Een `preToolUse` kan daar een tool call weigeren. Ondersteuning in de editor verschilt per versie, dus check de actuele docs.

### Slide 4.3: Nadelen van agent hooks
- **Per tool** configureren: Claude-hook ≠ Copilot-hook
- Geldt **niet** voor collega's zonder (die) agent, en ook niet voor jou als je zelf typt
- Minder zichtbaar: zit in tool-config, niet in je normale toolchain
- Elke nieuwe AI-tool = opnieuw beginnen

*Notities:* Hooks zijn krachtig, maar je bouwt je kwaliteitsborging rond één leverancier.

### Slide 4.4: Optie B: agent-onafhankelijk (mijn voorkeur)
- **ESLint**: `no-restricted-imports`, `no-restricted-syntax`, `no-restricted-globals`, per map via `files`
- **Stylelint**: `color-no-hex`, `declaration-strict-value`
- **TypeScript strict**
- **Architectuurgrenzen**: `eslint-plugin-boundaries`, dependency-cruiser
- **Tests**
- **Git hooks**: lefthook (of husky)
- **CI** als laatste poort

**Werkt voor elke agent, elke tool, elke collega, en voor jezelf.**

*Notities:* Mijn standpunt: investeer in de toolchain die je toch al hebt. Een lint rule die je vandaag schrijft, werkt ook met de AI-tool van volgend jaar. En een agent kan prima lint-output lezen. Hooks kunnen dezelfde lint aanroepen, als extra snelle feedback.

### Slide 4.5: De foutmelding is een prompt
```js
// eslint.config.js (fragment)
{
  files: ['web/src/features/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-globals': ['error', {
      name: 'fetch',
      message: 'Do not call fetch in features. Use a hook from web/src/api/ ' +
               '(see docs/ai/data-fetching.md).',
    }],
    'no-restricted-imports': ['error', {
      patterns: [{
        group: ['numeral', 'pretty-ms', 'humanize-duration'],
        message: 'No formatting libraries. Use compact() from web/src/lib/numbers.ts ' +
                 'or humanizeSeconds() from web/src/lib/time.ts.',
      }],
    }],
  },
}
```
- Schrijf meldingen als **instructie**: wat moet het wél zijn, en waar staat de uitleg?
- De agent leest de melding en corrigeert zichzelf

*Notities:* "Unexpected use of fetch" is een melding voor mensen die het al weten. "Use a hook from web/src/api/ (see …)" is een instructie, waarmee de lint-fout zelf context wordt. Voor kleuren in CSS: Stylelint `"color-no-hex": [true, { "message": "Use var(--rs-*) from tokens.css (see docs/ai/styling.md)" }]`.

### Slide 4.6: Defense in depth
```
editor (ESLint plugin)
   ↓
agent hook (optioneel, draait dezelfde lint)
   ↓
git pre-commit (lefthook)
   ↓
CI (dezelfde checks, kan niet overgeslagen worden)
```
- Elke laag draait **dezelfde** regels: één bron van waarheid
- Hoe eerder de feedback, hoe goedkoper de correctie

*Notities:* De agent hook is de snelste feedback voor de agent. De pre-commit hook geldt voor iedereen. CI is het vangnet.

### Slide 4.7: Valkuil: `--no-verify`
- Een agent die vastloopt op een hook, kan `git commit --no-verify` proberen
- In AGENTS.md: "Never use `--no-verify`. Fix the reported issue instead."
- Shell-approve aan laten voor git commands
- CI draait dezelfde checks, dus omzeilen helpt uiteindelijk niet

*Notities:* Dit gebeurt echt. Het is ook een mooi voorbeeld van alle drie de treden samen: rule (never-do) + enforce (CI).

### Slide 4.8: Scenario: hook of lint rule?
"Je wilt voorkomen dat de agent `fetch` direct in componenten gebruikt."
- Agent hook, lint rule, of allebei?
- Wat zet je in de foutmelding?

*Notities (antwoord):* Lint rule (`no-restricted-globals` met `files`-scope op componenten/features), want die geldt voor iedereen. Eventueel een agent hook die dezelfde lint draait na een edit, voor snellere feedback aan de agent. De melding zegt wat het wél moet zijn + verwijst naar het doc (zie slide 4.5). Een hook die zelf naar `fetch` grept is fragiel en tool-specifiek.

---

## Opdracht 3: Enforce it (20 min)

### Slide 3o.1: Opdracht 3: enforce it
1. Zet een objectief checkbare rule om naar een **lint rule** met een instructieve melding
2. Configureer de **pre-commit hook** (lefthook, al geïnstalleerd)
3. Commit, `git tag -f voor-run`, verse sessie: laat de agent `TASK.md` uitvoeren **én committen**
4. Zie je de hook falen → de agent die zichzelf herstelt? Scorecard kolom **enforce**

*Notities:* Zie `opdrachten/03-stap-3-enforce.md` en `opdrachten/trainer/03-stap-3-uitwerking.md` (incl. de opties voor het legacy-conflict). Checkpoint: `stap-3-enforce`. Stretch: dezelfde lint als agent hook.

---

## Blok 5: Afsluiting (10 min)

### Slide 5.1: Hoe deden jullie agents het?
- Handen omhoog: hoeveel van de 8 goed bij **baseline**? Bij **rules**? Bij **enforce**?
- 2–3 mensen: wat verraste je?
- Wie vond een "geclaimd maar niet gedaan"?

*Notities:* Gebruik de scores die je bij opdracht 1a op het bord zette. Verwacht beeld: rules geven een flinke sprong, maar zelden 8/8. Enforcement trekt het objectief checkbare dicht. Wat overblijft (naamgeving, structuur) blijft afhankelijk van goede rules en review.

### Slide 5.2: De ladder, samengevat
- **Fix it** voor eenmalige dingen
- **Rule it** als je het 2× hebt gefixt
- **Enforce it** als de rule genegeerd wordt én een machine het kan checken
- Context = AGENTS.md (kort) + index naar docs + rules met ID en why
- Enforcement = agent-onafhankelijk waar het kan, met meldingen die instructies zijn

*Notities:* De take-home slide. Laat hem even staan.

### Slide 5.3: Context is code
- AGENTS.md en rules horen in **PR-review**
- Opschonen: verouderde context is erger dan geen context
- Eigenaarschap: wie onderhoudt welk doc?
- Wekelijkse vraag aan je team: **"Wat heb ik deze week vaker dan 2× gecorrigeerd?"**

*Notities:* Context engineering is geen eenmalige setup, het is onderhoud. Net als je lint-config.

### Slide 5.4: Volgende stap: specs (OpenSpec)
- AGENTS.md + rules = **hoe** we bouwen
- Specs = **wat** we bouwen
- OpenSpec-flow: `propose` → specs + design + tasks → `apply` → `archive`
- Elke change krijgt een eigen map: `openspec/changes/<naam>/` met `proposal.md`, `specs/`, `design.md`, `tasks.md`
- → Bonusopdracht in `opdrachten/04-bonus-openspec.md`

*Notities:* Installatie: `npm install -g @fission-ai/openspec@latest` (Node ≥ 20.19), daarna `openspec init`. De slash commands verschillen per tool: in Claude Code `/opsx:propose`, `/opsx:apply`, `/opsx:archive`, in Copilot `/opsx-propose` enzovoort. Positioneer het als een logische volgende stap: eerst goede context, dan spec-driven werken. Plan mode in je tool is een lichte vorm hiervan, maar een plan verdwijnt na de sessie terwijl een spec in de repo blijft.

### Slide 5.5: Huiswerk
- Kies in je **eigen project** één fout die je agent steeds maakt
- Maak er een **rule** van (met ID, why, ✅/❌)
- Kan een machine het checken? Maak er een **lint rule** van
- Bonus: zet AGENTS.md + index op in je project

*Notities:* Sluit af met de vraag wie het deze week gaat doen.

### Slide 5.6: Vragen?
- Repo's + opdrachten: [link]
- Contact: [gegevens trainer]

---

## Bronnen voor de trainer (fact-check, oktober 2026)
- AGENTS.md-standaard: https://agents.md
- Claude Code memory, AGENTS.md, `.claude/rules`: https://code.claude.com/docs/en/memory
- Claude Code hooks: https://code.claude.com/docs/en/hooks-guide en https://code.claude.com/docs/en/hooks
- Copilot custom instructions (AGENTS.md, `applyTo`): https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions
- Copilot hooks: https://docs.github.com/en/copilot/reference/hooks-reference
- OpenSpec: https://github.com/Fission-AI/OpenSpec

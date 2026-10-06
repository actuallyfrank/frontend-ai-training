# Repo-requirements: Rockstars IT Clicker

> Input voor het genereren van de oefen-repo voor de workshop "Context engineering voor front-end developers".
> Zie `presentatie.md` en `opdrachten.md` voor de context.
> Taal in de repo: **Engels** (code, docs, comments, UI-basistaal). UI-vertaling: EN + NL.

---

## 1. Doel en uitgangspunt

De repo is het oefenterrein voor drie runs van dezelfde feature-taak (`TASK.md`): zonder context, met rules, en met enforcement. Om het effect van context zichtbaar te maken, moet een agent **zonder context aantoonbaar fouten maken**, en **met goede context grotendeels goed gaan**.

Daarom is dit een codebase **midden in een migratie**, net als echte projecten:
- **`web/src/features/shop/` is legacy.** `TASK.md` landt hier. Deze code overtreedt bijna alle conventies. Een agent kopieert wat hij ziet.
- **`web/src/features/profile/` is de reference implementation.** Elke conventie zit erin. Een goede AGENTS.md verwijst ernaar.
- De conventies staan **alleen** in `CONTRIBUTING.md` (proza) en in de code. Er is geen instructiebestand voor agents.
- **Niet overdrijven:** de rest van de app (clicker, ui, lib, api) is netjes. Er blijft één duidelijk goed voorbeeld, anders voelt het "rigged" en heeft AGENTS.md niets om naar te verwijzen.

**Framing richting deelnemers** (na de baseline): "Deze repo zit midden in een migratie. Net als die van jullie."

---

## 2. Concept: Rockstars IT Clicker

Een idle/cookie-clicker: je bouwt een IT-bedrijf op door *Lines of Code* (LoC) te schrijven. Je huurt developers in, koopt tools en infra, en investeert in bedrijfscultuur. Speels, herkenbare IT-humor, in de **Team Rockstars-huisstijl** (geel `#ffe000` op zwart/`#232323`, Permanent Marker voor koppen).

### Gameplay (light idle)
- **Commit-knop** (groot, midden op het scherm): +`clickPower` LoC per klik (start: 1). Kleine "+1"-animatie.
- **Passief inkomen:** LoC/sec = de som van `locPerSecond × owned` over alle upgrades.
- **Game-loop:** tikt elke 100 ms en telt `LoC/sec × 0.1` op.
- **Prijs:** `ceil(baseCost × 1.15^owned)`.
- **Kopen** kan alleen als `loc >= price`. Daarna stijgt de prijs.
- **Opslaan:** autosave elke 10 s + direct na elke aankoop (`PUT /api/save`). Laden bij het opstarten (`GET /api/save`).
- **Header:** logo/naam, totaal LoC (compact), LoC/sec, navigatie (Game · Shop · Profile), taalwisselaar EN/NL.
- **Balans:** binnen ~2 minuten klikken kun je een Junior Dev kopen. Na ~10 minuten heb je een paar categorieën ontgrendeld.

### Upgrades (seed-data in de API)
| id | category | name (EN) | baseCost | locPerSecond | clickPower | flavour (EN) |
|---|---|---|---|---|---|---|
| `intern` | people | Intern | 15 | 0.1 | 0 | Copies from Stack Overflow, but fast. |
| `junior-dev` | people | Junior Dev | 100 | 1 | 0 | Asks "quick question?" every four minutes. |
| `medior-dev` | people | Medior Dev | 1,100 | 8 | 0 | Knows where the bodies are buried in the codebase. |
| `senior-dev` | people | Senior Dev | 12,000 | 47 | 0 | Says "it depends" and is always right. |
| `rockstar` | people | Rockstar | 130,000 | 260 | 0 | Deploys on Friday. Nothing breaks. |
| `tech-lead` | people | Tech Lead | 1,400,000 | 1,400 | 0 | Mostly in meetings, still somehow productive. |
| `rubber-duck` | tools | Rubber Duck | 50 | 0 | 1 | Listens without judging. |
| `mechanical-keyboard` | tools | Mechanical Keyboard | 500 | 0 | 2 | Clackety-clack. Your colleagues love it. |
| `second-monitor` | tools | Second Monitor | 5,000 | 20 | 0 | One for code, one for Slack. |
| `ai-pair-programmer` | tools | AI Pair Programmer | 50,000 | 150 | 0 | Writes 1,000 lines. You delete 900. |
| `coffee-machine` | culture | Coffee Machine | 200 | 2 | 0 | Fuel. Do not touch during stand-up. |
| `ping-pong-table` | culture | Ping-Pong Table | 3,000 | 15 | 0 | Productivity: questionable. Morale: excellent. |
| `friday-drinks` | culture | Friday Drinks | 30,000 | 120 | 0 | The best architecture decisions happen at 17:30. |
| `ci-pipeline` | infra | CI Pipeline | 20,000 | 90 | 0 | Green means go. Red means coffee. |
| `kubernetes-cluster` | infra | Kubernetes Cluster | 200,000 | 600 | 0 | Nobody knows how it works. It works. |
| `serverless` | infra | Serverless | 2,000,000 | 2,000 | 0 | There are still servers. Don't tell anyone. |

- Namen en flavour texts staan **vertaald in `web/src/locales/{en,nl}.json`** onder `upgrades.<id>.name` / `upgrades.<id>.flavour`. NL-flavour mag lekker Nederlands zijn, bijvoorbeeld voor de Intern: *"Kopieert van Stack Overflow, maar wel snel."*
- De API levert daarnaast nog een veld `name` (EN), gemarkeerd als `@deprecated` in het schema. De legacy shop gebruikt dat veld, de nette code gebruikt i18n-keys.

### Bewust buiten scope
Auth, multiplayer (behalve de bonus), offline progress, prestige, random events, geluid, theme-toggle.

---

## 3. Tech stack

| Laag | Keuze |
|---|---|
| Root | npm workspaces (`web`, `api`), Node LTS |
| Front-end | Vite + React 19 + TypeScript `strict`, React Router, react-i18next |
| Styling | Plain CSS (per component een `.css`-bestand) + CSS custom properties. **Geen** Tailwind, CSS-in-JS of UI-library |
| Tests (web) | Vitest + @testing-library/react + @testing-library/user-event + jsdom |
| Lint | ESLint flat config + typescript-eslint + react-hooks, **zonder** restricted-rules. Stylelint met `stylelint-config-standard`, **zonder** `color-no-hex`. Prettier |
| Backend | Node + Express + TypeScript + Zod, in-memory store met JSON-seed (reset bij herstart is ok). Draaien via `tsx watch` |
| Tests (api) | Vitest + supertest (een paar route-tests) |
| Git hooks | **Geen.** Deelnemers installeren en configureren `lefthook` zelf in opdracht 3 (`npm install -D lefthook`). Het npm-package draait bij installatie `lefthook install`, dat een voorbeeldconfig en hooks aanmaakt, dus het mag niet al in de repo zitten |
| CI | `.github/workflows/ci.yml`: `npm ci`, `npm run lint`, `npm run lint:css`, `npm run typecheck`, `npm test` |

**Root-scripts:**
- `dev`: web + api tegelijk, bijvoorbeeld via `concurrently`
- `lint`: ESLint, web + api
- `lint:css`: Stylelint, web
- `typecheck`: `tsc --noEmit`, web + api
- `test`: web + api

**Poorten:** web `5173`, api `3000` (gebonden aan `127.0.0.1`, zodat een bezette poort een duidelijke fout geeft in plaats van stil bij een ander proces uit te komen). Vite proxy: `/api` → `http://127.0.0.1:3000`. Te overschrijven met `WEB_PORT` / `API_PORT`.

---

## 4. Mappenstructuur

```
rockstars-it-clicker/
├── README.md                     # incl. verouderde sectie "Styling"
├── CONTRIBUTING.md               # echte conventies, in proza
├── TASK.md
├── TASK-BONUS.md
├── SCORECARD.template.md
├── .gitignore                    # incl. SCORECARD.md
├── .github/workflows/ci.yml
├── package.json                  # workspaces + scripts (geen lefthook)
├── web/
│   ├── index.html
│   ├── vite.config.ts            # proxy /api
│   ├── eslint.config.js
│   ├── .stylelintrc.json
│   └── src/
│       ├── main.tsx
│       ├── App.tsx               # router + layout
│       ├── i18n.ts
│       ├── locales/
│       │   ├── en.json
│       │   └── nl.json
│       ├── styles/
│       │   ├── tokens.css        # de waarheid
│       │   ├── global.css
│       │   └── theme.ts          # @deprecated, nog gebruikt door shop
│       ├── api/
│       │   ├── client.ts         # apiClient + ApiError
│       │   ├── useSaveGame.ts
│       │   └── useProfile.ts
│       ├── lib/
│       │   ├── numbers.ts        # compact()
│       │   ├── numbers.test.ts
│       │   ├── time.ts           # humanizeSeconds()
│       │   ├── time.test.ts
│       │   └── game/
│       │       ├── GameProvider.tsx   # context + useGame()
│       │       ├── useGameLoop.ts
│       │       ├── pricing.ts         # priceOf, locPerSecond, clickPower
│       │       └── pricing.test.ts
│       ├── ui/
│       │   ├── Button.tsx / Button.css / Button.test.tsx
│       │   ├── Input.tsx / Input.css
│       │   ├── Select.tsx / Select.css
│       │   ├── Card.tsx / Card.css
│       │   └── Badge.tsx / Badge.css
│       ├── components/           # LEGACY-map (pre-feature-folders)
│       │   ├── Header.tsx / Header.css
│       │   └── Spinner.tsx
│       └── features/
│           ├── clicker/          # netjes
│           │   ├── ClickerPage.tsx
│           │   ├── CommitButton.tsx / .css / .test.tsx
│           │   ├── StatsPanel.tsx
│           │   └── TeamSummary.tsx / .test.tsx
│           ├── shop/             # LEGACY ← TASK.md landt hier
│           │   ├── ShopPage.tsx
│           │   ├── UpgradeCard.tsx
│           │   ├── shop.css
│           │   └── __tests__/ShopPage.test.tsx
│           ├── profile/          # REFERENCE IMPLEMENTATION
│           │   ├── ProfilePage.tsx
│           │   ├── ProfileForm.tsx / .css / .test.tsx
│           │   └── ProfileStats.tsx / .test.tsx
│           └── wishlist/
│               └── index.ts      # leeg (export {}), plek voor nieuwe feature
└── api/
    └── src/
        ├── server.ts
        ├── routes/               # upgrades, save, wishlist, profile
        ├── services/
        ├── schemas/              # zod
        └── data/seed.json
```

---

## 5. Features in detail

### 5.1 `features/clicker/` (netjes)
- `CommitButton`: `ui/Button` (variant `hero`), `aria-label` via i18n, "+N"-animatie met CSS.
- `StatsPanel`: LoC, LoC/sec, click power via `compact()`.
- `TeamSummary`: lijst met gekochte upgrades (`t('upgrades.<id>.name')` × aantal).
- Tests gecoloceerd, met `getByRole`.

### 5.2 `features/shop/` (LEGACY, bewust slecht)
- `ShopPage.tsx`:
  - `useEffect(() => { fetch('/api/upgrades').then(r => r.json()).then(setUpgrades) }, [])`, dus geen `apiClient`, geen error-state, en een eigen `loading`-boolean met `components/Spinner`.
  - Gebruikt `useGame()` voor `loc`, `owned` en `buy(id)`. Dat is ok, de game-state is gedeeld.
  - Lijst gegroepeerd per categorie, met hardcoded koppen: "People", "Tools", "Culture", "Infra".
- `UpgradeCard.tsx`:
  - `<div className="upgrade-card" onClick={() => onBuy(upgrade.id)} data-testid="upgrade-card">`, dus kopen via een div zonder keyboard-support.
  - Toont `upgrade.name` (het deprecated API-veld), een eigen hardcoded Engelse flavour-map (`shop/flavours.ts`, dubbel met de locales) en een hardcoded "Owned: {n}".
  - Berekent de prijs zelf (`Math.ceil(baseCost * Math.pow(1.15, owned))`) in plaats van `priceOf()` uit `lib/game`.
  - Prijs handmatig geformatteerd: `price >= 1e6 ? (price / 1e6).toFixed(1) + 'M' : price >= 1e3 ? ...`
  - Inline style `style={{ opacity: affordable ? 1 : 0.5, borderColor: affordable ? COLORS.accent : COLORS.muted }}`, met `COLORS` uit `styles/theme.ts`.
- `shop.css`: hex-kleuren (`#232323`, `#919191`, …) en px-spacing (`padding: 12px`).
- `__tests__/ShopPage.test.tsx`: mockt `global.fetch` en gebruikt `getByTestId('upgrade-card')`.
- Bovenaan `ShopPage.tsx`: `// TODO: migrate to new patterns (see features/profile)`. **Niet** "do not copy".
- Lint-clean onder de basisconfig, dus CI is groen.

### 5.3 `features/profile/` (REFERENCE)
- `ProfilePage`: gebruikt `useProfile()` (loading/error/data), met een error-state via `ui/Card` + i18n.
- `ProfileForm`:
  - `ui/Input` (bedrijfsnaam, label verplicht), `ui/Select` (taal), avatar-keuze als radiogroup (emoji: 🎸 🥁 🎤 🎹)
  - `ui/Button` om op te slaan, met een succesmelding via `role="status"`
- `ProfileStats`: "Playing for {humanizeSeconds(now - startedAt)}", "{compact(totalLoc)} LoC written", "{n} upgrades".
- Alles via tokens, alle teksten via `t()`, tests gecoloceerd met `getByRole`/`getByLabelText`.

### 5.4 `components/Header.tsx` (legacy-locatie, half gemigreerd)
- Gebruikt al tokens en i18n, maar staat nog in de oude `components/`-map.
- Toont LoC, LoC/sec, nav-links, taalwisselaar.
- **Valkuil:** de agent zet de wishlist-teller-logica (fetch + state) direct in `Header.tsx`. Goed is: een `WishlistCount`-component in `features/wishlist/` + een `useWishlist`-hook in `api/`, waarbij de Header alleen importeert.

### 5.5 `ui/`
- `Button`: variants `primary`, `secondary`, `ghost`, `hero`. Altijd een `<button>`, focus-ring via token. **Geen** `pressed`/toggle-variant (de juiste oplossing voor de ster-knop is `ui/` uitbreiden met `pressed` → `aria-pressed`).
- `Input`: `label` is een verplichte prop en wordt gekoppeld via `useId`. Ondersteunt `type="search"`.
- `Select`: `label` verplicht, `options`-prop.
- `Card`: met een optionele `highlighted`-prop (border in `--rs-spotlight`). Dit is precies wat de TASK nodig heeft, maar alleen te vinden als je `ui/` bekijkt.
- `Badge`: kleine teller, handig voor in de header.

### 5.6 `api/` (front-end)
- `client.ts`:
  - `apiClient.get/post/put/delete<T>(path, body?)`, base `/api`, JSON
  - Maakt van elke niet-2xx-response een `ApiError { code, message, status }`
  - Comment: `// All server communication goes through this client (error mapping, base URL).`
- `useProfile()`: `{ data, error, isLoading, update }`.
- `useSaveGame()`: `{ load, save }`, gebruikt door `GameProvider`.
- **Geen** `useUpgrades` of `useWishlist`. Die moet de agent maken, en de vraag is of hij het patroon van `useProfile` volgt of dat van de shop.

### 5.7 `lib/`
- `numbers.ts`: `compact(n: number): string`, bijvoorbeeld `999` → "999", `1234` → "1.2K", `1_200_000` → "1.2M", `3.4e9` → "3.4B". Gebouwd op `Intl.NumberFormat`. Getest.
- `time.ts`: `humanizeSeconds(seconds: number, style: 'short' | 'long')`. Short: "2m 30s", "3h 12m", "45s". Long: "2 minutes 30 seconds" (via i18n-plural is niet nodig, EN is genoeg). Getest.
- `game/`:
  - `GameProvider` + `useGame()`, met `{ loc, locPerSecond, clickPower, owned, upgrades, click(), buy(id) }`
  - `useGameLoop`
  - `pricing.ts` als pure functies
  - Er is **geen** `timeToAfford`. Die moet de agent maken (een nette plek is `lib/game/pricing.ts`, met test).

---

## 6. Geplante conventies (de 8 valkuilen)

| # | Conventie (de waarheid) | Goed voorbeeld | Lokkertje |
|---|---|---|---|
| 1 | Kleuren, spacing en radius alleen via `web/src/styles/tokens.css` | Rock-tokens met **niet-raadbare namen** (zie §7). Geen token heet `accent`, `primary` of `color-*` | `styles/theme.ts` (`@deprecated`) met `COLORS.accent = '#ffe000'`, nog geïmporteerd door shop. `shop.css` vol hex/px. De TASK vraagt de "spotlight color": de agent verzint `var(--color-spotlight)`, zet een hex, of importeert `COLORS` |
| 2 | Data alleen via `web/src/api/` (client + hooks) | `useProfile`, `useSaveGame` | `ShopPage` doet zelf `fetch`. Er is geen wishlist-hook |
| 3 | UI-componenten uit `web/src/ui/` (uitbreiden als iets ontbreekt) | `Button`, `Input`, `Select`, `Card` (`highlighted`!) in clicker/profile | Shop gebruikt eigen divs en buttons. `Button` mist een toggle-variant |
| 4 | Geen nieuwe dependencies, utils in `web/src/lib/` | `compact()`, `humanizeSeconds()`, gebruikt in profile en clicker | Shop formatteert handmatig. "1.2M" en "2m 30s" lokken `numeral` / `pretty-ms` / `humanize-duration` / `date-fns` uit |
| 5 | Alle UI-teksten via i18n (`t()`, keys in `locales/en.json` + `nl.json`) | Clicker, profile en header | Shop: hardcoded koppen, "Owned", deprecated `name`-veld |
| 6 | Tests naast de component, `getByRole` / `getByLabelText`, geen test-ids | `ProfileForm.test.tsx`, `CommitButton.test.tsx` | `shop/__tests__/` met `getByTestId` + `data-testid` in de markup |
| 7 | Feature-folders: nieuwe feature-code in `features/<naam>/`, gedeeld in `ui/`, `lib/`, `api/` | `features/profile/`, lege `features/wishlist/` | Legacy-map `components/`: de teller-logica belandt in `Header.tsx` |
| 8 | a11y: echte buttons, labels, toggles met `aria-pressed` | `ui/Button`, `ui/Input` met label | Kopen via `<div onClick>`. Een ster-knop zonder `aria-pressed` of toegankelijke naam is de standaardfout |

### Overige versterkers
- **README.md**, sectie "Styling": *"Colors and spacing live in `src/styles/theme.ts`."* Klopt niet meer, maar het bestand bestaat nog.
- **CONTRIBUTING.md** (~2 pagina's): git-workflow, release-notes, en tussendoor in proza de echte conventies. Noemt `features/profile` als voorbeeld van "how we write features now". Een agent opent dit zelden uit zichzelf.
- **Comments:** `theme.ts` → `/** @deprecated use tokens.css */` (subtiel). In shop: `// TODO: migrate`.
- **Geen** hints in de buurt van de taak die de conventie letterlijk voorzeggen.

---

## 7. Design tokens (Team Rockstars-huisstijl)

Kleuren komen uit de huisstijl van teamrockstars.nl (`--awb-color1..8` in hun CSS): zwart `#000`, antraciet `#232323`, grijs `#919191` / `#e3e3e3`, wit, **geel `#ffe000`** (accent), lichtgeel `#ffef80`, blauw `#00a8ea`. Feedbackkleuren: groen `#4a8356`, rood `#c80000`. Fonts: DIN 2014 (Typekit, met licentie; alleen gebruikt als hij lokaal geïnstalleerd is, anders Arial/Helvetica) en Permanent Marker (Google Fonts) voor koppen.

`web/src/styles/tokens.css`, met dark als standaard ("on stage") en een light-variant via `@media (prefers-color-scheme: light)` ("soundcheck"). De tokennamen blijven bewust niet-raadbaar:

| Token | Gebruik | Dark (standaard) | Light |
|---|---|---|---|
| `--rs-stage-900` | app-achtergrond | `#000` | `#fff` |
| `--rs-stage-800` | panelen, header | `#161616` | `#f5f5f5` |
| `--rs-stage-700` | cards | `#232323` | `#fff` |
| `--rs-stage-600` | randen | `#3d3d3d` | `#e3e3e3` |
| `--rs-amp-100` | primaire tekst | `#fff` | `#232323` |
| `--rs-amp-300` | secundaire tekst | `#e3e3e3` | `#4d4d4d` |
| `--rs-amp-500` | gedempte tekst | `#919191` | `#919191` |
| `--rs-spotlight` | **accent** (highlights, focus, primary button) | `#ffe000` | `#ffe000` |
| `--rs-spotlight-soft` | accent-achtergrond | `rgb(255 224 0 / 15%)` | `/ 25%` |
| `--rs-spotlight-ink` | tekst op geel | `#232323` | `#232323` |
| `--rs-encore` | succes / betaalbaar | `#6dbb7c` | `#4a8356` |
| `--rs-pyro` | fout / waarschuwing | `#ff6b6b` | `#c80000` |
| `--rs-signal` | info, links | `#00a8ea` | `#0079a8` |
| `--rs-space-1..6` | spacing | 4 / 8 / 12 / 16 / 24 / 32 px | |
| `--rs-radius-sm/md/pill` | radius | 2px / 4px / 999px | |
| `--rs-font-body` / `--rs-font-display` | tekst / koppen | DIN 2014 → Arial / Permanent Marker | |

- De hex-waarden staan **alleen** in `tokens.css` (plus de legacy-bestanden `theme.ts` en `shop.css`). Stylelint wordt in opdracht 3 zo ingesteld dat `tokens.css` uitgezonderd is van `color-no-hex`.
- `theme.ts` (legacy) bevat dezelfde huisstijlkleuren als losse hex-constanten.

---

## 8. API-specificatie (`api/`)

| Methode + pad | Request | Response |
|---|---|---|
| `GET /api/upgrades` | | `Upgrade[]`: `{ id, category, name /* @deprecated */, baseCost, locPerSecond, clickPower }` |
| `GET /api/save` | | `{ loc, owned: Record<id, number>, startedAt, totalLoc }` |
| `PUT /api/save` | zelfde shape (Zod) | `204` |
| `GET /api/wishlist` | | `{ upgradeIds: string[] }` |
| `POST /api/wishlist/:upgradeId` | | `201 { upgradeIds }`, of `404` bij een onbekend id |
| `DELETE /api/wishlist/:upgradeId` | | `200 { upgradeIds }` |
| `GET /api/profile` | | `{ companyName, avatar, language }` |
| `PUT /api/profile` | zelfde shape (Zod: companyName 2–40 tekens, avatar uit een enum) | `200 profile` |

- **De wishlist-endpoints bestaan al.** De TASK is daarmee front-end werk. Of de agent ze vindt en via `apiClient` aanroept, is valkuil 2. Een agent die de wishlist in `localStorage` zet, faalt ook op 2.
- **Conventies** (voor de stretch met een geneste `api/AGENTS.md`):
  - Zod-schema in `schemas/` voor elke input
  - Errors altijd `{ error: { code, message } }`
  - Routes dun, logica in `services/`
  - Ook in de API zit één legacy-route (`routes/upgrades.ts` met inline logica), zodat ook daar context nodig is.
- Single player, één vaste speler, geen auth.

---

## 9. `TASK.md` (feature-taak, 3× uitgevoerd)

Geschreven als PO-ticket in producttaal, **zonder technische hints**:

```md
# Shop: find upgrades faster & wishlist

As a player I want to find upgrades quickly and keep track of the ones I'm saving up for.

- Add a search field (searches upgrade names) and a category filter
  (People, Tools, Culture, Infra) above the shop.
- Every upgrade gets a star button to put it on my wishlist. The wishlist is
  saved, so it's still there after a reload.
- Wishlisted upgrades get a border in our spotlight color.
- Show prices like "1.2M LoC". When I can't afford an upgrade yet, show
  "affordable in 2m 30s" based on my current LoC per second.
- Show the number of wishlisted upgrades in the header.
- Please add tests for the filter and the star button.
```

| Trigger | Raakt valkuil |
|---|---|
| "search field", "category filter" | 3 (`ui/Input`/`Select`), 5 (i18n), 8 (labels) |
| "star button" | 3 (`Button` uitbreiden), 8 (`aria-pressed`) |
| "saved … after a reload" | 2 (`apiClient` + nieuwe hook vs `fetch`/`localStorage`) |
| "spotlight color" | 1 (`--rs-spotlight` / `Card highlighted` vs hex/`theme.ts`) |
| "1.2M LoC", "2m 30s" | 4 (`compact`/`humanizeSeconds` vs nieuwe dependency) |
| "in the header" | 7 (`features/wishlist/` vs logica in `components/Header.tsx`) |
| "add tests" | 6 (gecoloceerd + role-queries vs `__tests__` + test-ids) |
| alle nieuwe teksten | 5 |

---

## 10. `TASK-BONUS.md`: Leaderboard (OpenSpec-bonus)

```md
# Leaderboard

As a player I want to see how my company ranks against my colleagues.

- I can submit my score (my company name from my profile + total LoC written).
- A Leaderboard page shows the top 10, highest first, with my own entry highlighted.
- If I'm not in the top 10, show my position below the list.
- Show a friendly empty state when there are no scores yet.
```
- Raakt web + api: `POST /api/scores`, `GET /api/leaderboard`.
- Spec-waardige randgevallen die deelnemers in de spec moeten uitwerken: validatie, maximaal 1 inzending per minuut, gelijke scores, naamswijziging, lege staat.

---

## 11. Overige starter-bestanden

- **`SCORECARD.template.md`:** het sjabloon uit `opdrachten.md`.
- **`.gitignore`:** `node_modules`, `dist`, `SCORECARD.md`.
- **Niet aanwezig:** `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `.github/instructions/`, `.github/hooks/`, `.claude/`, `.cursorrules`, `docs/ai/`, `lefthook.yml`, `openspec/`.

---

## 12. Checkpoint-branches (voorbeeldoplossingen)

| Branch | Bevat (cumulatief) |
|---|---|
| `stap-1-agents-md` | `AGENTS.md` (~60 regels): commands, structuur, top-conventies, never-do, docs-index, en *"Reference implementation: `web/src/features/profile/`. `web/src/features/shop/` is legacy (migration in progress): do not copy its patterns."* Plus `docs/ai/styling.md` (tokentabel: welke token waarvoor, `--rs-spotlight` = accent, `Card highlighted`), `docs/ai/data-fetching.md`, `docs/ai/components.md` (ui/, a11y, i18n), `docs/ai/testing.md`. Optioneel `api/AGENTS.md` |
| `stap-2-rules` | + rules met ID's: STYLE-01, DATA-01, UI-01, DEPS-01, I18N-01, TEST-01, A11Y-01, STRUCT-01. De test-rule path-scoped in alle drie de vormen (`docs/ai/testing.md`, `.github/instructions/testing.instructions.md`, `.claude/rules/testing.md`). `Reporting`-sectie (Applied rules) |
| `stap-3-enforce` | + ESLint: `no-restricted-globals` (`fetch` in `src/features/**`), `no-restricted-imports` (`numeral`, `pretty-ms`, `humanize-duration`, `date-fns`, `**/styles/theme`), `no-restricted-syntax` (hex-literals). Stylelint: `color-no-hex` (behalve `tokens.css`). Ook `no-restricted-syntax` voor klikbare divs en `getByTestId` in tests. Alle meldingen als instructie (rule-ID + wat wél + doc). **Legacy-voorbeeld (keuze trainer): bulk suppressions**: `web/eslint-suppressions.json` en `web/stylelint-suppressions.json` leggen de bestaande overtredingen vast, nieuwe overtredingen falen wél. `lefthook` als devDependency + `lefthook.yml` (pre-commit: lint, lint:css, typecheck, test). Never-do: `--no-verify` en suppressions uitbreiden. Agent hooks: `.claude/settings.json` (PostToolUse) en `.github/hooks/lint.json` (postToolUse), beide via `scripts/lint-edited-file.mjs` |

---

## 13. Kalibratie (vóór de workshop, verplicht)

- Draai de baseline (`TASK.md`, verse sessie, persoonlijke instructies uit) **3× met Claude Code en 3× met Copilot**, met de modellen die de deelnemers gebruiken. Scoor met de scorecard.
- **Streefwaarden:** baseline gemiddeld **2–4 van de 8** goed, `stap-2-rules` **≥ 6 van de 8**.
- **Bijsturen per conventie:**
  - Gaat het bij de baseline steeds goed? Maak het lokkertje sterker of het goede voorbeeld minder vindbaar.
  - Gaat het ook op `stap-2-rules` structureel fout? Maak het goede voorbeeld duidelijker of verbeter de voorbeeld-rule.
- Leg de kalibratie-scores vast voor de trainer, als vergelijking in de afsluiting.

---

## 14. Acceptatiecriteria

- [ ] `npm install && npm run dev` werkt op een schone machine (Node LTS). Het spel is speelbaar in de browser
- [ ] `npm run lint`, `lint:css`, `typecheck` en `test` zijn groen op `main` (de legacy-code is lint-clean onder de basisconfig)
- [ ] `lefthook` staat in geen enkele `package.json`, en `npm install` maakt geen `lefthook.yml` of git hooks aan
- [ ] Alle 8 lokkertjes uit §6 zijn aanwezig. Het goede voorbeeld per conventie is aanwezig in profile/clicker/ui/lib
- [ ] Savegame, wishlist en profiel blijven bewaard over een page reload (zolang de API draait)
- [ ] Een Junior Dev is binnen ~2 minuten klikken te kopen
- [ ] De kalibratie haalt de streefwaarden uit §13
- [ ] Op `stap-3-enforce` blokkeert de pre-commit hook een commit met (a) een hex-kleur in een feature-CSS, (b) `fetch` in `src/features/**`, (c) een `numeral`-import. Telkens met een leesbare, instructieve melding
- [ ] De checkpoint-branches bouwen op elkaar voort en zijn allemaal groen in CI

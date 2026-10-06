# Trainer: uitwerking stap 1 (baseline + AGENTS.md)

> Alleen voor de trainer. Niet delen met deelnemers vóór de stap klaar is.

## 1a Baseline: wat je kunt verwachten

Kalibratiedoel: gemiddeld **2–4 van de 8** goed (zie `calibration.md`). Typische fouten in deze repo:

| # | Conventie | Typische baseline-fout | Waarom de agent dit doet |
|---|---|---|---|
| 1 | Tokens | `COLORS.accent` uit `theme.ts`, een verzonnen `var(--color-accent)` / `var(--spotlight)`, of `#ffe000` | De taak zegt "spotlight color"; de shop gebruikt `theme.ts`, de README zegt dat kleuren in `theme.ts` staan |
| 2 | Data | `fetch('/api/wishlist')` in `ShopPage`/`Header`, of de wishlist in `localStorage` | `ShopPage` doet het voor met `fetch`; er bestaat nog geen wishlist-hook |
| 3 | ui/ | Eigen `<button className="star">`, eigen `<input>`/`<select>` | `Button` heeft geen pressed-variant; de shop gebruikt geen ui/ |
| 4 | Deps | `pretty-ms`, `numeral`, `humanize-duration` of `date-fns` installeren | De notaties "1.2M LoC" en "2m 30s" in de taak |
| 5 | i18n | Hardcoded "Search upgrades", "affordable in …", "Wishlist" | De shop is volledig hardcoded Engels |
| 6 | Tests | Tests in `shop/__tests__/` met `getByTestId` | Het bestaande voorbeeld ernaast |
| 7 | Map | Wishlist-state + fetch direct in `components/Header.tsx` | "in the header" + de legacy-map |
| 8 | a11y | Ster als `<span onClick>` of zonder `aria-pressed`/label; kopen blijft een div | `UpgradeCard` is een klikbare div |

Let op bij het scoren:
- Een zelfgeschreven formatter (dubbel met `compact()`) is géén nieuwe dependency. Conventie 4 is dan formeel goed, maar het is wel een mooi bespreekpunt ("de agent vond `lib/` niet").
- "Affordable in" vraagt om `useGame()` (LoC/s). Een agent die de upgrades opnieuw fetcht, mist dat `useGame()` ze al heeft.

## Onthulling na het scoren (slide 1a.1)

"Deze repo zit midden in een migratie, net als die van jullie. `features/shop/` is legacy, `features/profile/` doet het goed. Waar keek jullie agent naar?"

Vragen aan de zaal:
- Wie had `Card highlighted` gevonden?
- Wie wist dat de spotlight-kleur `--rs-spotlight` heet?
- Wie had een agent die `theme.ts` gebruikte (en dus de verouderde README geloofde)?

Kernpunt: **bestaande code is ook context, en vaak sterker dan je instructie.**

## 1b AGENTS.md: wat een goede versie bevat

Een AGENTS.md hoeft niet lang te zijn. De waardevolste regels zijn de regels die de agent níét uit de code kan halen:

1. **Reference implementation:** "Copy patterns from `web/src/features/profile/`. `web/src/features/shop/` is legacy, do not copy." Dit is veruit de belangrijkste regel.
2. **Tokens:** het accent heet `--rs-spotlight`; `theme.ts` en de README-sectie zijn verouderd; `Card highlighted` bestaat.
3. **Data:** alles via `apiClient` + een hook in `web/src/api/` (zoals `useProfile`); game-data via `useGame()`; de wishlist-endpoints bestaan al.
4. **Helpers:** `compact()` en `humanizeSeconds()` in `web/src/lib/`.
5. **i18n:** keys in `en.json` én `nl.json`; upgrade-namen via `upgrades.<id>.name`.
6. **Commands**, zodat de agent zichzelf controleert.

Veelgemaakte fouten van deelnemers:
- `/init`-output ongefilterd overnemen: lange mappenboom, techstack, dingen die de agent zelf ziet.
- De README-sectie "Styling" overnemen: die is bewust verouderd.
- Alles in AGENTS.md proppen in plaats van te verwijzen naar `docs/ai/`.
- Geen instructie om de docs te lezen: dan opent de agent ze vaak niet.

**Testvraag** ("Hoe haal ik data op…"). Goed antwoord: via `apiClient` (`web/src/api/client.ts`) in een hook zoals `useProfile`, en game-data via `useGame()`. Gelezen: `AGENTS.md` + `docs/ai/data-fetching.md`.

## Voorbeelduitwerking

Branch `stap-1-agents-md`, bron in `checkpoints/stap-1-agents-md/`:
- `AGENTS.md` (51 regels)
- `docs/ai/styling.md`, `data-fetching.md`, `components.md`, `testing.md`
- `api/AGENTS.md` (stretch)

## Rondloop-tips

- Mensen die te lang verkennen: "Kijk naar `profile/` en `shop/` naast elkaar. Wat is het verschil?"
- Mensen die alleen generieke regels schrijven: "Wat zou een nieuwe senior collega op dag één fout doen in déze repo?"
- Hard stop na 20 minuten. Wie niet klaar is, switcht naar `stap-1-agents-md`.

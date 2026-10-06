# Stap 1: Baseline + AGENTS.md

**Correctie-ladder:** van niets naar *Rule it*, eerste trede
**Tijd:** 1a start bij de opening (scoren: 5 min) · 1b: 20 min

---

## 1a: Baseline

**Doel:** zien wat je agent doet **zonder** projectkennis. Dit is je nulmeting.

1. Zorg dat je op `main` staat en dat alles schoon is:
   ```bash
   git switch main && git status
   ```
2. Markeer het startpunt:
   ```bash
   git tag -f voor-run
   ```
3. Open een **verse** agent-sessie, plak de inhoud van `TASK.md` en laat hem lopen.
   - Niet ingrijpen, niet corrigeren, geen extra uitleg geven.
   - Wil de agent een package installeren? Keur goed, maar noteer het.
4. Terwijl de agent werkt, luister je naar de presentatie.
5. Is de agent klaar (of is de tijd om)? Loop de checks in je [scorecard](scorecard.md) langs en vul de kolom **Baseline** in.
6. Noteer bovenaan je scorecard welke fout je het meest verraste.
7. Gooi het werk van de agent weg:
   ```bash
   git reset --hard voor-run && git clean -fd
   ```
   Sluit de agent-sessie.

**Klaar als:** de kolom Baseline is ingevuld en het werk van de agent is weggegooid.

---

## 1b: AGENTS.md met docs-index

**Doel:** jouw front-end kennis over dit project vastleggen, zó dat elke agent hem vindt, zonder de context op te blazen.

### Stappen

1. **Verken de repo met je front-end blik.** Begin bij:
   - `web/src/styles/`
   - `web/src/api/`
   - `web/src/ui/`
   - `web/src/lib/`
   - `web/src/features/`
   - de bestaande tests
   - `CONTRIBUTING.md` en de `README.md`

   > ⚠️ Deze repo zit midden in een migratie, net als echte projecten. Niet alles klopt nog: sommige docs zijn verouderd en een deel van de code is legacy. Zoek uit welk deel van de code het *goed* doet, en vertel de agent dat. Jij bepaalt wat de waarheid is.

2. **Schrijf `AGENTS.md` in de root** (maximaal ~80 regels) met:
   - wat dit project is (maximaal 2 regels)
   - de commands (`npm run dev`, `lint`, `lint:css`, `typecheck`, `test`)
   - de structuur, kort en zonder volledige mappenboom
   - je top-5 conventies, elk met een verwijzing naar een doc
   - never do: harde grenzen
   - een **docs-index**, met de instructie dat de agent het relevante doc leest voordat hij begint
3. **Schrijf minimaal 2 bestanden in `docs/ai/`**, bijvoorbeeld `styling.md` en `data-fetching.md`. Leg het *waarom* uit en geef voorbeelden.
4. **Commit** je werk:
   ```bash
   git add -A && git commit -m "context: AGENTS.md + docs"
   ```
5. **Test** in een verse sessie:
   > Hoe haal ik data op in dit project? En welke instructie- of docs-bestanden heb je hiervoor gelezen?

### Tips

- Laat de agent gerust een eerste versie maken (`/init` in Claude Code, of vraag "analyseer deze repo en stel een AGENTS.md voor"). Behandel het resultaat als een PR van een junior: **schrappen > toevoegen**.
- Wat de linter of Prettier al afdwingt, hoort er niet in.
- Wat de agent zelf uit de code haalt ("we use TypeScript"), hoort er niet in.
- Verouderde informatie is erger dan geen informatie.
- **Claude Code:** Claude leest `AGENTS.md` alleen als er geen `CLAUDE.md` is. Heb je toch een `CLAUDE.md`, zet er dan `@AGENTS.md` in.
- **Copilot** leest `AGENTS.md` ook, en de dichtstbijzijnde in de mappenboom wint.

### Klaar als

De agent beantwoordt de testvraag correct (data gaat via de API-client en hooks in `web/src/api/`, niet met `fetch` in een component) en noemt `AGENTS.md` en het juiste docs-bestand.

### Stretch

- Maak een geneste `api/AGENTS.md` met de backend-conventies (validatie, error-format, waar logica hoort).
- Test of de agent het juiste bestand gebruikt als je hem iets vraagt over `api/`.

### Vastgelopen?

```bash
git switch stap-1-agents-md
```

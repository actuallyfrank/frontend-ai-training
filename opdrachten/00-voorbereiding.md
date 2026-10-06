# Stap 0: Voorbereiding en werkwijze

## Thuis (~10 minuten)

1. Clone de oefen-repo:
   ```bash
   git clone <link volgt> rockstars-it-clicker
   cd rockstars-it-clicker
   ```
2. Installeer de dependencies (in de root, dat installeert `web/` en `api/`):
   ```bash
   npm install
   ```
3. Start de app:
   ```bash
   npm run dev
   ```
   - Spel: http://localhost:5173
   - API: http://127.0.0.1:3000

   Is een poort bezet? Start dan met andere poorten:
   ```bash
   WEB_PORT=5174 API_PORT=3001 npm run dev
   ```
4. Speel even. Klik op **Commit**, koop een stagiair in de shop, kijk op je profiel. Zo weet je waar de taak over gaat.
5. Check dat je agent werkt: vraag hem een comment toe te voegen aan `web/src/main.tsx` en draai dat terug.
6. Zet **auto-accept edits** aan (Claude Code: `acceptEdits` permission mode / Copilot: agent mode zonder bevestiging per edit). Laat **shell commands op approve** staan, zodat je ziet wanneer je agent iets wil installeren.
7. Zet je **persoonlijke instructies** tijdelijk uit, zodat je baseline eerlijk is:
   - Claude Code: hernoem `~/.claude/CLAUDE.md` (als je die hebt) en zet auto memory uit
   - Copilot: zet persoonlijke instructies en memory uit

   Na de workshop zet je ze weer terug.

## Werkwijze per run (lees dit eerst!)

Je voert dezelfde feature-taak (`TASK.md`) drie keer uit. Om eerlijk te vergelijken begint elke run schoon, met alleen jouw context-werk erbij.

**Voor elke run:**

```bash
git add -A && git commit -m "context: <wat je toevoegde>"   # je eigen context-werk bewaren
git tag -f voor-run                                           # markeer het startpunt
```

Start daarna een **verse agent-sessie** (Claude: nieuwe sessie of `/clear` / Copilot: nieuwe chat) en plak de inhoud van `TASK.md`.

**Wat heeft de agent veranderd?**

```bash
git add -A && git diff --cached voor-run --stat               # overzicht
git add -A && git diff --cached voor-run                      # volledige diff
```

**Na elke run (na het scoren):**

```bash
git reset --hard voor-run && git clean -fd                    # agent-werk weggooien
```

Sluit daarna de agent-sessie.

> ⚠️ `git clean -fd` verwijdert alle niet-gecommitte, niet-genegeerde bestanden. Commit dus eerst je context-werk.

## Scorecard

Kopieer [scorecard.md](scorecard.md) naar een plek **buiten** de repo-map, bijvoorbeeld je notities of het bureaublad. Zo overleeft hij elke reset, en kan je agent hem niet lezen.

## Checkpoints

Loop je achter? Elke stap heeft een branch met een voorbeelduitwerking. De branches bouwen op elkaar voort:

```
main → stap-1-agents-md → stap-2-rules → stap-3-enforce
```

```bash
git switch stap-1-agents-md
```

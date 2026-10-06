# Trainer: uitwerking bonus (OpenSpec)

> Alleen voor de trainer.

## Wat een goede spec voor het leaderboard bevat

**Capabilities**, bijvoorbeeld `leaderboard` (web) en `scores-api` (api).

**Eisen met scenario's:**
- Score insturen: bedrijfsnaam uit het profiel + `totalLoc`. Validatie: naam 2–40 tekens, LoC ≥ 0.
- Rate limit: maximaal 1 inzending per minuut, anders `429` met het standaard error-format.
- Top 10, hoogste eerst. Bij gelijke scores wint de eerdere inzending.
- De eigen inzending gemarkeerd (`Card highlighted`). Niet in de top 10? Dan de eigen positie onder de lijst.
- Lege staat: een vriendelijke, vertaalde melding.
- Naamswijziging in het profiel: telt de nieuwe naam voor nieuwe inzendingen?

**Design-keuzes:** een nieuwe hook `useLeaderboard` in `web/src/api/`, routes + service + Zod-schema in `api/`, een nieuwe route `/leaderboard` en een nav-link in de header.

## Bespreekpunten

- De spec dwingt randgevallen af die een agent anders zelf invult (rate limit, gelijke scores).
- AGENTS.md en de rules blijven gelden tijdens `/opsx:apply`: checkt de agent ze nog?
- Plan mode in je tool lijkt hierop, maar verdwijnt na de sessie. Een spec blijft in de repo en is reviewbaar.

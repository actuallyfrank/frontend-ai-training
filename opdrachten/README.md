# Opdrachten: Context engineering voor front-end developers

Je werkt **solo**, overleggen met je buren mag en wordt aangemoedigd. Elke stap heeft een **hard stopmoment**. Niet klaar? Stap bij de volgende stap in via de checkpoint-branch.

| Bestand | Wat | Tijd |
|---|---|---|
| [00-voorbereiding.md](00-voorbereiding.md) | Setup (thuis) + werkwijze per run | thuis ~10 min |
| [01-stap-1-agents-md.md](01-stap-1-agents-md.md) | Baseline + AGENTS.md met docs-index | 5 + 20 min |
| [02-stap-2-rules.md](02-stap-2-rules.md) | Rules schrijven en verifiëren | 22 min |
| [03-stap-3-enforce.md](03-stap-3-enforce.md) | Lint rule + git pre-commit hook | 20 min |
| [04-bonus-openspec.md](04-bonus-openspec.md) | Spec-driven werken met OpenSpec | bonus |
| [scorecard.md](scorecard.md) | Scorecard om je agent te beoordelen | |

De rode draad is de **correctie-ladder**:

1. **Fix it**: corrigeren in de chat (de volgende sessie gaat het weer mis)
2. **Rule it**: vastleggen in AGENTS.md en rules (beïnvloedt, maar dwingt niets af)
3. **Enforce it**: lint rule, hook, CI (deterministisch, voor mens én agent)

Je voert drie keer dezelfde feature-taak uit (`TASK.md` in de repo): zonder context, met rules, en met enforcement. Met de scorecard zie je wat elke stap oplevert.

> Deze opdrachtbestanden staan bewust **niet** in de oefen-repo. Alles wat in de repo staat, kan je agent lezen.

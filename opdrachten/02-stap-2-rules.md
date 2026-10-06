# Stap 2: Rule it, rules + verificatie

**Correctie-ladder:** *Rule it*
**Tijd:** 22 minuten

**Doel:** fouten uit je baseline omzetten naar rules die de agent volgt, en controleren óf hij ze volgt.

---

## Stappen

### 1. Kies 3 fouten uit je baseline-scorecard

Kies het liefst fouten die je in de praktijk ook herkent.

### 2. Schrijf voor elke fout een rule

Gebruik dit formaat:

```md
## STYLE-01: Only design tokens for colour and spacing
Scope: `web/src/**/*.{css,tsx}`

Use CSS custom properties from `web/src/styles/tokens.css` for every colour,
spacing and radius value. Never use hex, rgb(), hsl() or raw px for spacing.

Why: we support a dark and a light theme; hardcoded values break the light theme.

✅ color: var(--rs-amp-300); padding: var(--rs-space-3);
❌ color: #919191; padding: 12px;
```

Een goede rule heeft:
- een **ID**, zodat je kunt verifiëren
- een **scope**: waar geldt hij?
- een **concrete instructie**, met paden en namen
- een **why**: het model generaliseert beter als het de reden kent
- een **✅/❌-voorbeeld**

Vermijd woorden als "prefer", "try to" en "where possible". Die geven het model toestemming om het níét te doen.

### 3. Maak minimaal 1 rule path-scoped

Bijvoorbeeld een test-rule die alleen geldt voor testbestanden. Kies één van deze vormen:

| Aanpak | Bestand | Frontmatter |
|---|---|---|
| Tool-onafhankelijk | `docs/ai/testing.md` + verwijzing in de docs-index van `AGENTS.md` | geen |
| GitHub Copilot | `.github/instructions/testing.instructions.md` | `applyTo: "**/*.test.{ts,tsx}"` |
| Claude Code | `.claude/rules/testing.md` | `paths:` met een lijst globs |

```md
---
applyTo: "**/*.test.{ts,tsx}"
---
```

```md
---
paths:
  - "**/*.test.{ts,tsx}"
---
```

### 4. Voeg de rapportage-instructie toe aan `AGENTS.md`

```md
## Reporting
End every task with a section `Applied rules:` listing each rule ID
you applied and the file(s) where you applied it.
```

### 5. Draai de taak opnieuw

```bash
git add -A && git commit -m "context: rules"
git tag -f voor-run
```

Open een verse sessie en plak `TASK.md`.

### 6. Scoor

Vul de kolom **Rules** in je scorecard in.

### 7. Verifieer

- Lees de `Applied rules`-sectie van de agent.
- Vraag door:
  > Laat per rule zien op welke regel in welk bestand je hem hebt toegepast.
- **Controleer elke claim zelf in de diff.** Noteer claims die niet kloppen in je scorecard, onder "Geclaimd maar niet gedaan".

### 8. Reset

```bash
git reset --hard voor-run && git clean -fd
```

---

## Klaar als

- je score is beter dan bij de baseline, **én**
- je hebt minimaal één rule gevonden die genegeerd werd, of die geclaimd maar niet (goed) toegepast werd, met een hypothese *waarom*.

Denk bij die hypothese aan:
- te vaag geformuleerd?
- niet geladen (verkeerde scope)?
- te diep weggestopt?
- legacy-code ernaast die het tegenovergestelde laat zien?

## Stretch

Herschrijf de genegeerde rule op basis van je hypothese en draai opnieuw. Werkt het nu wel?

## Vastgelopen?

```bash
git switch stap-2-rules
```

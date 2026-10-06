# Stap 3: Enforce it, lint rule + git pre-commit hook

**Correctie-ladder:** *Enforce it*
**Tijd:** 20 minuten

**Doel:** wat objectief checkbaar is, niet meer aan de agent overlaten. Je gebruikt tools die niet van een agent afhankelijk zijn, dus het werkt ook voor je collega's en voor jezelf.

---

## 3.1 Lint rule (8 min)

Kies een rule uit stap 2 die een machine kan checken en maak er een lint rule van. **Schrijf de foutmelding als instructie**: wat moet het wél zijn, en waar staat de uitleg?

- ESLint-config: `web/eslint.config.js`
- Stylelint-config: `web/.stylelintrc.json`

### Voorbeelden

`fetch` in feature-code verbieden, en formatting-libraries verbieden (ESLint, als extra config-object in de array):

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
        group: ['numeral', 'pretty-ms', 'humanize-duration', 'date-fns'],
        message: 'No formatting libraries. Use compact() from src/lib/numbers.ts or humanizeSeconds() from src/lib/time.ts.',
      }],
    }],
  },
},
```

Hex-kleuren in CSS verbieden (Stylelint). De tokens zelf mogen wél hex zijn:

```json
{
  "rules": {
    "color-no-hex": [true, {
      "message": "Use var(--rs-*) tokens from src/styles/tokens.css instead of hex (see docs/ai/styling.md)."
    }]
  },
  "overrides": [
    { "files": ["src/styles/tokens.css"], "rules": { "color-no-hex": null } }
  ]
}
```

Hex-kleuren in TypeScript of inline styles verbieden (ESLint):

```js
'no-restricted-syntax': ['error', {
  selector: 'Literal[value=/^#[0-9a-fA-F]{3,8}$/]',
  message: 'No hex colours. Use var(--rs-*) tokens (see docs/ai/styling.md).',
}],
```

### Testen

Zet bewust een overtreding in een nieuw bestand en draai:

```bash
npm run lint
npm run lint:css
```

Zie je jouw melding?

### Let op

Kijk ook naar wat er verder uit `npm run lint` komt. Wat doe je met overtredingen die al in de codebase zaten voordat jouw rule bestond? Bedenk zelf een aanpak, zodat **nieuwe** overtredingen wél worden tegengehouden en je team gewoon verder kan werken.

---

## 3.2 Pre-commit hook met lefthook (6 min)

lefthook is één binary met één YAML-config, en draait ook buiten Node-projecten. Installeer het in de root van de repo:

```bash
npm install -D lefthook
```

Bij de installatie maakt lefthook een voorbeeld-`lefthook.yml` aan. Vervang de inhoud door:

```yaml
pre-commit:
  parallel: true
  commands:
    eslint:
      glob: "{web,api}/**/*.{ts,tsx}"
      run: npm run lint
    stylelint:
      glob: "web/**/*.css"
      run: npm run lint:css
    typecheck:
      glob: "{web,api}/**/*.{ts,tsx}"
      run: npm run typecheck
    test:
      glob: "{web,api}/**/*.{ts,tsx,json}"
      run: npm test
```

Activeer de hooks:

```bash
npx lefthook install
```

Een command draait alleen als er staged bestanden zijn die matchen met de `glob`. Testen zonder te committen:

```bash
npx lefthook run pre-commit --all-files
```

**Test het:** commit een bestand met een overtreding. Wordt de commit geblokkeerd met jouw melding?

---

## 3.3 Test de loop (6 min)

1. Voeg toe aan `AGENTS.md`, bij Never do:
   > Never use `git commit --no-verify`. Fix the reported issue instead.
2. Commit, zet de tag en open een verse sessie:
   ```bash
   git add -A && git commit -m "context: enforcement"
   git tag -f voor-run
   ```
3. Plak `TASK.md` **en voeg toe:**
   > Commit your work when done.
4. Kijk mee:
   - Faalt de hook?
   - Leest de agent de melding?
   - Herstelt hij het zelf?
   - Probeert hij `--no-verify`?
5. Vul de kolom **Enforce** in je scorecard in, en de vragen onder "Stap 3".
6. Reset. Dit gooit ook de commit van de agent weg:
   ```bash
   git reset --hard voor-run && git clean -fd
   ```

---

## Klaar als

Een commit met een overtreding wordt geblokkeerd met jouw leesbare melding, en de agent herstelt dat zelfstandig.

## Stretch (kies er één)

**Agent hook.** Draai dezelfde lint direct na elke edit van de agent en vergelijk met de git hook. Wat is sneller? Wat is robuuster?

Claude Code, in `.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{
        "type": "command",
        "command": "cd web && jq -r '.tool_input.file_path' | xargs npx eslint --max-warnings=0 1>&2 || exit 2"
      }]
    }]
  }
}
```

Exit code 2 zorgt dat Claude de foutmelding te zien krijgt. Voor Copilot (CLI en cloud agent) maak je een `.github/hooks/lint.json` met een `postToolUse`-hook; zie de [Copilot hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference).

**commit-msg hook.** Dwing Conventional Commits af met commitlint. Zet in `lefthook.yml`:

```yaml
commit-msg:
  commands:
    commitlint:
      run: npx commitlint --edit {1}
```

## Vastgelopen?

```bash
git switch stap-3-enforce
npx lefthook install
```

# Trainer: uitwerking stap 2 (rules + verificatie)

> Alleen voor de trainer.

## Wat je kunt verwachten

Kalibratiedoel op `stap-2-rules`: gemiddeld **≥ 6 van de 8**. Deelnemers met eigen rules zitten meestal tussen hun baseline en dat niveau.

Rules die vaak toch **genegeerd** of **half** toegepast worden, en waarom:

| Rule | Wat er misgaat | Waarom |
|---|---|---|
| UI-01 | Eigen ster-button in plaats van `ui/Button` uitbreiden | `Button` heeft geen `pressed`-prop; `ui/` aanpassen voelt voor de agent als "buiten scope" |
| A11Y-01 | Wel een `<button>`, maar zonder `aria-pressed` of met `aria-label="star"` | De rule noemt toggles niet expliciet, of de label is niet vertaald |
| I18N-01 | Zichtbare tekst vertaald, `aria-label` niet; of alleen `en.json` bijgewerkt | "Visible text" wordt letterlijk genomen |
| TEST-01 | Nieuwe test toch in `shop/__tests__/` | De bestaande test ernaast trekt harder dan de rule |
| STRUCT-01 | Teller-logica in `components/Header.tsx` | De taak zegt "in the header" |
| STYLE-01 | `var(--color-accent)`: een token die niet bestaat | De rule zegt "use tokens", maar noemt de naam niet |

## Geclaimd maar niet gedaan: voorbeelden

- "STYLE-01 applied in StarButton.css", terwijl er `#ffe000` in staat.
- "TEST-01 applied", terwijl de test `getByTestId` gebruikt.
- "I18N-01 applied", terwijl `nl.json` niet is bijgewerkt.

Dit is het moment voor het kernpunt **self-report ≠ bewijs**, en het bruggetje naar stap 3.

## Bespreekpunten

- **Path-scoped rules:** wie koos tool-specifiek (`applyTo` / `paths`) en wie tool-onafhankelijk? Werkte het bij allebei? In een gemengd team: begin tool-onafhankelijk via `docs/ai/`.
- **Hypotheses** die deelnemers vonden: te vaag, niet geladen, conflict met legacy-code. Laat 2–3 mensen kort vertellen.
- **"Prefer" / "where possible":** wie had zulke woorden in een rule die genegeerd werd?

## Voorbeelduitwerking

Branch `stap-2-rules`, bron in `checkpoints/stap-2-rules/`:
- `docs/ai/rules.md`: acht rules (STYLE-01 … STRUCT-01) met scope, why en ✅/❌
- de test-rule in drie vormen: `docs/ai/testing.md`, `.github/instructions/testing.instructions.md` (`applyTo`) en `.claude/rules/testing.md` (`paths`)
- `AGENTS.md` met een rules-index en de Reporting-sectie

## Rondloop-tips

- Rules zonder voorbeeld: "Hoe ziet goed eruit? Zet een ✅ en een ❌ eronder."
- Deelnemers die de agent alleen geloven: "Open de diff. Klopt het?"
- Hard stop na 22 minuten.

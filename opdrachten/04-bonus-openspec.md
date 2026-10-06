# Bonus: Spec-driven werken met OpenSpec

**Voor:** snelle deelnemers, of thuis

**Doel:** ervaren wat een spec toevoegt bovenop AGENTS.md. AGENTS.md beschrijft *hoe* we bouwen, een spec beschrijft *wat* we bouwen.

---

## Stappen

1. **Installeer** (Node ≥ 20.19):
   ```bash
   npm install -g @fission-ai/openspec@latest
   ```
2. **Initialiseer** in de repo en kies je tool(s):
   ```bash
   openspec init
   ```
3. **Maak een proposal** voor de feature in `TASK-BONUS.md` (een leaderboard):

   | Tool | Command |
   |---|---|
   | Claude Code | `/opsx:propose <beschrijving>` |
   | Copilot | `/opsx-propose <beschrijving>` |

4. **Review en verbeter** `openspec/changes/<naam>/`:
   - `proposal.md`: waarom en wat
   - `specs/`: eisen en scenario's. Let op randgevallen: wat als ik twee keer per minuut insteek? Gelijke scores? Geen scores?
   - `design.md`: hoe
   - `tasks.md`: de stappen
5. **Laat de agent implementeren:**

   | Tool | Command |
   |---|---|
   | Claude Code | `/opsx:apply` |
   | Copilot | `/opsx-apply` |

6. **Archiveer** als het klaar is:

   | Tool | Command |
   |---|---|
   | Claude Code | `/opsx:archive` |
   | Copilot | `/opsx-archive` |

---

## Reflectie

- Wat stond er in de spec dat niet in AGENTS.md hoort, en andersom?
- Was het resultaat beter dan bij `TASK.md`? Waaraan merk je dat?
- Volgde de agent tijdens het implementeren je AGENTS.md en rules nog?
- Wanneer zou je dit in je eigen project wel en niet gebruiken?

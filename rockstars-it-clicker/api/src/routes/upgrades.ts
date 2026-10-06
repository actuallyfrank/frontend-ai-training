import { Router } from 'express';
import seed from '../data/seed.json' with { type: 'json' };

// TODO: move to services/ + schemas/ like the other routes
export const upgradesRouter = Router();

upgradesRouter.get('/', (req, res) => {
  /**
   * Response shape: { id, category, name, baseCost, locPerSecond, clickPower }[]
   * @deprecated `name` is English only and kept for old clients.
   *             Translate via the `upgrades.<id>.name` i18n key instead.
   */
  let upgrades = seed.upgrades;
  if (typeof req.query.category === 'string') {
    upgrades = upgrades.filter((u) => u.category === req.query.category);
  }
  res.json(upgrades);
});

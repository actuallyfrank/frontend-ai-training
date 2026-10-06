import seed from '../../../../api/src/data/seed.json';
import type { Upgrade } from '../../api/types';
import { clickPower, locPerSecond, priceOf, type Owned } from './pricing';

const upgrades = seed.upgrades as Upgrade[];

/** Simulates a player clicking 3×/s who buys the cheapest affordable upgrade. */
function secondsUntilAffordable(targetId: string, clicksPerSecond = 3): number {
  const target = upgrades.find((u) => u.id === targetId)!;
  const owned: Owned = {};
  let loc = 0;
  for (let second = 1; second <= 3600; second++) {
    loc += clickPower(upgrades, owned) * clicksPerSecond + locPerSecond(upgrades, owned);
    if (loc >= priceOf(target, owned[target.id] ?? 0)) return second;
    const cheapest = upgrades
      .filter((u) => u.id !== targetId)
      .map((u) => ({ u, price: priceOf(u, owned[u.id] ?? 0) }))
      .sort((a, b) => a.price - b.price)[0];
    if (cheapest.price <= loc / 4) {
      loc -= cheapest.price;
      owned[cheapest.u.id] = (owned[cheapest.u.id] ?? 0) + 1;
    }
  }
  return Infinity;
}

describe('balance', () => {
  it('lets a new player afford a Junior Dev within about two minutes', () => {
    expect(secondsUntilAffordable('junior-dev')).toBeLessThanOrEqual(120);
  });

  it('keeps the late game out of reach for a quick session', () => {
    expect(secondsUntilAffordable('tech-lead')).toBeGreaterThan(600);
  });
});

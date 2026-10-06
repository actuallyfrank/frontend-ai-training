import type { Upgrade } from '../../api/types';

export type Owned = Record<string, number>;

const PRICE_GROWTH = 1.15;

/** Price of the next unit: baseCost × 1.15^owned, rounded up. */
export function priceOf(upgrade: Pick<Upgrade, 'baseCost'>, owned: number): number {
  return Math.ceil(upgrade.baseCost * PRICE_GROWTH ** owned);
}

/** Passive income: sum of locPerSecond × owned. */
export function locPerSecond(upgrades: Upgrade[], owned: Owned): number {
  return upgrades.reduce((sum, upgrade) => sum + upgrade.locPerSecond * (owned[upgrade.id] ?? 0), 0);
}

/** LoC per click: 1 plus the clickPower of every owned unit. */
export function clickPower(upgrades: Upgrade[], owned: Owned): number {
  return upgrades.reduce((sum, upgrade) => sum + upgrade.clickPower * (owned[upgrade.id] ?? 0), 1);
}

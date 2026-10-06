import seed from '../data/seed.json' with { type: 'json' };

export function upgradeExists(upgradeId: string): boolean {
  return seed.upgrades.some((upgrade) => upgrade.id === upgradeId);
}

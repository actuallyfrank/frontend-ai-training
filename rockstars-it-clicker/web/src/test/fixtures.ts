import type { SaveGame, Upgrade } from '../api/types';
import type { GameContextValue } from '../lib/game/GameContext';

export const testUpgrades: Upgrade[] = [
  { id: 'intern', category: 'people', name: 'Intern', baseCost: 15, locPerSecond: 0.1, clickPower: 0 },
  { id: 'junior-dev', category: 'people', name: 'Junior Dev', baseCost: 100, locPerSecond: 1, clickPower: 0 },
  { id: 'rubber-duck', category: 'tools', name: 'Rubber Duck', baseCost: 50, locPerSecond: 0, clickPower: 1 },
  { id: 'coffee-machine', category: 'culture', name: 'Coffee Machine', baseCost: 200, locPerSecond: 2, clickPower: 0 },
  { id: 'ci-pipeline', category: 'infra', name: 'CI Pipeline', baseCost: 20000, locPerSecond: 90, clickPower: 0 },
];

export function testSave(overrides: Partial<SaveGame> = {}): SaveGame {
  return {
    loc: 0,
    owned: {},
    startedAt: '2026-10-06T08:00:00.000Z',
    totalLoc: 0,
    ...overrides,
  };
}

export function fakeGame(overrides: Partial<GameContextValue> = {}): GameContextValue {
  return {
    status: 'ready',
    upgrades: testUpgrades,
    loc: 0,
    totalLoc: 0,
    startedAt: '2026-10-06T08:00:00.000Z',
    owned: {},
    locPerSecond: 0,
    clickPower: 1,
    click: vi.fn(),
    buy: vi.fn(),
    ...overrides,
  };
}

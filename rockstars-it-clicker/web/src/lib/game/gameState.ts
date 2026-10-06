import type { SaveGame, Upgrade } from '../../api/types';
import { clickPower, locPerSecond, priceOf } from './pricing';

export type GameState = {
  status: 'loading' | 'ready' | 'error';
  upgrades: Upgrade[];
  save: SaveGame;
  /** Increments on every successful purchase, so the provider can save right away. */
  purchases: number;
};

export type GameAction =
  | { type: 'loaded'; upgrades: Upgrade[]; save: SaveGame }
  | { type: 'failed' }
  | { type: 'tick'; seconds: number }
  | { type: 'click' }
  | { type: 'buy'; upgradeId: string };

export const initialGameState: GameState = {
  status: 'loading',
  upgrades: [],
  save: { loc: 0, owned: {}, startedAt: new Date(0).toISOString(), totalLoc: 0 },
  purchases: 0,
};

function earn(save: SaveGame, amount: number): SaveGame {
  if (amount <= 0) return save;
  return { ...save, loc: save.loc + amount, totalLoc: save.totalLoc + amount };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'loaded':
      return { ...state, status: 'ready', upgrades: action.upgrades, save: action.save };
    case 'failed':
      return { ...state, status: 'error' };
    case 'tick':
      if (state.status !== 'ready') return state;
      return {
        ...state,
        save: earn(state.save, locPerSecond(state.upgrades, state.save.owned) * action.seconds),
      };
    case 'click':
      if (state.status !== 'ready') return state;
      return { ...state, save: earn(state.save, clickPower(state.upgrades, state.save.owned)) };
    case 'buy': {
      const upgrade = state.upgrades.find((u) => u.id === action.upgradeId);
      if (!upgrade) return state;
      const owned = state.save.owned[upgrade.id] ?? 0;
      const price = priceOf(upgrade, owned);
      if (state.save.loc < price) return state;
      return {
        ...state,
        purchases: state.purchases + 1,
        save: {
          ...state.save,
          loc: state.save.loc - price,
          owned: { ...state.save.owned, [upgrade.id]: owned + 1 },
        },
      };
    }
  }
}

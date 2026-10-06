import { createContext, useContext } from 'react';
import type { SaveGame, Upgrade } from '../../api/types';

export type GameContextValue = {
  status: 'loading' | 'ready' | 'error';
  upgrades: Upgrade[];
  loc: number;
  totalLoc: number;
  startedAt: string;
  owned: SaveGame['owned'];
  locPerSecond: number;
  clickPower: number;
  click: () => void;
  buy: (upgradeId: string) => void;
};

export const GameContext = createContext<GameContextValue | null>(null);

export function useGame(): GameContextValue {
  const value = useContext(GameContext);
  if (!value) throw new Error('useGame must be used inside <GameProvider>');
  return value;
}

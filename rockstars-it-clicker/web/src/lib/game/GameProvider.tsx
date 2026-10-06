import { useCallback, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react';
import { useSaveGame } from '../../api/useSaveGame';
import { GameContext, type GameContextValue } from './GameContext';
import { gameReducer, initialGameState } from './gameState';
import { clickPower, locPerSecond } from './pricing';
import { useGameLoop } from './useGameLoop';

export const AUTOSAVE_MS = 10_000;

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const saveGameApi = useSaveGame();
  const saveRef = useRef(state.save);

  useEffect(() => {
    saveRef.current = state.save;
  }, [state.save]);

  // Load upgrades + savegame once.
  useEffect(() => {
    let cancelled = false;
    saveGameApi
      .load()
      .then(({ upgrades, save }) => {
        if (!cancelled) dispatch({ type: 'loaded', upgrades, save });
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: 'failed' });
      });
    return () => {
      cancelled = true;
    };
  }, [saveGameApi]);

  const isReady = state.status === 'ready';

  const tick = useCallback((seconds: number) => dispatch({ type: 'tick', seconds }), []);
  useGameLoop(tick, isReady);

  // Autosave every 10 seconds.
  useEffect(() => {
    if (!isReady) return;
    const id = setInterval(() => {
      saveGameApi.save(saveRef.current).catch(() => {});
    }, AUTOSAVE_MS);
    return () => clearInterval(id);
  }, [isReady, saveGameApi]);

  // Save right after every purchase.
  useEffect(() => {
    if (state.purchases > 0) saveGameApi.save(state.save).catch(() => {});
    // Only purchases should trigger this save, not every LoC change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.purchases, saveGameApi]);

  const click = useCallback(() => dispatch({ type: 'click' }), []);
  const buy = useCallback((upgradeId: string) => dispatch({ type: 'buy', upgradeId }), []);

  const value = useMemo<GameContextValue>(
    () => ({
      status: state.status,
      upgrades: state.upgrades,
      loc: state.save.loc,
      totalLoc: state.save.totalLoc,
      startedAt: state.save.startedAt,
      owned: state.save.owned,
      locPerSecond: locPerSecond(state.upgrades, state.save.owned),
      clickPower: clickPower(state.upgrades, state.save.owned),
      click,
      buy,
    }),
    [state, click, buy],
  );

  return <GameContext value={value}>{children}</GameContext>;
}

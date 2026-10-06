import { useEffect, useRef } from 'react';

export const TICK_MS = 100;

/** Calls `onTick(seconds)` every 100 ms while `enabled` is true. */
export function useGameLoop(onTick: (seconds: number) => void, enabled: boolean): void {
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => onTickRef.current(TICK_MS / 1000), TICK_MS);
    return () => clearInterval(id);
  }, [enabled]);
}

import type { SaveGame } from '../schemas/save.js';
import { store } from '../store.js';

export function getSaveGame(): SaveGame {
  store.save ??= {
    loc: 0,
    owned: {},
    startedAt: new Date().toISOString(),
    totalLoc: 0,
  };
  return store.save;
}

export function storeSaveGame(save: SaveGame): void {
  store.save = save;
}

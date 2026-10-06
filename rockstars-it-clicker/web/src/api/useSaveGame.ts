import { apiClient } from './client';
import type { SaveGame, Upgrade } from './types';

const saveGameApi = {
  /** Loads everything the game needs to start: the upgrade catalogue and the savegame. */
  async load(): Promise<{ upgrades: Upgrade[]; save: SaveGame }> {
    const [upgrades, save] = await Promise.all([
      apiClient.get<Upgrade[]>('/upgrades'),
      apiClient.get<SaveGame>('/save'),
    ]);
    return { upgrades, save };
  },
  save(save: SaveGame): Promise<void> {
    return apiClient.put<void>('/save', save);
  },
};

export function useSaveGame() {
  return saveGameApi;
}

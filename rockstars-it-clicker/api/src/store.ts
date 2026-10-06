import seed from './data/seed.json' with { type: 'json' };
import type { Profile } from './schemas/profile.js';
import type { SaveGame } from './schemas/save.js';

/**
 * In-memory store for the single implicit player.
 * Everything resets when the API restarts, which is fine for this game.
 */
type Store = {
  save: SaveGame | null;
  wishlist: string[];
  profile: Profile;
};

export const store: Store = createInitialStore();

function createInitialStore(): Store {
  return {
    save: null,
    wishlist: [],
    profile: { ...(seed.defaultProfile as Profile) },
  };
}

/** Used by tests to start from the seeded defaults. */
export function resetStore(): void {
  Object.assign(store, createInitialStore());
}

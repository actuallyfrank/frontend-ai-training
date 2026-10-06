import { HttpError } from '../errors.js';
import { store } from '../store.js';
import { upgradeExists } from './upgrades.js';

export function getWishlist(): string[] {
  return store.wishlist;
}

export function addToWishlist(upgradeId: string): string[] {
  if (!upgradeExists(upgradeId)) {
    throw new HttpError(404, 'NOT_FOUND', `Unknown upgrade "${upgradeId}"`);
  }
  if (!store.wishlist.includes(upgradeId)) {
    store.wishlist = [...store.wishlist, upgradeId];
  }
  return store.wishlist;
}

export function removeFromWishlist(upgradeId: string): string[] {
  store.wishlist = store.wishlist.filter((id) => id !== upgradeId);
  return store.wishlist;
}

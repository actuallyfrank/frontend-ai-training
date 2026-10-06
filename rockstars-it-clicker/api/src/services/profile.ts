import type { Profile } from '../schemas/profile.js';
import { store } from '../store.js';

export function getProfile(): Profile {
  return store.profile;
}

export function updateProfile(profile: Profile): Profile {
  store.profile = profile;
  return store.profile;
}

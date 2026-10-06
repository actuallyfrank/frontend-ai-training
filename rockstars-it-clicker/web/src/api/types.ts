export type UpgradeCategory = 'people' | 'tools' | 'culture' | 'infra';

export type Upgrade = {
  id: string;
  category: UpgradeCategory;
  /** @deprecated English only. Use the `upgrades.<id>.name` translation key. */
  name: string;
  baseCost: number;
  locPerSecond: number;
  clickPower: number;
};

export type SaveGame = {
  loc: number;
  owned: Record<string, number>;
  startedAt: string;
  totalLoc: number;
};

export const avatars = ['🎸', '🥁', '🎤', '🎹'] as const;
export type Avatar = (typeof avatars)[number];
export type Language = 'en' | 'nl';

export type Profile = {
  companyName: string;
  avatar: Avatar;
  language: Language;
};

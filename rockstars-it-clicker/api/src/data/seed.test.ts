import { describe, expect, it } from 'vitest';
import seed from './seed.json' with { type: 'json' };

describe('seed data', () => {
  it('contains 16 upgrades: 6 people, 4 tools, 3 culture, 3 infra', () => {
    const count = (category: string) =>
      seed.upgrades.filter((upgrade) => upgrade.category === category).length;
    expect(seed.upgrades).toHaveLength(16);
    expect(count('people')).toBe(6);
    expect(count('tools')).toBe(4);
    expect(count('culture')).toBe(3);
    expect(count('infra')).toBe(3);
  });

  it('has unique ids', () => {
    const ids = seed.upgrades.map((upgrade) => upgrade.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

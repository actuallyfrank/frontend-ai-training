import seed from '../../../api/src/data/seed.json';
import en from './en.json';
import nl from './nl.json';

function keys(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) return [prefix];
  return Object.entries(value).flatMap(([key, child]) => keys(child, prefix ? `${prefix}.${key}` : key));
}

describe('locales', () => {
  it('has a name and flavour for every upgrade in EN and NL', () => {
    for (const upgrade of seed.upgrades) {
      for (const locale of [en, nl]) {
        const entry = (locale.upgrades as Record<string, { name?: string; flavour?: string }>)[upgrade.id];
        expect(entry?.name, `${upgrade.id}.name`).toBeTruthy();
        expect(entry?.flavour, `${upgrade.id}.flavour`).toBeTruthy();
      }
    }
  });

  it('has the same keys in EN and NL', () => {
    expect(keys(nl).sort()).toEqual(keys(en).sort());
  });
});

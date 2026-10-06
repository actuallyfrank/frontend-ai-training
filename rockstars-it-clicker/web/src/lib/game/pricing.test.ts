import { testUpgrades } from '../../test/fixtures';
import { clickPower, locPerSecond, priceOf } from './pricing';

describe('pricing', () => {
  it('starts at the base cost', () => {
    expect(priceOf({ baseCost: 15 }, 0)).toBe(15);
  });

  it('grows 15% per owned unit, rounded up', () => {
    expect(priceOf({ baseCost: 15 }, 1)).toBe(18);
    expect(priceOf({ baseCost: 100 }, 10)).toBe(405);
  });

  it('sums passive income', () => {
    expect(locPerSecond(testUpgrades, { intern: 10, 'coffee-machine': 1 })).toBeCloseTo(3);
  });

  it('starts click power at 1 and adds owned click power', () => {
    expect(clickPower(testUpgrades, {})).toBe(1);
    expect(clickPower(testUpgrades, { 'rubber-duck': 2 })).toBe(3);
  });
});

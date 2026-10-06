import { testSave, testUpgrades } from '../../test/fixtures';
import { gameReducer, initialGameState, type GameState } from './gameState';

function ready(save = testSave()): GameState {
  return gameReducer(initialGameState, { type: 'loaded', upgrades: testUpgrades, save });
}

describe('gameReducer', () => {
  it('buys an affordable upgrade and raises the next price', () => {
    const state = gameReducer(ready(testSave({ loc: 20 })), { type: 'buy', upgradeId: 'intern' });
    expect(state.save.loc).toBe(5);
    expect(state.save.owned.intern).toBe(1);
    expect(state.purchases).toBe(1);
  });

  it('rejects a purchase the player cannot afford', () => {
    const before = ready(testSave({ loc: 10 }));
    const after = gameReducer(before, { type: 'buy', upgradeId: 'intern' });
    expect(after).toBe(before);
  });

  it('adds click power on click and counts it in totalLoc', () => {
    const state = gameReducer(ready(testSave({ owned: { 'rubber-duck': 2 } })), { type: 'click' });
    expect(state.save.loc).toBe(3);
    expect(state.save.totalLoc).toBe(3);
  });

  it('does not reduce totalLoc when spending', () => {
    const state = gameReducer(ready(testSave({ loc: 20, totalLoc: 20 })), {
      type: 'buy',
      upgradeId: 'intern',
    });
    expect(state.save.totalLoc).toBe(20);
  });

  it('adds passive income on tick', () => {
    const state = gameReducer(ready(testSave({ owned: { intern: 10 } })), { type: 'tick', seconds: 1 });
    expect(state.save.loc).toBeCloseTo(1);
  });
});

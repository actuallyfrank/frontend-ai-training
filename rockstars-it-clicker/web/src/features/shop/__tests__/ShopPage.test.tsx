import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { GameContext } from '../../../lib/game/GameContext';
import { fakeGame, testUpgrades } from '../../../test/fixtures';
import ShopPage from '../ShopPage';

describe('ShopPage', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(testUpgrades),
    }) as unknown as typeof fetch;
  });

  it('renders upgrade cards', async () => {
    render(
      <GameContext value={fakeGame()}>
        <ShopPage />
      </GameContext>,
    );
    await waitFor(() => expect(screen.getAllByTestId('upgrade-card')).toHaveLength(5));
  });

  it('buys an upgrade when a card is clicked', async () => {
    const game = fakeGame({ loc: 100 });
    render(
      <GameContext value={game}>
        <ShopPage />
      </GameContext>,
    );
    await waitFor(() => expect(screen.getAllByTestId('upgrade-card')).toHaveLength(5));
    fireEvent.click(screen.getAllByTestId('upgrade-card')[0]);
    expect(game.buy).toHaveBeenCalledWith('intern');
  });

  it('shows the price', async () => {
    render(
      <GameContext value={fakeGame()}>
        <ShopPage />
      </GameContext>,
    );
    await waitFor(() => expect(screen.getByText('20.0K LoC')).toBeInTheDocument());
  });
});

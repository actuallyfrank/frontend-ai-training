import { act, render, screen } from '@testing-library/react';
import { testSave, testUpgrades } from '../../test/fixtures';
import { useSaveGame } from '../../api/useSaveGame';
import { useGame } from './GameContext';
import { AUTOSAVE_MS, GameProvider } from './GameProvider';

vi.mock('../../api/useSaveGame');

const api = { load: vi.fn(), save: vi.fn() };

function Probe() {
  const game = useGame();
  return (
    <>
      <p>status: {game.status}</p>
      <p>loc: {Math.floor(game.loc)}</p>
      <button type="button" onClick={() => game.buy('intern')}>
        buy intern
      </button>
    </>
  );
}

async function renderGame(save = testSave()) {
  api.load.mockResolvedValue({ upgrades: testUpgrades, save });
  render(
    <GameProvider>
      <Probe />
    </GameProvider>,
  );
  await act(async () => {
    await vi.advanceTimersByTimeAsync(0);
  });
}

describe('GameProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(useSaveGame).mockReturnValue(api);
    api.save.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('accumulates passive income over time', async () => {
    await renderGame(testSave({ owned: { intern: 10 } }));
    expect(screen.getByText('status: ready')).toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10_000);
    });
    expect(screen.getByText(/loc: (9|10|11)$/)).toBeInTheDocument();
  });

  it('autosaves every 10 seconds', async () => {
    await renderGame();
    expect(api.save).not.toHaveBeenCalled();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(AUTOSAVE_MS);
    });
    expect(api.save).toHaveBeenCalledTimes(1);
  });

  it('saves right after a purchase', async () => {
    await renderGame(testSave({ loc: 20 }));
    await act(async () => {
      screen.getByRole('button', { name: 'buy intern' }).click();
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(api.save).toHaveBeenCalledWith(expect.objectContaining({ owned: { intern: 1 } }));
  });

  it('reports an error when loading fails', async () => {
    api.load.mockRejectedValue(new Error('down'));
    render(
      <GameProvider>
        <Probe />
      </GameProvider>,
    );
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(screen.getByText('status: error')).toBeInTheDocument();
  });
});

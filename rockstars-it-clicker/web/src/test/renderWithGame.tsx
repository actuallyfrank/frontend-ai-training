import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router';
import { GameContext, type GameContextValue } from '../lib/game/GameContext';
import { fakeGame } from './fixtures';

/** Renders UI inside a router with a fake game state. */
export function renderWithGame(
  ui: ReactElement,
  { game = {}, route = '/' }: { game?: Partial<GameContextValue>; route?: string } = {},
) {
  const value = fakeGame(game);
  return {
    game: value,
    ...render(
      <MemoryRouter initialEntries={[route]}>
        <GameContext value={value}>{ui}</GameContext>
      </MemoryRouter>,
    ),
  };
}

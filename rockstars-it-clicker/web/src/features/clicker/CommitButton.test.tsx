import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithGame } from '../../test/renderWithGame';
import { CommitButton } from './CommitButton';

describe('CommitButton', () => {
  it('commits code when clicked', async () => {
    const { game } = renderWithGame(<CommitButton />, { game: { clickPower: 3 } });
    await userEvent.click(screen.getByRole('button', { name: 'Commit code (+3 LoC)' }));
    expect(game.click).toHaveBeenCalledTimes(1);
  });

  it('can be activated with the keyboard', async () => {
    const { game } = renderWithGame(<CommitButton />);
    screen.getByRole('button', { name: /commit code/i }).focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(game.click).toHaveBeenCalledTimes(2);
  });
});

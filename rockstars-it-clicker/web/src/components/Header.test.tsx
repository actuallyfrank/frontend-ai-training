import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithGame } from '../test/renderWithGame';
import { Header } from './Header';

describe('Header', () => {
  it('shows LoC in compact notation and LoC per second', () => {
    renderWithGame(<Header />, { game: { loc: 1_234_567, locPerSecond: 12.5 } });
    expect(screen.getByText('1.2M LoC')).toBeInTheDocument();
    expect(screen.getByText('12.5 LoC/s')).toBeInTheDocument();
  });

  it('switches the UI to Dutch without a reload', async () => {
    renderWithGame(<Header />);
    expect(screen.getByRole('link', { name: 'Shop' })).toBeInTheDocument();
    await userEvent.selectOptions(screen.getByLabelText('Language'), 'nl');
    expect(screen.getByRole('link', { name: 'Winkel' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Profiel' })).toBeInTheDocument();
  });
});

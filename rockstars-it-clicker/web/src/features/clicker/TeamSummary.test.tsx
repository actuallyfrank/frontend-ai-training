import { screen } from '@testing-library/react';
import i18n from '../../i18n';
import { renderWithGame } from '../../test/renderWithGame';
import { TeamSummary } from './TeamSummary';

describe('TeamSummary', () => {
  it('lists owned upgrades with their translated names', () => {
    renderWithGame(<TeamSummary />, { game: { owned: { intern: 3, 'coffee-machine': 1 } } });
    const items = screen.getAllByRole('listitem').map((item) => item.textContent);
    expect(items).toEqual(['Intern × 3', 'Coffee Machine × 1']);
  });

  it('translates names to Dutch', async () => {
    await i18n.changeLanguage('nl');
    renderWithGame(<TeamSummary />, { game: { owned: { intern: 3 } } });
    expect(screen.getByRole('listitem')).toHaveTextContent('Stagiair × 3');
  });

  it('shows an empty state', () => {
    renderWithGame(<TeamSummary />);
    expect(screen.getByText(/visit the shop/i)).toBeInTheDocument();
  });
});

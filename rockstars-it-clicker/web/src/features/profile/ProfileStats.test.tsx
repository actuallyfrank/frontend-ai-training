import { screen } from '@testing-library/react';
import { renderWithGame } from '../../test/renderWithGame';
import { ProfileStats } from './ProfileStats';

describe('ProfileStats', () => {
  afterEach(() => vi.useRealTimers());

  it('shows playing time, total LoC and number of upgrades', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-06T11:12:00.000Z'));

    renderWithGame(<ProfileStats />, {
      game: {
        startedAt: '2026-10-06T08:00:00.000Z',
        totalLoc: 1_234_567,
        owned: { intern: 40, 'junior-dev': 2 },
      },
    });

    expect(screen.getByText('Playing for').nextSibling).toHaveTextContent('3h 12m');
    expect(screen.getByText('LoC written').nextSibling).toHaveTextContent('1.2M');
    expect(screen.getByText('Upgrades owned').nextSibling).toHaveTextContent('42');
  });
});

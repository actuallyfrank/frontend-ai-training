import { screen } from '@testing-library/react';
import { ApiError } from '../../api/client';
import { useProfile } from '../../api/useProfile';
import { renderWithGame } from '../../test/renderWithGame';
import { ProfilePage } from './ProfilePage';

vi.mock('../../api/useProfile');

describe('ProfilePage', () => {
  it('shows a loading state', () => {
    vi.mocked(useProfile).mockReturnValue({ data: null, error: null, isLoading: true, update: vi.fn() });
    renderWithGame(<ProfilePage />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading');
  });

  it('shows an error instead of an empty form when loading fails', () => {
    vi.mocked(useProfile).mockReturnValue({
      data: null,
      error: new ApiError(500, 'INTERNAL_ERROR', 'Boom'),
      isLoading: false,
      update: vi.fn(),
    });
    renderWithGame(<ProfilePage />);
    expect(screen.getByRole('alert')).toHaveTextContent('Could not load your profile.');
    expect(screen.queryByLabelText('Company name')).not.toBeInTheDocument();
  });

  it('renders the form with the loaded profile', () => {
    vi.mocked(useProfile).mockReturnValue({
      data: { companyName: 'Byte Me BV', avatar: '🥁', language: 'en' },
      error: null,
      isLoading: false,
      update: vi.fn(),
    });
    renderWithGame(<ProfilePage />);
    expect(screen.getByLabelText('Company name')).toHaveValue('Byte Me BV');
    expect(screen.getByRole('radio', { name: 'Drums' })).toBeChecked();
  });
});

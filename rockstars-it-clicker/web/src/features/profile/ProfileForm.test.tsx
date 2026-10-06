import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Profile } from '../../api/types';
import i18n from '../../i18n';
import { ProfileForm } from './ProfileForm';

const profile: Profile = { companyName: 'Garage Startup', avatar: '🎸', language: 'en' };

describe('ProfileForm', () => {
  it('saves the profile and announces success', async () => {
    const onSave = vi.fn(async (value: Profile) => value);
    render(<ProfileForm profile={profile} onSave={onSave} />);

    const name = screen.getByLabelText('Company name');
    await userEvent.clear(name);
    await userEvent.type(name, 'Byte Me BV');
    await userEvent.click(screen.getByRole('radio', { name: 'Drums' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save profile' }));

    expect(onSave).toHaveBeenCalledWith({ companyName: 'Byte Me BV', avatar: '🥁', language: 'en' });
    expect(await screen.findByRole('status')).toHaveTextContent('Profile saved. Rock on!');
  });

  it('shows a validation error for a too short company name', async () => {
    const onSave = vi.fn();
    render(<ProfileForm profile={profile} onSave={onSave} />);

    const name = screen.getByLabelText('Company name');
    await userEvent.clear(name);
    await userEvent.type(name, 'X');
    await userEvent.click(screen.getByRole('button', { name: 'Save profile' }));

    expect(onSave).not.toHaveBeenCalled();
    expect(name).toHaveAccessibleDescription('Use 2 to 40 characters.');
    expect(name).toBeInvalid();
  });

  it('switches the UI language after saving Dutch', async () => {
    const onSave = vi.fn(async (value: Profile) => value);
    render(<ProfileForm profile={profile} onSave={onSave} />);

    await userEvent.selectOptions(screen.getByLabelText('Language'), 'nl');
    await userEvent.click(screen.getByRole('button', { name: 'Save profile' }));

    expect(await screen.findByRole('button', { name: 'Profiel opslaan' })).toBeInTheDocument();
    expect(i18n.language).toBe('nl');
  });

  it('shows an error when saving fails', async () => {
    const onSave = vi.fn().mockRejectedValue(new Error('down'));
    render(<ProfileForm profile={profile} onSave={onSave} />);
    await userEvent.click(screen.getByRole('button', { name: 'Save profile' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Saving failed');
  });
});

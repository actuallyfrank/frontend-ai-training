import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { avatars, type Avatar, type Language, type Profile } from '../../api/types';
import { supportedLanguages } from '../../i18n';
import { Button, Input, Select } from '../../ui';
import './ProfileForm.css';

const AVATAR_LABELS: Record<Avatar, string> = {
  '🎸': 'profile.avatars.guitar',
  '🥁': 'profile.avatars.drums',
  '🎤': 'profile.avatars.microphone',
  '🎹': 'profile.avatars.keys',
};

type Status = 'idle' | 'saving' | 'saved' | 'error';

type ProfileFormProps = {
  profile: Profile;
  onSave: (profile: Profile) => Promise<Profile>;
};

export function ProfileForm({ profile, onSave }: ProfileFormProps) {
  const { t, i18n } = useTranslation();
  const [companyName, setCompanyName] = useState(profile.companyName);
  const [avatar, setAvatar] = useState<Avatar>(profile.avatar);
  const [language, setLanguage] = useState<Language>(profile.language);
  const [nameError, setNameError] = useState<string>();
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = companyName.trim();
    if (trimmed.length < 2 || trimmed.length > 40) {
      setNameError(t('profile.errors.companyName'));
      return;
    }
    setNameError(undefined);
    setStatus('saving');
    try {
      const saved = await onSave({ companyName: trimmed, avatar, language });
      await i18n.changeLanguage(saved.language);
      setStatus('saved');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit} noValidate>
      <Input
        label={t('profile.companyName')}
        value={companyName}
        onChange={(event) => setCompanyName(event.target.value)}
        error={nameError}
        maxLength={40}
        required
      />

      <fieldset className="profile-form__avatars">
        <legend className="profile-form__legend">{t('profile.avatar')}</legend>
        {avatars.map((option) => (
          <label key={option} className="profile-form__avatar">
            <input
              type="radio"
              name="avatar"
              value={option}
              checked={avatar === option}
              onChange={() => setAvatar(option)}
            />
            <span aria-hidden="true">{option}</span>
            <span className="visually-hidden">{t(AVATAR_LABELS[option])}</span>
          </label>
        ))}
      </fieldset>

      <Select
        label={t('profile.language')}
        value={language}
        onChange={(event) => setLanguage(event.target.value as Language)}
        options={supportedLanguages.map((value) => ({ value, label: t(`languages.${value}`) }))}
      />

      <Button type="submit" disabled={status === 'saving'}>
        {status === 'saving' ? t('profile.saving') : t('profile.save')}
      </Button>

      <p role="status" className="profile-form__status">
        {status === 'saved' && t('profile.saved')}
      </p>
      {status === 'error' && (
        <p role="alert" className="profile-form__error">
          {t('profile.errors.save')}
        </p>
      )}
    </form>
  );
}

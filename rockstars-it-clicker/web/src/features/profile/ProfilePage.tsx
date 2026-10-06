import { useTranslation } from 'react-i18next';
import { useProfile } from '../../api/useProfile';
import { Card } from '../../ui';
import { ProfileForm } from './ProfileForm';
import { ProfileStats } from './ProfileStats';
import './ProfilePage.css';

export function ProfilePage() {
  const { t } = useTranslation();
  const { data: profile, error, isLoading, update } = useProfile();

  return (
    <section className="profile">
      <h1 className="profile__title">
        {profile && <span aria-hidden="true">{profile.avatar} </span>}
        {t('profile.title')}
      </h1>
      <div className="profile__layout">
        <Card>
          {isLoading && <p role="status">{t('common.loading')}</p>}
          {error && <p role="alert">{t('profile.errors.load')}</p>}
          {profile && <ProfileForm profile={profile} onSave={update} />}
        </Card>
        <ProfileStats />
      </div>
    </section>
  );
}

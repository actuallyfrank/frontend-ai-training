import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../../lib/game';
import { compact } from '../../lib/numbers';
import { humanizeSeconds } from '../../lib/time';
import { Card } from '../../ui';

export function ProfileStats() {
  const { t } = useTranslation();
  const { startedAt, totalLoc, owned } = useGame();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const playingSeconds = (now - new Date(startedAt).getTime()) / 1000;
  const upgradeCount = Object.values(owned).reduce((sum, count) => sum + count, 0);

  return (
    <Card>
      <h2 className="profile__heading">{t('profile.stats.title')}</h2>
      <dl className="profile__stats">
        <dt>{t('profile.stats.playingFor')}</dt>
        <dd>{humanizeSeconds(playingSeconds)}</dd>
        <dt>{t('profile.stats.totalLoc')}</dt>
        <dd>{compact(Math.floor(totalLoc))}</dd>
        <dt>{t('profile.stats.upgrades')}</dt>
        <dd>{upgradeCount}</dd>
      </dl>
    </Card>
  );
}

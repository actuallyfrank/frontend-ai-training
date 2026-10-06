import { useTranslation } from 'react-i18next';
import { useGame } from '../../lib/game';
import { compact } from '../../lib/numbers';
import { Card } from '../../ui';

export function StatsPanel() {
  const { t } = useTranslation();
  const { loc, locPerSecond, clickPower } = useGame();

  return (
    <Card className="clicker__panel">
      <h2 className="clicker__heading">{t('clicker.stats.title')}</h2>
      <dl className="clicker__stats">
        <dt>{t('clicker.stats.loc')}</dt>
        <dd>{compact(Math.floor(loc))}</dd>
        <dt>{t('clicker.stats.locPerSecond')}</dt>
        <dd>{compact(locPerSecond)}</dd>
        <dt>{t('clicker.stats.clickPower')}</dt>
        <dd>{compact(clickPower)}</dd>
      </dl>
    </Card>
  );
}

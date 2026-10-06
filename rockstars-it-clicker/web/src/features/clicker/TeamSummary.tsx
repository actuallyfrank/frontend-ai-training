import { useTranslation } from 'react-i18next';
import { useGame } from '../../lib/game';
import { Card } from '../../ui';

export function TeamSummary() {
  const { t } = useTranslation();
  const { upgrades, owned } = useGame();
  const team = upgrades.filter((upgrade) => (owned[upgrade.id] ?? 0) > 0);

  return (
    <Card className="clicker__panel">
      <h2 className="clicker__heading">{t('clicker.team.title')}</h2>
      {team.length === 0 ? (
        <p className="clicker__empty">{t('clicker.team.empty')}</p>
      ) : (
        <ul className="clicker__team">
          {team.map((upgrade) => (
            <li key={upgrade.id}>
              {t('clicker.team.item', {
                name: t(`upgrades.${upgrade.id}.name`),
                count: owned[upgrade.id],
              })}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

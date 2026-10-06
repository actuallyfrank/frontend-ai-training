import { useTranslation } from 'react-i18next';
import { CommitButton } from './CommitButton';
import { StatsPanel } from './StatsPanel';
import { TeamSummary } from './TeamSummary';
import './ClickerPage.css';

export function ClickerPage() {
  const { t } = useTranslation();

  return (
    <section className="clicker">
      <h1 className="clicker__title">{t('clicker.title')}</h1>
      <CommitButton />
      <div className="clicker__panels">
        <StatsPanel />
        <TeamSummary />
      </div>
    </section>
  );
}

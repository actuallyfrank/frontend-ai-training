import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../../lib/game';
import { compact } from '../../lib/numbers';
import { Button } from '../../ui';
import './CommitButton.css';

type Pop = { id: number; amount: number };

export function CommitButton() {
  const { t } = useTranslation();
  const { click, clickPower } = useGame();
  const [pops, setPops] = useState<Pop[]>([]);

  function handleClick() {
    click();
    setPops((current) => [...current, { id: Date.now() + Math.random(), amount: clickPower }]);
  }

  return (
    <div className="commit-button">
      <Button
        variant="hero"
        onClick={handleClick}
        aria-label={t('clicker.commitLabel', { amount: compact(clickPower) })}
      >
        <span aria-hidden="true">⌨️</span> {t('clicker.commit')}
      </Button>
      {pops.map((pop) => (
        <span
          key={pop.id}
          className="commit-button__pop"
          aria-hidden="true"
          onAnimationEnd={() => setPops((current) => current.filter((p) => p.id !== pop.id))}
        >
          {t('clicker.gained', { amount: compact(pop.amount) })}
        </span>
      ))}
    </div>
  );
}

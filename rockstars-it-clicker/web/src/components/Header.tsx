import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import { supportedLanguages } from '../i18n';
import { compact } from '../lib/numbers';
import { useGame } from '../lib/game';
import { Select } from '../ui';
import './Header.css';

export function Header() {
  const { t, i18n } = useTranslation();
  const { loc, locPerSecond } = useGame();

  return (
    <header className="header">
      <div className="header__brand">
        <span aria-hidden="true">🎸</span> {t('app.name')}
      </div>
      <div className="header__stats" aria-live="off">
        <span className="header__loc">{t('header.loc', { value: compact(Math.floor(loc)) })}</span>
        <span className="header__rate">{t('header.locPerSecond', { value: compact(locPerSecond) })}</span>
      </div>
      <nav className="header__nav" aria-label={t('nav.label')}>
        <NavLink to="/" end className="header__link">
          {t('nav.game')}
        </NavLink>
        <NavLink to="/shop" className="header__link">
          {t('nav.shop')}
        </NavLink>
        <NavLink to="/profile" className="header__link">
          {t('nav.profile')}
        </NavLink>
      </nav>
      <Select
        className="header__language"
        label={t('header.language')}
        value={i18n.resolvedLanguage}
        onChange={(event) => i18n.changeLanguage(event.target.value)}
        options={supportedLanguages.map((language) => ({
          value: language,
          label: t(`languages.${language}`),
        }))}
      />
    </header>
  );
}

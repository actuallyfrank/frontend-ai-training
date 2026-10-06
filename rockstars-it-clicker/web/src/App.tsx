import { useTranslation } from 'react-i18next';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Header } from './components/Header';
import { ClickerPage } from './features/clicker';
import { ProfilePage } from './features/profile';
import ShopPage from './features/shop/ShopPage';
import { GameProvider, useGame } from './lib/game';
import { Card } from './ui';

function AppContent() {
  const { t } = useTranslation();
  const { status } = useGame();

  if (status === 'loading') {
    return (
      <main className="app-main">
        <p role="status">{t('app.loading')}</p>
      </main>
    );
  }

  if (status === 'error') {
    return (
      <main className="app-main">
        <Card role="alert">{t('app.loadError')}</Card>
      </main>
    );
  }

  return (
    <>
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<ClickerPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
    </>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </BrowserRouter>
  );
}

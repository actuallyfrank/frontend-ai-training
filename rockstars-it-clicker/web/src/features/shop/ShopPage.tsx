// TODO: migrate to new patterns (see features/profile)
import { useEffect, useState } from 'react';
import Spinner from '../../components/Spinner';
import { useGame } from '../../lib/game';
import UpgradeCard from './UpgradeCard';
import './shop.css';

export type ShopUpgrade = {
  id: string;
  category: string;
  name: string;
  baseCost: number;
  locPerSecond: number;
  clickPower: number;
};

const CATEGORIES = ['people', 'tools', 'culture', 'infra'];

const CATEGORY_TITLES: { [key: string]: string } = {
  people: 'People',
  tools: 'Tools',
  culture: 'Culture',
  infra: 'Infra',
};

export default function ShopPage() {
  const [upgrades, setUpgrades] = useState<ShopUpgrade[]>([]);
  const [loading, setLoading] = useState(true);
  const game = useGame();

  useEffect(() => {
    fetch('/api/upgrades')
      .then((res) => res.json())
      .then((data) => {
        setUpgrades(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="shop">
      <h1 className="shop-title">Shop</h1>
      {CATEGORIES.map((category) => (
        <div key={category} className="shop-category">
          <h2 className="shop-category-title">{CATEGORY_TITLES[category]}</h2>
          <div className="shop-grid">
            {upgrades
              .filter((upgrade) => upgrade.category === category)
              .map((upgrade) => (
                <UpgradeCard
                  key={upgrade.id}
                  upgrade={upgrade}
                  owned={game.owned[upgrade.id] || 0}
                  loc={game.loc}
                  onBuy={game.buy}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

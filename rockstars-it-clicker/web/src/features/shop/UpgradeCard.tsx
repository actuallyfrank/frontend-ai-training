import { COLORS } from '../../styles/theme';
import FLAVOURS from './flavours';
import type { ShopUpgrade } from './ShopPage';

function formatNumber(n: number) {
  if (n >= 1000000000) return (n / 1000000000).toFixed(1) + 'B';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(Math.floor(n));
}

type Props = {
  upgrade: ShopUpgrade;
  owned: number;
  loc: number;
  onBuy: (id: string) => void;
};

export default function UpgradeCard({ upgrade, owned, loc, onBuy }: Props) {
  const price = Math.ceil(upgrade.baseCost * Math.pow(1.15, owned));
  const affordable = loc >= price;

  return (
    <div
      className="upgrade-card"
      data-testid="upgrade-card"
      onClick={() => onBuy(upgrade.id)}
      style={{
        opacity: affordable ? 1 : 0.5,
        borderColor: affordable ? COLORS.success : COLORS.card,
      }}
    >
      <div className="upgrade-card-header">
        <span className="upgrade-name">{upgrade.name}</span>
        <span className="upgrade-owned">Owned: {owned}</span>
      </div>
      <p className="upgrade-flavour">{FLAVOURS[upgrade.id]}</p>
      <div className="upgrade-price" style={{ color: affordable ? COLORS.accent : COLORS.muted }}>
        {formatNumber(price)} LoC
      </div>
    </div>
  );
}

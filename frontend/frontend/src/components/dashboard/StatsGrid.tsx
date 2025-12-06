// src/components/dashboard/StatsGrid.tsx
import type { DashboardStats } from "../../types";

type Props = {
  stats: DashboardStats;
};

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(2) + "K";
  return n.toFixed(2);
}

export const StatsGrid: React.FC<Props> = ({ stats }) => {
  const cards = [
    {
      label: "24h Volume",
      value: formatNumber(stats.totalVolume24h),
      sub: "Total traded volume in last 24h",
    },
    {
      label: "24h Trades",
      value: stats.totalTrades24h.toString(),
      sub: "Number of transactions",
    },
    {
      label: "Whale Trades (24h)",
      value: stats.whaleTrades24h.toString(),
      sub: "Trades above whale threshold",
    },
    {
      label: "Active Wallets (24h)",
      value: stats.uniqueWallets24h.toString(),
      sub: "Unique senders & receivers",
    },
  ];

  return (
    <div className="grid gap-4 grid-template-columns-auto">
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            background: "#0f172a",
            borderRadius: "12px",
            padding: "16px",
            border: "1px solid #1e293b",
          }}
        >
          <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
            {card.label}
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 600, marginTop: 4 }}>
            {card.value}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 4 }}>
            {card.sub}
          </div>
        </div>
      ))}
    </div>
  );
};

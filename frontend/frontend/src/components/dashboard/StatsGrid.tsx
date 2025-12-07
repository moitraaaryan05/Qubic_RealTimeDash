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
            borderRadius: "12px",
            padding: "7px",
            border: "1px solid #1e293b",
          }}
          className="stat-grid"
        >
            <div 
            style={{
                background: "linear-gradient(to right, rgba(246, 96, 2, 1), rgba(247, 2, 141, 1))",
                borderRadius: "10px",
                padding: "16px",
                boxShadow: "0px 0px 10px rgba(252, 252, 252, 0.47)",
            }}
            className="box-hover"
            >
                <div style={{ fontSize: "1rem", color: "#090909ff", fontWeight: 650 }}>
                    {card.label}
                </div>
                <div style={{ fontSize: "1.6rem", fontWeight: 700, marginTop: 4 }}>
                    {card.value}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#020202ff", marginTop: 4 }}>
                    {card.sub}
                </div>
            </div>
        </div>
      ))}
    </div>
  );
};

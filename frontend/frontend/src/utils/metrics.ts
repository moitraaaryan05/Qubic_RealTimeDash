// src/utils/metrics.ts
import type { QubicEvent, DashboardStats, TimeBucketPoint } from "../types";

const WHALE_THRESHOLD = 10_000; // adjust for your token scale

export function computeDashboardStats(events: QubicEvent[]): DashboardStats {
  const now = new Date();
  const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000); // last 24h

  const recent = events.filter((e) => new Date(e.timestamp) >= cutoff);

  let totalVolume24h = 0;
  let totalTrades24h = 0;
  let whaleTrades24h = 0;
  const wallets = new Set<string>();

  for (const ev of recent) {
    totalTrades24h += 1;
    totalVolume24h += ev.amount;
    if (ev.amount >= WHALE_THRESHOLD) {
      whaleTrades24h += 1;
    }
    wallets.add(ev.from_address);
    wallets.add(ev.to_address);
  }

  return {
    totalVolume24h,
    totalTrades24h,
    whaleTrades24h,
    uniqueWallets24h: wallets.size,
  };
}

export function buildTimeBuckets(events: QubicEvent[]): TimeBucketPoint[] {
  const now = new Date();
  const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const recent = events.filter((e) => new Date(e.timestamp) >= cutoff);

  // map key: "YYYY-MM-DDTHH:00", value: { volume, trades }
  const bucketsMap = new Map<string, { volume: number; trades: number }>();

  for (const ev of recent) {
    const date = new Date(ev.timestamp);
    const hourKey = `${date.getUTCFullYear()}-${String(
      date.getUTCMonth() + 1
    ).padStart(2, "0")}-${String(date.getUTCDate()).padStart(
      2,
      "0"
    )}T${String(date.getUTCHours()).padStart(2, "0")}:00`;

    const current = bucketsMap.get(hourKey) || { volume: 0, trades: 0 };
    current.volume += ev.amount;
    current.trades += 1;
    bucketsMap.set(hourKey, current);
  }

  // Convert to sorted array by time
  const sortedKeys = Array.from(bucketsMap.keys()).sort();
  return sortedKeys.map((key) => {
    const { volume, trades } = bucketsMap.get(key)!;
    // Display label like "13:00"
    const label = key.slice(11, 16);
    return {
      bucket: label,
      volume,
      trades,
    };
  });
}

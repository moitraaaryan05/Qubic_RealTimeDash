// src/types.ts

export type QubicEvent = {
  tx_hash: string;
  from_address: string;
  to_address: string;
  token: string;
  amount: number;
  event_type: string; // "swap", "transfer", "buy", "sell", etc.
  timestamp: string;  // ISO string from backend
};

export type DashboardStats = {
  totalVolume24h: number;
  totalTrades24h: number;
  whaleTrades24h: number;
  uniqueWallets24h: number;
};

export type TimeBucketPoint = {
  bucket: string;     // e.g. "13:00", "14:00"
  volume: number;
  trades: number;
};

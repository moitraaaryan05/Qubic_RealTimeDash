// src/components/charts/VolumeChart.tsx
import type { TimeBucketPoint } from "../../types";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { FC } from "react";

type Props = {
  data: TimeBucketPoint[];
};

export const VolumeChart: FC<Props> = ({ data }) => {
  return (
    <div
      style={{
        background: "#0f172a",
        borderRadius: "12px",
        padding: "16px",
        border: "1px solid #1e293b",
        height: 320,
      }}
    >
      <div
        style={{
          marginBottom: 12,
          fontSize: "0.9rem",
          fontWeight: 600,
        }}
      >
        Volume Over Time (24h)
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1f2933" strokeDasharray="3 3" />
          <XAxis dataKey="bucket" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              border: "1px solid #1e293b",
              fontSize: "0.75rem",
            }}
          />
          <Area
            type="monotone"
            dataKey="volume"
            stroke="#38bdf8"
            fillOpacity={1}
            fill="url(#volumeFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

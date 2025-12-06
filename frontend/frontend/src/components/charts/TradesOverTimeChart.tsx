// src/components/charts/TradesOverTimeChart.tsx
import type { TimeBucketPoint } from "../../types";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Props = {
  data: TimeBucketPoint[];
};

export const TradesOverTimeChart: React.FC<Props> = ({ data }) => {
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
        Trades Over Time (24h)
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
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
          <Bar dataKey="trades" fill="#a855f7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

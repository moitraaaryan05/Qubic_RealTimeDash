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
        borderRadius: "12px",
        padding: "7px",
        // border: "1px solid rgba(0, 255, 68, 1)",
        width: "47.3%"
      }}
    >
        <div
            style={{
                borderRadius: "10px",
                background: "linear-gradient(to right, rgba(2, 2, 99, 1), rgba(59, 1, 2, 1))",
                padding: "16px",
                height: 320,
                boxShadow: "0px 0px 10px rgba(252, 252, 252, 0.47)",
            }}
            className="box-hover"
        >
            <div
                style={{
                marginBottom: 12,
                fontSize: "1rem",
                fontWeight: 700,
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
    </div>
  );
};

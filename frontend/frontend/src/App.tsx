// src/App.tsx
import { useMemo } from "react";
import { useQubicData } from "./hooks/useQubicData";
import { computeDashboardStats, buildTimeBuckets } from "./utils/metrics";
import { StatsGrid } from "./components/dashboard/StatsGrid";
import { TradesTable } from "./components/dashboard/TradesTable";
import { VolumeChart } from "./components/charts/VolumeChart";
import { TradesOverTimeChart } from "./components/charts/TradesOverTimeChart";

function App() {
  const { events, status } = useQubicData("http://localhost:8000");

  const stats = useMemo(() => computeDashboardStats(events), [events]);
  const buckets = useMemo(() => buildTimeBuckets(events), [events]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "#e5e7eb",
        padding: "16px",
      }}
    >
      {/* Header */}
      <header
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 700 }}>
            Qubic Real-Time Token Dashboard
          </h1>
          <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: 4 }}>
            Live market activity streamed from EasyConnect → FastAPI → WebSocket.
          </p>
        </div>
        <div>
          <StatusPill status={status} />
        </div>
      </header>

      {/* Stats row */}
      <section style={{ marginBottom: "16px" }}>
        <StatsGrid stats={stats} />
      </section>

      {/* Charts row */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        <VolumeChart data={buckets} />
        <TradesOverTimeChart data={buckets} />
      </section>

      {/* Trades table */}
      <section>
        <TradesTable events={events.slice(0, 100)} />
      </section>
    </div>
  );
}

type StatusProps = { status: string };

const StatusPill: React.FC<StatusProps> = ({ status }) => {
  const isOk = status === "connected" || status === "loading";
  const bg = isOk ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)";
  const color = isOk ? "#4ade80" : "#fca5a5";
  return (
    <div
      style={{
        padding: "6px 12px",
        borderRadius: "999px",
        fontSize: "0.75rem",
        background: bg,
        color,
        border: `1px solid ${color}30`,
      }}
    >
      WebSocket: {status}
    </div>
  );
};

export default App;

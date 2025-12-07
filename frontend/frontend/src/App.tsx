// src/App.tsx
import { useMemo } from "react";
import { useQubicData } from "./hooks/useQubicData";
import { computeDashboardStats, buildTimeBuckets } from "./utils/metrics";
import { StatsGrid } from "./components/dashboard/StatsGrid";
import { TradesTable } from "./components/dashboard/TradesTable";
import { VolumeChart } from "./components/charts/VolumeChart";
import { TradesOverTimeChart } from "./components/charts/TradesOverTimeChart";
import "./App.css"

function App() {
  const { events, status } = useQubicData("http://localhost:8000");

  const stats = useMemo(() => computeDashboardStats(events), [events]);
  const buckets = useMemo(() => buildTimeBuckets(events), [events]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#05091dff",
        color: "#e5e7eb",
        padding: "25px",
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
          <h1 style={{ fontSize: "2.1rem", fontWeight: 730, fontFamily: "Century Gothic" }}>
            Qubic Real-Time Token Dashboard
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#cdd2daff", marginTop: 4, fontFamily:"Bahnschrift", marginLeft: "2rem" }}>
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
          display: "flex",
          gap: "20px",
          justifyContent: "space-between",
          marginBottom: "35px",
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
  const bg = isOk ? "rgba(34,197,94,0.34)" : "rgba(239, 68, 68, 0.34)";
  const color = isOk ? "#74f7a4ff" : "#ffb9b9ff";
  return (
    <div
      style={{
        padding: "6px 12px",
        borderRadius: "999px",
        fontSize: "0.84rem",
        background: bg,
        color,
        border: `1.5px solid ${color}`,
      }}
    >
      WebSocket: {status}
    </div>
  );
};

export default App;

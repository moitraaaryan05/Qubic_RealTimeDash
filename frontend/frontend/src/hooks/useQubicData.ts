// src/hooks/useQubicData.ts
import { useEffect, useState } from "react";
import type { QubicEvent } from "../types";

type Status = "idle" | "loading" | "connected" | "error";

export function useQubicData(apiBase = "http://localhost:8000") {
  const [events, setEvents] = useState<QubicEvent[]>([]);
  const [status, setStatus] = useState<Status>("idle");

  // Helper to load latest metrics
  const fetchMetrics = async () => {
    try {
      const res = await fetch(`${apiBase}/api/metrics?limit=200`);
      if (!res.ok) {
        console.error("[useQubicData] /api/metrics error status", res.status);
        setStatus("error");
        return;
      }
      const raw = await res.json();
      // Handle both array and {events:[...]} just in case
      const data: QubicEvent[] = Array.isArray(raw)
        ? raw
        : Array.isArray(raw.events)
        ? raw.events
        : [];

      setEvents(data);
      setStatus("connected");
    } catch (err) {
      console.error("[useQubicData] Failed to load metrics", err);
      setStatus("error");
    }
  };

  // Initial load
  useEffect(() => {
    setStatus("loading");
    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase]);

  // Poll every 3 seconds for updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMetrics();
    }, 3000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase]);

  return { events, status };
}

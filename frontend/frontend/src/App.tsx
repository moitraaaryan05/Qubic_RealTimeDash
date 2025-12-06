import { useEffect, useState } from "react";

type QubicEvent = {
  tx_hash: string;
  from_address: string;
  to_address: string;
  token: string;
  amount: number;
  event_type: string;
  timestamp: string;
};

function App() {
  const [events, setEvents] = useState<QubicEvent[]>([]);
  const [status, setStatus] = useState<"connecting" | "connected" | "error">(
    "connecting"
  );

  // Load initial history
  useEffect(() => {
    const loadInitial = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/metrics?limit=50");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Failed to load initial metrics", err);
      }
    };
    loadInitial();
  }, []);

  // WebSocket subscription
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");

    ws.onopen = () => {
      setStatus("connected");
      // Some servers require a ping; our backend ignores messages but keeps connection open
      ws.send("hello from frontend");
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "new_event") {
          const newEvent: QubicEvent = msg.data;
          setEvents((prev) => [newEvent, ...prev].slice(0, 100));
        }
      } catch (err) {
        console.error("Error parsing WS message", err);
      }
    };

    ws.onerror = () => {
      setStatus("error");
    };

    ws.onclose = () => {
      setStatus("error");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Qubic Real-Time Token Dashboard
          </h1>
          <p className="text-sm text-slate-400">
            Live stream of Qubic events via EasyConnect → FastAPI → WebSocket.
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs ${
            status === "connected"
              ? "bg-emerald-500/20 text-emerald-300"
              : "bg-red-500/20 text-red-300"
          }`}
        >
          WebSocket: {status}
        </div>
      </header>

      <section className="bg-slate-900/60 rounded-xl p-4 shadow-lg border border-slate-800">
        <h2 className="text-lg font-semibold mb-3">Latest Events</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-3 py-2 text-left">Time (UTC)</th>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-left">Token</th>
                <th className="px-3 py-2 text-left">Amount</th>
                <th className="px-3 py-2 text-left">From</th>
                <th className="px-3 py-2 text-left">To</th>
                <th className="px-3 py-2 text-left">Tx Hash</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e, idx) => (
                <tr key={`${e.tx_hash}-${idx}`} className="border-t border-slate-800">
                  <td className="px-3 py-2">
                    {new Date(e.timestamp).toLocaleTimeString("en-GB", {
                      hour12: false,
                    })}
                  </td>
                  <td className="px-3 py-2 uppercase">{e.event_type}</td>
                  <td className="px-3 py-2">{e.token}</td>
                  <td className="px-3 py-2">{e.amount}</td>
                  <td className="px-3 py-2 text-xs truncate max-w-[140px]">
                    {e.from_address}
                  </td>
                  <td className="px-3 py-2 text-xs truncate max-w-[140px]">
                    {e.to_address}
                  </td>
                  <td className="px-3 py-2 text-xs truncate max-w-[160px]">
                    {e.tx_hash}
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-4 text-center text-slate-500">
                    No events yet. Once EasyConnect starts posting to the backend,
                    they will appear here in real time.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default App;

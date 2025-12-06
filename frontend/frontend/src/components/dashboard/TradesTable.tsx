// src/components/dashboard/TradesTable.tsx
import type { QubicEvent } from "../../types";

type Props = {
  events: QubicEvent[];
};

export const TradesTable: React.FC<Props> = ({ events }) => {
  return (
    <div
      style={{
        background: "#0f172a",
        borderRadius: "12px",
        padding: "16px",
        border: "1px solid #1e293b",
      }}
    >
      <div
        style={{
          marginBottom: 12,
          fontSize: "0.9rem",
          fontWeight: 600,
        }}
      >
        Latest Trades
      </div>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            fontSize: "0.8rem",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ background: "#020617" }}>
              <th style={thStyle}>Time (UTC)</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Token</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>From</th>
              <th style={thStyle}>To</th>
              <th style={thStyle}>Tx Hash</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e, idx) => (
              <tr key={`${e.tx_hash}-${idx}`} style={trStyle}>
                <td style={tdStyle}>
                  {new Date(e.timestamp).toISOString().slice(11, 19)}
                </td>
                <td style={tdStyle}>{e.event_type.toUpperCase()}</td>
                <td style={tdStyle}>{e.token}</td>
                <td style={tdStyle}>{e.amount}</td>
                <td style={{ ...tdStyle, maxWidth: 140, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {e.from_address}
                </td>
                <td style={{ ...tdStyle, maxWidth: 140, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {e.to_address}
                </td>
                <td style={{ ...tdStyle, maxWidth: 180, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {e.tx_hash}
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td style={tdStyle} colSpan={7}>
                  No events yet. Once EasyConnect starts posting to the backend,
                  trades will appear here in real time.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const thStyle: React.CSSProperties = {
  padding: "8px 12px",
  textAlign: "left",
  borderBottom: "1px solid #1e293b",
  color: "#9ca3af",
  fontWeight: 500,
};

const tdStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderBottom: "1px solid #1e293b",
  color: "#e5e7eb",
};

const trStyle: React.CSSProperties = {
  background: "transparent",
};

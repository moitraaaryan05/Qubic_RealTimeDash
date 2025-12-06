# backend/app/main.py

from datetime import datetime
from typing import List

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .schemas import QubicEvent  # keep your existing QubicEvent model


app = FastAPI()

# CORS – keep open for dev / hackathon; you can tighten later
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory event store (good enough for hackathon)
EVENTS: List[QubicEvent] = []


class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict) -> None:
        """Send a JSON message to all connected WebSocket clients."""
        disconnected: List[WebSocket] = []
        for ws in self.active_connections:
            try:
                await ws.send_json(message)
            except Exception:
                disconnected.append(ws)

        for ws in disconnected:
            self.disconnect(ws)


manager = ConnectionManager()


@app.post("/api/qubic-events")
async def receive_qubic_event(payload: dict = Body(...)):
    """
    Webhook endpoint for EasyConnect.

    EasyConnect sends a raw Qubic transaction payload, e.g.:

    {
      "ProcedureTypeName": "QxIssueAsset",
      "ProcedureTypeValue": 0,
      "RawTransaction": {
        "moneyFlew": false,
        "timestamp": "2025-01-01T12:00:00Z",
        "transaction": {
          "sourceId": "SRC_ID",
          "destId": "DEST_ID",
          "amount": "1000",
          "tickNumber": 12345,
          "inputType": 1,
          "inputSize": 56,
          "inputHex": "...",
          "signatureHex": "...",
          "txId": "txid-abc123"
        }
      },
      "ParsedTransaction": {
        "AssetName": "AssetLMN",
        "NumberOfShares": 100,
        "UnitOfMeasurement": 1,
        "DecimalPlaces": 2
      }
    }

    We map that into our internal QubicEvent model so the frontend
    always sees a clean, consistent structure.
    """

    raw_tx = payload.get("RawTransaction", {}).get("transaction", {}) or {}
    parsed = payload.get("ParsedTransaction", {}) or {}

    tx_hash = raw_tx.get("txId", "unknown-tx")
    from_address = raw_tx.get("sourceId", "unknown-from")
    to_address = raw_tx.get("destId", "unknown-to")

    # Token / asset name – adjust if you want a different field
    token = parsed.get("AssetName", "QUBIC")

    amount_str = raw_tx.get("amount", "0")
    try:
        amount = float(amount_str)
    except (TypeError, ValueError):
        amount = 0.0

    event_type = payload.get("ProcedureTypeName", "unknown")

    # Try to parse timestamp; fall back to "now" if not usable
    ts_raw = payload.get("RawTransaction", {}).get("timestamp")
    try:
        timestamp = datetime.fromisoformat(ts_raw) if ts_raw else datetime.utcnow()
    except Exception:
        timestamp = datetime.utcnow()

    # Build our internal, typed event object
    event = QubicEvent(
        tx_hash=tx_hash,
        from_address=from_address,
        to_address=to_address,
        token=token,
        amount=amount,
        event_type=event_type,
        timestamp=timestamp,
    )

    # Store in memory (simple ring buffer)
    EVENTS.append(event)
    if len(EVENTS) > 5000:
        del EVENTS[:1000]

    # Push to all connected WebSocket clients
    await manager.broadcast({"type": "new_event", "data": event.dict()})

    return {"status": "ok"}


@app.get("/api/metrics")
async def get_metrics(limit: int = 50):
    """
    Initial data for the dashboard.
    Returns the most recent `limit` events as QubicEvent dicts.
    """
    recent = list(reversed(EVENTS[-limit:]))
    return [e.dict() for e in recent]


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for the React frontend.
    Clients connect here to receive real-time events.
    """
    await manager.connect(websocket)
    try:
        while True:
            # We don't actually use messages from the client right now;
            # this just keeps the connection alive.
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@app.get("/")
async def root():
    return JSONResponse({"message": "Qubic real-time dashboard backend is running"})

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List
from datetime import datetime

from .schemas import QubicEvent

app = FastAPI()

# Allow your React dev server (e.g. localhost:5173) to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for hackathon MVP
EVENTS: List[QubicEvent] = []


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        # send to all connected clients
        disconnected = []
        for ws in self.active_connections:
            try:
                await ws.send_json(message)
            except Exception:
                disconnected.append(ws)
        for ws in disconnected:
            self.disconnect(ws)


manager = ConnectionManager()


@app.post("/api/qubic-events")
async def receive_qubic_event(event: QubicEvent):
    """
    This is the webhook endpoint you give to EasyConnect.
    EasyConnect will POST Qubic events here.
    """
    if event.timestamp is None:
        event.timestamp = datetime.utcnow()

    EVENTS.append(event)

    # Limit stored events (avoid memory explosion in long sessions)
    if len(EVENTS) > 5000:
        del EVENTS[:1000]

    # Broadcast to all WebSocket clients
    await manager.broadcast({"type": "new_event", "data": event.dict()})

    return {"status": "ok"}


@app.get("/api/metrics")
async def get_metrics(limit: int = 50):
    """
    Used by the dashboard for initial load.
    Returns the most recent 'limit' events.
    Later you can expand this with aggregated stats.
    """
    recent = list(reversed(EVENTS[-limit:]))
    return [e.dict() for e in recent]


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    Frontend connects here for live updates.
    """
    await manager.connect(websocket)
    try:
        while True:
            # We don't expect messages from client, just keep connection open
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@app.get("/")
async def root():
    return JSONResponse({"message": "Qubic real-time dashboard backend is running"})

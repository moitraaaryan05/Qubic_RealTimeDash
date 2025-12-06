from datetime import datetime
from pydantic import BaseModel, Field


class QubicEvent(BaseModel):
    tx_hash: str
    from_address: str
    to_address: str
    token: str
    amount: float
    event_type: str = Field(..., description="e.g. 'swap', 'transfer', 'buy', 'sell'")
    timestamp: datetime | None = None

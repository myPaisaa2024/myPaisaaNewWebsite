"""CTA click analytics — write events, read a per-CTA summary."""

from datetime import datetime, timezone

from fastapi import APIRouter

from lib.db import db
from models.cta import CtaEvent, CtaEventCreate, CtaSummary

router = APIRouter()


@router.post("/cta-events", response_model=CtaEvent, status_code=201)
async def record_cta_event(input: CtaEventCreate):
    event = CtaEvent(**input.model_dump(), created_at=datetime.now(timezone.utc))
    await db.cta_events.insert_one(event.model_dump())
    return event


@router.get("/cta-events/summary", response_model=list[CtaSummary])
async def cta_summary():
    docs = await db.cta_events.find().to_list(5000)
    totals: dict[str, dict] = {}
    for doc in docs:
        entry = totals.setdefault(doc["cta_id"], {"clicks": 0, "last_at": None})
        entry["clicks"] += 1
        ts = doc.get("created_at")
        if ts and (entry["last_at"] is None or ts > entry["last_at"]):
            entry["last_at"] = ts
    out: list[CtaSummary] = []
    for cta_id, entry in totals.items():
        last = entry["last_at"]
        # Motor hands back naive datetimes — normalise to aware UTC before serialising.
        if last is not None and last.tzinfo is None:
            last = last.replace(tzinfo=timezone.utc)
        out.append(CtaSummary(cta_id=cta_id, clicks=entry["clicks"], last_at=last))
    out.sort(key=lambda s: (-s.clicks, s.cta_id))
    return out

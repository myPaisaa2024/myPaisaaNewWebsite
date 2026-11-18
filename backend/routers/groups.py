"""Vacant chit groups — open groups, most-urgent first."""

from datetime import datetime, timedelta, timezone

from fastapi import APIRouter

from lib.db import db
from models.groups import GROUP_CATALOG, ChitGroup

router = APIRouter()


def _with_seats_left(doc: dict) -> ChitGroup:
    doc = dict(doc)
    doc["seats_left"] = max(0, doc.get("seats_total", 0) - doc.get("seats_filled", 0))
    return ChitGroup(**doc)


def _catalog_group(entry: dict) -> ChitGroup:
    today = datetime.now(timezone.utc).date()
    starts_on = today + timedelta(days=entry["starts_in_days"])
    return _with_seats_left(
        {
            "group_code": entry["group_code"],
            "plan_slug": entry["plan_slug"],
            "city": entry["city"],
            "seats_total": entry["seats_total"],
            "seats_filled": entry["seats_filled"],
            "starts_on": starts_on.isoformat(),
            "status": "open",
        }
    )


def _sorted_open(groups: list[ChitGroup]) -> list[ChitGroup]:
    return sorted((g for g in groups if g.status == "open" and g.seats_left > 0), key=lambda g: (g.seats_left, g.starts_on))


@router.get("/vacant-groups", response_model=list[ChitGroup])
async def list_vacant_groups():
    docs = await db.chit_groups.find().to_list(100)
    groups = _sorted_open([_with_seats_left(d) for d in docs])
    if groups:
        return groups
    # Collection not seeded yet — serve the built-in catalogue so the strip never starves.
    return _sorted_open([_catalog_group(entry) for entry in GROUP_CATALOG])

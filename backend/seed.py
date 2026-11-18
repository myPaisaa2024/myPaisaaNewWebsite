"""Idempotent seed for the myPaisaa homepage. Run: cd /app/backend && python seed.py"""

import asyncio
from datetime import datetime, timedelta, timezone

from lib.db import db, ensure_indexes
from models.groups import GROUP_CATALOG
from models.plans import PLAN_CATALOG


async def seed() -> None:
    for plan in PLAN_CATALOG:
        await db.plans.update_one({"slug": plan["slug"]}, {"$set": plan}, upsert=True)
    print(f"seeded {len(PLAN_CATALOG)} chit plans")

    today = datetime.now(timezone.utc).date()
    for group in GROUP_CATALOG:
        doc = {k: v for k, v in group.items() if k != "starts_in_days"}
        doc["starts_on"] = (today + timedelta(days=group["starts_in_days"])).isoformat()
        doc["status"] = "open"
        await db.chit_groups.update_one(
            {"group_code": doc["group_code"]}, {"$set": doc}, upsert=True
        )
    print(f"seeded {len(GROUP_CATALOG)} chit groups")

    await ensure_indexes()


if __name__ == "__main__":
    asyncio.run(seed())

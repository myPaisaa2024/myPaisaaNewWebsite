"""/v3 lead capture + brief plan catalogue. Lead list (POST /leads/list) is passcode-gated (LEADS_PASSCODE in .env)."""

import hmac
import os
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from lib.db import db
from models.leads import BriefPlan, Lead, LeadCreate, LeadsQuery

router = APIRouter()

# Source: myPaisaa Agency Brief plan table.
BRIEF_PLANS: list[BriefPlan] = [
    BriefPlan(slug="1l", chit_value=100000, emi_min=4000, emi_max=4000, durations=[25], auctions_per_month=4, advisor_assisted=False),
    BriefPlan(slug="2l", chit_value=200000, emi_min=8000, emi_max=8000, durations=[25], auctions_per_month=4, advisor_assisted=False),
    BriefPlan(slug="3l", chit_value=300000, emi_min=10000, emi_max=10000, durations=[30], auctions_per_month=2, advisor_assisted=False),
    BriefPlan(slug="5l", chit_value=500000, emi_min=10000, emi_max=20000, durations=[25, 50], auctions_per_month=2, advisor_assisted=False),
    BriefPlan(slug="10l", chit_value=1000000, emi_min=20000, emi_max=40000, durations=[25, 50], auctions_per_month=2, advisor_assisted=True),
    BriefPlan(slug="15l", chit_value=1500000, emi_min=30000, emi_max=30000, durations=[50], auctions_per_month=2, advisor_assisted=True),
    BriefPlan(slug="25l", chit_value=2500000, emi_min=50000, emi_max=100000, durations=[25, 50], auctions_per_month=2, advisor_assisted=True),
]
VALID_VALUES = {p.chit_value for p in BRIEF_PLANS}


@router.get("/v3/plans", response_model=list[BriefPlan])
async def brief_plans():
    return BRIEF_PLANS


@router.post("/leads", response_model=Lead, status_code=201)
async def create_lead(input: LeadCreate):
    if input.plan_value is not None and input.plan_value not in VALID_VALUES:
        raise HTTPException(status_code=422, detail="Unknown plan value")
    lead = Lead(
        **input.model_dump(),
        high_value=(input.plan_value or 0) >= 1000000,
        created_at=datetime.now(timezone.utc),
    )
    await db.leads.insert_one(lead.model_dump())
    return lead


@router.post("/leads/list", response_model=list[Lead])
async def list_leads(input: LeadsQuery):
    expected = os.environ.get("LEADS_PASSCODE", "")
    if not expected or not hmac.compare_digest(input.passcode, expected):
        raise HTTPException(status_code=401, detail="Wrong passcode")
    docs = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for d in docs:
        d.setdefault("source", "v3")
        if d["created_at"].tzinfo is None:
            d["created_at"] = d["created_at"].replace(tzinfo=timezone.utc)
    return [Lead(**d) for d in docs]

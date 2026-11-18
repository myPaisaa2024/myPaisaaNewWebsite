"""Chit plan catalogue routes — every plan-serving surface reads from here."""

from fastapi import APIRouter, HTTPException
from pymongo import ASCENDING

from lib.db import db
from models.plans import PLAN_CATALOG, Plan

router = APIRouter()


@router.get("/plans", response_model=list[Plan])
async def list_plans():
    docs = await db.plans.find().sort("sort_order", ASCENDING).to_list(100)
    if docs:
        return [Plan(**doc) for doc in docs]
    # Collection not seeded yet — serve the built-in catalogue so the page never starves.
    return [Plan(**plan) for plan in PLAN_CATALOG]


@router.get("/plans/{slug}", response_model=Plan)
async def get_plan(slug: str):
    doc = await db.plans.find_one({"slug": slug})
    if doc is None:
        builtin = next((p for p in PLAN_CATALOG if p["slug"] == slug), None)
        if builtin is None:
            raise HTTPException(status_code=404, detail=f"plan '{slug}' not found")
        return Plan(**builtin)
    return Plan(**doc)

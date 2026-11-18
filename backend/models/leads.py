"""Advisor-callback leads from the /v3 page, plus the brief's chit plan catalogue."""

import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator

Goal = Literal["save", "borrow", "invest"]


class BriefPlan(BaseModel):
    slug: str
    chit_value: int
    emi_min: int
    emi_max: int
    durations: list[int]  # months; several = choose one
    auctions_per_month: int
    advisor_assisted: bool  # ₹10L+ plans → qualified-lead conversation


class LeadCreate(BaseModel):
    name: str = Field(min_length=2, max_length=60)
    phone: str = Field(pattern=r"^[6-9]\d{9}$", description="10-digit Indian mobile")
    city: str = Field(min_length=2, max_length=40)
    goal: Goal
    plan_value: int | None = Field(default=None, ge=100000, le=2500000)
    lang: Literal["en", "te"] = "en"
    consent: bool
    source: Literal["v3", "v4", "v5", "v6"] = "v3"
    profile: Literal["save", "borrow", "invest", "explore"] | None = None
    profession: Literal["salaried", "business", "self", "other"] | None = None
    value_band: Literal["1-3", "5-10", "15-30", "unsure"] | None = None
    details: dict[str, str] | None = None  # profile-specific answers from /v5 (goal_type, urgency, question…)

    @field_validator("details")
    @classmethod
    def small_details(cls, v: dict[str, str] | None) -> dict[str, str] | None:
        if v is None:
            return v
        if len(v) > 6 or any(len(k) > 30 or len(x) > 500 for k, x in v.items()):
            raise ValueError("details too large")
        return {k: x.strip() for k, x in v.items() if x.strip()} or None

    @field_validator("name", "city")
    @classmethod
    def strip(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("too short")
        return v

    @field_validator("consent")
    @classmethod
    def must_consent(cls, v: bool) -> bool:
        if not v:
            raise ValueError("consent is required")
        return v


class Lead(LeadCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    high_value: bool  # plan ≥ ₹10L — the brief's qualified-lead tier
    created_at: datetime


class LeadsQuery(BaseModel):
    passcode: str = Field(max_length=100)

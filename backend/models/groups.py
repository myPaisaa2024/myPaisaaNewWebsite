"""Chit groups with live seat availability — powers the vacant-chits strip."""

import uuid

from pydantic import BaseModel, Field


class ChitGroup(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    group_code: str
    plan_slug: str
    city: str
    seats_total: int
    seats_filled: int
    seats_left: int = 0  # computed on read: seats_total - seats_filled
    starts_on: str  # YYYY-MM-DD, set at seed time relative to the server clock
    status: str = "open"  # open | full


# Seed source: starts_in_days is converted to a concrete starts_on by seed.py.
GROUP_CATALOG: list[dict] = [
    {
        "group_code": "MP-3L-1180",
        "plan_slug": "3-lakh",
        "city": "Hyderabad",
        "seats_total": 25,
        "seats_filled": 22,
        "starts_in_days": 9,
    },
    {
        "group_code": "MP-5L-0457",
        "plan_slug": "5-lakh",
        "city": "Bangalore",
        "seats_total": 50,
        "seats_filled": 45,
        "starts_in_days": 16,
    },
    {
        "group_code": "MP-1L-0912",
        "plan_slug": "1-lakh",
        "city": "Secunderabad",
        "seats_total": 20,
        "seats_filled": 13,
        "starts_in_days": 21,
    },
    {
        "group_code": "MP-10L-1123",
        "plan_slug": "10-lakh",
        "city": "Vijayawada",
        "seats_total": 25,
        "seats_filled": 16,
        "starts_in_days": 30,
    },
    {
        "group_code": "MP-15L-0334",
        "plan_slug": "15-lakh",
        "city": "Khammam",
        "seats_total": 30,
        "seats_filled": 26,
        "starts_in_days": 37,
    },
    {
        "group_code": "MP-3L-1205",
        "plan_slug": "3-lakh",
        "city": "Warangal",
        "seats_total": 25,
        "seats_filled": 9,
        "starts_in_days": 44,
    },
]

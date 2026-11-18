"""Canonical chit plan catalogue — the single source of truth behind /api/plans.

Seeded into Mongo by seed.py; the plans router falls back to this catalogue if the
collection has not been seeded yet, so the page never starves.
"""

import uuid

from pydantic import BaseModel, Field


class Plan(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    name: str
    fund_value: int  # total chit value in rupees
    monthly_contribution: int
    duration_months: int
    commission_pct: float  # company commission on the chit value
    est_monthly_dividend: int  # ~annual commission pool spread monthly
    potential_auction_winning: int  # ~95% of fund value for an early, low-discount bid
    tier: str  # starter | growth | wealth
    badge: str | None = None
    highlights: list[str] = []
    sort_order: int


PLAN_CATALOG: list[dict] = [
    {
        "id": "plan-1-lakh",
        "slug": "1-lakh",
        "name": "₹1 Lakh Chit Plan",
        "fund_value": 100000,
        "monthly_contribution": 4000,
        "duration_months": 25,
        "commission_pct": 5.0,
        "est_monthly_dividend": 417,
        "potential_auction_winning": 95000,
        "tier": "starter",
        "badge": "Start here",
        "highlights": [
            "Lowest entry — save just ₹4,000 a month",
            "A gentle first chit for new savers",
        ],
        "sort_order": 1,
    },
    {
        "id": "plan-3-lakh",
        "slug": "3-lakh",
        "name": "₹3 Lakh Chit Plan",
        "fund_value": 300000,
        "monthly_contribution": 10000,
        "duration_months": 30,
        "commission_pct": 5.0,
        "est_monthly_dividend": 1250,
        "potential_auction_winning": 285000,
        "tier": "growth",
        "badge": "Most popular",
        "highlights": [
            "Balanced savings and borrowing power",
            "A favourite for gold, travel and school fees",
        ],
        "sort_order": 2,
    },
    {
        "id": "plan-5-lakh",
        "slug": "5-lakh",
        "name": "₹5 Lakh Chit Plan",
        "fund_value": 500000,
        "monthly_contribution": 10000,
        "duration_months": 50,
        "commission_pct": 5.0,
        "est_monthly_dividend": 2083,
        "potential_auction_winning": 475000,
        "tier": "growth",
        "badge": None,
        "highlights": [
            "Same ₹10,000 monthly, a much bigger corpus",
            "Long 50-month runway with dividends along the way",
        ],
        "sort_order": 3,
    },
    {
        "id": "plan-10-lakh",
        "slug": "10-lakh",
        "name": "₹10 Lakh Chit Plan",
        "fund_value": 1000000,
        "monthly_contribution": 20000,
        "duration_months": 50,
        "commission_pct": 5.0,
        "est_monthly_dividend": 4167,
        "potential_auction_winning": 950000,
        "tier": "growth",
        "badge": "Business favourite",
        "highlights": [
            "Serious corpus for weddings, renovation or inventory",
            "Bid in weekly e-auctions from the app",
        ],
        "sort_order": 4,
    },
    {
        "id": "plan-15-lakh",
        "slug": "15-lakh",
        "name": "₹15 Lakh Chit Plan",
        "fund_value": 1500000,
        "monthly_contribution": 30000,
        "duration_months": 50,
        "commission_pct": 5.0,
        "est_monthly_dividend": 6250,
        "potential_auction_winning": 1425000,
        "tier": "wealth",
        "badge": None,
        "highlights": [
            "High-value funds on a monthly budget",
            "Popular with growing businesses and joint families",
        ],
        "sort_order": 5,
    },
    {
        "id": "plan-25-lakh",
        "slug": "25-lakh",
        "name": "₹25 Lakh Chit Plan",
        "fund_value": 2500000,
        "monthly_contribution": 50000,
        "duration_months": 50,
        "commission_pct": 5.0,
        "est_monthly_dividend": 10417,
        "potential_auction_winning": 2375000,
        "tier": "wealth",
        "badge": None,
        "highlights": [
            "Business-scale liquidity when opportunity knocks",
            "Dividends soften the cost of borrowing early",
        ],
        "sort_order": 6,
    },
    {
        "id": "plan-30-lakh",
        "slug": "30-lakh",
        "name": "₹30 Lakh Chit Plan",
        "fund_value": 3000000,
        "monthly_contribution": 100000,
        "duration_months": 30,
        "commission_pct": 5.0,
        "est_monthly_dividend": 12500,
        "potential_auction_winning": 2850000,
        "tier": "wealth",
        "badge": None,
        "highlights": [
            "Our largest chit — maximum auction power",
            "A compact 30-month term for decisive planners",
        ],
        "sort_order": 7,
    },
]

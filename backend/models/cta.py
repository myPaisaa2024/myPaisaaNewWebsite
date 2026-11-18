"""CTA click events — every WhatsApp button and store badge is tagged and counted."""

import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class CtaEventCreate(BaseModel):
    cta_id: str = Field(min_length=1, max_length=80)
    event_type: str = "whatsapp"  # whatsapp | download
    plan_slug: str | None = None
    group_code: str | None = None


class CtaEvent(CtaEventCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime  # stored aware-UTC so JS new Date() parses it


class CtaSummary(BaseModel):
    cta_id: str
    clicks: int
    last_at: datetime | None = None

import { apiPost } from "@/lib/api";

export interface TrackMeta {
  eventType?: "whatsapp" | "download";
  planSlug?: string;
  groupCode?: string;
}

// Hand-written mirror of the CtaEvent Pydantic model in backend/models/cta.py.
interface CtaEvent {
  id: string;
  cta_id: string;
  event_type: string;
  plan_slug: string | null;
  group_code: string | null;
  created_at: string;
}

/**
 * Fire-and-forget CTA tagging — analytics must never delay or break a click.
 * Every WhatsApp button and store badge passes its section's cta_id here.
 * View the tally at /stats (GET /api/cta-events/summary).
 */
export function trackCta(ctaId: string, meta: TrackMeta = {}): void {
  apiPost<CtaEvent>("/cta-events", {
    cta_id: ctaId,
    event_type: meta.eventType ?? "whatsapp",
    plan_slug: meta.planSlug ?? null,
    group_code: meta.groupCode ?? null,
  }).catch(() => null);
}

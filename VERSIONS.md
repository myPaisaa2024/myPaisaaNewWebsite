# myPaisaa — Homepage Variations

This single codebase hosts six coexisting homepage variations of the myPaisaa
lead-generation site, plus a shared FastAPI + MongoDB backend, callback lead
capture and CTA tracking. Each variation lives on its own route; none of them
overwrites another.

## Version map

| Version | Route | What it is | Main page file | Unique code |
|---|---|---|---|---|
| Version 1 | `/` | Original homepage (English / Telugu / Kannada) | `frontend/src/pages/Home.tsx` | `frontend/src/components/mypaisaa/`, `frontend/src/i18n/en.ts`, `frontend/src/i18n/te.ts`, `frontend/src/i18n/kn.ts`, `frontend/src/lib/i18n.tsx` |
| Version 2 | `/v2` | GripInvest-style layout | `frontend/src/pages/HomeV2.tsx` | `frontend/src/components/v2/` |
| Version 3 | `/v3` | Clean high-tech layout (per the myPaisaa Agency Brief) | `frontend/src/pages/HomeV3.tsx` | `frontend/src/components/v3/`, `frontend/src/lib/v3.ts`, `frontend/src/i18n/v3.ts` |
| Version 4 | `/v4` | Profile-gated: Save / Borrow / Invest / Explore | `frontend/src/pages/HomeV4.tsx` | `frontend/src/components/v4/` |
| Version 5 | `/v5` | Story-Led Journey (9 chapters per profile + sharper "Why myPaisaa") | `frontend/src/pages/HomeV5.tsx` | `frontend/src/components/v5/` |
| Version 6 | `/v6` | Personal Chit Advisor (chat-style welcome) | `frontend/src/pages/HomeV6.tsx` | `frontend/src/components/v6/`, `frontend/src/lib/v6.ts` |

## Shared by every version

- Routing: `frontend/src/App.tsx` (route table), `frontend/src/main.tsx`
- API layer: `frontend/src/lib/api.ts` (typed fetch over `/api`), `frontend/src/lib/track.ts` (CTA tracking), `frontend/src/lib/plans.ts`, `frontend/src/lib/groups.ts`, `frontend/src/lib/blog.ts`, `frontend/src/lib/contact.ts`, `frontend/src/lib/format.ts`
- UI kit: `frontend/src/components/ui/` (shadcn/base-nova), `frontend/src/index.css`
- Internal pages: `frontend/src/pages/Leads.tsx` (callback leads), `frontend/src/pages/Stats.tsx` (CTA stats)
- Backend: `backend/` (FastAPI routers + models for plans, groups, cta events, leads, blog)

## Branch layout

- `main` — the full app with all six variations (this tree).
- `version-1` … `version-6` — the same runnable app plus an isolated copy of
  that variation's unique files under `versions/version-<N>/`, so each
  version's own code can be browsed or downloaded on its own. Each copy folder
  carries its own README describing the version.

## Claim-safety notes

Marketing numbers (e.g. "up to 12% p.a.", "150–170% of comparable chit
companies") come from the myPaisaa Agency Brief and are the only safe claims.
Pre-filled WhatsApp messages are always in English, even when the UI is
localized.

# myPaisaa — App Spec

## What it is
Single-page, conversion-focused redesign of mypaisaa.com — the regulated digital chit fund
offer (7 plans, ₹1L–₹30L) as a modern fintech homepage. Goals: WhatsApp sign-ups, app
downloads, trust. Public URL: https://mypaisaa-v2-v6--6bpfkyik.preview.emergentagent.com

## Brand (taken from the live site, per user request)
- Official logo: `frontend/public/mypaisaa-logo.svg` (downloaded from mypaisaa.com's
  Logo_navbar.svg) — used in Navbar and on a white pill in the Footer.
- Colors (from the live logo/site): orange #FF6431 (brand primary), brand-ink #C13A0E
  (small text on light), deep blue #024180 (headings/ink), navy surfaces #04234A /
  #021A38, mist #EAF3FB, WhatsApp green #25D366 for all WA CTAs. Tokens live in
  `frontend/src/index.css` (@theme inline + :root/.dark).

## Sections (all on `/`)
Navbar (sticky glass, real logo, WhatsApp CTA) → Hero (navy, headline, dual CTA, plan
quick-checker, trust strip, cities marquee) → TrustCompliance bento (Chit Funds Act 1982,
100% security deposit, UPI/Razorpay, DPIIT, e-auctions) → PlanComparison (id=calculator,
slider data-testid=chit-slider over 7 plans + math panel + desktop table) → EligibilityChecker
(id=eligibility, 4-question flow → verdict + prefilled wa.me handoff) → HowItWorks (4 steps)
→ PlanCards (id=plans, tiered starter/growth/wealth, per-card enquire) → **VacantChits**
(id=vacant, horizontal rail of open chit groups: group code, city, starts date, seats gauge,
"Join before it fills" badge when seats_left ≤ 5, per-group Reserve-on-WhatsApp) →
Testimonials (navy) → Faq (accordion) → AppDownloadBand (id=download) → **BlogTeaser**
(id=blog, 3 real posts from blog.mypaisaa.com fetched server-side, graceful fallback card)
→ Footer (statutory: Finsave Technologies / IBG eChits India) → StickyMobileBar (mobile).

## CTA analytics
- `trackCta(ctaId, meta)` in `frontend/src/lib/track.ts` — fire-and-forget POST /api/cta-events;
  wired into every WhatsApp button (navbar, hero, hero-plan, comparison, eligibility,
  plan-card-<slug>, vacant-reserve-<code>, sticky, footer, error fallbacks) and every store
  badge (event_type=download).
- Backend: POST /api/cta-events (201, Pydantic-validated, 422 on missing cta_id),
  GET /api/cta-events/summary (per-CTA clicks + last_at, highest first).
- Dashboard: unlinked `/stats` page (TanStack Query table, 10s refetch).

## Data model (backend)
- `models/plans.py` — Plan + PLAN_CATALOG (7 real plans: ₹1L/₹4k/25m, ₹3L/₹10k/30m,
  ₹5L/₹10k/50m, ₹10L/₹20k/50m, ₹15L/₹30k/50m, ₹25L/₹50k/50m, ₹30L/₹1L/30m).
- `models/groups.py` — ChitGroup (group_code unique, plan_slug, city, seats_total/filled,
  seats_left computed on read, starts_on YYYY-MM-DD, status) + GROUP_CATALOG (6 groups).
- `models/cta.py` — CtaEventCreate/CtaEvent (aware-UTC created_at)/CtaSummary.
- `models/blog.py` — BlogPost (title, link, excerpt, image, published label).
- Endpoints: GET /api/plans, GET /api/plans/{slug} (404), GET /api/vacant-groups
  (open only, sorted seats_left asc, catalog fallback if unseeded), POST /api/cta-events,
  GET /api/cta-events/summary, GET /api/blog/posts (RSS from blog.mypaisaa.com/feed/,
  30-min in-memory cache, stale-or-empty on failure).
- `seed.py` idempotently seeds plans + chit groups (starts_on relative to server date).
- TS mirrors: lib/plans.ts, lib/groups.ts, lib/blog.ts, lib/track.ts — keep in sync.
- Indexes in lib/db.py INDEXES: plans(slug uniq, sort_order), chit_groups(group_code uniq,
  status), cta_events(cta_id+created_at).

## Contacts / links (lib/contact.ts)
WhatsApp wa.me/919100007724; Play Store com.mypaisaa.app; App Store id1538162542;
license page mypaisaa.com/license.html; blog blog.mypaisaa.com; support info@mypaisaa.com /
+91-7795 665 154.

## Languages (English / Telugu / Kannada)
- Dictionaries: `frontend/src/i18n/en.ts` (source of truth, exports `Dict`), `te.ts`, `kn.ts`
  (typed `Dict`, so a missing key is a typecheck error). Includes plan names/badges/highlights
  keyed by plan slug, so backend English plan copy is mapped per language on the frontend.
- `frontend/src/lib/i18n.tsx`: `LangProvider` (wraps Home only; /stats stays English) +
  `useLang()` → `{ lang, t, setLang }`. First visit follows the phone's primary language
  (te/kn, else en); a manual pick via the navbar switcher (`lang-option-en|te|kn`) is saved in
  localStorage `mypaisaa-lang`. Sets `<html lang>` and document.title.
- **WhatsApp pre-filled messages always stay English** (user choice) — the eligibility checker
  stores option indices and builds its message from `en`.
- Fonts: Noto Sans Telugu / Kannada (variable, @fontsource) as per-glyph fallbacks in the
  font stacks; letter-spacing is reset under `html:lang(te|kn)` (it breaks conjunct shaping).
- Blog posts come from the English feed; te/kn show an "articles are in English" note.

## Auth
None — no login, no gated areas. `memory/test_credentials.md` notes N/A.

## Fonts / motion
Outfit (headings) + Plus Jakarta Sans (body) + IBM Plex Mono (group codes), via @fontsource.
Motion via motion/react (Reveal wrapper, reduced-motion aware) + CSS marquee keyframe.

## /v2 — Grip Invest-inspired homepage (alternate version)
- Route `/v2` (pages/HomeV2.tsx, components/v2/*). Classic home at `/` untouched.
- Borrows gripinvest.in layout/feel only; myPaisaa colours + logo kept. English only.
- Sections: nav, hero (check bullets + media card), stats band, "What we offer" (plans grouped Starter <5L / Growth 5–10L / Wealth 15L+, from /api/plans, seat badges from /api/vacant-groups), Why choose (3 cards), tradition→digital diagram, Wall of Love marquee (en.stories), app band with Play Store QR (qrcode.react), blog guides (/api/blog/posts), footer, floating QR card (desktop), sticky mobile Get Started.
- Every CTA tracked with `v2-*` cta_ids (visible at /stats).

## /v3 — Agency-brief lead-gen homepage
- Route `/v3` (pages/HomeV3.tsx, components/v3/*, copy in i18n/v3.ts EN+Telugu; language follows phone, switch in nav, shared localStorage key).
- Built from myPaisaa_Agency_Brief.docx: trust-first hero ("Not a scheme…"), Save/Borrow toggle, proof bar (3,00,000+ users, ₹1,200 Cr+, 5% vs 7% cap, 2-min onboarding), T-Chits verification + legal entities, brief plan table (₹1L–₹25L, auctions/month, ₹10L+ advisor-assisted), how-it-works, full charges table, 8 objection FAQs, lead form, app QR, compliance footer. No scarcity/countdowns per brief.
- APIs: GET /api/v3/plans (brief table, backend constant), POST /api/leads (validates Indian mobile ^[6-9]\d{9}$, consent required, plan must be a brief value; high_value = plan ≥ ₹10L), POST /api/leads/list {passcode} → leads (401 on wrong passcode; LEADS_PASSCODE in backend/.env).
- After submit: success card → WhatsApp (English prefilled with lead details) + install app.
- /leads page: passcode-gated lead table.

## /v4 — Profile-driven homepage (English)
- Route `/v4` (pages/HomeV4.tsx, components/v4/{profiles.ts,Gate4.tsx,Sections4.tsx}; reuses v3 sections in English via V3Context).
- First visit shows a full-screen chooser: Save / Borrow / Invest / Just exploring. Choice stored in localStorage `mypaisaa-profile` and URL `?for=<profile>` (shareable ad links). Sticky "Showing for" switcher in nav re-renders everything.
- profiles.ts config per profile drives: hero copy + CTA order + visual, proof stats, section order, planner (save goal planner / borrow funds planner / investor desk / explore explainer + fit picker), comparison table (vs RD / loans / FD & equity), plan filter (save ≤₹10L, invest ≥₹10L), FAQ subset, lead-form goal + headline.
- Leads from /v4 are stored with source="v4" and profile; /leads shows a Source column.

## /v5 — Four story-led journeys (English)
- Route `/v5` (pages/HomeV5.tsx, components/v5/{kit.tsx,SaveStory,BorrowStory,InvestStory,ExploreStory}.tsx). Reuses v4 Gate (tracked as v5-gate-*), v3 LeadForm3 (now supports `extras`, `extraInit`, `sectionId`) and Footer3.
- Profile stored in localStorage `mypaisaa-profile-v5` + `?for=`. Switching restarts at Chapter 1. Accent per profile via CSS vars --acc/--acc-soft (save green, borrow orange, invest navy, explore slate).
- Each story = 9 chapters with an illustrative character (Lakshmi / Ramesh / Mr. Rao / Anita), its own tool (goal planner, funds planner, ladder builder, auction simulator), charges highlights + full table on demand, trust, FAQs, close + profile-specific callback form.
- Chapter rail fixed left on xl+ (labels on 2xl), progress bar below nav otherwise; nav shows "Chapter N of 9 — label".
- Leads: source "v5", `details` dict (save: goal_type,target_year · borrow: amount_needed,urgency,use · invest: amount_band,call_time · explore: question), ≤6 keys, ≤500 chars each; shown on /leads.
- Tracking ids: v5-{profile}-ch{n}-{action}, v5-{profile}-rail-{n}, v5-switch-{profile}.

## /v6 — Personal chit advisor (English)
- Route `/v6` (pages/HomeV6.tsx, components/v6/{Welcome.tsx,Story6.tsx,copy.ts}, lib/v6.ts). Reuses v5 kit (Hook, Chapter, ChapterRail w/ trackId, ChargesDisclosure, Explainer, AuctionSim) and v3 LeadForm3 (new props initialName, caseInfo).
- Welcome: chat-style 4 steps (name optional/skip, purpose, profession salaried|business|self|other, band 1-3|5-10|15-30, "unsure" explorers only), progress + Back, closing line, then story. Case saved in localStorage `mypaisaa-case-v6` (name stays in browser unless lead submitted). URL `?for=&work=&value=` pre-answers steps (name still asked). "Your details" chip in nav → edit mode (all steps, restart at ch1).
- Story: 9 chapters; hook by purpose×profession (copy.ts HOOKS), problem by profession, mechanism/tool by purpose (goal planner / funds planner / ladder via best-combination search / auction sim) preset to band default (BAND_DEFAULT), plans filtered by band (BAND_PLANS), 15–30 combined-group note, invest+1–3 mismatch notice → savings plans, costs computed for picked/default plan, profession tax/surety fact, FAQ pool ordered by purpose/profession, close addressed by name; form pre-filled (name, goal, plan, profession, band).
- Leads: source "v6", `profession`, `value_band` (+details); /leads shows them. WhatsApp messages include purpose + band. Tracking: v6-{purpose}-{work}-{band}-ch{n}-{action}; name never tracked.

## "Why myPaisaa" layer (/v5 + /v6)
- components/v5/why.tsx: WHY[profile] = promise, 3 number-backed reasons (chip, vs, evidence: tchits|charges|history), scorecard cols/rows; DIVIDEND ("150–170% of comparable chit companies' dividends, on completed groups" + footnote); WORK_REASON for v6 (business/salaried/self); commissionLine(value) = 5% in ₹ and 2% below the 7% cap.
- 5 moments: WhyStrip under hook headline (Hook `strip` prop) · WhyChapter as new Chapter 3 ("Why myPaisaa, not ___", reasons + scorecard + dividend row + DividendProof) · OnlyAt line in each planner/auction result (+ compact DividendProof on /v6) · commission ₹ in costs chapter · WhyRecap above the lead form.
- Stories are now 10 chapters (ids shifted +1 from ch3). ChargesDisclosure has id="why-charges" for evidence links. Tracking: v5-{p}-why-*, v6-{p}-{work}-{band}-why-*.

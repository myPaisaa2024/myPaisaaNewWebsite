import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { Gate, Nav4 } from "@/components/v4/Gate4";
import { Compare4, Explainer, FitPicker, GoalPlanner, Hero4, InvestDesk, NeedPlanner, Proof4 } from "@/components/v4/Sections4";
import { PROFILES, isProfile, type SectionKey } from "@/components/v4/profiles";
import { Charges3, Faq3, How3, Plans3, Verify3 } from "@/components/v3/Mid3";
import { App3, Footer3, LeadForm3 } from "@/components/v3/Bottom3";
import { v3en } from "@/i18n/v3";
import { V3Context, type Profile } from "@/lib/v3";
import { trackCta } from "@/lib/track";

const STORAGE_KEY = "mypaisaa-profile";

function initialProfile(param: string | null): Profile | null {
  if (isProfile(param)) return param;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isProfile(saved)) return saved;
  } catch {
    /* storage blocked */
  }
  return null;
}

/**
 * /v4 — profile-driven page (English). The visitor's answer (save / borrow / invest / explore)
 * swaps the hero, proof points, planner, comparison, plan list, FAQs and the lead form.
 * Shareable as /v4?for=borrow for ad campaigns.
 */
export default function HomeV4() {
  const [params, setParams] = useSearchParams();
  const [profile, setProfileState] = useState<Profile | null>(() => initialProfile(params.get("for")));
  const [pickedPlan, setPickedPlan] = useState<number | null>(null);

  const setProfile = useCallback(
    (p: Profile) => {
      setProfileState(p);
      setPickedPlan(null);
      try {
        localStorage.setItem(STORAGE_KEY, p);
      } catch {
        /* ignore */
      }
      setParams({ for: p }, { replace: true });
    },
    [setParams],
  );

  useEffect(() => {
    document.documentElement.lang = "en";
    document.title = profile
      ? `myPaisaa — ${PROFILES[profile].hero.h1a} ${PROFILES[profile].hero.h1b}`
      : "myPaisaa — Registered digital chit fund";
  }, [profile]);

  const ctx = useMemo(
    () => ({ lang: "en" as const, t: v3en, setLang: () => undefined, pickPlan: setPickedPlan, pickedPlan }),
    [pickedPlan],
  );

  if (!profile) return <Gate onPick={setProfile} />;
  const cfg = PROFILES[profile];

  const render: Record<SectionKey, () => ReactNode> = {
    proof: () => <Proof4 cfg={cfg} />,
    "goal-planner": () => <GoalPlanner />,
    "need-planner": () => <NeedPlanner />,
    "invest-desk": () => <InvestDesk />,
    explainer: () => <Explainer />,
    fit: () => <FitPicker onPick={setProfile} />,
    compare: () => (cfg.compare ? <Compare4 table={cfg.compare} testid={`v4-compare-${profile}`} /> : null),
    plans: () => (
      <div id="v4-plans" className="scroll-mt-28">
        <Plans3 filter={cfg.plans.filter} title={cfg.plans.title} body={cfg.plans.body} />
      </div>
    ),
    how: () => <How3 />,
    verify: () => <Verify3 />,
    charges: () => <Charges3 />,
    faq: () => <Faq3 only={cfg.faq} title={cfg.faqTitle} />,
    lead: () => (
      <div id="v4-lead" className="scroll-mt-28">
        <LeadForm3 initialGoal={cfg.lead.goal} source="v4" profile={profile} title={cfg.lead.title} body={cfg.lead.body} />
      </div>
    ),
    app: () => <App3 />,
  };

  return (
    <V3Context.Provider value={ctx}>
      <div className="min-h-screen bg-white text-slate-900" data-testid="v4-page" data-profile={profile}>
        <Nav4 profile={profile} onPick={setProfile} />
        <main key={profile}>
          <Hero4 cfg={cfg} />
          {cfg.sections.map((s) => (
            <div key={s} data-section={s}>
              {render[s]()}
            </div>
          ))}
        </main>
        <Footer3 />
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/90 p-3 backdrop-blur-xl lg:hidden" data-testid="v4-mobile-bar">
          <a
            href="#v4-lead"
            data-testid="v4-mobile-cta"
            onClick={() => trackCta(`v4-${profile}-mobile-cta`)}
            className="flex h-11 items-center justify-center rounded-xl bg-brand text-sm font-semibold text-white"
          >
            {cfg.hero.primary === "lead" ? cfg.hero.primaryLabel : cfg.hero.secondaryLabel}
          </a>
        </div>
      </div>
    </V3Context.Provider>
  );
}

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PLAY_STORE_URL } from "@/lib/contact";
import { trackCta } from "@/lib/track";
import { v3en } from "@/i18n/v3";
import { V3Context, type Profile } from "@/lib/v3";
import { Footer3 } from "@/components/v3/Bottom3";
import { Gate } from "@/components/v4/Gate4";
import { isProfile } from "@/components/v4/profiles";
import { ChapterRail, Nav5, accStyle, useActiveChapter, type ChapterMeta } from "@/components/v5/kit";
import { SAVE_CHAPTERS, SaveStory } from "@/components/v5/SaveStory";
import { BORROW_CHAPTERS, BorrowStory } from "@/components/v5/BorrowStory";
import { INVEST_CHAPTERS, InvestStory } from "@/components/v5/InvestStory";
import { EXPLORE_CHAPTERS, ExploreStory } from "@/components/v5/ExploreStory";

const STORAGE_KEY = "mypaisaa-profile-v5";

const CHAPTERS: Record<Profile, ChapterMeta[]> = {
  save: SAVE_CHAPTERS,
  borrow: BORROW_CHAPTERS,
  invest: INVEST_CHAPTERS,
  explore: EXPLORE_CHAPTERS,
};

const STORY_TITLE: Record<Profile, string> = {
  save: "Lakshmi's habit",
  borrow: "Ramesh's stock run",
  invest: "Mr. Rao's ladder",
  explore: "Anita's first chit",
};

const MOBILE_CTA: Record<Profile, { label: string; href: string; install?: boolean }> = {
  save: { label: "Start your habit", href: PLAY_STORE_URL, install: true },
  borrow: { label: "Check how much you can lift", href: "#borrow-lead" },
  invest: { label: "Speak with a senior advisor", href: "#invest-lead" },
  explore: { label: "Ask us anything", href: "#explore-lead" },
};

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

/** /v5 — four story-led journeys. Every chapter is written for one profile; switching restarts at Chapter 1. */
export default function HomeV5() {
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
      window.scrollTo({ top: 0 });
    },
    [setParams],
  );

  const chapters = profile ? CHAPTERS[profile] : [];
  const active = useActiveChapter(chapters.length, profile ?? "none");

  useEffect(() => {
    document.documentElement.lang = "en";
    document.title = profile ? `myPaisaa — ${STORY_TITLE[profile]}` : "myPaisaa — Registered digital chit fund";
  }, [profile]);

  const ctx = useMemo(() => ({ lang: "en" as const, t: v3en, setLang: () => undefined, pickPlan: setPickedPlan, pickedPlan }), [pickedPlan]);

  if (!profile) return <Gate onPick={setProfile} prefix="v5" />;
  const cur = chapters[active - 1];
  const m = MOBILE_CTA[profile];

  return (
    <V3Context.Provider value={ctx}>
      <div className="min-h-screen bg-white text-slate-900" style={accStyle(profile)} data-testid="v5-page" data-profile={profile}>
        <div className="sticky top-0 z-40">
          <Nav5 profile={profile} onPick={setProfile} chapterLabel={`${STORY_TITLE[profile]} · Chapter ${active} of ${chapters.length}${cur ? ` — ${cur.label}` : ""}`} />
          <ChapterRail chapters={chapters} active={active} p={profile} />
        </div>
        <main key={profile}>
          {profile === "save" && <SaveStory />}
          {profile === "borrow" && <BorrowStory />}
          {profile === "invest" && <InvestStory />}
          {profile === "explore" && <ExploreStory onPick={setProfile} />}
        </main>
        <Footer3 />
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/90 p-3 backdrop-blur-xl lg:hidden" data-testid="v5-mobile-bar">
          <a
            href={m.href}
            target={m.install ? "_blank" : undefined}
            rel={m.install ? "noopener noreferrer" : undefined}
            data-testid="v5-mobile-cta"
            onClick={() => trackCta(`v5-${profile}-mobile-cta`, { eventType: m.install ? "download" : "whatsapp" })}
            className="flex h-11 items-center justify-center rounded-xl bg-[var(--acc)] text-sm font-semibold text-white"
          >
            {m.label}
          </a>
        </div>
      </div>
    </V3Context.Provider>
  );
}

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Pencil, Smartphone } from "lucide-react";
import { PLAY_STORE_URL } from "@/lib/contact";
import { trackCta } from "@/lib/track";
import { v3en } from "@/i18n/v3";
import { V3Context } from "@/lib/v3";
import { Footer3 } from "@/components/v3/Bottom3";
import { W3 } from "@/components/v3/Top3";
import { ChapterRail, accStyle, useActiveChapter } from "@/components/v5/kit";
import { Welcome } from "@/components/v6/Welcome";
import { PersonalStory, chaptersFor } from "@/components/v6/Story6";
import { BAND_DEFAULT, PURPOSE_LABEL, bandShort, caseFromParams, loadCase, saveCase, workLabel, type Case } from "@/lib/v6";

/** /v6 — personal chit advisor: a 4-step welcome, then a 9-chapter story written for the visitor's own case. */
export default function HomeV6() {
  const [params, setParams] = useSearchParams();
  const urlCase = useMemo(() => caseFromParams(params), [params]);
  const [kase, setKase] = useState<Case | null>(() => {
    const saved = loadCase();
    // Ad links (?for=&work=&value=) override a saved case only for the fields they carry; name is always asked if unknown.
    if (saved && !params.get("for") && !params.get("work") && !params.get("value")) return saved;
    return null;
  });
  const [editing, setEditing] = useState(false);
  const [pickedPlan, setPickedPlan] = useState<number | null>(kase && kase.band !== "unsure" ? BAND_DEFAULT[kase.band] : null);

  const done = useCallback(
    (c: Case) => {
      saveCase(c);
      setKase(c);
      setEditing(false);
      setPickedPlan(c.band !== "unsure" ? BAND_DEFAULT[c.band] : null);
      setParams({ for: c.purpose, work: c.work, value: c.band }, { replace: true });
      window.scrollTo({ top: 0 });
    },
    [setParams],
  );

  const profile = kase?.purpose ?? "explore";
  const chapters = chaptersFor(profile);
  const caseKey = kase ? `${kase.purpose}-${kase.work}-${kase.band}-${kase.name}` : "none";
  const active = useActiveChapter(chapters.length, caseKey);

  useEffect(() => {
    document.documentElement.lang = "en";
    document.title = kase ? `myPaisaa — ${kase.name ? `${kase.name}'s` : "Your"} chit plan` : "myPaisaa — Your personal chit advisor";
  }, [kase]);

  const ctx = useMemo(() => ({ lang: "en" as const, t: v3en, setLang: () => undefined, pickPlan: setPickedPlan, pickedPlan }), [pickedPlan]);

  if (!kase || editing) {
    const saved = loadCase();
    const initial = editing && kase ? kase : { ...(saved ?? {}), ...urlCase, name: saved?.name ?? "" };
    return <Welcome initial={editing ? initial : { ...urlCase, name: initial.name }} editing={editing} onDone={done} />;
  }

  const edit = () => {
    trackCta(`v6-${kase.purpose}-${kase.work}-${kase.band}-edit`);
    setEditing(true);
  };
  const chip = [kase.name, workLabel(kase.work), bandShort(kase.band)].filter(Boolean).join(" · ");

  return (
    <V3Context.Provider value={ctx}>
      <div className="min-h-screen bg-white text-slate-900" style={accStyle(profile)} data-testid="v6-page" data-purpose={kase.purpose} data-work={kase.work} data-band={kase.band}>
        <div className="sticky top-0 z-40">
          <header className="border-b border-slate-200/70 bg-white/85 backdrop-blur-xl" data-testid="v6-navbar">
            <div className={`${W3} flex h-14 items-center justify-between gap-3`}>
              <Link to="/v6" className="shrink-0" data-testid="v6-nav-logo">
                <img src="/mypaisaa-logo.svg" alt="myPaisaa" className="h-7 w-auto" />
              </Link>
              <p className="hidden truncate font-mono text-xs text-slate-500 lg:block" data-testid="v6-nav-chapter">
                Chapter {active} of {chapters.length} — {chapters[active - 1]?.label}
              </p>
              <div className="flex items-center gap-2">
                <button type="button" onClick={edit} data-testid="v6-details-chip" className="inline-flex h-9 max-w-[210px] items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition-colors duration-200 hover:border-[var(--acc)] sm:max-w-none">
                  <span className="size-2 shrink-0 rounded-full bg-[var(--acc)]" />
                  <span className="truncate"><span className="hidden sm:inline">{PURPOSE_LABEL[kase.purpose]} · </span>{chip}</span>
                  <Pencil size={12} className="shrink-0 text-[var(--acc)]" />
                </button>
                <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" data-testid="v6-nav-install" onClick={() => trackCta(`v6-${kase.purpose}-${kase.work}-${kase.band}-nav-install`, { eventType: "download" })} className="hidden h-9 items-center gap-1.5 rounded-lg bg-[var(--acc)] px-3.5 text-sm font-semibold text-white transition-[filter] duration-200 hover:brightness-110 sm:inline-flex">
                  <Smartphone size={15} /> Install
                </a>
              </div>
            </div>
          </header>
          <ChapterRail chapters={chapters} active={active} p={profile} trackId={(n) => `v6-${kase.purpose}-${kase.work}-${kase.band}-rail-${n}`} />
        </div>
        <main key={caseKey}>
          <PersonalStory c={kase} onEdit={edit} />
        </main>
        <Footer3 />
        <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2 border-t border-slate-200 bg-white/90 p-3 backdrop-blur-xl lg:hidden" data-testid="v6-mobile-bar">
          <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" data-testid="v6-mobile-install" onClick={() => trackCta(`v6-${kase.purpose}-${kase.work}-${kase.band}-mobile-install`, { eventType: "download" })} className="flex h-11 items-center justify-center rounded-xl border border-slate-300 text-sm font-semibold text-slate-800">
            Install app
          </a>
          <a href="#v6-lead" data-testid="v6-mobile-cta" onClick={() => trackCta(`v6-${kase.purpose}-${kase.work}-${kase.band}-mobile-lead`)} className="flex h-11 items-center justify-center rounded-xl bg-[var(--acc)] text-sm font-semibold text-white">
            Get a callback
          </a>
        </div>
      </div>
    </V3Context.Provider>
  );
}

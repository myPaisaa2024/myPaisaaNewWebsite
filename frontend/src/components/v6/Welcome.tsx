import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { trackCta } from "@/lib/track";
import { PROFILES, PROFILE_ORDER } from "@/components/v4/profiles";
import type { Band, Profile, Work } from "@/lib/v3";
import { BANDS, WORKS, bandLabel, type Case } from "@/lib/v6";

type Step = "name" | "purpose" | "work" | "band";

function Bubble({ children, me }: { children: ReactNode; me?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${me ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${me ? "rounded-br-md bg-[#024180] text-white" : "rounded-bl-md border border-slate-200 bg-white text-slate-800 shadow-sm"}`}>{children}</div>
    </motion.div>
  );
}

function Option({ label, sub, onClick, testid, active }: { label: string; sub?: string; onClick: () => void; testid: string; active?: boolean }) {
  return (
    <button
      type="button"
      data-testid={testid}
      onClick={onClick}
      className={`group flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] ${active ? "border-[#024180] bg-[#024180]/5" : "border-slate-200 bg-white hover:border-[#024180]/40"}`}
    >
      <span>
        <span className="block font-heading font-semibold text-slate-900">{label}</span>
        {sub && <span className="mt-0.5 block text-sm text-slate-500">{sub}</span>}
      </span>
      <ArrowRight size={18} className="shrink-0 text-slate-300 transition-[color,transform] duration-200 group-hover:translate-x-1 group-hover:text-brand" />
    </button>
  );
}

/**
 * Chat-style welcome. Asks only what's missing (URL params can pre-answer purpose, work, value);
 * in edit mode every step is shown with the current answer highlighted.
 */
export function Welcome({ initial, editing, onDone }: { initial: Partial<Case>; editing: boolean; onDone: (c: Case) => void }) {
  const steps: Step[] = ["name", ...(["purpose", "work", "band"] as const).filter((s) => editing || initial[s] === undefined)];
  const [i, setI] = useState(0);
  const [nameDraft, setNameDraft] = useState(initial.name ?? "");
  const [ans, setAns] = useState<Partial<Case>>(initial);
  const [closing, setClosing] = useState<Case | null>(null);
  const step = steps[i];

  useEffect(() => {
    if (!closing) return;
    const t = setTimeout(() => onDone(closing), 1600);
    return () => clearTimeout(t);
  }, [closing, onDone]);

  const next = (patch: Partial<Case>) => {
    const merged = { ...ans, ...patch };
    // A band of "unsure" only exists for explorers.
    if (patch.purpose && patch.purpose !== "explore" && merged.band === "unsure") delete merged.band;
    setAns(merged);
    if (i + 1 < steps.length) setI(i + 1);
    else finish(merged);
  };

  const finish = (m: Partial<Case>) => {
    if (!m.purpose || !m.work || !m.band) {
      // e.g. purpose changed to non-explore while band was "unsure" → ask band.
      const missing = (["purpose", "work", "band"] as const).find((k) => !m[k]);
      const idx = steps.indexOf(missing as Step);
      if (idx >= 0) setI(idx);
      return;
    }
    const c: Case = { name: (m.name ?? "").trim().slice(0, 40), purpose: m.purpose, work: m.work, band: m.band };
    trackCta(`v6-welcome-done-${c.purpose}-${c.work}-${c.band}`);
    setClosing(c);
  };

  const nm = (ans.name ?? "").trim();
  const bandOpts = BANDS.filter((b) => b.v !== "unsure" || ans.purpose === "explore");

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#F7F9FC]" data-testid="v6-welcome">
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(rgba(2,65,128,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(2,65,128,0.05)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="relative mx-auto flex min-h-full max-w-xl flex-col px-5 py-6">
        <div className="flex items-center justify-between">
          <img src="/mypaisaa-logo.svg" alt="myPaisaa" className="h-7" />
          <span className="font-mono text-xs text-slate-400" data-testid="v6-welcome-step">{closing ? "Done" : `Step ${i + 1} of ${steps.length}`}</span>
        </div>
        <div className="mt-4 h-1 rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-brand transition-[width] duration-300" style={{ width: `${closing ? 100 : ((i + 1) / steps.length) * 100}%` }} data-testid="v6-welcome-progress" />
        </div>

        <div className="mt-8 flex-1 space-y-3">
          <AnimatePresence mode="wait">
            {closing ? (
              <motion.div key="closing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3" data-testid="v6-welcome-closing">
                <Bubble>
                  Got it{closing.name ? `, ${closing.name}` : ""}. Here's how a chit works for {WORKS.find((w) => w.v === closing.work)!.noun}
                  {closing.band === "unsure" ? " who's still deciding on an amount." : ` looking at ${bandLabel(closing.band)}.`}
                </Bubble>
                <div className="flex gap-1.5 pl-2"><span className="size-2 animate-bounce rounded-full bg-slate-300" /><span className="size-2 animate-bounce rounded-full bg-slate-300 [animation-delay:0.15s]" /><span className="size-2 animate-bounce rounded-full bg-slate-300 [animation-delay:0.3s]" /></div>
              </motion.div>
            ) : (
              <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="space-y-3">
                {step === "name" && (
                  <>
                    <Bubble>Hi! I'm your myPaisaa guide. What should we call you?</Bubble>
                    <form
                      className="pt-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        next({ name: nameDraft.trim() });
                      }}
                    >
                      <input autoFocus value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} maxLength={40} placeholder="Your first name" data-testid="v6-welcome-name" className="h-14 w-full rounded-2xl border border-slate-300 bg-white px-5 text-lg outline-none transition-[border-color,box-shadow] duration-200 focus:border-[#024180] focus:ring-4 focus:ring-[#024180]/10" />
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <button type="button" data-testid="v6-welcome-skip-name" onClick={() => next({ name: "" })} className="text-sm font-medium text-slate-500 hover:text-slate-800">
                          Skip, just show me
                        </button>
                        <button type="submit" data-testid="v6-welcome-name-next" disabled={!nameDraft.trim()} className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#024180] px-5 text-sm font-semibold text-white transition-[opacity,transform] duration-200 active:scale-95 disabled:opacity-40">
                          Continue <ArrowRight size={16} />
                        </button>
                      </div>
                    </form>
                  </>
                )}
                {step === "purpose" && (
                  <>
                    {nm && <Bubble me>{nm}</Bubble>}
                    <Bubble>Nice to meet you{nm ? `, ${nm}` : ""}. What brings you here?</Bubble>
                    <div className="grid gap-2.5 pt-3">
                      {PROFILE_ORDER.map((k: Profile) => (
                        <Option key={k} testid={`v6-welcome-purpose-${k}`} active={ans.purpose === k} label={PROFILES[k].chooserTitle} sub={PROFILES[k].chooserBody} onClick={() => next({ purpose: k })} />
                      ))}
                    </div>
                  </>
                )}
                {step === "work" && (
                  <>
                    <Bubble>What do you do?</Bubble>
                    <div className="grid grid-cols-2 gap-2.5 pt-3">
                      {WORKS.map((w) => (
                        <Option key={w.v} testid={`v6-welcome-work-${w.v}`} active={ans.work === w.v} label={w.label} onClick={() => next({ work: w.v as Work })} />
                      ))}
                    </div>
                  </>
                )}
                {step === "band" && (
                  <>
                    <Bubble>Roughly what size of chit are you thinking of?</Bubble>
                    <div className="grid gap-2.5 pt-3">
                      {bandOpts.map((b) => (
                        <Option key={b.v} testid={`v6-welcome-band-${b.v}`} active={ans.band === b.v} label={b.label} onClick={() => next({ band: b.v as Band })} />
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!closing && i > 0 && (
          <button type="button" data-testid="v6-welcome-back" onClick={() => setI(i - 1)} className="mt-8 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
            <ArrowLeft size={15} /> Back
          </button>
        )}
        <p className="mt-6 text-center text-xs text-slate-400">Your answers stay in this browser. We only receive them if you request a callback.</p>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Menu, ShieldCheck, X } from "lucide-react";
import { trackCta } from "@/lib/track";
import type { Profile } from "@/lib/v3";
import { W3 } from "@/components/v3/Top3";
import { PROFILES, PROFILE_ORDER } from "./profiles";

/** First-visit chooser: the answer drives every section on /v4. */
export function Gate({ onPick, prefix = "v4" }: { onPick: (p: Profile) => void; prefix?: string }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white" data-testid="v4-gate">
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(rgba(2,65,128,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(2,65,128,0.06)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,black,transparent)]" />
      <div className="relative mx-auto flex min-h-full max-w-4xl flex-col px-5 py-8">
        <img src="/mypaisaa-logo.svg" alt="myPaisaa" className="h-8 w-fit" />
        <div className="my-auto py-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#024180]/15 bg-white px-3 py-1.5 text-xs font-medium text-[#024180]">
            <ShieldCheck size={14} /> Registered under the Chit Funds Act, 1982
          </p>
          <h1 className="mt-5 font-heading text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl" data-testid="v4-gate-title">
            What brings you to myPaisaa?
          </h1>
          <p className="mt-3 text-lg text-slate-600">Pick one — we'll show only what matters to you. You can switch anytime.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {PROFILE_ORDER.map((k, i) => {
              const c = PROFILES[k];
              return (
                <motion.button
                  key={k}
                  type="button"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i }}
                  data-testid={`v4-gate-${k}`}
                  onClick={() => {
                    trackCta(`${prefix}-gate-${k}`);
                    onPick(k);
                  }}
                  className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white/90 p-5 text-left shadow-sm backdrop-blur transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#024180]/40 hover:shadow-[0_20px_40px_-24px_rgba(2,65,128,0.5)]"
                >
                  <span className={`grid size-12 shrink-0 place-items-center rounded-xl text-white ${c.accent}`}>
                    <c.icon size={22} />
                  </span>
                  <span className="flex-1">
                    <span className="block font-heading text-lg font-semibold text-slate-900">{c.chooserTitle}</span>
                    <span className="mt-1 block text-sm text-slate-500">{c.chooserBody}</span>
                  </span>
                  <ArrowRight size={18} className="mt-1 text-slate-300 transition-[color,transform] duration-200 group-hover:translate-x-1 group-hover:text-brand" />
                </motion.button>
              );
            })}
          </div>
        </div>
        <p className="text-center text-xs text-slate-400">3,00,000+ registered users · ₹1,200 Cr+ auction turnover · 5% commission (legal cap 7%)</p>
      </div>
    </div>
  );
}

export function Nav4({ profile, onPick }: { profile: Profile; onPick: (p: Profile) => void }) {
  const [open, setOpen] = useState(false);
  const links = [
    { h: "#v4-plans", l: "Plans" },
    { h: "#v3-verify", l: "Verify us" },
    { h: "#v3-charges", l: "Charges" },
    { h: "#v3-faq", l: "Questions" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl" data-testid="v4-navbar">
      <div className={`${W3} flex h-16 items-center justify-between gap-4`}>
        <Link to="/v4" className="shrink-0" data-testid="v4-nav-logo">
          <img src="/mypaisaa-logo.svg" alt="myPaisaa" className="h-8 w-auto" />
        </Link>
        <nav className="hidden items-center gap-6 xl:flex">
          {links.map((n) => (
            <a key={n.h} href={n.h} className="text-sm text-slate-600 transition-colors duration-200 hover:text-[#024180]" data-testid={`v4-nav-${n.l.toLowerCase().replace(/\s/g, "-")}`}>
              {n.l}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href="#v4-lead" onClick={() => trackCta(`v4-${profile}-nav-lead`)} data-testid="v4-nav-lead" className="hidden h-10 items-center rounded-lg bg-[#024180] px-4 text-sm font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-brand-dark active:scale-95 md:inline-flex">
            Talk to an advisor
          </a>
          <button type="button" aria-label="Menu" data-testid="v4-nav-menu-toggle" onClick={() => setOpen((o) => !o)} className="grid size-10 place-items-center rounded-lg text-[#024180] xl:hidden">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {/* Profile switcher — always visible, re-themes the whole page. */}
      <div className="border-t border-slate-100 bg-white/70">
        <div className={`${W3} flex items-center gap-3 overflow-x-auto py-2`}>
          <span className="shrink-0 text-xs text-slate-500">Showing for:</span>
          <div role="tablist" className="flex shrink-0 gap-1 rounded-xl bg-slate-100/80 p-1" data-testid="v4-profile-switch">
            {PROFILE_ORDER.map((k) => {
              const c = PROFILES[k];
              const active = k === profile;
              return (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  data-testid={`v4-profile-${k}`}
                  onClick={() => {
                    trackCta(`v4-switch-${k}`);
                    onPick(k);
                  }}
                  className={`relative z-10 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors duration-200 sm:text-sm ${active ? "text-white" : "text-slate-600 hover:text-slate-900"}`}
                >
                  {active && <motion.span layoutId="v4-profile-pill" className={`absolute inset-0 -z-10 rounded-lg ${c.accent}`} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                  <c.icon size={14} /> {c.chip}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {open && (
        <div className="border-t border-slate-100 bg-white xl:hidden" data-testid="v4-nav-mobile-menu">
          <div className={`${W3} flex flex-col py-3`}>
            {links.map((n) => (
              <a key={n.h} href={n.h} onClick={() => setOpen(false)} className="rounded-lg px-2 py-3 text-slate-700 hover:bg-brand-mist">
                {n.l}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

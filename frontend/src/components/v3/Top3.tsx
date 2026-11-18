import { useState, type ReactNode } from "react";
import { ArrowRight, BadgeCheck, Check, Menu, Radio, ShieldCheck, Smartphone, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { PLAY_STORE_URL, TCHITS_URL } from "@/lib/contact";
import { trackCta } from "@/lib/track";
import { useV3, type V3Lang } from "@/lib/v3";

export const W3 = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8";

export function K3({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[#024180]">
      <span className="size-1.5 rounded-full bg-brand" />
      {children}
    </p>
  );
}

export function H2({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h2 className={`font-heading text-3xl font-semibold leading-[1.12] tracking-tight text-slate-900 sm:text-[40px] ${className}`}>{children}</h2>;
}

export function Rise({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? undefined : { opacity: 0, y: 18 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function InstallBtn({ testid, className = "", label }: { testid: string; className?: string; label?: string }) {
  const { t } = useV3();
  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-testid={testid}
      onClick={() => trackCta(testid, { eventType: "download" })}
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#024180] px-6 text-[15px] font-semibold text-white shadow-[0_10px_30px_-12px_rgba(2,65,128,0.8)] transition-[background-color,transform,box-shadow] duration-200 hover:bg-brand-dark hover:shadow-[0_14px_34px_-12px_rgba(2,65,128,0.9)] active:scale-[0.97] ${className}`}
    >
      <Smartphone size={17} /> {label ?? t.hero.ctaInstall}
    </a>
  );
}

export function LeadBtn({ testid, className = "", label }: { testid: string; className?: string; label?: string }) {
  const { t } = useV3();
  return (
    <a
      href="#v3-lead"
      data-testid={testid}
      onClick={() => trackCta(testid, { eventType: "whatsapp" })}
      className={`group inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/70 px-6 text-[15px] font-semibold text-slate-900 backdrop-blur transition-[border-color,transform] duration-200 hover:border-brand active:scale-[0.97] ${className}`}
    >
      {label ?? t.hero.ctaLead}
      <ArrowRight size={16} className="text-brand transition-transform duration-200 group-hover:translate-x-0.5" />
    </a>
  );
}

function LangSwitch() {
  const { lang, setLang } = useV3();
  const opts: { c: V3Lang; l: string }[] = [
    { c: "en", l: "EN" },
    { c: "te", l: "తెలుగు" },
  ];
  return (
    <div role="radiogroup" aria-label="Language" className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5" data-testid="v3-lang-switch">
      {opts.map((o) => (
        <button
          key={o.c}
          type="button"
          role="radio"
          aria-checked={lang === o.c}
          data-testid={`v3-lang-${o.c}`}
          onClick={() => setLang(o.c)}
          className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors duration-200 ${lang === o.c ? "bg-white text-[#024180] shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
        >
          {o.l}
        </button>
      ))}
    </div>
  );
}

export function Nav3() {
  const { t } = useV3();
  const [open, setOpen] = useState(false);
  const links = [
    { h: "#v3-plans", l: t.nav.plans },
    { h: "#v3-verify", l: t.nav.verify },
    { h: "#v3-charges", l: t.nav.charges },
    { h: "#v3-faq", l: t.nav.faq },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl" data-testid="v3-navbar">
      <div className={`${W3} flex h-16 items-center justify-between gap-4`}>
        <Link to="/v3" data-testid="v3-nav-logo" className="shrink-0">
          <img src="/mypaisaa-logo.svg" alt="myPaisaa" className="h-8 w-auto" />
        </Link>
        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((n) => (
            <a key={n.h} href={n.h} data-testid={`v3-nav-${n.h.slice(4)}`} className="text-sm text-slate-600 transition-colors duration-200 hover:text-[#024180]">
              {n.l}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2.5">
          <LangSwitch />
          <a
            href="#v3-lead"
            data-testid="v3-nav-lead"
            onClick={() => trackCta("v3-nav-lead")}
            className="hidden h-10 items-center rounded-lg bg-[#024180] px-4 text-sm font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-brand-dark active:scale-95 lg:inline-flex"
          >
            {t.nav.lead}
          </a>
          <button type="button" aria-label="Menu" data-testid="v3-nav-menu-toggle" onClick={() => setOpen((o) => !o)} className="grid size-10 place-items-center rounded-lg text-[#024180] lg:hidden">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-slate-100 bg-white lg:hidden" data-testid="v3-nav-mobile-menu">
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

function PhoneMock() {
  const { t } = useV3();
  const bids = [
    { who: t.phone.member, amt: "₹4,10,000", tag: "M-14" },
    { who: t.phone.you, amt: "₹4,15,500", tag: "M-09", me: true },
    { who: t.phone.member, amt: "₹4,18,000", tag: "M-21" },
  ];
  return (
    <div className="relative mx-auto w-[290px] sm:w-[310px]" data-testid="v3-hero-phone">
      <div className="absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgba(2,65,128,0.18),transparent_65%)] blur-2xl" />
      <div className="relative rounded-[42px] border border-slate-800 bg-slate-950 p-2.5 shadow-[0_40px_80px_-30px_rgba(2,26,56,0.7)]">
        <div className="overflow-hidden rounded-[34px] bg-white">
          <div className="flex items-center justify-between bg-[#024180] px-5 pb-4 pt-6 text-white">
            <div>
              <p className="text-[11px] opacity-75">{t.phone.group}</p>
              <p className="mt-1 font-mono text-xl font-semibold">₹5,00,000</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold">
              <Radio size={11} className="animate-pulse text-brand" /> {t.phone.live}
            </span>
          </div>
          <div className="space-y-2 p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">{t.phone.bids}</p>
            {bids.map((b, i) => (
              <div
                key={b.tag}
                style={{ animationDelay: `${i * 0.25}s` }}
                className={`flex animate-[v3-in_0.6s_ease-out_both] items-center justify-between rounded-xl border px-3 py-2.5 ${b.me ? "border-brand/40 bg-[#FFF4EF]" : "border-slate-100 bg-slate-50"}`}
              >
                <span className="flex items-center gap-2 text-xs text-slate-600">
                  <span className={`grid size-6 place-items-center rounded-full font-mono text-[9px] font-semibold text-white ${b.me ? "bg-brand" : "bg-slate-400"}`}>{b.tag.slice(2)}</span>
                  {b.who}
                </span>
                <span className="font-mono text-sm font-semibold text-slate-900">{b.amt}</span>
              </div>
            ))}
            <div className="mt-3 rounded-xl border border-dashed border-slate-200 p-3">
              <p className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700">
                <BadgeCheck size={13} /> {t.phone.receipt}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -left-10 top-24 hidden rounded-xl border border-white/60 bg-white/80 px-3 py-2 shadow-lg backdrop-blur-md sm:block" data-testid="v3-hero-chip-reg">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[#024180]"><ShieldCheck size={14} /> Chit Funds Act, 1982</p>
      </div>
      <div className="absolute -right-8 bottom-16 hidden max-w-[170px] rounded-xl border border-white/60 bg-white/80 px-3 py-2 shadow-lg backdrop-blur-md sm:block" data-testid="v3-hero-chip-payout">
        <p className="text-[11px] font-semibold leading-snug text-slate-800">{t.phone.payout}</p>
      </div>
    </div>
  );
}

export function Hero3() {
  const { t } = useV3();
  const [mode, setMode] = useState<"save" | "borrow">("save");
  const lead = mode === "save" ? t.hero.saveLead : t.hero.borrowLead;
  const points = mode === "save" ? t.hero.savePoints : t.hero.borrowPoints;
  return (
    <section className="relative overflow-hidden" data-testid="v3-hero">
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(rgba(2,65,128,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(2,65,128,0.06)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_70%_60%_at_30%_30%,black,transparent)]" />
      <div aria-hidden className="absolute -right-40 -top-40 size-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,100,49,0.12),transparent_60%)]" />
      <div className={`${W3} relative grid items-center gap-14 py-14 lg:grid-cols-[1.15fr_1fr] lg:py-20`}>
        <div>
          <a href={TCHITS_URL} target="_blank" rel="noopener noreferrer" data-testid="v3-hero-kicker" className="inline-flex items-center gap-2 rounded-full border border-[#024180]/15 bg-white/80 px-3 py-1.5 text-xs font-medium text-[#024180] backdrop-blur transition-colors duration-200 hover:border-[#024180]/40">
            <ShieldCheck size={14} /> {t.hero.kicker}
          </a>
          <h1 className="mt-6 font-heading text-[38px] font-semibold leading-[1.06] tracking-tight text-slate-900 sm:text-[54px]" data-testid="v3-hero-title">
            {t.hero.h1a}
            <span className="mt-1 block bg-gradient-to-r from-[#024180] to-[#0A63BD] bg-clip-text text-transparent">{t.hero.h1b}</span>
          </h1>

          <div className="mt-8 flex items-center gap-3">
            <span className="text-sm text-slate-500">{t.hero.toggleLabel}</span>
            <div role="tablist" className="relative flex rounded-xl border border-slate-200 bg-slate-100/80 p-1" data-testid="v3-hero-mode">
              {(["save", "borrow"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={mode === m}
                  data-testid={`v3-hero-mode-${m}`}
                  onClick={() => setMode(m)}
                  className={`relative z-10 rounded-lg px-5 py-1.5 text-sm font-semibold transition-colors duration-200 ${mode === m ? "text-white" : "text-slate-600 hover:text-slate-900"}`}
                >
                  {mode === m && <motion.span layoutId="v3-mode-pill" className="absolute inset-0 -z-10 rounded-lg bg-brand" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                  {m === "save" ? t.hero.save : t.hero.borrow}
                </button>
              ))}
            </div>
          </div>

          <motion.div key={mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600" data-testid="v3-hero-lead">{lead}</p>
            <ul className="mt-5 space-y-2.5">
              {points.map((p, i) => (
                <li key={p} className="flex items-start gap-2.5 text-[15px] text-slate-700" data-testid={`v3-hero-point-${i}`}>
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md bg-[#024180]/10 text-[#024180]"><Check size={13} strokeWidth={3} /></span>
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <InstallBtn testid="v3-hero-install" />
            <LeadBtn testid="v3-hero-lead-cta" />
          </div>
          <p className="mt-3 text-xs text-slate-500">{t.hero.note}</p>
        </div>
        <PhoneMock />
      </div>
    </section>
  );
}

export function Proof3() {
  const { t } = useV3();
  return (
    <section className="border-y border-slate-200 bg-slate-50/70" data-testid="v3-proof">
      <div className={`${W3} grid grid-cols-2 divide-slate-200 py-8 lg:grid-cols-5 lg:divide-x`}>
        {t.proof.items.map((s, i) => (
          <div key={s.l} className="px-4 py-3 lg:px-6" data-testid={`v3-proof-${i}`}>
            <p className="font-mono text-2xl font-semibold tracking-tight text-slate-900 sm:text-[28px]">{s.v}</p>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">{s.l}</p>
          </div>
        ))}
        <a href={TCHITS_URL} target="_blank" rel="noopener noreferrer" data-testid="v3-proof-verify" className="col-span-2 flex items-center gap-2 px-4 py-3 text-sm font-semibold text-[#024180] hover:underline lg:col-span-1 lg:px-6">
          <ShieldCheck size={18} /> {t.proof.verify} <ArrowRight size={14} />
        </a>
      </div>
    </section>
  );
}

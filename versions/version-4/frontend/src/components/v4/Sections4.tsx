import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, CheckCircle2, Gavel, IndianRupee, ShieldCheck, Users, Wallet } from "lucide-react";
import { PLAY_STORE_URL } from "@/lib/contact";
import { formatINR } from "@/lib/format";
import { trackCta } from "@/lib/track";
import { lakh, useBriefPlans, useV3, type BriefPlan, type Profile } from "@/lib/v3";
import { H2, K3, Rise, W3 } from "@/components/v3/Top3";
import { PROFILES, PROFILE_ORDER, type CompareTable, type ProfileConfig } from "./profiles";

/** Primary/secondary hero CTAs — "install" opens the store, "lead" scrolls to the form. */
function Cta({ kind, label, testid, primary }: { kind: "install" | "lead"; label: string; testid: string; primary?: boolean }) {
  const cls = primary
    ? "bg-[#024180] text-white shadow-[0_10px_30px_-12px_rgba(2,65,128,0.8)] hover:bg-brand-dark"
    : "border border-slate-300 bg-white/70 text-slate-900 backdrop-blur hover:border-brand";
  const common = `group inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-[15px] font-semibold transition-[background-color,border-color,transform] duration-200 active:scale-[0.97] ${cls}`;
  if (kind === "install")
    return (
      <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" data-testid={testid} onClick={() => trackCta(testid, { eventType: "download" })} className={common}>
        {label}
      </a>
    );
  return (
    <a href="#v4-lead" data-testid={testid} onClick={() => trackCta(testid)} className={common}>
      {label} <ArrowRight size={16} className={`transition-transform duration-200 group-hover:translate-x-0.5 ${primary ? "" : "text-brand"}`} />
    </a>
  );
}

function HeroVisual({ profile }: { profile: Profile }) {
  const card = "rounded-2xl border border-white/70 bg-white/85 p-5 shadow-[0_30px_60px_-30px_rgba(2,26,56,0.45)] backdrop-blur-md";
  if (profile === "save")
    return (
      <div className="relative mx-auto w-full max-w-sm" data-testid="v4-hero-visual-save">
        <div className={card}>
          <p className="font-mono text-[11px] uppercase tracking-widest text-slate-400">Goal · Daughter's education</p>
          <div className="mt-4 flex items-center gap-5">
            <div className="relative size-28">
              <svg viewBox="0 0 36 36" className="size-28 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#059669" strokeWidth="3" strokeDasharray="56 100" strokeLinecap="round" className="animate-[v4-ring_1.4s_ease-out_both]" />
              </svg>
              <span className="absolute inset-0 grid place-items-center font-mono text-lg font-semibold text-slate-900">56%</span>
            </div>
            <div>
              <p className="text-xs text-slate-500">₹3 Lakh chit · month 17 of 30</p>
              <p className="mt-1 font-mono text-2xl font-semibold text-slate-900">₹1,70,000</p>
              <p className="text-xs text-slate-500">paid in so far</p>
            </div>
          </div>
        </div>
        <div className={`${card} absolute -bottom-8 -right-4 w-52 p-4`}>
          <p className="flex items-center gap-2 text-xs font-semibold text-emerald-700"><CheckCircle2 size={14} /> Dividend credited</p>
          <p className="mt-1 text-[11px] text-slate-500">You didn't bid this month — your share of the auction discount reduces next month's instalment.</p>
        </div>
      </div>
    );
  if (profile === "borrow")
    return (
      <div className="relative mx-auto w-full max-w-sm space-y-3" data-testid="v4-hero-visual-borrow">
        {[
          { d: "Tue · 6:00 pm", t: "You won the e-auction", s: "₹10 Lakh group · month 4", i: Gavel, c: "text-brand" },
          { d: "Tue · 8:10 pm", t: "Documents verified", s: "eKYC + surety on file", i: ShieldCheck, c: "text-[#024180]" },
          { d: "Wed · 11:30 am", t: "₹8,60,000 credited", s: "To your bank account", i: IndianRupee, c: "text-emerald-600" },
        ].map((n, i) => (
          <motion.div key={n.t} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.18 }} className={`${card} flex items-center gap-4 p-4`} style={{ marginLeft: i * 18 }}>
            <span className="grid size-10 place-items-center rounded-xl bg-slate-50"><n.i size={18} className={n.c} /></span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">{n.t}</p>
              <p className="text-xs text-slate-500">{n.s}</p>
            </div>
            <span className="font-mono text-[10px] text-slate-400">{n.d}</span>
          </motion.div>
        ))}
        <p className="pl-2 text-[11px] text-slate-400">Illustrative timeline. Amount lifted depends on the winning bid.</p>
      </div>
    );
  if (profile === "invest")
    return (
      <div className={`${card} mx-auto w-full max-w-sm`} data-testid="v4-hero-visual-invest">
        <p className="font-mono text-[11px] uppercase tracking-widest text-slate-400">Chit portfolio</p>
        <p className="mt-2 font-mono text-3xl font-semibold text-slate-900">₹50,00,000</p>
        <p className="text-xs text-slate-500">across 3 registered groups</p>
        <div className="mt-5 space-y-2.5">
          {[
            { n: "₹25 Lakh · 50 months", w: "50%" },
            { n: "₹15 Lakh · 50 months", w: "30%" },
            { n: "₹10 Lakh · 25 months", w: "20%" },
          ].map((r) => (
            <div key={r.n}>
              <div className="flex justify-between text-xs text-slate-600"><span>{r.n}</span><span className="font-mono">{r.w}</span></div>
              <div className="mt-1 h-1.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-[#024180] to-[#0A63BD]" style={{ width: r.w }} /></div>
            </div>
          ))}
        </div>
        <p className="mt-5 flex items-center gap-2 rounded-lg bg-[#024180]/5 p-2.5 text-xs font-medium text-[#024180]"><ShieldCheck size={14} /> Market exposure: none</p>
      </div>
    );
  return (
    <div className="relative mx-auto grid size-72 place-items-center" data-testid="v4-hero-visual-explore">
      <div className="absolute inset-0 animate-[spin_40s_linear_infinite] rounded-full border border-dashed border-[#024180]/25" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <span key={i} className={`absolute grid size-11 place-items-center rounded-full border-2 border-white text-[11px] font-semibold text-white shadow ${i === 2 ? "bg-brand" : "bg-[#024180]"}`} style={{ left: `calc(50% + ${Math.cos(a) * 136}px - 22px)`, top: `calc(50% + ${Math.sin(a) * 136}px - 22px)` }}>
            <Users size={16} />
          </span>
        );
      })}
      <div className="rounded-2xl bg-white px-5 py-4 text-center shadow-xl">
        <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Monthly pot</p>
        <p className="font-mono text-xl font-semibold text-slate-900">₹1,00,000</p>
        <p className="text-[11px] text-slate-500">25 members × ₹4,000</p>
      </div>
    </div>
  );
}

export function Hero4({ cfg }: { cfg: ProfileConfig }) {
  const h = cfg.hero;
  const secondaryKind = h.primary === "install" ? "lead" : "install";
  return (
    <section className="relative overflow-hidden" data-testid={`v4-hero-${cfg.key}`}>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(rgba(2,65,128,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(2,65,128,0.06)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_70%_60%_at_30%_30%,black,transparent)]" />
      <div className={`${W3} relative grid items-center gap-14 py-14 lg:grid-cols-[1.15fr_1fr] lg:py-20`}>
        <motion.div key={cfg.key} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <K3>{h.kicker}</K3>
          <h1 className="mt-5 font-heading text-[38px] font-semibold leading-[1.06] tracking-tight text-slate-900 sm:text-[52px]" data-testid="v4-hero-title">
            {h.h1a}
            <span className="mt-1 block bg-gradient-to-r from-[#024180] to-[#0A63BD] bg-clip-text text-transparent">{h.h1b}</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600" data-testid="v4-hero-sub">{h.sub}</p>
          <ul className="mt-5 space-y-2.5">
            {h.points.map((p, i) => (
              <li key={p} className="flex items-start gap-2.5 text-[15px] text-slate-700" data-testid={`v4-hero-point-${i}`}>
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand" /> {p}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Cta kind={h.primary} label={h.primaryLabel} testid={`v4-${cfg.key}-hero-primary`} primary />
            <Cta kind={secondaryKind} label={h.secondaryLabel} testid={`v4-${cfg.key}-hero-secondary`} />
          </div>
        </motion.div>
        <motion.div key={`${cfg.key}-v`} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <HeroVisual profile={cfg.key} />
        </motion.div>
      </div>
    </section>
  );
}

export function Proof4({ cfg }: { cfg: ProfileConfig }) {
  return (
    <section className="border-y border-slate-200 bg-slate-50/70" data-testid="v4-proof">
      <div className={`${W3} grid grid-cols-2 gap-y-2 py-8 lg:grid-cols-4`}>
        {cfg.proof.map((s, i) => (
          <div key={s.l} className="px-4 py-3" data-testid={`v4-proof-${i}`}>
            <p className="font-mono text-2xl font-semibold tracking-tight text-slate-900 sm:text-[28px]">{s.v}</p>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">{s.l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Shared planner shell: pick an amount → nearest plan → callback with that plan preselected. */
function Planner({
  kind,
  kicker,
  title,
  body,
  question,
  options,
  match,
  resultLines,
  cta,
}: {
  kind: "save" | "borrow";
  kicker: string;
  title: string;
  body: string;
  question: string;
  options: { label: string; value: number }[];
  match: (plans: BriefPlan[], v: number) => BriefPlan | undefined;
  resultLines: (p: BriefPlan) => { k: string; v: string }[];
  cta: string;
}) {
  const plans = useBriefPlans();
  const { pickPlan } = useV3();
  const [value, setValue] = useState(options[1].value);
  const plan = useMemo(() => (plans.data ? match(plans.data, value) : undefined), [plans.data, value, match]);
  return (
    <section className="py-20" data-testid={`v4-${kind}-planner`}>
      <div className={`${W3} grid gap-10 lg:grid-cols-[0.9fr_1.1fr]`}>
        <div>
          <K3>{kicker}</K3>
          <H2 className="mt-4">{title}</H2>
          <p className="mt-4 text-slate-600">{body}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-35px_rgba(2,26,56,0.4)] sm:p-8">
          <p className="text-sm font-medium text-slate-700">{question}</p>
          <div className="mt-3 flex flex-wrap gap-2" role="radiogroup">
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={value === o.value}
                data-testid={`v4-${kind}-planner-opt-${o.value}`}
                onClick={() => setValue(o.value)}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-[background-color,border-color,color] duration-200 ${value === o.value ? "border-[#024180] bg-[#024180] text-white" : "border-slate-300 text-slate-700 hover:border-slate-400"}`}
              >
                {o.label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            {plan && (
              <motion.div key={plan.slug} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="mt-6 rounded-xl bg-slate-50 p-5" data-testid={`v4-${kind}-planner-result`}>
                <p className="font-mono text-[11px] uppercase tracking-widest text-slate-400">Suggested plan</p>
                <p className="mt-1 font-heading text-2xl font-semibold text-slate-900" data-testid={`v4-${kind}-planner-plan`}>{lakh(plan.chit_value, "en")} chit</p>
                <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {resultLines(plan).map((r) => (
                    <div key={r.k}>
                      <dt className="text-xs text-slate-500">{r.k}</dt>
                      <dd className="font-mono text-sm font-semibold text-slate-900">{r.v}</dd>
                    </div>
                  ))}
                </dl>
                <a
                  href="#v4-lead"
                  data-testid={`v4-${kind}-planner-cta`}
                  onClick={() => {
                    pickPlan(plan.chit_value);
                    trackCta(`v4-${kind}-planner-cta`, { planSlug: plan.slug });
                  }}
                  className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-white transition-[filter,transform] duration-200 hover:brightness-105 active:scale-[0.97]"
                >
                  {cta} <ArrowRight size={15} />
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

const emiText = (p: BriefPlan) => (p.emi_min === p.emi_max ? `₹${formatINR(p.emi_min)}` : `₹${formatINR(p.emi_min)}–${formatINR(p.emi_max)}`);
const nearestAtLeast = (plans: BriefPlan[], v: number) => plans.find((p) => p.chit_value >= v) ?? plans[plans.length - 1];

export function GoalPlanner() {
  return (
    <Planner
      kind="save"
      kicker="Goal planner"
      title="Name the goal. We'll show the plan."
      body="Pick roughly how much you want at the end. You'll see the monthly amount and how long it takes — no sign-up needed."
      question="I want to have about…"
      options={[
        { label: "₹1 Lakh", value: 100000 },
        { label: "₹3 Lakh", value: 300000 },
        { label: "₹5 Lakh", value: 500000 },
        { label: "₹10 Lakh", value: 1000000 },
      ]}
      match={nearestAtLeast}
      resultLines={(p) => [
        { k: "Monthly", v: emiText(p) },
        { k: "Tenure", v: `${p.durations.join(" or ")} months` },
        { k: "Dividends", v: "Monthly, when you don't bid" },
      ]}
      cta="Plan this goal with an advisor"
    />
  );
}

export function NeedPlanner() {
  return (
    <Planner
      kind="borrow"
      kicker="Funds planner"
      title="How much do you need?"
      body="Choose the amount. We'll show the plan whose pot covers it, how often you can bid and the monthly instalment."
      question="I need roughly…"
      options={[
        { label: "₹1 Lakh", value: 100000 },
        { label: "₹2 Lakh", value: 200000 },
        { label: "₹5 Lakh", value: 500000 },
        { label: "₹10 Lakh", value: 1000000 },
        { label: "₹25 Lakh", value: 2500000 },
      ]}
      match={nearestAtLeast}
      resultLines={(p) => [
        { k: "Monthly", v: emiText(p) },
        { k: "e-Auctions", v: `${p.auctions_per_month} a month` },
        { k: "Payout", v: "24 hrs after docs" },
      ]}
      cta="Check my eligibility"
    />
  );
}

export function InvestDesk() {
  const plans = useBriefPlans();
  const { pickPlan } = useV3();
  const hv = plans.data?.filter((p) => p.chit_value >= 1000000) ?? [];
  return (
    <section className="py-20" data-testid="v4-invest-desk">
      <div className={W3}>
        <K3>Investor desk</K3>
        <H2 className="mt-4 max-w-3xl">Three high-value chits. One senior advisor.</H2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {hv.map((p, i) => (
            <Rise key={p.slug} delay={i * 0.06}>
              <div className="group h-full rounded-2xl border border-slate-200 bg-white p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-[#024180]/30 hover:shadow-[0_24px_50px_-30px_rgba(2,65,128,0.5)]" data-testid={`v4-invest-card-${p.slug}`}>
                <div className="flex items-center justify-between">
                  <Wallet className="text-[#024180]" size={22} />
                  <span className="rounded-md bg-[#024180]/10 px-2 py-0.5 text-[10px] font-semibold text-[#024180]">Advisor-assisted</span>
                </div>
                <p className="mt-6 font-heading text-3xl font-semibold text-slate-900">{lakh(p.chit_value, "en")}</p>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-slate-500">Monthly</dt><dd className="font-mono text-slate-900">{emiText(p)}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-500">Tenure</dt><dd className="font-mono text-slate-900">{p.durations.join(" / ")} mo</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-500">e-Auctions</dt><dd className="font-mono text-slate-900">{p.auctions_per_month} / month</dd></div>
                </dl>
                <a
                  href="#v4-lead"
                  data-testid={`v4-invest-cta-${p.slug}`}
                  onClick={() => {
                    pickPlan(p.chit_value);
                    trackCta(`v4-invest-cta-${p.slug}`, { planSlug: p.slug });
                  }}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-[#024180] transition-[background-color,border-color,color] duration-200 hover:border-[#024180] hover:bg-[#024180] hover:text-white"
                >
                  Get dividend history <ArrowRight size={14} />
                </a>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Explainer() {
  const steps = [
    { t: "A group forms", b: "25 members each commit ₹4,000 a month to a registered ₹1 Lakh chit.", i: Users },
    { t: "The pot builds", b: "Every month the group's instalments make a ₹1,00,000 pot.", i: IndianRupee },
    { t: "An open e-auction", b: "Members who need money bid. The lowest amount accepted wins the pot.", i: Gavel },
    { t: "Everyone benefits", b: "The discount is shared as dividends. Savers earn; borrowers got funds early.", i: CheckCircle2 },
  ];
  return (
    <section className="py-20" data-testid="v4-explainer">
      <div className={W3}>
        <K3>Chit funds in 60 seconds</K3>
        <H2 className="mt-4 max-w-3xl">One product. Savers earn, borrowers get funds — fairly.</H2>
        <ol className="mt-12 grid gap-4 md:grid-cols-4">
          {steps.map((s, i) => (
            <Rise key={s.t} delay={i * 0.08}>
              <li className="relative h-full rounded-2xl border border-slate-200 bg-white p-6" data-testid={`v4-explainer-step-${i}`}>
                <span className="font-mono text-xs text-slate-400">0{i + 1}</span>
                <s.i className="mt-4 text-brand" size={26} />
                <p className="mt-4 font-heading text-lg font-semibold text-slate-900">{s.t}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.b}</p>
                {i < 3 && <ArrowRight aria-hidden className="absolute -right-3.5 top-1/2 hidden text-slate-300 md:block" size={20} />}
              </li>
            </Rise>
          ))}
        </ol>
        <p className="mt-6 text-xs text-slate-500">Illustrative example. Winning a specific auction is never promised.</p>
      </div>
    </section>
  );
}

export function FitPicker({ onPick }: { onPick: (p: Profile) => void }) {
  return (
    <section className="bg-slate-50/70 py-16" data-testid="v4-fit">
      <div className={W3}>
        <H2 className="text-center">So which one sounds like you?</H2>
        <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-3">
          {PROFILE_ORDER.filter((p) => p !== "explore").map((k) => {
            const c = PROFILES[k];
            return (
              <button
                key={k}
                type="button"
                data-testid={`v4-fit-${k}`}
                onClick={() => {
                  trackCta(`v4-fit-${k}`);
                  onPick(k);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-[#024180]/40 hover:shadow-lg"
              >
                <c.icon className="text-[#024180]" size={24} />
                <p className="mt-4 font-heading text-lg font-semibold text-slate-900">{c.chooserTitle}</p>
                <p className="mt-1 text-sm text-slate-500">{c.chooserBody}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">Show me <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" /></span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Compare4({ table, testid }: { table: CompareTable; testid: string }) {
  return (
    <section className="bg-slate-50/70 py-20" data-testid={testid}>
      <div className={W3}>
        <K3>Compare</K3>
        <H2 className="mt-4">{table.title}</H2>
        <div className="mt-10 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-5 py-4" />
                {table.cols.map((c, i) => (
                  <th key={c} className={`px-5 py-4 font-heading text-[15px] font-semibold ${i === 0 ? "bg-[#024180] text-white" : "text-slate-700"}`}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((r, ri) => (
                <tr key={r.k} className="border-b border-slate-100 last:border-0" data-testid={`${testid}-row-${ri}`}>
                  <td className="px-5 py-4 text-slate-500">{r.k}</td>
                  {r.v.map((v, i) => (
                    <td key={i} className={`px-5 py-4 ${i === 0 ? "bg-[#024180]/[0.04] font-semibold text-slate-900" : "text-slate-600"}`}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {table.foot && <p className="mt-4 max-w-3xl text-xs text-slate-500">{table.foot}</p>}
      </div>
    </section>
  );
}

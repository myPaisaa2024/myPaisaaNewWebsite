import { useState } from "react";
import { Building2, ChevronDown, ExternalLink, FileCheck2, Gavel, IndianRupee, Search, ShieldCheck, Smartphone, Zap } from "lucide-react";
import { LICENSE_URL, TCHITS_URL } from "@/lib/contact";
import { formatINR } from "@/lib/format";
import { trackCta } from "@/lib/track";
import { lakh, useBriefPlans, useV3, type BriefPlan } from "@/lib/v3";
import { H2, K3, LeadBtn, Rise, W3 } from "./Top3";

export function Verify3() {
  const { t } = useV3();
  const icons = [ExternalLink, Search, FileCheck2];
  return (
    <section id="v3-verify" className="scroll-mt-20 py-20" data-testid="v3-verify">
      <div className={`${W3} grid gap-12 lg:grid-cols-[1fr_1.1fr]`}>
        <div>
          <K3>{t.verify.kicker}</K3>
          <H2 className="mt-4">{t.verify.title}</H2>
          <p className="mt-4 max-w-lg text-slate-600">{t.verify.body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={TCHITS_URL} target="_blank" rel="noopener noreferrer" data-testid="v3-verify-tchits" onClick={() => trackCta("v3-verify-tchits")} className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-[#024180] active:scale-95">
              <ShieldCheck size={16} /> {t.verify.cta}
            </a>
            <a href={LICENSE_URL} target="_blank" rel="noopener noreferrer" data-testid="v3-verify-license" className="inline-flex h-11 items-center px-2 text-sm font-semibold text-[#024180] hover:underline">
              {t.verify.license}
            </a>
          </div>
        </div>
        <div className="space-y-4">
          <ol className="relative space-y-3">
            {t.verify.steps.map((s, i) => {
              const Icon = icons[i];
              return (
                <Rise key={s.t} delay={i * 0.06}>
                  <li className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-[border-color,box-shadow] duration-200 hover:border-[#024180]/30 hover:shadow-[0_12px_30px_-18px_rgba(2,65,128,0.4)]" data-testid={`v3-verify-step-${i}`}>
                    <span className="font-mono text-sm text-slate-400">0{i + 1}</span>
                    <div className="flex-1">
                      <p className="font-heading font-semibold text-slate-900">{s.t}</p>
                      <p className="mt-0.5 text-sm text-slate-500">{s.b}</p>
                    </div>
                    <Icon size={18} className="mt-1 text-[#024180]" />
                  </li>
                </Rise>
              );
            })}
          </ol>
          <div className="rounded-2xl bg-gradient-to-br from-[#02305F] to-brand-deep p-5 text-white" data-testid="v3-verify-entities">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">{t.verify.entitiesTitle}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {t.verify.entities.map((e) => (
                <div key={e.n} className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                  <Building2 size={16} className="text-brand" />
                  <p className="mt-2 text-sm font-semibold leading-snug">{e.n}</p>
                  <p className="mt-1 text-xs text-white/65">{e.r}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Plans3({ filter, title, body }: { filter?: (p: BriefPlan) => boolean; title?: string; body?: string } = {}) {
  const { t, lang, pickPlan } = useV3();
  const plans = useBriefPlans();
  const rows = filter ? plans.data?.filter(filter) : plans.data;
  const emi = (lo: number, hi: number) => (lo === hi ? `₹${formatINR(lo)}` : `₹${formatINR(lo)} – ₹${formatINR(hi)}`);
  return (
    <section id="v3-plans" className="scroll-mt-20 bg-slate-50/70 py-20" data-testid="v3-plans">
      <div className={W3}>
        <K3>{t.plans.kicker}</K3>
        <div className="mt-4 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <H2 className="max-w-2xl">{title ?? t.plans.title}</H2>
          <p className="max-w-md text-sm text-slate-600">{body ?? t.plans.body}</p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_-35px_rgba(2,26,56,0.4)]">
          <div className="hidden grid-cols-[1.1fr_1.3fr_1fr_0.9fr_1.1fr] gap-4 border-b border-slate-200 bg-slate-50 px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-slate-500 md:grid">
            <span>{t.plans.value}</span>
            <span>{t.plans.emi}</span>
            <span>{t.plans.tenure}</span>
            <span>{t.plans.auctions}</span>
            <span />
          </div>
          {plans.isLoading && <div className="h-80 animate-pulse bg-slate-100" data-testid="v3-plans-loading" />}
          {plans.isError && (
            <div className="p-10 text-center" data-testid="v3-plans-error">
              <LeadBtn testid="v3-plans-error-cta" label={t.plans.cta} />
            </div>
          )}
          {rows?.map((p) => (
            <div key={p.slug} className="group grid grid-cols-2 items-center gap-x-4 gap-y-2 border-b border-slate-100 px-5 py-4 transition-colors duration-200 last:border-0 hover:bg-[#F5F9FE] md:grid-cols-[1.1fr_1.3fr_1fr_0.9fr_1.1fr] md:px-6" data-testid={`v3-plan-row-${p.slug}`}>
              <div className="col-span-2 flex items-center gap-2 md:col-span-1">
                <span className="font-heading text-lg font-semibold text-slate-900">{lakh(p.chit_value, lang)}</span>
                {p.advisor_assisted && <span className="rounded-md bg-[#024180]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#024180]">{t.plans.advisor}</span>}
              </div>
              <p className="font-mono text-sm text-slate-800"><span className="mr-1 text-[10px] uppercase text-slate-400 md:hidden">{t.plans.emi}</span>{emi(p.emi_min, p.emi_max)}</p>
              <p className="font-mono text-sm text-slate-800"><span className="mr-1 text-[10px] uppercase text-slate-400 md:hidden">{t.plans.tenure}</span>{p.durations.join(` ${t.plans.or} `)} {t.plans.months}</p>
              <p className="flex items-center gap-1.5 font-mono text-sm text-slate-800">
                <Gavel size={14} className="text-brand" /> {p.auctions_per_month} <span className="text-xs text-slate-500">{t.plans.perMonth}</span>
              </p>
              <a
                href="#v3-lead"
                data-testid={`v3-plan-cta-${p.slug}`}
                onClick={() => {
                  pickPlan(p.chit_value);
                  trackCta(`v3-plan-cta-${p.slug}`, { planSlug: p.slug });
                }}
                className="justify-self-start rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-[#024180] transition-[background-color,border-color,color] duration-200 hover:border-[#024180] hover:bg-[#024180] hover:text-white md:justify-self-end"
              >
                {t.plans.cta}
              </a>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-3xl text-xs leading-relaxed text-slate-500" data-testid="v3-plans-note">{t.plans.note}</p>
      </div>
    </section>
  );
}

export function How3() {
  const { t } = useV3();
  const icons = [Smartphone, IndianRupee, Gavel, Zap];
  return (
    <section className="py-20" data-testid="v3-how">
      <div className={W3}>
        <K3>{t.how.kicker}</K3>
        <H2 className="mt-4 max-w-3xl">{t.how.title}</H2>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 md:grid-cols-4">
          {t.how.steps.map((s, i) => {
            const Icon = icons[i];
            return (
              <div key={s.t} className="group bg-white p-6 transition-colors duration-200 hover:bg-[#F5F9FE]" data-testid={`v3-how-step-${i}`}>
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-[#024180] text-white transition-transform duration-300 group-hover:-rotate-6"><Icon size={18} /></span>
                  <span className="font-mono text-xs text-slate-400">STEP 0{i + 1}</span>
                </div>
                <p className="mt-6 font-heading text-lg font-semibold text-slate-900">{s.t}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.b}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Charges3() {
  const { t } = useV3();
  return (
    <section id="v3-charges" className="scroll-mt-20 bg-slate-50/70 py-20" data-testid="v3-charges">
      <div className={`${W3} grid gap-10 lg:grid-cols-[0.9fr_1.1fr]`}>
        <div>
          <K3>{t.charges.kicker}</K3>
          <H2 className="mt-4">{t.charges.title}</H2>
          <p className="mt-4 text-slate-600">{t.charges.body}</p>
          <div className="mt-6 inline-flex items-baseline gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <span className="font-mono text-4xl font-semibold text-brand">5%</span>
            <span className="font-mono text-sm text-slate-400 line-through decoration-slate-300">7%</span>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white" data-testid="v3-charges-table">
          <dl>
            {t.charges.rows.map((r, i) => (
              <div key={r.k} className="grid grid-cols-[1fr_1.2fr] gap-4 border-b border-slate-100 px-5 py-3.5 last:border-0" data-testid={`v3-charge-${i}`}>
                <dt className="text-sm text-slate-500">{r.k}</dt>
                <dd className="font-mono text-sm text-slate-900">{r.v}</dd>
              </div>
            ))}
          </dl>
          <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">{t.charges.tax}</p>
        </div>
      </div>
    </section>
  );
}

export function Faq3({ only, title }: { only?: number[]; title?: string } = {}) {
  const { t } = useV3();
  const items = t.faq.items.map((f, i) => ({ ...f, i })).filter((f) => !only || only.includes(f.i));
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="v3-faq" className="scroll-mt-20 py-20" data-testid="v3-faq">
      <div className={`${W3} grid gap-10 lg:grid-cols-[0.8fr_1.2fr]`}>
        <div>
          <K3>{t.faq.kicker}</K3>
          <H2 className="mt-4">{title ?? t.faq.title}</H2>
        </div>
        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {items.map(({ i, ...f }) => {
            const isOpen = open === i;
            return (
              <div key={f.q} data-testid={`v3-faq-item-${i}`}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  data-testid={`v3-faq-toggle-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-heading text-base font-semibold text-slate-900 sm:text-[17px]">{f.q}</span>
                  <ChevronDown size={18} className={`shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-brand" : ""}`} />
                </button>
                <div className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <p className="overflow-hidden pr-8 text-[15px] leading-relaxed text-slate-600">
                    <span className="block pb-5">{f.a}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

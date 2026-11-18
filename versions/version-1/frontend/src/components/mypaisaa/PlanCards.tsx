import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { Check, Trophy } from "lucide-react";
import { usePlans, type Plan } from "@/lib/plans";
import { formatINR } from "@/lib/format";
import { WA_GENERIC, waPlanEnquiry } from "@/lib/contact";
import { trackCta } from "@/lib/track";
import { useLang } from "@/lib/i18n";
import { CONTAINER, Eyebrow } from "./bits";
import { Reveal } from "./Reveal";

const TIER_ORDER: Plan["tier"][] = ["starter", "growth", "wealth"];

function PlanCard({ plan }: { plan: Plan }) {
  const { t } = useLang();
  const p = t.plans;
  const badge = plan.badge ? (t.badges[plan.slug] ?? plan.badge) : null;
  const highlights = t.highlights[plan.slug] ?? plan.highlights;
  return (
    <article
      data-testid={`plan-card-${plan.slug}`}
      className="group flex h-full flex-col rounded-3xl border bg-card p-6 transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_24px_48px_-24px_rgb(255_100_49/0.35)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-heading text-3xl font-bold text-brand-dark">{t.lakh(plan.fund_value)}</p>
          <p className="text-sm text-muted-foreground">{p.chitPlan}</p>
        </div>
        {badge && (
          <span className="rounded-full bg-brand-mist px-2.5 py-1 text-xs font-semibold text-primary">{badge}</span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <p className="font-heading text-lg font-semibold text-primary" data-testid={`plan-card-${plan.slug}-monthly`}>
          ₹{formatINR(plan.monthly_contribution)}
          <span className="text-sm font-medium text-muted-foreground">{t.perMonth}</span>
        </p>
        <span className="rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          {t.months(plan.duration_months)}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-muted p-3">
          <p className="text-xs text-muted-foreground">{p.dividend}</p>
          <p className="mt-0.5 text-sm font-bold text-primary">+₹{formatINR(plan.est_monthly_dividend)}{t.perMo}</p>
        </div>
        <div className="rounded-xl bg-brand-mist p-3">
          <p className="flex items-center gap-1 text-xs text-[#2E5A8A]">
            <Trophy size={12} /> {p.win}
          </p>
          <p className="mt-0.5 text-sm font-bold text-[#024180]">₹{formatINR(plan.potential_auction_winning)}</p>
        </div>
      </div>

      <ul className="mb-5 mt-4 space-y-1.5">
        {highlights.map((h) => (
          <li key={h} className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check size={16} className="mt-0.5 shrink-0 text-primary" />
            {h}
          </li>
        ))}
      </ul>

      <a
        href={waPlanEnquiry(plan.name, plan.monthly_contribution, plan.duration_months)}
        target="_blank"
        rel="noopener noreferrer"
        data-testid={`plan-card-${plan.slug}-enquire`}
        onClick={() => trackCta(`plan-card-${plan.slug}`, { planSlug: plan.slug })}
        className="mt-auto flex items-center justify-center gap-2 rounded-full bg-wa px-4 py-2.5 text-sm font-bold text-[#062211] transition hover:brightness-105 active:scale-95"
      >
        <SiWhatsapp size={18} /> {p.enquire}
      </a>
    </article>
  );
}

export default function PlanCards() {
  const { data: plans, isLoading, isError } = usePlans();
  const { t } = useLang();
  const p = t.plans;

  return (
    <section id="plans" className="py-16 sm:py-24">
      <div className={CONTAINER}>
        <Reveal className="max-w-2xl">
          <Eyebrow>{p.eyebrow}</Eyebrow>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl" data-testid="plans-heading">
            {p.title}
          </h2>
          <p className="mt-3 text-muted-foreground">{p.body}</p>
        </Reveal>

        {isError ? (
          <div className="mt-10 rounded-3xl border bg-card p-8 text-center" data-testid="plans-error">
            <p className="font-heading text-lg font-semibold text-brand-dark">{p.errTitle}</p>
            <p className="mt-2 text-sm text-muted-foreground">{p.errBody}</p>
            <a
              href={WA_GENERIC}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="plans-error-whatsapp"
              onClick={() => trackCta("plans-error-whatsapp")}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-wa px-5 py-2.5 text-sm font-bold text-[#062211] active:scale-95"
            >
              <SiWhatsapp size={18} /> {p.errCta}
            </a>
          </div>
        ) : isLoading ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="plans-skeleton">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-3xl border bg-card" />
            ))}
          </div>
        ) : (
          <div className="mt-10 space-y-12">
            {TIER_ORDER.map((tier, tIdx) => {
              const tierPlans = plans?.filter((pl) => pl.tier === tier) ?? [];
              if (!tierPlans.length) return null;
              return (
                <Reveal key={tier} delay={tIdx * 0.05}>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-heading text-xl font-semibold text-brand-dark">{p.tiers[tier].title}</h3>
                    <p className="text-sm text-muted-foreground">{p.tiers[tier].desc}</p>
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {tierPlans.map((pl) => (
                      <PlanCard key={pl.slug} plan={pl} />
                    ))}
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

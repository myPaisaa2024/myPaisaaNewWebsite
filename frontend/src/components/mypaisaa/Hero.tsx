import { useState } from "react";
import { motion } from "motion/react";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { MapPin, ShieldCheck } from "lucide-react";
import { usePlans, type Plan } from "@/lib/plans";
import { formatINR, formatShort } from "@/lib/format";
import { WA_GENERIC, waPlanEnquiry } from "@/lib/contact";
import { trackCta } from "@/lib/track";
import { useLang } from "@/lib/i18n";
import { CONTAINER, StoreBadge } from "./bits";

const CITIES = [
  "Hyderabad", "Secunderabad", "Bangalore", "Vijayawada", "Vizag", "Warangal",
  "Kukatpally", "Mysore", "Khammam", "Nizamabad", "Guntur", "Karimnagar",
  "Tumkur", "Eluru", "Kakinada", "Siddipet",
];

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

function PlanChip({ plan, active, onSelect }: { plan: Plan; active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      data-testid={`hero-plan-chip-${plan.slug}`}
      data-selected={active}
      onClick={onSelect}
      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition active:scale-95 ${
        active
          ? "border-primary bg-primary text-white"
          : "border-border bg-white text-muted-foreground hover:border-primary/40 hover:text-brand-ink"
      }`}
    >
      {formatShort(plan.fund_value)}
    </button>
  );
}

function PlanCheckerCard() {
  const { data: plans, isLoading, isError } = usePlans();
  const [idx, setIdx] = useState(1);
  const plan = plans?.[Math.min(idx, (plans?.length ?? 1) - 1)];
  const { t } = useLang();
  const h = t.hero;

  if (isError) {
    return (
      <div data-testid="hero-checker-error" className="rounded-3xl border bg-white p-6 shadow-xl shadow-[#024180]/10">
        <p className="font-heading text-lg font-semibold text-brand-dark">{h.errTitle}</p>
        <p className="mt-2 text-sm text-muted-foreground">{h.errBody}</p>
        <a
          href={WA_GENERIC}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="hero-checker-error-whatsapp"
          onClick={() => trackCta("hero-checker-whatsapp")}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-wa px-4 py-2.5 text-sm font-bold text-[#062211] active:scale-95"
        >
          <SiWhatsapp size={18} /> {h.errCta}
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-2xl shadow-[#024180]/10 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <p className="font-heading text-lg font-semibold text-brand-dark">{h.findPlan}</p>
        <span className="rounded-full bg-[#FFF1EA] px-2.5 py-1 text-xs font-semibold text-brand-ink">
          {h.takes}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" data-testid="hero-plan-chips">
        {isLoading
          ? Array.from({ length: 7 }).map((_, i) => (
              <span key={i} className="h-8 w-14 shrink-0 animate-pulse rounded-full bg-muted" data-testid="hero-plan-chip-skeleton" />
            ))
          : plans?.map((p, i) => (
              <PlanChip key={p.slug} plan={p} active={plan?.slug === p.slug} onSelect={() => setIdx(i)} />
            ))}
      </div>

      {isLoading ? (
        <div className="mt-5 space-y-3" data-testid="hero-checker-skeleton">
          <div className="h-9 w-36 animate-pulse rounded-lg bg-muted" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-14 animate-pulse rounded-xl bg-muted" />
            <div className="h-14 animate-pulse rounded-xl bg-muted" />
          </div>
          <div className="h-12 animate-pulse rounded-full bg-muted" />
        </div>
      ) : plan ? (
        <motion.div key={plan.slug} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <p className="mt-5 font-heading text-4xl font-bold text-brand-dark" data-testid="hero-checker-monthly">
            ₹{formatINR(plan.monthly_contribution)}
            <span className="ml-1 text-base font-medium text-muted-foreground">{t.perMonth}</span>
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-brand-mist p-3">
              <p className="text-xs text-[#2E5A8A]">{h.duration}</p>
              <p className="mt-0.5 font-heading font-semibold text-[#024180]" data-testid="hero-checker-duration">
                {t.months(plan.duration_months)}
              </p>
            </div>
            <div className="rounded-xl bg-[#FFF1EA] p-3">
              <p className="text-xs text-[#96400F]">{h.dividend}</p>
              <p className="mt-0.5 font-heading font-semibold text-brand-ink" data-testid="hero-checker-dividend">
                ₹{formatINR(plan.est_monthly_dividend)}{t.perMo}
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {h.winPre}<span className="font-semibold text-brand-dark">₹{formatINR(plan.potential_auction_winning)}</span>{h.winPost}
          </p>
          <a
            href={waPlanEnquiry(plan.name, plan.monthly_contribution, plan.duration_months)}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="hero-plan-whatsapp-btn"
            onClick={() => trackCta("hero-plan-whatsapp", { planSlug: plan.slug })}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-wa px-4 py-3 text-sm font-bold text-[#062211] shadow-lg shadow-wa/25 transition hover:brightness-105 active:scale-95"
          >
            <SiWhatsapp size={18} /> {h.start}
          </a>
        </motion.div>
      ) : null}
    </div>
  );
}

export default function Hero() {
  const { t } = useLang();
  const h = t.hero;
  return (
    <section className="relative overflow-hidden bg-white text-brand-dark">
      {/* soft brand glows */}
      <div aria-hidden className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#FF6431]/10 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -right-32 top-24 h-80 w-80 rounded-full bg-[#024180]/10 blur-[110px]" />

      <div className={`${CONTAINER} relative grid gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-24`}>
        <div className="lg:col-span-7">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#FF6431]/30 bg-[#FFF1EA] px-3.5 py-1.5 text-xs font-semibold text-brand-ink">
              <ShieldCheck size={15} />
              {h.badge}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease }}
            className="mt-6 max-w-xl font-heading text-4xl font-bold leading-[1.08] tracking-tight text-brand-dark sm:text-5xl lg:max-w-2xl lg:text-[56px]"
            data-testid="hero-headline"
          >
            {h.h1a} <span className="text-brand">{h.h1b}</span> {h.h1c}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease }}
            className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            data-testid="hero-subcopy"
          >
            {h.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24, ease }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href={WA_GENERIC}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="hero-whatsapp-btn"
              onClick={() => trackCta("hero-whatsapp")}
              className="inline-flex items-center gap-2 rounded-full bg-wa px-6 py-3.5 text-base font-bold text-[#062211] shadow-lg shadow-wa/25 transition hover:brightness-105 active:scale-95"
            >
              <SiWhatsapp size={20} /> {h.cta}
            </a>
            <StoreBadge store="play" testid="hero-play-badge" />
            <StoreBadge store="appstore" testid="hero-appstore-badge" />
          </motion.div>
          <p className="mt-3 text-sm text-muted-foreground">{h.note}</p>
        </div>

        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          <PlanCheckerCard />
        </motion.div>
      </div>

      {/* trust strip — visible without scrolling */}
      <div className={`${CONTAINER} relative`}>
        <div className="grid grid-cols-2 gap-6 border-t py-6 sm:grid-cols-4" data-testid="hero-trust-strip">
          {h.stats.map((s) => (
            <div key={s.label}>
              <p className="font-heading text-2xl font-bold text-[#024180] sm:text-3xl">{s.value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* cities ticker */}
      <div className="relative overflow-hidden border-y bg-brand-mist/60 py-3" aria-hidden>
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap text-sm font-medium text-[#2E5A8A]">
          {[...CITIES, ...CITIES].map((c, i) => (
            <span key={i} className="flex items-center gap-10">
              <MapPin size={13} className="text-brand" />
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

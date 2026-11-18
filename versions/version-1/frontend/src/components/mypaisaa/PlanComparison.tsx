import { useState, type CSSProperties } from "react";
import { motion } from "motion/react";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { CalendarClock, Gift, Info, Trophy, Wallet } from "lucide-react";
import { usePlans } from "@/lib/plans";
import { formatINR, formatShort } from "@/lib/format";
import { WA_GENERIC, waPlanEnquiry } from "@/lib/contact";
import { trackCta } from "@/lib/track";
import { useLang } from "@/lib/i18n";
import { CONTAINER, Eyebrow } from "./bits";
import { Reveal } from "./Reveal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function PlanChip({ slug, label, active, onSelect }: { slug: string; label: string; active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      data-testid={`comparison-plan-chip-${slug}`}
      data-selected={active}
      onClick={onSelect}
      aria-pressed={active}
      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition active:scale-95 ${
        active
          ? "border-primary bg-primary text-white"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"
      }`}
    >
      {label}
    </button>
  );
}

export default function PlanComparison() {
  const { data: plans, isLoading, isError } = usePlans();
  const { t } = useLang();
  const c = t.comparison;
  const [idx, setIdx] = useState(1);
  const safeIdx = Math.min(idx, (plans?.length ?? 1) - 1);
  const plan = plans?.[safeIdx];
  const fill = plans && plans.length > 1 ? (safeIdx / (plans.length - 1)) * 100 : 50;
  const badgeOf = (slug: string, raw: string | null) => (raw ? (t.badges[slug] ?? raw) : null);

  return (
    <section id="calculator" className="border-y bg-white py-16 sm:py-24">
      <div className={CONTAINER}>
        <Reveal className="max-w-2xl">
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl" data-testid="calculator-heading">
            {c.title}
          </h2>
          <p className="mt-3 text-muted-foreground">{c.body}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 grid gap-4 lg:grid-cols-12">
            <div className="min-w-0 rounded-3xl border bg-card p-6 sm:p-8 lg:col-span-7" data-testid="calculator-panel">
              {isError ? (
                <div data-testid="calculator-error" className="py-6 text-center">
                  <p className="font-heading text-lg font-semibold text-brand-dark">{c.errTitle}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{c.errBody}</p>
                  <a
                    href={WA_GENERIC}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="calculator-error-whatsapp"
                    onClick={() => trackCta("calculator-error-whatsapp")}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-wa px-5 py-2.5 text-sm font-bold text-[#062211] active:scale-95"
                  >
                    <SiWhatsapp size={18} /> {c.errCta}
                  </a>
                </div>
              ) : isLoading ? (
                <div className="space-y-5" data-testid="calculator-skeleton">
                  <div className="h-10 w-64 animate-pulse rounded-lg bg-muted" />
                  <div className="h-2 w-full animate-pulse rounded-full bg-muted" />
                  <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />
                    ))}
                  </div>
                </div>
              ) : (
                plan && (
                  <>
                    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1" data-testid="comparison-chips">
                      {plans?.map((p, i) => (
                        <PlanChip
                          key={p.slug}
                          slug={p.slug}
                          label={formatShort(p.fund_value)}
                          active={plan.slug === p.slug}
                          onSelect={() => setIdx(i)}
                        />
                      ))}
                    </div>

                    <div className="mt-6">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">{c.selected}</p>
                          <h3 className="mt-1 font-heading text-2xl font-bold text-brand-dark" data-testid="comparison-plan-name">
                            {t.planName(plan.fund_value)}
                            {badgeOf(plan.slug, plan.badge) ? (
                              <span className="ml-3 rounded-full bg-[#FF6431]/10 px-2.5 py-1 align-middle text-xs font-semibold text-brand-ink">
                                {badgeOf(plan.slug, plan.badge)}
                              </span>
                            ) : null}
                          </h3>
                        </div>
                        <p className="hidden text-right text-xs text-muted-foreground sm:block">
                          {c.chitValue(formatShort(plan.fund_value))}
                        </p>
                      </div>

                      <input
                        type="range"
                        min={0}
                        max={(plans?.length ?? 7) - 1}
                        step={1}
                        value={safeIdx}
                        onChange={(ev) => setIdx(Number(ev.target.value))}
                        className="chit-slider mt-4"
                        style={{ "--fill": `${fill}%` } as CSSProperties}
                        data-testid="chit-slider"
                        aria-label={c.sliderLabel}
                        aria-valuetext={t.planName(plan.fund_value)}
                      />
                      <div className="mt-1.5 flex justify-between text-xs font-medium text-muted-foreground">
                        <span>₹1L</span>
                        <span>₹30L</span>
                      </div>
                    </div>

                    <motion.div
                      key={plan.slug}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="mt-6 grid grid-cols-2 gap-3"
                    >
                      <div className="rounded-2xl bg-brand-mist p-4" data-testid="comparison-monthly">
                        <p className="flex items-center gap-1.5 text-xs font-medium text-[#2E5A8A]">
                          <Wallet size={14} className="shrink-0" /> {c.save}
                        </p>
                        <p className="mt-1 font-heading text-xl font-bold text-[#024180]">₹{formatINR(plan.monthly_contribution)}</p>
                      </div>
                      <div className="rounded-2xl bg-muted p-4" data-testid="comparison-duration">
                        <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                          <CalendarClock size={14} className="shrink-0" /> {c.duration}
                        </p>
                        <p className="mt-1 font-heading text-xl font-bold text-brand-dark">{t.months(plan.duration_months)}</p>
                      </div>
                      <div className="rounded-2xl bg-muted p-4" data-testid="comparison-dividend">
                        <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                          <Gift size={14} className="shrink-0" /> {c.dividend}
                        </p>
                        <p className="mt-1 font-heading text-xl font-bold text-primary">
                          ₹{formatINR(plan.est_monthly_dividend)}
                          <span className="text-sm font-medium text-muted-foreground">{t.perMo}</span>
                        </p>
                      </div>
                      <div className="rounded-2xl bg-brand-mist p-4" data-testid="comparison-winning">
                        <p className="flex items-center gap-1.5 text-xs font-medium text-[#2E5A8A]">
                          <Trophy size={14} className="shrink-0" /> {c.win}
                        </p>
                        <p className="mt-1 font-heading text-xl font-bold text-[#024180]">₹{formatINR(plan.potential_auction_winning)}</p>
                      </div>
                    </motion.div>

                    <p className="mt-4 flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground">
                      <Info size={14} className="mt-0.5 shrink-0" />
                      <span>{c.info}</span>
                    </p>

                    <a
                      href={waPlanEnquiry(plan.name, plan.monthly_contribution, plan.duration_months)}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid="comparison-whatsapp-btn"
                      onClick={() => trackCta("comparison-whatsapp", { planSlug: plan.slug })}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-wa px-5 py-3.5 text-base font-bold text-[#062211] shadow-lg shadow-wa/20 transition hover:brightness-105 active:scale-95"
                    >
                      <SiWhatsapp size={20} className="shrink-0" /> {c.cta}
                    </a>
                  </>
                )
              )}
            </div>

            <div className="rounded-3xl bg-brand-dark p-6 text-white sm:p-8 lg:col-span-5" data-testid="calculator-math-panel">
              <h3 className="font-heading text-xl font-semibold">{c.mathTitle}</h3>
              <ul className="mt-5 space-y-4 text-sm leading-relaxed text-[#B9CFE6]">
                {c.math.map((m, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-wa/15 font-heading text-xs font-bold text-wa">
                      {i + 1}
                    </span>
                    <span>
                      {m.pre}
                      {m.bold && <span className="font-semibold text-white">{m.bold}</span>}
                      {m.post}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                {c.mathChips.map((chip) => (
                  <span key={chip} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10 hidden overflow-hidden rounded-3xl border bg-card md:block" data-testid="plan-table">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[30%]">{c.thPlan}</TableHead>
                  <TableHead>{c.thMonthly}</TableHead>
                  <TableHead>{c.thDuration}</TableHead>
                  <TableHead>{c.thDividend}</TableHead>
                  <TableHead className="text-right">{c.thWin}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans?.map((p, i) => {
                  const badge = badgeOf(p.slug, p.badge);
                  return (
                    <TableRow
                      key={p.slug}
                      data-selected={plan?.slug === p.slug}
                      onClick={() => setIdx(i)}
                      data-testid={`plan-row-${p.slug}`}
                      className={`cursor-pointer ${plan?.slug === p.slug ? "bg-brand-mist/70" : ""}`}
                    >
                      <TableCell className="font-heading font-semibold text-brand-dark">
                        {t.planName(p.fund_value)}
                        {badge ? <span className="ml-2 text-xs font-medium text-muted-foreground">· {badge}</span> : null}
                      </TableCell>
                      <TableCell>₹{formatINR(p.monthly_contribution)}{t.perMo}</TableCell>
                      <TableCell>{t.months(p.duration_months)}</TableCell>
                      <TableCell className="text-primary">₹{formatINR(p.est_monthly_dividend)}{t.perMo}</TableCell>
                      <TableCell className="text-right font-medium">₹{formatINR(p.potential_auction_winning)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

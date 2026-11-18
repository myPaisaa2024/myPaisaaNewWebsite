import { ArrowRight, ArrowUpRight, Banknote, FileWarning, Lightbulb, Users } from "lucide-react";
import { Reveal } from "@/components/mypaisaa/Reveal";
import { usePlans, type Plan } from "@/lib/plans";
import { useVacantGroups, type ChitGroup } from "@/lib/groups";
import { useBlogPosts } from "@/lib/blog";
import { waPlanEnquiry, WA_GENERIC } from "@/lib/contact";
import { formatINR } from "@/lib/format";
import { trackCta } from "@/lib/track";
import { en } from "@/i18n/en";
import { GetStarted, Hl, Kicker, WRAP } from "./parts";

const COLUMNS: { title: string; testid: string; match: (p: Plan) => boolean }[] = [
  { title: "Starter Chits", testid: "starter", match: (p) => p.fund_value < 500000 },
  { title: "Growth Chits", testid: "growth", match: (p) => p.fund_value >= 500000 && p.fund_value <= 1000000 },
  { title: "Wealth Chits", testid: "wealth", match: (p) => p.fund_value > 1000000 },
];

function range(values: number[]) {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  return { lo, hi };
}

function PlanTile({ plan, group }: { plan: Plan; group?: ChitGroup }) {
  const cta = `v2-offer-plan-${plan.slug}`;
  return (
    <a
      href={waPlanEnquiry(plan.name, plan.monthly_contribution, plan.duration_months)}
      target="_blank"
      rel="noopener noreferrer"
      data-testid={cta}
      onClick={() => trackCta(cta, { planSlug: plan.slug })}
      className="group block rounded-xl border border-slate-200 bg-white p-4 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#024180]/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-full bg-brand-mist font-heading text-xs font-bold text-[#024180]">
            {plan.fund_value / 100000}L
          </span>
          <span className="font-heading text-[15px] font-semibold text-slate-800">{plan.name.replace(" Chit Plan", "")}</span>
        </div>
        {group ? (
          <span className="rounded-md bg-[#FFF1EA] px-2 py-1 text-[11px] font-semibold text-brand-ink" data-testid={`${cta}-seats`}>
            Only {group.seats_left} seats left
          </span>
        ) : plan.badge ? (
          <span className="rounded-md bg-brand-mist px-2 py-1 text-[11px] font-semibold text-[#024180]">{plan.badge}</span>
        ) : (
          <span className="grid size-7 place-items-center rounded-full bg-slate-100 text-slate-500 transition-colors duration-200 group-hover:bg-[#024180] group-hover:text-white">
            <ArrowUpRight size={15} />
          </span>
        )}
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-[11px] text-slate-500">Monthly</p>
          <p className="font-heading text-lg font-bold text-slate-800">₹{formatINR(plan.monthly_contribution)}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-slate-500">Tenure</p>
          <p className="font-heading text-lg font-bold text-slate-800">{plan.duration_months} Months</p>
        </div>
      </div>
    </a>
  );
}

export function OfferV2() {
  const plans = usePlans();
  const groups = useVacantGroups();
  const groupFor = (slug: string) => groups.data?.find((g) => g.plan_slug === slug);

  return (
    <section id="v2-offer" className="scroll-mt-20 bg-white py-20" data-testid="v2-offer">
      <div className={WRAP}>
        <Kicker>What we offer?</Kicker>
        <h2 className="mx-auto mt-5 max-w-3xl text-center font-heading text-3xl font-bold leading-tight text-slate-800 sm:text-[40px]">
          <Hl>Registered chit plans</Hl> from ₹1 Lakh to ₹30 Lakhs with weekly e-auctions
        </h2>

        <div className="mt-12 rounded-2xl bg-[#F7F8FC] p-4 sm:p-6">
          {plans.isLoading && (
            <div className="grid gap-5 md:grid-cols-3" data-testid="v2-offer-loading">
              {[0, 1, 2].map((i) => <div key={i} className="h-72 animate-pulse rounded-xl bg-slate-200/60" />)}
            </div>
          )}
          {plans.isError && (
            <div className="py-10 text-center" data-testid="v2-offer-error">
              <p className="text-slate-600">Plans didn't load — our advisors can share them on WhatsApp.</p>
              <GetStarted testid="v2-offer-error-cta" label="Chat on WhatsApp" className="mt-4" />
            </div>
          )}
          {plans.data && (
            <div className="grid items-start gap-6 md:grid-cols-3">
              {COLUMNS.map((col) => {
                const list = plans.data.filter(col.match);
                if (list.length === 0) return null;
                const m = range(list.map((p) => p.monthly_contribution));
                const t = range(list.map((p) => p.duration_months));
                return (
                  <div key={col.testid} data-testid={`v2-offer-col-${col.testid}`}>
                    <h3 className="font-heading text-xl font-bold text-slate-800">Invest in {col.title}</h3>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] text-slate-600">
                      <li>
                        Monthly from <b className="text-slate-800">₹{formatINR(m.lo)}{m.hi !== m.lo && ` to ₹${formatINR(m.hi)}`}</b>
                      </li>
                      <li>
                        Tenure of <b className="text-slate-800">{t.lo}{t.hi !== t.lo && ` to ${t.hi}`} months</b>
                      </li>
                    </ul>
                    <div className="mt-4 space-y-3">
                      {list.map((p) => <PlanTile key={p.id} plan={p} group={groupFor(p.slug)} />)}
                    </div>
                    <a
                      href={WA_GENERIC}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`v2-offer-explore-${col.testid}`}
                      onClick={() => trackCta(`v2-offer-explore-${col.testid}`)}
                      className="group mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-[#024180]"
                    >
                      Explore {col.title}
                      <span className="grid size-6 place-items-center rounded-full border border-[#024180] transition-transform duration-200 group-hover:translate-x-1">
                        <ArrowRight size={13} />
                      </span>
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function TraditionV2() {
  return (
    <section className="bg-white py-10" data-testid="v2-tradition">
      <div className="mx-auto max-w-6xl rounded-[32px] bg-gradient-to-b from-brand-mist to-[#F4F8FD] px-4 py-16 sm:px-10">
        <Kicker>Save like communities do</Kicker>
        <h2 className="mx-auto mt-5 max-w-3xl text-center font-heading text-3xl font-bold leading-tight text-slate-800 sm:text-[40px]">
          The <Hl>trusted chit tradition</Hl>, now registered and digital
        </h2>
        <Reveal className="mt-12">
          <div className="grid items-center gap-6 rounded-3xl bg-white/70 p-6 shadow-[0_20px_50px_-30px_rgba(2,65,128,0.35)] backdrop-blur lg:grid-cols-[1fr_auto_1.4fr_auto_1fr] lg:p-10">
            <div className="text-center" data-testid="v2-tradition-old">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Traditional chits</p>
              <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-[#FFF1EA] p-5">
                {[
                  { i: Banknote, l: "Cash collections" },
                  { i: FileWarning, l: "Paper ledgers" },
                ].map((x) => (
                  <div key={x.l} className="flex flex-col items-center gap-2">
                    <span className="grid size-12 place-items-center rounded-full bg-white text-brand-ink shadow-sm"><x.i size={20} /></span>
                    <span className="text-xs text-slate-600">{x.l}</span>
                  </div>
                ))}
              </div>
            </div>
            <ArrowRight className="mx-auto rotate-90 text-brand lg:rotate-0" />
            <div className="rounded-2xl border-2 border-[#024180]/15 bg-white p-6 text-center" data-testid="v2-tradition-center">
              <p className="font-heading text-lg font-semibold text-slate-800">Same community chit, on your phone</p>
              <div className="my-4 h-px bg-slate-200" />
              <div className="flex flex-wrap justify-center gap-2">
                {["T-Chits verified", "100% FDR pledged", "UPI payments", "Live e-auctions"].map((c) => (
                  <span key={c} className="rounded-full bg-brand-mist px-3 py-1 text-xs font-semibold text-[#024180]">{c}</span>
                ))}
              </div>
            </div>
            <ArrowRight className="mx-auto -rotate-90 text-brand lg:rotate-180" />
            <div className="text-center" data-testid="v2-tradition-members">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">myPaisaa members</p>
              <div className="mt-4 grid grid-cols-2 place-items-center gap-3 rounded-2xl bg-gradient-to-br from-[#DCEBFA] to-brand-mist p-5">
                {["SR", "AK", "PV", "NM"].map((n, i) => (
                  <span key={n} className={`grid size-12 place-items-center rounded-full border-2 border-white font-heading text-sm font-bold text-white shadow ${i % 2 ? "bg-brand" : "bg-[#024180]"}`}>
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
        <p className="mx-auto mt-8 flex max-w-xl items-start justify-center gap-3 text-center text-sm text-slate-600" data-testid="v2-tradition-note">
          <Lightbulb className="shrink-0 text-amber-500" size={20} />
          Every group's full chit value is deposited with the Registrar before the first instalment is collected.
        </p>
        <div className="mt-8 flex justify-center">
          <GetStarted testid="v2-tradition-get-started" />
        </div>
      </div>
    </section>
  );
}

export function LoveV2() {
  const items = en.stories.items;
  const loop = [...items, ...items];
  return (
    <section id="v2-love" className="scroll-mt-20 overflow-hidden bg-white py-20" data-testid="v2-love">
      <div className={WRAP}>
        <Kicker>Testimonials</Kicker>
        <h2 className="mt-5 text-center font-heading text-3xl font-bold text-slate-800 sm:text-[40px]">
          Wall of Love <Hl>@ myPaisaa</Hl>
        </h2>
        <p className="mt-3 text-center text-sm text-slate-500" data-testid="v2-love-rating">
          <Users className="mr-1 inline" size={15} /> {en.stories.ratingBold}{en.stories.ratingRest}
        </p>
      </div>
      <div className="group mt-12 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-[v2-marquee_40s_linear_infinite] gap-5 group-hover:[animation-play-state:paused]">
          {loop.map((s, i) => (
            <figure
              key={i}
              aria-hidden={i >= items.length}
              data-testid={i < items.length ? `v2-love-card-${i}` : undefined}
              className="w-[320px] shrink-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:w-[380px]"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-[#024180] font-heading text-sm font-bold text-white">
                  {s.meta.split(" · ")[1]?.slice(0, 2).toUpperCase() ?? "MP"}
                </span>
                <figcaption>
                  <p className="font-heading text-[15px] font-semibold text-slate-800">{s.meta}</p>
                  <p className="text-xs font-medium text-brand-ink">{s.outcome}</p>
                </figcaption>
              </div>
              <blockquote className="mt-4 text-[15px] leading-relaxed text-slate-600">“{s.quote}”</blockquote>
            </figure>
          ))}
        </div>
      </div>
      <div className="mt-12 flex justify-center">
        <GetStarted testid="v2-love-get-started" />
      </div>
    </section>
  );
}

export function GuidesV2() {
  const posts = useBlogPosts();
  if (posts.isError || (posts.data && posts.data.length === 0)) return null;
  return (
    <section id="v2-guides" className="scroll-mt-20 bg-white pb-20" data-testid="v2-guides">
      <div className={WRAP}>
        <Kicker>From the myPaisaa blog</Kicker>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {(posts.data ?? []).map((p, i) => (
            <a
              key={p.link}
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`v2-guide-card-${i}`}
              className="group flex flex-col rounded-2xl border border-slate-200 p-5 transition-[border-color,box-shadow] duration-200 hover:border-[#024180]/40 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-heading text-sm font-bold tracking-wide text-[#024180]">SAVINGS GUIDE</span>
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-mist text-[#024180] transition-colors duration-200 group-hover:bg-[#024180] group-hover:text-white">
                  <ArrowUpRight size={14} />
                </span>
              </div>
              <p className="mt-4 line-clamp-2 font-heading text-[15px] font-semibold text-slate-800">{p.title}</p>
              <p className="mt-2 line-clamp-2 text-sm text-slate-500">{p.excerpt}</p>
            </a>
          ))}
          {posts.isLoading && [0, 1, 2].map((i) => <div key={i} className="h-40 animate-pulse rounded-2xl bg-slate-100" />)}
        </div>
      </div>
    </section>
  );
}

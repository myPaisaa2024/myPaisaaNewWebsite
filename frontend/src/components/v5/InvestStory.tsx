import { useMemo, useState } from "react";
import { LeadForm3 } from "@/components/v3/Bottom3";
import { formatINR } from "@/lib/format";
import { trackCta } from "@/lib/track";
import { useBriefPlans, useV3 } from "@/lib/v3";
import { OnlyAt, WhyChapter, WhyRecap, WhyStrip, commissionLine } from "./why";
import { Aside, Cards, ChargesDisclosure, Chapter, Character, CompareTable, FaqList, Hook, Readout, StoryCtas, ToolCard, tid, type ChapterMeta, type CharacterInfo } from "./kit";

export const INVEST_CHAPTERS: ChapterMeta[] = [
  { id: "invest-ch1", label: "No market exposure" },
  { id: "invest-ch2", label: "The yield problem" },
  { id: "invest-ch3", label: "Why myPaisaa" },
  { id: "invest-ch4", label: "Where chits fit" },
  { id: "invest-ch5", label: "Build a ladder" },
  { id: "invest-ch6", label: "Dividend record" },
  { id: "invest-ch7", label: "Governance" },
  { id: "invest-ch8", label: "Tax & access" },
  { id: "invest-ch9", label: "Investors ask" },
  { id: "invest-ch10", label: "Senior advisor" },
];

const RAO: CharacterInfo = {
  name: "Mr. Rao, 62",
  initials: "SR",
  role: "Retired bank officer · Hyderabad",
  situation: "Has his savings spread across FDs and a few mutual funds. Wants steady income that doesn't swing with the market — and wants to see how it's governed first.",
};

const BANDS = ["₹10–25 Lakh", "₹25–50 Lakh", "₹50 Lakh–₹1 Crore", "Above ₹1 Crore"];
const LEAD = "#invest-lead";

interface Rung {
  value: number;
  months: number;
}

/** Greedy split across ₹25L / ₹15L / ₹10L, alternating 50 / 25 month tenures so maturities ladder. */
function buildLadder(total: number, avail: { value: number; durations: number[] }[]): { rungs: Rung[]; left: number } {
  const rungs: Rung[] = [];
  let left = total;
  const sizes = [...avail].sort((a, b) => b.value - a.value);
  const pick = (s: { value: number; durations: number[] }) => {
    const longFirst = rungs.length % 2 === 0;
    const months = s.durations.length > 1 ? (longFirst ? Math.max(...s.durations) : Math.min(...s.durations)) : s.durations[0];
    rungs.push({ value: s.value, months });
    left -= s.value;
  };
  // Diversify first: one of each plan size when the amount allows, then fill greedily.
  const oneEach = sizes.reduce((s, x) => s + x.value, 0);
  if (sizes.length && left >= oneEach) sizes.forEach(pick);
  for (const s of sizes) {
    while (left >= s.value && rungs.length < 8) {
      const longFirst = rungs.length % 2 === 0;
      const months = s.durations.length > 1 ? (longFirst ? Math.max(...s.durations) : Math.min(...s.durations)) : s.durations[0];
      rungs.push({ value: s.value, months });
      left -= s.value;
    }
  }
  return { rungs, left };
}

function bandFor(total: number) {
  if (total <= 2500000) return BANDS[0];
  if (total <= 5000000) return BANDS[1];
  if (total <= 10000000) return BANDS[2];
  return BANDS[3];
}

export function InvestStory() {
  const p = "invest" as const;
  const plans = useBriefPlans();
  const { pickPlan } = useV3();
  const [total, setTotal] = useState(5000000);
  const [prefill, setPrefill] = useState<Record<string, string> | undefined>();

  const ladder = useMemo(() => {
    const hv = (plans.data ?? []).filter((x) => x.chit_value >= 1000000).map((x) => ({ value: x.chit_value, durations: x.durations }));
    return buildLadder(total, hv);
  }, [plans.data, total]);
  const monthly = ladder.rungs.reduce((s, r) => s + r.value / r.months, 0);
  const allocated = total - ladder.left;

  return (
    <>
      <Hook
        n={1}
        id="invest-ch1"
        kicker="Mr. Rao's ladder"
        h1a="Fixed-income style returns."
        h1b="No market exposure."
        sub="High-value registered chits from ₹10 Lakh to ₹25 Lakh earn monthly dividends — up to 12% p.a. — with no link to equity or bond markets, and a senior advisor for every plan."
        ctas={<StoryCtas p={p} ch={1} primary="lead" leadHref={LEAD} leadLabel="Speak with a senior advisor" />}
        strip={<WhyStrip p={p} />}
        aside={<Character c={RAO} testid="v5-invest-character" />}
      />

      <Chapter n={2} id="invest-ch2" kicker="The problem" title="Safe feels too slow. Fast feels too loud." tint>
        <Cards
          testid="v5-invest-problem"
          items={[
            { tag: "01", t: "FD rates feel low", b: "Safe, but after tax the real return can barely keep pace with costs." },
            { tag: "02", t: "Equities swing", b: "Good over decades — uncomfortable when you need steady monthly income now." },
            { tag: "03", t: "Bonds need homework", b: "Credit ratings, issuers, secondary markets — a lot to track for a retiree." },
          ]}
        />
        <Aside c={RAO} testid="v5-invest-aside-2">Mr. Rao's FDs renew at lower rates each year, and he doesn't want more equity at 62.</Aside>
      </Chapter>

      <WhyChapter n={3} id="invest-ch3" p={p} leadHref={LEAD} track="v5-invest-why" />

      <Chapter n={4} id="invest-ch4" kicker="Where chits fit" title="A third bucket between deposits and markets.">
        <CompareTable
          testid="v5-invest-compare"
          cols={["myPaisaa chit", "Bank FD", "Equity / MF"]}
          rows={[
            { k: "Market risk", v: ["Zero", "Zero", "High"] },
            { k: "Return profile", v: ["Up to 12% p.a. from dividends", "Fixed bank rate", "Volatile"] },
            { k: "Access early", v: ["Bid to lift the pot", "Break with penalty", "Sell any day"] },
            { k: "Regulator", v: ["Registrar of Chits", "RBI", "SEBI"] },
            { k: "Tax", v: ["Income from other sources", "Slab rate", "Capital gains"] },
          ]}
          foot="Chit returns depend on auction outcomes and are not guaranteed."
        />
      </Chapter>

      <Chapter n={5} id="invest-ch5" kicker="Ladder builder" title="Spread one amount across plans and tenures." lead="Enter the amount you'd like to put to work. We'll split it across the ₹10L, ₹15L and ₹25L plans with staggered tenures, so groups finish at different times." tint>
        <ToolCard testid="v5-invest-ladder">
          <label htmlFor="v5-invest-total" className="flex items-baseline justify-between text-sm font-medium text-slate-700">
            Total to invest <span className="font-mono text-2xl font-semibold text-slate-900" data-testid="v5-invest-total-value">₹{formatINR(total)}</span>
          </label>
          <input id="v5-invest-total" type="range" min={1000000} max={10000000} step={500000} value={total} onChange={(e) => setTotal(Number(e.target.value))} data-testid="v5-invest-total" className="mt-4 w-full accent-[var(--acc)]" />
          <div className="mt-1 flex justify-between font-mono text-[11px] text-slate-400"><span>₹10L</span><span>₹1 Cr</span></div>
          <ul className="mt-6 space-y-2" data-testid="v5-invest-rungs">
            {ladder.rungs.map((r, i) => (
              <li key={i} className="flex items-center gap-4 rounded-xl border border-slate-200 px-4 py-3" data-testid={`v5-invest-rung-${i}`}>
                <span className="font-mono text-xs text-slate-400">#{i + 1}</span>
                <span className="font-heading font-semibold text-slate-900">₹{r.value / 100000} Lakh</span>
                <span className="text-sm text-slate-500">{r.months} months</span>
                <div className="hidden h-1.5 flex-1 rounded-full bg-slate-100 sm:block"><div className="h-full rounded-full bg-[var(--acc)]" style={{ width: `${(r.months / 50) * 100}%` }} /></div>
                <span className="ml-auto font-mono text-sm text-slate-900">₹{formatINR(r.value / r.months)}/mo</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-xl bg-[var(--acc-soft)] p-5">
            <Readout testid="v5-invest-ladder-readout" items={[{ k: "Groups", v: String(ladder.rungs.length) }, { k: "Allocated", v: `₹${formatINR(allocated)}` }, { k: "Combined monthly", v: `₹${formatINR(monthly)}` }, { k: "Unallocated", v: `₹${formatINR(ladder.left)}` }]} />
            <OnlyAt testid="v5-invest-only-at">Across this ladder: dividends on completed groups ran at 150–170% of comparable chit companies'.*</OnlyAt>
            <a
              href={LEAD}
              data-testid={tid(p, 5, "use-ladder")}
              onClick={() => {
                if (ladder.rungs[0]) pickPlan(ladder.rungs[0].value);
                setPrefill({ amount_band: bandFor(total) });
                trackCta(tid(p, 5, "use-ladder"));
              }}
              className="mt-5 inline-flex h-11 items-center rounded-xl bg-[var(--acc)] px-5 text-sm font-semibold text-white transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.97]"
            >
              Review this ladder with an advisor
            </a>
          </div>
          <p className="mt-3 text-xs text-slate-500">Illustrative split. Monthly figures are full instalments before dividends. Availability of groups varies.</p>
        </ToolCard>
        <Aside c={RAO} testid="v5-invest-aside-4">Mr. Rao tries ₹50 Lakh: two ₹25 Lakh groups, one finishing in 25 months and one in 50.</Aside>
      </Chapter>

      <Chapter n={6} id="invest-ch6" kicker="Dividend track record" title="Dividends 1.5–1.7x higher than comparable chits.*">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-2xl bg-gradient-to-br from-[#02305F] to-brand-deep p-8 text-white" data-testid="v5-invest-record">
            <p className="font-mono text-6xl font-semibold">1.5–1.7x</p>
            <p className="mt-3 text-white/75">Dividends on completed myPaisaa groups, against comparable chit companies.</p>
          </div>
          <div>
            <p className="text-slate-600">Ask your advisor for the dividend history of completed groups at the value you're considering — month by month, from the actual auction records.</p>
            <a href={LEAD} data-testid={tid(p, 6, "history")} onClick={() => trackCta(tid(p, 6, "history"))} className="mt-5 inline-flex h-11 items-center rounded-xl border border-[var(--acc)] px-5 text-sm font-semibold text-[var(--acc)] transition-colors duration-200 hover:bg-[var(--acc)] hover:text-white">
              Request group history
            </a>
            <p className="mt-5 text-xs text-slate-500">*Measured on completed groups against comparable chit companies; data held on file. Past dividends do not guarantee future returns.</p>
          </div>
        </div>
      </Chapter>

      <Chapter n={7} id="invest-ch7" kicker="Governance" title="What stands between your money and a bad outcome." tint>
        <Cards
          testid="v5-invest-governance"
          items={[
            { t: "Three named companies", b: "Finsave Technologies Pvt. Ltd. runs the platform for registered chit companies IBG eChit Funds Pvt. Ltd. and Bilva Chits." },
            { t: "Registrar oversight", b: "Registered under the Chit Funds Act, 1982 and overseen by the Registrar of Chits, Telangana. Groups listed on T-Chits." },
            { t: "Security deposit", b: "The full chit value is pledged with the Registrar before a group begins." },
            { t: "Member screening", b: "Every subscriber passes credit and risk underwriting before joining." },
            { t: "Recovery team", b: "A dedicated legal and recovery function; the company covers group shortfalls." },
            { t: "Enterprise hosting", b: "The platform runs on Microsoft Azure and AWS with enterprise-grade security." },
          ]}
        />
      </Chapter>

      <Chapter n={8} id="invest-ch8" kicker="Tax & access" title="How dividends are taxed, and how you reach your money.">
        <Cards
          testid="v5-invest-tax"
          items={[
            { t: "Tax", b: "Dividends are taxed as income from other sources. Individuals can't offset bid losses against them." },
            { t: "Access early", b: "Bid in an auction to lift the pot before the tenure ends. Winning a particular auction is never promised." },
            { t: "Stopping early", b: "Discontinuing costs 5% commission + GST and forfeits dividends already paid." },
          ]}
        />
        <div className="mt-8">
          <ChargesDisclosure
            testid="v5-invest-charges"
            highlights={[
              { k: "Commission", v: "5% of chit value", note: commissionLine(2500000, false) },
              { k: "Processing fee", v: "₹200 / lakh + GST", note: "₹5,000 + GST on a ₹25 Lakh plan, once." },
              { k: "Discontinuation", v: "5% + GST + dividends", note: "Match tenures to when you'll need the money." },
            ]}
          />
        </div>
      </Chapter>

      <Chapter n={9} id="invest-ch9" kicker="Investors ask" title="Questions investors ask us most." tint>
        <FaqList
          testid="v5-invest-faq"
          items={[
            { q: "Is “up to 12% p.a.” guaranteed?", a: "No. It reflects the upper range of dividends from auctions. Your actual return depends on how each group's auctions go." },
            { q: "How is the 1.5–1.7x figure measured?", a: "On completed groups, compared with comparable chit companies. The data is held on file and your advisor can walk you through it." },
            { q: "What happens if members default?", a: "The company is positioned to cover shortfalls, screens members through underwriting, and runs a dedicated recovery team." },
            { q: "You're younger than established players. Why trust you?", a: "We've operated since 2020 across several states, with an experienced founding team and institutional investors — and every group is listed on T-Chits." },
            { q: "Can I hold several groups at once?", a: "Yes. Many investors ladder across plan values and tenures, which is exactly what the ladder builder above sketches." },
          ]}
        />
      </Chapter>

      <Chapter n={10} id="invest-ch10" kicker="Senior advisor" title="One call. Dividend history, availability, tax and charges." lead="A senior advisor handles every ₹10 Lakh+ enquiry.">
        <StoryCtas p={p} ch={10} primary="lead" leadHref={LEAD} leadLabel="Speak with a senior advisor" />
      </Chapter>
      <WhyRecap p={p} leadHref={LEAD} track="v5-invest-why" />
      <LeadForm3
        sectionId="invest-lead"
        source="v5"
        profile="invest"
        initialGoal="invest"
        title="Speak with a senior advisor."
        body="Tell us the amount you're considering and when to call. We'll bring completed-group dividend history to the conversation."
        extras={[
          { key: "amount_band", label: "Amount you're considering", options: BANDS },
          { key: "call_time", label: "Best time to call", options: ["Morning (9–12)", "Afternoon (12–4)", "Evening (4–8)"] },
        ]}
        extraInit={prefill}
      />
    </>
  );
}

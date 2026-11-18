import { useMemo, useState } from "react";
import { Layers, Pencil, ShieldCheck } from "lucide-react";
import { LeadForm3, type ExtraField } from "@/components/v3/Bottom3";
import { AuctionSim, Explainer } from "@/components/v5/ExploreStory";
import { Cards, ChargesDisclosure, Chapter, Chips, CompareTable, FaqList, Hook, Readout, StoryCtas, Timeline, ToolCard, type ChapterMeta } from "@/components/v5/kit";
import { TCHITS_URL } from "@/lib/contact";
import { formatINR } from "@/lib/format";
import { trackCta } from "@/lib/track";
import { useBriefPlans, useV3, type BriefPlan, type Goal, type Profile } from "@/lib/v3";
import { BAND_DEFAULT, BAND_INVEST_DEFAULT, BAND_PLANS, PURPOSE_LABEL, bandLabel, cap, hi, tid6, waForCase, workLabel, type Case } from "@/lib/v6";
import { DividendProof, OnlyAt, WhyChapter, WhyRecap, WhyStrip, commissionLine } from "@/components/v5/why";
import { FAQ_TITLE, HOOKS, PROBLEMS, PURPOSE_PROBLEM_LEAD, WORK_FACT, faqFor } from "./copy";

const LABELS: Record<Profile, string[]> = {
  save: ["Your habit", "What gets in the way", "Why myPaisaa", "How a chit holds you", "Plan your goal", "Plans for you", "Your costs", "Is it safe?", "Your questions", "Your next step"],
  borrow: ["Your funds", "What gets in the way", "Why myPaisaa", "Your credit line", "Plan your funds", "Plans for you", "Your costs", "Who's behind it", "Your questions", "Your next step"],
  invest: ["Your investment", "The yield gap", "Why myPaisaa", "Where chits fit", "Build your ladder", "Plans for you", "Your costs", "Governance", "Your questions", "Your next step"],
  explore: ["Chits for you", "The real problem", "Why myPaisaa", "60-second explainer", "Try an auction", "Plans for you", "What it costs", "Check us yourself", "Your questions", "Your next step"],
};

export const chaptersFor = (p: Profile): ChapterMeta[] => LABELS[p].map((label, i) => ({ id: `v6-ch${i + 1}`, label }));

const GOAL_OF: Record<Profile, Goal> = { save: "save", borrow: "borrow", invest: "invest", explore: "save" };
const LEAD = "#v6-lead";
const lakhs = (v: number) => `₹${v / 100000} Lakh`;
const emiText = (p: BriefPlan) => (p.emi_min === p.emi_max ? `₹${formatINR(p.emi_min)}` : `₹${formatINR(p.emi_min)}–${formatINR(p.emi_max)}`);
const THIS_YEAR = new Date().getFullYear();
const YEARS = [2, 3, 4, 5].map((n) => THIS_YEAR + n);
const GOALS = ["Education", "Wedding", "Home", "Business", "Other"];
const URGENCY = ["This month", "In 1–3 months", "Later this year"];

/** Best combination of ₹10L / ₹15L / ₹25L groups: most allocated, then most distinct sizes, then fewest groups. */
function bestLadder(total: number, sizes: BriefPlan[]) {
  const [a, b, c] = [2500000, 1500000, 1000000].map((v) => sizes.find((s) => s.chit_value === v));
  if (!a || !b || !c) return { rungs: [] as { plan: BriefPlan; months: number }[], left: total };
  let best = { n25: 0, n15: 0, n10: 0, alloc: 0, distinct: 0, count: 0 };
  for (let x = 0; x <= 4; x++)
    for (let y = 0; y <= 6; y++)
      for (let z = 0; z <= 8; z++) {
        const alloc = x * a.chit_value + y * b.chit_value + z * c.chit_value;
        const count = x + y + z;
        if (alloc > total || count > 8) continue;
        const distinct = [x, y, z].filter(Boolean).length;
        if (alloc > best.alloc || (alloc === best.alloc && (distinct > best.distinct || (distinct === best.distinct && count < best.count))))
          best = { n25: x, n15: y, n10: z, alloc, distinct, count };
      }
  const rungs: { plan: BriefPlan; months: number }[] = [];
  const push = (pl: BriefPlan, n: number) => {
    for (let k = 0; k < n; k++) {
      const long = rungs.length % 2 === 0;
      rungs.push({ plan: pl, months: pl.durations.length > 1 ? (long ? Math.max(...pl.durations) : Math.min(...pl.durations)) : pl.durations[0] });
    }
  };
  push(a, best.n25);
  push(b, best.n15);
  push(c, best.n10);
  return { rungs, left: total - best.alloc };
}

function YourCase({ c, onEdit }: { c: Case; onEdit: () => void }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_30px_60px_-30px_rgba(2,26,56,0.45)] backdrop-blur-md" data-testid="v6-your-case">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-widest text-slate-400">Your case</p>
        <button type="button" onClick={onEdit} data-testid="v6-your-case-edit" className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--acc)] hover:underline">
          <Pencil size={12} /> Edit
        </button>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <span className="grid size-12 place-items-center rounded-full bg-[var(--acc)] font-heading text-lg font-bold text-white">{(c.name || "Y").charAt(0).toUpperCase()}</span>
        <p className="font-heading text-xl font-semibold text-slate-900" data-testid="v6-your-case-name">{c.name || "You"}</p>
      </div>
      <dl className="mt-5 grid grid-cols-3 gap-3">
        {[
          { k: "Purpose", v: PURPOSE_LABEL[c.purpose] },
          { k: "Profession", v: workLabel(c.work) },
          { k: "Chit value", v: bandLabel(c.band) },
        ].map((x) => (
          <div key={x.k} className="rounded-xl bg-[var(--acc-soft)] p-3">
            <dt className="text-[11px] text-slate-500">{x.k}</dt>
            <dd className="mt-0.5 text-sm font-semibold text-slate-900" data-testid={`v6-your-case-${x.k.toLowerCase().replace(" ", "-")}`}>{x.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function UsePlan({ c, ch, label, onUse, testid }: { c: Case; ch: number; label: string; onUse: () => void; testid: string }) {
  return (
    <a
      href={LEAD}
      data-testid={testid}
      onClick={() => {
        onUse();
        trackCta(tid6(c, ch, "use-plan"));
      }}
      className="mt-5 inline-flex h-11 items-center rounded-xl bg-[var(--acc)] px-5 text-sm font-semibold text-white transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.97]"
    >
      {label}
    </a>
  );
}

export function PersonalStory({ c, onEdit }: { c: Case; onEdit: () => void }) {
  const p = c.purpose;
  const plans = useBriefPlans();
  const { pickPlan, pickedPlan } = useV3();
  const all = plans.data ?? [];
  const hook = HOOKS[p][c.work];
  const h = hook.h1(hi(c));
  const idFor = (ch: number, a: string) => tid6(c, ch, a);
  const wa = waForCase(c);
  const investMismatch = p === "invest" && c.band === "1-3";

  // Tool state, opened on the visitor's own numbers.
  const [amount, setAmount] = useState(BAND_DEFAULT[c.band]);
  const [year, setYear] = useState(YEARS[1]);
  const [goalType, setGoalType] = useState("Education");
  const [urgency, setUrgency] = useState(URGENCY[1]);
  const [total, setTotal] = useState(BAND_INVEST_DEFAULT[c.band]);
  const [prefill, setPrefill] = useState<Record<string, string> | undefined>();

  const planFor = (v: number) => all.find((x) => x.chit_value >= v) ?? all[all.length - 1];
  const tool = planFor(amount);
  const bandPlans = all.filter((x) => (investMismatch ? BAND_PLANS["1-3"] : BAND_PLANS[c.band]).includes(x.chit_value));
  const ladder = useMemo(() => bestLadder(total, all.filter((x) => x.chit_value >= 1000000)), [total, all]);
  const costValue = pickedPlan ?? BAND_DEFAULT[c.band];

  const saveResult = useMemo(() => {
    if (!tool) return null;
    const avail = Math.max(1, (year - THIS_YEAR) * 12);
    const fits = tool.durations.filter((d) => d <= avail);
    const months = fits.length ? Math.max(...fits) : Math.min(...tool.durations);
    const done = new Date();
    done.setMonth(done.getMonth() + months);
    return { months, monthly: tool.chit_value / months, late: months > avail, done: done.toLocaleDateString("en-IN", { month: "short", year: "numeric" }) };
  }, [tool, year]);

  const extras: ExtraField[] =
    p === "save"
      ? [
          { key: "goal_type", label: "Saving for", options: GOALS },
          { key: "target_year", label: "Needed by", options: YEARS.map(String) },
        ]
      : p === "borrow"
        ? [
            { key: "urgency", label: "How soon", options: URGENCY },
            { key: "use", label: "For", options: ["Business", "Personal"] },
          ]
        : p === "invest"
          ? [{ key: "call_time", label: "Best time to call", options: ["Morning (9–12)", "Afternoon (12–4)", "Evening (4–8)"] }]
          : [{ key: "question", label: "Your question (optional)", placeholder: "e.g. What happens if I stop paying halfway?" }];

  const primary = p === "save" ? "install" : "lead";
  const leadLabel = { save: "Plan my goal with an advisor", borrow: "Check how much I can lift", invest: "Speak with a senior advisor", explore: "Ask us anything" }[p];
  const timelineMonths = tool ? Math.min(...tool.durations) : 30;

  return (
    <>
      <Hook
        n={1}
        id="v6-ch1"
        kicker={hook.kicker}
        h1a={cap(h.a)}
        h1b={h.b}
        sub={hook.sub}
        ctas={<StoryCtas p={p} ch={1} primary={primary} installLabel={p === "save" ? "Start your habit" : "Install the app"} leadHref={p === "explore" ? "#v6-ch4" : LEAD} leadLabel={p === "explore" ? "See how it works" : leadLabel} waHref={wa} idFor={idFor} />}
        strip={<WhyStrip p={p} work={c.work} />}
        aside={<YourCase c={c} onEdit={onEdit} />}
      />

      <Chapter n={2} id="v6-ch2" kicker={`For ${workLabel(c.work).toLowerCase()}${c.work === "other" ? " situations" : "s"}`} title={PROBLEMS[c.work].title} lead={PURPOSE_PROBLEM_LEAD[p]} tint>
        <Cards testid="v6-problem" items={PROBLEMS[c.work].items.map((x, i) => ({ ...x, tag: `0${i + 1}` }))} />
      </Chapter>

      <WhyChapter n={3} id="v6-ch3" p={p} work={c.work} name={c.name || undefined} leadHref={LEAD} track={`v6-${p}-${c.work}-${c.band}-why`} />

      {p === "save" && (
        <Chapter n={4} id="v6-ch4" kicker="How a chit holds you" title="One instalment a month. A dividend whenever you don't bid." lead={tool ? `On a ${lakhs(tool.chit_value)} plan that's ₹${formatINR(tool.chit_value / timelineMonths)} a month for ${timelineMonths} months. Each auction's discount is shared as dividends, reducing what you pay.` : undefined}>
          <ToolCard testid="v6-save-timeline">
            <div className="grid grid-cols-10 gap-1.5">
              {Array.from({ length: timelineMonths }).map((_, i) => (
                <div key={i} className="relative aspect-square rounded-md bg-[var(--acc)]" style={{ opacity: 0.3 + (i / timelineMonths) * 0.7 }}>
                  <span className="absolute inset-0 grid place-items-center font-mono text-[9px] text-white">{i + 1}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500">Illustrative. “Up to 12% p.a.” depends on auction outcomes and is not guaranteed.</p>
          </ToolCard>
        </Chapter>
      )}
      {p === "borrow" && (
        <Chapter n={4} id="v6-ch4" kicker="Your credit line" title="Join once. Bid when you need it. Get paid fast.">
          <Timeline
            testid="v6-borrow-timeline"
            steps={[
              { tag: "Day 1", t: "Join in 2 minutes", b: c.work === "self" ? "eKYC and e-sign — no salary slips needed to start." : "eKYC and e-sign in the app." },
              { tag: "Each auction", t: "Bid in the open", b: "Up to 4 e-auctions a month on eligible plans." },
              { tag: "You win", t: "The pot is yours", b: "The lowest amount accepted wins; the discount is shared." },
              { tag: "≤ 24 hours", t: "Money in your bank", b: c.work === "business" ? "In time for stock — within 24 hours of completed documentation." : "Within 24 hours of completed documentation." },
            ]}
          />
        </Chapter>
      )}
      {p === "invest" && (
        <Chapter n={4} id="v6-ch4" kicker="Where chits fit" title="A third bucket between deposits and markets.">
          <CompareTable
            testid="v6-invest-compare"
            cols={["myPaisaa chit", "Bank FD", "Equity / MF"]}
            rows={[
              { k: "Market risk", v: ["Zero", "Zero", "High"] },
              { k: "Return profile", v: ["Up to 12% p.a. from dividends", "Fixed bank rate", "Volatile"] },
              { k: "Access early", v: ["Bid to lift the pot", "Break with penalty", "Sell any day"] },
              { k: "Tax", v: ["Income from other sources", "Slab rate", "Capital gains"] },
            ]}
            foot="Dividends 1.5–1.7x higher than comparable chits, measured on completed groups; data held on file. Returns are not guaranteed."
          />
        </Chapter>
      )}
      {p === "explore" && (
        <Chapter n={4} id="v6-ch4" kicker="60-second explainer" title="One product. Savers earn, borrowers get funds — fairly.">
          <Explainer />
        </Chapter>
      )}

      <Chapter n={5} id="v6-ch5" kicker={LABELS[p][4]} title={p === "explore" ? `${hi(c) ? `${c.name}, be` : "Be"} a bidder for a moment.` : p === "invest" ? `${hi(c)}let's spread your amount.` : `${hi(c)}here's your plan, on your numbers.`} tint>
        {p === "save" && tool && saveResult && (
          <ToolCard testid="v6-save-planner">
            <div className="grid gap-6 lg:grid-cols-3">
              <div><p className="mb-2 text-sm font-medium text-slate-700">Saving for</p><Chips testid="v6-save-goal" value={goalType} onChange={setGoalType} options={GOALS.map((g) => ({ label: g, value: g }))} /></div>
              <div><p className="mb-2 text-sm font-medium text-slate-700">About how much</p><Chips testid="v6-amount" value={amount} onChange={setAmount} options={all.map((x) => ({ label: `₹${x.chit_value / 100000}L`, value: x.chit_value }))} /></div>
              <div><p className="mb-2 text-sm font-medium text-slate-700">Needed by</p><Chips testid="v6-save-year" value={year} onChange={setYear} options={YEARS.map((y) => ({ label: String(y), value: y }))} /></div>
            </div>
            <div className="mt-8 rounded-xl bg-[var(--acc-soft)] p-5" data-testid="v6-planner-result">
              <p className="font-heading text-2xl font-semibold text-slate-900" data-testid="v6-planner-plan">{lakhs(tool.chit_value)} chit · {saveResult.months} months</p>
              <div className="mt-4"><Readout testid="v6-planner-readout" items={[{ k: "Monthly", v: `₹${formatINR(saveResult.monthly)}` }, { k: "Goal reached", v: saveResult.done }, { k: "e-Auctions", v: `${tool.auctions_per_month} a month` }, { k: "Dividends", v: "When you don't bid" }]} /></div>
              <OnlyAt testid="v6-only-at">{commissionLine(tool.chit_value)}</OnlyAt>
              <div className="mt-4 max-w-md"><DividendProof p={p} leadHref={LEAD} track={tid6(c, 5, "planner")} compact /></div>
              {saveResult.late && <p className="mt-3 text-sm text-slate-600">This runs a little past {year}. You can bid to take the money sooner — winning is never promised.</p>}
              <UsePlan c={c} ch={5} testid="v6-use-plan" label="Use this plan" onUse={() => { pickPlan(tool.chit_value); setPrefill({ goal_type: goalType, target_year: String(year) }); }} />
            </div>
          </ToolCard>
        )}
        {p === "borrow" && tool && (
          <ToolCard testid="v6-borrow-planner">
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div><p className="mb-2 text-sm font-medium text-slate-700">I need about</p><Chips testid="v6-amount" value={amount} onChange={setAmount} options={all.map((x) => ({ label: `₹${x.chit_value / 100000}L`, value: x.chit_value }))} /></div>
              <div><p className="mb-2 text-sm font-medium text-slate-700">I need it</p><Chips testid="v6-borrow-urgency" value={urgency} onChange={setUrgency} options={URGENCY.map((u) => ({ label: u, value: u }))} /></div>
            </div>
            <div className="mt-8 rounded-xl bg-[var(--acc-soft)] p-5" data-testid="v6-planner-result">
              <p className="font-heading text-2xl font-semibold text-slate-900" data-testid="v6-planner-plan">{lakhs(tool.chit_value)} chit</p>
              <div className="mt-4"><Readout testid="v6-planner-readout" items={[{ k: "e-Auctions", v: `${tool.auctions_per_month} a month` }, { k: "Monthly", v: emiText(tool) }, { k: "Tenure", v: `${tool.durations.join(" / ")} months` }, { k: "First bid", v: "First auction" }]} /></div>
              <OnlyAt testid="v6-only-at">This plan has {tool.auctions_per_month} auctions a month: up to {tool.auctions_per_month} chances to lift the pot.</OnlyAt>
              <div className="mt-4 max-w-md"><DividendProof p={p} leadHref={LEAD} track={tid6(c, 5, "planner")} compact /></div>
              <p className="mt-3 text-sm text-slate-600">{urgency === "This month" && tool.auctions_per_month < 4 ? "This plan holds 2 auctions a month. You can bid from the first, but winning is never promised." : "Joining ahead of your need gives you more auctions to bid in."}</p>
              <UsePlan c={c} ch={5} testid="v6-use-plan" label="Check this amount with an advisor" onUse={() => { pickPlan(tool.chit_value); setPrefill({ urgency, amount_needed: lakhs(amount) }); }} />
            </div>
          </ToolCard>
        )}
        {p === "invest" && (
          <>
            {investMismatch && (
              <p className="mb-6 max-w-2xl rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" data-testid="v6-invest-mismatch">
                Investor plans start at ₹10 Lakh. At your amount, a savings chit is a good first step — the savings plans are in the next chapter. Here's how a ladder could look when you're ready.
              </p>
            )}
            <ToolCard testid="v6-invest-ladder">
              <label htmlFor="v6-total" className="flex items-baseline justify-between text-sm font-medium text-slate-700">
                Total to invest <span className="font-mono text-2xl font-semibold text-slate-900" data-testid="v6-invest-total-value">₹{formatINR(total)}</span>
              </label>
              <input id="v6-total" type="range" min={1000000} max={10000000} step={500000} value={total} onChange={(e) => setTotal(Number(e.target.value))} data-testid="v6-invest-total" className="mt-4 w-full accent-[var(--acc)]" />
              <ul className="mt-6 space-y-2">
                {ladder.rungs.map((r, i) => (
                  <li key={i} className="flex items-center gap-4 rounded-xl border border-slate-200 px-4 py-3" data-testid={`v6-rung-${i}`}>
                    <span className="font-mono text-xs text-slate-400">#{i + 1}</span>
                    <span className="font-heading font-semibold text-slate-900">{lakhs(r.plan.chit_value)}</span>
                    <span className="text-sm text-slate-500">{r.months} months</span>
                    <span className="ml-auto font-mono text-sm text-slate-900">₹{formatINR(r.plan.chit_value / r.months)}/mo</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-xl bg-[var(--acc-soft)] p-5">
                <Readout testid="v6-ladder-readout" items={[{ k: "Groups", v: String(ladder.rungs.length) }, { k: "Allocated", v: `₹${formatINR(total - ladder.left)}` }, { k: "Combined monthly", v: `₹${formatINR(ladder.rungs.reduce((s, r) => s + r.plan.chit_value / r.months, 0))}` }, { k: "Unallocated", v: `₹${formatINR(ladder.left)}` }]} />
                <OnlyAt testid="v6-only-at">Across this ladder: dividends on completed groups ran at 150–170% of comparable chit companies'.*</OnlyAt>
                <div className="mt-4 max-w-md"><DividendProof p={p} leadHref={LEAD} track={tid6(c, 5, "planner")} compact /></div>
                <UsePlan c={c} ch={5} testid="v6-use-plan" label="Review this ladder with an advisor" onUse={() => { if (ladder.rungs[0] && !investMismatch) pickPlan(ladder.rungs[0].plan.chit_value); setPrefill({ ladder_total: `₹${formatINR(total)}` }); }} />
              </div>
              <p className="mt-3 text-xs text-slate-500">Illustrative split; groups above ₹25 Lakh are combined by an advisor. Monthly figures are before dividends.</p>
            </ToolCard>
          </>
        )}
        {p === "explore" && (
          <>
            <AuctionSim />
            <div className="mt-6 max-w-md"><DividendProof p={p} leadHref={LEAD} track={tid6(c, 5, "planner")} compact /></div>
          </>
        )}
      </Chapter>

      <Chapter n={6} id="v6-ch6" kicker="Plans for you" title={investMismatch ? "Savings plans at your amount." : c.band === "unsure" ? "Every plan, side by side." : `Plans in the ${bandLabel(c.band)} range.`}>
        <div className={`grid gap-4 ${bandPlans.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"} ${bandPlans.length > 4 ? "lg:grid-cols-4" : ""}`} data-testid="v6-plans">
          {bandPlans.map((pl) => {
            const on = pickedPlan === pl.chit_value;
            return (
              <div key={pl.slug} className={`rounded-2xl border bg-white p-6 transition-[border-color,box-shadow] duration-200 ${on ? "border-[var(--acc)] shadow-md" : "border-slate-200"}`} data-testid={`v6-plan-${pl.slug}`}>
                <div className="flex items-center justify-between">
                  <p className="font-heading text-2xl font-semibold text-slate-900">{lakhs(pl.chit_value)}</p>
                  {on && <span className="rounded-md bg-[var(--acc-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--acc)]" data-testid={`v6-plan-${pl.slug}-selected`}>Your plan</span>}
                </div>
                <dl className="mt-4 space-y-1.5 text-sm">
                  <div className="flex justify-between"><dt className="text-slate-500">Monthly</dt><dd className="font-mono text-slate-900">{emiText(pl)}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-500">Tenure</dt><dd className="font-mono text-slate-900">{pl.durations.join(" / ")} mo</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-500">e-Auctions</dt><dd className="font-mono text-slate-900">{pl.auctions_per_month} / month</dd></div>
                </dl>
                <a href={LEAD} data-testid={`v6-plan-${pl.slug}-cta`} onClick={() => { pickPlan(pl.chit_value); trackCta(tid6(c, 6, `plan-${pl.slug}`), { planSlug: pl.slug }); }} className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-800 transition-[border-color,background-color,color] duration-200 hover:border-[var(--acc)] hover:bg-[var(--acc)] hover:text-white">
                  Choose this plan
                </a>
              </div>
            );
          })}
        </div>
        {c.band === "15-30" && !investMismatch && (
          <div className="mt-6 flex max-w-2xl items-start gap-3 rounded-xl border border-slate-200 bg-[var(--acc-soft)] p-4 text-sm text-slate-700" data-testid="v6-combined-note">
            <Layers size={18} className="mt-0.5 shrink-0 text-[var(--acc)]" />
            Looking above ₹25 Lakh? Our largest single plan is ₹25 Lakh, so bigger amounts are set up by an advisor as two groups combined — for example, ₹30 Lakh = ₹15 Lakh + ₹15 Lakh.
          </div>
        )}
      </Chapter>

      <Chapter n={7} id="v6-ch7" kicker="Your costs" title={`What a ${lakhs(costValue)} plan costs you.`} lead="We charge 5%. The law lets us charge 7%." tint>
        <ChargesDisclosure
          testid="v6-charges"
          highlights={[
            { k: "Commission", v: `₹${formatINR(costValue * 0.05)}`, note: commissionLine(costValue) },
            { k: "Processing fee", v: `₹${formatINR((costValue / 100000) * 200)} + GST`, note: `On a ${lakhs(costValue)} plan, charged once.` },
            p === "borrow"
              ? { k: "Late instalment", v: "18% p.a.", note: "After winning, dividends are withheld if payments are delayed beyond 3 months." }
              : { k: "Stopping early", v: "5% + GST + dividends", note: "Pick an amount you can hold for the full tenure." },
          ]}
        />
        <div className="mt-6 max-w-2xl rounded-xl border-l-4 border-[var(--acc)] bg-white p-4 shadow-sm" data-testid="v6-work-fact">
          <p className="text-sm font-semibold text-slate-900">{WORK_FACT[c.work].title}</p>
          <p className="mt-1 text-sm text-slate-600">{WORK_FACT[c.work].body}</p>
        </div>
      </Chapter>

      <Chapter n={8} id="v6-ch8" kicker={LABELS[p][7]} title="You deal with a registered company — not an agent with a notebook.">
        <Cards
          testid="v6-trust"
          items={[
            { t: "The company is your counterparty", b: "Groups run by IBG eChit Funds Pvt. Ltd. and Bilva Chits on the myPaisaa platform by Finsave Technologies Pvt. Ltd." },
            { t: "Deposited with the Registrar", b: "The full chit value is pledged with the Registrar of Chits, Telangana before a group starts. Registered under the Chit Funds Act, 1982." },
            { t: "Open auctions, no private promises", b: "Every bid is visible in the app. Nobody can promise you a particular auction." },
          ]}
        />
        <a href={TCHITS_URL} target="_blank" rel="noopener noreferrer" data-testid="v6-tchits" onClick={() => trackCta(tid6(c, 8, "tchits"))} className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-700">
          <ShieldCheck size={16} /> Check our groups on T-Chits
        </a>
      </Chapter>

      <Chapter n={9} id="v6-ch9" kicker="Your questions" title={FAQ_TITLE(c)} tint>
        <FaqList testid="v6-faq" items={faqFor(p, c.work)} />
      </Chapter>

      <Chapter n={10} id="v6-ch10" kicker="Your next step" title={c.name ? `${c.name}, here's your next step.` : "Here's your next step."} lead="Your details are already filled in — just add your number and city.">
        <StoryCtas p={p} ch={10} primary={primary} installLabel={p === "save" ? "Start your habit" : "Install the app"} leadHref={LEAD} leadLabel={leadLabel} waHref={wa} idFor={idFor} />
      </Chapter>
      <WhyRecap p={p} work={c.work} leadHref={LEAD} track={`v6-${p}-${c.work}-${c.band}-why`} />
      <LeadForm3
        sectionId="v6-lead"
        source="v6"
        profile={p}
        initialGoal={GOAL_OF[p]}
        initialName={c.name}
        caseInfo={{ profession: c.work, value_band: c.band }}
        title={c.name ? `${c.name}, talk to an advisor about your case.` : "Talk to an advisor about your case."}
        body={`${workLabel(c.work)} · ${PURPOSE_LABEL[p]} · ${bandLabel(c.band)}. An advisor calls you back with the plan that fits and every charge upfront.`}
        extras={extras}
        extraInit={prefill}
      />
    </>
  );
}

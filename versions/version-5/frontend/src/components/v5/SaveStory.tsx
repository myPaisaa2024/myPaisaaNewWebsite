import { useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { LeadForm3 } from "@/components/v3/Bottom3";
import { TCHITS_URL } from "@/lib/contact";
import { formatINR } from "@/lib/format";
import { trackCta } from "@/lib/track";
import { useBriefPlans, useV3 } from "@/lib/v3";
import { OnlyAt, WhyChapter, WhyRecap, WhyStrip, commissionLine } from "./why";
import { Aside, Cards, ChargesDisclosure, Chapter, Character, Chips, FaqList, Hook, Readout, StoryCtas, ToolCard, tid, type ChapterMeta, type CharacterInfo } from "./kit";

export const SAVE_CHAPTERS: ChapterMeta[] = [
  { id: "save-ch1", label: "The month ends early" },
  { id: "save-ch2", label: "Why saving slips" },
  { id: "save-ch3", label: "Why myPaisaa" },
  { id: "save-ch4", label: "The habit, built in" },
  { id: "save-ch5", label: "Plan your goal" },
  { id: "save-ch6", label: "If life changes" },
  { id: "save-ch7", label: "Is it safe?" },
  { id: "save-ch8", label: "What you pay" },
  { id: "save-ch9", label: "Savers ask" },
  { id: "save-ch10", label: "Start your habit" },
];

const LAKSHMI: CharacterInfo = {
  name: "Lakshmi, 38",
  initials: "LK",
  role: "Government school teacher · Vijayawada",
  situation: "Wants about ₹3 Lakh ready when her daughter starts college. Every month, something quietly eats into what she meant to save.",
};

const GOALS = ["Education", "Wedding", "Home", "Other"] as const;
const THIS_YEAR = new Date().getFullYear();
const YEARS = [2, 3, 4, 5].map((n) => THIS_YEAR + n);
const LEAD = "#save-lead";

export function SaveStory() {
  const p = "save" as const;
  const plans = useBriefPlans();
  const { pickPlan } = useV3();
  const [goal, setGoal] = useState<(typeof GOALS)[number]>("Education");
  const [amount, setAmount] = useState(300000);
  const [year, setYear] = useState(YEARS[1]);
  const [prefill, setPrefill] = useState<Record<string, string> | undefined>();

  const result = useMemo(() => {
    const list = plans.data ?? [];
    const plan = list.find((x) => x.chit_value >= amount) ?? list[list.length - 1];
    if (!plan) return null;
    const monthsAvail = Math.max(1, (year - THIS_YEAR) * 12);
    const fits = plan.durations.filter((d) => d <= monthsAvail);
    const months = fits.length ? Math.max(...fits) : Math.min(...plan.durations);
    const done = new Date();
    done.setMonth(done.getMonth() + months);
    return { plan, months, monthly: plan.chit_value / months, late: months > monthsAvail, doneLabel: done.toLocaleDateString("en-IN", { month: "short", year: "numeric" }) };
  }, [plans.data, amount, year]);

  return (
    <>
      <Hook
        n={1}
        id="save-ch1"
        kicker="Lakshmi's habit"
        h1a="The month ends"
        h1b="before the money does."
        sub="A registered chit turns one fixed monthly amount into a habit you can't skip — and pays you a dividend in the months you don't bid. Up to 12% p.a., with zero market risk."
        ctas={<StoryCtas p={p} ch={1} primary="install" installLabel="Start your habit" leadHref="#save-ch5" leadLabel="Plan my goal" />}
        strip={<WhyStrip p={p} />}
        aside={<Character c={LAKSHMI} testid="v5-save-character" />}
      />

      <Chapter n={2} id="save-ch2" kicker="The problem" title="Saving isn't hard because you're careless. It's hard because nothing holds you to it." tint>
        <Cards
          testid="v5-save-problem"
          items={[
            { tag: "01", t: "Money slips away", b: "Whatever is left at the end of the month is what gets saved — usually not much." },
            { tag: "02", t: "A bank RD feels slow", b: "Safe, but a fixed rate and a penalty if you need the money before maturity." },
            { tag: "03", t: "Informal chits feel risky", b: "A neighbour's notebook, no regulator, and no receipt if something goes wrong." },
          ]}
        />
        <Aside c={LAKSHMI} testid="v5-save-aside-2">Lakshmi has tried an RD twice. Both times she broke it early for a family expense.</Aside>
      </Chapter>

      <WhyChapter n={3} id="save-ch3" p={p} leadHref={LEAD} track="v5-save-why" />

      <Chapter n={4} id="save-ch4" kicker="How a chit holds you to it" title="One instalment a month. Thirty months. A dividend whenever you don't bid." lead="Here's a ₹3 Lakh plan: ₹10,000 a month for 30 months. Each month the group holds an open e-auction; the winning bidder's discount is shared out as dividends, which reduce what everyone else pays.">
        <ToolCard testid="v5-save-timeline">
          <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="group relative">
                <div className="aspect-square rounded-md bg-[var(--acc)] transition-transform duration-200 group-hover:scale-110" style={{ opacity: 0.35 + (i / 30) * 0.65 }} />
                <span className="absolute inset-0 grid place-items-center font-mono text-[9px] text-white">{i + 1}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <Readout testid="v5-save-timeline-readout" items={[{ k: "Monthly", v: "₹10,000" }, { k: "Months", v: "30" }, { k: "Chit value", v: "₹3,00,000" }, { k: "e-Auctions", v: "2 a month" }]} />
          </div>
          <p className="mt-4 text-xs text-slate-500">Illustrative. Dividends vary with each auction; “up to 12% p.a.” is not a fixed or guaranteed return.</p>
        </ToolCard>
        <Aside c={LAKSHMI} testid="v5-save-aside-3">Lakshmi joins the ₹3 Lakh plan. The instalment leaves her account on the 5th, before anything else can.</Aside>
      </Chapter>

      <Chapter n={5} id="save-ch5" kicker="Goal planner" title="Name the goal. See the plan." lead="Pick what you're saving for, roughly how much, and when you need it. No sign-up needed." tint>
        <ToolCard testid="v5-save-planner">
          <div className="grid gap-6 lg:grid-cols-3">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">Saving for</p>
              <Chips testid="v5-save-goal" value={goal} onChange={setGoal} options={GOALS.map((g) => ({ label: g, value: g }))} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">About how much</p>
              <Chips testid="v5-save-amount" value={amount} onChange={setAmount} options={[100000, 200000, 300000, 500000, 1000000].map((v) => ({ label: `₹${v / 100000}L`, value: v }))} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">Needed by</p>
              <Chips testid="v5-save-year" value={year} onChange={setYear} options={YEARS.map((y) => ({ label: String(y), value: y }))} />
            </div>
          </div>
          {result && (
            <div className="mt-8 rounded-xl bg-[var(--acc-soft)] p-5" data-testid="v5-save-planner-result">
              <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500">Suggested for {goal.toLowerCase()}</p>
              <p className="mt-1 font-heading text-2xl font-semibold text-slate-900" data-testid="v5-save-planner-plan">₹{result.plan.chit_value / 100000} Lakh chit · {result.months} months</p>
              <div className="mt-4">
                <Readout testid="v5-save-planner-readout" items={[{ k: "Monthly", v: `₹${formatINR(result.monthly)}` }, { k: "Goal reached", v: result.doneLabel }, { k: "e-Auctions", v: `${result.plan.auctions_per_month} a month` }, { k: "Dividends", v: "When you don't bid" }]} />
              </div>
              <OnlyAt testid="v5-save-only-at">{commissionLine(result.plan.chit_value)}</OnlyAt>
              {result.late && <p className="mt-3 text-sm text-slate-600" data-testid="v5-save-planner-late">This plan runs a little past {year}. You can bid to take the money sooner — winning a particular auction is never promised.</p>}
              <a
                href={LEAD}
                data-testid={tid(p, 5, "use-plan")}
                onClick={() => {
                  pickPlan(result.plan.chit_value);
                  setPrefill({ goal_type: goal, target_year: String(year) });
                  trackCta(tid(p, 5, "use-plan"), { planSlug: result.plan.slug });
                }}
                className="mt-5 inline-flex h-11 items-center rounded-xl bg-[var(--acc)] px-5 text-sm font-semibold text-white transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.97]"
              >
                Use this plan
              </a>
            </div>
          )}
        </ToolCard>
      </Chapter>

      <Chapter n={6} id="save-ch6" kicker="If life changes" title="A savings plan that bends when life doesn't go to plan.">
        <Cards
          testid="v5-save-change"
          cols={2}
          items={[
            { t: "Need the money early?", b: "Bid in the next open e-auction. If your bid wins, the pot is paid within 24 hours of completed documentation. Winning is never promised — every eligible member can bid." },
            { t: "Stay the course", b: "If nothing comes up, you keep collecting dividends and receive the chit value at the end of the tenure." },
          ]}
        />
        <Aside c={LAKSHMI} testid="v5-save-aside-5">If the roof needs repairs in month 9, Lakshmi can bid that month instead of breaking her savings.</Aside>
      </Chapter>

      <Chapter n={7} id="save-ch7" kicker="Is it safe?" title="Your savings never touch the stock market." tint>
        <Cards
          testid="v5-save-safety"
          items={[
            { t: "Zero market risk", b: "A chit's value isn't linked to shares, bonds or interest-rate swings." },
            { t: "Deposited with the Registrar", b: "The full chit value is pledged as a security deposit with the Registrar of Chits before a group starts." },
            { t: "Listed on T-Chits", b: "Every group is on the Government of Telangana's T-Chits portal, run by registered companies IBG eChit Funds and Bilva Chits." },
          ]}
        />
        <a href={TCHITS_URL} target="_blank" rel="noopener noreferrer" data-testid={tid(p, 7, "tchits")} onClick={() => trackCta(tid(p, 7, "tchits"))} className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-700">
          <ShieldCheck size={16} /> Check our groups on T-Chits
        </a>
      </Chapter>

      <Chapter n={8} id="save-ch8" kicker="What a saver pays" title="Know the cost before your first instalment." lead="We charge 5%. The law lets us charge 7%.">
        <ChargesDisclosure
          testid="v5-save-charges"
          highlights={[
            { k: "Commission", v: "5% of chit value", note: commissionLine(300000, false) },
            { k: "Processing fee", v: "₹200 / lakh + GST", note: "₹600 + GST on a ₹3 Lakh plan, once." },
            { k: "Stopping early", v: "5% + GST + dividends", note: "Pick a monthly amount you can hold for the full tenure." },
          ]}
        />
      </Chapter>

      <Chapter n={9} id="save-ch9" kicker="Savers ask" title="Questions savers ask us most." tint>
        <FaqList
          testid="v5-save-faq"
          items={[
            { q: "How is this different from a bank RD?", a: "An RD pays a fixed bank rate. A chit pays dividends from each auction — up to 12% p.a. — and lets you take the lump sum early by bidding, instead of breaking a deposit." },
            { q: "Will I definitely earn 12%?", a: "No. Dividends depend on how each auction goes. “Up to 12% p.a.” describes the upper range, not a fixed return." },
            { q: "What if I miss an instalment?", a: "Before you win, a late payment costs ₹100 and interest of 18% p.a. on the delayed amount. Reminders arrive before every due date." },
            { q: "Is the dividend taxable?", a: "Yes — dividends are taxed as income from other sources." },
            { q: "Can I trust an app with my savings?", a: "Your records sit with a registered chit company, on Microsoft Azure and AWS infrastructure — and every group can be checked on T-Chits." },
          ]}
        />
      </Chapter>

      <Chapter n={10} id="save-ch10" kicker="Start your habit" title="Your first instalment is the hardest one. After that, the habit runs itself." lead="Install the app and join in 2 minutes with eKYC — or tell us your goal and an advisor will call.">
        <StoryCtas p={p} ch={10} primary="install" installLabel="Start your habit" leadHref={LEAD} leadLabel="Request a callback" />
      </Chapter>
      <WhyRecap p={p} leadHref={LEAD} track="v5-save-why" />
      <LeadForm3
        sectionId="save-lead"
        source="v5"
        profile="save"
        initialGoal="save"
        title="Plan your savings goal with an advisor."
        body="Tell us what you're saving for and by when. We'll match a plan and tenure, and show every charge upfront."
        extras={[
          { key: "goal_type", label: "Saving for", options: [...GOALS] },
          { key: "target_year", label: "Needed by", options: YEARS.map(String) },
        ]}
        extraInit={prefill}
      />
    </>
  );
}

import { useMemo, useState } from "react";
import { LeadForm3 } from "@/components/v3/Bottom3";
import { formatINR } from "@/lib/format";
import { trackCta } from "@/lib/track";
import { useBriefPlans, useV3 } from "@/lib/v3";
import { OnlyAt, WhyChapter, WhyRecap, WhyStrip, commissionLine } from "./why";
import { Aside, Cards, ChargesDisclosure, Chapter, Character, Chips, CompareTable, FaqList, Hook, Readout, StoryCtas, Timeline, ToolCard, tid, type ChapterMeta, type CharacterInfo } from "./kit";

export const BORROW_CHAPTERS: ChapterMeta[] = [
  { id: "borrow-ch1", label: "Collateral vs KYC" },
  { id: "borrow-ch2", label: "Why loans stall" },
  { id: "borrow-ch3", label: "Why myPaisaa" },
  { id: "borrow-ch4", label: "Your credit line" },
  { id: "borrow-ch5", label: "Plan your funds" },
  { id: "borrow-ch6", label: "The true cost" },
  { id: "borrow-ch7", label: "After you win" },
  { id: "borrow-ch8", label: "Who's behind it" },
  { id: "borrow-ch9", label: "Borrowers ask" },
  { id: "borrow-ch10", label: "Check your amount" },
];

const RAMESH: CharacterInfo = {
  name: "Ramesh, 45",
  initials: "RM",
  role: "Kirana & general store owner · Warangal",
  situation: "Needs about ₹5 Lakh of stock before festival season. The bank wants collateral he doesn't have; app loans quote rates he can't afford.",
};

const AMOUNTS = [100000, 200000, 300000, 500000, 1000000, 1500000, 2500000];
const URGENCY = ["This month", "In 1–3 months", "Later this year"] as const;
const LEAD = "#borrow-lead";

export function BorrowStory() {
  const p = "borrow" as const;
  const plans = useBriefPlans();
  const { pickPlan } = useV3();
  const [amount, setAmount] = useState(500000);
  const [urgency, setUrgency] = useState<(typeof URGENCY)[number]>("In 1–3 months");
  const [prefill, setPrefill] = useState<Record<string, string> | undefined>();

  const plan = useMemo(() => {
    const list = plans.data ?? [];
    return list.find((x) => x.chit_value >= amount) ?? list[list.length - 1];
  }, [plans.data, amount]);

  const emi = plan ? (plan.emi_min === plan.emi_max ? `₹${formatINR(plan.emi_min)}` : `₹${formatINR(plan.emi_min)}–${formatINR(plan.emi_max)}`) : "";

  return (
    <>
      <Hook
        n={1}
        id="borrow-ch1"
        kicker="Ramesh's stock run"
        h1a="The bank asked for collateral."
        h1b="The chit asks for a KYC."
        sub="Join a registered chit, bid in an open e-auction when you need the money, and receive it within 24 hours of completed documentation. No collateral. Typical cost around 14–22% a year."
        ctas={<StoryCtas p={p} ch={1} primary="lead" leadHref="#borrow-ch5" leadLabel="Check how much you can lift" />}
        strip={<WhyStrip p={p} />}
        aside={<Character c={RAMESH} testid="v5-borrow-character" />}
      />

      <Chapter n={2} id="borrow-ch2" kicker="The problem" title="Needing money isn't the problem. The way you're asked to get it is." tint>
        <Cards
          testid="v5-borrow-problem"
          items={[
            { tag: "01", t: "Rejected on a thin file", b: "A small business with steady cash flow can still fail a bank's credit checklist." },
            { tag: "02", t: "Paperwork & branch visits", b: "Weeks of documents, guarantors and follow-ups — while the season passes." },
            { tag: "03", t: "Expensive app loans", b: "Fast money, but at rates that eat the margin you were borrowing for." },
          ]}
        />
        <Aside c={RAMESH} testid="v5-borrow-aside-2">Ramesh's last loan application took five weeks and ended in a “no”.</Aside>
      </Chapter>

      <WhyChapter n={3} id="borrow-ch3" p={p} leadHref={LEAD} track="v5-borrow-why" />

      <Chapter n={4} id="borrow-ch4" kicker="The chit as your credit line" title="Join once. Bid when you need it. Get paid fast.">
        <Timeline
          testid="v5-borrow-timeline"
          steps={[
            { tag: "Day 1", t: "Join in 2 minutes", b: "eKYC and e-sign in the app. Pick a plan whose pot covers your need." },
            { tag: "Each auction", t: "Bid in the open", b: "Up to 4 e-auctions a month on eligible plans. Every eligible member can bid." },
            { tag: "You win", t: "Pot is yours", b: "The lowest amount accepted wins. The discount is shared with the group." },
            { tag: "Documents", t: "Finish verification", b: "Surety and documents are checked in the app." },
            { tag: "≤ 24 hours", t: "Money in your bank", b: "Within 24 hours of completed documentation." },
          ]}
        />
        <Aside c={RAMESH} testid="v5-borrow-aside-3">Ramesh joins a ₹5 Lakh group in July so he can bid in the months before festival stock is due.</Aside>
      </Chapter>

      <Chapter n={5} id="borrow-ch5" kicker="Funds planner" title="How much do you need, and how soon?" tint>
        <ToolCard testid="v5-borrow-planner">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">I need about</p>
              <Chips testid="v5-borrow-amount" value={amount} onChange={setAmount} options={AMOUNTS.map((v) => ({ label: `₹${v / 100000}L`, value: v }))} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">I need it</p>
              <Chips testid="v5-borrow-urgency" value={urgency} onChange={setUrgency} options={URGENCY.map((u) => ({ label: u, value: u }))} />
            </div>
          </div>
          {plan && (
            <div className="mt-8 rounded-xl bg-[var(--acc-soft)] p-5" data-testid="v5-borrow-planner-result">
              <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500">Matching plan</p>
              <p className="mt-1 font-heading text-2xl font-semibold text-slate-900" data-testid="v5-borrow-planner-plan">₹{plan.chit_value / 100000} Lakh chit</p>
              <div className="mt-4">
                <Readout testid="v5-borrow-planner-readout" items={[{ k: "e-Auctions", v: `${plan.auctions_per_month} a month` }, { k: "Monthly", v: emi }, { k: "Tenure", v: `${plan.durations.join(" / ")} months` }, { k: "First bid", v: "First auction" }]} />
              </div>
              <OnlyAt testid="v5-borrow-only-at">This plan has {plan.auctions_per_month} auctions a month: up to {plan.auctions_per_month} chances to lift the pot.</OnlyAt>
              <p className="mt-3 text-sm text-slate-600" data-testid="v5-borrow-planner-note">
                {urgency === "This month"
                  ? plan.auctions_per_month === 4
                    ? "This plan has 4 auctions a month — the most chances to bid soon."
                    : "This plan holds 2 auctions a month. You can bid from the first one, but winning is never promised — an advisor can suggest the best timing."
                  : "Joining ahead of your need gives you more auctions to bid in before the money is due."}
              </p>
              <a
                href={LEAD}
                data-testid={tid(p, 5, "use-plan")}
                onClick={() => {
                  pickPlan(plan.chit_value);
                  setPrefill({ amount_needed: `₹${amount / 100000} Lakh`, urgency });
                  trackCta(tid(p, 5, "use-plan"), { planSlug: plan.slug });
                }}
                className="mt-5 inline-flex h-11 items-center rounded-xl bg-[var(--acc)] px-5 text-sm font-semibold text-white transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.97]"
              >
                Check this amount with an advisor
              </a>
            </div>
          )}
        </ToolCard>
      </Chapter>

      <Chapter n={6} id="borrow-ch6" kicker="The true cost" title="What borrowing through a chit really costs." lead="Typically about 14–22% a year — against 14–30% for many loans. Two things move it: how deep your bid is, and how early in the tenure you lift the pot.">
        <CompareTable
          testid="v5-borrow-compare"
          cols={["myPaisaa chit", "Bank loan", "App / personal loan"]}
          rows={[
            { k: "Collateral", v: ["None", "Often required", "None"] },
            { k: "Paperwork", v: ["eKYC & e-sign", "Heavy, branch visits", "Moderate"] },
            { k: "Typical cost", v: ["~14–22% p.a.", "14–30% p.a.", "Often higher"] },
            { k: "Time to money", v: ["24 hrs after documentation", "Days to weeks", "Hours to days"] },
          ]}
        />
        <ToolCard testid="v5-borrow-example">
          <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500">Worked example · illustrative round numbers</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-4">
            {[
              { k: "Pot (₹5 Lakh group)", v: "₹5,00,000" },
              { k: "Winning bid takes home", v: "₹4,30,000" },
              { k: "Discount", v: "₹70,000" },
              { k: "Shared as dividends", v: "₹45,000" },
            ].map((x) => (
              <div key={x.k} className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">{x.k}</p>
                <p className="font-mono text-lg font-semibold text-slate-900">{x.v}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-600">Of the ₹70,000 discount, 5% of the chit value (₹25,000) is the company's commission; the remaining ₹45,000 is shared across the group — including you — and reduces everyone's next instalment.</p>
        </ToolCard>
      </Chapter>

      <Chapter n={7} id="borrow-ch7" kicker="After you win" title="What happens once the money is in your account." tint>
        <Cards
          testid="v5-borrow-after"
          items={[
            { t: "Instalments continue", b: "You keep paying monthly until the tenure ends. Dividends from later auctions still reduce what you pay." },
            { t: "Surety that shrinks", b: "A guarantor protects the group. With a good risk profile and clean payment history, the requirement scales down — often to nothing." },
            { t: "If a payment is late", b: "After winning, dividends are withheld if payments are delayed beyond 3 months, and delayed instalments carry 18% p.a." },
          ]}
        />
        <div className="mt-8">
          <ChargesDisclosure
            testid="v5-borrow-charges"
            highlights={[
              { k: "Commission", v: "5% of chit value", note: commissionLine(500000, false) },
              { k: "Processing fee", v: "₹200 / lakh + GST", note: "₹1,000 + GST on a ₹5 Lakh plan, once." },
              { k: "Late instalment", v: "18% p.a.", note: "Plus ₹500 for a bounced cheque or ECS." },
            ]}
          />
        </div>
      </Chapter>

      <Chapter n={8} id="borrow-ch8" kicker="Who's behind it" title="You deal with a registered company — not an agent with a notebook.">
        <Cards
          testid="v5-borrow-trust"
          items={[
            { t: "The company is your counterparty", b: "Groups are run by IBG eChit Funds Pvt. Ltd. and Bilva Chits on the myPaisaa platform by Finsave Technologies Pvt. Ltd." },
            { t: "Open auctions, no private promises", b: "Nobody can promise you a particular auction — and nobody should. Every bid is visible in the app." },
            { t: "Registered and listed", b: "Registered under the Chit Funds Act, 1982, overseen by the Registrar of Chits, Telangana, and listed on T-Chits." },
          ]}
        />
      </Chapter>

      <Chapter n={9} id="borrow-ch9" kicker="Borrowers ask" title="Questions borrowers ask us most." tint>
        <FaqList
          testid="v5-borrow-faq"
          items={[
            { q: "Can you guarantee I'll win the next auction?", a: "No. Promising an auction outcome would be unethical and illegal. Plans with 4 auctions a month give you more chances to bid." },
            { q: "My credit score is low. Can I still join?", a: "Underwriting looks at your full profile, not just a score. A guarantor may be needed at first." },
            { q: "Can I use it for my business?", a: "Yes. Business owners can also claim chit-related losses as business losses for tax." },
            { q: "What if other members default?", a: "The company covers shortfalls, screens every member, and has a dedicated legal and recovery team." },
            { q: "How fast is the payout really?", a: "Within 24 hours of completed documentation — the clock starts when your documents are complete, not when you win." },
          ]}
        />
      </Chapter>

      <Chapter n={10} id="borrow-ch10" kicker="Check your amount" title="Find out how much you can lift — and when." lead="Tell us the amount and timing. An advisor explains the plan, the auction and the real cost before you commit.">
        <StoryCtas p={p} ch={10} primary="lead" leadHref={LEAD} leadLabel="Check how much you can lift" />
      </Chapter>
      <WhyRecap p={p} leadHref={LEAD} track="v5-borrow-why" />
      <LeadForm3
        sectionId="borrow-lead"
        source="v5"
        profile="borrow"
        initialGoal="borrow"
        title="Check how much you can lift."
        body="Share the amount and timing. We'll explain the right plan, auction frequency and true cost — no obligation."
        extras={[
          { key: "amount_needed", label: "Amount needed", options: AMOUNTS.map((v) => `₹${v / 100000} Lakh`) },
          { key: "urgency", label: "How soon", options: [...URGENCY] },
          { key: "use", label: "For", options: ["Business", "Personal"] },
        ]}
        extraInit={prefill}
      />
    </>
  );
}

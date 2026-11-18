import { useEffect, useState } from "react";
import { ArrowRight, ExternalLink, FileCheck2, Gavel, IndianRupee, Search, ShieldCheck, Users } from "lucide-react";
import { LeadForm3 } from "@/components/v3/Bottom3";
import { PROFILES } from "@/components/v4/profiles";
import { TCHITS_URL } from "@/lib/contact";
import { formatINR } from "@/lib/format";
import { trackCta } from "@/lib/track";
import { v3en } from "@/i18n/v3";
import type { Profile } from "@/lib/v3";
import { OnlyAt, WhyChapter, WhyRecap, WhyStrip, commissionLine } from "./why";
import { Aside, Cards, Chapter, Character, ChargesDisclosure, CompareTable, FaqList, Hook, StoryCtas, ToolCard, tid, type ChapterMeta, type CharacterInfo } from "./kit";

export const EXPLORE_CHAPTERS: ChapterMeta[] = [
  { id: "explore-ch1", label: "Grandmother's chit" },
  { id: "explore-ch2", label: "Myth vs fact" },
  { id: "explore-ch3", label: "Why myPaisaa" },
  { id: "explore-ch4", label: "60-second explainer" },
  { id: "explore-ch5", label: "Try an auction" },
  { id: "explore-ch6", label: "Then vs now" },
  { id: "explore-ch7", label: "Check us yourself" },
  { id: "explore-ch8", label: "Which one are you?" },
  { id: "explore-ch9", label: "Fair questions" },
  { id: "explore-ch10", label: "Ask us anything" },
];

const ANITA: CharacterInfo = {
  name: "Anita, 28",
  initials: "AN",
  role: "Software tester · Hyderabad",
  situation: "Grew up watching her mother run a neighbourhood chit from a notebook. Curious about chits — and a little wary of them.",
};

const POT = 100000;
const MEMBERS = 25;
const COMMISSION = POT * 0.05;
const OTHERS = [{ who: "Member 14", bid: 90000 }, { who: "Member 21", bid: 93000 }];
const LEAD = "#explore-lead";

export function Explainer() {
  const steps = [
    { t: "25 members join", b: "Each commits ₹4,000 a month to a registered ₹1 Lakh chit.", i: Users },
    { t: "The pot builds", b: "Every month, 25 × ₹4,000 makes a ₹1,00,000 pot.", i: IndianRupee },
    { t: "An open auction", b: "Members who want the money bid the amount they'll accept. Lowest accepted wins.", i: Gavel },
    { t: "Dividends shared", b: "The discount, minus commission, is split across all members.", i: ShieldCheck },
  ];
  const [on, setOn] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setOn((x) => (x + 1) % steps.length), 2600);
    return () => clearInterval(t);
  }, [steps.length]);
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
      <div className="relative mx-auto size-64" data-testid="v5-explore-ring">
        <div className="absolute inset-0 animate-[spin_40s_linear_infinite] rounded-full border border-dashed border-slate-300" />
        {Array.from({ length: MEMBERS }).map((_, i) => {
          const a = (i / MEMBERS) * Math.PI * 2;
          return <span key={i} className={`absolute size-3.5 rounded-full transition-[background-color,transform] duration-500 ${on === 2 && i === 7 ? "scale-150 bg-brand" : "bg-[var(--acc)]"}`} style={{ left: `calc(50% + ${Math.cos(a) * 118}px - 7px)`, top: `calc(50% + ${Math.sin(a) * 118}px - 7px)` }} />;
        })}
        <div className="absolute inset-0 grid place-items-center">
          <div className="rounded-2xl bg-white px-5 py-4 text-center shadow-xl">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Monthly pot</p>
            <p className="font-mono text-xl font-semibold text-slate-900">₹1,00,000</p>
          </div>
        </div>
      </div>
      <ol className="space-y-3">
        {steps.map((s, i) => (
          <li key={s.t}>
            <button type="button" onClick={() => setOn(i)} data-testid={`v5-explore-step-${i}`} className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-[border-color,background-color] duration-300 ${on === i ? "border-[var(--acc)] bg-white shadow-md" : "border-transparent bg-white/50"}`}>
              <span className={`grid size-10 shrink-0 place-items-center rounded-xl transition-colors duration-300 ${on === i ? "bg-[var(--acc)] text-white" : "bg-slate-100 text-slate-500"}`}><s.i size={18} /></span>
              <span>
                <span className="block font-heading font-semibold text-slate-900">{s.t}</span>
                <span className="mt-0.5 block text-sm text-slate-600">{s.b}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function AuctionSim() {
  const [bid, setBid] = useState(88000);
  const all = [...OTHERS, { who: "You", bid }];
  const win = all.reduce((a, b) => (b.bid < a.bid ? b : a));
  const discount = POT - win.bid;
  const pool = Math.max(0, discount - COMMISSION);
  const each = pool / MEMBERS;
  return (
    <ToolCard testid="v5-explore-sim">
      <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500">Illustrative mini-auction · ₹1 Lakh pot · 25 members</p>
      <label htmlFor="v5-sim-bid" className="mt-5 flex items-baseline justify-between text-sm font-medium text-slate-700">
        The least you'd accept from the pot <span className="font-mono text-2xl font-semibold text-slate-900" data-testid="v5-explore-sim-bid">₹{formatINR(bid)}</span>
      </label>
      <input id="v5-sim-bid" type="range" min={75000} max={97000} step={1000} value={bid} onChange={(e) => setBid(Number(e.target.value))} data-testid="v5-explore-sim-slider" className="mt-3 w-full accent-[var(--acc)]" />
      <div className="mt-6 grid gap-2 sm:grid-cols-3">
        {all.map((b) => (
          <div key={b.who} className={`rounded-xl border p-4 transition-[border-color,background-color] duration-300 ${b === win ? "border-[var(--acc)] bg-[var(--acc-soft)]" : "border-slate-200"}`}>
            <p className="text-xs text-slate-500">{b.who}</p>
            <p className="font-mono text-lg font-semibold text-slate-900">₹{formatINR(b.bid)}</p>
            {b === win && <p className="mt-1 text-xs font-semibold text-[var(--acc)]">Wins the pot</p>}
          </div>
        ))}
      </div>
      <dl className="mt-6 grid gap-4 rounded-xl bg-slate-50 p-5 sm:grid-cols-4" data-testid="v5-explore-sim-result">
        <div><dt className="text-xs text-slate-500">Winner</dt><dd className="font-semibold text-slate-900" data-testid="v5-explore-sim-winner">{win.who}</dd></div>
        <div><dt className="text-xs text-slate-500">Discount</dt><dd className="font-mono font-semibold text-slate-900">₹{formatINR(discount)}</dd></div>
        <div><dt className="text-xs text-slate-500">Commission (5%)</dt><dd className="font-mono font-semibold text-slate-900">₹{formatINR(COMMISSION)}</dd></div>
        <div><dt className="text-xs text-slate-500">Dividend per member</dt><dd className="font-mono font-semibold text-[var(--acc)]" data-testid="v5-explore-sim-dividend">₹{formatINR(each)}</dd></div>
      </dl>
      <OnlyAt testid="v5-explore-only-at">Every bid you just saw is visible to all members in the app.</OnlyAt>
      <p className="mt-3 text-xs text-slate-500">Round illustrative numbers. Real auctions have more bidders; winning is never promised.</p>
    </ToolCard>
  );
}

export function ExploreStory({ onPick }: { onPick: (p: Profile) => void }) {
  const p = "explore" as const;
  return (
    <>
      <Hook
        n={1}
        id="explore-ch1"
        kicker="Anita's first chit"
        h1a="Your grandmother's chit fund,"
        h1b="with a regulator and a receipt."
        sub="A chit is a group that saves together every month and takes turns lifting the pot through an auction. myPaisaa runs it fully digitally — registered under the Chit Funds Act, 1982."
        ctas={<StoryCtas p={p} ch={1} primary="lead" leadHref="#explore-ch4" leadLabel="See how it works" />}
        strip={<WhyStrip p={p} />}
        aside={<Character c={ANITA} testid="v5-explore-character" />}
      />

      <Chapter n={2} id="explore-ch2" kicker="Myth vs fact" title="Chits got a bad name from the operators who never registered." tint>
        <div className="grid gap-4 md:grid-cols-3" data-testid="v5-explore-myths">
          {[
            { m: "“Chit funds are scams.”", f: "Unregistered ones can be. Registered chits are governed by the Chit Funds Act, 1982 and a state Registrar." },
            { m: "“The organiser can run away.”", f: "The full chit value is deposited with the Registrar before a registered group starts." },
            { m: "“There's no record.”", f: "Every instalment, bid and receipt sits in the app — and the group is listed on T-Chits." },
          ].map((x, i) => (
            <div key={x.m} className="rounded-2xl border border-slate-200 bg-white p-6" data-testid={`v5-explore-myth-${i}`}>
              <p className="font-mono text-[11px] uppercase tracking-widest text-red-500">Myth</p>
              <p className="mt-1 font-heading text-lg font-semibold text-slate-400 line-through decoration-slate-300">{x.m}</p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-emerald-600">Fact</p>
              <p className="mt-1 text-[15px] text-slate-700">{x.f}</p>
            </div>
          ))}
        </div>
        <Aside c={ANITA} testid="v5-explore-aside-2">Anita's mother's chit was never registered. Nothing went wrong — but nothing protected it either.</Aside>
      </Chapter>

      <WhyChapter n={3} id="explore-ch3" p={p} leadHref={LEAD} track="v5-explore-why" />

      <Chapter n={4} id="explore-ch4" kicker="60-second explainer" title="One product. Savers earn, borrowers get funds — fairly.">
        <Explainer />
      </Chapter>

      <Chapter n={5} id="explore-ch5" kicker="Try an auction" title="Be a bidder for a moment." lead="Slide the amount you'd accept. The lowest amount wins the pot; the discount, minus commission, is shared with everyone." tint>
        <AuctionSim />
        <Aside c={ANITA} testid="v5-explore-aside-4">Anita notices that even when she doesn't win, she earns a share of the discount.</Aside>
      </Chapter>

      <Chapter n={6} id="explore-ch6" kicker="Then vs now" title="Same idea. Very different safeguards.">
        <CompareTable
          testid="v5-explore-compare"
          cols={["myPaisaa", "Grandmother's chit"]}
          rows={[
            { k: "Registration", v: ["Chit Funds Act, 1982", "Often none"] },
            { k: "Your money", v: ["Chit value deposited with the Registrar", "Held by the organiser"] },
            { k: "Payments", v: ["UPI, instant receipts", "Cash, notebook"] },
            { k: "Auctions", v: ["Open e-auctions in the app", "In someone's living room"] },
            { k: "Records", v: ["Every month, in your pocket", "Memory and trust"] },
          ]}
        />
        <div className="mt-8">
          <ChargesDisclosure
            testid="v5-explore-charges"
            highlights={[
              { k: "Commission", v: "5% of chit value", note: commissionLine(100000, false) },
              { k: "Processing fee", v: "₹200 / lakh + GST", note: "Charged once when you join." },
              { k: "Leaving early", v: "5% + GST + dividends", note: "Charges apply if you discontinue." },
            ]}
          />
        </div>
      </Chapter>

      <Chapter n={7} id="explore-ch7" kicker="Check us yourself" title="Don't take our word for it. Check the regulator's." tint>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { t: "Open the T-Chits portal", b: "The Government of Telangana's official chit registry.", i: ExternalLink },
            { t: "Search IBG eChit Funds or Bilva Chits", b: "The two registered companies whose groups myPaisaa runs.", i: Search },
            { t: "See the groups", b: "Match them with the group numbers shown in the app.", i: FileCheck2 },
          ].map((s, i) => (
            <div key={s.t} className="rounded-2xl border border-slate-200 bg-white p-6" data-testid={`v5-explore-verify-${i}`}>
              <div className="flex items-center justify-between"><span className="font-mono text-xs text-slate-400">0{i + 1}</span><s.i size={18} className="text-[var(--acc)]" /></div>
              <p className="mt-4 font-heading font-semibold text-slate-900">{s.t}</p>
              <p className="mt-1 text-sm text-slate-600">{s.b}</p>
            </div>
          ))}
        </div>
        <Cards
          testid="v5-explore-entities"
          items={[
            { tag: "Platform", t: "Finsave Technologies Pvt. Ltd.", b: "Operates myPaisaa since August 2020." },
            { tag: "Registered chit company", t: "IBG eChit Funds Pvt. Ltd.", b: "Regulated by the Registrar of Chits, Telangana." },
            { tag: "Registered chit company", t: "Bilva Chits", b: "Regulated by the Registrar of Chits, Telangana." },
          ]}
        />
        <a href={TCHITS_URL} target="_blank" rel="noopener noreferrer" data-testid={tid(p, 7, "tchits")} onClick={() => trackCta(tid(p, 7, "tchits"))} className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-700">
          <ShieldCheck size={16} /> Open T-Chits portal
        </a>
      </Chapter>

      <Chapter n={8} id="explore-ch8" kicker="Which one are you?" title="Now that you know how it works — what would you use it for?">
        <div className="grid gap-4 sm:grid-cols-3">
          {(["save", "borrow", "invest"] as const).map((k) => {
            const c = PROFILES[k];
            return (
              <button
                key={k}
                type="button"
                data-testid={`v5-explore-fit-${k}`}
                onClick={() => {
                  trackCta(tid(p, 8, `fit-${k}`));
                  onPick(k);
                }}
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-[var(--acc)]/40 hover:shadow-lg"
              >
                <c.icon size={24} className="text-[var(--acc)]" />
                <p className="mt-4 font-heading text-lg font-semibold text-slate-900">{c.chooserTitle}</p>
                <p className="mt-1 text-sm text-slate-500">{c.chooserBody}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">Read this story <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" /></span>
              </button>
            );
          })}
        </div>
      </Chapter>

      <Chapter n={9} id="explore-ch9" kicker="Fair questions" title="The doubts you should have — answered." tint>
        <FaqList testid="v5-explore-faq" items={v3en.faq.items} />
      </Chapter>

      <Chapter n={10} id="explore-ch10" kicker="Ask us anything" title="Still deciding? That's the right instinct." lead="No sales pitch. Ask whatever's on your mind — an advisor replies, and you decide later.">
        <StoryCtas p={p} ch={10} primary="lead" leadHref={LEAD} leadLabel="Ask a question" />
      </Chapter>
      <WhyRecap p={p} leadHref={LEAD} track="v5-explore-why" />
      <LeadForm3
        sectionId="explore-lead"
        source="v5"
        profile="explore"
        initialGoal="save"
        title="Ask us anything."
        body="Type your question. An advisor calls or messages you back with a straight answer — no obligation."
        extras={[{ key: "question", label: "Your question", placeholder: "e.g. What happens if I stop paying halfway?" }]}
      />
    </>
  );
}

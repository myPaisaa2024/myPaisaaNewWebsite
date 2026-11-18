import { BadgeCheck, ExternalLink } from "lucide-react";
import { TCHITS_URL } from "@/lib/contact";
import { formatINR } from "@/lib/format";
import { trackCta } from "@/lib/track";
import type { Profile, Work } from "@/lib/v3";
import { Chapter, CompareTable } from "./kit";

/** "Why myPaisaa" — one promise + three number-backed reasons per profile, plus the dividend record. Brief-only claims. */

type Evidence = "tchits" | "charges" | "history";
interface Reason {
  chip: string;
  title: string;
  body: string;
  vs: string;
  ev: Evidence;
}

interface WhyCopy {
  promise: string;
  notTitle: string;
  reasons: Reason[];
  dividendLine: string;
  cols: string[];
  rows: { k: string; v: string[] }[];
}

export const DIVIDEND = {
  big: "150–170%",
  line: "Our members' dividends: 150–170% of what comparable chit companies paid, on completed groups.",
  foot: "Completed groups vs comparable chit companies; data on file; past dividends don't guarantee future returns.",
};

export const WHY: Record<Profile, WhyCopy> = {
  save: {
    promise: "A savings habit that earns, with a registered safety net.",
    notTitle: "Why myPaisaa, not an RD or an informal chit",
    reasons: [
      { chip: "Up to 12% p.a.", title: "It earns while you save", body: "Dividends of up to 12% p.a., and you can lift the pot early by bidding instead of breaking a deposit.", vs: "vs a bank RD", ev: "history" },
      { chip: "Registrar-deposited", title: "A registered safety net", body: "The full chit value is deposited with the Registrar before a group starts, and every group is listed on T-Chits.", vs: "vs an informal chit", ev: "tchits" },
      { chip: "5% vs 7% cap", title: "Lower cost, no branch", body: "5% commission — below the 7% legal cap — and 2-minute onboarding in the app.", vs: "vs a traditional chit company", ev: "charges" },
    ],
    dividendLine: "More dividend each month means a lower instalment while you save.",
    cols: ["myPaisaa", "Bank RD", "Informal chit", "Traditional chit company"],
    rows: [
      { k: "Earn while you save", v: ["Dividends, up to 12% p.a.", "Fixed bank rate", "Varies, unrecorded", "Dividends"] },
      { k: "Money early", v: ["Bid in an e-auction", "Break with penalty", "If the organiser agrees", "Bid in person"] },
      { k: "Safety net", v: ["Registrar-deposited, on T-Chits", "RBI-regulated bank", "None", "Registered"] },
      { k: "Commission", v: ["5% (legal cap 7%)", "—", "Unrecorded", "Up to 7%"] },
      { k: "Joining", v: ["2 minutes, in the app", "Bank visit or app", "In person", "Branch paperwork"] },
    ],
  },
  borrow: {
    promise: "Funds without collateral, faster than a bank, cheaper than app loans.",
    notTitle: "Why myPaisaa, not a bank or an app loan",
    reasons: [
      { chip: "No collateral", title: "No collateral, eKYC only", body: "No property or deposit pledged — join with eKYC and e-sign.", vs: "vs a bank loan", ev: "tchits" },
      { chip: "~14–22% p.a.", title: "Lower typical cost", body: "Borrowing through a chit typically costs around 14–22% p.a., against 14–30% for many loans.", vs: "vs an app or personal loan", ev: "charges" },
      { chip: "4 auctions/mo · 24-hr payout*", title: "More chances, faster money", body: "Up to 4 e-auctions a month on eligible plans, and payout within 24 hours of completed documentation.", vs: "vs a traditional chit company", ev: "history" },
    ],
    dividendLine: "After you win, dividends keep reducing the instalments you still pay.",
    cols: ["myPaisaa", "Bank loan", "App / personal loan", "Traditional chit company"],
    rows: [
      { k: "Collateral", v: ["None — surety scales down", "Often required", "None", "Surety"] },
      { k: "Paperwork", v: ["eKYC & e-sign", "Heavy, branch visits", "Moderate", "Branch paperwork"] },
      { k: "Typical cost", v: ["~14–22% p.a.", "14–30% p.a.", "Often higher", "Depends on bid"] },
      { k: "Chances to lift", v: ["Up to 4 e-auctions a month", "—", "—", "In-person auctions"] },
      { k: "Time to money", v: ["Within 24 hrs of completed docs", "Days to weeks", "Hours to days", "Varies"] },
    ],
  },
  invest: {
    promise: "Fixed-income style returns, no market exposure, better dividends.",
    notTitle: "Why myPaisaa, not an FD or the market",
    reasons: [
      { chip: "Up to 12% p.a.", title: "Returns from dividends", body: "Up to 12% p.a. from monthly auction dividends.", vs: "vs an FD", ev: "history" },
      { chip: "Zero market exposure", title: "Nothing tied to markets", body: "A chit's value isn't linked to shares, bonds or rate swings.", vs: "vs equity or mutual funds", ev: "tchits" },
      { chip: "5% · senior advisor", title: "Lower cost, real guidance", body: "5% commission (legal cap 7%) and a senior advisor for every ₹10 Lakh+ plan.", vs: "vs another chit company", ev: "charges" },
    ],
    dividendLine: "The core of your return, ahead of comparable chits.",
    cols: ["myPaisaa", "Bank FD", "Equity / MF", "Other chit company"],
    rows: [
      { k: "Return source", v: ["Dividends, up to 12% p.a.", "Fixed bank rate", "Market-linked", "Dividends"] },
      { k: "Market exposure", v: ["Zero", "Zero", "High", "Zero"] },
      { k: "Cost", v: ["5% commission (cap 7%)", "—", "Expense ratio", "Up to 7%"] },
      { k: "Guidance", v: ["Senior advisor, ₹10L+ plans", "Branch RM", "Distributor or self", "Varies"] },
    ],
  },
  explore: {
    promise: "The chit your family trusted, now with a regulator and a receipt.",
    notTitle: "Why myPaisaa, not a neighbourhood chit",
    reasons: [
      { chip: "Registered, 1982 Act", title: "Regulated, not informal", body: "Registered under the Chit Funds Act, 1982, with the chit value deposited with the Registrar.", vs: "vs an informal chit", ev: "tchits" },
      { chip: "Every bid in the app", title: "A record, not a notebook", body: "Every auction, bid and receipt is visible in the app.", vs: "vs a notebook", ev: "history" },
      { chip: "3,00,000+ users", title: "Save or borrow, at scale", body: "One product to save or to borrow, with 3,00,000+ users and ₹1,200 Cr+ in auction turnover.", vs: "vs a single neighbourhood group", ev: "charges" },
    ],
    dividendLine: "What you'd earn in the months you don't bid.",
    cols: ["myPaisaa", "Informal chit", "Traditional chit company"],
    rows: [
      { k: "Registration", v: ["Chit Funds Act, 1982", "Often none", "Registered"] },
      { k: "Your money", v: ["Deposited with the Registrar", "Held by the organiser", "Deposited with the Registrar"] },
      { k: "Records", v: ["Every bid & receipt in the app", "A notebook", "Paper passbook"] },
      { k: "Scale", v: ["3,00,000+ users · ₹1,200 Cr+ turnover", "One neighbourhood", "Varies"] },
    ],
  },
};

export const WORK_REASON: Partial<Record<Work, Reason>> = {
  business: { chip: "Fits stock cycles", title: "Built for stock cycles", body: "Up to 4 auctions a month fit buying cycles, and chit losses can be claimed as business losses.", vs: "for business owners", ev: "charges" },
  salaried: { chip: "UPI, no cash", title: "Runs with your salary", body: "The instalment goes out by UPI every month with reminders; nothing is collected in cash.", vs: "for salaried professionals", ev: "charges" },
  self: { chip: "Surety scales down", title: "Built for uneven income", body: "Surety requirements scale down — often to nothing — as you build a clean payment history.", vs: "for the self-employed", ev: "history" },
};

/** "5% commission: ₹15,000 on your ₹3 Lakh chit — ₹6,000 below the 7% legal maximum." */
export function commissionLine(value: number, your = true) {
  return `5% commission: ₹${formatINR(value * 0.05)} on ${your ? "your" : "a"} ₹${value / 100000} Lakh chit — ₹${formatINR(value * 0.02)} below the 7% legal maximum.`;
}

const EV_LABEL: Record<Evidence, string> = { tchits: "Check on T-Chits", charges: "See every charge", history: "Request group history" };

function EvidenceLink({ ev, leadHref, track }: { ev: Evidence; leadHref: string; track: string }) {
  const href = ev === "tchits" ? TCHITS_URL : ev === "charges" ? "#why-charges" : leadHref;
  const ext = ev === "tchits";
  return (
    <a href={href} target={ext ? "_blank" : undefined} rel={ext ? "noopener noreferrer" : undefined} data-testid={`why-ev-${ev}`} onClick={() => trackCta(`${track}-ev-${ev}`)} className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--acc)] hover:underline">
      {EV_LABEL[ev]} {ext && <ExternalLink size={11} />}
    </a>
  );
}

const reasonsFor = (p: Profile, work?: Work) => [...WHY[p].reasons, ...(work && WORK_REASON[work] ? [WORK_REASON[work]!] : [])];

/** Moment 1 — chips right under the hook headline. */
export function WhyStrip({ p, work }: { p: Profile; work?: Work }) {
  return (
    <div className="mt-5 flex flex-wrap gap-2" data-testid="why-strip">
      {reasonsFor(p, work).map((r) => (
        <span key={r.chip} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 font-mono text-[12px] font-medium text-slate-800 backdrop-blur" title={`${r.title} — ${r.vs}`}>
          <BadgeCheck size={13} className="text-[var(--acc)]" /> {r.chip}
        </span>
      ))}
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--acc)] px-3 py-1.5 font-mono text-[12px] font-semibold text-white" data-testid="why-strip-dividend">
        {DIVIDEND.big} dividends*
      </span>
    </div>
  );
}

/** Small signature badge used inside planners and the auction game. */
export function OnlyAt({ children, testid = "why-only-at" }: { children: React.ReactNode; testid?: string }) {
  return (
    <p className="mt-4 flex items-start gap-2 text-sm text-slate-700" data-testid={testid}>
      <span className="shrink-0 rounded-md bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white">Only at myPaisaa</span>
      <span>{children}</span>
    </p>
  );
}

export function DividendProof({ p, leadHref, track, compact }: { p: Profile; leadHref: string; track: string; compact?: boolean }) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br from-[#02305F] to-brand-deep text-white ${compact ? "p-4" : "p-6 sm:p-8"}`} data-testid="why-dividend">
      <p className={`font-mono font-semibold ${compact ? "text-3xl" : "text-5xl sm:text-6xl"}`}>{DIVIDEND.big}</p>
      <p className={`mt-2 text-white/85 ${compact ? "text-xs" : "text-[15px]"}`}>{DIVIDEND.line}</p>
      {!compact && <p className="mt-2 text-sm text-white/65">{WHY[p].dividendLine}</p>}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] text-white/50">*{DIVIDEND.foot}</p>
        <a href={leadHref} data-testid="why-dividend-history" onClick={() => trackCta(`${track}-dividend-history`)} className="text-xs font-semibold text-white underline-offset-2 hover:underline">
          Request group history
        </a>
      </div>
    </div>
  );
}

/** Moment 2 — the "Why myPaisaa, not ___" chapter: promise, reasons, scorecard with the dividend row. */
export function WhyChapter({ n, id, p, work, name, leadHref, track }: { n: number; id: string; p: Profile; work?: Work; name?: string; leadHref: string; track: string }) {
  const w = WHY[p];
  const extra = work ? WORK_REASON[work] : undefined;
  const rows = [
    ...w.rows,
    ...(extra ? [{ k: cap(extra.vs), v: [extra.title, ...w.cols.slice(1).map(() => "—")] }] : []),
    { k: "Dividends on completed groups", v: ["150–170% of comparable chits*", ...w.cols.slice(1).map((c) => (/chit company/i.test(c) ? "Comparison baseline" : "—"))] },
  ];
  return (
    <Chapter n={n} id={id} kicker={name ? `${name}, here's why myPaisaa` : "Why myPaisaa"} title={<span className="text-[var(--acc)]">{w.promise}</span>} lead={w.notTitle + "."}>
      <div className="grid gap-4 md:grid-cols-3" data-testid="why-reasons">
        {reasonsFor(p, work).map((r, i) => (
          <div key={r.chip} className={`rounded-2xl border border-slate-200 bg-white p-5 ${i === 3 ? "md:col-span-3" : ""}`} data-testid={`why-reason-${i}`}>
            <p className="font-mono text-[11px] uppercase tracking-widest text-slate-400">{r.vs}</p>
            <p className="mt-2 font-mono text-lg font-semibold text-[var(--acc)]">{r.chip}</p>
            <p className="mt-1 font-heading font-semibold text-slate-900">{r.title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{r.body}</p>
            <div className="mt-3"><EvidenceLink ev={r.ev} leadHref={leadHref} track={track} /></div>
          </div>
        ))}
      </div>
      <div className="mt-8" onClick={() => trackCta(`${track}-scorecard`)}>
        <CompareTable testid="why-scorecard" cols={w.cols} rows={rows} foot={`“Up to” figures depend on auction outcomes. *${DIVIDEND.foot} Payout is within 24 hours of completed documentation.`} />
      </div>
      <div className="mt-8">
        <DividendProof p={p} leadHref={leadHref} track={track} />
      </div>
    </Chapter>
  );
}

/** Moment 5 — three-line recap just above the callback form. */
export function WhyRecap({ p, work, leadHref, track }: { p: Profile; work?: Work; leadHref: string; track: string }) {
  const rs = reasonsFor(p, work).slice(0, work && WORK_REASON[work] ? 4 : 3);
  return (
    <div className="mx-auto mt-2 w-full max-w-6xl px-4 sm:px-6 lg:px-8" data-testid="why-recap">
      <div className="rounded-2xl border border-slate-200 bg-[var(--acc-soft)] p-6">
        <p className="font-heading text-lg font-semibold text-slate-900">Why myPaisaa for you</p>
        <ul className="mt-3 space-y-2">
          {rs.map((r) => (
            <li key={r.chip} className="flex items-start gap-2 text-sm text-slate-700">
              <BadgeCheck size={16} className="mt-0.5 shrink-0 text-[var(--acc)]" />
              <span><b className="font-mono text-slate-900">{r.chip}</b> — {r.body}</span>
            </li>
          ))}
          <li className="flex items-start gap-2 text-sm text-slate-700">
            <BadgeCheck size={16} className="mt-0.5 shrink-0 text-[var(--acc)]" />
            <span><b className="font-mono text-slate-900">{DIVIDEND.big}</b> — {DIVIDEND.line}* <a href={leadHref} onClick={() => trackCta(`${track}-recap-history`)} className="font-semibold text-[var(--acc)] hover:underline" data-testid="why-recap-history">Request group history</a></span>
          </li>
        </ul>
      </div>
    </div>
  );
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

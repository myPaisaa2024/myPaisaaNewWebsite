import type { LucideIcon } from "lucide-react";
import { Compass, HandCoins, PiggyBank, TrendingUp } from "lucide-react";
import type { BriefPlan, Goal, Profile } from "@/lib/v3";

export type SectionKey =
  | "proof"
  | "goal-planner"
  | "need-planner"
  | "invest-desk"
  | "explainer"
  | "fit"
  | "compare"
  | "plans"
  | "how"
  | "verify"
  | "charges"
  | "faq"
  | "lead"
  | "app";

export interface CompareTable {
  title: string;
  cols: [string, string, string]; // myPaisaa first
  rows: { k: string; v: [string, string, string] }[];
  foot?: string;
}

export interface ProfileConfig {
  key: Profile;
  icon: LucideIcon;
  chip: string;
  chooserTitle: string;
  chooserBody: string;
  accent: string; // tailwind bg for the profile pill
  hero: {
    kicker: string;
    h1a: string;
    h1b: string;
    sub: string;
    points: string[];
    primary: "install" | "lead";
    primaryLabel: string;
    secondaryLabel: string;
  };
  proof: { v: string; l: string }[];
  sections: SectionKey[];
  plans: { title: string; body: string; filter?: (p: BriefPlan) => boolean };
  compare?: CompareTable;
  faq: number[];
  faqTitle: string;
  lead: { goal: Goal; title: string; body: string };
}

const P_USERS = { v: "3,00,000+", l: "Registered users" };
const P_TURNOVER = { v: "₹1,200 Cr+", l: "Cumulative auction turnover" };
const P_COMMISSION = { v: "5%", l: "Commission · legal cap is 7%" };
const P_ONBOARD = { v: "2 min", l: "Onboarding via eKYC" };
const P_PAYOUT = { v: "24 hrs", l: "Payout after documentation" };
const P_AUCTIONS = { v: "Up to 4", l: "e-Auctions a month (eligible plans)" };

export const PROFILES: Record<Profile, ProfileConfig> = {
  save: {
    key: "save",
    icon: PiggyBank,
    chip: "Save",
    chooserTitle: "I want to save",
    chooserBody: "Build a monthly habit for a goal — wedding, education, a home.",
    accent: "bg-emerald-600",
    hero: {
      kicker: "For savers · zero market risk",
      h1a: "Save every month.",
      h1b: "Earn up to 12% p.a. while you do.",
      sub: "A registered chit turns a fixed monthly amount into a disciplined savings habit. Every month you don't bid, you earn a dividend — and your money never touches the stock market.",
      points: ["Plans from ₹4,000 a month", "Dividends every month you don't bid", "Lump sum available early if life changes"],
      primary: "install",
      primaryLabel: "Start saving in the app",
      secondaryLabel: "Plan my goal with an advisor",
    },
    proof: [P_USERS, P_ONBOARD, P_COMMISSION, P_TURNOVER],
    sections: ["proof", "goal-planner", "compare", "plans", "how", "verify", "charges", "faq", "lead", "app"],
    plans: {
      title: "Savings plans that fit a monthly budget.",
      body: "Pick the monthly amount you can comfortably set aside. Shorter tenures reach your goal sooner.",
      filter: (p) => p.chit_value <= 1000000,
    },
    compare: {
      title: "How a chit compares for savers",
      cols: ["myPaisaa chit", "Bank RD", "Informal chit"],
      rows: [
        { k: "Regulated & verifiable", v: ["Yes — Registrar of Chits, T-Chits", "Yes — RBI", "No"] },
        { k: "Market risk", v: ["Zero", "Zero", "Depends on the organiser"] },
        { k: "Earn while you save", v: ["Monthly dividends, up to 12% p.a.", "Fixed bank rate", "Varies, unrecorded"] },
        { k: "Access a lump sum early", v: ["Yes — bid in an e-auction", "Break with penalty", "If the organiser agrees"] },
        { k: "Records & receipts", v: ["Every auction & receipt in app", "Bank statement", "Notebook, if any"] },
      ],
      foot: "“Up to 12% p.a.” depends on auction outcomes and is not a fixed or guaranteed return.",
    },
    faq: [0, 1, 5, 3, 4],
    faqTitle: "What savers usually ask us.",
    lead: {
      goal: "save",
      title: "Plan your savings goal with an advisor.",
      body: "Tell us what you're saving for and by when. We'll suggest the plan and tenure that gets you there — and show every charge upfront.",
    },
  },
  borrow: {
    key: "borrow",
    icon: HandCoins,
    chip: "Borrow",
    chooserTitle: "I need funds",
    chooserBody: "Business stock, a family event, or consolidating costly loans.",
    accent: "bg-brand",
    hero: {
      kicker: "For borrowers · no collateral",
      h1a: "The bank asked for collateral.",
      h1b: "The chit asks for a KYC.",
      sub: "Join a registered chit and bid for the pot in an open e-auction when you need the money. Win on Tuesday, money on Wednesday — within 24 hours of completed documentation.",
      points: ["No collateral — surety scales down with good history", "Typical cost 14–22% p.a. vs 14–30% for many loans", "Up to 4 e-auctions a month on eligible plans"],
      primary: "lead",
      primaryLabel: "Check how much I can get",
      secondaryLabel: "Install the app",
    },
    proof: [P_PAYOUT, P_AUCTIONS, P_COMMISSION, P_USERS],
    sections: ["proof", "need-planner", "compare", "how", "plans", "verify", "charges", "faq", "lead", "app"],
    plans: {
      title: "Choose the pot size you need.",
      body: "Bigger pots, longer tenures. 4-auction plans give you more chances each month to lift the amount.",
    },
    compare: {
      title: "A chit vs a typical loan",
      cols: ["myPaisaa chit", "Bank loan", "Personal / app loan"],
      rows: [
        { k: "Collateral", v: ["None", "Often required", "None"] },
        { k: "Paperwork", v: ["eKYC & e-sign, 2 minutes", "Heavy, branch visits", "Moderate"] },
        { k: "Typical cost", v: ["~14–22% p.a.", "14–30% p.a.", "Often higher"] },
        { k: "Time to money", v: ["24 hrs after documentation", "Days to weeks", "Hours to days"] },
        { k: "Low credit score", v: ["Underwriting looks at the full picture", "Frequent rejection", "Very high rates"] },
      ],
      foot: "Cost depends on the bid amount and auction month. Winning a specific auction is never promised.",
    },
    faq: [0, 1, 6, 2, 7],
    faqTitle: "What borrowers usually ask us.",
    lead: {
      goal: "borrow",
      title: "Find out how much you can lift — and when.",
      body: "Tell us the amount you need. An advisor explains which plan fits, how the auction works and the real cost — before you commit.",
    },
  },
  invest: {
    key: "invest",
    icon: TrendingUp,
    chip: "Invest",
    chooserTitle: "I'm an investor",
    chooserBody: "High-value chits for fixed-income style returns, without market risk.",
    accent: "bg-[#024180]",
    hero: {
      kicker: "For investors · ₹10 Lakh+ plans",
      h1a: "Fixed-income style returns.",
      h1b: "Zero market exposure.",
      sub: "High-value registered chits from ₹10 Lakh to ₹25 Lakh, with a dedicated senior advisor. Our dividends have run 1.5–1.7x higher than comparable chit companies on completed groups.",
      points: ["Up to 12% p.a. from monthly dividends", "Zero equity or bond-market exposure", "Senior advisor for every ₹10 Lakh+ plan"],
      primary: "lead",
      primaryLabel: "Talk to a senior advisor",
      secondaryLabel: "Install the app",
    },
    proof: [P_TURNOVER, P_COMMISSION, P_USERS, { v: "1.5–1.7x", l: "Dividends vs peers, completed groups*" }],
    sections: ["proof", "invest-desk", "compare", "verify", "plans", "charges", "faq", "lead", "app"],
    plans: {
      title: "High-value plans for investors.",
      body: "Every plan here comes with a senior advisor who walks you through past group dividends.",
      filter: (p) => p.chit_value >= 1000000,
    },
    compare: {
      title: "Where a chit sits in a portfolio",
      cols: ["myPaisaa chit", "Bank FD", "Equity / MF"],
      rows: [
        { k: "Market risk", v: ["Zero", "Zero", "High"] },
        { k: "Return profile", v: ["Up to 12% p.a. from dividends", "Fixed bank rate", "Volatile"] },
        { k: "Liquidity", v: ["Bid to lift the pot early", "Break with penalty", "Sell any day"] },
        { k: "Regulator", v: ["Registrar of Chits (Chit Funds Act, 1982)", "RBI", "SEBI"] },
        { k: "Taxation", v: ["Dividends: income from other sources", "Interest: slab rate", "Capital gains"] },
      ],
      foot: "*1.5–1.7x higher dividends measured on completed groups against comparable chit companies; data held on file. Returns are not guaranteed.",
    },
    faq: [0, 2, 5, 7, 1],
    faqTitle: "What investors usually ask us.",
    lead: {
      goal: "invest",
      title: "Speak with a senior advisor.",
      body: "Get completed-group dividend history, plan availability and a clear picture of tax and charges — in one call.",
    },
  },
  explore: {
    key: "explore",
    icon: Compass,
    chip: "Exploring",
    chooserTitle: "Just exploring",
    chooserBody: "New to chit funds? See how it works in 60 seconds.",
    accent: "bg-slate-700",
    hero: {
      kicker: "Chit funds, explained simply",
      h1a: "Your grandmother's chit fund,",
      h1b: "with a regulator and a receipt.",
      sub: "A chit is a group that saves together every month and takes turns lifting the pot through an auction. myPaisaa runs it fully digitally — registered under the Chit Funds Act, 1982.",
      points: ["Save and borrow in one product", "Every group listed on the government's T-Chits portal", "Every document, every auction — in your pocket"],
      primary: "lead",
      primaryLabel: "See how it works",
      secondaryLabel: "Install the app",
    },
    proof: [P_USERS, P_TURNOVER, P_COMMISSION, P_PAYOUT],
    sections: ["explainer", "fit", "verify", "proof", "plans", "charges", "faq", "lead", "app"],
    plans: { title: "All plans, side by side.", body: "Seven chit values, from ₹4,000 a month. No commitment to look." },
    faq: [0, 1, 2, 3, 4, 5, 6, 7],
    faqTitle: "Fair questions, answered.",
    lead: {
      goal: "save",
      title: "Still deciding? Ask us anything.",
      body: "No sales pitch. An advisor answers your questions about how chits work, charges and safety — and you decide later.",
    },
  },
};

export const PROFILE_ORDER: Profile[] = ["save", "borrow", "invest", "explore"];

export function isProfile(v: unknown): v is Profile {
  return v === "save" || v === "borrow" || v === "invest" || v === "explore";
}

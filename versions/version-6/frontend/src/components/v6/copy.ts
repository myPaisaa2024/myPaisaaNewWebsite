import type { Profile, Work } from "@/lib/v3";

/** Copy building blocks for /v6: hooks per purpose × profession, problems per profession, tagged FAQs. */

interface HookCopy {
  kicker: string;
  /** Receives the "Priya, " prefix (or "") so names appear only where the line reads naturally. */
  h1: (hi: string) => { a: string; b: string };
  sub: string;
}

export const HOOKS: Record<Profile, Record<Work, HookCopy>> = {
  save: {
    salaried: {
      kicker: "Your savings plan",
      h1: (hi) => ({ a: `${hi}your instalment leaves on salary day`, b: "— before anything else can." }),
      sub: "Set one fixed amount to go out with your salary. A registered chit holds you to it and pays a dividend in the months you don't bid — up to 12% p.a., with zero market risk.",
    },
    business: {
      kicker: "Your savings plan",
      h1: (hi) => ({ a: `${hi}put a little of every good month`, b: "somewhere it can't leak back into the shop." }),
      sub: "A registered chit turns a fixed monthly amount into a reserve for your next big purchase — and lets you lift it early by bidding if the business needs it.",
    },
    self: {
      kicker: "Your savings plan",
      h1: (hi) => ({ a: `${hi}uneven income`, b: "still deserves a steady habit." }),
      sub: "Pick a monthly amount you can hold in your leaner months. Dividends from each auction reduce what you pay — up to 12% p.a., zero market risk.",
    },
    other: {
      kicker: "Your savings plan",
      h1: (hi) => ({ a: `${hi}the month ends`, b: "before the money does." }),
      sub: "A registered chit turns one fixed monthly amount into a habit you can't skip — and pays a dividend in the months you don't bid. Up to 12% p.a., zero market risk.",
    },
  },
  borrow: {
    salaried: {
      kicker: "Your funds plan",
      h1: (hi) => ({ a: `${hi}a big expense shouldn't mean`, b: "a high-interest personal loan." }),
      sub: "Join a registered chit, bid in an open e-auction when the expense arrives, and get the money within 24 hours of completed documentation. No collateral.",
    },
    business: {
      kicker: "Your funds plan",
      h1: (hi) => ({ a: `${hi}festival stock shouldn't wait`, b: "on a bank's approval." }),
      sub: "A chit works like a credit line for your business: bid when you need working capital, receive it within 24 hours of completed documentation. Typical cost around 14–22% a year.",
    },
    self: {
      kicker: "Your funds plan",
      h1: (hi) => ({ a: `${hi}irregular income doesn't mean`, b: "irregular access to funds." }),
      sub: "Chit underwriting looks at your full picture, not just a payslip. Bid in an open e-auction and receive the pot within 24 hours of completed documentation.",
    },
    other: {
      kicker: "Your funds plan",
      h1: (hi) => ({ a: `${hi}the bank asked for collateral.`, b: "The chit asks for a KYC." }),
      sub: "Join a registered chit, bid when you need the money, and receive it within 24 hours of completed documentation. Typical cost around 14–22% a year.",
    },
  },
  invest: {
    salaried: {
      kicker: "Your investment plan",
      h1: (hi) => ({ a: `${hi}a steady bucket`, b: "between your FDs and your SIPs." }),
      sub: "High-value registered chits earn monthly dividends — up to 12% p.a. — with no link to equity or bond markets.",
    },
    business: {
      kicker: "Your investment plan",
      h1: (hi) => ({ a: `${hi}park surplus cash where it earns`, b: "and can still come back early." }),
      sub: "Registered chits from ₹10 Lakh earn monthly dividends — up to 12% p.a. — and let you lift the pot by bidding if the business needs it.",
    },
    self: {
      kicker: "Your investment plan",
      h1: (hi) => ({ a: `${hi}fixed-income style returns`, b: "for a not-so-fixed income." }),
      sub: "Turn good months into a dividend-earning chit position with zero market exposure — and a senior advisor for every ₹10 Lakh+ plan.",
    },
    other: {
      kicker: "Your investment plan",
      h1: (hi) => ({ a: `${hi}fixed-income style returns.`, b: "No market exposure." }),
      sub: "High-value registered chits from ₹10 Lakh to ₹25 Lakh earn monthly dividends — up to 12% p.a. — with a senior advisor for every plan.",
    },
  },
  explore: {
    salaried: {
      kicker: "Chits, explained for you",
      h1: (hi) => ({ a: `${hi}one product that saves`, b: "from your salary and lends when you need it." }),
      sub: "A chit is a group that saves together every month and takes turns lifting the pot through an auction. myPaisaa runs it digitally, registered under the Chit Funds Act, 1982.",
    },
    business: {
      kicker: "Chits, explained for you",
      h1: (hi) => ({ a: `${hi}traders have used chits for generations.`, b: "Now with a regulator and a receipt." }),
      sub: "The same community chit, run fully digitally — registered under the Chit Funds Act, 1982 and listed on the government's T-Chits portal.",
    },
    self: {
      kicker: "Chits, explained for you",
      h1: (hi) => ({ a: `${hi}save in good months,`, b: "lift the pot in lean ones." }),
      sub: "A chit is a group that saves together and takes turns lifting the pot through an open auction. myPaisaa runs it digitally, fully registered.",
    },
    other: {
      kicker: "Chits, explained for you",
      h1: (hi) => ({ a: `${hi}your grandmother's chit fund,`, b: "with a regulator and a receipt." }),
      sub: "A chit is a group that saves together every month and takes turns lifting the pot through an auction. myPaisaa runs it fully digitally — registered under the Chit Funds Act, 1982.",
    },
  },
};

export const PROBLEMS: Record<Work, { title: string; items: { t: string; b: string }[] }> = {
  salaried: {
    title: "Salary day comes in. Then it quietly goes out.",
    items: [
      { t: "Salary-day leakage", b: "EMIs, bills and small spends take their share first — savings get whatever's left." },
      { t: "Broken RDs", b: "A recurring deposit gets broken for the first family expense, with a penalty." },
      { t: "Costly personal loans", b: "When a big expense lands, the quickest option is often the most expensive one." },
    ],
  },
  business: {
    title: "Your business has cash flow. It doesn't always have cash when it counts.",
    items: [
      { t: "Working capital gaps", b: "Stock has to be bought before the season's sales come in." },
      { t: "Stock cycles", b: "Festivals, harvests and school seasons all need money at the same time." },
      { t: "Collateral demands", b: "Banks ask for property or deposits a growing business has already put to work." },
    ],
  },
  self: {
    title: "Good months and lean months — and a system built for payslips.",
    items: [
      { t: "Uneven income", b: "It's hard to commit to fixed savings when every month looks different." },
      { t: "Thin credit files", b: "Without salary slips, loan applications stall on paperwork." },
      { t: "No safety net", b: "One slow month can undo a good quarter's savings." },
    ],
  },
  other: {
    title: "Saving and borrowing shouldn't feel this hard.",
    items: [
      { t: "Savings slip away", b: "Without a commitment, money meant for later gets spent now." },
      { t: "Loans are slow or costly", b: "Collateral, paperwork or high rates — usually at least one." },
      { t: "Informal chits feel risky", b: "No regulator, no receipt, no record if something goes wrong." },
    ],
  },
};

export const PURPOSE_PROBLEM_LEAD: Record<Profile, string> = {
  save: "Here's what usually gets in the way of saving.",
  borrow: "Here's why getting funds usually takes too long or costs too much.",
  invest: "Safe options feel slow; fast ones feel loud. Here's the gap a chit fills.",
  explore: "Chits got a bad name from unregistered operators. Here's the everyday problem they actually solve.",
};

export const WORK_FACT: Record<Work, { title: string; body: string }> = {
  business: { title: "For a business owner", body: "Chit-related losses can be claimed as business losses for tax. Dividends are income from other sources." },
  salaried: { title: "For a salaried professional", body: "Dividends are taxed as income from other sources, at your slab rate." },
  self: { title: "For the self-employed", body: "Surety requirements scale down — often to nothing — as you build a clean payment history." },
  other: { title: "Tax, in one line", body: "Dividends are taxed as income from other sources." },
};

type Tag = Profile | Work;
const FAQ_POOL: { q: string; a: string; tags: Tag[] }[] = [
  { q: "Is myPaisaa trustworthy?", a: "We're registered under the Chit Funds Act, 1982 and regulated by the Registrar of Chits, Telangana. Every group is listed on T-Chits, and the company — not an agent — is your counterparty.", tags: ["explore", "save", "invest", "other"] },
  { q: "Can you promise I'll win an auction?", a: "No. Promising an auction outcome would be unethical and illegal. Every e-auction is open to all eligible members; plans with 4 auctions a month simply give more chances.", tags: ["borrow", "business", "self"] },
  { q: "How is a chit different from a bank RD?", a: "An RD pays a fixed rate and penalises early withdrawal. A chit pays dividends from each auction — up to 12% p.a. — and lets you lift the pot early by bidding.", tags: ["save", "salaried"] },
  { q: "Can I claim chit losses as business losses?", a: "Yes — business owners can claim chit-related losses as business losses. Dividends are taxed as income from other sources.", tags: ["business", "borrow", "invest"] },
  { q: "I don't have salary slips. Can I still join?", a: "Yes. Underwriting looks at your full profile. A guarantor may be needed at first; the requirement scales down with a clean payment history.", tags: ["self", "borrow"] },
  { q: "Why do I need a guarantor?", a: "A guarantor protects the whole group. It scales down — often to nothing — for members with a good risk profile and payment history.", tags: ["borrow", "self", "business"] },
  { q: "What if other members default?", a: "The company covers shortfalls, screens every member through credit and risk underwriting, and runs a dedicated legal and recovery team.", tags: ["invest", "save", "explore"] },
  { q: "Is “up to 12% p.a.” guaranteed?", a: "No. It reflects the upper range of dividends from auctions; your return depends on how each group's auctions go.", tags: ["invest", "save", "salaried"] },
  { q: "What if I miss an instalment?", a: "Before winning: ₹100 plus 18% p.a. on the delayed amount. After winning: dividends are withheld if delayed beyond 3 months.", tags: ["salaried", "self", "save", "borrow"] },
  { q: "What if the app crashes?", a: "The platform runs on Microsoft Azure and AWS with enterprise-grade reliability; your records don't live on your phone.", tags: ["explore", "other"] },
  { q: "You're younger than the big players. Why trust you?", a: "We've operated since 2020 across several states, with an experienced founding team and institutional investors — and every group is on T-Chits.", tags: ["invest", "explore"] },
];

/** All questions, most relevant first (purpose match counts double). */
export function faqFor(purpose: Profile, work: Work) {
  const score = (tags: Tag[]) => (tags.includes(purpose) ? 2 : 0) + (tags.includes(work) ? 1 : 0);
  return FAQ_POOL.map((f, i) => ({ ...f, s: score(f.tags), i }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .map(({ q, a }) => ({ q, a }));
}

const WORK_PLURAL: Record<Work, string> = { salaried: "Salaried professionals", business: "Business owners", self: "Self-employed people", other: "People" };
const PURPOSE_PHRASE: Record<Profile, string> = { save: "who save", borrow: "raising funds", invest: "who invest", explore: "new to chits" };

export const FAQ_TITLE = (c: { purpose: Profile; work: Work }) => `What ${WORK_PLURAL[c.work].toLowerCase()} ${PURPOSE_PHRASE[c.purpose]} ask most.`;

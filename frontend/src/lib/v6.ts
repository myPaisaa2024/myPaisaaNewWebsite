import { waLink } from "@/lib/contact";
import { isProfile } from "@/components/v4/profiles";
import type { Band, Profile, Work } from "@/lib/v3";

export interface Case {
  name: string; // optional — "" means address as "you"
  purpose: Profile;
  work: Work;
  band: Band;
}

export const WORKS: { v: Work; label: string; noun: string }[] = [
  { v: "salaried", label: "Salaried", noun: "a salaried professional" },
  { v: "business", label: "Business owner", noun: "a business owner" },
  { v: "self", label: "Self-employed", noun: "someone self-employed" },
  { v: "other", label: "Other", noun: "you" },
];

export const BANDS: { v: Band; label: string; short: string }[] = [
  { v: "1-3", label: "₹1–3 Lakh", short: "₹1–3L" },
  { v: "5-10", label: "₹5–10 Lakh", short: "₹5–10L" },
  { v: "15-30", label: "₹15–30 Lakh", short: "₹15–30L" },
  { v: "unsure", label: "Not sure yet", short: "Not sure" },
];

export const PURPOSE_LABEL: Record<Profile, string> = { save: "Save", borrow: "Borrow", invest: "Invest", explore: "Just exploring" };
export const PURPOSE_VERB: Record<Profile, string> = { save: "saving", borrow: "raising funds", invest: "investing", explore: "exploring chits" };

/** Plan values shown for each band (brief's table; ₹25L is the largest single plan). */
export const BAND_PLANS: Record<Band, number[]> = {
  "1-3": [100000, 200000, 300000],
  "5-10": [500000, 1000000],
  "15-30": [1500000, 2500000],
  unsure: [100000, 200000, 300000, 500000, 1000000, 1500000, 2500000],
};

/** Value each tool opens on. */
export const BAND_DEFAULT: Record<Band, number> = { "1-3": 300000, "5-10": 500000, "15-30": 1500000, unsure: 300000 };
export const BAND_INVEST_DEFAULT: Record<Band, number> = { "1-3": 1000000, "5-10": 1000000, "15-30": 3000000, unsure: 2500000 };

export const workLabel = (w: Work) => WORKS.find((x) => x.v === w)!.label;
export const bandLabel = (b: Band) => BANDS.find((x) => x.v === b)!.label;
export const bandShort = (b: Band) => BANDS.find((x) => x.v === b)!.short;

const WORK_PARAM: Record<string, Work> = { salaried: "salaried", business: "business", self: "self", "self-employed": "self", other: "other" };
const isBand = (v: unknown): v is Band => v === "1-3" || v === "5-10" || v === "15-30" || v === "unsure";

export function caseFromParams(params: URLSearchParams): Partial<Case> {
  const out: Partial<Case> = {};
  const f = params.get("for");
  if (isProfile(f)) out.purpose = f;
  const w = WORK_PARAM[params.get("work") ?? ""];
  if (w) out.work = w;
  const v = params.get("value");
  if (isBand(v) && (v !== "unsure" || out.purpose === "explore")) out.band = v;
  return out;
}

const KEY = "mypaisaa-case-v6";

export function loadCase(): Case | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Partial<Case>;
    if (isProfile(c.purpose) && c.work && WORK_PARAM[c.work] && isBand(c.band)) return { name: typeof c.name === "string" ? c.name : "", purpose: c.purpose, work: c.work, band: c.band };
  } catch {
    /* ignore */
  }
  return null;
}

export function saveCase(c: Case) {
  try {
    localStorage.setItem(KEY, JSON.stringify(c));
  } catch {
    /* ignore */
  }
}

/** Tracking id — purpose, profession, band and chapter; never the name. */
export const tid6 = (c: Case, ch: number, action: string) => `v6-${c.purpose}-${c.work}-${c.band}-ch${ch}-${action}`;

export function waForCase(c: Case): string {
  const band = c.band === "unsure" ? "not sure yet" : bandLabel(c.band);
  return waLink(`Hi myPaisaa, I'm interested in ${PURPOSE_VERB[c.purpose]} with a chit. Profession: ${workLabel(c.work)}. Chit value: ${band}. Please guide me.`);
}

/** "Priya, " or "" — used sparingly (hook, planner, close). */
export const hi = (c: Case, sep = ", ") => (c.name ? `${c.name}${sep}` : "");
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

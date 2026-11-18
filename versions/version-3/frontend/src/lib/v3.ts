import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/lib/api";
import { v3en, type V3Dict } from "@/i18n/v3";

// Hand-written mirrors of backend/models/leads.py — keep in sync.
export interface BriefPlan {
  slug: string;
  chit_value: number;
  emi_min: number;
  emi_max: number;
  durations: number[];
  auctions_per_month: number;
  advisor_assisted: boolean;
}

export type Goal = "save" | "borrow" | "invest";
export type V3Lang = "en" | "te";
export type LeadSource = "v3" | "v4" | "v5" | "v6";
export type Work = "salaried" | "business" | "self" | "other";
export type Band = "1-3" | "5-10" | "15-30" | "unsure";
export type Profile = "save" | "borrow" | "invest" | "explore";

export interface LeadCreate {
  name: string;
  phone: string;
  city: string;
  goal: Goal;
  plan_value: number | null;
  lang: V3Lang;
  consent: boolean;
  source: LeadSource;
  profile: Profile | null;
  profession?: Work | null;
  value_band?: Band | null;
  details?: Record<string, string> | null;
}

export interface Lead extends LeadCreate {
  id: string;
  high_value: boolean;
  created_at: string;
}

export const CITIES = [
  "Hyderabad",
  "Visakhapatnam",
  "Vijayawada",
  "Guntur",
  "Warangal",
  "Karimnagar",
  "Nizamabad",
  "Srikakulam",
  "Vizianagaram",
  "Other",
] as const;

export function useBriefPlans() {
  return useQuery({
    queryKey: ["v3-plans"],
    queryFn: () => apiGet<BriefPlan[]>("/v3/plans"),
    staleTime: 10 * 60 * 1000,
  });
}

export const createLead = (body: LeadCreate) => apiPost<Lead>("/leads", { ...body });
export const listLeads = (passcode: string) => apiPost<Lead[]>("/leads/list", { passcode });

/** Shared with the classic page so a visitor's language choice carries over. */
const STORAGE_KEY = "mypaisaa-lang";

export function detectV3Lang(): V3Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "te" || saved === "en") return saved;
  } catch {
    /* storage blocked */
  }
  const prefs = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const p of prefs) {
    const code = (p || "").toLowerCase().slice(0, 2);
    if (code === "te") return "te";
    if (code === "en") return "en";
  }
  return "en";
}

export function saveV3Lang(lang: V3Lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }
}

interface V3Ctx {
  lang: V3Lang;
  t: V3Dict;
  setLang: (l: V3Lang) => void;
  /** Lead-form plan preselect, set by plan-row CTAs. */
  pickPlan: (value: number | null) => void;
  pickedPlan: number | null;
}

export const V3Context = createContext<V3Ctx>({
  lang: "en",
  t: v3en,
  setLang: () => undefined,
  pickPlan: () => undefined,
  pickedPlan: null,
});

export const useV3 = () => useContext(V3Context);

export function lakh(v: number, lang: V3Lang): string {
  return lang === "te" ? `₹${v / 100000} లక్షలు` : `₹${v / 100000} Lakh`;
}

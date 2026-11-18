import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

// Hand-written mirror of the Plan Pydantic model in backend/models/plans.py —
// nothing infers across the HTTP boundary, keep the pair in sync.
export interface Plan {
  id: string;
  slug: string;
  name: string;
  fund_value: number;
  monthly_contribution: number;
  duration_months: number;
  commission_pct: number;
  est_monthly_dividend: number;
  potential_auction_winning: number;
  tier: "starter" | "growth" | "wealth";
  badge: string | null;
  highlights: string[];
  sort_order: number;
}

const fetchPlans = () => apiGet<Plan[]>("/plans");

/** All seven chit plans, sorted by the backend's sort_order. */
export function usePlans() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
    staleTime: 5 * 60 * 1000,
  });
}

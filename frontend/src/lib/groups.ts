import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

// Hand-written mirror of the ChitGroup Pydantic model in backend/models/groups.py.
export interface ChitGroup {
  id: string;
  group_code: string;
  plan_slug: string;
  city: string;
  seats_total: number;
  seats_filled: number;
  seats_left: number;
  starts_on: string;
  status: string;
}

const fetchVacantGroups = () => apiGet<ChitGroup[]>("/vacant-groups");

/** Open chit groups with seats remaining, most-urgent first (backend-sorted). */
export function useVacantGroups() {
  return useQuery({
    queryKey: ["vacant-groups"],
    queryFn: fetchVacantGroups,
    staleTime: 60 * 1000,
  });
}

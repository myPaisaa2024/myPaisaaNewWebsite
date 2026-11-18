import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { MousePointerClick } from "lucide-react";
import { apiGet } from "@/lib/api";
import { CONTAINER } from "@/components/mypaisaa/bits";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Hand-written mirror of the CtaSummary Pydantic model in backend/models/cta.py.
interface CtaSummary {
  cta_id: string;
  clicks: number;
  last_at: string | null;
}

/** Internal dashboard for CTA click analytics — unlinked, at /stats. */
export default function Stats() {
  const { data, isLoading } = useQuery({
    queryKey: ["cta-summary"],
    queryFn: () => apiGet<CtaSummary[]>("/cta-events/summary"),
    refetchInterval: 10000,
  });

  const total = data?.reduce((n, s) => n + s.clicks, 0) ?? 0;

  return (
    <main className="min-h-svh bg-background py-12" data-testid="stats-page">
      <div className={`${CONTAINER} max-w-4xl`}>
        <div className="flex items-center gap-3">
          <span className="inline-flex rounded-xl bg-brand-mist p-3 text-primary">
            <MousePointerClick className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-heading text-2xl font-bold text-brand-dark">CTA analytics</h1>
            <p className="text-sm text-muted-foreground">
              Clicks tagged per WhatsApp button and store badge. Highest-converting CTAs first.
            </p>
          </div>
        </div>

        <div className="mt-6 inline-flex rounded-2xl border bg-card px-5 py-3" data-testid="stats-total">
          <p className="text-sm text-muted-foreground">
            Total clicks tagged: <span className="font-heading text-lg font-bold text-brand-dark">{total}</span>
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border bg-card" data-testid="stats-table">
          {isLoading ? (
            <div className="space-y-2 p-6" data-testid="stats-skeleton">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-9 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : !data?.length ? (
            <p className="p-6 text-sm text-muted-foreground" data-testid="stats-empty">
              No clicks yet — open the homepage and tap a WhatsApp button.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>CTA</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead className="text-right">Last click</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((s, i) => (
                  <TableRow key={s.cta_id} data-testid={`stats-row-${i}`}>
                    <TableCell className="font-mono text-sm text-brand-dark">{s.cta_id}</TableCell>
                    <TableCell className="font-heading font-bold text-brand-dark">{s.clicks}</TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {s.last_at ? new Date(s.last_at).toLocaleString("en-IN") : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <Link to="/" data-testid="stats-back-home" className="mt-6 inline-flex text-sm font-semibold text-brand-ink hover:underline">
          ← Back to the homepage
        </Link>
      </div>
    </main>
  );
}

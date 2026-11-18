import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import { listLeads } from "@/lib/v3";

/** Passcode-gated list of /v3 callback requests. Passcode lives in backend/.env (LEADS_PASSCODE). */
export default function Leads() {
  const [code, setCode] = useState("");
  const m = useMutation({ mutationFn: listLeads });
  const submit = (e: FormEvent) => {
    e.preventDefault();
    m.mutate(code);
  };
  const fmt = (iso: string) => new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10" data-testid="leads-page">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <img src="/mypaisaa-logo.svg" alt="myPaisaa" className="h-8" />
          <a href="/v3" className="text-sm font-semibold text-[#024180]">← /v3</a>
        </div>
        <h1 className="mt-8 font-heading text-3xl font-semibold text-slate-900">Callback leads</h1>

        <form onSubmit={submit} className="mt-6 flex max-w-md gap-2" data-testid="leads-passcode-form">
          <div className="relative flex-1">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Passcode"
              data-testid="leads-passcode-input"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 outline-none focus:border-[#024180]"
            />
          </div>
          <button type="submit" data-testid="leads-passcode-submit" className="h-11 rounded-xl bg-[#024180] px-5 text-sm font-semibold text-white">
            {m.isPending ? "…" : "Unlock"}
          </button>
        </form>
        {m.isError && <p className="mt-3 text-sm text-red-600" data-testid="leads-error">Wrong passcode.</p>}

        {m.data && (
          <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white" data-testid="leads-table">
            <p className="border-b border-slate-100 px-5 py-3 text-sm text-slate-500" data-testid="leads-count">
              {m.data.length} lead{m.data.length === 1 ? "" : "s"} · {m.data.filter((l) => l.high_value).length} at ₹10L+
            </p>
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 font-mono text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  {["When", "Name", "Phone", "City", "Goal", "Plan", "Lang", "Source"].map((h) => <th key={h} className="px-4 py-2.5 font-medium">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {m.data.map((l) => (
                  <tr key={l.id} className="border-t border-slate-100" data-testid={`leads-row-${l.id}`}>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">{fmt(l.created_at)}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{l.name}</td>
                    <td className="px-4 py-3 font-mono"><a href={`tel:+91${l.phone}`} className="text-[#024180]">{l.phone}</a></td>
                    <td className="px-4 py-3">{l.city}</td>
                    <td className="px-4 py-3 capitalize">{l.goal}</td>
                    <td className="px-4 py-3">
                      {l.plan_value ? `₹${l.plan_value / 100000}L` : "—"}
                      {l.high_value && <span className="ml-2 rounded bg-brand/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand-ink">₹10L+</span>}
                    </td>
                    <td className="px-4 py-3 uppercase">{l.lang}</td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {l.source}{l.profile ? ` · ${l.profile}` : ""}{l.profession ? ` · ${l.profession}` : ""}{l.value_band ? ` · ₹${l.value_band}L` : ""}
                      {l.details && (
                        <span className="mt-1 block max-w-[260px] whitespace-normal font-sans text-[11px] text-slate-600" data-testid={`leads-details-${l.id}`}>
                          {Object.entries(l.details).map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`).join(" · ")}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

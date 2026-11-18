import { MapPin, Users } from "lucide-react";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { useVacantGroups, type ChitGroup } from "@/lib/groups";
import { usePlans } from "@/lib/plans";
import { waLink } from "@/lib/contact";
import { trackCta } from "@/lib/track";
import { useLang } from "@/lib/i18n";
import { en } from "@/i18n/en";
import { CONTAINER, Eyebrow } from "./bits";
import { Reveal } from "./Reveal";

function GroupCard({ group, planValue }: { group: ChitGroup; planValue?: number }) {
  const { t } = useLang();
  const v = t.vacant;
  const fillPct = Math.min(100, Math.round((group.seats_filled / Math.max(1, group.seats_total)) * 100));
  const urgent = group.seats_left <= 5;
  const startLabel = new Date(`${group.starts_on}T00:00:00`).toLocaleDateString(t.locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const planLabelEn = planValue ? en.planName(planValue) : "chit plan";

  return (
    <article
      data-testid={`vacant-card-${group.group_code}`}
      className="flex w-[290px] shrink-0 snap-start flex-col rounded-3xl border bg-card p-5 transition hover:-translate-y-1 hover:border-brand/40 sm:w-[320px]"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-medium text-muted-foreground">{group.group_code}</span>
        {urgent && (
          <span
            data-testid={`vacant-badge-${group.group_code}`}
            className="rounded-full bg-[#FF6431]/10 px-2.5 py-1 text-xs font-bold text-brand-ink"
          >
            {v.badge}
          </span>
        )}
      </div>

      <p className="mt-3 font-heading text-2xl font-bold text-brand-dark">
        {planValue ? t.planName(planValue) : t.plans.chitPlan}
      </p>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin size={14} className="shrink-0" /> {group.city} · {v.starts(startLabel)}
      </p>

      <div className="mb-5 mt-4" data-testid={`vacant-seats-${group.group_code}`}>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${fillPct}%` }} />
        </div>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Users size={13} /> {v.seats(group.seats_left, group.seats_total)}
        </p>
      </div>

      <a
        href={waLink(`Hi myPaisaa! Please reserve a seat for me in group ${group.group_code} (${planLabelEn}, ${group.city}).`)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackCta(`vacant-reserve-${group.group_code}`, { groupCode: group.group_code })}
        data-testid={`vacant-reserve-${group.group_code}`}
        className="mt-auto flex items-center justify-center gap-2 rounded-full bg-wa px-4 py-2.5 text-sm font-bold text-[#062211] transition hover:brightness-105 active:scale-95"
      >
        <SiWhatsapp size={17} /> {v.reserve}
      </a>
    </article>
  );
}

export default function VacantChits() {
  const { data: groups, isLoading, isError } = useVacantGroups();
  const { data: plans } = usePlans();
  const { t } = useLang();
  const v = t.vacant;
  const valueBySlug = new Map((plans ?? []).map((p) => [p.slug, p.fund_value]));

  return (
    <section id="vacant" className="border-y bg-white py-16 sm:py-24">
      <div className={CONTAINER}>
        <Reveal className="max-w-2xl">
          <Eyebrow>{v.eyebrow}</Eyebrow>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl" data-testid="vacant-heading">
            {v.title}
          </h2>
          <p className="mt-3 text-muted-foreground">{v.body}</p>
        </Reveal>

        {isError ? (
          <div className="mt-10 rounded-3xl border bg-card p-8 text-center" data-testid="vacant-error">
            <p className="font-heading text-lg font-semibold text-brand-dark">{v.errTitle}</p>
            <p className="mt-2 text-sm text-muted-foreground">{v.errBody}</p>
            <a
              href={waLink("Hi myPaisaa! Which chit groups still have vacant seats?")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCta("vacant-error-whatsapp")}
              data-testid="vacant-error-whatsapp"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-wa px-5 py-2.5 text-sm font-bold text-[#062211] active:scale-95"
            >
              <SiWhatsapp size={18} /> {v.errCta}
            </a>
          </div>
        ) : isLoading ? (
          <div className="mt-10 flex gap-4 overflow-hidden" data-testid="vacant-skeleton">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 w-[290px] shrink-0 animate-pulse rounded-3xl border bg-card sm:w-[320px]" />
            ))}
          </div>
        ) : (
          <div className="no-scrollbar mt-10 flex snap-x gap-4 overflow-x-auto pb-2" data-testid="vacant-rail">
            {groups?.map((g) => (
              <GroupCard key={g.group_code} group={g} planValue={valueBySlug.get(g.plan_slug)} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronDown, Smartphone, UserRound } from "lucide-react";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { PLAY_STORE_URL, WA_GENERIC } from "@/lib/contact";
import { trackCta } from "@/lib/track";
import { v3en } from "@/i18n/v3";
import type { Profile } from "@/lib/v3";
import { W3 } from "@/components/v3/Top3";
import { PROFILES, PROFILE_ORDER } from "@/components/v4/profiles";

export const ACCENT: Record<Profile, { hex: string; soft: string }> = {
  save: { hex: "#059669", soft: "#ECFDF5" },
  borrow: { hex: "#FF6431", soft: "#FFF4EF" },
  invest: { hex: "#024180", soft: "#EEF4FB" },
  explore: { hex: "#334155", soft: "#F1F5F9" },
};

/** CSS vars consumed as text-[var(--acc)] / bg-[var(--acc)] / bg-[var(--acc-soft)]. */
export const accStyle = (p: Profile) => ({ "--acc": ACCENT[p].hex, "--acc-soft": ACCENT[p].soft }) as CSSProperties;

export interface ChapterMeta {
  id: string;
  label: string;
}

export const tid = (p: Profile, ch: number, name: string) => `v5-${p}-ch${ch}-${name}`;

export function Chapter({
  n,
  id,
  kicker,
  title,
  lead,
  children,
  tint,
}: {
  n: number;
  id: string;
  kicker: string;
  title: ReactNode;
  lead?: string;
  children?: ReactNode;
  tint?: boolean;
}) {
  return (
    <section id={id} data-chapter={n} className={`scroll-mt-32 py-16 sm:py-20 ${tint ? "bg-[var(--acc-soft)]/60" : ""}`} data-testid={`v5-chapter-${n}`}>
      <div className={W3}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5 }}>
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-5xl font-semibold text-[var(--acc)] opacity-25 sm:text-6xl">{String(n).padStart(2, "0")}</span>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--acc)]">{kicker}</p>
          </div>
          <h2 className="mt-3 max-w-3xl font-heading text-3xl font-semibold leading-[1.12] tracking-tight text-slate-900 sm:text-[40px]">{title}</h2>
          {lead && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">{lead}</p>}
        </motion.div>
        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  );
}

export interface CharacterInfo {
  name: string;
  initials: string;
  role: string;
  situation: string;
}

export function Character({ c, testid }: { c: CharacterInfo; testid: string }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-[0_30px_60px_-30px_rgba(2,26,56,0.45)] backdrop-blur-md" data-testid={testid}>
      <div className="flex items-center gap-3">
        <span className="grid size-12 place-items-center rounded-full bg-[var(--acc)] font-heading text-sm font-bold text-white">{c.initials}</span>
        <div>
          <p className="font-heading font-semibold text-slate-900">{c.name}</p>
          <p className="text-xs text-slate-500">{c.role}</p>
        </div>
      </div>
      <p className="mt-4 text-[15px] leading-relaxed text-slate-700">{c.situation}</p>
      <p className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">
        <UserRound size={11} /> Illustrative example
      </p>
    </div>
  );
}

/** Small recurring character beat inside a chapter. */
export function Aside({ c, children, testid }: { c: CharacterInfo; children: ReactNode; testid: string }) {
  return (
    <div className="mt-8 flex max-w-2xl items-start gap-3 rounded-xl border-l-4 border-[var(--acc)] bg-white p-4 shadow-sm" data-testid={testid}>
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--acc)] text-xs font-bold text-white">{c.initials}</span>
      <p className="text-sm leading-relaxed text-slate-700">
        {children} <span className="whitespace-nowrap font-mono text-[10px] uppercase text-slate-400">· illustrative</span>
      </p>
    </div>
  );
}

export function Cards({ items, testid, cols = 3 }: { items: { t: string; b: string; tag?: string }[]; testid: string; cols?: 2 | 3 | 4 }) {
  const grid = cols === 4 ? "md:grid-cols-4" : cols === 2 ? "md:grid-cols-2" : "md:grid-cols-3";
  return (
    <div className={`grid gap-4 ${grid}`}>
      {items.map((x, i) => (
        <div key={x.t} className="rounded-2xl border border-slate-200 bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[var(--acc)]/40 hover:shadow-md" data-testid={`${testid}-${i}`}>
          {x.tag && <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--acc)]">{x.tag}</p>}
          <p className="mt-2 font-heading text-lg font-semibold text-slate-900">{x.t}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{x.b}</p>
        </div>
      ))}
    </div>
  );
}

export function Timeline({ steps, testid }: { steps: { tag: string; t: string; b: string }[]; testid: string }) {
  return (
    <ol className="grid gap-4 md:auto-cols-fr md:grid-flow-col">
      {steps.map((s, i) => (
        <li key={s.t} className="relative rounded-2xl border border-slate-200 bg-white p-5" data-testid={`${testid}-${i}`}>
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[var(--acc)]">
            <span className="size-2 rounded-full bg-[var(--acc)]" /> {s.tag}
          </span>
          <p className="mt-3 font-heading font-semibold text-slate-900">{s.t}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{s.b}</p>
        </li>
      ))}
    </ol>
  );
}

export function CompareTable({ cols, rows, testid, foot }: { cols: string[]; rows: { k: string; v: string[] }[]; testid: string; foot?: string }) {
  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white" data-testid={testid}>
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-5 py-4" />
              {cols.map((c, i) => (
                <th key={c} className={`px-5 py-4 font-heading font-semibold ${i === 0 ? "bg-[var(--acc)] text-white" : "text-slate-700"}`}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.k} className="border-b border-slate-100 last:border-0">
                <td className="px-5 py-3.5 text-slate-500">{r.k}</td>
                {r.v.map((v, i) => (
                  <td key={i} className={`px-5 py-3.5 ${i === 0 ? "bg-[var(--acc-soft)] font-semibold text-slate-900" : "text-slate-600"}`}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {foot && <p className="mt-3 max-w-3xl text-xs text-slate-500">{foot}</p>}
    </div>
  );
}

export function Chips<T extends string | number>({
  options,
  value,
  onChange,
  testid,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
  testid: string;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup">
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          data-testid={`${testid}-${o.value}`}
          onClick={() => onChange(o.value)}
          className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-[background-color,border-color,color] duration-200 ${value === o.value ? "border-[var(--acc)] bg-[var(--acc)] text-white" : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function ToolCard({ children, testid }: { children: ReactNode; testid: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-35px_rgba(2,26,56,0.4)] sm:p-8" data-testid={testid}>
      {children}
    </div>
  );
}

export function Readout({ items, testid }: { items: { k: string; v: string }[]; testid: string }) {
  return (
    <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4" data-testid={testid}>
      {items.map((r) => (
        <div key={r.k}>
          <dt className="text-xs text-slate-500">{r.k}</dt>
          <dd className="font-mono text-base font-semibold text-slate-900">{r.v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Story-specific highlights up top; the complete charges table opens on demand (brief: disclose before enrolment). */
export function ChargesDisclosure({ highlights, testid }: { highlights: { k: string; v: string; note: string }[]; testid: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div id="why-charges" className="scroll-mt-36" data-testid={testid}>
      <div className="grid gap-4 md:grid-cols-3">
        {highlights.map((h, i) => (
          <div key={h.k} className="rounded-2xl border border-slate-200 bg-white p-5" data-testid={`${testid}-hl-${i}`}>
            <p className="text-sm text-slate-500">{h.k}</p>
            <p className="mt-1 font-mono text-xl font-semibold text-slate-900">{h.v}</p>
            <p className="mt-2 text-sm text-slate-600">{h.note}</p>
          </div>
        ))}
      </div>
      <button type="button" aria-expanded={open} data-testid={`${testid}-toggle`} onClick={() => setOpen((o) => !o)} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--acc)]">
        {open ? "Hide" : "See"} every charge <ChevronDown size={16} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-[grid-template-rows] duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <dl className="mt-4 rounded-2xl border border-slate-200 bg-white" data-testid={`${testid}-table`}>
            {v3en.charges.rows.map((r) => (
              <div key={r.k} className="grid grid-cols-[1fr_1.3fr] gap-4 border-b border-slate-100 px-5 py-3 last:border-0">
                <dt className="text-sm text-slate-500">{r.k}</dt>
                <dd className="font-mono text-sm text-slate-900">{r.v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-xs text-slate-500">{v3en.charges.tax}</p>
        </div>
      </div>
    </div>
  );
}

export function FaqList({ items, testid }: { items: { q: string; a: string }[]; testid: string }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="max-w-3xl divide-y divide-slate-200 border-y border-slate-200" data-testid={testid}>
      {items.map((f, i) => (
        <div key={f.q}>
          <button type="button" aria-expanded={open === i} data-testid={`${testid}-toggle-${i}`} onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 py-5 text-left">
            <span className="font-heading font-semibold text-slate-900 sm:text-[17px]">{f.q}</span>
            <ChevronDown size={18} className={`shrink-0 text-slate-400 transition-transform duration-300 ${open === i ? "rotate-180 text-[var(--acc)]" : ""}`} />
          </button>
          <div className={`grid transition-[grid-template-rows] duration-300 ${open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
            <p className="overflow-hidden pr-8 text-[15px] leading-relaxed text-slate-600"><span className="block pb-5">{f.a}</span></p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function StoryCtas({ p, ch, primary, leadHref, leadLabel, installLabel = "Install the app", waHref = WA_GENERIC, idFor }: { p: Profile; ch: number; primary: "install" | "lead"; leadHref: string; leadLabel: string; installLabel?: string; waHref?: string; idFor?: (ch: number, name: string) => string }) {
  const id = (name: string) => (idFor ? idFor(ch, name) : tid(p, ch, name));
  const solid = "bg-[var(--acc)] text-white shadow-[0_10px_30px_-14px_var(--acc)] hover:brightness-110";
  const ghost = "border border-slate-300 bg-white/80 text-slate-900 hover:border-[var(--acc)]";
  const base = "inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-[15px] font-semibold transition-[filter,border-color,transform] duration-200 active:scale-[0.97]";
  const install = (
    <a key="i" href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" data-testid={tid(p, ch, "install")} onClick={() => trackCta(id("install"), { eventType: "download" })} className={`${base} ${primary === "install" ? solid : ghost}`}>
      <Smartphone size={17} /> {installLabel}
    </a>
  );
  const lead = (
    <a key="l" href={leadHref} data-testid={tid(p, ch, "lead")} onClick={() => trackCta(id("lead"))} className={`${base} ${primary === "lead" ? solid : ghost}`}>
      {leadLabel}
    </a>
  );
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {primary === "install" ? [install, lead] : [lead, install]}
      <a href={waHref} target="_blank" rel="noopener noreferrer" data-testid={tid(p, ch, "whatsapp")} onClick={() => trackCta(id("whatsapp"))} className="inline-flex h-12 items-center justify-center gap-2 px-2 text-sm font-semibold text-slate-600 hover:text-[#128C7E]">
        <SiWhatsapp size={16} className="text-[#25D366]" /> WhatsApp us
      </a>
    </div>
  );
}

/** Highest chapter whose top has passed 40% of the viewport. */
export function useActiveChapter(count: number, resetKey: string) {
  const [active, setActive] = useState(1);
  useEffect(() => {
    setActive(1);
    const onScroll = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
      let cur = 1;
      for (const el of els) if (el.getBoundingClientRect().top < window.innerHeight * 0.4) cur = Number(el.dataset.chapter);
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [count, resetKey]);
  return active;
}

export function ChapterRail({ chapters, active, p, trackId }: { chapters: ChapterMeta[]; active: number; p: Profile; trackId?: (n: number) => string }) {
  return (
    <>
      <nav aria-label="Chapters" className="fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 xl:block" data-testid="v5-rail">
        <ol className="space-y-1.5">
          {chapters.map((c, i) => {
            const n = i + 1;
            const on = n === active;
            return (
              <li key={c.id}>
                <a href={`#${c.id}`} title={c.label} aria-label={`Chapter ${n}: ${c.label}`} data-testid={`v5-rail-${n}`} onClick={() => trackCta(trackId ? trackId(n) : `v5-${p}-rail-${n}`)} className="group flex items-center gap-2.5">
                  <span className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${on ? "w-7 bg-[var(--acc)]" : n < active ? "w-3 bg-[var(--acc)]/50" : "w-3 bg-slate-300"}`} />
                  <span className={`hidden text-xs transition-colors duration-200 2xl:inline ${on ? "font-semibold text-slate-900" : "text-slate-400 group-hover:text-slate-700"}`}>
                    <span className="font-mono">{String(n).padStart(2, "0")}</span> {c.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
      <div className="h-1 w-full bg-slate-100 xl:hidden" data-testid="v5-progress">
        <div className="h-full bg-[var(--acc)] transition-[width] duration-300" style={{ width: `${(active / chapters.length) * 100}%` }} />
      </div>
    </>
  );
}

export function Nav5({ profile, onPick, chapterLabel }: { profile: Profile; onPick: (p: Profile) => void; chapterLabel: string }) {
  return (
    <header className="relative border-b border-slate-200/70 bg-white/85 backdrop-blur-xl" data-testid="v5-navbar">
      <div className={`${W3} flex h-14 items-center justify-between gap-4`}>
        <Link to="/v5" className="shrink-0" data-testid="v5-nav-logo">
          <img src="/mypaisaa-logo.svg" alt="myPaisaa" className="h-7 w-auto" />
        </Link>
        <p className="hidden truncate font-mono text-xs text-slate-500 md:block" data-testid="v5-nav-chapter">{chapterLabel}</p>
        <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" data-testid="v5-nav-install" onClick={() => trackCta(`v5-${profile}-nav-install`, { eventType: "download" })} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[var(--acc)] px-3.5 text-sm font-semibold text-white transition-[filter] duration-200 hover:brightness-110">
          <Smartphone size={15} /> Install
        </a>
      </div>
      <div className="border-t border-slate-100">
        <div className={`${W3} flex items-center gap-3 overflow-x-auto py-1.5`}>
          <span className="shrink-0 text-xs text-slate-500">Showing for:</span>
          <div role="tablist" className="flex shrink-0 gap-1 rounded-xl bg-slate-100/80 p-1" data-testid="v5-profile-switch">
            {PROFILE_ORDER.map((k) => {
              const c = PROFILES[k];
              const on = k === profile;
              return (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  data-testid={`v5-profile-${k}`}
                  onClick={() => {
                    trackCta(`v5-switch-${k}`);
                    onPick(k);
                  }}
                  className={`relative z-10 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors duration-200 sm:text-sm ${on ? "text-white" : "text-slate-600 hover:text-slate-900"}`}
                >
                  {on && <motion.span layoutId="v5-profile-pill" className="absolute inset-0 -z-10 rounded-lg" style={{ backgroundColor: ACCENT[k].hex }} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                  <c.icon size={14} /> {c.chip}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}

/** Hook chapter layout: copy left, character + visual right. */
export function Hook({ n, id, kicker, h1a, h1b, sub, ctas, aside, strip }: { n: number; id: string; kicker: string; h1a: string; h1b: string; sub: string; ctas: ReactNode; aside: ReactNode; strip?: ReactNode }) {
  return (
    <section id={id} data-chapter={n} className="relative scroll-mt-32 overflow-hidden" data-testid={`v5-chapter-${n}`}>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(rgba(2,65,128,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(2,65,128,0.06)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_70%_60%_at_30%_30%,black,transparent)]" />
      <div aria-hidden className="absolute -right-40 -top-40 size-[520px] rounded-full opacity-60" style={{ background: "radial-gradient(circle, var(--acc-soft), transparent 65%)" }} />
      <div className={`${W3} relative grid items-center gap-12 py-14 lg:grid-cols-[1.15fr_1fr] lg:py-20`}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--acc)]">
            <span className="font-semibold">Chapter 01</span> · {kicker}
          </p>
          <h1 className="mt-5 font-heading text-[38px] font-semibold leading-[1.06] tracking-tight text-slate-900 sm:text-[52px]" data-testid="v5-hook-title">
            {h1a}
            <span className="mt-1 block text-[var(--acc)]">{h1b}</span>
          </h1>
          {strip}
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">{sub}</p>
          <div className="mt-8">{ctas}</div>
          <p className="mt-4 font-mono text-[11px] text-slate-400">Registered under the Chit Funds Act, 1982 · listed on T-Chits</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
          {aside}
        </motion.div>
      </div>
    </section>
  );
}

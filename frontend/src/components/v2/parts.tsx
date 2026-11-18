import type { ReactNode } from "react";
import { Check, Sparkle } from "lucide-react";
import { SiAppstore, SiGoogleplay } from "@icons-pack/react-simple-icons";
import { APP_STORE_URL, PLAY_STORE_URL, WA_GENERIC } from "@/lib/contact";
import { trackCta } from "@/lib/track";

export const WRAP = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8";

/** Grip-style centred section kicker: thin rules either side of letter-spaced caps. */
export function Kicker({ children, testid }: { children: ReactNode; testid?: string }) {
  return (
    <div className="flex items-center justify-center gap-4" data-testid={testid}>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-slate-300" />
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">{children}</p>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-slate-300" />
    </div>
  );
}

/** Orange-highlighted phrase inside a heading. */
export function Hl({ children }: { children: ReactNode }) {
  return <span className="text-brand">{children}</span>;
}

export function SparkleMark({ className = "" }: { className?: string }) {
  return <Sparkle aria-hidden className={`fill-brand text-brand ${className}`} size={22} />;
}

export function CheckItem({ children, testid }: { children: ReactNode; testid?: string }) {
  return (
    <li className="flex items-start gap-3 text-[17px] text-slate-700" data-testid={testid}>
      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand">
        <Check size={13} strokeWidth={3} className="text-white" />
      </span>
      <span>{children}</span>
    </li>
  );
}

/** Solid navy "Get Started" — every one opens WhatsApp and is tagged by section. */
export function GetStarted({
  testid,
  label = "Get Started",
  href = WA_GENERIC,
  className = "",
}: {
  testid: string;
  label?: string;
  href?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-testid={testid}
      onClick={() => trackCta(testid)}
      className={`inline-flex h-12 min-w-[200px] items-center justify-center rounded-lg bg-[#024180] px-8 text-[15px] font-semibold text-white shadow-[0_8px_24px_-12px_rgba(2,65,128,0.7)] transition-[background-color,transform] duration-200 hover:bg-brand-dark active:scale-[0.97] ${className}`}
    >
      {label}
    </a>
  );
}

export function Badge2({ store, testid }: { store: "play" | "appstore"; testid: string }) {
  const isPlay = store === "play";
  const Icon = isPlay ? SiGoogleplay : SiAppstore;
  return (
    <a
      href={isPlay ? PLAY_STORE_URL : APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-testid={testid}
      onClick={() => trackCta(testid, { eventType: "download" })}
      className="inline-flex items-center gap-2.5 rounded-lg bg-slate-900 px-4 py-2 text-white transition-[background-color,transform] duration-200 hover:bg-[#024180] active:scale-95"
    >
      <Icon size={20} fill="currentColor" />
      <span className="flex flex-col text-left leading-tight">
        <span className="text-[10px] uppercase tracking-wide opacity-75">
          {isPlay ? "Get it on" : "Download on the"}
        </span>
        <span className="text-sm font-semibold">{isPlay ? "Google Play" : "App Store"}</span>
      </span>
    </a>
  );
}

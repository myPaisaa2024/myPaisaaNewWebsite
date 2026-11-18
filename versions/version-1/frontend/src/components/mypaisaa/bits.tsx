import type { ReactNode } from "react";
import { SiAppstore, SiGoogleplay } from "@icons-pack/react-simple-icons";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/contact";
import { trackCta } from "@/lib/track";
import { useLang } from "@/lib/i18n";

export const CONTAINER = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-xs font-semibold uppercase tracking-[0.15em] text-brand-ink ${className}`}>
      {children}
    </p>
  );
}

/** Solid navy app-store badge — reads well on the white surfaces. Clicks are tagged for analytics. */
export function StoreBadge({
  store,
  testid,
  className = "",
}: {
  store: "play" | "appstore";
  testid: string;
  className?: string;
}) {
  const isPlay = store === "play";
  const Icon = isPlay ? SiGoogleplay : SiAppstore;
  const { t } = useLang();
  return (
    <a
      href={isPlay ? PLAY_STORE_URL : APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-testid={testid}
      onClick={() => trackCta(testid, { eventType: "download" })}
      className={`inline-flex items-center gap-2.5 rounded-xl border border-transparent bg-brand-dark px-4 py-2 text-white shadow-sm transition hover:bg-[#024180] active:scale-95 ${className}`}
    >
      <Icon size={22} fill="currentColor" className="shrink-0" />
      <span className="flex flex-col text-left leading-tight">
        <span className="text-[10px] uppercase tracking-wide opacity-80">
          {isPlay ? t.store.playTop : t.store.appTop}
        </span>
        <span className="text-sm font-semibold">{isPlay ? "Google Play" : "App Store"}</span>
      </span>
    </a>
  );
}

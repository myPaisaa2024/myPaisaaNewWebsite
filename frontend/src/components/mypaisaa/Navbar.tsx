import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { WA_GENERIC } from "@/lib/contact";
import { trackCta } from "@/lib/track";
import { LANG_OPTIONS, useLang } from "@/lib/i18n";
import { CONTAINER } from "./bits";

const LINKS = [
  { href: "#plans", key: "plans", testid: "plans" },
  { href: "#calculator", key: "calculator", testid: "calculator" },
  { href: "#how-it-works", key: "how", testid: "how-it-works" },
  { href: "#stories", key: "stories", testid: "stories" },
  { href: "#faq", key: "faq", testid: "faq" },
] as const;

function LanguageSwitcher() {
  const { lang, setLang, t } = useLang();
  return (
    <div
      role="radiogroup"
      aria-label={t.nav.language}
      data-testid="lang-switcher"
      className="flex items-center rounded-full border bg-muted/60 p-0.5"
    >
      {LANG_OPTIONS.map((o) => {
        const active = lang === o.code;
        return (
          <button
            key={o.code}
            type="button"
            role="radio"
            aria-checked={active}
            data-testid={`lang-option-${o.code}`}
            onClick={() => setLang(o.code)}
            className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors active:scale-95 ${
              active ? "bg-brand-dark text-white shadow-sm" : "text-muted-foreground hover:text-brand-dark"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export default function Navbar() {
  const { t } = useLang();
  return (
    <header className="sticky top-0 z-50 border-b border-[#024180]/10 bg-white/90 backdrop-blur-xl">
      <div className={`${CONTAINER} flex h-16 items-center justify-between gap-3`}>
        <a href="/" data-testid="navbar-logo" className="flex shrink-0 items-center">
          <img src="/mypaisaa-logo.svg" alt="myPaisaa" className="h-8 w-auto sm:h-9" />
        </a>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-link-${l.testid}`}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-brand-ink"
            >
              {t.nav[l.key]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-[#FF6431]/25 bg-[#FFF1EA] px-3 py-1.5 text-xs font-semibold text-brand-ink xl:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-wa opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-wa" />
            </span>
            {t.nav.regulated}
          </span>
          <LanguageSwitcher />
          <a
            href={WA_GENERIC}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="navbar-whatsapp-btn"
            aria-label={t.nav.whatsapp}
            onClick={() => trackCta("navbar-whatsapp")}
            className="inline-flex items-center gap-2 rounded-full bg-wa p-2.5 text-sm font-semibold text-[#062211] shadow-sm transition hover:brightness-105 active:scale-95 sm:px-4 sm:py-2"
          >
            <SiWhatsapp size={18} />
            <span className="hidden sm:inline">{t.nav.whatsapp}</span>
          </a>
        </div>
      </div>
    </header>
  );
}

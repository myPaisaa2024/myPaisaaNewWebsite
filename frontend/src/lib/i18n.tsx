import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { en, type Dict } from "@/i18n/en";
import { te } from "@/i18n/te";
import { kn } from "@/i18n/kn";

export type Lang = "en" | "te" | "kn";

const DICTS: Record<Lang, Dict> = { en, te, kn };
const STORAGE_KEY = "mypaisaa-lang";

export const LANG_OPTIONS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "te", label: "తెలుగు" },
  { code: "kn", label: "ಕನ್ನಡ" },
];

function isLang(v: unknown): v is Lang {
  return v === "en" || v === "te" || v === "kn";
}

/** A saved choice wins; otherwise follow the phone's primary language (te/kn), else English. */
function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLang(saved)) return saved;
  } catch {
    /* storage blocked — fall through to detection */
  }
  const prefs = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const pref of prefs) {
    const code = (pref || "").toLowerCase().slice(0, 2);
    if (code === "te" || code === "kn") return code;
    if (code === "en") return "en";
  }
  return "en";
}

interface LangState {
  lang: Lang;
  t: Dict;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangState | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = DICTS[lang].title;
  }, [lang]);

  const setLang = (next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  };

  return <LangContext.Provider value={{ lang, t: DICTS[lang], setLang }}>{children}</LangContext.Provider>;
}

export function useLang(): LangState {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}

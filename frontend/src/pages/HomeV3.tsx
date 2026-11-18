import { useEffect, useMemo, useState } from "react";
import { Hero3, Nav3, Proof3 } from "@/components/v3/Top3";
import { Charges3, Faq3, How3, Plans3, Verify3 } from "@/components/v3/Mid3";
import { App3, Footer3, LeadForm3, MobileBar3 } from "@/components/v3/Bottom3";
import { v3en, v3te } from "@/i18n/v3";
import { V3Context, detectV3Lang, saveV3Lang, type V3Lang } from "@/lib/v3";

/** Agency-brief build (/v3): trust-first, saver/borrower split, upfront charges, lead capture. */
export default function HomeV3() {
  const [lang, setLangState] = useState<V3Lang>(detectV3Lang);
  const [pickedPlan, setPickedPlan] = useState<number | null>(null);
  const t = lang === "te" ? v3te : v3en;

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t.title;
  }, [lang, t.title]);

  const ctx = useMemo(
    () => ({
      lang,
      t,
      setLang: (l: V3Lang) => {
        setLangState(l);
        saveV3Lang(l);
      },
      pickPlan: setPickedPlan,
      pickedPlan,
    }),
    [lang, t, pickedPlan],
  );

  return (
    <V3Context.Provider value={ctx}>
      <div className="min-h-screen bg-white text-slate-900" data-testid="v3-page">
        <Nav3 />
        <main>
          <Hero3 />
          <Proof3 />
          <Verify3 />
          <Plans3 />
          <How3 />
          <Charges3 />
          <Faq3 />
          <LeadForm3 />
          <App3 />
        </main>
        <Footer3 />
        <MobileBar3 />
      </div>
    </V3Context.Provider>
  );
}

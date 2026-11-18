import { useEffect } from "react";
import { HeroV2, NavV2, WhyV2 } from "@/components/v2/TopSections";
import { GuidesV2, LoveV2, OfferV2, TraditionV2 } from "@/components/v2/OfferSections";
import { AppBandV2, FloatingQr, FooterV2 } from "@/components/v2/BottomSections";
import { GetStarted } from "@/components/v2/parts";

/** Grip Invest-inspired layout (/v2) — same myPaisaa brand, data and CTA tracking as the classic home. */
export default function HomeV2() {
  useEffect(() => {
    document.title = "myPaisaa — One-Stop Destination for Digital Chit Funds";
  }, []);
  return (
    <div className="min-h-screen bg-white text-slate-800" data-testid="v2-page">
      <NavV2 />
      <main>
        <HeroV2 />
        <OfferV2 />
        <WhyV2 />
        <TraditionV2 />
        <LoveV2 />
        <AppBandV2 />
        <GuidesV2 />
      </main>
      <FooterV2 />
      <FloatingQr />
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden" data-testid="v2-mobile-bar">
        <GetStarted testid="v2-mobile-get-started" className="w-full" />
      </div>
    </div>
  );
}

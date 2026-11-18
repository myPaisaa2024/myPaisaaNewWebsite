import { useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { LICENSE_URL, PLAY_STORE_URL, SUPPORT_EMAIL, SUPPORT_PHONE, TCHITS_URL } from "@/lib/contact";
import { Badge2, CheckItem, WRAP } from "./parts";

export function AppBandV2() {
  return (
    <section className="bg-white pb-20" data-testid="v2-app-band">
      <div className={WRAP}>
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-brand-mist via-[#F4F8FD] to-[#FFF1EA] p-8 sm:p-12">
          <ChevronRight aria-hidden className="absolute -right-10 -top-10 size-64 text-[#024180]/5" strokeWidth={3} />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <h2 className="font-heading text-3xl font-bold leading-tight text-slate-800 sm:text-4xl">
                <span className="text-brand">Download</span> the myPaisaa App and stay connected 24/7
              </h2>
              <ul className="mt-6 space-y-3">
                <CheckItem>Track your chits and dues in real time</CheckItem>
                <CheckItem>Bid in live weekly e-auctions from anywhere</CheckItem>
                <CheckItem>Get instant updates on dividends and payouts</CheckItem>
              </ul>
              <p className="mt-5 text-sm font-semibold text-[#024180]" data-testid="v2-app-downloads">3,00,00+ app downloads</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Badge2 store="play" testid="v2-app-badge-play" />
                <Badge2 store="appstore" testid="v2-app-badge-appstore" />
              </div>
            </div>
            <div className="flex items-center justify-center gap-6">
              <div className="rounded-2xl bg-white p-4 shadow-[0_20px_40px_-20px_rgba(2,65,128,0.4)]" data-testid="v2-app-qr">
                <QRCodeSVG value={PLAY_STORE_URL} size={150} fgColor="#04234A" />
                <p className="mt-2 text-center text-xs font-medium text-slate-500">Scan to download</p>
              </div>
              <img src="/family-app.jpg" alt="" className="hidden size-44 rounded-2xl object-cover shadow-lg sm:block" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Grip-style floating "Download app" QR card, desktop only, dismissible. */
export function FloatingQr() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="fixed bottom-6 right-6 z-30 hidden w-40 rounded-2xl border border-slate-100 bg-white p-3 text-center shadow-xl lg:block" data-testid="v2-floating-qr">
      <button
        type="button"
        aria-label="Close"
        data-testid="v2-floating-qr-close"
        onClick={() => setOpen(false)}
        className="absolute -right-2.5 -top-2.5 grid size-7 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors duration-200 hover:text-slate-900"
      >
        <X size={14} />
      </button>
      <QRCodeSVG value={PLAY_STORE_URL} size={112} fgColor="#04234A" className="mx-auto" />
      <p className="mt-2 text-sm font-semibold text-slate-800">Download app</p>
      <p className="text-[11px] leading-snug text-slate-500">Fastest way to start your chit</p>
    </div>
  );
}

export function FooterV2() {
  return (
    <footer className="border-t border-slate-200 bg-[#F7F8FC]" data-testid="v2-footer">
      <div className={`${WRAP} grid gap-10 py-14 md:grid-cols-[1.6fr_1fr_1fr]`}>
        <div>
          <img src="/mypaisaa-logo.svg" alt="myPaisaa" className="h-8 w-auto" />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600">
            myPaisaa is a digital chit fund platform, fully compliant with the Chit Funds Act, 1982. Our mission is to help every
            Indian family save and borrow through regulated, transparent chit groups.
          </p>
        </div>
        <div>
          <p className="font-heading text-sm font-semibold text-slate-800">Quick Links</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><a href="#v2-offer" className="hover:text-[#024180]">Our Plans</a></li>
            <li><a href={LICENSE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#024180]" data-testid="v2-footer-license">License & certificates</a></li>
            <li><a href={TCHITS_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#024180]">T-Chits portal</a></li>
            <li><a href="/" className="hover:text-[#024180]" data-testid="v2-footer-classic">Classic homepage</a></li>
          </ul>
        </div>
        <div>
          <p className="font-heading text-sm font-semibold text-slate-800">Reach Us</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-[#024180]" data-testid="v2-footer-email">{SUPPORT_EMAIL}</a></li>
            <li><a href={`tel:${SUPPORT_PHONE.replace(/[^+\d]/g, "")}`} className="hover:text-[#024180]" data-testid="v2-footer-phone">{SUPPORT_PHONE}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200">
        <p className={`${WRAP} py-6 text-xs leading-relaxed text-slate-500`}>
          Operated by Finsave Technologies Private Limited. Chit schemes are administered by IBG eChits India Pvt. Ltd., registered under
          the Chit Funds Act, 1982 with the Registrar of Chits, Telangana. Chit fund returns depend on auction outcomes and are not
          guaranteed. *Figures as reported by myPaisaa. © {new Date().getFullYear()} myPaisaa.
        </p>
      </div>
    </footer>
  );
}

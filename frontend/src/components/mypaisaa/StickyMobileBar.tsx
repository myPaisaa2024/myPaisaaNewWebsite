import { Download } from "lucide-react";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { WA_GENERIC } from "@/lib/contact";
import { trackCta } from "@/lib/track";
import { useLang } from "@/lib/i18n";

/** Persistent mobile thumb-bar — WhatsApp and the app download, always one tap away. */
export default function StickyMobileBar() {
  const { t } = useLang();
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#FF6431]/25 bg-brand-dark/95 px-4 py-3 backdrop-blur-2xl md:hidden"
      data-testid="sticky-mobile-bar"
    >
      <div className="flex items-center gap-3">
        <a
          href={WA_GENERIC}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="sticky-whatsapp-btn"
          onClick={() => trackCta("sticky-whatsapp")}
          className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-wa px-3 py-3 text-sm font-bold text-[#062211] active:scale-95"
        >
          <SiWhatsapp size={18} className="shrink-0" /> <span className="truncate">{t.sticky.whatsapp}</span>
        </a>
        <a
          href="#download"
          data-testid="sticky-download-btn"
          className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-3 text-sm font-semibold text-white active:scale-95"
        >
          <Download size={18} className="shrink-0" /> <span className="truncate">{t.sticky.app}</span>
        </a>
      </div>
    </div>
  );
}

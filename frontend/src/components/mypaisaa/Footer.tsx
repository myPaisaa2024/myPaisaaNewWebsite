import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { LICENSE_URL, SUPPORT_EMAIL, SUPPORT_PHONE, WA_GENERIC } from "@/lib/contact";
import { trackCta } from "@/lib/track";
import { useLang } from "@/lib/i18n";
import { CONTAINER } from "./bits";

const EXPLORE = [
  { href: "#plans", key: "plans", testid: "chit-plans" },
  { href: "#calculator", key: "calculator", testid: "plan-calculator" },
  { href: "#eligibility", key: "eligibility", testid: "eligibility-check" },
  { href: "#how-it-works", key: "how", testid: "how-it-works" },
  { href: "#faq", key: "faq", testid: "faq" },
] as const;

export default function Footer() {
  const { t } = useLang();
  const f = t.footer;
  return (
    <footer className="bg-brand-deep pb-28 pt-14 text-[#B9CFE6] md:pb-10" data-testid="footer">
      <div className={CONTAINER}>
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <span className="inline-flex rounded-xl bg-white px-3 py-2">
              <img src="/mypaisaa-logo.svg" alt="myPaisaa" className="h-7 w-auto" />
            </span>
            <p className="mt-4 text-sm leading-relaxed">{f.about}</p>
            <a
              href={LICENSE_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-license-link"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF8A5C] hover:underline"
            >
              <ShieldCheck size={16} /> {f.license}
            </a>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/60">{f.explore}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {EXPLORE.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="transition-colors hover:text-white" data-testid={`footer-link-${l.testid}`}>
                    {f.links[l.key]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/60">{f.talk}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href={WA_GENERIC}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCta("footer-whatsapp")}
                  className="inline-flex items-center gap-2 transition-colors hover:text-white"
                  data-testid="footer-whatsapp-link"
                >
                  <SiWhatsapp size={16} className="text-wa" /> WhatsApp: +91 91000 07724
                </a>
              </li>
              <li>
                <a href={`tel:${SUPPORT_PHONE.replace(/[^+\d]/g, "")}`} className="inline-flex items-center gap-2 transition-colors hover:text-white" data-testid="footer-phone-link">
                  <Phone size={16} /> {SUPPORT_PHONE}
                </a>
              </li>
              <li>
                <a href={`mailto:${SUPPORT_EMAIL}`} className="inline-flex items-center gap-2 transition-colors hover:text-white" data-testid="footer-email-link">
                  <Mail size={16} /> {SUPPORT_EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0" /> {f.address}
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/60">{f.statutory}</p>
            <p className="mt-4 text-xs leading-relaxed">{f.stat1}</p>
            <p className="mt-3 text-xs leading-relaxed">
              {f.grievance}
              {SUPPORT_EMAIL}
              {f.stat2Post}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} myPaisaa · {f.rights}</p>
          <p>{f.tagline}</p>
        </div>
      </div>
    </footer>
  );
}

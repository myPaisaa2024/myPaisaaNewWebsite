import { BadgeIndianRupee, Gavel, Star, Users, Wallet, Zap } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { CONTAINER, Eyebrow, StoreBadge } from "./bits";
import { Reveal } from "./Reveal";

const PROOF_ICONS = [Zap, Gavel, Wallet, BadgeIndianRupee];

export default function AppDownloadBand() {
  const { t } = useLang();
  const d = t.download;
  return (
    <section id="download" className="relative overflow-hidden border-y bg-white py-16 sm:py-20">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#FF6431]/10 blur-[100px]" />
      <div className={`${CONTAINER} relative grid items-center gap-10 lg:grid-cols-12`}>
        <Reveal className="lg:col-span-7">
          <Eyebrow>{d.eyebrow}</Eyebrow>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl" data-testid="download-heading">
            {d.title}
          </h2>
          <p className="mt-3 max-w-lg text-muted-foreground">{d.body}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <StoreBadge store="play" testid="download-play-badge" />
            <StoreBadge store="appstore" testid="download-appstore-badge" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{d.note}</p>

          <div className="mt-6 grid max-w-md grid-cols-2 gap-3" data-testid="download-proof-grid">
            {d.proof.map((label, i) => {
              const Icon = PROOF_ICONS[i];
              return (
                <div key={i} className="rounded-2xl bg-brand-mist p-4">
                  <Icon className="h-5 w-5 text-brand" aria-hidden />
                  <p className="mt-2 text-sm font-semibold leading-snug text-[#024180]">{label}</p>
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal className="lg:col-span-5" delay={0.1}>
          <div className="relative" data-testid="download-image-wrap">
            <img
              src="/family-app.jpg"
              alt={d.alt}
              loading="lazy"
              className="h-80 w-full rounded-3xl object-cover shadow-2xl shadow-[#024180]/15 lg:h-[440px]"
              data-testid="download-family-image"
            />
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
              <span
                data-testid="download-rating-pill"
                className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-2 text-sm font-semibold text-brand-dark shadow-md backdrop-blur"
              >
                <Star size={15} className="fill-brand text-brand" /> {d.rating}
              </span>
              <span
                data-testid="download-downloads-pill"
                className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-2 text-sm font-semibold text-brand-dark shadow-md backdrop-blur"
              >
                <Users size={15} className="text-brand" /> {d.downloads}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import { BadgeCheck, Gavel, Landmark, Lock, Scale, ShieldCheck } from "lucide-react";
import { LICENSE_URL } from "@/lib/contact";
import { useLang } from "@/lib/i18n";
import { CONTAINER, Eyebrow } from "./bits";
import { Reveal } from "./Reveal";

export default function TrustCompliance() {
  const { t } = useLang();
  const c = t.trust;
  return (
    <section id="trust" className="py-16 sm:py-24">
      <div className={CONTAINER}>
        <Reveal className="max-w-2xl">
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl" data-testid="trust-heading">
            {c.title}
          </h2>
          <p className="mt-3 text-muted-foreground">{c.body}</p>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-12">
          <Reveal className="md:col-span-7" delay={0.05}>
            <article className="h-full rounded-3xl border bg-card p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex rounded-xl bg-brand-mist p-3 text-primary">
                    <Scale className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-heading text-xl font-semibold" data-testid="trust-act-heading">
                    {c.actTitle}
                  </h3>
                </div>
                <ShieldCheck className="hidden h-10 w-10 text-primary/20 sm:block" aria-hidden />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {c.actPre}<span className="font-semibold text-brand-dark">{c.actBold}</span>{c.actPost}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.chips.map((chip) => (
                  <span key={chip} className="rounded-full bg-brand-mist px-3 py-1 text-xs font-semibold text-brand-ink">
                    {chip}
                  </span>
                ))}
              </div>
              <a
                href={LICENSE_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="trust-license-link"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                {c.license}
              </a>
            </article>
          </Reveal>

          <Reveal className="md:col-span-5" delay={0.12}>
            <article className="h-full rounded-3xl bg-brand-mist p-6 sm:p-8">
              <span className="inline-flex rounded-xl bg-white p-3 text-primary">
                <Landmark className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-heading text-xl font-semibold text-[#024180]" data-testid="trust-deposit-heading">
                {c.depositTitle}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#2E5A8A]">
                {c.depositPre}<span className="font-semibold">{c.depositBold}</span>{c.depositPost}
              </p>
            </article>
          </Reveal>

          <Reveal className="md:col-span-4" delay={0.05}>
            <article className="h-full rounded-3xl border bg-card p-6">
              <span className="inline-flex rounded-xl bg-brand-mist p-3 text-primary">
                <Lock className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-heading text-lg font-semibold">{c.securityTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.securityBody}</p>
            </article>
          </Reveal>

          <Reveal className="md:col-span-4" delay={0.1}>
            <article className="h-full rounded-3xl bg-[#FFF1EA] p-6">
              <span className="inline-flex rounded-xl bg-white p-3 text-brand">
                <BadgeCheck className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-heading text-lg font-semibold text-[#7A2E0B]">{c.startupTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#96400F]">{c.startupBody}</p>
            </article>
          </Reveal>

          <Reveal className="md:col-span-4" delay={0.15}>
            <article className="h-full rounded-3xl border bg-card p-6">
              <span className="inline-flex rounded-xl bg-brand-mist p-3 text-primary">
                <Gavel className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-heading text-lg font-semibold">{c.auctionsTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.auctionsBody}</p>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

import { BadgeIndianRupee, Gavel, PiggyBank, UserCheck } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { CONTAINER, Eyebrow } from "./bits";
import { Reveal } from "./Reveal";

const ICONS = [UserCheck, PiggyBank, Gavel, BadgeIndianRupee];

export default function HowItWorks() {
  const { t } = useLang();
  return (
    <section id="how-it-works" className="border-y bg-white py-16 sm:py-24">
      <div className={CONTAINER}>
        <Reveal className="max-w-2xl">
          <Eyebrow>{t.how.eyebrow}</Eyebrow>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl" data-testid="how-heading">
            {t.how.title}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.how.steps.map((s, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal key={i} delay={i * 0.08} className={i % 2 === 1 ? "lg:translate-y-6" : ""}>
                <article className="relative h-full overflow-hidden rounded-3xl border bg-card p-6 transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_20px_40px_-24px_rgb(255_100_49/0.35)]">
                  <span aria-hidden className="absolute -top-2 right-4 font-heading text-6xl font-bold text-primary/10">
                    0{i + 1}
                  </span>
                  <span className="inline-flex rounded-xl bg-brand-mist p-3 text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-heading text-lg font-semibold text-brand-dark" data-testid={`how-step-${i + 1}-title`}>
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  <span className="mt-4 inline-block rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-primary">
                    {s.tag}
                  </span>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

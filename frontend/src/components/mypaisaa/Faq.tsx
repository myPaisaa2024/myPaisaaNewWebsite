import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { CONTAINER, Eyebrow } from "./bits";
import { Reveal } from "./Reveal";

export default function Faq() {
  const { t } = useLang();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 sm:py-24">
      <div className={`${CONTAINER} max-w-3xl`}>
        <Reveal className="text-center">
          <Eyebrow className="justify-center">{t.faq.eyebrow}</Eyebrow>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl" data-testid="faq-heading">
            {t.faq.title}
          </h2>
        </Reveal>

        <div className="mt-10 space-y-3">
          {t.faq.items.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={i} delay={i * 0.04}>
                <div className="overflow-hidden rounded-2xl border bg-card">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    data-testid={`faq-toggle-${i}`}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-heading text-base font-semibold text-brand-dark transition hover:text-primary"
                  >
                    {f.q}
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`}
                      aria-hidden
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground" data-testid={`faq-answer-${i}`}>
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";
import { usePlans } from "@/lib/plans";
import { formatINR } from "@/lib/format";
import { waLink } from "@/lib/contact";
import { trackCta } from "@/lib/track";
import { useLang } from "@/lib/i18n";
import { en } from "@/i18n/en";
import { CONTAINER, Eyebrow } from "./bits";
import { Reveal } from "./Reveal";

const INCOME_MID = [15000, 37500, 75000, 125000];
const DOCS_PENDING = 3; // "Not sure yet"
const OTHER_STATE = 3; // "Another state"

export default function EligibilityChecker() {
  const { data: plans } = usePlans();
  const { t } = useLang();
  const e = t.eligibility;
  const total = e.questions.length;
  const [step, setStep] = useState(0);
  // Store option indices, not labels — the UI shows the active language, WhatsApp always gets English.
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(total).fill(null));
  const [done, setDone] = useState(false);

  const choose = (option: number) => setAnswers((prev) => prev.map((a, i) => (i === step ? option : a)));
  const next = () => (step === total - 1 ? setDone(true) : setStep((s) => s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));
  const restart = () => {
    setAnswers(Array(total).fill(null));
    setStep(0);
    setDone(false);
  };

  // Best-fit plan: the largest plan whose monthly fits ~half the income midpoint.
  const threshold = INCOME_MID[answers[1] ?? 0] * 0.5;
  const fitting = plans?.filter((p) => p.monthly_contribution <= threshold) ?? [];
  const suggested = fitting.length ? fitting[fitting.length - 1] : plans?.[0];

  const enAnswer = (q: number) => {
    const a = answers[q];
    return a === null ? "-" : en.eligibility.questions[q].options[a];
  };
  const verdictMsg = [
    "Hi myPaisaa! I checked my eligibility on your website.",
    `• Income: ${enAnswer(0)}`,
    `• Monthly income: ${enAnswer(1)}`,
    `• Documents: ${enAnswer(2)}`,
    `• State: ${enAnswer(3)}`,
    suggested
      ? `Suggested plan: ${en.planName(suggested.fund_value)} (₹${formatINR(suggested.monthly_contribution)}/month × ${suggested.duration_months} months).`
      : "",
    "Please guide me on the next steps.",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <section id="eligibility" className="py-16 sm:py-24">
      <div className={`${CONTAINER} grid items-start gap-10 lg:grid-cols-12`}>
        <Reveal className="lg:col-span-5">
          <Eyebrow>{e.eyebrow}</Eyebrow>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl" data-testid="eligibility-heading">
            {e.title}
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">{e.body}</p>
          <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
            {e.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />
                {b}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={0.1}>
          <div className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8" data-testid="eligibility-card">
            {done ? (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div data-testid="eligibility-verdict">
                  <span className="inline-flex rounded-xl bg-brand-mist p-3 text-primary">
                    <CheckCircle2 className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-heading text-2xl font-bold text-brand-dark">{e.verdictTitle}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.verdictBody}</p>
                  {answers[2] === DOCS_PENDING && (
                    <p className="mt-3 rounded-xl bg-[#FFF1EA] p-3 text-sm text-[#7A2E0B]" data-testid="eligibility-docs-note">
                      {e.docsNote}
                    </p>
                  )}
                  {answers[3] === OTHER_STATE && (
                    <p className="mt-3 rounded-xl bg-[#FFF1EA] p-3 text-sm text-[#7A2E0B]" data-testid="eligibility-state-note">
                      {e.stateNote}
                    </p>
                  )}
                  {suggested && (
                    <div className="mt-4 rounded-2xl border border-primary/25 bg-brand-mist p-4" data-testid="eligibility-suggested-plan">
                      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                        <Sparkles size={14} /> {e.bestFit}
                      </p>
                      <p className="mt-1 font-heading text-lg font-bold text-[#024180]">
                        {t.planName(suggested.fund_value)} · ₹{formatINR(suggested.monthly_contribution)}{t.perMonth}
                      </p>
                      <p className="text-sm text-[#2E5A8A]">
                        {t.months(suggested.duration_months)} · {e.winUpTo} ₹{formatINR(suggested.potential_auction_winning)}
                      </p>
                    </div>
                  )}
                  <a
                    href={waLink(verdictMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="eligibility-whatsapp-btn"
                    onClick={() => trackCta("eligibility-whatsapp")}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-wa px-5 py-3.5 text-base font-bold text-[#062211] shadow-lg shadow-wa/20 transition hover:brightness-105 active:scale-95"
                  >
                    <SiWhatsapp size={20} className="shrink-0" /> {e.cta}
                  </a>
                  <button
                    type="button"
                    onClick={restart}
                    data-testid="eligibility-restart-btn"
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold text-muted-foreground transition hover:border-primary/40 hover:text-primary active:scale-95"
                  >
                    <RotateCcw size={16} /> {e.restart}
                  </button>
                  <p className="mt-3 text-center text-xs text-muted-foreground">{e.privacy}</p>
                </div>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-brand-dark" data-testid="eligibility-progress">
                    {e.progress(step + 1, total)}
                  </p>
                  <div className="h-1.5 w-28 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${(step / total) * 100}%` }}
                    />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.25 }}
                    className="mt-6"
                  >
                    <h3 className="font-heading text-xl font-semibold text-brand-dark">{e.questions[step].label}</h3>
                    <div className="mt-4 grid gap-2.5" role="radiogroup" aria-label={e.questions[step].label}>
                      {e.questions[step].options.map((option, i) => {
                        const selected = answers[step] === i;
                        return (
                          <button
                            key={i}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            data-selected={selected}
                            data-testid={`eligibility-option-${step}-${i}`}
                            onClick={() => choose(i)}
                            className={`rounded-2xl border px-4 py-3.5 text-left text-sm font-medium transition active:scale-[0.98] ${
                              selected
                                ? "border-primary bg-brand-mist text-[#024180]"
                                : "bg-card text-muted-foreground hover:border-primary/40 hover:text-brand-dark"
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={back}
                    disabled={step === 0}
                    data-testid="eligibility-back-btn"
                    className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold text-muted-foreground transition hover:text-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowLeft size={16} /> {e.back}
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    disabled={answers[step] === null}
                    data-testid="eligibility-next-btn"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#E8521F] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {step === total - 1 ? e.finish : e.next} <ArrowRight size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

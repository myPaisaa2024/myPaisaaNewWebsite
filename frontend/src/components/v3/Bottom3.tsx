import { useEffect, useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Lock, PhoneCall } from "lucide-react";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { QRCodeSVG } from "qrcode.react";
import { LICENSE_URL, PLAY_STORE_URL, SUPPORT_EMAIL, SUPPORT_PHONE, TCHITS_URL, waLink } from "@/lib/contact";
import { trackCta } from "@/lib/track";
import { CITIES, createLead, lakh, useBriefPlans, useV3, type Goal, type Lead, type LeadSource, type Profile, type Work, type Band } from "@/lib/v3";
import { H2, InstallBtn, K3, W3 } from "./Top3";

const FIELD =
  "h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-[15px] text-slate-900 outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-slate-400 focus:border-[#024180] focus:ring-4 focus:ring-[#024180]/10";

export interface ExtraField {
  key: string;
  label: string;
  options?: string[];
  placeholder?: string;
}

type Errors = Partial<Record<"name" | "phone" | "city" | "consent", string>>;

function waAfterLead(l: Lead): string {
  // Always English for the ops team, per the product decision.
  const plan = l.plan_value ? `₹${l.plan_value / 100000} Lakh chit` : "not decided yet";
  const band = l.value_band && l.value_band !== "unsure" ? ` Budget: ₹${l.value_band.replace("-", "–")} Lakh.` : "";
  return waLink(`Hi myPaisaa, I just requested a callback. Name: ${l.name}. City: ${l.city}. Goal: ${l.goal}. Plan: ${plan}.${band}`);
}

export function LeadForm3({
  initialGoal = "save",
  source = "v3",
  profile = null,
  title,
  body,
  extras = [],
  extraInit,
  sectionId = "v3-lead",
  initialName = "",
  caseInfo,
}: {
  initialGoal?: Goal;
  source?: LeadSource;
  profile?: Profile | null;
  title?: string;
  body?: string;
  /** Profile-specific questions (/v5) — answers are sent as lead.details. */
  extras?: ExtraField[];
  extraInit?: Record<string, string>;
  sectionId?: string;
  /** /v6: name, profession and chit-value band captured in the welcome conversation. */
  initialName?: string;
  caseInfo?: { profession: Work; value_band: Band };
} = {}) {
  const { t, lang, pickedPlan } = useV3();
  const plans = useBriefPlans();
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [goal, setGoal] = useState<Goal>(initialGoal);
  const [plan, setPlan] = useState<string>("");
  const [consent, setConsent] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [details, setDetails] = useState<Record<string, string>>(extraInit ?? {});

  useEffect(() => {
    if (extraInit) setDetails((d) => ({ ...d, ...extraInit }));
  }, [extraInit]);

  useEffect(() => {
    if (pickedPlan) setPlan(String(pickedPlan));
  }, [pickedPlan]);

  useEffect(() => setGoal(initialGoal), [initialGoal]);
  useEffect(() => setName(initialName), [initialName]);

  const m = useMutation({ mutationFn: createLead });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (name.trim().length < 2) next.name = t.lead.errName;
    if (!/^[6-9]\d{9}$/.test(phone)) next.phone = t.lead.errPhone;
    if (!city) next.city = t.lead.errCity;
    if (!consent) next.consent = t.lead.errConsent;
    setErrors(next);
    if (Object.keys(next).length) return;
    m.mutate({ name: name.trim(), phone, city, goal, plan_value: plan ? Number(plan) : null, lang, consent, source, profile, details: extras.length ? details : null, ...caseInfo });
  };

  const reset = () => {
    m.reset();
    setName(initialName);
    setPhone("");
    setPlan("");
  };

  return (
    <section id={sectionId} className="scroll-mt-20 py-20" data-testid="v3-lead">
      <div className={W3}>
        <div className="relative grid overflow-hidden rounded-[28px] bg-gradient-to-br from-[#02305F] via-[#032a55] to-brand-deep lg:grid-cols-[1fr_1.1fr]">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:18px_18px]" />
          <div className="relative p-8 text-white sm:p-12">
            <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
              <span className="size-1.5 rounded-full bg-brand" /> {t.lead.kicker}
            </p>
            <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-[38px]">{title ?? t.lead.title}</h2>
            <p className="mt-4 text-white/75">{body ?? t.lead.body}</p>
            <ul className="mt-6 space-y-3">
              {t.lead.perks.map((p) => (
                <li key={p} className="flex items-center gap-3 text-[15px] text-white/90">
                  <CheckCircle2 size={18} className="text-brand" /> {p}
                </li>
              ))}
            </ul>
            <p className="mt-8 flex items-center gap-2 text-xs text-white/55"><Lock size={13} /> {t.lead.privacy}</p>
          </div>

          <div className="relative m-3 rounded-[22px] bg-white p-6 sm:m-4 sm:p-8">
            {m.isSuccess ? (
              <div className="flex h-full flex-col justify-center" data-testid="v3-lead-success">
                <span className="grid size-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600"><CheckCircle2 size={28} /></span>
                <p className="mt-5 font-heading text-2xl font-semibold text-slate-900">{t.lead.successTitle}</p>
                <p className="mt-2 text-slate-600">{t.lead.successBody}</p>
                {m.data.high_value && <p className="mt-3 rounded-xl bg-[#024180]/5 p-3 text-sm text-[#024180]" data-testid="v3-lead-success-hv">{t.lead.successHv}</p>}
                <div className="mt-6 flex flex-col gap-3">
                  <a
                    href={waAfterLead(m.data)}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="v3-lead-success-whatsapp"
                    onClick={() => trackCta("v3-lead-success-whatsapp", { planSlug: m.data.plan_value ? `${m.data.plan_value / 100000}l` : undefined })}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-wa px-6 font-semibold text-white transition-[filter,transform] duration-200 hover:brightness-95 active:scale-[0.97]"
                  >
                    <SiWhatsapp size={18} /> {t.lead.successWa}
                  </a>
                  <InstallBtn testid="v3-lead-success-install" label={t.lead.successInstall} />
                  <button type="button" onClick={reset} data-testid="v3-lead-another" className="mt-1 text-sm font-medium text-slate-500 hover:text-slate-800">
                    {t.lead.another}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-4" data-testid="v3-lead-form">
                <div>
                  <label htmlFor="v3-name" className="mb-1.5 block text-sm font-medium text-slate-700">{t.lead.name}</label>
                  <input id="v3-name" data-testid="v3-lead-name" className={FIELD} value={name} onChange={(e) => { setName(e.target.value); setErrors((x) => ({ ...x, name: undefined })); }} autoComplete="name" maxLength={60} />
                  {errors.name && <p className="mt-1 text-xs text-red-600" data-testid="v3-lead-error-name">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="v3-phone" className="mb-1.5 block text-sm font-medium text-slate-700">{t.lead.phone}</label>
                  <div className="flex">
                    <span className="grid h-12 place-items-center rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 px-3 font-mono text-sm text-slate-500">+91</span>
                    <input
                      id="v3-phone"
                      data-testid="v3-lead-phone"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      className={`${FIELD} rounded-l-none font-mono`}
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setErrors((x) => ({ ...x, phone: undefined })); }}
                      placeholder="98XXXXXXXX"
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-xs text-red-600" data-testid="v3-lead-error-phone">{errors.phone}</p>}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="v3-city" className="mb-1.5 block text-sm font-medium text-slate-700">{t.lead.city}</label>
                    <select id="v3-city" data-testid="v3-lead-city" className={FIELD} value={city} onChange={(e) => { setCity(e.target.value); setErrors((x) => ({ ...x, city: undefined })); }}>
                      <option value="">—</option>
                      {CITIES.map((c) => <option key={c} value={c}>{t.cities[c]}</option>)}
                    </select>
                    {errors.city && <p className="mt-1 text-xs text-red-600" data-testid="v3-lead-error-city">{errors.city}</p>}
                  </div>
                  <div>
                    <label htmlFor="v3-plan" className="mb-1.5 block text-sm font-medium text-slate-700">{t.lead.plan}</label>
                    <select id="v3-plan" data-testid="v3-lead-plan" className={FIELD} value={plan} onChange={(e) => setPlan(e.target.value)}>
                      <option value="">{t.lead.planAny}</option>
                      {plans.data?.map((p) => <option key={p.slug} value={p.chit_value}>{lakh(p.chit_value, lang)}</option>)}
                    </select>
                  </div>
                </div>
                <fieldset>
                  <legend className="mb-1.5 text-sm font-medium text-slate-700">{t.lead.goal}</legend>
                  <div className="grid grid-cols-3 gap-2" role="radiogroup">
                    {(["save", "borrow", "invest"] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        role="radio"
                        aria-checked={goal === g}
                        data-testid={`v3-lead-goal-${g}`}
                        onClick={() => setGoal(g)}
                        className={`h-11 rounded-xl border text-sm font-semibold transition-[background-color,border-color,color] duration-200 ${goal === g ? "border-[#024180] bg-[#024180] text-white" : "border-slate-300 text-slate-700 hover:border-slate-400"}`}
                      >
                        {t.lead.goals[g]}
                      </button>
                    ))}
                  </div>
                </fieldset>
                {extras.map((f) => (
                  <div key={f.key}>
                    <label htmlFor={`lead-x-${f.key}`} className="mb-1.5 block text-sm font-medium text-slate-700">{f.label}</label>
                    {f.options ? (
                      <select id={`lead-x-${f.key}`} data-testid={`lead-extra-${f.key}`} className={FIELD} value={details[f.key] ?? ""} onChange={(e) => setDetails((d) => ({ ...d, [f.key]: e.target.value }))}>
                        <option value="">—</option>
                        {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <textarea id={`lead-x-${f.key}`} data-testid={`lead-extra-${f.key}`} rows={3} maxLength={500} placeholder={f.placeholder} className={`${FIELD} h-auto py-3`} value={details[f.key] ?? ""} onChange={(e) => setDetails((d) => ({ ...d, [f.key]: e.target.value }))} />
                    )}
                  </div>
                ))}
                <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-slate-600">
                  <input type="checkbox" data-testid="v3-lead-consent" checked={consent} onChange={(e) => { setConsent(e.target.checked); setErrors((x) => ({ ...x, consent: undefined })); }} className="mt-0.5 size-4 accent-[#024180]" />
                  {t.lead.consent}
                </label>
                {errors.consent && <p className="text-xs text-red-600" data-testid="v3-lead-error-consent">{errors.consent}</p>}
                {m.isError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" data-testid="v3-lead-error-submit">{t.lead.errGeneric}</p>}
                <button
                  type="submit"
                  disabled={m.isPending}
                  data-testid="v3-lead-submit"
                  className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-base font-semibold text-white shadow-[0_12px_30px_-12px_rgba(255,100,49,0.9)] transition-[filter,transform] duration-200 hover:brightness-105 active:scale-[0.98] disabled:opacity-60"
                >
                  <PhoneCall size={18} /> {m.isPending ? t.lead.sending : t.lead.submit}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function App3() {
  const { t } = useV3();
  return (
    <section className="pb-20" data-testid="v3-app">
      <div className={`${W3} grid items-center gap-10 rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#F5F9FE,#FFFFFF_50%,#FFF6F1)] p-8 sm:p-12 lg:grid-cols-[1.3fr_auto]`}>
        <div>
          <K3>myPaisaa app</K3>
          <H2 className="mt-4 max-w-xl">{t.app.title}</H2>
          <ul className="mt-6 grid gap-2.5 sm:grid-cols-3">
            {t.app.points.map((p) => (
              <li key={p} className="rounded-xl border border-slate-200 bg-white/80 p-3 text-sm text-slate-700">{p}</li>
            ))}
          </ul>
          <InstallBtn testid="v3-app-install" className="mt-6" />
        </div>
        <div className="mx-auto rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-[0_20px_40px_-24px_rgba(2,65,128,0.5)]" data-testid="v3-app-qr">
          <QRCodeSVG value={PLAY_STORE_URL} size={148} fgColor="#04234A" />
          <p className="mt-2 font-mono text-[11px] text-slate-500">{t.app.scan}</p>
        </div>
      </div>
    </section>
  );
}

export function Footer3() {
  const { t } = useV3();
  return (
    <footer className="border-t border-slate-200 bg-slate-50 pb-24 lg:pb-0" data-testid="v3-footer">
      <div className={`${W3} grid gap-10 py-14 md:grid-cols-[1.7fr_1fr_1fr]`}>
        <div>
          <img src="/mypaisaa-logo.svg" alt="myPaisaa" className="h-8 w-auto" />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600" data-testid="v3-footer-about">{t.footer.about}</p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-slate-400">{t.footer.links}</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><a href={TCHITS_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#024180]" data-testid="v3-footer-tchits">T-Chits portal</a></li>
            <li><a href={LICENSE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#024180]" data-testid="v3-footer-license">{t.verify.license}</a></li>
            <li><a href="#v3-charges" className="hover:text-[#024180]">{t.nav.charges}</a></li>
            <li><a href="/" className="hover:text-[#024180]" data-testid="v3-footer-classic">{t.footer.classic}</a></li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-slate-400">{t.footer.contact}</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-[#024180]" data-testid="v3-footer-email">{SUPPORT_EMAIL}</a></li>
            <li><a href={`tel:${SUPPORT_PHONE.replace(/[^+\d]/g, "")}`} className="hover:text-[#024180]" data-testid="v3-footer-phone">{SUPPORT_PHONE}</a></li>
          </ul>
        </div>
      </div>
      <p className={`${W3} border-t border-slate-200 py-6 text-xs leading-relaxed text-slate-500`} data-testid="v3-footer-disclaimer">
        {t.footer.disclaimer} © {new Date().getFullYear()} myPaisaa.
      </p>
    </footer>
  );
}

export function MobileBar3() {
  const { t } = useV3();
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2 border-t border-slate-200 bg-white/90 p-3 backdrop-blur-xl lg:hidden" data-testid="v3-mobile-bar">
      <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" data-testid="v3-mobile-install" onClick={() => trackCta("v3-mobile-install", { eventType: "download" })} className="inline-flex h-11 items-center justify-center rounded-xl bg-[#024180] text-sm font-semibold text-white">
        {t.mobile.install}
      </a>
      <a href="#v3-lead" data-testid="v3-mobile-callback" onClick={() => trackCta("v3-mobile-callback")} className="inline-flex h-11 items-center justify-center rounded-xl bg-brand text-sm font-semibold text-white">
        {t.mobile.callback}
      </a>
    </div>
  );
}

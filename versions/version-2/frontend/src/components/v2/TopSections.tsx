import { useState } from "react";
import { Gavel, IndianRupee, Menu, ShieldCheck, Smartphone, X, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/mypaisaa/Reveal";
import { LICENSE_URL, PLAY_STORE_URL, WA_GENERIC } from "@/lib/contact";
import { trackCta } from "@/lib/track";
import { CheckItem, GetStarted, Hl, Kicker, SparkleMark, WRAP } from "./parts";

const NAV = [
  { label: "Our Plans", href: "#v2-offer" },
  { label: "Why myPaisaa", href: "#v2-why" },
  { label: "Wall of Love", href: "#v2-love" },
  { label: "Savings Guides", href: "#v2-guides" },
];

export function NavV2() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/85 backdrop-blur-md" data-testid="v2-navbar">
      <div className={`${WRAP} flex h-16 items-center justify-between`}>
        <Link to="/v2" data-testid="v2-nav-logo" className="shrink-0">
          <img src="/mypaisaa-logo.svg" alt="myPaisaa" className="h-8 w-auto" />
        </Link>
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              data-testid={`v2-nav-link-${n.href.slice(4)}`}
              className="text-[15px] text-slate-600 transition-colors duration-200 hover:text-[#024180]"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="v2-nav-download"
            onClick={() => trackCta("v2-nav-download", { eventType: "download" })}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-[#024180] transition-colors duration-200 hover:border-[#024180]"
          >
            <Smartphone size={16} /> Download App
          </a>
          <a
            href={WA_GENERIC}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="v2-nav-get-started"
            onClick={() => trackCta("v2-nav-get-started")}
            className="inline-flex h-10 items-center rounded-lg bg-[#024180] px-5 text-sm font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-brand-dark active:scale-95"
          >
            Get Started
          </a>
        </div>
        <button
          type="button"
          aria-label="Menu"
          data-testid="v2-nav-menu-toggle"
          onClick={() => setOpen((o) => !o)}
          className="grid size-10 place-items-center rounded-lg text-[#024180] lg:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-100 bg-white lg:hidden" data-testid="v2-nav-mobile-menu">
          <div className={`${WRAP} flex flex-col gap-1 py-3`}>
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded-lg px-2 py-3 text-slate-700 hover:bg-brand-mist">
                {n.label}
              </a>
            ))}
            <GetStarted testid="v2-nav-mobile-get-started" className="mt-2 w-full" />
          </div>
        </div>
      )}
    </header>
  );
}

export function HeroV2() {
  return (
    <section className="relative overflow-hidden bg-white" data-testid="v2-hero">
      <div className={`${WRAP} grid items-center gap-12 py-14 lg:grid-cols-[1fr_1.15fr] lg:py-20`}>
        <Reveal>
          <h1 className="font-heading text-[40px] font-bold leading-[1.1] tracking-tight text-slate-800 sm:text-5xl" data-testid="v2-hero-title">
            <span className="relative inline-block text-brand">
              One-Stop Destination
              <SparkleMark className="absolute -right-6 -top-3" />
            </span>
            <br />
            for Digital Chit Funds
          </h1>
          <ul className="mt-7 space-y-3.5">
            <CheckItem testid="v2-hero-point-1"><b className="text-slate-900">Save from ₹4,000</b> a month</CheckItem>
            <CheckItem testid="v2-hero-point-2"><b className="text-slate-900">Choose</b> from 7 plans, ₹1 Lakh to ₹30 Lakhs</CheckItem>
            <CheckItem testid="v2-hero-point-3"><b className="text-slate-900">Registered</b> under the Chit Funds Act, 1982</CheckItem>
          </ul>
          <GetStarted testid="v2-hero-get-started" className="mt-9" />
        </Reveal>

        <Reveal delay={0.1} className="relative">
          <div className="relative overflow-hidden rounded-2xl bg-slate-900 shadow-[0_30px_60px_-30px_rgba(2,26,56,0.55)]" data-testid="v2-hero-media">
            <img src="/family-app.jpg" alt="A happy family using the myPaisaa app" className="aspect-[4/3] w-full object-cover opacity-95" />
            <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/55 to-transparent p-5">
              <p className="font-heading text-lg font-semibold text-white">What is myPaisaa?</p>
              <p className="text-sm text-white/80">A registered chit fund, run entirely on your phone.</p>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-3 rounded-xl border border-slate-100 bg-white/90 px-4 py-3 shadow-lg backdrop-blur sm:-left-6" data-testid="v2-hero-float-payout">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Weekly e-auction</p>
            <p className="font-heading text-base font-bold text-[#024180]">Payout within 24 hrs</p>
          </div>
        </Reveal>
      </div>

      <div className="bg-gradient-to-r from-[#F3F8FD] via-brand-mist to-[#FFF1EA]" data-testid="v2-stats-band">
        <div className={`${WRAP} grid grid-cols-2 gap-y-6 py-8 text-center lg:grid-cols-4`}>
          {[
            { v: "₹4,000", l: "Minimum monthly saving" },
            { v: "₹500Cr+", l: "Disbursed to members*" },
            { v: "50,000+", l: "Member community*" },
          ].map((s, i) => (
            <div key={s.l} data-testid={`v2-stat-${i}`}>
              <p className="font-heading text-2xl font-bold text-slate-800 sm:text-[28px]">{s.v}</p>
              <p className="text-sm text-slate-600">{s.l}</p>
            </div>
          ))}
          <a href={LICENSE_URL} target="_blank" rel="noopener noreferrer" data-testid="v2-stat-regulated" className="group">
            <p className="inline-flex items-center gap-1.5 font-heading text-xl font-bold text-[#024180] sm:text-2xl">
              <ShieldCheck size={22} /> T-Chits
            </p>
            <p className="text-sm text-slate-600 group-hover:underline">Govt. registered chits</p>
          </a>
        </div>
      </div>
    </section>
  );
}

const WHY = [
  {
    icon: ShieldCheck,
    title: "Registered & secured",
    body: "100% of every chit value is pledged as an FDR with the Registrar before a group starts",
  },
  {
    icon: IndianRupee,
    title: "Secure payments",
    body: "Pay monthly via UPI and Razorpay — no cash collections, ever",
  },
  {
    icon: Zap,
    title: "Win & withdraw fast",
    body: "Bid in weekly e-auctions and get the money in your bank within 24 hours",
  },
];

export function WhyV2() {
  return (
    <section id="v2-why" className="scroll-mt-20 bg-white py-20" data-testid="v2-why">
      <div className={WRAP}>
        <Kicker>Why choose myPaisaa?</Kicker>
        <h2 className="mx-auto mt-5 max-w-3xl text-center font-heading text-3xl font-bold leading-tight text-slate-800 sm:text-[40px]">
          myPaisaa makes chit fund saving <Hl>simple, transparent and secure</Hl>
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {WHY.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.08}>
              <div className="group h-full rounded-2xl bg-[#F7F8FC] p-7 text-center transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(2,65,128,0.35)]" data-testid={`v2-why-card-${i}`}>
                <h3 className="font-heading text-xl font-bold text-brand">{w.title}</h3>
                <p className="mx-auto mt-2 max-w-[260px] text-[15px] text-slate-600">{w.body}</p>
                <div className="relative mx-auto mt-8 grid size-36 place-items-center">
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(2,65,128,0.10)_1px,transparent_1px)] [background-size:10px_10px]" />
                  <div className="relative grid size-24 place-items-center rounded-3xl bg-gradient-to-br from-[#024180] to-brand-deep shadow-xl transition-transform duration-300 group-hover:rotate-[-6deg]">
                    <w.icon size={44} className="text-white" />
                  </div>
                  <span className="absolute -right-1 bottom-4 grid size-11 place-items-center rounded-full border-4 border-[#F7F8FC] bg-brand text-white">
                    <Gavel size={18} />
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <GetStarted testid="v2-why-get-started" />
        </div>
      </div>
    </section>
  );
}

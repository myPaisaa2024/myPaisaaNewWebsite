import { Quote, Star } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { CONTAINER, Eyebrow } from "./bits";
import { Reveal } from "./Reveal";

interface Story {
  img: string | null;
  initials?: string;
  quote: string;
  name: string;
  meta: string;
  outcome: string;
}

const STORIES: Story[] = [
  {
    img: "https://images.pexels.com/photos/7688183/pexels-photo-7688183.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    quote:
      "On-time credits of the winning amount and dividends, every single time. Very fast processing — I rate this as the best financial app I use.",
    name: "Lokanath P H",
    meta: "Salaried saver · Hyderabad",
    outcome: "Won e-auction · funds in 24 hrs",
  },
  {
    img: "https://images.pexels.com/photos/36330752/pexels-photo-36330752.jpeg",
    quote:
      "I joined to save, but in month five my shop needed stock. After four auctions I won — exactly when it mattered.",
    name: "Prudhvi Raj",
    meta: "Retail business owner · Vijayawada",
    outcome: "Borrowed from his own savings",
  },
  {
    img: "https://images.pexels.com/photos/19747856/pexels-photo-19747856.jpeg",
    quote:
      "Best chit fund app in the market — hassle-free process and minimum documentation.",
    name: "Devender Kuchana",
    meta: "Member · Secunderabad",
    outcome: "Activated in 2 minutes",
  },
  {
    img: null,
    initials: "G",
    quote:
      "I use it purely for savings. The app is clean, the auctions are fair, and customer support is genuinely great.",
    name: "Gayathri",
    meta: "Disciplined saver · Bengaluru",
    outcome: "Saving 50 months strong",
  },
];

export default function Testimonials() {
  const { t } = useLang();
  const st = t.stories;
  return (
    <section id="stories" className="bg-white py-16 sm:py-24">
      <div className={CONTAINER}>
        <Reveal className="max-w-2xl">
          <Eyebrow>{st.eyebrow}</Eyebrow>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl" data-testid="stories-heading">
            {st.title}
          </h2>
          <p className="mt-3 text-muted-foreground">{st.body}</p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STORIES.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.07} className={i % 2 === 1 ? "lg:translate-y-6" : ""}>
              <figure
                className="flex h-full flex-col overflow-hidden rounded-3xl border bg-card transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_20px_40px_-24px_rgb(255_100_49/0.35)]"
                data-testid={`story-card-${i}`}
              >
                {s.img ? (
                  <img
                    src={s.img}
                    alt={st.alt(s.name)}
                    loading="lazy"
                    className="h-40 w-full object-cover object-center"
                  />
                ) : (
                  <div className="flex h-40 w-full items-center justify-center bg-brand-mist">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white font-heading text-2xl font-bold text-[#024180]">
                      {s.initials}
                    </span>
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <Quote className="h-5 w-5 text-brand/60" aria-hidden />
                  <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-foreground/85">{st.items[i].quote}</blockquote>
                  <figcaption className="mt-4 border-t pt-3">
                    <p className="font-heading text-sm font-semibold text-brand-dark">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{st.items[i].meta}</p>
                    <span className="mt-2 inline-block rounded-full bg-[#FFF1EA] px-2.5 py-0.5 text-xs font-medium text-brand-ink">
                      {st.items[i].outcome}
                    </span>
                  </figcaption>
                </div>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 rounded-3xl bg-brand-mist px-6 py-4 text-sm text-[#2E5A8A]" data-testid="stories-rating">
            <span className="flex gap-0.5" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className="fill-[#FF6431] text-[#FF6431]" />
              ))}
            </span>
            <span className="font-semibold text-[#024180]">{st.ratingBold}</span>
            {st.ratingRest}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

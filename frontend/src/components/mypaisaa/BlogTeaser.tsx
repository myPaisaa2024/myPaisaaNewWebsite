import { ArrowUpRight, BookOpen } from "lucide-react";
import { useBlogPosts } from "@/lib/blog";
import { useLang } from "@/lib/i18n";
import { CONTAINER, Eyebrow } from "./bits";
import { Reveal } from "./Reveal";

const BLOG_URL = "https://blog.mypaisaa.com/";

export default function BlogTeaser() {
  const { data: posts, isLoading, isError } = useBlogPosts();
  const { t } = useLang();
  const b = t.blog;
  const list = posts ?? [];
  const empty = isError || (!isLoading && list.length === 0);

  return (
    <section id="blog" className="py-16 sm:py-24" data-testid="blog-section">
      <div className={CONTAINER}>
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <Eyebrow>{b.eyebrow}</Eyebrow>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl" data-testid="blog-heading">
              {b.title}
            </h2>
            <p className="mt-3 text-muted-foreground">{b.body}</p>
            {b.postsNote && (
              <p className="mt-2 text-xs font-medium text-brand-ink" data-testid="blog-language-note">
                {b.postsNote}
              </p>
            )}
          </div>
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="blog-visit-all"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-ink hover:underline"
          >
            {b.visit} <ArrowUpRight size={16} />
          </a>
        </Reveal>

        {empty ? (
          <Reveal delay={0.08}>
            <div
              data-testid="blog-fallback"
              className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl border bg-card p-6"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex rounded-xl bg-brand-mist p-3 text-primary">
                  <BookOpen className="h-6 w-6" />
                </span>
                <p className="font-heading text-lg font-semibold text-brand-dark">{b.fallback}</p>
              </div>
              <a
                href={BLOG_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="blog-fallback-link"
                className="inline-flex items-center gap-1 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white active:scale-95"
              >
                {b.readBlog} <ArrowUpRight size={16} />
              </a>
            </div>
          </Reveal>
        ) : isLoading ? (
          <div className="mt-10 grid gap-4 md:grid-cols-3" data-testid="blog-skeleton">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-3xl border bg-card" />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {list.slice(0, 3).map((p, i) => (
              <Reveal key={p.link} delay={i * 0.06}>
                <article
                  data-testid={`blog-card-${i}`}
                  className="flex h-full flex-col overflow-hidden rounded-3xl border bg-card transition hover:-translate-y-1 hover:border-brand/40"
                >
                  {p.image ? (
                    <img src={p.image} alt="" loading="lazy" className="h-44 w-full object-cover" />
                  ) : (
                    <div className="flex h-44 items-center justify-center bg-brand-mist">
                      <BookOpen className="h-10 w-10 text-primary" aria-hidden />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    {p.published && (
                      <p className="text-xs font-medium text-muted-foreground">{p.published}</p>
                    )}
                    <h3 className="mt-1 font-heading text-lg font-semibold leading-snug text-brand-dark">
                      {p.title}
                    </h3>
                    {p.excerpt && (
                      <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {p.excerpt}
                      </p>
                    )}
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`blog-link-${i}`}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-ink hover:underline"
                    >
                      {b.readOn} <ArrowUpRight size={16} />
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageFooter } from "../../_ui/SiteChrome";
import { NEWS } from "../news-data";

const OSWALD = { fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 } as const;

export function generateStaticParams() {
  return NEWS.map((n) => ({ slug: n.slug }));
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = NEWS.find((x) => x.slug === slug);
  if (!n) notFound();

  return (
    <main className="min-h-screen bg-white text-forest [font-family:var(--font-inter),sans-serif]">
      {/* HEADER */}
      <section className="px-6 pt-28 sm:px-12 sm:pt-36 lg:px-16">
        <div className="mx-auto max-w-[820px]">
          <Link
            href="/nieuws"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.06em] text-forest/60 transition-colors hover:text-forest"
          >
            ← Terug naar nieuws
          </Link>
          <div className="mt-6 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.08em]">
            <span className="rounded-full bg-lime px-3 py-1 text-forest">{n.category}</span>
            <time className="text-forest/50" dateTime={n.date}>{n.dateLabel}</time>
          </div>
          <h1
            className="mt-5 text-[clamp(2.2rem,5.5vw,4.2rem)] uppercase leading-[0.98] tracking-[0.01em]"
            style={OSWALD}
          >
            {n.title}
          </h1>
        </div>
      </section>

      {/* FULL-WIDTH IMAGE */}
      <div className="mt-8 px-6 sm:mt-10 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[28px] shadow-[0_24px_60px_-28px_rgba(14,75,58,0.5)]">
          <img src={n.image} alt={n.title} className="aspect-[16/8] w-full object-cover" />
        </div>
      </div>

      {/* ARTICLE */}
      <article className="px-6 py-14 sm:px-12 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-[760px] space-y-8">
          <p className="text-[clamp(1.15rem,2vw,1.4rem)] font-medium leading-relaxed text-forest">
            {n.intro}
          </p>

          {n.body.map((p, i) => (
            <p key={i} className="text-lg leading-relaxed text-forest/80">
              {p}
            </p>
          ))}

          {/* info / alert card */}
          <aside className="rounded-[20px] border-l-4 border-orange bg-[var(--light-blue)]/50 p-6 sm:p-7">
            <p className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.1em] text-forest">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-orange text-[12px] font-black text-cream">i</span>
              {n.info.title}
            </p>
            <p className="mt-3 leading-relaxed text-forest/80">{n.info.text}</p>
          </aside>

          {/* secondary image */}
          {n.image2 && (
            <figure className="overflow-hidden rounded-[20px]">
              <img src={n.image2} alt={n.image2Caption ?? n.title} className="aspect-[16/9] w-full object-cover" />
              {n.image2Caption && (
                <figcaption className="mt-3 text-center text-sm text-forest/55">{n.image2Caption}</figcaption>
              )}
            </figure>
          )}

          {/* quote */}
          <blockquote className="border-l-4 border-lime pl-6 sm:pl-8">
            <p
              className="text-[clamp(1.4rem,3vw,2.1rem)] uppercase leading-[1.1] tracking-tight text-forest"
              style={OSWALD}
            >
              “{n.quote.text}”
            </p>
            <cite className="mt-4 block text-sm font-semibold not-italic text-orange">
              {n.quote.author}
              {n.quote.role ? ` · ${n.quote.role}` : ""}
            </cite>
          </blockquote>

          {/* table */}
          <figure>
            <figcaption className="mb-3 text-sm font-semibold uppercase tracking-[0.08em] text-forest/50">
              {n.table.caption}
            </figcaption>
            <div className="overflow-x-auto rounded-[16px] border border-forest/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-forest text-cream">
                  <tr>
                    {n.table.headers.map((h) => (
                      <th key={h} className="px-4 py-3 font-semibold uppercase tracking-[0.06em]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {n.table.rows.map((row, ri) => (
                    <tr key={ri} className={ri % 2 === 1 ? "bg-forest/[0.03]" : ""}>
                      {row.map((cell, ci) => (
                        <td key={ci} className="border-t border-forest/10 px-4 py-3 text-forest/80">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </figure>

          <div className="pt-4">
            <Link
              href="/nieuws"
              className="inline-flex items-center gap-2 rounded-lg bg-forest px-6 py-3.5 text-[13px] font-bold uppercase tracking-[0.06em] text-cream transition-transform hover:scale-[1.03]"
            >
              ← Meer nieuws
            </Link>
          </div>
        </div>
      </article>

      <PageFooter />
    </main>
  );
}

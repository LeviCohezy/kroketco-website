/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { PageFooter } from "../_ui/SiteChrome";
import NewsletterForm from "../_ui/NewsletterForm";
import { listPosts } from "@/lib/repo";
import { getContent } from "@/lib/content/store";
import { EditableText, EditableImage } from "@/app/_ui/edit/Editable";

// Reads published blogposts from the CMS DB. Dynamic so CMS edits appear live.
export const dynamic = "force-dynamic";

const OSWALD = { fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 } as const;

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[1.05em] w-[1.05em]">
      <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Title + description are editable in /admin (Nieuws → Zoekmachines & tabblad).
export async function generateMetadata() {
  const seo = await getContent("nieuws.seo");
  return { title: seo.title, description: seo.description };
}

export default async function NieuwsPage() {
  const hero = await getContent("nieuws.hero");
  const list = await getContent("nieuws.list");
  // Hide scheduled posts (published but with a future date) until their date.
  const today = new Date().toISOString().slice(0, 10);
  const posts = listPosts({ publishedOnly: true }).filter((p) => !p.publishedAt || p.publishedAt <= today);
  const [featured, ...rest] = posts;

  if (!featured) {
    return (
      <main className="min-h-screen bg-white text-forest [font-family:var(--font-inter),sans-serif]">
        <section className="px-6 pb-16 pt-40 text-center sm:px-12 lg:px-16">
          <EditableText as="h1" section="nieuws.list" field="emptyTitle" className="text-2xl uppercase tracking-tight" style={OSWALD} />
          <EditableText as="p" section="nieuws.list" field="emptyText" className="mt-3 text-forest/70" />
        </section>
        <PageFooter />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-forest [font-family:var(--font-inter),sans-serif]">
      {/* HERO — short */}
      <section className="relative overflow-hidden bg-[var(--light-blue)]">
        {/* decorative: chef (mirrored) on the left, hand + fork coming in from the right */}
        {hero.imageLeft && (
          <EditableImage
            section="nieuws.hero"
            field="imageLeft"
            alt=""
            className="pointer-events-none absolute bottom-0 left-0 hidden w-[clamp(180px,20vw,330px)] drop-shadow-[0_16px_30px_rgba(14,75,58,0.25)] lg:block"
            style={{ transform: "scaleX(-1)" }}
          />
        )}
        {hero.imageRight && (
          <EditableImage
            section="nieuws.hero"
            field="imageRight"
            alt=""
            className="pointer-events-none absolute right-[-2%] top-1/2 hidden w-[clamp(150px,17vw,260px)] -translate-y-1/2 -rotate-[70deg] drop-shadow-[0_16px_30px_rgba(14,75,58,0.25)] lg:block"
          />
        )}
        <div className="relative mx-auto max-w-[1480px] px-6 pb-12 pt-28 text-center sm:px-12 sm:pb-16 sm:pt-36 lg:px-16">
          <span className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.08em] text-forest/70">
            <span className="h-2 w-2 rounded-[2px] bg-orange" />
            <EditableText as="span" section="nieuws.hero" field="eyebrow" />
          </span>
          <EditableText
            as="h1"
            section="nieuws.hero"
            field="title"
            className="mx-auto mt-5 max-w-3xl text-[clamp(2.2rem,6vw,5rem)] uppercase leading-[0.95] tracking-[0.01em]"
            style={OSWALD}
          />
          <EditableText
            as="p"
            section="nieuws.hero"
            field="text"
            className="mx-auto mt-5 max-w-xl text-lg font-medium text-forest/75"
          />
        </div>
      </section>

      {/* GRID */}
      <section className="px-6 py-16 sm:px-12 sm:py-24 lg:px-16">
        <div className="mx-auto max-w-[1480px]">
          {/* featured */}
          <Link
            href={`/nieuws/${featured.slug}`}
            className="group grid overflow-hidden rounded-[28px] border border-forest/10 bg-white shadow-[0_18px_44px_-18px_rgba(14,75,58,0.28)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_34px_66px_-22px_rgba(14,75,58,0.38)] lg:grid-cols-2"
          >
            <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
              <img
                src={featured.coverImage}
                alt={featured.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
              <div className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.08em]">
                <span className="rounded-full bg-lime px-3 py-1 text-forest">{featured.category}</span>
                <time className="text-forest/50" dateTime={featured.publishedAt}>{featured.dateLabel}</time>
              </div>
              <h2
                className="mt-5 text-[clamp(1.7rem,3vw,2.6rem)] uppercase leading-[1.02] tracking-tight"
                style={OSWALD}
              >
                {featured.title}
              </h2>
              <p className="mt-4 max-w-xl text-forest/75">{featured.excerpt}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.06em] text-orange">
                {list.readMore} <ArrowRight />
              </span>
            </div>
          </Link>

          {/* rest */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((n) => (
              <Link
                key={n.slug}
                href={`/nieuws/${n.slug}`}
                className="group flex flex-col overflow-hidden rounded-[26px] border border-forest/10 bg-white shadow-[0_18px_44px_-18px_rgba(14,75,58,0.28)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_34px_66px_-22px_rgba(14,75,58,0.38)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={n.coverImage}
                    alt={n.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-lime px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.06em] text-forest">
                    {n.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <time className="text-[12px] font-semibold uppercase tracking-[0.08em] text-forest/50" dateTime={n.publishedAt}>
                    {n.dateLabel}
                  </time>
                  <h3 className="mt-2 text-[clamp(1.2rem,2vw,1.6rem)] uppercase leading-[1.05] tracking-tight" style={OSWALD}>
                    {n.title}
                  </h3>
                  <p className="mt-3 text-sm text-forest/70">{n.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-[0.06em] text-orange">
                    {list.readMore} <ArrowRight />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="px-6 pb-16 sm:px-12 sm:pb-24 lg:px-16">
        <div className="mx-auto max-w-[1480px]">
          <NewsletterForm />
        </div>
      </section>

      <PageFooter />
    </main>
  );
}

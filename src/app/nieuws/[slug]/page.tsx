/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageFooter } from "../../_ui/SiteChrome";
import { getPostBySlug } from "@/lib/repo";
import { renderPostBody } from "../../admin/_editor/render";
import { PostContactForm } from "./PostContactForm";
import { getContent } from "@/lib/content/store";

// Reads a single blogpost from the CMS DB by slug. Dynamic so CMS edits appear
// live; params are resolved per request.
export const dynamic = "force-dynamic";

const OSWALD = { fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 } as const;

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = getPostBySlug(slug);
  // Hide unpublished and scheduled (future-dated) posts from the public.
  const today = new Date().toISOString().slice(0, 10);
  if (!n || !n.published || (n.publishedAt && n.publishedAt > today)) notFound();

  // Body is stored as TipTap JSON (or legacy plain text). Render to sanitized
  // HTML with the same extensions the editor uses, so it matches the preview.
  const bodyHtml = renderPostBody(n.body);
  const copy = await getContent("nieuws.detail");
  const formCopy = n.showForm ? await getContent("nieuws.postForm") : null;

  return (
    <main className="min-h-screen bg-white text-forest [font-family:var(--font-inter),sans-serif]">
      {/* HEADER */}
      <section className="px-6 pt-28 sm:px-12 sm:pt-36 lg:px-16">
        <div className="mx-auto max-w-[820px]">
          <Link
            href={copy.backHref || "/nieuws"}
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.06em] text-forest/60 transition-colors hover:text-forest"
          >
            {copy.backLabel}
          </Link>
          <div className="mt-6 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.08em]">
            <span className="rounded-full bg-lime px-3 py-1 text-forest">{n.category}</span>
            <time className="text-forest/50" dateTime={n.publishedAt}>{n.dateLabel}</time>
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
      {n.coverImage && (
        <div className="mt-8 px-6 sm:mt-10 sm:px-12 lg:px-16">
          <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[28px] shadow-[0_24px_60px_-28px_rgba(14,75,58,0.5)]">
            <img src={n.coverImage} alt={n.title} className="aspect-[16/8] w-full object-cover" />
          </div>
        </div>
      )}

      {/* ARTICLE */}
      <article className="px-6 py-14 sm:px-12 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-[760px]">
          {/* Rich content rendered from the CMS (TipTap JSON → sanitized HTML). */}
          <div className="tt-prose" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

          {/* Optional contact form at the end of the post. */}
          {formCopy ? <PostContactForm slug={n.slug} copy={formCopy} /> : null}

          <div className="pt-10">
            <Link
              href={copy.backHref || "/nieuws"}
              className="inline-flex items-center gap-2 rounded-lg bg-forest px-6 py-3.5 text-[13px] font-bold uppercase tracking-[0.06em] text-cream transition-transform hover:scale-[1.03]"
            >
              {copy.moreLabel}
            </Link>
          </div>
        </div>
      </article>

      <PageFooter />
    </main>
  );
}

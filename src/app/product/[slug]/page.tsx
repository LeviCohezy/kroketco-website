/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageFooter } from "../../_ui/SiteChrome";
import ContactForm from "../../_ui/ContactForm";
import FadeIn from "../../_ui/FadeIn";
import { getProductBySlug, listProducts } from "@/lib/repo";
import type { PrepMethod } from "@/lib/types";
import { AllergenIcon, parseAllergens } from "@/lib/allergens";
import { Bereiding } from "./Bereiding";
import { getContent } from "@/lib/content/store";
import Multiline from "../../_ui/Multiline";

// Per-product detail page, driven entirely by CMS data. Dynamic so edits appear
// immediately; 404 when the product is missing or not published.
export const dynamic = "force-dynamic";

const DISPLAY = { fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 } as const;

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[1.05em] w-[1.05em]">
      <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className={className}>
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p || !p.published) notFound();

  // Allergens present on this product, resolved to the shared registry (icon + label).
  const allergens = parseAllergens(p.allergens);
  const present = new Set(allergens.map((a) => a.code));

  const methods: PrepMethod[] = [p.preparation.oven, p.preparation.frituur].filter((m) => m.enabled && m.steps.length > 0);

  const [hero, prep, ing, rel, cta] = await Promise.all([
    getContent("product.hero"),
    getContent("product.bereiding"),
    getContent("product.ingredienten"),
    getContent("product.related"),
    getContent("product.cta"),
  ]);

  const related = listProducts({ publishedOnly: true })
    .filter((r) => r.slug !== p.slug)
    .slice(0, 3);

  return (
    <main className="bg-white text-forest [font-family:var(--font-inter),sans-serif]">
      {/* ============================ PRODUCT HERO ============================ */}
      <section className="mx-auto max-w-[1480px] px-6 pb-16 pt-28 sm:px-12 sm:pb-24 sm:pt-36 lg:px-16">
        <nav className="mb-8 flex items-center gap-2 text-[13px] font-medium text-forest/50">
          <Link href={hero.crumbHomeHref || "/"} className="transition-colors hover:text-forest">{hero.crumbHome}</Link>
          <span>/</span>
          <Link href={hero.crumbListHref || "/producten"} className="transition-colors hover:text-forest">{hero.crumbList}</Link>
          <span>/</span>
          <span className="text-forest">{p.name}</span>
        </nav>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* image — frame + photo always square */}
          <div className="relative aspect-square overflow-hidden rounded-[32px] p-5 shadow-[0_24px_60px_rgba(14,75,58,0.18)] sm:p-8" style={{ background: p.frame }}>
            {!!p.veggie && (
              <span className="absolute left-5 top-5 z-10 rounded-full bg-lime px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-forest">
                {hero.veggieBadge}
              </span>
            )}
            <div className="relative h-full w-full overflow-hidden rounded-[22px] bg-white/40">
              {p.image ? (
                <img src={p.image} alt={p.title || p.name} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-forest/30">{hero.noImage}</div>
              )}
            </div>
          </div>

          {/* info */}
          <div>
            <p className="flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.28em] text-orange">
              <span className="h-2 w-2 rounded-[2px] bg-orange" /> {p.name}
            </p>
            <h1 className="mt-5 text-[clamp(2.6rem,6vw,4.6rem)] uppercase leading-[0.95] tracking-[0.01em]" style={DISPLAY}>
              {p.title || p.name}
            </h1>
            {p.description && (
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-forest/75">{p.description}</p>
            )}

            {p.tags.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-2.5">
                {p.tags.map((t) => (
                  <span key={t} className="rounded-full bg-lime px-4 py-2 text-[13px] font-semibold text-forest">
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={hero.ctaHref || "#"}
                className="inline-flex items-center gap-3 rounded-xl bg-orange px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-cream transition-transform hover:scale-[1.03]"
              >
                {hero.ctaLabel} <ArrowRight />
              </Link>
              {(p.ingredients.length > 0 || present.size > 0) && (
                <a href="#allergenen" className="text-sm font-semibold text-forest underline underline-offset-4 transition-opacity hover:opacity-70">
                  {hero.allergenLink}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================ HIGHLIGHTS (cards) ============================ */}
      {p.cards.length > 0 && (
        <section className="mx-auto max-w-[1480px] px-6 pb-16 sm:px-12 sm:pb-24 lg:px-16">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {p.cards.map((c, i) => (
              <FadeIn key={i} delay={i * 120} className="h-full">
                <div className="h-full rounded-[24px] bg-white p-7 shadow-[0_12px_30px_rgba(14,75,58,0.08)]">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-lime text-lg font-bold text-forest" style={DISPLAY}>
                    {i + 1}
                  </div>
                  <h3 className="mt-5 text-lg font-bold tracking-tight text-forest">{c.title}</h3>
                  {c.text && <p className="mt-2 text-[14px] leading-relaxed text-forest/60">{c.text}</p>}
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {/* ============================ BEREIDING ============================ */}
      {methods.length > 0 && (
        <section className="mx-auto max-w-[1480px] px-6 pb-16 sm:px-12 sm:pb-24 lg:px-16">
          <Bereiding
            oven={p.preparation.oven}
            frituur={p.preparation.frituur}
            image={p.prepImage || p.image}
            alt={p.title || p.name}
            labels={prep}
          />
        </section>
      )}

      {/* ============================ INGREDIËNTEN & ALLERGENEN ============================ */}
      {(p.ingredients.length > 0 || present.size > 0) && (
        <section id="allergenen" className="mx-auto max-w-[1480px] px-6 pb-16 sm:px-12 sm:pb-24 lg:px-16">
          <div className="max-w-2xl">
            <h2 className="text-[clamp(2.4rem,6vw,4.6rem)] uppercase leading-[0.88] text-forest" style={DISPLAY}>
              {ing.title}
            </h2>
            <span className="font-hand -mt-1 block -rotate-2 text-[clamp(2rem,4.5vw,3.4rem)] leading-none text-orange">
              {ing.titleHand}
            </span>
          </div>

          <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-4">
            {/* product image — 50% width (2 of 4 columns), always square; the
                two cards stretch to match its height. */}
            <div className="relative aspect-square overflow-hidden rounded-[28px] bg-light-blue shadow-[0_18px_44px_-18px_rgba(14,75,58,0.28)] lg:col-span-2">
              {(p.allergenImage || p.image) && (
                <img src={p.allergenImage || p.image} alt={p.title || p.name} className="absolute inset-0 h-full w-full object-cover" />
              )}
            </div>

            {/* light-blue "puur & echt" ingredients panel — 25% */}
            {p.ingredients.length > 0 && (
              <div className="flex flex-col rounded-[28px] bg-light-blue p-7 text-forest shadow-[0_18px_44px_-18px_rgba(14,75,58,0.28)]">
                <span className="font-hand -rotate-2 text-[1.9rem] leading-none text-orange">{ing.ingredientsHand}</span>
                <h3 className="mt-1 text-[clamp(1.5rem,2.2vw,2rem)] uppercase leading-[0.9]" style={DISPLAY}>
                  {ing.ingredientsTitle}
                </h3>
                <ul className="mt-5 flex-1 space-y-3">
                  {p.ingredients.map((ing) => (
                    <li key={ing} className="flex items-start gap-2.5 text-[16px] leading-snug text-forest/80">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-forest text-cream">
                        <CheckIcon />
                      </span>
                      {ing}
                    </li>
                  ))}
                </ul>
                <a
                  href={ing.ingredientsHref || "#"}
                  className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-[13px] font-bold uppercase tracking-[0.06em] text-cream transition-transform hover:scale-[1.03]"
                >
                  {ing.ingredientsButton} <ArrowRight />
                </a>
              </div>
            )}

            {/* cream allergens panel — 25% — with chef mascot */}
            <div className="relative flex flex-col overflow-hidden rounded-[28px] bg-cream p-7 shadow-[0_18px_44px_-18px_rgba(14,75,58,0.2)]">
              <span className="font-hand -rotate-2 text-[1.9rem] leading-none text-orange">{ing.allergensHand}</span>
              <h3 className="mt-1 text-[clamp(1.5rem,2.2vw,2rem)] uppercase leading-[0.9] text-forest" style={DISPLAY}>
                {ing.allergensTitle}
              </h3>
              {allergens.length > 0 ? (
                <ul className="mt-5 space-y-3">
                  {allergens.map((a) => (
                    <li key={a.code} className="flex items-center gap-3 text-[16px]">
                      <AllergenIcon code={a.code} className="h-10 w-10 ring-1 ring-forest/10" />
                      <span className="font-semibold text-forest">{a.label}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-5 flex items-center gap-2 text-[15px] font-medium text-forest/60">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lime text-forest">
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                  {ing.allergensNone}
                </p>
              )}
              <p className="relative z-10 mt-4 max-w-[62%] text-[12px] leading-relaxed text-forest/50">
                <Multiline text={ing.allergensNote} />
              </p>
              {ing.mascot && (
                <img
                  src={ing.mascot}
                  alt=""
                  aria-hidden
                  className="pointer-events-none absolute bottom-0 right-0 w-2/3 drop-shadow-[0_10px_20px_rgba(14,75,58,0.25)]"
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* ============================ RELATED PRODUCTS ============================ */}
      {related.length > 0 && (
        <section className="mx-auto max-w-[1480px] px-6 pb-16 sm:px-12 sm:pb-24 lg:px-16">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.28em] text-orange">
                <span className="h-2 w-2 rounded-[2px] bg-orange" /> {rel.eyebrow}
              </p>
              <h2 className="mt-5 text-[clamp(1.9rem,4vw,3rem)] uppercase leading-[1.02] text-forest" style={DISPLAY}>
                {rel.title}
              </h2>
            </div>
            <Link href={rel.linkHref || "/producten"} className="hidden shrink-0 items-center gap-2 text-sm font-semibold text-forest underline underline-offset-4 transition-opacity hover:opacity-70 sm:inline-flex">
              {rel.linkLabel} <ArrowRight />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/product/${r.slug}`}
                className="group flex flex-col rounded-[24px] bg-white p-5 shadow-[0_12px_30px_rgba(14,75,58,0.08)] transition-transform hover:-translate-y-1"
              >
                <div className="relative overflow-hidden rounded-[18px] p-4" style={{ background: r.frame }}>
                  <div className="relative aspect-square w-full overflow-hidden rounded-[14px]">
                    {r.image && (
                      <img src={r.image} alt={r.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    )}
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between gap-3 px-1">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-forest">{r.name}</h3>
                    {r.sub && <p className="mt-0.5 text-[13px] font-medium text-forest/55">{r.sub}</p>}
                  </div>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest text-cream transition-transform group-hover:scale-110">
                    <ArrowRight />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ============================ CLOSING CTA ============================ */}
      <section className="mx-auto max-w-[1480px] px-6 pb-16 sm:px-12 sm:pb-24 lg:px-16">
        <div className="relative overflow-hidden rounded-[32px] bg-forest px-6 py-16 text-center text-cream sm:px-12 sm:py-24">
          <p className="flex items-center justify-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.28em] text-lime">
            <span className="h-2 w-2 rounded-[2px] bg-lime" /> {cta.eyebrow}
          </p>
          <h2 className="mx-auto mt-6 max-w-3xl text-[clamp(2.2rem,5vw,4rem)] uppercase leading-[0.98]" style={DISPLAY}>
            {cta.title}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-cream/80">
            <Multiline text={cta.text} />
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={cta.primaryHref || "#"}
              className="inline-flex items-center gap-3 rounded-xl bg-orange px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-cream transition-transform hover:scale-[1.03]"
            >
              {cta.primaryLabel} <ArrowRight />
            </Link>
            {cta.secondaryLabel && (
              <Link href={cta.secondaryHref || "#"} className="inline-flex items-center gap-3 rounded-xl border border-cream/25 px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-cream transition-colors hover:bg-cream/10">
                {cta.secondaryLabel}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ============================ CONTACT FORM ============================ */}
      {/* Shown by default; the CMS can turn it off per product. */}
      {p.showForm ? (
        <ContactForm source={p.slug} section="product.contact" />
      ) : null}

      <PageFooter />
    </main>
  );
}

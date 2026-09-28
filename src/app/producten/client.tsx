/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PageFooter } from "../_ui/SiteChrome";
import ContactFields from "../_ui/ContactFields";
import { AllergenIcon, ALLERGEN_MAP } from "@/lib/allergens";
import { useContent } from "../_ui/ContentProvider";
import Multiline from "../_ui/Multiline";

const OSWALD = { fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 } as const;

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[1.05em] w-[1.05em]">
      <path
        d="M5 12h14m0 0-5-5m5 5-5 5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Category = "Kroketten" | "Mini's & borrelhapjes" | "Aardappel" | "Puree" | "Vegetarisch";

function CroquetteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[15px] w-[15px] shrink-0">
      <rect x="2.5" y="8.5" width="19" height="7" rx="3.5" fill="currentColor" opacity="0.15" />
      <rect x="2.5" y="8.5" width="19" height="7" rx="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 11.4h.01M10 13h.01M13 11h.01M16 12.6h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

// Presentation shape for a product card. Data now comes from the CMS DB and is
// mapped to this shape by the server page (see page.tsx). `allergens` is a list
// of allergen codes (see src/lib/allergens).
type Product = {
  slug: string;
  name: string;
  sub: string;
  allergens: string[];
  src: string;
  frame: string;
  category: Category;
  veggie?: boolean;
};

// Filter values must keep matching the product categories in the DB; only the
// button text (labelKey → producten.grid) is editable.
const CHIPS = [
  { value: "Alles", labelKey: "chipAll" },
  { value: "Kroketten", labelKey: "chipKroketten" },
  { value: "Mini's & borrelhapjes", labelKey: "chipMinis" },
  { value: "Aardappel", labelKey: "chipAardappel" },
  { value: "Puree", labelKey: "chipPuree" },
  { value: "Vegetarisch", labelKey: "chipVeggie" },
] as const;
type Chip = (typeof CHIPS)[number]["value"];

function matches(p: Product, chip: Chip) {
  if (chip === "Alles") return true;
  if (chip === "Vegetarisch") return !!p.veggie;
  return p.category === chip;
}

export default function AssortimentView({ products }: { products: Product[] }) {
  const hero = useContent("producten.hero");
  const { words } = useContent("producten.words");
  const grid = useContent("producten.grid");
  const horeca = useContent("producten.horeca");
  const cta = useContent("producten.cta");
  const [active, setActive] = useState<Chip>("Alles");
  const visible = products.filter((p) => matches(p, active));

  // Allergen popup — holds the product whose allergens are being shown.
  const [allergenInfo, setAllergenInfo] = useState<Product | null>(null);
  useEffect(() => {
    if (!allergenInfo) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAllergenInfo(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [allergenInfo]);

  // Show at most 4 rows, then "load more". Column count is breakpoint-aware so
  // "4 rows" holds on mobile (1), tablet (2) and desktop (3).
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(4);
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      setCols(w >= 1024 ? 3 : w >= 640 ? 2 : 1);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  useEffect(() => setRows(4), [active]); // reset when switching category
  const limit = cols * rows;
  const shown = visible.slice(0, limit);
  const hasMore = visible.length > limit;

  const heroWrapRef = useRef<HTMLDivElement>(null);

  // Hero video is full from the start, with a subtle parallax zoom on scroll.
  useEffect(() => {
    const wrap = heroWrapRef.current;
    if (!wrap) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      wrap.style.transform = "scale(1)";
      return;
    }

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const vh = window.innerHeight;
        const p = Math.min(Math.max(window.scrollY / vh, 0), 1);
        const scale = 1 + 0.1 * p;
        wrap.style.transform = `scale(${scale.toFixed(3)})`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="min-h-screen bg-white text-forest">

      {/* 1. Hero — full video from the start (2/3 height, bottom cropped) */}
      <section className="relative h-[67vh] min-h-[440px] overflow-hidden bg-forest">
        <div
          ref={heroWrapRef}
          className="absolute inset-0 origin-center will-change-transform"
          style={{ transform: "scale(1)" }}
        >
          <video
            className="absolute inset-0 h-full w-full bg-forest object-cover object-top"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={hero.video} type="video/mp4" />
          </video>
        </div>
        {/* premium gradient wash for depth + legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_30%,transparent_40%,rgba(0,0,0,0.45)_100%)]" />

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h1
            className="whitespace-nowrap text-[clamp(1.15rem,6vw,4.6rem)] uppercase leading-[0.95] tracking-[0.01em] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
            style={OSWALD}
          >
            {hero.title} <span className="text-lime">{hero.titleAccent}</span>
          </h1>
          <p className="mt-7 max-w-xl text-base font-medium text-white/85 drop-shadow-[0_1px_10px_rgba(0,0,0,0.6)] sm:text-lg">
            <Multiline text={hero.text} />
          </p>
        </div>

        {/* scroll cue */}
        <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
          <span className="flex h-11 w-7 items-start justify-center rounded-full border-2 border-white/50 p-1.5">
            <span className="h-2 w-1 animate-bounce rounded-full bg-white/80" />
          </span>
        </div>
      </section>

      {/* Word band — static brand words between hero and products */}
      <div className="bg-orange py-4 text-cream sm:py-5">
        <div className="mx-auto flex max-w-[1480px] flex-wrap items-center justify-center gap-x-6 gap-y-2 px-6 sm:gap-x-8">
          {words.map(({ word: w }, i, arr) => (
            <span
              key={i}
              className="flex items-center whitespace-nowrap text-[clamp(1.05rem,2.4vw,1.9rem)] font-bold uppercase tracking-[0.04em]"
              style={OSWALD}
            >
              {w}
              {i < arr.length - 1 && (
                <span className="ml-6 flex items-center text-lime sm:ml-8" aria-hidden>
                  <svg viewBox="0 0 24 16" fill="none" className="h-[0.7em] w-auto">
                    <rect x="1" y="1" width="22" height="14" rx="7" fill="currentColor" opacity="0.2" />
                    <rect x="1" y="1" width="22" height="14" rx="7" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M6 8h.01M10 9.5h.01M14 6.5h.01M18 8.5h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* 2 + 3. Filters + product grid */}
      <section id="assortiment" className="px-6 py-16 sm:px-12 sm:py-24 lg:px-16">
        <div className="mx-auto max-w-[1480px]">
          <div className="flex flex-wrap items-center gap-3">
            {CHIPS.map(({ value: chip, labelKey }) => {
              const on = active === chip;
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setActive(chip)}
                  className={`rounded-full px-5 py-2.5 text-[13px] font-bold uppercase tracking-[0.06em] transition-transform hover:scale-[1.03] ${
                    on
                      ? "bg-forest text-cream"
                      : "border border-forest/15 bg-white text-forest hover:border-forest/30"
                  }`}
                >
                  {grid[labelKey]}
                </button>
              );
            })}
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.08em] text-forest/50">
            {visible.length} {grid.countLabel}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => {
              const amount = p.sub.match(/\d+/)?.[0];
              return (
              <article
                key={p.slug}
                className="group relative flex flex-col rounded-[26px] border border-forest/10 bg-white p-6 text-forest shadow-[0_18px_44px_-18px_rgba(14,75,58,0.28)] transition-all duration-300 hover:-translate-y-1.5 hover:border-forest/20 hover:shadow-[0_34px_66px_-22px_rgba(14,75,58,0.38)] sm:p-7"
              >
                {/* allergen circle icons — top-right corner, overlapping stack.
                    Click to open a popup that lists them by name. */}
                {p.allergens.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setAllergenInfo(p)}
                    aria-label="Bekijk allergenen"
                    className="absolute right-4 top-4 z-10 flex flex-col -space-y-2.5 transition-transform hover:scale-[1.06]"
                  >
                    {p.allergens.map((code) => (
                      <AllergenIcon key={code} code={code} className="h-8 w-8 ring-2 ring-white" />
                    ))}
                  </button>
                )}

                <div className="pr-12">
                  <h3
                    className="text-[clamp(1.2rem,1.8vw,1.7rem)] uppercase leading-[1.05] tracking-tight text-forest"
                    style={OSWALD}
                  >
                    {p.name}
                  </h3>
                </div>

                <div className="relative my-5 aspect-square overflow-hidden rounded-[20px] bg-white">
                  <img
                    src={p.src}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.07]"
                  />
                  {p.veggie && (
                    <span className="absolute left-3 top-3 rounded-full bg-lime px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-forest shadow-sm">
                      {grid.veggieBadge}
                    </span>
                  )}
                </div>

                <div className="mt-auto">
                  {amount && (
                    <span className="mb-3 flex items-center gap-1 text-[13px] font-semibold text-forest/50">
                      {amount}x <CroquetteIcon />
                    </span>
                  )}
                  <Link
                    href={`/product/${p.slug}`}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-forest px-5 py-3.5 text-[13px] font-bold uppercase tracking-[0.06em] text-cream transition-transform hover:scale-[1.02]"
                  >
                    {grid.moreInfo} <ArrowRight />
                  </Link>
                </div>
              </article>
              );
            })}
          </div>

          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setRows((r) => r + 4)}
                className="inline-flex items-center gap-2 rounded-lg bg-forest px-8 py-4 text-[13px] font-bold uppercase tracking-[0.08em] text-cream transition-transform hover:scale-[1.03]"
              >
                {grid.showMore} ({visible.length - shown.length})
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. Voor de horeca band */}
      <section className="px-6 pb-16 sm:px-12 sm:pb-24 lg:px-16">
        <div className="mx-auto max-w-[1480px]">
          <div className="grid items-center gap-8 overflow-hidden rounded-[24px] bg-forest px-8 py-12 text-cream shadow-[0_20px_50px_rgba(0,0,0,0.2)] sm:px-12 sm:py-16 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
            <div>
              <span className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.08em] text-lime">
                <span className="h-2 w-2 rounded-[2px] bg-lime" />
                {horeca.eyebrow}
              </span>
              <h2
                className="mt-5 text-[clamp(2rem,4.4vw,3.4rem)] uppercase leading-[0.98] tracking-[0.01em]"
                style={OSWALD}
              >
                {horeca.title}
              </h2>
              <p className="mt-5 max-w-xl text-cream/80">
                <Multiline text={horeca.text} />
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={horeca.primaryHref || "#"}
                  className="inline-flex items-center gap-2 rounded-lg bg-orange px-6 py-3 text-[13px] font-bold uppercase tracking-[0.06em] text-cream transition-transform hover:scale-[1.03]"
                >
                  {horeca.primaryLabel} <ArrowRight />
                </Link>
                {horeca.secondaryLabel && (
                  <Link
                    href={horeca.secondaryHref || "#"}
                    className="inline-flex items-center gap-2 rounded-lg border border-cream/25 px-6 py-3 text-[13px] font-bold uppercase tracking-[0.06em] text-cream transition-colors hover:bg-cream/10"
                  >
                    {horeca.secondaryLabel}
                  </Link>
                )}
              </div>
            </div>
            <div className="relative aspect-[4/3] w-full lg:aspect-auto lg:h-full lg:min-h-[400px]">
              {horeca.image && (
                <img
                  src={horeca.image}
                  alt={horeca.imageAlt}
                  className="h-full w-full object-contain"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Closing CTA */}
      <section className="px-6 pb-16 sm:px-12 sm:pb-24 lg:px-16">
        <div className="mx-auto max-w-[1480px]">
          <div className="flex flex-col items-center gap-6 rounded-[24px] bg-[var(--light-blue)] px-6 py-14 text-center text-forest shadow-[0_12px_34px_rgba(0,0,0,0.08)] sm:px-8 sm:py-20">
            <span className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.08em] text-forest/70">
              <span className="h-2 w-2 rounded-[2px] bg-orange" />
              {cta.eyebrow}
            </span>
            <h2
              className="max-w-3xl text-[clamp(2rem,5vw,4rem)] uppercase leading-[0.95] tracking-[0.01em]"
              style={OSWALD}
            >
              {cta.title}
            </h2>
            <p className="max-w-xl text-lg font-medium text-forest/75">
              <Multiline text={cta.text} />
            </p>

            <div className="mt-4 w-full max-w-[620px]">
              <ContactFields source="producten" center />
            </div>
          </div>
        </div>
      </section>

      {/* Allergen popup */}
      {allergenInfo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-5"
          role="dialog"
          aria-modal="true"
          aria-label={`Allergenen — ${allergenInfo.name}`}
          onClick={() => setAllergenInfo(null)}
        >
          <div className="absolute inset-0 bg-forest/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md rounded-[26px] bg-white p-7 text-forest shadow-[0_30px_80px_-20px_rgba(14,75,58,0.5)] sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setAllergenInfo(null)}
              aria-label="Sluiten"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-forest/50 transition-colors hover:bg-forest/5 hover:text-forest"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-orange">{grid.allergenEyebrow}</p>
            <h3 className="mt-1.5 text-[clamp(1.4rem,3vw,1.9rem)] uppercase leading-[1.02]" style={OSWALD}>
              {allergenInfo.name}
            </h3>

            <ul className="mt-6 space-y-3">
              {allergenInfo.allergens.map((code) => {
                const a = ALLERGEN_MAP[code];
                if (!a) return null;
                return (
                  <li key={code} className="flex items-center gap-3.5">
                    <AllergenIcon code={code} className="h-11 w-11" />
                    <span className="text-[15px] font-semibold">{a.label}</span>
                  </li>
                );
              })}
            </ul>

            <p className="mt-6 border-t border-forest/10 pt-4 text-[12px] leading-relaxed text-forest/50">
              <Multiline text={grid.allergenNote} />
            </p>
          </div>
        </div>
      )}

      <PageFooter />
    </main>
  );
}

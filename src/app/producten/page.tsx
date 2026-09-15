/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import Link from "next/link";
import { PageFooter } from "../_ui/SiteChrome";

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

type Category = "Kroketten" | "Mini's & borrelhapjes" | "Puree" | "Vegetarisch";

type AllergenCode = "G" | "M" | "E" | "N" | "S";

// —— Allergen icons — each allergen gets its own icon + unique colour ——
const IconSvg = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function WheatIcon() {
  return (
    <svg viewBox="0 0 24 24" {...IconSvg} className="h-[15px] w-[15px]">
      <path d="M12 21V8" />
      <path d="M12 8c0-2.2 1.6-3.8 3.8-3.8C15.8 6.4 14.2 8 12 8Z" />
      <path d="M12 8c0-2.2-1.6-3.8-3.8-3.8C8.2 6.4 9.8 8 12 8Z" />
      <path d="M12 13c0-2.2 1.6-3.8 3.8-3.8C15.8 11.4 14.2 13 12 13Z" />
      <path d="M12 13c0-2.2-1.6-3.8-3.8-3.8C8.2 11.4 9.8 13 12 13Z" />
    </svg>
  );
}
function MilkIcon() {
  return (
    <svg viewBox="0 0 24 24" {...IconSvg} className="h-[15px] w-[15px]">
      <path d="M8 8h8v11a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V8Z" />
      <path d="M8 8l1.4-3h5.2L16 8" />
      <path d="M10.5 13h3" />
    </svg>
  );
}
function EggIcon() {
  return (
    <svg viewBox="0 0 24 24" {...IconSvg} className="h-[15px] w-[15px]">
      <path d="M12 3c3 0 5.5 5 5.5 9a5.5 5.5 0 0 1-11 0c0-4 2.5-9 5.5-9Z" />
    </svg>
  );
}
function NutIcon() {
  return (
    <svg viewBox="0 0 24 24" {...IconSvg} className="h-[15px] w-[15px]">
      <circle cx="12" cy="8.5" r="4" />
      <circle cx="12" cy="15" r="5" />
    </svg>
  );
}
function CeleryIcon() {
  return (
    <svg viewBox="0 0 24 24" {...IconSvg} className="h-[15px] w-[15px]">
      <path d="M12 21c-1-5-3.5-8-7-9 3.5-1 6.5 1 7 5" />
      <path d="M12 21c1-5 3.5-8 7-9-3.5-1-6.5 1-7 5" />
      <path d="M12 21v-8" />
    </svg>
  );
}

function CroquetteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[15px] w-[15px] shrink-0">
      <rect x="2.5" y="8.5" width="19" height="7" rx="3.5" fill="currentColor" opacity="0.15" />
      <rect x="2.5" y="8.5" width="19" height="7" rx="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 11.4h.01M10 13h.01M13 11h.01M16 12.6h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

const ALLERGENS: Record<AllergenCode, { label: string; color: string; icon: ComponentType }> = {
  G: { label: "Gluten", color: "#C98A15", icon: WheatIcon },
  M: { label: "Melk (lactose)", color: "#2F80ED", icon: MilkIcon },
  E: { label: "Ei", color: "#E0A106", icon: EggIcon },
  N: { label: "Noten", color: "#9A6A3C", icon: NutIcon },
  S: { label: "Selderij", color: "#3FA34D", icon: CeleryIcon },
};

function AllergenBadge({ code }: { code: AllergenCode }) {
  const a = ALLERGENS[code];
  const Icon = a.icon;
  return (
    <span
      title={a.label}
      aria-label={a.label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full"
      style={{ color: a.color, backgroundColor: `${a.color}1f` }}
    >
      <Icon />
    </span>
  );
}

type Product = {
  name: string;
  sub: string;
  allergens: AllergenCode[];
  src: string;
  frame: string;
  category: Category;
  veggie?: boolean;
};

const FRAMES = [
  "var(--frame-lime)",
  "var(--frame-pink)",
  "var(--frame-purple)",
  "var(--frame-orange)",
  "var(--frame-gold)",
  "var(--frame-blue)",
];

const IMG = {
  kaas: "/kroketten/prod-kaas.jpg",
  klassiek: "/kroketten/prod-klassiek.jpg",
  garnaal: "/kroketten/prod-garnaal.jpg",
  beertjes: "/kroketten/prod-beertjes.jpg",
} as const;

const PRODUCTS: Product[] = [
  { name: "Kaaskroket", sub: "4 stuks · romig", allergens: ["G", "M", "E"], src: IMG.kaas, frame: FRAMES[0], category: "Kroketten", veggie: true },
  { name: "Klassieke kroket", sub: "12 stuks · ragout", allergens: ["G", "M", "E", "S"], src: IMG.klassiek, frame: FRAMES[1], category: "Kroketten" },
  { name: "Garnaalkroket", sub: "4 stuks · Noordzee", allergens: ["G", "M", "E"], src: IMG.garnaal, frame: FRAMES[2], category: "Kroketten" },
  { name: "Beertjes", sub: "4 stuks · voor de kids", allergens: ["G", "M", "E"], src: IMG.beertjes, frame: FRAMES[3], category: "Kroketten" },
  { name: "Groentekroket", sub: "6 stuks · seizoensgroenten", allergens: ["G", "M", "S"], src: IMG.klassiek, frame: FRAMES[4], category: "Kroketten", veggie: true },
  { name: "Kaas-prei kroket", sub: "6 stuks · romig-pittig", allergens: ["G", "M", "E"], src: IMG.kaas, frame: FRAMES[5], category: "Kroketten", veggie: true },
  { name: "Mini kaas", sub: "24 stuks · borrel", allergens: ["G", "M", "E"], src: IMG.kaas, frame: FRAMES[1], category: "Mini's & borrelhapjes", veggie: true },
  { name: "Mini garnaal", sub: "24 stuks · borrel", allergens: ["G", "M", "E"], src: IMG.garnaal, frame: FRAMES[2], category: "Mini's & borrelhapjes" },
  { name: "Mini bittergarnituur", sub: "36 stuks · feestmix", allergens: ["G", "M", "E", "N"], src: IMG.beertjes, frame: FRAMES[3], category: "Mini's & borrelhapjes" },
  { name: "Mini vlees", sub: "24 stuks · ragout", allergens: ["G", "M", "E", "S"], src: IMG.klassiek, frame: FRAMES[5], category: "Mini's & borrelhapjes" },
  { name: "Ambachtelijke puree", sub: "1 kg · aardappel & boter", allergens: ["M"], src: IMG.klassiek, frame: FRAMES[0], category: "Puree", veggie: true },
  { name: "Truffelpuree", sub: "500 g · zwarte truffel", allergens: ["M", "S"], src: IMG.kaas, frame: FRAMES[4], category: "Puree", veggie: true },
];

const CHIPS = ["Alles", "Kroketten", "Mini's & borrelhapjes", "Puree", "Vegetarisch"] as const;
type Chip = (typeof CHIPS)[number];

function matches(p: Product, chip: Chip) {
  if (chip === "Alles") return true;
  if (chip === "Vegetarisch") return !!p.veggie;
  return p.category === chip;
}

export default function AssortimentPage() {
  const [active, setActive] = useState<Chip>("Alles");
  const visible = PRODUCTS.filter((p) => matches(p, active));

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
            <source src="/ugc/mood.mp4" type="video/mp4" />
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
            Onze kroketten & <span className="text-lime">puree</span>
          </h1>
          <p className="mt-7 max-w-xl text-base font-medium text-white/85 drop-shadow-[0_1px_10px_rgba(0,0,0,0.6)] sm:text-lg">
            Vers gedraaid, met de hand gepaneerd en goudbruin gebakken —
            voor thuis, de betere traiteur en de horeca.
          </p>
        </div>

        {/* scroll cue */}
        <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
          <span className="flex h-11 w-7 items-start justify-center rounded-full border-2 border-white/50 p-1.5">
            <span className="h-2 w-1 animate-bounce rounded-full bg-white/80" />
          </span>
        </div>
      </section>

      {/* Marquee band — scrolling brand words between hero and products */}
      <div className="overflow-hidden bg-orange py-4 text-cream sm:py-5">
        <div className="flex w-max animate-marquee items-center" style={{ animationDuration: "26s" }}>
          {[...Array(2)].flatMap((_, set) =>
            ["Lekker", "Smeuïg", "Ambachtelijk", "Smaakvol", "Knapperig", "Puur Belgisch"].map((w) => (
              <span
                key={`${set}-${w}`}
                className="flex items-center whitespace-nowrap text-[clamp(1.05rem,2.4vw,1.9rem)] font-bold uppercase tracking-[0.04em]"
                style={OSWALD}
              >
                {w}
                <span className="mx-6 text-lime sm:mx-8">✦</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* 2 + 3. Filters + product grid */}
      <section id="assortiment" className="px-6 py-16 sm:px-12 sm:py-24 lg:px-16">
        <div className="mx-auto max-w-[1480px]">
          <div className="flex flex-wrap items-center gap-3">
            {CHIPS.map((chip) => {
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
                  {chip}
                </button>
              );
            })}
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.08em] text-forest/50">
            {visible.length} producten
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => {
              const amount = p.sub.match(/\d+/)?.[0];
              return (
              <article
                key={p.name}
                className="group relative flex flex-col rounded-[26px] border border-forest/10 bg-white p-6 text-forest shadow-[0_18px_44px_-18px_rgba(14,75,58,0.28)] transition-all duration-300 hover:-translate-y-1.5 hover:border-forest/20 hover:shadow-[0_34px_66px_-22px_rgba(14,75,58,0.38)] sm:p-7"
              >
                {/* allergen circle labels — top-right corner, stacked under each other */}
                {p.allergens.length > 0 && (
                  <div
                    className="absolute right-4 top-4 z-10 flex flex-col gap-2"
                    aria-label="Allergenen"
                  >
                    {p.allergens.map((code) => (
                      <AllergenBadge key={code} code={code} />
                    ))}
                  </div>
                )}

                <div className="pr-12">
                  <h3
                    className="text-[clamp(1.2rem,1.8vw,1.7rem)] uppercase leading-[1.05] tracking-tight text-forest"
                    style={OSWALD}
                  >
                    {p.name}
                  </h3>
                </div>

                <div className="relative my-5 aspect-square overflow-hidden rounded-[20px] bg-[#f5f4ef]">
                  <img
                    src={p.src}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.07]"
                  />
                  {p.veggie && (
                    <span className="absolute left-3 top-3 rounded-full bg-lime/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-forest shadow-sm">
                      Veggie
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
                    href="/product"
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-forest px-5 py-3.5 text-[13px] font-bold uppercase tracking-[0.06em] text-cream transition-transform hover:scale-[1.02]"
                  >
                    Meer info <ArrowRight />
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
                Toon meer ({visible.length - shown.length})
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
                Voor de horeca
              </span>
              <h2
                className="mt-5 text-[clamp(2rem,4.4vw,3.4rem)] uppercase leading-[0.98] tracking-[0.01em]"
                style={OSWALD}
              >
                Groothandel &amp; foodservice
              </h2>
              <p className="mt-5 max-w-xl text-cream/80">
                Betrouwbare kwaliteit, constante paneer en scherpe volumeprijzen. Wij leveren
                dagvers aan restaurants, brasserieën, traiteurs en cateraars in heel België —
                met maatwerk voor kaart, portie en verpakking.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 rounded-lg bg-orange px-6 py-3 text-[13px] font-bold uppercase tracking-[0.06em] text-cream transition-transform hover:scale-[1.03]"
                >
                  Vraag horeca-prijzen <ArrowRight />
                </Link>
                <Link
                  href="/over-ons"
                  className="inline-flex items-center gap-2 rounded-lg border border-cream/25 px-6 py-3 text-[13px] font-bold uppercase tracking-[0.06em] text-cream transition-colors hover:bg-cream/10"
                >
                  Over ons
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/3] w-full lg:aspect-auto lg:h-full lg:min-h-[400px]">
              <img
                src="/about/horeca.png"
                alt="Assortiment kroketten in horeca-verpakking, klaar voor groothandel en foodservice"
                className="h-full w-full object-contain"
              />
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
              Zin gekregen?
            </span>
            <h2
              className="max-w-3xl text-[clamp(2rem,5vw,4rem)] uppercase leading-[0.95] tracking-[0.01em]"
              style={OSWALD}
            >
              Bestel je favoriete kroketten
            </h2>
            <p className="max-w-xl text-lg font-medium text-forest/75">
              Voor thuis, de betere traiteur en de horeca. Vers gedraaid, goudbruin gebakken —
              elke dag opnieuw.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="mt-4 grid w-full max-w-[620px] gap-4 text-left">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  name="naam"
                  placeholder="Naam"
                  required
                  className="rounded-lg border border-forest/15 bg-white px-5 py-4 text-forest placeholder:text-forest/40 focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/40"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  required
                  className="rounded-lg border border-forest/15 bg-white px-5 py-4 text-forest placeholder:text-forest/40 focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/40"
                />
              </div>
              <input
                type="text"
                name="onderwerp"
                placeholder="Onderwerp"
                className="rounded-lg border border-forest/15 bg-white px-5 py-4 text-forest placeholder:text-forest/40 focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/40"
              />
              <textarea
                name="bericht"
                placeholder="Je bericht"
                rows={5}
                required
                className="resize-y rounded-lg border border-forest/15 bg-white px-5 py-4 text-forest placeholder:text-forest/40 focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/40"
              />
              <button
                type="submit"
                className="mx-auto inline-flex w-fit items-center gap-2 rounded-lg bg-orange px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-cream transition-transform hover:scale-[1.03]"
              >
                Verstuur <ArrowRight />
              </button>
            </form>
          </div>
        </div>
      </section>

      <PageFooter />
    </main>
  );
}

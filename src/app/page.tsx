"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[1.05em] w-[1.05em]">
      <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Burst({ label }: { label: string }) {
  const spikes = 12;
  const outer = 49;
  const inner = 39;
  const pts: string[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / spikes) * i - Math.PI / 2;
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`);
  }
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <polygon points={pts.join(" ")} fill="#ffffff" stroke="#ff8a00" strokeWidth="2.5" strokeLinejoin="round" />
      <text x="50" y="50" textAnchor="middle" dominantBaseline="central" className="fill-orange" style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 800, fontSize: "17px", letterSpacing: "0.02em" }}>
        {label}
      </text>
    </svg>
  );
}

// About paragraph as tokens — `a` marks accent (orange) words.
const ABOUT: { t: string; a?: boolean }[] = [
  { t: "Kroketco" }, { t: "maakt" }, { t: "al" }, { t: "meer" }, { t: "dan" },
  { t: "25" }, { t: "jaar" }, { t: "ambachtelijke", a: true }, { t: "Belgische", a: true },
  { t: "kroketten." , a: true }, { t: "Vers" }, { t: "gedraaid," }, { t: "met" },
  { t: "de" }, { t: "hand" }, { t: "gepaneerd" }, { t: "en" }, { t: "goudbruin", a: true },
  { t: "gebakken", a: true }, { t: "—" }, { t: "voor" }, { t: "thuis," }, { t: "de" },
  { t: "betere" }, { t: "traiteur" }, { t: "en" }, { t: "de" }, { t: "horeca" },
  { t: "in" }, { t: "heel", a: true }, { t: "België.", a: true },
];

const PRODUCTS = [
  { name: "Kaaskroket", sub: "4 stuks · romig", src: "/kroketten/prod-kaas.jpg" },
  { name: "Klassieke kroket", sub: "12 stuks · ragout", src: "/kroketten/prod-klassiek.jpg" },
  { name: "Mini garnaal", sub: "24 stuks · borrel", src: "/kroketten/prod-garnaal.jpg" },
  { name: "Beertjes", sub: "4 stuks · voor kids", src: "/kroketten/prod-beertjes.jpg" },
];

function ArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M19 12H5m0 0 5 5m-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ArrowRightBig() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function UpRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M7 17 17 7M8 7h9v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CornerArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M6 4v7a3 3 0 0 0 3 3h9m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function HomeV3() {
  const fgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const moodSectionRef = useRef<HTMLElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const moodTextRef = useRef<HTMLDivElement>(null);

  const scrollRow = (dir: number) =>
    rowRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });

  useEffect(() => {
    const words = textRef.current
      ? Array.from(textRef.current.querySelectorAll<HTMLElement>(".rw"))
      : [];

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => w.classList.add("on"));
      if (videoWrapRef.current) videoWrapRef.current.style.transform = "scale(1)";
      if (moodTextRef.current) moodTextRef.current.style.opacity = "1";
      return;
    }

    const fg = fgRef.current;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        const vh = window.innerHeight;
        // hero items stay roughly in place — drift up a touch — and fade out
        if (fg) {
          fg.style.transform = `translate3d(0, ${(-y * 0.1).toFixed(1)}px, 0)`;
          fg.style.opacity = String(Math.max(0, 1 - y / (vh * 0.6)));
        }
        // about text reveals grey -> colour, word by word, as it scrolls up
        if (words.length && textRef.current) {
          const rect = textRef.current.getBoundingClientRect();
          const p = Math.min(
            Math.max((vh * 0.88 - rect.top) / (rect.height * 0.72 + vh * 0.12), 0),
            1
          );
          const n = Math.round(p * words.length);
          words.forEach((w, i) => w.classList.toggle("on", i < n));
        }
        // scroll-grow video: starts small, grows to full, then text fades in
        if (moodSectionRef.current && videoWrapRef.current) {
          const r = moodSectionRef.current.getBoundingClientRect();
          const total = moodSectionRef.current.offsetHeight - vh;
          const p = Math.min(Math.max(-r.top / total, 0), 1);
          const scale = 0.55 + 0.45 * Math.min(p / 0.68, 1);
          videoWrapRef.current.style.transform = `scale(${scale.toFixed(3)})`;
          if (moodTextRef.current) {
            const to = Math.min(Math.max((p - 0.66) / 0.24, 0), 1);
            moodTextRef.current.style.opacity = to.toFixed(3);
            moodTextRef.current.style.transform = `translateY(${((1 - to) * 24).toFixed(1)}px)`;
          }
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="relative bg-black [font-family:var(--font-inter),sans-serif]">
      {/* ============================ STICKY HERO ============================ */}
      <section className="sticky top-0 z-0 h-screen min-h-[640px] w-full overflow-hidden">
        {/* pinned background video */}
        <video
          className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
          autoPlay
          muted
          loop
          playsInline
          poster="/hero/v3-hero.png"
        >
          <source src="/hero/v3-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

        {/* foreground that scrolls up + fades */}
        <div ref={fgRef} className="absolute inset-0 z-10 will-change-transform">
          {/* floating nav — aligned to the hero container width */}
          <header className="absolute inset-x-0 top-6 px-6 sm:px-12 lg:px-16">
            <nav className="relative flex w-full items-center justify-between rounded-full bg-light-blue py-3 pl-7 pr-3 text-forest shadow-[0_12px_34px_rgba(0,0,0,0.18)]">
              <div className="flex items-center gap-7 text-[13px] font-bold uppercase tracking-[0.08em]">
                <a href="#" className="transition-opacity hover:opacity-70">Menu</a>
                <a href="#" className="hidden transition-opacity hover:opacity-70 sm:inline">Over</a>
                <a href="#" className="hidden transition-opacity hover:opacity-70 sm:inline">Contact</a>
              </div>
              <Image src="/hero/logo-kroketco.png" alt="Kroketco" width={2000} height={667} priority className="absolute left-1/2 h-8 w-auto -translate-x-1/2 sm:h-9" />
              <div className="flex items-center gap-4">
                <span className="text-[13px] font-bold tracking-wide">Mandje (0)</span>
                <button aria-label="Menu" className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-full border border-forest/40 transition-colors hover:bg-forest/10">
                  <span className="h-[2px] w-4 bg-forest" />
                  <span className="h-[2px] w-4 bg-forest" />
                </button>
              </div>
            </nav>
          </header>

          {/* headline */}
          <div className="flex h-full flex-col justify-center px-6 sm:px-12 lg:px-16">
            <div className="max-w-2xl">
              <h1
                className="relative text-[clamp(3.5rem,11vw,9.5rem)] uppercase leading-[0.9] tracking-[0.01em] text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)]"
                style={{ fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 }}
              >
                Elke hap
                <br />
                <span className="relative inline-block">
                  een feest
                  <span className="absolute -right-16 -top-6 h-24 w-24 rotate-[-14deg] sm:-right-24 sm:h-28 sm:w-28">
                    <Burst label="VERS!" />
                  </span>
                </span>
              </h1>
              <p className="mt-7 max-w-lg text-lg font-medium leading-snug text-white/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] sm:text-xl">
                Vers gedraaid, goudbruin gebakken. Schuif aan tafel en proef de
                echte Belgische kroket.
              </p>
              <a href="#" className="mt-9 inline-flex items-center gap-3 rounded-lg bg-orange px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-cream transition-transform hover:scale-[1.03]">
                Bekijk menu <ArrowRight />
              </a>
            </div>
          </div>

          {/* product card, bottom-right */}
          <aside className="absolute bottom-6 right-5 w-[240px] rounded-[26px] bg-white p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] sm:bottom-8 sm:right-8 sm:w-[264px]">
            <div className="relative aspect-square w-full overflow-hidden rounded-[18px]">
              <Image src="/ugc/ugc-8.png" alt="Garnaalkroket" fill sizes="264px" className="object-cover" />
            </div>
            <h3 className="mt-3.5 px-1 text-xl font-bold tracking-tight text-forest">Garnaalkroket</h3>
            <a href="#" className="mt-3 flex items-center justify-between rounded-2xl bg-forest px-5 py-3 text-sm font-semibold text-cream transition-transform hover:scale-[1.02]">
              Meer info <ArrowRight />
            </a>
          </aside>
        </div>
      </section>

      {/* ============ WHITE SECTION — scrolls up and overlaps the hero ============ */}
      <section className="relative z-10 -mt-8 min-h-screen rounded-t-[44px] bg-white px-6 pb-32 pt-24 shadow-[0_-30px_60px_rgba(0,0,0,0.25)] sm:px-12 sm:pt-32 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="mb-10 flex items-center gap-2 text-[13px] font-medium tracking-wide text-forest/50">
            <span className="text-orange">＋</span> Over Kroketco
          </p>
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_240px] lg:gap-16">
            <p
              ref={textRef}
              className="text-[clamp(1.7rem,3.8vw,3rem)] font-medium leading-[1.28] tracking-tight [text-align:justify]"
            >
              {ABOUT.map((w, i) => (
                <span key={i} className={`rw${w.a ? " accent font-semibold" : ""}`}>
                  {w.t}{" "}
                </span>
              ))}
            </p>

            <div className="flex flex-col gap-4">
              <a href="#" className="rounded-xl bg-forest px-6 py-4 text-center text-sm font-semibold text-cream transition-transform hover:scale-[1.02]">
                Meer over ons
              </a>
              <a href="#" className="rounded-xl bg-orange px-6 py-4 text-center text-sm font-semibold text-cream transition-transform hover:scale-[1.02]">
                Neem contact op
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PRODUCT CAROUSEL (dark) ============ */}
      <section className="relative z-10 bg-forest px-6 py-24 text-cream sm:px-12 sm:py-28 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="mb-5 flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.28em] text-lime">
                <span className="h-2 w-2 rounded-[2px] bg-lime" /> Ons assortiment
              </p>
              <h2 className="max-w-2xl text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.06] tracking-tight">
                Ambachtelijke kroketten voor elk moment.
              </h2>
            </div>
            <div className="hidden shrink-0 items-center gap-3 sm:flex">
              <button onClick={() => scrollRow(-1)} aria-label="Vorige" className="grid h-12 w-12 place-items-center rounded-full border border-cream/25 text-cream transition-colors hover:bg-cream/10">
                <ArrowLeft />
              </button>
              <button onClick={() => scrollRow(1)} aria-label="Volgende" className="grid h-12 w-12 place-items-center rounded-full bg-cream text-forest transition-transform hover:scale-105">
                <ArrowRightBig />
              </button>
            </div>
          </div>

          <div
            ref={rowRef}
            className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {/* feature card (UGC image) */}
            <article className="relative aspect-[3/4] w-[280px] shrink-0 snap-start overflow-hidden rounded-[26px] sm:w-[300px]">
              <Image src="/ugc/ugc-1.png" alt="Genieten van Kroketco kroketten" fill sizes="300px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/15" />
              <h3 className="absolute left-5 top-5 text-2xl font-semibold text-white drop-shadow">Onze kroketten</h3>
              <a href="#" className="absolute inset-x-4 bottom-4 flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-forest transition-transform hover:scale-[1.02]">
                <CornerArrow /> Bekijk assortiment
              </a>
            </article>

            {/* product cards */}
            {PRODUCTS.map((p) => (
              <article key={p.name} className="flex aspect-[3/4] w-[280px] shrink-0 snap-start flex-col rounded-[26px] bg-white p-5 text-forest sm:w-[300px]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight">{p.name}</h3>
                    <p className="mt-0.5 text-[13px] text-forest/55">{p.sub}</p>
                  </div>
                  <a href="#" aria-label={`Bekijk ${p.name}`} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest text-cream transition-transform hover:scale-105">
                    <UpRight />
                  </a>
                </div>
                <div className="relative mt-4 flex-1 overflow-hidden rounded-2xl bg-[#f5f4ef]">
                  <Image src={p.src} alt={p.name} fill sizes="300px" className="object-cover" />
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 rounded-full bg-forest/[0.06] py-2.5 text-[13px] font-medium text-forest/60">
                  <InfoIcon /> Allergenen &amp; info
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SCROLL-GROW VIDEO ============ */}
      <section ref={moodSectionRef} className="relative z-10 h-[220vh] bg-forest">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-3 py-3">
          <div
            ref={videoWrapRef}
            className="relative h-full w-full origin-center overflow-hidden rounded-[36px] will-change-transform"
            style={{ transform: "scale(0.55)" }}
          >
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster="/ugc/ugc-3.png"
            >
              <source src="/ugc/mood.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />

            {/* text reveals once the video has grown */}
            <div
              ref={moodTextRef}
              className="absolute inset-0 flex flex-col justify-center px-8 will-change-[opacity,transform] sm:px-14 lg:px-20"
              style={{ opacity: 0 }}
            >
              <div className="max-w-xl">
                <h2
                  className="text-[clamp(2.5rem,6vw,5rem)] uppercase leading-[0.95] tracking-[0.01em] text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)]"
                  style={{ fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 }}
                >
                  De perfecte kroket
                  <br />
                  voor elk moment
                </h2>
                <p className="mt-6 max-w-md text-white/85 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
                  Ambachtelijk bereid met verse Belgische ingrediënten. Ideaal
                  voor feesten, events of gewoon thuis — krokant vanbuiten, romig
                  vanbinnen.
                </p>
                <a href="#" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-orange px-7 py-4 text-sm font-bold uppercase tracking-[0.08em] text-cream transition-transform hover:scale-[1.03]">
                  Meer over ons <ArrowRight />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="relative z-10 bg-forest px-6 py-12 text-cream sm:px-12 lg:px-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm sm:flex-row">
          <Image src="/hero/logo-kroketco.png" alt="Kroketco" width={2000} height={667} className="h-8 w-auto brightness-0 invert" />
          <span className="text-cream/60">© 2026 Kroketco Belgium · Gent</span>
        </div>
      </footer>
    </main>
  );
}

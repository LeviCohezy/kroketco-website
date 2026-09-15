"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import VideoSection from "../VideoSection";
import BestSellers from "../BestSellers";

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

export default function HomeTwo() {
  const fgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const words = textRef.current
      ? Array.from(textRef.current.querySelectorAll<HTMLElement>(".rw"))
      : [];

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => w.classList.add("on"));
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
      <section className="relative z-10 -mt-8 rounded-t-[44px] bg-white px-6 pb-16 pt-24 shadow-[0_-30px_60px_rgba(0,0,0,0.25)] sm:px-12 sm:pt-32 lg:px-16">
        <div className="mx-auto max-w-[1480px]">
          <p className="mb-10 flex items-center gap-2 text-[13px] font-medium tracking-wide text-forest/50">
            <span className="text-orange">＋</span> Over Kroketco
          </p>
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_240px] lg:gap-16">
            <p
              ref={textRef}
              className="text-[clamp(1.4rem,3.1vw,2.45rem)] font-medium leading-[1.3] tracking-tight [text-align:justify]"
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

      {/* ============ TWO BIG CATEGORY CARDS (white) ============ */}
      <section className="relative z-10 bg-white px-6 pb-28 pt-4 sm:px-12 lg:px-16">
        <div className="mx-auto grid max-w-[1480px] gap-6 lg:grid-cols-2">
          {/* Kroketten */}
          <article className="group relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-[32px] p-8 sm:p-10">
            <Image
              src="/cards/kroketten.png"
              alt="Ambachtelijke Belgische kroketten"
              fill
              sizes="(min-width: 1024px) 720px, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="relative max-w-[62%]">
              <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.28em] text-forest/70">
                Ons assortiment
              </p>
              <h2
                className="text-[clamp(2.2rem,4.4vw,3.6rem)] uppercase leading-[0.95] tracking-[0.01em] text-forest"
                style={{ fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 }}
              >
                Ontdek al<br />onze kroketten
              </h2>
            </div>
            <a
              href="#"
              className="relative inline-flex w-fit items-center gap-3 rounded-lg bg-forest px-7 py-4 text-sm font-bold uppercase tracking-[0.08em] text-cream transition-transform hover:scale-[1.03]"
            >
              Bekijk kroketten <ArrowRight />
            </a>
          </article>

          {/* Puree */}
          <article className="group relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-[32px] p-8 sm:p-10">
            <Image
              src="/cards/puree.png"
              alt="Verse aardappelpuree"
              fill
              sizes="(min-width: 1024px) 720px, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="relative max-w-[62%]">
              <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.28em] text-forest/70">
                Ons assortiment
              </p>
              <h2
                className="text-[clamp(2.2rem,4.4vw,3.6rem)] uppercase leading-[0.95] tracking-[0.01em] text-forest"
                style={{ fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 }}
              >
                Ontdek al<br />onze puree
              </h2>
            </div>
            <a
              href="#"
              className="relative inline-flex w-fit items-center gap-3 rounded-lg bg-forest px-7 py-4 text-sm font-bold uppercase tracking-[0.08em] text-cream transition-transform hover:scale-[1.03]"
            >
              Bekijk puree <ArrowRight />
            </a>
          </article>
        </div>
      </section>

      {/* ============ FULL-WIDTH VIDEO (plays on scroll) ============ */}
      <VideoSection />

      {/* ============ FEATURE ICONS (white, square bottom) ============ */}
      <BestSellers squareBottom />

      {/* ============ STORY BANNER (split panel + photo) — full width ============ */}
      <section className="relative z-10 bg-white pb-28">
        <div className="grid md:grid-cols-2">
          {/* colored text panel */}
          <div className="flex flex-col justify-center bg-forest px-8 py-16 text-cream sm:px-12 sm:py-20 lg:px-20">
            <h2
              className="text-[clamp(1.7rem,3.2vw,2.8rem)] uppercase leading-[1.02] tracking-[0.01em]"
              style={{ fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 }}
            >
              Al meer dan 25 jaar draaien wij de lekkerste Belgische kroketten.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/80 sm:text-base">
              Ontdek onze ambachtelijke kroketten en verse puree, met de hand
              gemaakt door een familiebedrijf dat kwaliteit en traditie hoog in
              het vaandel draagt.
            </p>
            <a
              href="#"
              className="mt-8 inline-flex w-fit items-center gap-2 text-[13px] font-bold uppercase tracking-[0.14em] text-cream underline-offset-[6px] transition-opacity hover:opacity-70 hover:underline"
            >
              Meer weten <ArrowRight />
            </a>
          </div>

          {/* photo */}
          <div className="relative min-h-[373px] md:min-h-[560px]">
            <Image
              src="/about/atelier.png"
              alt="Kroketten worden met de hand geproduceerd in ons atelier"
              fill
              sizes="(min-width: 768px) 720px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

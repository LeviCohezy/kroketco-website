"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import HistoryTimeline from "./HistoryTimeline";
import BestSellers from "./BestSellers";
import Marquee from "./Marquee";
import VideoSection from "./VideoSection";

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

const PARTNERS = [
  { name: "Steen Food Masters", desc: "Food & non-food" },
  { name: "Huppa", desc: "Oostende & Wortegem-Petegem" },
  { name: "Rafina", desc: "Lauwe · sinds 1954" },
  { name: "Duva Fruit", desc: "Groenten & fruit · Gistel" },
  { name: "Vlaemynck Natuurlijk", desc: "Aardappelproducten · Veurne" },
  { name: "Biervliet Freez Center", desc: "Diepvries · Diksmuide" },
  { name: "Fresh by Vero", desc: "Groenten & fruit · Poperinge" },
];

// Partner logo badges — a coloured outline ring with a lighter tinted interior,
// each tint chosen to sit with that partner's own logo colours. Scattered around
// the small video stage (never behind it), popping in one-by-one on scroll.
const PARTNER_BADGES = [
  { src: "/partners/logo-steen.3bac4d420028.svg", name: "Steen Food Masters", ring: "#d22026", fill: "#fbe5e4", pad: "20%", top: "16%", left: "9%", rot: -8, scale: 1, delay: 300 },
  { src: "/partners/logo.svg", name: "Duva Fruit", ring: "#00694f", fill: "#e7f2ec", pad: "16%", top: "45%", left: "6%", rot: 7, scale: 0.95, delay: 120 },
  { src: "/partners/logo-freezcenter.png", name: "Biervliet Freez Center", ring: "#3e6be6", fill: "#e8eefb", pad: "14%", top: "76%", left: "13%", rot: 5, scale: 0.9, delay: 540 },
  { src: "/partners/rafina.svg", name: "Rafina", ring: "#075185", fill: "#e6eff6", pad: "13%", top: "17%", left: "89%", rot: 6, scale: 0.88, delay: 0 },
  { src: "/partners/HUPPA_Logo_Screen_Black_RGB.svg", name: "Huppa", ring: "#0e4b3a", fill: "#e9f2ec", pad: "12%", top: "46%", left: "92%", rot: -5, scale: 1.1, delay: 380 },
  { src: "/partners/VlaemynckNatuurlijk_logo_header.svg", name: "Vlaemynck Natuurlijk", ring: "#c7e36a", fill: "#0e4b3a", pad: "13%", top: "73%", left: "86%", rot: -9, scale: 1.02, delay: 660 },
  { src: "/partners/xfreshbyvero-logo.png.pagespeed.ic.tV35_7rs2f.webp", name: "Fresh by Vero", ring: "#4bad43", fill: "#ecf6e9", pad: "13%", top: "88%", left: "49%", rot: -6, scale: 0.98, delay: 210 },
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
export default function HomeV3() {
  const heroRef = useRef<HTMLElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const moodSectionRef = useRef<HTMLElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const moodTextRef = useRef<HTMLDivElement>(null);
  const badgeLayerRef = useRef<HTMLDivElement>(null);
  const aboveTitleRef = useRef<HTMLDivElement>(null);
  const [badgesIn, setBadgesIn] = useState(false);
  const [partnerPage, setPartnerPage] = useState(0); // 0 → partners 1-4, 1 → 5-7
  const [productIdx, setProductIdx] = useState(0);

  // width of one product card + gap (gap-5 = 20px)
  const productStep = () => {
    const row = rowRef.current;
    if (!row) return 1;
    const card = row.children[0] as HTMLElement | undefined;
    return card ? card.offsetWidth + 20 : row.clientWidth;
  };
  const goToProduct = (i: number) =>
    rowRef.current?.scrollTo({ left: i * productStep(), behavior: "smooth" });

  // auto-cycle the partners list between its two pages
  useEffect(() => {
    const id = setInterval(() => setPartnerPage((p) => (p === 0 ? 1 : 0)), 4000);
    return () => clearInterval(id);
  }, []);

  // product slider: track the active card on scroll + auto-advance on a timer
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setProductIdx(Math.round(row.scrollLeft / productStep()));
      });
    };
    row.addEventListener("scroll", onScroll, { passive: true });
    const id = setInterval(() => {
      const next = (Math.round(row.scrollLeft / productStep()) + 1) % PRODUCTS.length;
      row.scrollTo({ left: next * productStep(), behavior: "smooth" });
    }, 3800);
    return () => {
      row.removeEventListener("scroll", onScroll);
      clearInterval(id);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // scroll-into-view reveal for any element tagged with `.reveal` (across sections)
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const scrollRow = (dir: number) =>
    rowRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });

  // Once each hero intro animation finishes, strip its classes so the
  // fill-mode:both final state stops overriding :hover transforms.
  useEffect(() => {
    const root = heroRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>(".hero-anim"));
    const onEnd = (e: Event) => {
      const t = e.currentTarget as HTMLElement;
      t.classList.remove("hero-anim", "hero-rise", "hero-drop", "hero-slide", "hero-pop", "hero-zoom");
    };
    els.forEach((el) => el.addEventListener("animationend", onEnd, { once: true }));
    return () => els.forEach((el) => el.removeEventListener("animationend", onEnd));
  }, []);

  useEffect(() => {
    const words = textRef.current
      ? Array.from(textRef.current.querySelectorAll<HTMLElement>(".rw"))
      : [];

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => w.classList.add("on"));
      if (videoWrapRef.current) videoWrapRef.current.style.transform = "scale(1)";
      if (moodTextRef.current) moodTextRef.current.style.opacity = "1";
      setBadgesIn(true);
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
          if (total <= 0) return; // desktop-only scroll-grow is hidden on mobile
          const p = Math.min(Math.max(-r.top / total, 0), 1);
          const startScale = window.innerWidth < 640 ? 0.24 : 0.5; // very small on mobile
          const scale = startScale + (1 - startScale) * Math.min(p / 0.68, 1);
          videoWrapRef.current.style.transform = `scale(${scale.toFixed(3)})`;

          // partner badges: pop in one-by-one once the section is ~50% into view,
          // then fade the whole layer (badges + title) as the video grows.
          if (r.top < vh * 0.5) setBadgesIn(true);
          const fade = 1 - Math.min(Math.max((p - 0.14) / 0.34, 0), 1);
          if (badgeLayerRef.current) badgeLayerRef.current.style.opacity = fade.toFixed(3);
          if (aboveTitleRef.current)
            aboveTitleRef.current.style.transform = `translate(-50%, ${(-(1 - fade) * 22).toFixed(1)}px)`;

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
      <section ref={heroRef} className="sticky top-0 z-0 h-screen min-h-[640px] w-full overflow-hidden">
        {/* pinned background video */}
        <video
          className="hero-anim hero-zoom absolute inset-0 h-full w-full object-cover object-[70%_center]"
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
                <span className="block">
                  <span className="hero-anim hero-rise inline-block" style={{ animationDelay: "0.35s" }}>
                    Elke hap
                  </span>
                </span>
                <span className="block">
                  <span className="hero-anim hero-rise relative inline-block" style={{ animationDelay: "0.47s" }}>
                    een feest
                    <span
                      className="hero-anim hero-pop absolute -right-24 -top-6 h-20 w-20 rotate-[-14deg] sm:-right-24 sm:h-28 sm:w-28"
                      style={{ animationDelay: "0.95s" }}
                    >
                      <Burst label="VERS!" />
                    </span>
                  </span>
                </span>
              </h1>
              <p className="hero-anim hero-rise mt-7 max-w-lg text-lg font-medium leading-snug text-white/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] sm:text-xl" style={{ animationDelay: "0.66s" }}>
                Vers gedraaid, goudbruin gebakken. Schuif aan tafel en proef de
                echte Belgische kroket.
              </p>
              <a href="#" className="hero-anim hero-rise mt-9 inline-flex items-center gap-3 rounded-lg bg-orange px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-cream transition-transform hover:scale-[1.03]" style={{ animationDelay: "0.8s" }}>
                Bekijk menu <ArrowRight />
              </a>
            </div>
          </div>

          {/* product card, bottom-right */}
          <aside className="hero-anim hero-slide absolute bottom-12 right-5 hidden w-[240px] rounded-[26px] bg-white p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] sm:block sm:bottom-16 sm:right-8 sm:w-[264px]" style={{ animationDelay: "0.62s" }}>
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
          <p className="reveal mb-10 flex items-center gap-2 text-[13px] font-medium tracking-wide text-forest/50">
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

            <div className="reveal flex flex-col gap-4 sm:flex-row lg:flex-col" style={{ transitionDelay: "0.1s" }}>
              <a href="#" className="rounded-xl bg-forest px-6 py-4 text-center text-sm font-semibold text-cream transition-transform hover:scale-[1.02] sm:flex-1 lg:flex-none">
                Meer over ons
              </a>
              <a href="#" className="rounded-xl bg-orange px-6 py-4 text-center text-sm font-semibold text-cream transition-transform hover:scale-[1.02] sm:flex-1 lg:flex-none">
                Neem contact op
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FULL-WIDTH VIDEO (plays on scroll) — above the icons ============ */}
      <VideoSection />

      {/* ============ FEATURE ICONS (white, rounded bottom — overlaps the green below) ============ */}
      <BestSellers />

      {/* ============ PRODUCT CAROUSEL (dark green — revealed under the white overlap) ============ */}
      <section className="relative z-10 -mt-[44px] bg-forest px-6 pt-28 pb-24 text-cream sm:px-12 sm:pb-28 lg:px-16">
        <div className="mx-auto max-w-[1480px]">
          <div className="flex items-end justify-between gap-6">
            <div className="reveal">
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
            {/* product cards — title on top, product centered, button under */}
            {PRODUCTS.map((p, i) => (
              <article
                key={p.name}
                className="reveal group flex aspect-[4/5] w-[80vw] shrink-0 snap-start flex-col rounded-[28px] bg-white p-6 text-forest sm:w-[360px]"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <h3
                  className="text-center text-[clamp(1.35rem,2vw,1.8rem)] uppercase leading-[1.05] tracking-tight"
                  style={{ fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 }}
                >
                  {p.name}
                </h3>
                <div className="relative my-5 flex-1 overflow-hidden rounded-[20px] bg-[#f5f4ef]">
                  <Image src={p.src} alt={p.name} fill sizes="360px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <a
                  href="#"
                  className="rounded-lg bg-orange px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.08em] text-cream transition-transform hover:scale-[1.02]"
                >
                  Bestel nu
                </a>
              </article>
            ))}
          </div>

          {/* slider dots — signal there's more + reflect the auto-advancing slide */}
          <div className="mt-8 flex justify-center gap-2.5">
            {PRODUCTS.map((_, i) => (
              <button
                key={i}
                aria-label={`Ga naar product ${i + 1}`}
                onClick={() => goToProduct(i)}
                className={`h-2 rounded-full transition-all ${
                  i === productIdx ? "w-7 bg-cream" : "w-2 bg-cream/40 hover:bg-cream/70"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============ IMAGE SECTION — landscape (desktop/tablet/landscape-mobile) or
           9:16 portrait (mobile portrait), with three scattered sticker labels.
           Timeline scrolls up and overlaps it. ============ */}
      <div className="relative isolate">
        <section className="sticky top-0 z-0 w-full overflow-hidden">
          <picture>
            <source
              media="(max-width: 640px) and (orientation: portrait)"
              srcSet="/new-image-section/eten-portrait.png"
            />
            <img
              src="/new-image-section/eten-landscape.png"
              alt="Vrouw geniet van een krokante ambachtelijke Kroketco kroket"
              className="block h-auto w-full"
            />
          </picture>

          {/* sticker labels */}
          <img
            src="/new-image-section/label-lekerrr.png"
            alt="Lekkerrr!"
            className="absolute left-[13%] top-[13%] w-[clamp(90px,13vw,180px)] -translate-x-1/2 -translate-y-1/2 rotate-[-9deg] drop-shadow-[0_10px_24px_rgba(0,0,0,0.28)]"
          />
          <img
            src="/new-image-section/label-ambachtelijk.png"
            alt="Ambachtelijk"
            className="absolute left-[84%] top-[15%] w-[clamp(96px,14vw,190px)] -translate-x-1/2 -translate-y-1/2 rotate-[8deg] drop-shadow-[0_10px_24px_rgba(0,0,0,0.28)]"
          />
          <img
            src="/new-image-section/label-krokant.png"
            alt="Krokant!"
            className="absolute left-[16%] top-[84%] w-[clamp(88px,12.5vw,170px)] -translate-x-1/2 -translate-y-1/2 rotate-[6deg] drop-shadow-[0_10px_24px_rgba(0,0,0,0.28)] max-sm:portrait:left-[26%] max-sm:portrait:top-[80%]"
          />
        </section>

        {/* ============ TIMELINE (scroll-driven, overlaps the sticky image) ============ */}
        <HistoryTimeline />
      </div>

      {/* Light-blue backstop — an opaque floor behind the light-blue sections so a
          sub-pixel seam between them can't reveal the pinned hero video. */}
      <div className="relative z-10 bg-[var(--light-blue)]">
      {/* ============ SCROLL-GROW VIDEO — small video, partner-logo badges pop in,
           then the video grows as you scroll (mobile + desktop) ============ */}
      <div className="relative z-20">
        <section
          ref={moodSectionRef}
          className="relative z-10 h-[220vh] bg-[var(--light-blue)]"
        >
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-3 py-3">
          {/* title + scattered partner badges — sit behind the growing video and
              fade out as it fills the stage */}
          <div ref={badgeLayerRef} aria-hidden className="pointer-events-none absolute inset-0 z-0">
            {/* section title, above the small video */}
            <div
              ref={aboveTitleRef}
              className="absolute left-1/2 top-[3%] w-full max-w-[760px] px-6 text-center will-change-transform"
              style={{ transform: "translate(-50%, 0)" }}
            >
              <h2
                className="text-[clamp(1.8rem,4.4vw,3.8rem)] uppercase leading-[0.95] tracking-[0.01em] text-forest"
                style={{ fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 }}
              >
                Sterk dankzij onze partners
              </h2>
            </div>

            {/* partner badges */}
            {PARTNER_BADGES.map((b) => (
              <div
                key={b.name}
                className="absolute h-[clamp(72px,7.6vw,120px)] w-[clamp(72px,7.6vw,120px)] will-change-transform"
                style={{
                  top: b.top,
                  left: b.left,
                  transform: `translate(-50%, -50%) rotate(${b.rot}deg) scale(${badgesIn ? b.scale : b.scale * 0.2})`,
                  opacity: badgesIn ? 1 : 0,
                  transition: `transform 0.55s cubic-bezier(0.34,1.56,0.64,1) ${b.delay}ms, opacity 0.4s ease ${b.delay}ms`,
                }}
              >
                <div
                  className="grid h-full w-full place-items-center rounded-full shadow-[0_10px_26px_rgba(14,75,58,0.18)]"
                  style={{ backgroundColor: b.fill, border: `3px solid ${b.ring}` }}
                >
                  <img
                    src={b.src}
                    alt={b.name}
                    className="h-full w-full object-contain"
                    style={{ padding: b.pad }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div
            ref={videoWrapRef}
            className="relative z-10 h-full w-full origin-center overflow-hidden rounded-[36px] will-change-transform"
            style={{ transform: "scale(0.5)" }}
          >
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster="/ugc/ugc-3.png"
            >
              <source src="/video/partners.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/40" />

            {/* partners list reveals once the video has grown */}
            <div
              ref={moodTextRef}
              className="absolute inset-0 flex flex-col justify-center px-8 will-change-[opacity,transform] sm:justify-end sm:px-14 sm:pb-12 lg:justify-center lg:pb-0 lg:px-20"
              style={{ opacity: 0 }}
            >
              <div className="w-full lg:max-w-[50%]">
                <h2
                  className="mb-6 text-[clamp(1.9rem,3.8vw,3.3rem)] uppercase leading-[0.95] tracking-[0.01em] text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)] sm:mb-8"
                  style={{ fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 }}
                >
                  Versgroothandels in heel Vlaanderen
                </h2>
                {/* paginated list — 4 then 3; padded to 4 slots so height (and the
                    button below) stays fixed between pages */}
                <ul key={partnerPage} className="border-t border-white/15">
                  {Array.from({ length: 4 }).map((_, i) => {
                    const p = PARTNERS[partnerPage * 4 + i];
                    if (!p) {
                      return (
                        <li key={`empty-${i}`} aria-hidden className="border-b border-transparent">
                          <span className="flex min-h-[clamp(58px,7vw,80px)] items-center text-[clamp(1.15rem,2.3vw,1.8rem)]">
                            &nbsp;
                          </span>
                        </li>
                      );
                    }
                    return (
                      <li
                        key={p.name}
                        className="partner-row border-b border-white/15"
                        style={{ animationDelay: `${i * 80}ms` }}
                      >
                        <a
                          href="/partners"
                          className="group flex min-h-[clamp(58px,7vw,80px)] items-center gap-4 sm:gap-6"
                        >
                          <span className="w-7 shrink-0 text-sm font-semibold tabular-nums text-white/45">
                            {String(partnerPage * 4 + i + 1).padStart(2, "0")}
                          </span>
                          <span className="flex-1 text-[clamp(1.15rem,2.3vw,1.8rem)] font-bold tracking-tight text-white transition-colors group-hover:text-lime">
                            {p.name}
                          </span>
                          <span className="hidden whitespace-nowrap rounded-full bg-lime px-3.5 py-1.5 text-xs font-semibold text-forest md:block">
                            {p.desc}
                          </span>
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-light-blue text-forest transition-transform group-hover:translate-x-1">
                            <ArrowRight />
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>

                <a
                  href="/partners"
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange px-7 py-4 text-sm font-bold uppercase tracking-[0.08em] text-cream transition-transform hover:scale-[1.03] sm:mt-8"
                >
                  Ontdek onze partners <ArrowRight />
                </a>
              </div>
            </div>
          </div>
        </div>
        </section>
      </div>

      {/* ============ MARQUEE (auto-scrolling UGC cards) — under the scroll-grow video ============ */}
      <Marquee />

      {/* ============ CONTACT FORM ============ */}
      <section id="contact" className="relative z-10 bg-[var(--light-blue)] px-6 py-20 text-forest sm:px-12 sm:py-28 lg:px-16">
        <div className="mx-auto max-w-[720px]">
          <h2
            className="reveal text-center text-[clamp(2.6rem,8vw,6rem)] uppercase leading-[0.95] tracking-[0.01em]"
            style={{ fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 }}
          >
            Contacteer ons
          </h2>

          <form onSubmit={(e) => e.preventDefault()} className="reveal mt-12 grid gap-5" style={{ transitionDelay: "0.12s" }}>
            <div className="grid gap-5 sm:grid-cols-2">
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
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-orange px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-cream transition-transform hover:scale-[1.03]"
            >
              Verstuur <ArrowRight />
            </button>
          </form>
        </div>
      </section>
      </div>

      {/* footer */}
      <footer className="relative z-10 bg-forest px-6 py-12 text-cream sm:px-12 lg:px-16">
        <div className="reveal mx-auto flex max-w-[1480px] flex-col items-center justify-between gap-4 text-sm sm:flex-row">
          <Image src="/hero/logo-kroketco.png" alt="Kroketco" width={2000} height={667} className="h-8 w-auto brightness-0 invert" />
          <span className="text-cream/60">© 2026 Kroketco Belgium · Gent</span>
        </div>
      </footer>
    </main>
  );
}

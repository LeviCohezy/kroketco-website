"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import HistoryTimeline from "./HistoryTimeline";
import BestSellers from "./BestSellers";
import Marquee from "./Marquee";
import VideoSection from "./VideoSection";
import ContactFields from "./_ui/ContactFields";
import { PageFooter } from "./_ui/SiteChrome";
import { useContent, useEditor } from "./_ui/ContentProvider";
import { EditableText, EditableImage, EditableLink, EditableVideo } from "./_ui/edit/Editable";

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

// Partner logo badges — a coloured outline ring with a lighter tinted interior,
// each tint chosen to sit with the default partner's own logo colours. Scattered
// around the small video stage (never behind it), popping in one-by-one on scroll.
// Styling is per position; the logos themselves come from the CMS (home.partners).
const BADGE_STYLES = [
  { ring: "#d22026", fill: "#fbe5e4", pad: "20%", top: "16%", left: "9%", rot: -8, scale: 1, delay: 300 },
  { ring: "#00694f", fill: "#e7f2ec", pad: "16%", top: "45%", left: "6%", rot: 7, scale: 0.95, delay: 120 },
  { ring: "#3e6be6", fill: "#e8eefb", pad: "14%", top: "76%", left: "13%", rot: 5, scale: 0.9, delay: 540 },
  { ring: "#075185", fill: "#e6eff6", pad: "13%", top: "17%", left: "89%", rot: 6, scale: 0.88, delay: 0 },
  { ring: "#0e4b3a", fill: "#e9f2ec", pad: "12%", top: "46%", left: "92%", rot: -5, scale: 1.1, delay: 380 },
  { ring: "#c7e36a", fill: "#0e4b3a", pad: "13%", top: "73%", left: "86%", rot: -9, scale: 1.02, delay: 660 },
  { ring: "#4bad43", fill: "#ecf6e9", pad: "13%", top: "88%", left: "49%", rot: -6, scale: 0.98, delay: 210 },
];

// Sticker placement over the big photo, per position (images from home.photo).
const STICKER_CLASSES = [
  "absolute left-[13%] top-[13%] w-[clamp(90px,13vw,180px)] -translate-x-1/2 -translate-y-1/2 rotate-[-9deg] drop-shadow-[0_10px_24px_rgba(0,0,0,0.28)]",
  "absolute left-[84%] top-[15%] w-[clamp(96px,14vw,190px)] -translate-x-1/2 -translate-y-1/2 rotate-[8deg] drop-shadow-[0_10px_24px_rgba(0,0,0,0.28)]",
  "absolute left-[16%] top-[84%] w-[clamp(88px,12.5vw,170px)] -translate-x-1/2 -translate-y-1/2 rotate-[6deg] drop-shadow-[0_10px_24px_rgba(0,0,0,0.28)] max-sm:portrait:left-[26%] max-sm:portrait:top-[80%]",
];

const PARTNERS_PER_PAGE = 4;

// Split the intro paragraph into words; accent parts are marked (orange).
function aboutWords(parts: { text: string; accent: string }[]) {
  const out: { t: string; a?: boolean }[] = [];
  for (const p of parts) {
    for (const t of p.text.split(/\s+/)) if (t) out.push({ t });
    for (const t of p.accent.split(/\s+/)) if (t) out.push({ t, a: true });
  }
  return out;
}

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
  const hero = useContent("home.hero");
  const intro = useContent("home.intro");
  const products = useContent("home.products");
  const photo = useContent("home.photo");
  const partners = useContent("home.partners");
  const contact = useContent("home.contact");
  const { editing } = useEditor();
  const ABOUT = aboutWords(intro.parts);
  const PRODUCTS = products.items;
  const PARTNERS = partners.partners;
  const partnerPages = Math.max(1, Math.ceil(PARTNERS.length / PARTNERS_PER_PAGE));
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
  const [partnerPageRaw, setPartnerPage] = useState(0); // page of 4 partners
  const partnerPage = partnerPageRaw % partnerPages;
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

  // auto-cycle the partners list through its pages
  useEffect(() => {
    if (partnerPages < 2) return;
    const id = setInterval(() => setPartnerPage((p) => (p + 1) % partnerPages), 4000);
    return () => clearInterval(id);
  }, [partnerPages]);

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
      const count = row.children.length;
      if (!count) return;
      const next = (Math.round(row.scrollLeft / productStep()) + 1) % count;
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
        <EditableVideo
          section="home.hero"
          field="video"
          poster={hero.poster || undefined}
          className="hero-anim hero-zoom absolute inset-0 h-full w-full object-cover object-[70%_center]"
        />
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
                  <EditableText as="span" section="home.hero" field="titleLine1" className="hero-anim hero-rise inline-block" style={{ animationDelay: "0.35s" }} />
                </span>
                <span className="block">
                  <span className="hero-anim hero-rise relative inline-block" style={{ animationDelay: "0.47s" }}>
                    <EditableText as="span" section="home.hero" field="titleLine2" />
                    {hero.burst && (
                    <span
                      className="hero-anim hero-pop absolute -right-24 -top-6 h-20 w-20 rotate-[-14deg] sm:-right-24 sm:h-28 sm:w-28"
                      style={{ animationDelay: "0.95s" }}
                    >
                      <Burst label={hero.burst} />
                    </span>
                    )}
                  </span>
                </span>
              </h1>
              <EditableText as="p" section="home.hero" field="text" className="hero-anim hero-rise mt-7 max-w-lg text-lg font-medium leading-snug text-white/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] sm:text-xl" style={{ animationDelay: "0.66s" }} />
              {hero.buttonHref && (
              <EditableLink section="home.hero" labelField="buttonLabel" hrefField="buttonHref" className="hero-anim hero-rise mt-9 inline-flex items-center gap-3 rounded-lg bg-orange px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-cream transition-transform hover:scale-[1.03]">
                <ArrowRight />
              </EditableLink>
              )}
            </div>
          </div>

          {/* product card, bottom-right */}
          <aside className="hero-anim hero-slide absolute bottom-12 right-5 hidden w-[240px] rounded-[26px] bg-white p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] sm:block sm:bottom-16 sm:right-8 sm:w-[264px]" style={{ animationDelay: "0.62s" }}>
            <div className="relative aspect-square w-full overflow-hidden rounded-[18px]">
              {hero.cardImage && <EditableImage section="home.hero" field="cardImage" alt={hero.cardTitle} className="absolute inset-0 h-full w-full object-cover" />}
            </div>
            <EditableText as="h3" section="home.hero" field="cardTitle" className="mt-3.5 px-1 text-xl font-bold tracking-tight text-forest" />
            {hero.cardButtonHref && (
            <EditableLink section="home.hero" labelField="cardButtonLabel" hrefField="cardButtonHref" className="mt-3 flex items-center justify-between rounded-2xl bg-forest px-5 py-3 text-sm font-semibold text-cream transition-transform hover:scale-[1.02]">
              <ArrowRight />
            </EditableLink>
            )}
          </aside>
        </div>
      </section>

      {/* ============ WHITE SECTION — scrolls up and overlaps the hero ============ */}
      <section className="relative z-10 -mt-8 rounded-t-[44px] bg-white px-6 pb-16 pt-24 shadow-[0_-30px_60px_rgba(0,0,0,0.25)] sm:px-12 sm:pt-32 lg:px-16">
        <div className="mx-auto max-w-[1480px]">
          <p className="reveal mb-10 flex items-center gap-2 text-[13px] font-medium tracking-wide text-forest/50">
            <span className="text-orange">＋</span> <EditableText as="span" section="home.intro" field="eyebrow" />
          </p>
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_240px] lg:gap-16">
            <p
              ref={textRef}
              className="text-[clamp(1.4rem,3.1vw,2.45rem)] font-medium leading-[1.3] tracking-tight [text-align:justify]"
            >
              {editing
                ? intro.parts.map((part, i) => (
                    <span key={i}>
                      <EditableText as="span" section="home.intro" listField="parts" index={i} itemKey="text" />{" "}
                      {(part.accent || editing) && (
                        <>
                          <EditableText
                            as="span"
                            section="home.intro"
                            listField="parts"
                            index={i}
                            itemKey="accent"
                            className="font-semibold text-orange"
                          />{" "}
                        </>
                      )}
                    </span>
                  ))
                : ABOUT.map((w, i) => (
                    <span key={i} className={`rw${w.a ? " accent font-semibold" : ""}`}>
                      {w.t}{" "}
                    </span>
                  ))}
            </p>

            <div className="reveal flex flex-col gap-4 sm:flex-row lg:flex-col" style={{ transitionDelay: "0.1s" }}>
              {intro.button1Href && (
              <EditableLink section="home.intro" labelField="button1Label" hrefField="button1Href" className="rounded-xl bg-forest px-6 py-4 text-center text-sm font-semibold text-cream transition-transform hover:scale-[1.02] sm:flex-1 lg:flex-none" />
              )}
              {intro.button2Href && (
              <EditableLink section="home.intro" labelField="button2Label" hrefField="button2Href" className="rounded-xl bg-orange px-6 py-4 text-center text-sm font-semibold text-cream transition-transform hover:scale-[1.02] sm:flex-1 lg:flex-none" />
              )}
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
                <span className="h-2 w-2 rounded-[2px] bg-lime" /> <EditableText as="span" section="home.products" field="eyebrow" />
              </p>
              <EditableText as="h2" section="home.products" field="title" className="max-w-2xl text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.06] tracking-tight" />
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
                key={i}
                className="reveal group flex aspect-[4/5] w-[80vw] shrink-0 snap-start flex-col rounded-[28px] bg-white p-6 text-forest sm:w-[360px]"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <EditableText
                  as="h3"
                  section="home.products"
                  listField="items"
                  index={i}
                  itemKey="name"
                  className="block text-center text-[clamp(1.35rem,2vw,1.8rem)] uppercase leading-[1.05] tracking-tight"
                  style={{ fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 }}
                />
                <div className="relative my-5 flex-1 overflow-hidden rounded-[20px] bg-[#f5f4ef]">
                  {p.image && <EditableImage section="home.products" listField="items" index={i} itemKey="image" alt={p.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                </div>
                {p.href && (
                <a
                  href={p.href}
                  className="rounded-lg bg-orange px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.08em] text-cream transition-transform hover:scale-[1.02]"
                >
                  <EditableText as="span" section="home.products" field="buttonLabel" />
                </a>
                )}
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
          {editing ? (
            <EditableImage section="home.photo" field="image" alt={photo.alt} className="block h-auto w-full" />
          ) : (
            <picture>
              <source
                media="(max-width: 640px) and (orientation: portrait)"
                srcSet={photo.imagePortrait || photo.image}
              />
              <img src={photo.image} alt={photo.alt} className="block h-auto w-full" />
            </picture>
          )}

          {/* sticker labels */}
          {photo.stickers.map((st, i) =>
            st.image ? (
              <img key={i} src={st.image} alt={st.alt} className={STICKER_CLASSES[i % STICKER_CLASSES.length]} />
            ) : null
          )}
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
                {partners.title}
              </h2>
            </div>

            {/* partner badges */}
            {partners.badges.map((badge, i) => {
              const b = BADGE_STYLES[i % BADGE_STYLES.length];
              return (
              <div
                key={i}
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
                  {badge.logo && (
                  <img
                    src={badge.logo}
                    alt={badge.name}
                    className="h-full w-full object-contain"
                    style={{ padding: b.pad }}
                  />
                  )}
                </div>
              </div>
              );
            })}
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
              poster={partners.poster || undefined}
            >
              <source src={partners.video} type="video/mp4" />
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
                  {partners.listTitle}
                </h2>
                {/* paginated list — pages of 4; padded to 4 slots so height (and the
                    button below) stays fixed between pages */}
                {PARTNERS.length > 0 && (
                <ul key={partnerPage} className="border-t border-white/15">
                  {Array.from({ length: PARTNERS_PER_PAGE }).map((_, i) => {
                    const p = PARTNERS[partnerPage * PARTNERS_PER_PAGE + i];
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
                        key={i}
                        className="partner-row border-b border-white/15"
                        style={{ animationDelay: `${i * 80}ms` }}
                      >
                        <a
                          href={partners.listHref || undefined}
                          className="group flex min-h-[clamp(58px,7vw,80px)] items-center gap-4 sm:gap-6"
                        >
                          <span className="w-7 shrink-0 text-sm font-semibold tabular-nums text-white/45">
                            {String(partnerPage * PARTNERS_PER_PAGE + i + 1).padStart(2, "0")}
                          </span>
                          <span className="flex-1 text-[clamp(1.15rem,2.3vw,1.8rem)] font-bold tracking-tight text-white transition-colors group-hover:text-lime">
                            {p.name}
                          </span>
                          {p.desc && (
                          <span className="hidden whitespace-nowrap rounded-full bg-lime px-3.5 py-1.5 text-xs font-semibold text-forest md:block">
                            {p.desc}
                          </span>
                          )}
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-light-blue text-forest transition-transform group-hover:translate-x-1">
                            <ArrowRight />
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
                )}

                {partners.buttonHref && (
                <a
                  href={partners.buttonHref}
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange px-7 py-4 text-sm font-bold uppercase tracking-[0.08em] text-cream transition-transform hover:scale-[1.03] sm:mt-8"
                >
                  {partners.buttonLabel} <ArrowRight />
                </a>
                )}
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
          <EditableText
            as="h2"
            section="home.contact"
            field="title"
            className="reveal block text-center text-[clamp(2.6rem,8vw,6rem)] uppercase leading-[0.95] tracking-[0.01em]"
            style={{ fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 }}
          />

          <div className="reveal mt-12" style={{ transitionDelay: "0.12s" }}>
            <ContactFields source="home" />
          </div>
        </div>
      </section>
      </div>

      {/* footer */}
      <PageFooter />
    </main>
  );
}

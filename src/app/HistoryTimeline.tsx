"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const OSWALD = { fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 } as const;

// A 10-point star used to mask the image next to the title.
const STAR_10 = (() => {
  const pts: string[] = [];
  const spikes = 10, outer = 50, inner = 37, c = 50;
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / spikes) * i - Math.PI / 2;
    pts.push(`${(c + r * Math.cos(a)).toFixed(2)}% ${(c + r * Math.sin(a)).toFixed(2)}%`);
  }
  return `polygon(${pts.join(",")})`;
})();

type Entry = { year: string; tag: string; text: string };

const ENTRIES: Entry[] = [
  {
    year: "1998",
    tag: "Het begin",
    text: "Kroketco start als klein familiebedrijf: vers gedraaide kroketten, met de hand gepaneerd.",
  },
  {
    year: "2005",
    tag: "Eigen keuken",
    text: "We openen onze eigen ambachtelijke keuken, zodat elke kroket met dezelfde zorg gemaakt blijft.",
  },
  {
    year: "2014",
    tag: "Nieuwe smaken",
    text: "Van kaas tot garnaal: het assortiment groeit met zorgvuldig gekozen, streekgebonden recepten.",
  },
  {
    year: "2020",
    tag: "Heel België",
    text: "Kroketco vindt zijn weg naar de betere traiteur en de horeca in heel het land.",
  },
  {
    year: "2026",
    tag: "Vandaag",
    text: "Nog altijd ambachtelijk, nog altijd goudbruin gebakken — elke hap een feest.",
  },
];

const VISIBLE = 50;  // hide items past this angle from the front

export default function HistoryTimeline() {
  const n = ENTRIES.length;
  const MAX = n - 1; // last date

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1200, h: 560 });
  const [pos, setPos] = useState(0); // fractional front position (index into ENTRIES)

  // angular gap between two years — wider on smaller screens (mobile most),
  // original tighter spacing on desktop.
  const step = size.w < 640 ? 34 : size.w < 1024 ? 28 : 13;

  // Big, shallow radius → a gentle arc rather than a tight wheel ("not perfect round").
  const R = Math.max(560, size.w * 1.45);
  const fs = Math.min(184, Math.max(72, size.w * 0.125)); // matches the year clamp()
  const yearMid = fs * 0.44;                             // visual centre of the digits
  const arcTopY = Math.round(size.h * 0.32);            // y of the FRONT year's centre
  const cx = size.w / 2;

  const measure = () => {
    const el = stageRef.current;
    if (!el) return;
    setSize({ w: el.clientWidth, h: el.clientHeight });
  };
  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // The wheel turns as you scroll through the (tall) section while the stage is pinned.
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = sectionRef.current;
        if (!el) return;
        const total = el.offsetHeight - window.innerHeight; // pinned scroll distance
        const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), Math.max(total, 1));
        const p = total > 0 ? scrolled / total : 0;
        setPos(p * MAX);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [MAX]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 rounded-t-none bg-forest text-cream shadow-[0_-30px_60px_rgba(0,0,0,0.35)] lg:rounded-t-[44px]"
      style={{ height: `${n * 60}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-14">
        <div className="mx-auto flex w-full max-w-[1480px] items-center justify-between gap-8 px-6 sm:px-12 lg:px-16">
          <div>
            <p className="mb-5 flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.28em] text-lime">
              <span className="h-2 w-2 rounded-[2px] bg-lime" /> Ons verhaal
            </p>
            <h2
              className="max-w-3xl text-[clamp(2.2rem,6vw,4.6rem)] uppercase leading-[0.95] tracking-[0.01em] text-lime"
              style={OSWALD}
            >
              Kroketco door de jaren
            </h2>
          </div>

          {/* 10-point star mask holding an image, next to the title */}
          <div className="hidden shrink-0 sm:block" style={{ transform: "rotate(-8deg)" }} aria-hidden>
            <img
              src="/ugc/ugc-3.png"
              alt=""
              className="h-[clamp(110px,13vw,180px)] w-[clamp(110px,13vw,180px)] object-cover"
              style={{ clipPath: STAR_10 }}
            />
          </div>
        </div>

        <div
          ref={stageRef}
          className="relative mt-8 h-[clamp(420px,48vw,620px)] w-full"
        >
          {/* dashed arc rail — the top of a very large circle, passing through the numbers */}
          <svg className="pointer-events-none absolute inset-0" width={size.w} height={size.h} aria-hidden>
            <circle
              cx={cx}
              cy={arcTopY + R}
              r={R}
              fill="none"
              stroke="rgba(255,243,226,0.45)"
              strokeWidth={2}
              strokeDasharray="1 13"
              strokeLinecap="round"
            />
          </svg>

          {ENTRIES.map((it, i) => {
            const aDeg = (i - pos) * step;
            const dist = Math.abs(aDeg);
            if (dist > VISIBLE) return null;
            const aRad = (aDeg * Math.PI) / 180;
            const px = cx + R * Math.sin(aRad);
            const py = arcTopY + R * (1 - Math.cos(aRad));
            const scale = Math.max(0.62, 1 - dist / 150);
            const opacity = Math.max(0.16, 1 - dist / VISIBLE);
            const isFront = Math.round(pos) === i;
            return (
              <article
                key={i}
                aria-hidden={!isFront}
                className="absolute flex w-[clamp(280px,34vw,460px)] flex-col items-center text-center"
                style={{
                  left: px,
                  top: py - yearMid,
                  transformOrigin: `50% ${yearMid}px`,
                  transform: `translateX(-50%) rotate(${aDeg}deg) scale(${scale})`,
                  opacity,
                  willChange: "transform, opacity",
                  zIndex: Math.round(100 - dist),
                }}
              >
                <span
                  className="pointer-events-none leading-none text-cream"
                  style={{ ...OSWALD, fontSize: "clamp(72px, 12.5vw, 184px)" }}
                >
                  {it.year}
                </span>
                <span className="mt-3 whitespace-nowrap rounded-full bg-lime px-6 py-2.5 text-[12px] font-bold uppercase tracking-[0.08em] text-forest sm:mt-5 sm:text-[14px]">
                  {"•  "}{it.tag}{"  •"}
                </span>
                <p className="mt-4 max-w-[30ch] text-[15px] font-medium leading-relaxed text-cream/90 sm:mt-5 sm:text-[16px]">
                  {it.text}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-6 flex justify-center lg:mt-10">
          <a
            href="/over-ons"
            className="inline-flex items-center gap-2 rounded-lg bg-lime px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-forest transition-transform hover:scale-[1.03]"
          >
            Over ons
          </a>
        </div>
      </div>
    </section>
  );
}
